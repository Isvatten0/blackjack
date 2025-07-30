import React from 'react';
import { GameState } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDeal: () => void;
  onNewGame: () => void;
  turnTimeLeft?: number;
  isTimerActive?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onHit,
  onStand,
  onDeal,
  onNewGame,
  turnTimeLeft = 0,
  isTimerActive = false
}) => {
  const canHit = gameState === 'player-turn';
  const canStand = gameState === 'player-turn';
  const canDeal = gameState === 'waiting';
  const canNewGame = gameState === 'game-over';

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Timer display */}
      {isTimerActive && turnTimeLeft > 0 && (
        <div className={`
          text-lg sm:text-xl font-bold px-4 py-2 rounded-lg
          ${turnTimeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}
        `}>
          Time: {turnTimeLeft}s
        </div>
      )}

      {/* Main game controls */}
      <div className="flex space-x-3 sm:space-x-4">
        {canDeal && (
          <button
            onClick={onDeal}
            className="
              bg-green-600 hover:bg-green-700 
              text-white font-bold 
              py-3 px-6 sm:py-4 sm:px-8 
              rounded-lg 
              text-base sm:text-lg
              transition-colors duration-200
              shadow-lg hover:shadow-xl
              transform hover:scale-105
            "
          >
            Deal Cards
          </button>
        )}

        {canHit && (
          <button
            onClick={onHit}
            className="
              bg-blue-600 hover:bg-blue-700 
              text-white font-bold 
              py-3 px-6 sm:py-4 sm:px-8 
              rounded-lg 
              text-base sm:text-lg
              transition-colors duration-200
              shadow-lg hover:shadow-xl
              transform hover:scale-105
            "
          >
            Hit
          </button>
        )}

        {canStand && (
          <button
            onClick={onStand}
            className="
              bg-red-600 hover:bg-red-700 
              text-white font-bold 
              py-3 px-6 sm:py-4 sm:px-8 
              rounded-lg 
              text-base sm:text-lg
              transition-colors duration-200
              shadow-lg hover:shadow-xl
              transform hover:scale-105
            "
          >
            Stand
          </button>
        )}

        {canNewGame && (
          <button
            onClick={onNewGame}
            className="
              bg-purple-600 hover:bg-purple-700 
              text-white font-bold 
              py-3 px-6 sm:py-4 sm:px-8 
              rounded-lg 
              text-base sm:text-lg
              transition-colors duration-200
              shadow-lg hover:shadow-xl
              transform hover:scale-105
            "
          >
            New Game
          </button>
        )}
      </div>

      {/* Game state indicator */}
      <div className="text-center">
        {gameState === 'dealing' && (
          <div className="text-yellow-400 text-sm sm:text-base animate-pulse">
            Dealing cards...
          </div>
        )}
        
        {gameState === 'dealer-turn' && (
          <div className="text-yellow-400 text-sm sm:text-base animate-pulse">
            Dealer playing...
          </div>
        )}
        
        {gameState === 'player-turn' && (
          <div className="text-green-400 text-sm sm:text-base">
            Your turn - Hit or Stand?
          </div>
        )}
        
        {gameState === 'waiting' && (
          <div className="text-gray-400 text-sm sm:text-base">
            Click Deal Cards to start
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls;