import { useEffect, useCallback } from 'react';
import { supabase, CHANNELS } from '../config/supabase';
import { GameState, Card, PlayerPosition } from '../engine/GameEngine';

interface UseMultiplayerSyncProps {
  gameId: string;
  onGameStateUpdate: (state: Partial<GameState>) => void;
  onPlayerAction: (action: { type: string; payload: any }) => void;
  onTrickResult: (result: { winningPlayer: PlayerPosition; capturedTens: number }) => void;
  onCardPlay: (play: { card: Card; player: PlayerPosition }) => void;
}

export const useMultiplayerSync = ({
  gameId,
  onGameStateUpdate,
  onPlayerAction,
  onTrickResult,
  onCardPlay
}: UseMultiplayerSyncProps) => {
  // Subscribe to game state changes
  useEffect(() => {
    const gameStateSubscription = supabase
      .channel(`${CHANNELS.GAME_STATE}:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        onGameStateUpdate(payload.new as Partial<GameState>);
      })
      .subscribe();

    return () => {
      gameStateSubscription.unsubscribe();
    };
  }, [gameId, onGameStateUpdate]);

  // Subscribe to player actions
  useEffect(() => {
    const playerActionsSubscription = supabase
      .channel(`${CHANNELS.PLAYER_ACTIONS}:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        onPlayerAction(payload.new);
      })
      .subscribe();

    return () => {
      playerActionsSubscription.unsubscribe();
    };
  }, [gameId, onPlayerAction]);

  // Subscribe to trick results
  useEffect(() => {
    const trickResultsSubscription = supabase
      .channel(`${CHANNELS.TRICK_RESULTS}:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tricks',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        onTrickResult(payload.new);
      })
      .subscribe();

    return () => {
      trickResultsSubscription.unsubscribe();
    };
  }, [gameId, onTrickResult]);

  // Subscribe to card plays
  useEffect(() => {
    const cardPlaysSubscription = supabase
      .channel(`${CHANNELS.CARD_PLAYS}:${gameId}`)
      .on('broadcast', { event: 'card_play' }, (payload) => {
        onCardPlay(payload.payload);
      })
      .subscribe();

    return () => {
      cardPlaysSubscription.unsubscribe();
    };
  }, [gameId, onCardPlay]);

  // Function to broadcast a card play
  const broadcastCardPlay = useCallback((card: Card, player: PlayerPosition) => {
    supabase
      .channel(`${CHANNELS.CARD_PLAYS}:${gameId}`)
      .send({
        type: 'broadcast',
        event: 'card_play',
        payload: { card, player }
      });
  }, [gameId]);

  // Function to update game state
  const updateGameState = useCallback(async (updates: Partial<GameState>) => {
    const { error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', gameId);

    if (error) {
      console.error('Error updating game state:', error);
    }
  }, [gameId]);

  return {
    broadcastCardPlay,
    updateGameState
  };
}; 