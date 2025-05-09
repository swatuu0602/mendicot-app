import { create } from 'zustand';
import { MendikotAI } from './MendikotAI';
import { initializeDeck } from '../utils/cardUtils';
import { isValidMove, canRevealTrump, canPlaceTrumpCard } from '../utils/gameRules';
import { checkRoundEnd, checkGameEnd, getNextGameState, calculateRoundPoints, RoundResult } from '../utils/gameStateManager';

// Card Types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // For comparison (A=14, K=13, etc.)
  imageUrl: string;
}

export type PlayerPosition = 'N' | 'E' | 'S' | 'W';
export type Team = 'NS' | 'EW';

// Add these types after the existing type definitions
interface PlayedCard {
  card: Card;
  player: PlayerPosition;
}

interface TrickResult {
  winningPlayer: PlayerPosition;
  capturedTens: number;
}

// Add this function before the useGameStore creation
function evaluateTrick(
  playedCards: PlayedCard[],
  trumpStatus: 'hidden' | { suit: Suit; revealedBy: PlayerPosition }
): TrickResult {
  if (playedCards.length === 0) {
    throw new Error('No cards played in trick');
  }

  const ledSuit = playedCards[0].card.suit;
  let winningCard = playedCards[0];
  let capturedTens = 0;

  // Count tens in the trick
  playedCards.forEach(({ card }) => {
    if (card.rank === '10') {
      capturedTens++;
    }
  });

  // If trump is revealed, trump cards take precedence
  if (trumpStatus !== 'hidden') {
    const trumpSuit = trumpStatus.suit;
    
    // Find highest trump card if any
    const trumpCards = playedCards.filter(({ card }) => card.suit === trumpSuit);
    if (trumpCards.length > 0) {
      winningCard = trumpCards.reduce((highest, current) => 
        current.card.value > highest.card.value ? current : highest
      );
    } else {
      // No trump cards, highest of led suit wins
      winningCard = playedCards
        .filter(({ card }) => card.suit === ledSuit)
        .reduce((highest, current) => 
          current.card.value > highest.card.value ? current : highest
        );
    }
  } else {
    // No trump revealed, highest of led suit wins
    winningCard = playedCards
      .filter(({ card }) => card.suit === ledSuit)
      .reduce((highest, current) => 
        current.card.value > highest.card.value ? current : highest
      );
  }

  return {
    winningPlayer: winningCard.player,
    capturedTens
  };
}

export type GameStatus = 
  | 'initialization'  // Setting up players and teams
  | 'dealing'        // Distributing cards
  | 'trump_placement' // Waiting for trump card placement
  | 'pre_reveal'     // Normal play before trump reveal
  | 'trump_reveal'   // Trump card is being revealed
  | 'post_reveal'    // Play with trump active
  | 'round_end'      // Round completed
  | 'game_end';      // Game completed

// Update GameState interface
export interface GameState {
  // Core game state
  deck: Card[];
  hands: Record<PlayerPosition, Card[]>;
  currentPlayer: PlayerPosition;
  dealer: PlayerPosition;
  gameStatus: GameStatus;
  
  // Trump state
  trumpCard?: {
    suit: Suit;
    status: 'hidden' | 'revealed';
    owner: PlayerPosition;
    revealTime?: number; // Timestamp when revealed
  };
  
  // Trick state
  currentTrick: {
    cards: Card[];
    leader: PlayerPosition;
    ledSuit?: Suit;
  };
  
  // Scoring
  capturedTens: {
    [key in Team]: number;
  };
  tricksWon: {
    [key in Team]: number;
  };
  
  // Team configuration
  teams: {
    NS: PlayerPosition[];
    EW: PlayerPosition[];
  };
  
  // AI configuration
  aiPlayers: {
    [key in PlayerPosition]?: {
      difficulty: 'novice' | 'expert';
      ai: MendikotAI;
    };
  };
  
  // Add new properties for game state
  roundsWon: {
    [key in Team]: number;
  };
  currentRound: number;
  lastRoundResult?: RoundResult;
  
  // Actions
  initializeGame: () => void;
  dealCards: () => void;
  placeTrumpCard: (card: Card) => void;
  playCard: (card: Card) => void;
  revealTrump: () => void;
  evaluateCurrentTrick: () => void;
  updateTeamScores: (tensCaptured: number, winningTeam: Team) => void;
  checkRoundEnd: () => {
    winner: Team | null;
    isMendikot: boolean;
    isWhitewash: boolean;
  };
  startNewRound: () => void;
  drawCard: () => void;
  endTurn: () => void;
}

// Card value mapping
const rankValues: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  '10': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

// Create game store with updated state machine
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  deck: [],
  hands: {
    'N': [], 'E': [], 'S': [], 'W': []
  },
  currentPlayer: 'E',
  dealer: 'N',
  gameStatus: 'initialization',
  currentTrick: {
    cards: [],
    leader: 'E'
  },
  capturedTens: {
    NS: 0,
    EW: 0
  },
  tricksWon: {
    NS: 0,
    EW: 0
  },
  teams: {
    NS: ['N', 'S'],
    EW: ['E', 'W']
  },
  aiPlayers: {},
  roundsWon: {
    NS: 0,
    EW: 0
  },
  currentRound: 1,
  lastRoundResult: undefined,

  // Initialize game
  initializeGame: () => {
    // Initialize and shuffle the deck
    const deck = initializeDeck();
    
    // Randomize dealer
    const positions: PlayerPosition[] = ['N', 'E', 'S', 'W'];
    const randomDealer = positions[Math.floor(Math.random() * 4)];
    
    set({
      deck,
      dealer: randomDealer,
      currentPlayer: positions[(positions.indexOf(randomDealer) + 1) % 4],
      gameStatus: 'dealing'
    });
    
    get().dealCards();
  },

  // Deal cards anticlockwise
  dealCards: () => {
    const { deck } = get();
    const hands: Record<PlayerPosition, Card[]> = {
      'N': [], 'E': [], 'S': [], 'W': []
    };

    // First 5 cards
    for (let i = 0; i < 5; i++) {
      hands['E'].push(deck.pop()!);
      hands['S'].push(deck.pop()!);
      hands['W'].push(deck.pop()!);
      hands['N'].push(deck.pop()!);
    }

    // Two batches of 4 cards
    for (let batch = 0; batch < 2; batch++) {
      for (let i = 0; i < 4; i++) {
        hands['E'].push(deck.pop()!);
        hands['S'].push(deck.pop()!);
        hands['W'].push(deck.pop()!);
        hands['N'].push(deck.pop()!);
      }
    }

    set({ 
      hands,
      gameStatus: 'trump_placement'
    });
  },

  // Place trump card
  placeTrumpCard: (card: Card) => {
    const state = get();
    const { currentPlayer, currentTrick, gameStatus } = state;

    // Validate trump placement
    const validationContext = {
      currentPlayer,
      gameStatus,
      hand: state.hands[currentPlayer],
      trickState: {
        cards: currentTrick.cards,
        ledSuit: currentTrick.ledSuit,
        trumpSuit: undefined,
        trumpRevealed: false,
        leader: currentTrick.leader
      }
    };

    if (!canPlaceTrumpCard(validationContext)) {
      throw new Error('Invalid move: Cannot place trump card in current game state');
    }

    set({
      trumpCard: {
        suit: card.suit,
        status: 'hidden',
        owner: currentPlayer
      },
      gameStatus: 'pre_reveal'
    });
  },

  // Play a card
  playCard: (card: Card) => {
    const state = get();
    const { currentPlayer, currentTrick, hands, gameStatus, trumpCard } = state;
    
    // Validate the move
    const validationContext = {
      currentPlayer,
      gameStatus,
      hand: hands[currentPlayer],
      trickState: {
        cards: currentTrick.cards,
        ledSuit: currentTrick.ledSuit,
        trumpSuit: trumpCard?.suit,
        trumpRevealed: trumpCard?.status === 'revealed',
        leader: currentTrick.leader
      }
    };

    if (!isValidMove(card, validationContext)) {
      throw new Error('Invalid move: Card cannot be played in current game state');
    }

    // Remove card from player's hand
    const updatedHands = { ...hands };
    updatedHands[currentPlayer] = hands[currentPlayer].filter(
      c => !(c.suit === card.suit && c.rank === card.rank)
    );

    // Update current trick
    const updatedTrick = {
      ...currentTrick,
      cards: [...currentTrick.cards, card],
      ledSuit: currentTrick.cards.length === 0 ? card.suit : currentTrick.ledSuit
    };

    // Check if trump should be revealed
    const shouldRevealTrump = canRevealTrump(validationContext);

    set({
      hands: updatedHands,
      currentTrick: updatedTrick,
      gameStatus: shouldRevealTrump ? 'trump_reveal' : gameStatus
    });

    // If trick is complete, evaluate it
    if (updatedTrick.cards.length === 4) {
      get().evaluateCurrentTrick();
    }
  },

  // Reveal trump card
  revealTrump: () => {
    const state = get();
    const { trumpCard, hands } = state;
    
    if (trumpCard && trumpCard.status === 'hidden') {
      // Create a copy of the trump card to return to owner's hand
      const trumpCardToReturn = {
        id: `trump_${trumpCard.suit}`,
        suit: trumpCard.suit,
        rank: 'A', // The actual rank doesn't matter as it's just for display
        value: 14,
        imageUrl: `/assets/cards/trump_${trumpCard.suit}.png`
      };

      // Update hands to return trump card to owner
      const updatedHands = {
        ...hands,
        [trumpCard.owner]: [...hands[trumpCard.owner], trumpCardToReturn]
      };

      set({
        trumpCard: {
          ...trumpCard,
          status: 'revealed',
          revealTime: Date.now()
        },
        hands: updatedHands,
        gameStatus: 'post_reveal'
      });
    }
  },

  // Check round end conditions
  checkRoundEnd: () => {
    const state = get();
    const { capturedTens, tricksWon } = state;
    
    const roundResult = checkRoundEnd(capturedTens, tricksWon);
    
    if (roundResult.winner) {
      // Update rounds won
      const points = calculateRoundPoints(roundResult);
      const updatedRoundsWon = {
        ...state.roundsWon,
        [roundResult.winner]: state.roundsWon[roundResult.winner] + points
      };

      // Check if game is over
      const gameResult = checkGameEnd(updatedRoundsWon);

      set({
        lastRoundResult: roundResult,
        roundsWon: updatedRoundsWon,
        gameStatus: gameResult.isGameOver ? 'game_end' : 'round_end'
      });
    }

    return roundResult;
  },

  // Start new round
  startNewRound: () => {
    const state = get();
    const { dealer, teams, lastRoundResult } = state;
    
    if (!lastRoundResult) {
      throw new Error('Cannot start new round without previous round result');
    }

    // Determine next dealer based on round result
    let nextDealer: PlayerPosition;
    if (lastRoundResult.isWhitewash) {
      // If whitewash, dealer's partner deals next
      const winningTeam = lastRoundResult.winner as Team;
      nextDealer = teams[winningTeam].find(p => p !== dealer) as PlayerPosition;
    } else if (lastRoundResult.winner && teams[lastRoundResult.winner].includes(dealer)) {
      // If dealer's team won, same dealer continues
      nextDealer = dealer;
    } else {
      // Otherwise, deal passes right
      const positions: PlayerPosition[] = ['N', 'E', 'S', 'W'];
      nextDealer = positions[(positions.indexOf(dealer) + 1) % 4];
    }

    // Initialize new round
    const deck = initializeDeck();
    
    set({
      deck,
      dealer: nextDealer,
      currentPlayer: ['N', 'E', 'S', 'W'][(['N', 'E', 'S', 'W'].indexOf(nextDealer) + 1) % 4] as PlayerPosition,
      gameStatus: 'dealing',
      currentRound: state.currentRound + 1,
      lastRoundResult: undefined,
      capturedTens: { NS: 0, EW: 0 },
      tricksWon: { NS: 0, EW: 0 },
      currentTrick: {
        cards: [],
        leader: ['N', 'E', 'S', 'W'][(['N', 'E', 'S', 'W'].indexOf(nextDealer) + 1) % 4] as PlayerPosition
      }
    });

    get().dealCards();
  },

  // Update the evaluateCurrentTrick function
  evaluateCurrentTrick: () => {
    const state = get();
    const { currentTrick, trumpCard } = state;
    
    if (currentTrick.cards.length === 4) {
      const result = evaluateTrick(
        currentTrick.cards.map((card, index) => ({
          card,
          player: ['N', 'E', 'S', 'W'][index] as PlayerPosition
        })),
        trumpCard ? { suit: trumpCard.suit, revealedBy: trumpCard.owner } : 'hidden'
      );

      // Update team scores
      const winningTeam = ['N', 'S'].includes(result.winningPlayer) ? 'NS' : 'EW';
      
      set(state => ({
        tricksWon: {
          ...state.tricksWon,
          [winningTeam]: state.tricksWon[winningTeam] + 1
        },
        currentTrick: {
          cards: [],
          leader: result.winningPlayer
        }
      }));

      get().updateTeamScores(result.capturedTens, winningTeam);
      set({ currentPlayer: result.winningPlayer });
    }
  },

  // Update the updateTeamScores function
  updateTeamScores: (tensCaptured: number, winningTeam: Team) => {
    set(state => ({
      capturedTens: {
        ...state.capturedTens,
        [winningTeam]: state.capturedTens[winningTeam] + tensCaptured
      }
    }));
  },

  // Initialize AI players
  initializeAIPlayers: (positions: PlayerPosition[], difficulty: 'novice' | 'expert' = 'novice') => {
    const aiPlayers: GameState['aiPlayers'] = {};
    positions.forEach(position => {
      aiPlayers[position] = {
        difficulty,
        ai: new MendikotAI(difficulty, position)
      };
    });
    set({ aiPlayers });
  },

  // Make AI move
  makeAIMove: () => {
    const state = get();
    const { currentPlayer, hands, currentTrick, trumpCard, aiPlayers } = state;
    
    const aiPlayer = aiPlayers[currentPlayer];
    if (!aiPlayer) return;

    const hand = hands[currentPlayer];
    const trickState = {
      cards: currentTrick.cards,
      ledSuit: currentTrick.cards[0]?.suit || null,
      trumpSuit: trumpCard?.suit || null,
      trumpRevealed: trumpCard?.status === 'revealed'
    };

    const selectedCard = aiPlayer.ai.decideMove(hand, trickState);
    get().playCard(selectedCard);
  },

  // Add these methods
  drawCard: () => {
    const { deck, currentPlayer, hands } = get();
    if (deck.length > 0) {
      const card = deck.pop()!;
      set({
        hands: {
          ...hands,
          [currentPlayer]: [...hands[currentPlayer], card]
        }
      });
    }
  },

  endTurn: () => {
    const { currentPlayer } = get();
    const nextPlayer = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    }[currentPlayer] as PlayerPosition;
    
    set({ currentPlayer: nextPlayer });
  }
})); 