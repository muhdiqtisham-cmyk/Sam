export type TileType =
  | 'START'
  | 'BILLS'
  | 'PAYDAY'
  | 'INVEST'
  | 'BANK'
  | 'CHANCE'
  | 'CHANCEHUB'
  | 'SKILL'
  | 'SHOP'
  | 'REST';

export interface Player {
  id: number;
  name: string;
  color: string;
  isComputer: boolean;
  playStyle?: 'conservative' | 'aggressive' | 'balanced' | 'gambler';
  cash: number;
  debt: number;
  position: number;
  incomeBoost: number;
  shopCount: number;
  investCount: number;
  skillCount: number;
}

export interface BoardTile {
  index: number;
  type: TileType;
  coord: [number, number]; // [row 1-7, col 1-7]
  title: string;
  icon: string;
  description: string;
  accent: string;
}

export interface LogEntry {
  id: string;
  round: number;
  timestamp: string;
  playerId?: number;
  playerName?: string;
  text: string;
  type: 'neutral' | 'gain' | 'loss' | 'debt' | 'warning' | 'turn';
}

export interface ChanceEvent {
  text: string;
  cashDelta?: number;
  debtDelta?: number;
  incomeBoostDelta?: number;
  description?: string;
}

export type GameView = 'game' | 'rules' | 'strategy';
