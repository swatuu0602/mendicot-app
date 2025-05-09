import { supabase } from '../config/supabase';
import { Game, Player, Trick } from '../config/supabase';
import { GameState, Player as GamePlayer, Card } from '../types/game';

export const gameService = {
  // Create a new game
  async createGame(): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .insert({
        status: 'waiting',
        current_player: 'S',
        dealer: 'W',
        trump_suit: null,
        trump_revealed: false,
        trump_owner: null,
        current_round: 1,
        captured_tens: { NS: 0, EW: 0 },
        tricks_won: { NS: 0, EW: 0 },
        rounds_won: { NS: 0, EW: 0 }
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get game by ID
  async getGame(gameId: string): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update game state
  async updateGame(gameId: string, updates: Partial<Game>): Promise<Game> {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', gameId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create players for a game
  async createPlayers(gameId: string, players: GamePlayer[]): Promise<Player[]> {
    const playerData = players.map(player => ({
      game_id: gameId,
      position: player.position,
      team: player.team,
      is_ai: player.isAI,
      ai_difficulty: player.aiDifficulty,
      hand: player.hand
    }));

    const { data, error } = await supabase
      .from('players')
      .insert(playerData)
      .select();

    if (error) throw error;
    return data;
  },

  // Update player's hand
  async updatePlayerHand(gameId: string, position: string, hand: Card[]): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update({ hand })
      .eq('game_id', gameId)
      .eq('position', position)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Record a trick
  async recordTrick(trick: Omit<Trick, 'id'>): Promise<Trick> {
    const { data, error } = await supabase
      .from('tricks')
      .insert(trick)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get game history
  async getGameHistory(gameId: string): Promise<Trick[]> {
    const { data, error } = await supabase
      .from('tricks')
      .select('*')
      .eq('game_id', gameId)
      .order('round_number', { ascending: true })
      .order('trick_number', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Subscribe to game updates
  subscribeToGame(gameId: string, callback: (game: Game) => void) {
    return supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        (payload) => callback(payload.new as Game)
      )
      .subscribe();
  },

  // Subscribe to player updates
  subscribeToPlayers(gameId: string, callback: (player: Player) => void) {
    return supabase
      .channel(`players:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => callback(payload.new as Player)
      )
      .subscribe();
  }
}; 