import { useGameStore, GameState } from '../engine/GameEngine';

export interface GameEngineState {
  gameState: GameState;
  currentPlayer: GameState['currentPlayer'];
  playCard: GameState['playCard'];
  drawCard: GameState['drawCard'];
  endTurn: GameState['endTurn'];
}

export const useGameEngine = (): GameEngineState => {
  const gameState = useGameStore();
  return {
    gameState,
    currentPlayer: gameState.currentPlayer,
    playCard: gameState.playCard,
    drawCard: gameState.drawCard,
    endTurn: gameState.endTurn
  };
};

// Critical sync events to implement:
export const getSyncPoints = (gameId: string) => ({
  GAME_STATE: `games:id=eq.${gameId}`,
  PLAYER_ACTIONS: `players:game_id=eq.${gameId}`,
  TRICK_RESULTS: `tricks:game_id=eq.${gameId}`,
  CARD_PLAYS: `cards:game_id=eq.${gameId}`
});