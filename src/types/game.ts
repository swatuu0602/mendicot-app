export type PlayerPosition = 'N' | 'E' | 'S' | 'W';
export type Team = 'NS' | 'EW';
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type GameStatus = 'waiting' | 'playing' | 'finished';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  position: PlayerPosition;
  team: Team;
  hand: Card[];
  isAI: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface TrickState {
  cards: Card[];
  leader: PlayerPosition | null;
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentPlayer: PlayerPosition;
  dealer: PlayerPosition;
  trumpSuit: Suit | null;
  trumpRevealed: boolean;
  trumpOwner: PlayerPosition | null;
  currentTrick: TrickState;
  capturedTens: {
    NS: number;
    EW: number;
  };
  tricksWon: {
    NS: number;
    EW: number;
  };
  roundsWon: {
    NS: number;
    EW: number;
  };
  currentRound: number;
  status: GameStatus;
}

export type GameAction =
  | { type: 'NEW_GAME' }
  | { type: 'PLAY_CARD'; payload: Card }
  | { type: 'COMPLETE_TRICK'; payload: { team: Team; tens: number } }
  | { type: 'SET_TRUMP_SUIT'; payload: Suit }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus };

export const initialGameState: GameState = {
  gameId: '',
  players: [
    { position: 'N', team: 'NS', hand: [], isAI: true, aiDifficulty: 'medium' },
    { position: 'E', team: 'EW', hand: [], isAI: true, aiDifficulty: 'medium' },
    { position: 'S', team: 'NS', hand: [], isAI: false },
    { position: 'W', team: 'EW', hand: [], isAI: true, aiDifficulty: 'medium' }
  ],
  currentPlayer: 'S',
  dealer: 'W',
  trumpSuit: null,
  trumpRevealed: false,
  trumpOwner: null,
  currentTrick: {
    cards: [],
    leader: null
  },
  capturedTens: {
    NS: 0,
    EW: 0
  },
  tricksWon: {
    NS: 0,
    EW: 0
  },
  roundsWon: {
    NS: 0,
    EW: 0
  },
  currentRound: 1,
  status: 'waiting'
}; 