import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  isDealing?: boolean;
  animationDelay?: number;
}

const Card: React.FC<CardProps> = ({ card, isDealing = false, animationDelay = 0 }) => {
  const getSuitSymbol = (suit: CardType['suit']): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: CardType['suit']): string => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };

  const getDisplayRank = (rank: CardType['rank']): string => {
    return rank;
  };

  if (!card.isVisible) {
    // Card back
    return (
      <div 
        className={`
          w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 
          bg-gradient-to-br from-blue-800 to-blue-900 
          border-2 border-blue-700 
          rounded-lg 
          flex items-center justify-center 
          shadow-lg 
          relative
          ${isDealing ? 'animate-card-deal' : ''}
        `}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="w-full h-full bg-blue-600 rounded-md m-1 flex items-center justify-center">
          <div className="text-white text-2xl font-bold opacity-50">🂠</div>
        </div>
      </div>
    );
  }

  // Card front
  return (
    <div 
      className={`
        w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 
        bg-white 
        border-2 border-gray-300 
        rounded-lg 
        flex flex-col 
        justify-between 
        p-1 sm:p-2 
        shadow-lg 
        relative
        ${isDealing ? 'animate-card-deal' : ''}
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Top left corner */}
      <div className={`flex flex-col items-center ${getSuitColor(card.suit)}`}>
        <div className="text-xs sm:text-sm md:text-base font-bold leading-none">
          {getDisplayRank(card.rank)}
        </div>
        <div className="text-xs sm:text-sm md:text-lg leading-none">
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Center symbol */}
      <div className={`flex-1 flex items-center justify-center ${getSuitColor(card.suit)}`}>
        <div className="text-lg sm:text-xl md:text-2xl">
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Bottom right corner (rotated) */}
      <div className={`flex flex-col items-center transform rotate-180 ${getSuitColor(card.suit)}`}>
        <div className="text-xs sm:text-sm md:text-base font-bold leading-none">
          {getDisplayRank(card.rank)}
        </div>
        <div className="text-xs sm:text-sm md:text-lg leading-none">
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Card rank indicator for face cards */}
      {['J', 'Q', 'K'].includes(card.rank) && (
        <div className={`absolute inset-0 flex items-center justify-center ${getSuitColor(card.suit)}`}>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold opacity-20">
            {card.rank}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;