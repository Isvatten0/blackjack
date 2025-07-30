import React, { useState } from 'react';
import { getChipDenominations } from '../utils/gameLogic';

interface BettingInterfaceProps {
  chipPot: number;
  currentBet: number;
  recommendedBet: number;
  onBetChange: (bet: number) => void;
  onBetConfirm: () => void;
  onBetClear: () => void;
  isVisible: boolean;
  minBet?: number;
  maxBet?: number;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  chipPot,
  currentBet,
  recommendedBet,
  onBetChange,
  onBetConfirm,
  onBetClear,
  isVisible,
  minBet = 5,
  maxBet
}) => {
  const [selectedChips, setSelectedChips] = useState<{ [key: number]: number }>({});
  const chipDenominations = getChipDenominations();
  const effectiveMaxBet = Math.min(maxBet || chipPot, chipPot);

  const getChipColor = (denomination: number): string => {
    switch (denomination) {
      case 5: return 'from-red-500 to-red-700 border-red-400';
      case 10: return 'from-blue-500 to-blue-700 border-blue-400';
      case 25: return 'from-green-500 to-green-700 border-green-400';
      case 50: return 'from-purple-500 to-purple-700 border-purple-400';
      case 100: return 'from-yellow-500 to-yellow-700 border-yellow-400';
      default: return 'from-gray-500 to-gray-700 border-gray-400';
    }
  };

  const addChip = (denomination: number) => {
    const newBet = currentBet + denomination;
    if (newBet <= effectiveMaxBet) {
      onBetChange(newBet);
      setSelectedChips(prev => ({
        ...prev,
        [denomination]: (prev[denomination] || 0) + 1
      }));
    }
  };

  const removeChip = (denomination: number) => {
    if (selectedChips[denomination] > 0) {
      const newBet = Math.max(0, currentBet - denomination);
      onBetChange(newBet);
      setSelectedChips(prev => ({
        ...prev,
        [denomination]: Math.max(0, (prev[denomination] || 0) - 1)
      }));
    }
  };

  const setBetToRecommended = () => {
    const clampedBet = Math.min(Math.max(recommendedBet, minBet), effectiveMaxBet);
    onBetChange(clampedBet);
    // Clear selected chips display
    setSelectedChips({});
  };

  const clearBet = () => {
    onBetClear();
    setSelectedChips({});
  };

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="retro-card p-6 min-w-[600px]">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="retro-font text-lg text-cyan-400 neon-glow mb-2">
            PLACE YOUR BET
          </h3>
          <div className="retro-font-alt text-sm text-green-400">
            Pot: ${chipPot} | Current Bet: ${currentBet}
          </div>
        </div>

        {/* Recommended Bet */}
        {recommendedBet > 0 && (
          <div className="text-center mb-4 p-3 bg-gray-900 rounded-lg border border-yellow-500">
            <div className="retro-font-alt text-xs text-yellow-400 mb-1">
              RECOMMENDED BET
            </div>
            <div className="retro-font text-lg text-yellow-400 neon-glow">
              ${recommendedBet}
            </div>
            <button
              onClick={setBetToRecommended}
              className="retro-button mt-2 border-yellow-500 text-yellow-400 text-xs px-3 py-1"
              disabled={recommendedBet > effectiveMaxBet}
            >
              Use Recommended
            </button>
          </div>
        )}

        {/* Chip Selection */}
        <div className="mb-6">
          <div className="retro-font-alt text-sm text-cyan-400 mb-3 text-center">
            SELECT CHIPS
          </div>
          <div className="flex justify-center space-x-3">
            {chipDenominations.map(denomination => (
              <div key={denomination} className="text-center">
                <button
                  onClick={() => addChip(denomination)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    removeChip(denomination);
                  }}
                  disabled={currentBet + denomination > effectiveMaxBet}
                  className={`
                    w-16 h-16 rounded-full border-2 
                    bg-gradient-to-br ${getChipColor(denomination)}
                    retro-font text-xs text-white
                    transition-all duration-200
                    hover:scale-110 hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    chip-bounce-on-click
                    relative
                  `}
                  title={`$${denomination} chip (Right-click to remove)`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-shadow-lg">${denomination}</span>
                  </div>
                  {selectedChips[denomination] > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center retro-font text-xs">
                      {selectedChips[denomination]}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-2 retro-font-alt text-xs text-gray-400">
            Left-click to add • Right-click to remove
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="mb-4">
          <div className="retro-font-alt text-sm text-cyan-400 mb-2 text-center">
            QUICK BETS
          </div>
          <div className="flex justify-center space-x-2">
            {[minBet, 25, 50, 100].filter(amount => amount <= effectiveMaxBet).map(amount => (
              <button
                key={amount}
                onClick={() => onBetChange(amount)}
                className="retro-button text-xs px-3 py-1"
              >
                ${amount}
              </button>
            ))}
            {effectiveMaxBet >= 200 && (
              <button
                onClick={() => onBetChange(effectiveMaxBet)}
                className="retro-button border-red-500 text-red-400 text-xs px-3 py-1"
              >
                All-In
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={clearBet}
            disabled={currentBet === 0}
            className="retro-button border-red-500 text-red-400 disabled:opacity-50"
          >
            Clear Bet
          </button>
          <button
            onClick={onBetConfirm}
            disabled={currentBet < minBet || currentBet > effectiveMaxBet}
            className="retro-button border-green-500 text-green-400 disabled:opacity-50 neon-pulse"
          >
            Confirm Bet
          </button>
        </div>

        {/* Betting Rules */}
        <div className="mt-4 text-center retro-font-alt text-xs text-gray-400">
          Min: ${minBet} • Max: ${effectiveMaxBet} • 
          Blackjack pays 3:2 • Insurance available
        </div>
      </div>
    </div>
  );
};

export default BettingInterface;