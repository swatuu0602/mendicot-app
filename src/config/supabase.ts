import { createClient } from '@supabase/supabase-js';

// For development, we'll use mock data
const isDevelopment = true;

// Initialize Supabase client with mock data for development
export const supabase = isDevelopment ? {
  from: (table: string) => ({
    insert: () => Promise.resolve({ data: null, error: null }),
    select: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    eq: () => Promise.resolve({ data: [], error: null }),
    single: () => Promise.resolve({ data: null, error: null })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} })
    })
  })
} : createClient('', '');

// Database types
export type Game = {
  id: string;
  created_at: string;
  status: 'waiting' | 'playing' | 'finished';
  current_player: 'N' | 'E' | 'S' | 'W';
  dealer: 'N' | 'E' | 'S' | 'W';
  trump_suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' | null;
  trump_revealed: boolean;
  trump_owner: 'N' | 'E' | 'S' | 'W' | null;
  current_round: number;
  captured_tens: {
    NS: number;
    EW: number;
  };
  tricks_won: {
    NS: number;
    EW: number;
  };
  rounds_won: {
    NS: number;
    EW: number;
  };
};

export type Player = {
  id: string;
  game_id: string;
  position: 'N' | 'E' | 'S' | 'W';
  team: 'NS' | 'EW';
  is_ai: boolean;
  ai_difficulty?: 'easy' | 'medium' | 'hard';
  hand: {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  }[];
};

export type Trick = {
  id: string;
  game_id: string;
  round_number: number;
  trick_number: number;
  leader: 'N' | 'E' | 'S' | 'W';
  cards: {
    position: 'N' | 'E' | 'S' | 'W';
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  }[];
  winner: 'N' | 'E' | 'S' | 'W';
  tens_captured: number;
};

// Real-time subscription channels
export const CHANNELS = {
  GAME_STATE: 'game_state',
  PLAYER_ACTIONS: 'player_actions',
  TRICK_RESULTS: 'trick_results',
  CARD_PLAYS: 'card_plays'
} as const; 