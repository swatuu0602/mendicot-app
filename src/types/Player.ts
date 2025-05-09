import { Card } from './Card';

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  score: number;
  isCurrentPlayer: boolean;
} 