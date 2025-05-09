import { Team, GameStatus } from '../engine/GameEngine';

export interface RoundResult {
  winner: Team | null;
  isMendikot: boolean;
  isWhitewash: boolean;
  capturedTens: {
    [key in Team]: number;
  };
  tricksWon: {
    [key in Team]: number;
  };
}

export interface GameResult {
  winner: Team | null;
  roundsWon: {
    [key in Team]: number;
  };
  isGameOver: boolean;
}

// Constants for game configuration
const ROUNDS_TO_WIN = 3;
const TRICKS_PER_ROUND = 13;
const TOTAL_TENS = 4;

// Check if a round has ended
export const checkRoundEnd = (
  capturedTens: { [key in Team]: number },
  tricksWon: { [key in Team]: number }
): RoundResult => {
  // Check for Mendikot (all 4 tens)
  if (capturedTens.NS === TOTAL_TENS || capturedTens.EW === TOTAL_TENS) {
    return {
      winner: capturedTens.NS === TOTAL_TENS ? 'NS' : 'EW',
      isMendikot: true,
      isWhitewash: false,
      capturedTens,
      tricksWon
    };
  }

  // Check for Whitewash (all 13 tricks)
  if (tricksWon.NS === TRICKS_PER_ROUND || tricksWon.EW === TRICKS_PER_ROUND) {
    return {
      winner: tricksWon.NS === TRICKS_PER_ROUND ? 'NS' : 'EW',
      isMendikot: false,
      isWhitewash: true,
      capturedTens,
      tricksWon
    };
  }

  // Normal win (3 or more tens)
  if (capturedTens.NS >= 3 || capturedTens.EW >= 3) {
    return {
      winner: capturedTens.NS >= 3 ? 'NS' : 'EW',
      isMendikot: false,
      isWhitewash: false,
      capturedTens,
      tricksWon
    };
  }

  // Tiebreaker (2 tens each, check tricks)
  if (capturedTens.NS === 2 && capturedTens.EW === 2) {
    return {
      winner: tricksWon.NS >= 7 ? 'NS' : 'EW',
      isMendikot: false,
      isWhitewash: false,
      capturedTens,
      tricksWon
    };
  }

  return {
    winner: null,
    isMendikot: false,
    isWhitewash: false,
    capturedTens,
    tricksWon
  };
};

// Check if the game has ended
export const checkGameEnd = (
  roundsWon: { [key in Team]: number }
): GameResult => {
  const isGameOver = roundsWon.NS >= ROUNDS_TO_WIN || roundsWon.EW >= ROUNDS_TO_WIN;
  const winner = isGameOver
    ? (roundsWon.NS >= ROUNDS_TO_WIN ? 'NS' : 'EW')
    : null;

  return {
    winner,
    roundsWon,
    isGameOver
  };
};

// Get the next game state based on round result
export const getNextGameState = (
  currentStatus: GameStatus,
  roundResult: RoundResult
): GameStatus => {
  if (roundResult.winner) {
    return 'round_end';
  }
  return currentStatus;
};

// Calculate points for a round
export const calculateRoundPoints = (roundResult: RoundResult): number => {
  if (roundResult.isMendikot) return 4;
  if (roundResult.isWhitewash) return 3;
  return 1;
}; 