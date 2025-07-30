import React, { useState } from 'react';
import { CardCounts } from '../types/game';

interface CardCounterProps {
  runningCount: number;
  trueCount: number;
  isVisible: boolean;
  onToggle: () => void;
  deckCount: number;
  cardCounts: CardCounts;
  showDetailedCounter: boolean;
  onToggleDetailed: () => void;
}

const CardCounter: React.FC<CardCounterProps> = ({
  runningCount,
  trueCount,
  isVisible,
  onToggle,
  deckCount,
  cardCounts,
  showDetailedCounter,
  onToggleDetailed
}) => {
  const [isDetailedDropdownOpen, setIsDetailedDropdownOpen] = useState(false);

  const getCountColor = (count: number): string => {
    if (count > 2) return 'text-green-400';
    if (count < -2) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getCountAdvantage = (count: number): string => {
    if (count > 4) return 'Very Favorable';
    if (count > 2) return 'Favorable';
    if (count > 0) return 'Slightly Favorable';
    if (count === 0) return 'Neutral';
    if (count > -2) return 'Slightly Unfavorable';
    if (count > -4) return 'Unfavorable';
    return 'Very Unfavorable';
  };

  const getCardCountColor = (remaining: number, total: number): string => {
    const percentage = remaining / total;
    if (percentage > 0.7) return 'text-red-400'; // Many cards left (bad for high cards)
    if (percentage > 0.4) return 'text-yellow-400'; // Medium cards left
    return 'text-green-400'; // Few cards left (good for high cards)
  };

  const totalCardsDealt = Object.values(cardCounts).reduce((sum, count, index) => {
    const originalCount = Math.floor(deckCount * 52 / 13); // Cards per rank originally
    return sum + (originalCount - count);
  }, 0);

  const cardsRemaining = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="absolute top-4 left-4 z-10">
      {/* Main Toggle button */}
      <button
        onClick={onToggle}
        className="retro-button mb-2 border-cyan-400 text-cyan-400"
      >
        {isVisible ? '👁️ Hide Counter' : '🎯 Show Counter'}
      </button>

      {/* Counter display */}
      {isVisible && (
        <div className="retro-card p-4 min-w-[220px] space-y-4">
          <div className="text-center space-y-2">
            <div className="retro-font-alt text-xs text-gray-400 uppercase tracking-wide">
              High-Low Count
            </div>
            
            <div className={`retro-font text-2xl ${getCountColor(runningCount)} neon-glow`}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </div>
            
            <div className="retro-font-alt text-xs text-gray-300">
              Running Count
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <div className={`retro-font text-lg ${getCountColor(trueCount)} neon-glow`}>
                {trueCount > 0 ? '+' : ''}{trueCount.toFixed(1)}
              </div>
              <div className="retro-font-alt text-xs text-gray-300">
                True Count
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <div className={`retro-font-alt text-xs font-medium ${getCountColor(trueCount)}`}>
                {getCountAdvantage(trueCount)}
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-2 retro-font-alt text-xs text-gray-400 space-y-1">
              <div>Decks Left: ~{deckCount.toFixed(1)}</div>
              <div>Cards Dealt: {totalCardsDealt}</div>
              <div>Cards Left: {cardsRemaining}</div>
            </div>
          </div>
          
          {/* Detailed Counter Toggle */}
          <div className="border-t border-gray-600 pt-3">
            <button
              onClick={onToggleDetailed}
              className="retro-button w-full border-purple-400 text-purple-400 text-xs"
            >
              {showDetailedCounter ? '📊 Hide Details' : '📊 Show Details'}
            </button>
          </div>

          {/* Detailed Card Counts Dropdown */}
          {showDetailedCounter && (
            <div className="border-t border-gray-600 pt-3">
              <button
                onClick={() => setIsDetailedDropdownOpen(!isDetailedDropdownOpen)}
                className="retro-button w-full border-orange-400 text-orange-400 text-xs mb-2"
              >
                {isDetailedDropdownOpen ? '▼ Card Counts' : '▶ Card Counts'}
              </button>
              
              {isDetailedDropdownOpen && (
                <div className="bg-black bg-opacity-60 rounded border border-orange-400 p-3 space-y-2">
                  <div className="retro-font-alt text-xs text-orange-400 text-center mb-2">
                    REMAINING CARDS
                  </div>
                  
                  {/* Low Cards (2-6) */}
                  <div className="mb-2">
                    <div className="retro-font-alt text-xs text-green-400 mb-1">Low Cards (+1):</div>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {['2', '3', '4', '5', '6'].map(rank => (
                        <div key={rank} className="retro-font text-xs">
                          <div className="text-gray-300">{rank}</div>
                          <div className={getCardCountColor(cardCounts[rank as keyof CardCounts], 4)}>
                            {cardCounts[rank as keyof CardCounts]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Neutral Cards (7-9) */}
                  <div className="mb-2">
                    <div className="retro-font-alt text-xs text-yellow-400 mb-1">Neutral (0):</div>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      {['7', '8', '9'].map(rank => (
                        <div key={rank} className="retro-font text-xs">
                          <div className="text-gray-300">{rank}</div>
                          <div className={getCardCountColor(cardCounts[rank as keyof CardCounts], 4)}>
                            {cardCounts[rank as keyof CardCounts]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* High Cards (10-A) */}
                  <div className="mb-2">
                    <div className="retro-font-alt text-xs text-red-400 mb-1">High Cards (-1):</div>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {['10', 'J', 'Q', 'K', 'A'].map(rank => (
                        <div key={rank} className="retro-font text-xs">
                          <div className="text-gray-300">{rank}</div>
                          <div className={getCardCountColor(cardCounts[rank as keyof CardCounts], 4)}>
                            {cardCounts[rank as keyof CardCounts]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Color Legend */}
                  <div className="border-t border-gray-600 pt-2 retro-font-alt text-xs text-center space-y-1">
                    <div className="text-gray-400">Color Legend:</div>
                    <div className="flex justify-center space-x-3">
                      <span className="text-red-400">High</span>
                      <span className="text-yellow-400">Med</span>
                      <span className="text-green-400">Low</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Legend */}
          <div className="border-t border-gray-600 pt-3">
            <div className="retro-font-alt text-xs text-gray-400 space-y-1">
              <div className="font-semibold">High-Low System:</div>
              <div className="text-green-400">2-6: +1 (Low cards)</div>
              <div className="text-yellow-400">7-9: 0 (Neutral)</div>
              <div className="text-red-400">10-A: -1 (High cards)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCounter;