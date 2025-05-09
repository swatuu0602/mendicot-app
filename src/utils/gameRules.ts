import { Card, Suit, PlayerPosition, GameStatus } from '../engine/GameEngine';

interface TrickState {
  cards: Card[];
  ledSuit?: Suit;
  trumpSuit?: Suit;
  trumpRevealed: boolean;
  leader: PlayerPosition;
}

interface ValidationContext {
  currentPlayer: PlayerPosition;
  gameStatus: GameStatus;
  hand: Card[];
  trickState: TrickState;
}

// Validate if a move is legal according to Mendikot rules
export const isValidMove = (card: Card, context: ValidationContext): boolean => {
  const { gameStatus, hand, trickState } = context;
  const { ledSuit, trumpSuit, trumpRevealed } = trickState;

  // Can't play if game is not in play state
  if (!['pre_reveal', 'post_reveal'].includes(gameStatus)) {
    return false;
  }

  // If leading the trick, any card is valid
  if (!ledSuit) {
    return true;
  }

  // Must follow suit if possible
  const hasLedSuit = hand.some(c => c.suit === ledSuit);
  if (hasLedSuit) {
    return card.suit === ledSuit;
  }

  // Cannot follow suit
  if (gameStatus === 'post_reveal') {
    // Trump is revealed - can play any card
    return true;
  } else {
    // Trump not revealed - cannot play trump card
    return card.suit !== trumpSuit;
  }
};

// Validate if trump can be revealed
export const canRevealTrump = (context: ValidationContext): boolean => {
  const { gameStatus, hand, trickState } = context;
  const { ledSuit } = trickState;

  return (
    gameStatus === 'pre_reveal' &&
    ledSuit !== undefined &&
    !hand.some(card => card.suit === ledSuit)
  );
};

// Validate if a player can place trump card
export const canPlaceTrumpCard = (context: ValidationContext): boolean => {
  const { gameStatus, currentPlayer, trickState } = context;
  
  return (
    gameStatus === 'trump_placement' &&
    currentPlayer === trickState.leader
  );
};

// Get valid moves for a player
export const getValidMoves = (context: ValidationContext): Card[] => {
  const { hand } = context;
  return hand.filter(card => isValidMove(card, context));
}; 