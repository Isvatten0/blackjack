import React from 'react';
import { Hand } from '../types/game';
import Card from './Card';

interface PlayerHandProps {
  hand: Hand;
  isDealing?: boolean;
  animationSpeed?: number;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  hand, 
  isDealing = false, 
  animationSpeed = 500 
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Player label */}
      <div className="text-white text-lg sm:text-xl font-bold">
        Player
      </div>

      {/* Cards */}
      <div className="flex space-x-2 sm:space-x-3">
        {hand.cards.map((card, index) => (
          <div key={`${card.suit}-${card.rank}-${index}`} className="relative">
            <Card 
              card={card} 
              isDealing={isDealing && index === hand.cards.length - 1}
              animationDelay={index * (animationSpeed / 2)}
            />
          </div>
        ))}
      </div>

      {/* Hand value and status */}
      <div className="flex flex-col items-center space-y-1">
        <div className="text-white text-base sm:text-lg">
          Hand Value: <span className="font-bold">{hand.value}</span>
        </div>
        
        {hand.isBlackjack && (
          <div className="text-yellow-400 text-sm sm:text-base font-bold animate-pulse">
            🎉 BLACKJACK! 🎉
          </div>
        )}
        
        {hand.isBust && (
          <div className="text-red-400 text-sm sm:text-base font-bold animate-pulse">
            💥 BUST! 💥
          </div>
        )}

        {/* Soft/Hard indicator */}
        {hand.cards.length > 0 && !hand.isBust && !hand.isBlackjack && (
          <div className="text-gray-300 text-xs sm:text-sm">
            {hand.cards.some(card => card.rank === 'A') && hand.value <= 21 ? 
              (hand.cards.some(card => card.rank === 'A') && 
               hand.cards.reduce((sum, card) => sum + (card.rank === 'A' ? 1 : card.value), 0) + 10 === hand.value ?
               'Soft' : 'Hard') : 
              'Hard'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHand;