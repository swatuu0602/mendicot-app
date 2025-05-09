import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, initialGameState } from '../types/game';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      return {
        ...initialGameState,
        gameId: Math.random().toString(36).substring(7),
        status: 'playing'
      };
    case 'PLAY_CARD':
      return {
        ...state,
        currentTrick: {
          ...state.currentTrick,
          cards: [...state.currentTrick.cards, action.payload],
          leader: state.currentTrick.leader || state.currentPlayer
        }
      };
    case 'COMPLETE_TRICK':
      return {
        ...state,
        currentTrick: {
          cards: [],
          leader: null
        },
        tricksWon: {
          ...state.tricksWon,
          [action.payload.team]: state.tricksWon[action.payload.team] + 1
        },
        capturedTens: {
          ...state.capturedTens,
          [action.payload.team]: state.capturedTens[action.payload.team] + action.payload.tens
        }
      };
    case 'SET_TRUMP_SUIT':
      return {
        ...state,
        trumpSuit: action.payload,
        trumpRevealed: true
      };
    case 'SET_GAME_STATUS':
      return {
        ...state,
        status: action.payload
      };
    default:
      return state;
  }
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    status: 'playing',
    gameId: Math.random().toString(36).substring(7)
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 