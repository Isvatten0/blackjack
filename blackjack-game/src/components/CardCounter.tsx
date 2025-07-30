import React from 'react';

interface CardCounterProps {
  runningCount: number;
  isVisible: boolean;
  onToggle: () => void;
  deckCount: number;
}

const CardCounter: React.FC<CardCounterProps> = ({
  runningCount,
  isVisible,
  onToggle,
  deckCount
}) => {
  // Calculate true count (running count / decks remaining)
  const trueCount = deckCount > 0 ? (runningCount / deckCount).toFixed(1) : '0.0';

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

  return (
    <div className="absolute top-4 left-4 z-10">
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
        {isVisible ? '👁️ Hide Counter' : '🎯 Show Counter'}
      </button>

      {/* Counter display */}
      {isVisible && (
        <div className="
          bg-black bg-opacity-80 
          text-white 
          p-4 
          rounded-lg 
          shadow-lg 
          border border-gray-600
          min-w-[200px]
        ">
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              High-Low Count
            </div>
            
            <div className={`text-2xl font-bold ${getCountColor(runningCount)}`}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </div>
            
            <div className="text-xs text-gray-300">
              Running Count
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <div className={`text-lg font-semibold ${getCountColor(parseFloat(trueCount))}`}>
                {parseFloat(trueCount) > 0 ? '+' : ''}{trueCount}
              </div>
              <div className="text-xs text-gray-300">
                True Count
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <div className={`text-xs font-medium ${getCountColor(parseFloat(trueCount))}`}>
                {getCountAdvantage(parseFloat(trueCount))}
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-2 text-xs text-gray-400">
              <div>Decks Left: ~{deckCount}</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="font-semibold">High-Low System:</div>
              <div>2-6: +1 (Low cards)</div>
              <div>7-9: 0 (Neutral)</div>
              <div>10-A: -1 (High cards)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCounter;