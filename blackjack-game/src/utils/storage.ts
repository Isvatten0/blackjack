import { GameSettings, GameStats } from '../types/game';

const SETTINGS_KEY = 'blackjack-settings';
const STATS_KEY = 'blackjack-stats';

// Default settings
export const defaultSettings: GameSettings = {
  speed: 'medium',
  numDecks: 1,
  showCardCounter: false,
  customTimerLength: 10,
  customAnimationSpeed: 500,
  soundEnabled: true,
};

// Default stats
export const defaultStats: GameStats = {
  wins: 0,
  losses: 0,
  pushes: 0,
  blackjacks: 0,
  busts: 0,
};

// Load settings from localStorage
export const loadSettings = (): GameSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing properties
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

// Save settings to localStorage
export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// Load stats from localStorage
export const loadStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultStats, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
  return defaultStats;
};

// Save stats to localStorage
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

// Clear all stored data
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
};