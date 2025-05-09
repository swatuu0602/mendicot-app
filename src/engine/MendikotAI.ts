import { Card, PlayerPosition, Suit } from './GameEngine';

export type AIDifficulty = 'novice' | 'expert';

interface TrickState {
  cards: Card[];
  ledSuit: Suit | null;
  trumpSuit: Suit | null;
  trumpRevealed: boolean;
}

export class MendikotAI {
  private difficulty: AIDifficulty;
  private playerPosition: PlayerPosition;

  constructor(difficulty: AIDifficulty, playerPosition: PlayerPosition) {
    this.difficulty = difficulty;
    this.playerPosition = playerPosition;
  }

  decideMove(hand: Card[], trickState: TrickState): Card {
    if (this.difficulty === 'novice') {
      return this.makeNoviceMove(hand, trickState);
    }
    // Expert AI will be implemented later
    throw new Error('Expert AI not implemented yet');
  }

  private makeNoviceMove(hand: Card[], trickState: TrickState): Card {
    const { ledSuit, trumpSuit, trumpRevealed } = trickState;
    
    // If leading the trick
    if (!ledSuit) {
      // Randomly select a card from hand
      return hand[Math.floor(Math.random() * hand.length)];
    }

    // If not leading, must follow suit if possible
    const cardsOfLedSuit = hand.filter(card => card.suit === ledSuit);
    
    if (cardsOfLedSuit.length > 0) {
      // Must follow suit - randomly select from cards of led suit
      return cardsOfLedSuit[Math.floor(Math.random() * cardsOfLedSuit.length)];
    }

    // Cannot follow suit
    if (trumpRevealed && trumpSuit) {
      // Trump is revealed - can play any card
      return hand[Math.floor(Math.random() * hand.length)];
    } else {
      // Trump not revealed - must play a non-trump card
      const nonTrumpCards = hand.filter(card => card.suit !== trumpSuit);
      return nonTrumpCards[Math.floor(Math.random() * nonTrumpCards.length)];
    }
  }

  // Helper method to check if a move is valid according to Mendikot rules
  private isValidMove(card: Card, hand: Card[], trickState: TrickState): boolean {
    const { ledSuit, trumpSuit, trumpRevealed } = trickState;

    // If leading, any card is valid
    if (!ledSuit) {
      return true;
    }

    // Must follow suit if possible
    const hasLedSuit = hand.some(c => c.suit === ledSuit);
    if (hasLedSuit) {
      return card.suit === ledSuit;
    }

    // Cannot follow suit
    if (trumpRevealed) {
      // Trump is revealed - can play any card
      return true;
    } else {
      // Trump not revealed - cannot play trump card
      return card.suit !== trumpSuit;
    }
  }
} 