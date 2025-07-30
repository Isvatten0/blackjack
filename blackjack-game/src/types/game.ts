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

export type GameState = 'waiting' | 'dealing' | 'player-turn' | 'dealer-turn' | 'game-over';

export type GameSpeed = 'beginner' | 'medium' | 'fast' | 'custom';

export interface GameSettings {
  speed: GameSpeed;
  numDecks: number;
  showCardCounter: boolean;
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
}

export interface GameData {
  playerHand: Hand;
  dealerHand: Hand;
  deck: Card[];
  gameState: GameState;
  gameMessage: string;
  runningCount: number;
  settings: GameSettings;
  stats: GameStats;
  turnTimeLeft: number;
}