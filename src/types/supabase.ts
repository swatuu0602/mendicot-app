import { Card, PlayerPosition, Team, GameStatus } from '../engine/GameEngine';

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          created_at: string;
          status: GameStatus;
          current_player: PlayerPosition;
          dealer: PlayerPosition;
          trump_suit: string | null;
          trump_revealed: boolean;
          trump_owner: PlayerPosition | null;
          current_trick_leader: PlayerPosition;
          captured_tens: {
            [key in Team]: number;
          };
          tricks_won: {
            [key in Team]: number;
          };
          rounds_won: {
            [key in Team]: number;
          };
          current_round: number;
        };
        Insert: Omit<Database['public']['Tables']['games']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['games']['Insert']>;
      };
      players: {
        Row: {
          id: string;
          game_id: string;
          position: PlayerPosition;
          team: Team;
          hand: Card[];
          is_ai: boolean;
          ai_difficulty?: 'novice' | 'expert';
        };
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['players']['Insert']>;
      };
      tricks: {
        Row: {
          id: string;
          game_id: string;
          round_number: number;
          trick_number: number;
          cards: Card[];
          winning_player: PlayerPosition;
          winning_team: Team;
          captured_tens: number;
        };
        Insert: Omit<Database['public']['Tables']['tricks']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tricks']['Insert']>;
      };
    };
  };
} 