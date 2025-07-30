import React, { useState } from 'react';
import { GameSettings, GameStats, GameSpeed } from '../types/game';

interface UISettingsProps {
  settings: GameSettings;
  stats: GameStats;
  onSettingsChange: (settings: GameSettings) => void;
  onClearStats: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const UISettings: React.FC<UISettingsProps> = ({
  settings,
  stats,
  onSettingsChange,
  onClearStats,
  isVisible,
  onToggle
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSpeedChange = (speed: GameSpeed) => {
    onSettingsChange({ ...settings, speed });
  };

  const handleDeckCountChange = (numDecks: number) => {
    onSettingsChange({ ...settings, numDecks });
  };

  const handleCustomTimerChange = (customTimerLength: number) => {
    onSettingsChange({ ...settings, customTimerLength });
  };

  const handleCustomAnimationChange = (customAnimationSpeed: number) => {
    onSettingsChange({ ...settings, customAnimationSpeed });
  };

  const getTotalGames = () => {
    return stats.wins + stats.losses + stats.pushes;
  };

  const getWinRate = () => {
    const total = getTotalGames();
    if (total === 0) return '0';
    return ((stats.wins / total) * 100).toFixed(1);
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="
          bg-gray-800 hover:bg-gray-700 
          text-white 
          px-3 py-2 
          rounded-lg 
          text-sm 
          mb-2
          transition-colors duration-200
          border border-gray-600
        "
      >
        {isVisible ? '⚙️ Hide Settings' : '⚙️ Settings'}
      </button>

      {/* Settings panel */}
      {isVisible && (
        <div className="
          bg-black bg-opacity-90 
          text-white 
          p-4 
          rounded-lg 
          shadow-lg 
          border border-gray-600
          min-w-[280px]
          max-h-[80vh]
          overflow-y-auto
        ">
          {/* Game Speed Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Game Speed</h3>
            <div className="space-y-2">
              {(['beginner', 'medium', 'fast', 'custom'] as GameSpeed[]).map((speed) => (
                <label key={speed} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="speed"
                    value={speed}
                    checked={settings.speed === speed}
                    onChange={() => handleSpeedChange(speed)}
                    className="mr-2"
                  />
                  <span className="capitalize">
                    {speed}
                    {speed === 'beginner' && ' (No timer, slow animations)'}
                    {speed === 'medium' && ' (10s timer, medium speed)'}
                    {speed === 'fast' && ' (3s timer, fast animations)'}
                    {speed === 'custom' && ' (Customizable)'}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom speed settings */}
            {settings.speed === 'custom' && (
              <div className="mt-3 p-3 bg-gray-800 rounded border">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">
                      Timer Length: {settings.customTimerLength}s
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={settings.customTimerLength}
                      onChange={(e) => handleCustomTimerChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400">0 = No timer</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">
                      Animation Speed: {settings.customAnimationSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={settings.customAnimationSpeed}
                      onChange={(e) => handleCustomAnimationChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400">Lower = Faster</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deck Configuration */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Deck Configuration</h3>
            <div>
              <label className="block text-sm mb-2">
                Number of Decks: {settings.numDecks}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={settings.numDecks}
                onChange={(e) => handleDeckCountChange(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1 Deck</span>
                <span>6 Decks</span>
              </div>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mb-6 p-3 bg-gray-800 rounded border">
              <h4 className="text-md font-semibold mb-3">Advanced Options</h4>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCardCounter}
                    onChange={(e) => onSettingsChange({ 
                      ...settings, 
                      showCardCounter: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <span>Show Card Counter by Default</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onSettingsChange({ 
                      ...settings, 
                      soundEnabled: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <span>Enable Sound Effects</span>
                </label>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Games Played:</span>
                <span className="font-semibold">{getTotalGames()}</span>
              </div>
              <div className="flex justify-between">
                <span>Wins:</span>
                <span className="font-semibold text-green-400">{stats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses:</span>
                <span className="font-semibold text-red-400">{stats.losses}</span>
              </div>
              <div className="flex justify-between">
                <span>Pushes:</span>
                <span className="font-semibold text-yellow-400">{stats.pushes}</span>
              </div>
              <div className="flex justify-between">
                <span>Blackjacks:</span>
                <span className="font-semibold text-purple-400">{stats.blackjacks}</span>
              </div>
              <div className="flex justify-between">
                <span>Busts:</span>
                <span className="font-semibold text-orange-400">{stats.busts}</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-semibold">{getWinRate()}%</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClearStats}
              className="
                mt-3 w-full
                bg-red-600 hover:bg-red-700 
                text-white text-sm
                py-2 px-3 
                rounded 
                transition-colors duration-200
              "
            >
              Clear Statistics
            </button>
          </div>

          {/* Help Section */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="font-semibold">Game Rules:</div>
            <div>• Get as close to 21 as possible without going over</div>
            <div>• Dealer hits on soft 17</div>
            <div>• Blackjack (21 with 2 cards) beats regular 21</div>
            <div>• Aces count as 1 or 11, face cards count as 10</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UISettings;