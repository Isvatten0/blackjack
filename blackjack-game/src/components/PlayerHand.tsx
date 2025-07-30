import React from 'react';
import { Hand } from '../types/game';
import Card from './Card';

interface PlayerHandProps {
  hand: Hand;
  isDealing: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ hand, isDealing }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Player label */}
      <div className="retro-font text-cyan-400 text-lg neon-glow">
        PLAYER
      </div>
      
      {/* Cards */}
      <div className="flex space-x-2">
        {hand.cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            isDealing={isDealing && index === hand.cards.length - 1}
            className="card-deal"
          />
        ))}
        
        {/* Empty card placeholder when no cards */}
        {hand.cards.length === 0 && (
          <div className="w-16 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
            <div className="retro-font-alt text-xs text-gray-500">
              CARDS
            </div>
          </div>
        )}
      </div>
      
      {/* Hand value */}
      {hand.cards.length > 0 && (
        <div className="retro-card p-2 text-center">
          <div className="retro-font-alt text-xs text-gray-400 mb-1">VALUE</div>
          <div className={`retro-font text-lg ${
            hand.isBust ? 'text-red-400 neon-glow' : 
            hand.isBlackjack ? 'text-yellow-400 neon-glow' : 
            'text-cyan-400'
          }`}>
            {hand.value}
          </div>
          
          {/* Status indicators */}
          {hand.isBlackjack && (
            <div className="retro-font-alt text-xs text-yellow-400 mt-1 neon-glow">
              BLACKJACK!
            </div>
          )}
          
          {hand.isBust && (
            <div className="retro-font-alt text-xs text-red-400 mt-1 neon-glow">
              BUST!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerHand;