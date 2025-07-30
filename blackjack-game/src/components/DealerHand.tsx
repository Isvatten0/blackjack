import React from 'react';
import { Hand } from '../types/game';
import Card from './Card';

interface DealerHandProps {
  hand: Hand;
  isDealing?: boolean;
  animationSpeed?: number;
  hideValue?: boolean;
}

const DealerHand: React.FC<DealerHandProps> = ({ 
  hand, 
  isDealing = false, 
  animationSpeed = 500,
  hideValue = false
}) => {
  // Calculate visible cards value for display when one card is hidden
  const getVisibleValue = (): number => {
    const visibleCards = hand.cards.filter(card => card.isVisible);
    if (visibleCards.length === 0) return 0;
    
    let value = 0;
    let aces = 0;
    
    visibleCards.forEach(card => {
      if (card.rank === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += card.value;
      }
    });
    
    // Adjust for Aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    
    return value;
  };

  const visibleValue = getVisibleValue();
  const hasHiddenCard = hand.cards.some(card => !card.isVisible);
  const displayValue = hideValue || hasHiddenCard ? visibleValue : hand.value;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Dealer label */}
      <div className="text-white text-lg sm:text-xl font-bold">
        Dealer
      </div>

      {/* Cards */}
      <div className="flex space-x-2 sm:space-x-3">
        {hand.cards.map((card, index) => (
          <div key={`dealer-${card.suit}-${card.rank}-${index}`} className="relative">
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
          Hand Value: <span className="font-bold">
            {hasHiddenCard ? `${displayValue}+` : displayValue}
          </span>
        </div>
        
        {hand.isBlackjack && !hasHiddenCard && (
          <div className="text-yellow-400 text-sm sm:text-base font-bold animate-pulse">
            🎉 BLACKJACK! 🎉
          </div>
        )}
        
        {hand.isBust && !hasHiddenCard && (
          <div className="text-red-400 text-sm sm:text-base font-bold animate-pulse">
            💥 BUST! 💥
          </div>
        )}

        {/* Soft/Hard indicator - only show when no hidden cards */}
        {hand.cards.length > 0 && !hand.isBust && !hand.isBlackjack && !hasHiddenCard && (
          <div className="text-gray-300 text-xs sm:text-sm">
            {hand.cards.some(card => card.rank === 'A') && hand.value <= 21 ? 
              (hand.cards.some(card => card.rank === 'A') && 
               hand.cards.reduce((sum, card) => sum + (card.rank === 'A' ? 1 : card.value), 0) + 10 === hand.value ?
               'Soft' : 'Hard') : 
              'Hard'}
          </div>
        )}

        {hasHiddenCard && (
          <div className="text-gray-400 text-xs sm:text-sm">
            Hidden card
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerHand;