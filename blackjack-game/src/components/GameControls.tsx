import React from 'react';
import { GameState } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDealCards: () => void;
  onNewGame: () => void;
  isDealing: boolean;
  chipPot: number;
  currentBet: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onHit,
  onStand,
  onDealCards,
  onNewGame,
  isDealing,
  chipPot,
  currentBet
}) => {
  const canHit = gameState === 'player-turn';
  const canStand = gameState === 'player-turn';
  const canNewGame = gameState === 'game-over';

  // Don't show controls during betting phase or dealing
  if (gameState === 'waiting' || gameState === 'betting' || isDealing) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main game controls */}
      <div className="flex space-x-4">
        {canHit && (
          <button
            onClick={onHit}
            className="retro-button border-blue-400 text-blue-400 px-6 py-3"
            disabled={isDealing}
          >
            ⚡ HIT
          </button>
        )}

        {canStand && (
          <button
            onClick={onStand}
            className="retro-button border-red-400 text-red-400 px-6 py-3"
            disabled={isDealing}
          >
            ✋ STAND
          </button>
        )}

        {canNewGame && (
          <button
            onClick={onNewGame}
            className="retro-button border-green-400 text-green-400 px-6 py-3 neon-pulse"
            disabled={chipPot <= 0}
          >
            🎯 NEW GAME
          </button>
        )}
      </div>

      {/* Game state indicators */}
      <div className="text-center retro-font-alt">
        {gameState === 'dealing' && (
          <div className="text-yellow-400 text-sm animate-pulse neon-glow">
            DEALING CARDS...
          </div>
        )}
        
        {gameState === 'dealer-turn' && (
          <div className="text-yellow-400 text-sm animate-pulse neon-glow">
            DEALER PLAYING...
          </div>
        )}
        
        {gameState === 'player-turn' && (
          <div className="text-cyan-400 text-sm neon-glow">
            YOUR TURN • CHOOSE WISELY
          </div>
        )}
      </div>

      {/* Bankruptcy warning */}
      {chipPot <= 0 && gameState === 'game-over' && (
        <div className="retro-card p-3 border-red-500 text-center">
          <div className="retro-font text-red-400 text-sm neon-glow mb-2">
            GAME OVER
          </div>
          <div className="retro-font-alt text-xs text-gray-400">
            You're out of chips! 
          </div>
          <button
            onClick={() => window.location.reload()}
            className="retro-button border-yellow-400 text-yellow-400 text-xs mt-2 px-3 py-1"
          >
            RESTART GAME
          </button>
        </div>
      )}

      {/* Additional action buttons for advanced play */}
      {gameState === 'player-turn' && (
        <div className="flex space-x-2 text-xs">
          <button
            className="retro-button border-purple-400 text-purple-400 text-xs px-3 py-1 opacity-50"
            disabled
            title="Coming soon!"
          >
            DOUBLE DOWN
          </button>
          <button
            className="retro-button border-orange-400 text-orange-400 text-xs px-3 py-1 opacity-50"
            disabled
            title="Coming soon!"
          >
            SPLIT
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls;