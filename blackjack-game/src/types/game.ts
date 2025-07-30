export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  value: number;
  isVisible: boolean;
}

export interface Hand {
  cards: Card[];
  value: number;
  isBust: boolean;
  isBlackjack: boolean;
}

export type GameState = 'waiting' | 'betting' | 'dealing' | 'player-turn' | 'dealer-turn' | 'game-over';

export type GameSpeed = 'beginner' | 'medium' | 'fast' | 'slow' | 'custom';

export interface ChipBet {
  denomination: number;
  count: number;
}

export interface CardCounts {
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
  '7': number;
  '8': number;
  '9': number;
  '10': number;
  'J': number;
  'Q': number;
  'K': number;
  'A': number;
}

export interface GameSettings {
  speed: GameSpeed;
  numDecks: number;
  showCardCounter: boolean;
  showDetailedCounter: boolean;
  customTimerLength: number;
  customAnimationSpeed: number;
  soundEnabled: boolean;
}

export interface GameStats {
  wins: number;
  losses: number;
  pushes: number;
  blackjacks: number;
  busts: number;
  totalChipsWon: number;
  totalChipsLost: number;
}

export interface GameData {
  playerHand: Hand;
  dealerHand: Hand;
  deck: Card[];
  gameState: GameState;
  gameMessage: string;
  runningCount: number;
  cardCounts: CardCounts;
  settings: GameSettings;
  stats: GameStats;
  turnTimeLeft: number;
  chipPot: number;
  currentBet: number;
  recommendedBet: number;
  originalDeckSize: number;
}