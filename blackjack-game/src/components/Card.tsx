import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  className?: string;
  isDealing?: boolean;
}

const Card: React.FC<CardProps> = ({ card, className = '', isDealing = false }) => {
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
    return suit === 'hearts' || suit === 'diamonds' 
      ? 'text-red-400' 
      : 'text-white';
  };

  const getCardBackground = (suit: CardType['suit']): string => {
    if (!card.isVisible) {
      return 'from-blue-900 via-purple-900 to-blue-900';
    }
    
    switch (suit) {
      case 'hearts':
      case 'diamonds':
        return 'from-gray-100 via-white to-gray-100';
      case 'clubs':
      case 'spades':
        return 'from-gray-100 via-white to-gray-100';
      default:
        return 'from-gray-100 via-white to-gray-100';
    }
  };

  const getCardBorder = (suit: CardType['suit']): string => {
    if (!card.isVisible) {
      return 'border-cyan-400';
    }
    
    return 'border-gray-800';
  };

  const getCardTextColor = (suit: CardType['suit']): string => {
    if (!card.isVisible) {
      return 'text-cyan-400';
    }
    
    return suit === 'hearts' || suit === 'diamonds' 
      ? 'text-red-600' 
      : 'text-black';
  };

  const getDisplayRank = (rank: CardType['rank']): string => {
    return rank;
  };

  if (!card.isVisible) {
    return (
      <div className={`
        relative w-16 h-24 rounded-lg border-2 
        bg-gradient-to-br ${getCardBackground(card.suit)}
        ${getCardBorder(card.suit)}
        ${isDealing ? 'card-deal' : ''}
        ${className}
        shadow-lg
        retro-card
      `}>
        {/* Card back pattern */}
        <div className="absolute inset-1 rounded-md bg-gradient-to-br from-blue-800 to-purple-800 border border-cyan-400">
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, var(--neon-cyan) 25%, var(--neon-cyan) 50%, transparent 50%),
                linear-gradient(-45deg, transparent 25%, var(--neon-pink) 25%, var(--neon-pink) 50%, transparent 50%)
              `,
              backgroundSize: '8px 8px'
            }} />
          </div>
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="retro-font text-xs text-cyan-400 neon-glow transform rotate-45">
              BJ
            </div>
          </div>
        </div>
        
        {/* Neon glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg opacity-20 blur-sm"></div>
      </div>
    );
  }

  return (
    <div className={`
      relative w-16 h-24 rounded-lg border-2 
      bg-gradient-to-br ${getCardBackground(card.suit)}
      ${getCardBorder(card.suit)}
      ${isDealing ? 'card-deal' : ''}
      ${className}
      shadow-lg
      hover:scale-105 transition-transform duration-200
    `}>
      {/* Corner rank and suit (top-left) */}
      <div className={`absolute top-1 left-1 retro-font text-xs ${getCardTextColor(card.suit)}`}>
        <div className="leading-none">{getDisplayRank(card.rank)}</div>
        <div className={`leading-none ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Corner rank and suit (bottom-right, rotated) */}
      <div className={`absolute bottom-1 right-1 retro-font text-xs ${getCardTextColor(card.suit)} transform rotate-180`}>
        <div className="leading-none">{getDisplayRank(card.rank)}</div>
        <div className={`leading-none ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Center suit symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`retro-font text-2xl ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>

      {/* Face card indicator */}
      {['J', 'Q', 'K'].includes(card.rank) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`retro-font text-xs ${getCardTextColor(card.suit)} bg-white bg-opacity-80 rounded px-1`}>
            {card.rank}
          </div>
        </div>
      )}

      {/* Ace indicator */}
      {card.rank === 'A' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`retro-font text-xl ${getSuitColor(card.suit)} drop-shadow-lg`}>
            {getSuitSymbol(card.suit)}
          </div>
        </div>
      )}

      {/* Number cards layout */}
      {!['J', 'Q', 'K', 'A'].includes(card.rank) && card.rank !== '10' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`retro-font text-lg ${getCardTextColor(card.suit)}`}>
            {getDisplayRank(card.rank)}
          </div>
        </div>
      )}

      {/* Special layout for 10 */}
      {card.rank === '10' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`retro-font text-sm ${getCardTextColor(card.suit)}`}>
            10
          </div>
        </div>
      )}

      {/* Pixel art border effect */}
      <div className="absolute inset-0 rounded-lg border border-gray-400 opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default Card;