import React, { useState } from 'react';
import { GameSettings, GameStats, GameSpeed } from '../types/game';
import { resetAllData, exportGameData, importGameData, resetChipPot } from '../utils/storage';

interface UISettingsProps {
  settings: GameSettings;
  stats: GameStats;
  onSettingsUpdate: (settings: GameSettings) => void;
  onClose: () => void;
}

const UISettings: React.FC<UISettingsProps> = ({
  settings,
  stats,
  onSettingsUpdate,
  onClose
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);

  const handleSpeedChange = (speed: GameSpeed) => {
    onSettingsUpdate({ ...settings, speed });
  };

  const handleDeckCountChange = (numDecks: number) => {
    onSettingsUpdate({ ...settings, numDecks });
  };

  const handleCustomTimerChange = (customTimerLength: number) => {
    onSettingsUpdate({ ...settings, customTimerLength });
  };

  const handleCustomAnimationChange = (customAnimationSpeed: number) => {
    onSettingsUpdate({ ...settings, customAnimationSpeed });
  };

  const handleToggleCardCounter = () => {
    onSettingsUpdate({ ...settings, showCardCounter: !settings.showCardCounter });
  };

  const handleToggleDetailedCounter = () => {
    onSettingsUpdate({ ...settings, showDetailedCounter: !settings.showDetailedCounter });
  };

  const handleToggleSound = () => {
    onSettingsUpdate({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleExportData = () => {
    const data = exportGameData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blackjack-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          if (importGameData(data)) {
            alert('Data imported successfully! Refresh the page to see changes.');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert('Error importing data: ' + error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetAllData = () => {
    if (confirm('This will reset ALL game data including settings, stats, and chips. Are you sure?')) {
      resetAllData();
      alert('All data has been reset. Refresh the page to see changes.');
    }
  };

  const handleResetChips = () => {
    if (confirm('Reset chip pot to 1000?')) {
      resetChipPot();
      alert('Chip pot has been reset. Refresh the page to see changes.');
    }
  };

  const getTotalGames = () => {
    return stats.wins + stats.losses + stats.pushes;
  };

  const getWinRate = () => {
    const total = getTotalGames();
    if (total === 0) return '0.0';
    return ((stats.wins / total) * 100).toFixed(1);
  };

  const getNetChips = () => {
    return stats.totalChipsWon - stats.totalChipsLost;
  };

  return (
    <div className="retro-card p-6 max-w-md max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="retro-font text-xl text-cyan-400 neon-glow">
          SETTINGS
        </h2>
        <button
          onClick={onClose}
          className="retro-button border-red-400 text-red-400 text-sm px-3 py-1"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Game Speed Settings */}
      <div className="mb-6">
        <h3 className="retro-font-alt text-sm text-purple-400 mb-3 neon-border p-2">
          ⚡ GAME SPEED
        </h3>
        <div className="space-y-2">
          {(['beginner', 'medium', 'fast', 'slow', 'custom'] as GameSpeed[]).map((speed) => (
            <label key={speed} className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="speed"
                value={speed}
                checked={settings.speed === speed}
                onChange={() => handleSpeedChange(speed)}
                className="mr-2 accent-cyan-400"
              />
              <span className="retro-font-alt text-gray-300 capitalize">
                {speed}
                {speed === 'beginner' && ' (No timer, slow)'}
                {speed === 'medium' && ' (10s timer, medium)'}
                {speed === 'fast' && ' (3s timer, fast)'}
                {speed === 'slow' && ' (No timer, unlimited time)'}
                {speed === 'custom' && ' (Customizable)'}
              </span>
            </label>
          ))}
        </div>

        {/* Custom speed settings */}
        {settings.speed === 'custom' && (
          <div className="mt-3 p-3 bg-gray-900 rounded border border-purple-400">
            <div className="space-y-3">
              <div>
                <label className="retro-font-alt text-xs text-gray-400 block mb-1">
                  Timer Length (seconds):
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={settings.customTimerLength}
                  onChange={(e) => handleCustomTimerChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-cyan-400 retro-font-alt text-sm"
                />
              </div>
              <div>
                <label className="retro-font-alt text-xs text-gray-400 block mb-1">
                  Animation Speed (ms):
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="100"
                  value={settings.customAnimationSpeed}
                  onChange={(e) => handleCustomAnimationChange(parseInt(e.target.value) || 500)}
                  className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-cyan-400 retro-font-alt text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deck Settings */}
      <div className="mb-6">
        <h3 className="retro-font-alt text-sm text-green-400 mb-3 neon-border p-2">
          🃏 DECK SETTINGS
        </h3>
        <div>
          <label className="retro-font-alt text-xs text-gray-400 block mb-1">
            Number of Decks:
          </label>
          <select
            value={settings.numDecks}
            onChange={(e) => handleDeckCountChange(parseInt(e.target.value))}
            className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-green-400 retro-font-alt text-sm"
          >
            {[1, 2, 4, 6, 8].map(num => (
              <option key={num} value={num}>{num} Deck{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Settings */}
      <div className="mb-6">
        <h3 className="retro-font-alt text-sm text-yellow-400 mb-3 neon-border p-2">
          📊 DISPLAY OPTIONS
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCardCounter}
              onChange={handleToggleCardCounter}
              className="mr-2 accent-cyan-400"
            />
            <span className="retro-font-alt text-sm text-gray-300">
              Show Card Counter
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showDetailedCounter}
              onChange={handleToggleDetailedCounter}
              className="mr-2 accent-cyan-400"
            />
            <span className="retro-font-alt text-sm text-gray-300">
              Show Detailed Card Counts
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={handleToggleSound}
              className="mr-2 accent-cyan-400"
            />
            <span className="retro-font-alt text-sm text-gray-300">
              Sound Effects
            </span>
          </label>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <button
          onClick={() => setShowStats(!showStats)}
          className="retro-button w-full border-orange-400 text-orange-400 mb-3"
        >
          {showStats ? '▼' : '▶'} STATISTICS
        </button>
        
        {showStats && (
          <div className="p-3 bg-gray-900 rounded border border-orange-400 space-y-2">
            <div className="grid grid-cols-2 gap-2 retro-font-alt text-xs">
              <div className="text-green-400">Wins: {stats.wins}</div>
              <div className="text-red-400">Losses: {stats.losses}</div>
              <div className="text-yellow-400">Pushes: {stats.pushes}</div>
              <div className="text-purple-400">Blackjacks: {stats.blackjacks}</div>
              <div className="text-red-400">Busts: {stats.busts}</div>
              <div className="text-cyan-400">Games: {getTotalGames()}</div>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="retro-font-alt text-xs text-gray-400 space-y-1">
                <div>Win Rate: <span className="text-green-400">{getWinRate()}%</span></div>
                <div>Chips Won: <span className="text-green-400">+${stats.totalChipsWon}</span></div>
                <div>Chips Lost: <span className="text-red-400">-${stats.totalChipsLost}</span></div>
                <div>Net Result: <span className={getNetChips() >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {getNetChips() >= 0 ? '+' : ''}${getNetChips()}
                </span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="mb-6">
        <button
          onClick={() => setShowDataManagement(!showDataManagement)}
          className="retro-button w-full border-red-400 text-red-400 mb-3"
        >
          {showDataManagement ? '▼' : '▶'} DATA MANAGEMENT
        </button>
        
        {showDataManagement && (
          <div className="p-3 bg-gray-900 rounded border border-red-400 space-y-3">
            <div className="space-y-2">
              <button
                onClick={handleExportData}
                className="retro-button w-full border-green-400 text-green-400 text-xs"
              >
                💾 EXPORT DATA
              </button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="retro-button w-full border-blue-400 text-blue-400 text-xs cursor-pointer block text-center"
                >
                  📁 IMPORT DATA
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-3 space-y-2">
              <button
                onClick={handleResetChips}
                className="retro-button w-full border-yellow-400 text-yellow-400 text-xs"
              >
                💰 RESET CHIPS
              </button>
              
              <button
                onClick={handleResetAllData}
                className="retro-button w-full border-red-500 text-red-500 text-xs"
              >
                ⚠️ RESET ALL DATA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center retro-font-alt text-xs text-gray-500 border-t border-gray-600 pt-3">
        Retro Blackjack v2.0 • Card Counting Edition
      </div>
    </div>
  );
};

export default UISettings;