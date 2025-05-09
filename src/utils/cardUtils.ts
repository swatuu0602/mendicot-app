import { Card, Suit, Rank } from '../engine/GameEngine';

// Card value mapping
const rankValues: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  '10': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

// Generate a unique ID for each card
const generateCardId = (suit: Suit, rank: Rank): string => {
  return `${suit}_${rank}`;
};

// Generate image URL for a card
const getCardImageUrl = (suit: Suit, rank: Rank): string => {
  // You can replace this with your actual card image URL pattern
  return `/assets/cards/${rank.toLowerCase()}_of_${suit}.png`;
};

// Create a new deck of cards
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: generateCardId(suit, rank),
        suit,
        rank,
        value: rankValues[rank],
        imageUrl: getCardImageUrl(suit, rank)
      });
    }
  }
  
  return deck;
};

// Fisher-Yates shuffle algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Initialize a new shuffled deck
export const initializeDeck = (): Card[] => {
  const deck = createDeck();
  return shuffleDeck(deck);
}; 