import { BoardTile, ChanceEvent, TileType } from '../types';

export const PLAYER_COLORS = [
  { name: 'Gold', hex: '#C9A227', border: '#8A6D15', bg: 'bg-[#C9A227]' },
  { name: 'Brick', hex: '#A63D40', border: '#702527', bg: 'bg-[#A63D40]' },
  { name: 'Teal', hex: '#2F6F62', border: '#1A423A', bg: 'bg-[#2F6F62]' },
  { name: 'Plum', hex: '#6B4E71', border: '#422F46', bg: 'bg-[#6B4E71]' },
  { name: 'Denim', hex: '#35577A', border: '#1C334A', bg: 'bg-[#35577A]' },
  { name: 'Olive', hex: '#6E7B3A', border: '#41491E', bg: 'bg-[#6E7B3A]' },
];

export const BOT_PROFILES = [
  { name: 'Morgan', style: 'balanced' as const, label: 'Balanced' },
  { name: 'Taylor', style: 'conservative' as const, label: 'Frugal Saver' },
  { name: 'Jordan', style: 'gambler' as const, label: 'Risk Taker' },
  { name: 'Casey', style: 'aggressive' as const, label: 'Growth Seeker' },
  { name: 'Riley', style: 'balanced' as const, label: 'Methodical' },
];

export const TILE_TYPES: TileType[] = [
  'START',
  'BILLS',
  'INVEST',
  'CHANCE',
  'SKILL',
  'SHOP',
  'BANK',
  'BILLS',
  'PAYDAY',
  'CHANCE',
  'INVEST',
  'SHOP',
  'CHANCEHUB',
  'BILLS',
  'SKILL',
  'PAYDAY',
  'INVEST',
  'CHANCE',
  'REST',
  'BILLS',
  'SHOP',
  'PAYDAY',
  'CHANCE',
  'SKILL',
];

export const TILE_METADATA: Record<
  TileType,
  { label: string; icon: string; accent: string; description: string }
> = {
  START: {
    label: 'Start / Payday',
    icon: '🏁',
    accent: '#C9A227',
    description: 'Pass or land to collect your salary (+RM500 + boosts). Debt charges 8% interest.',
  },
  BILLS: {
    label: 'Bills Due',
    icon: '⚡',
    accent: '#A63D40',
    description: 'Mandatory monthly overhead: RM400. If short, emergency bank loan required (+RM200 penalty).',
  },
  PAYDAY: {
    label: 'Side Income',
    icon: '◆',
    accent: '#2F6F62',
    description: 'Freelance gig or dividend payout brings in quick cash (+RM200 to +RM400).',
  },
  INVEST: {
    label: 'Investment Corner',
    icon: '📈',
    accent: '#1B4332',
    description: 'Put capital to work: invest RM300 or RM600 for high growth potential or market dip risk.',
  },
  BANK: {
    label: 'The Bank',
    icon: '🏛️',
    accent: '#C9A227',
    description: 'Corner sanctuary: pay down high-interest loans or secure an emergency RM1,000 liquidity facility.',
  },
  CHANCE: {
    label: 'Chance',
    icon: '?',
    accent: '#4C5A7A',
    description: 'Unexpected real-world occurrences: rebates, car fixes, parking tickets, or windfalls.',
  },
  CHANCEHUB: {
    label: "Fortune's Corner",
    icon: '🌟',
    accent: '#122A22',
    description: 'High-impact financial events: tax returns, lottery, or medical emergency bills.',
  },
  SKILL: {
    label: 'Skill Up',
    icon: '✦',
    accent: '#1B4332',
    description: 'Self-education course: invest RM250 now to permanently boost all future salaries by +RM100.',
  },
  SHOP: {
    label: 'Shopping Temptation',
    icon: '🛍️',
    accent: '#A63D40',
    description: 'Impulse consumer purchase: RM150 for lifestyle satisfaction, but cuts your cash reserve.',
  },
  REST: {
    label: 'Payday Weekend',
    icon: '☕',
    accent: '#8A7E68',
    description: 'A peaceful rest stop. No money gained, no bills due. Catch your breath.',
  },
};

// 7x7 grid perimeter coordinates: [row (1-7), col (1-7)]
export const BOARD_COORDINATES: [number, number][] = [
  [7, 7], // 0: START
  [6, 7], // 1: BILLS
  [5, 7], // 2: INVEST
  [4, 7], // 3: CHANCE
  [3, 7], // 4: SKILL
  [2, 7], // 5: SHOP
  [1, 7], // 6: BANK
  [1, 6], // 7: BILLS
  [1, 5], // 8: PAYDAY
  [1, 4], // 9: CHANCE
  [1, 3], // 10: INVEST
  [1, 2], // 11: SHOP
  [1, 1], // 12: CHANCEHUB
  [2, 1], // 13: BILLS
  [3, 1], // 14: SKILL
  [4, 1], // 15: PAYDAY
  [5, 1], // 16: INVEST
  [6, 1], // 17: CHANCE
  [7, 1], // 18: REST
  [7, 2], // 19: BILLS
  [7, 3], // 20: SHOP
  [7, 4], // 21: PAYDAY
  [7, 5], // 22: CHANCE
  [7, 6], // 23: SKILL
];

export const BOARD_TILES: BoardTile[] = TILE_TYPES.map((type, idx) => ({
  index: idx,
  type,
  coord: BOARD_COORDINATES[idx],
  title: TILE_METADATA[type].label,
  icon: TILE_METADATA[type].icon,
  description: TILE_METADATA[type].description,
  accent: TILE_METADATA[type].accent,
}));

export const CHANCE_EVENTS: ChanceEvent[] = [
  { text: 'Found RM120 in an old jacket pocket.', cashDelta: 120 },
  { text: 'Unpaid parking fine arrives — pay RM60.', cashDelta: -60 },
  { text: 'A loyal client repays an old debt: +RM250.', cashDelta: 250 },
  { text: 'Smart-phone glass cracked. Screen repair: RM180.', cashDelta: -180 },
  { text: 'E-wallet quarterly cashback reward credited: +RM90.', cashDelta: 90 },
  { text: 'Vehicle requires unexpected brake service: RM220.', cashDelta: -220 },
  { text: 'Fast weekend design commission pays out: +RM300.', cashDelta: 300 },
  { text: 'Bank waives late charge in your favor: +RM40.', cashDelta: 40 },
  { text: 'Left umbrella in the train; bought a replacement: RM25.', cashDelta: -25 },
  { text: 'A quiet, calm week. No surprise expenses or gains.', cashDelta: 0 },
];

export const CHANCEHUB_EVENTS: ChanceEvent[] = [
  { text: 'Annual tax refund arrives in your account: +RM500.', cashDelta: 500 },
  { text: 'Sudden root canal surgery! Bank debt +RM400 covers it.', debtDelta: 400 },
  { text: 'Digital side-hustle sales spike: +RM650 in revenue.', cashDelta: 650 },
  { text: 'Suspicious card activity, mandatory reissue fees: -RM300.', cashDelta: -300 },
  { text: 'Lucky ticket draw pays out a grand bonus: +RM800!', cashDelta: 800 },
];
