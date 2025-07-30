import { GameSettings, GameStats } from '../types/game';

const SETTINGS_KEY = 'blackjack-game-settings';
const STATS_KEY = 'blackjack-game-stats';
const CHIP_POT_KEY = 'blackjack-chip-pot';

export const defaultSettings: GameSettings = {
  speed: 'medium',
  numDecks: 1,
  showCardCounter: false,
  showDetailedCounter: false,
  customTimerLength: 10,
  customAnimationSpeed: 500,
  soundEnabled: true,
};

export const defaultStats: GameStats = {
  wins: 0,
  losses: 0,
  pushes: 0,
  blackjacks: 0,
  busts: 0,
  totalChipsWon: 0,
  totalChipsLost: 0,
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

export const loadSettings = (): GameSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure new properties exist
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
};

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats to localStorage:', error);
  }
};

export const loadStats = (): GameStats => {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure new properties exist
      return { ...defaultStats, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load stats from localStorage:', error);
  }
  return defaultStats;
};

export const saveChipPot = (chipPot: number): void => {
  try {
    localStorage.setItem(CHIP_POT_KEY, chipPot.toString());
  } catch (error) {
    console.warn('Failed to save chip pot to localStorage:', error);
  }
};

export const loadChipPot = (): number => {
  try {
    const saved = localStorage.getItem(CHIP_POT_KEY);
    if (saved) {
      const chipPot = parseInt(saved, 10);
      return isNaN(chipPot) ? 1000 : chipPot; // Default to 1000 if invalid
    }
  } catch (error) {
    console.warn('Failed to load chip pot from localStorage:', error);
  }
  return 1000; // Default starting chips
};

export const resetStats = (): void => {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.warn('Failed to reset stats in localStorage:', error);
  }
};

export const resetChipPot = (): void => {
  try {
    localStorage.removeItem(CHIP_POT_KEY);
  } catch (error) {
    console.warn('Failed to reset chip pot in localStorage:', error);
  }
};

export const resetAllData = (): void => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(CHIP_POT_KEY);
  } catch (error) {
    console.warn('Failed to reset all data in localStorage:', error);
  }
};

// Export/Import functionality for game data
export const exportGameData = (): string => {
  const settings = loadSettings();
  const stats = loadStats();
  const chipPot = loadChipPot();
  
  const gameData = {
    settings,
    stats,
    chipPot,
    exportDate: new Date().toISOString(),
    version: '2.0'
  };
  
  return JSON.stringify(gameData, null, 2);
};

export const importGameData = (jsonData: string): boolean => {
  try {
    const gameData = JSON.parse(jsonData);
    
    if (gameData.settings) {
      saveSettings({ ...defaultSettings, ...gameData.settings });
    }
    
    if (gameData.stats) {
      saveStats({ ...defaultStats, ...gameData.stats });
    }
    
    if (typeof gameData.chipPot === 'number') {
      saveChipPot(gameData.chipPot);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import game data:', error);
    return false;
  }
};