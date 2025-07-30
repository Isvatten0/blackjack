import { Card, Hand, CardCounts } from '../types/game';

// Create a standard deck of cards
export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const deck: Card[] = [];
  
  suits.forEach(suit => {
    ranks.forEach(rank => {
      let value = 0;
      if (rank === 'A') {
        value = 11; // Ace starts as 11, will be adjusted in hand calculation
      } else if (['J', 'Q', 'K'].includes(rank)) {
        value = 10;
      } else {
        value = parseInt(rank);
      }
      
      deck.push({ suit, rank, value, isVisible: true });
    });
  });
  
  return deck;
};

// Create multiple decks and shuffle
export const createShuffledDecks = (numDecks: number): Card[] => {
  let multiDeck: Card[] = [];
  
  for (let i = 0; i < numDecks; i++) {
    multiDeck = [...multiDeck, ...createDeck()];
  }
  
  return shuffleDeck(multiDeck);
};

// Initialize card counts for detailed counter
export const initializeCardCounts = (numDecks: number): CardCounts => {
  return {
    '2': numDecks * 4,
    '3': numDecks * 4,
    '4': numDecks * 4,
    '5': numDecks * 4,
    '6': numDecks * 4,
    '7': numDecks * 4,
    '8': numDecks * 4,
    '9': numDecks * 4,
    '10': numDecks * 4,
    'J': numDecks * 4,
    'Q': numDecks * 4,
    'K': numDecks * 4,
    'A': numDecks * 4,
  };
};

// Update card counts when a card is dealt
export const updateCardCounts = (cardCounts: CardCounts, card: Card): CardCounts => {
  return {
    ...cardCounts,
    [card.rank]: Math.max(0, cardCounts[card.rank] - 1)
  };
};

// Calculate recommended bet based on true count
export const calculateRecommendedBet = (trueCount: number, baseBet: number = 10): number => {
  // Conservative Kelly Criterion approach
  if (trueCount <= 1) {
    return baseBet; // Minimum bet
  } else if (trueCount <= 2) {
    return baseBet * 2;
  } else if (trueCount <= 3) {
    return baseBet * 3;
  } else if (trueCount <= 4) {
    return baseBet * 4;
  } else {
    return baseBet * 5; // Maximum bet multiplier
  }
};

// Get standard chip denominations
export const getChipDenominations = (): number[] => {
  return [5, 10, 25, 50, 100];
};

// Fisher-Yates shuffle algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Calculate hand value considering Aces
export const calculateHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;
  
  cards.forEach(card => {
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

// Check if hand is blackjack
export const isBlackjack = (hand: Hand): boolean => {
  return hand.cards.length === 2 && hand.value === 21;
};

// Check if hand is bust
export const isBust = (hand: Hand): boolean => {
  return hand.value > 21;
};

// Update hand after adding a card
export const updateHand = (hand: Hand): Hand => {
  const value = calculateHandValue(hand.cards);
  return {
    ...hand,
    value,
    isBust: value > 21,
    isBlackjack: hand.cards.length === 2 && value === 21
  };
};

// Deal a card from deck
export const dealCard = (deck: Card[], hand: Hand, isVisible: boolean = true): { newDeck: Card[], newHand: Hand } => {
  if (deck.length === 0) {
    throw new Error('Deck is empty');
  }
  
  const newCard = { ...deck[0], isVisible };
  const newDeck = deck.slice(1);
  const newHand = updateHand({
    ...hand,
    cards: [...hand.cards, newCard]
  });
  
  return { newDeck, newHand };
};

// High-Low card counting
export const getCardCountValue = (card: Card): number => {
  const rank = card.rank;
  
  if (['2', '3', '4', '5', '6'].includes(rank)) {
    return 1; // Low cards
  } else if (['7', '8', '9'].includes(rank)) {
    return 0; // Neutral cards
  } else {
    return -1; // High cards (10, J, Q, K, A)
  }
};

// Update running count
export const updateRunningCount = (currentCount: number, card: Card): number => {
  return currentCount + getCardCountValue(card);
};

// Calculate true count
export const calculateTrueCount = (runningCount: number, decksRemaining: number): number => {
  if (decksRemaining <= 0) return 0;
  return runningCount / decksRemaining;
};

// Calculate approximate decks remaining
export const calculateDecksRemaining = (cardsLeft: number): number => {
  return Math.max(0.5, cardsLeft / 52);
};

// Check if deck needs reshuffling
export const needsReshuffle = (deck: Card[], totalCards: number): boolean => {
  return deck.length < (totalCards * 0.25); // Reshuffle when 75% used
};

// Get game speed settings
export const getSpeedSettings = (speed: string, customTimerLength?: number, customAnimationSpeed?: number) => {
  switch (speed) {
    case 'beginner':
      return { timerLength: 0, animationSpeed: 800 }; // No timer, slow animations
    case 'medium':
      return { timerLength: 10, animationSpeed: 500 }; // 10 seconds, medium animations
    case 'fast':
      return { timerLength: 3, animationSpeed: 200 }; // 3 seconds, fast animations
    case 'slow':
      return { timerLength: 0, animationSpeed: 1000 }; // No timer, very slow animations
    case 'custom':
      return { 
        timerLength: customTimerLength || 10, 
        animationSpeed: customAnimationSpeed || 500 
      };
    default:
      return { timerLength: 10, animationSpeed: 500 };
  }
};

// Determine game outcome
export const determineWinner = (playerHand: Hand, dealerHand: Hand): string => {
  if (playerHand.isBust) {
    return 'dealer'; // Player busts, dealer wins
  }
  
  if (dealerHand.isBust) {
    return 'player'; // Dealer busts, player wins
  }
  
  if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
    return 'player-blackjack'; // Player blackjack
  }
  
  if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
    return 'dealer'; // Dealer blackjack
  }
  
  if (playerHand.isBlackjack && dealerHand.isBlackjack) {
    return 'push'; // Both blackjack
  }
  
  if (playerHand.value > dealerHand.value) {
    return 'player'; // Player has higher value
  }
  
  if (dealerHand.value > playerHand.value) {
    return 'dealer'; // Dealer has higher value
  }
  
  return 'push'; // Same value
};

// Calculate winnings based on outcome
export const calculateWinnings = (bet: number, outcome: string): number => {
  switch (outcome) {
    case 'player':
      return bet; // 1:1 payout
    case 'player-blackjack':
      return Math.floor(bet * 1.5); // 3:2 payout
    case 'push':
      return 0; // No change
    case 'dealer':
      return -bet; // Lose bet
    default:
      return 0;
  }
};

// Check if dealer should hit (dealer hits on soft 17)
export const shouldDealerHit = (hand: Hand): boolean => {
  if (hand.value < 17) {
    return true;
  }
  
  // Check for soft 17 (Ace counted as 11)
  if (hand.value === 17) {
    const hasAce = hand.cards.some(card => card.rank === 'A');
    if (hasAce) {
      // Check if it's actually soft 17 (Ace is being counted as 11)
      let valueWithoutAce = 0;
      let aces = 0;
      
      hand.cards.forEach(card => {
        if (card.rank === 'A') {
          aces += 1;
        } else {
          valueWithoutAce += card.value;
        }
      });
      
      // If we can count an Ace as 11 and still have 17, it's soft
      if (valueWithoutAce + 11 + (aces - 1) === 17) {
        return true; // Soft 17, dealer hits
      }
    }
  }
  
  return false;
};