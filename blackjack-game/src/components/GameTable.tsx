import React, { useState, useEffect, useCallback } from 'react';
import { GameData, Hand, GameState, GameSettings, GameStats, CardCounts } from '../types/game';
import { 
  createShuffledDecks, 
  dealCard, 
  updateRunningCount, 
  updateCardCounts,
  initializeCardCounts,
  needsReshuffle,
  getSpeedSettings,
  determineWinner,
  shouldDealerHit,
  updateHand,
  calculateTrueCount,
  calculateDecksRemaining,
  calculateRecommendedBet,
  calculateWinnings
} from '../utils/gameLogic';
import { loadSettings, saveSettings, loadStats, saveStats, loadChipPot, saveChipPot } from '../utils/storage';
import { playCardDeal, playWin, playLoss, playBust, playBlackjack, playShuffle, setSoundEnabled } from '../utils/sounds';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import GameControls from './GameControls';
import CardCounter from './CardCounter';
import BettingInterface from './BettingInterface';
import UISettings from './UISettings';

const GameTable: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => {
    const settings = loadSettings();
    const stats = loadStats();
    const chipPot = loadChipPot();
    const initialDeck = createShuffledDecks(settings.numDecks);
    
    return {
      playerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      dealerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      deck: initialDeck,
      gameState: 'waiting' as GameState,
      gameMessage: 'Welcome to Retro Blackjack! Place your bet to start.',
      runningCount: 0,
      cardCounts: initializeCardCounts(settings.numDecks),
      settings,
      stats,
      turnTimeLeft: 0,
      chipPot,
      currentBet: 0,
      recommendedBet: 0,
      originalDeckSize: initialDeck.length,
    };
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCounterVisible, setIsCounterVisible] = useState(gameData.settings.showCardCounter);
  const [isDealing, setIsDealing] = useState(false);

  // Update sound setting when component mounts
  useEffect(() => {
    setSoundEnabled(gameData.settings.soundEnabled);
  }, [gameData.settings.soundEnabled]);

  const getAnimationSpeed = useCallback(() => {
    const speedSettings = getSpeedSettings(
      gameData.settings.speed,
      gameData.settings.customTimerLength,
      gameData.settings.customAnimationSpeed
    );
    return speedSettings.animationSpeed;
  }, [gameData.settings]);

  const getTimerLength = useCallback(() => {
    const speedSettings = getSpeedSettings(
      gameData.settings.speed,
      gameData.settings.customTimerLength,
      gameData.settings.customAnimationSpeed
    );
    // Slow speed mode has no timer
    return gameData.settings.speed === 'slow' ? 0 : speedSettings.timerLength;
  }, [gameData.settings]);

  // Calculate true count and recommended bet
  useEffect(() => {
    const decksRemaining = calculateDecksRemaining(gameData.deck.length);
    const trueCount = calculateTrueCount(gameData.runningCount, decksRemaining);
    const recommendedBet = calculateRecommendedBet(trueCount, 10);
    
    setGameData(prev => ({
      ...prev,
      recommendedBet
    }));
  }, [gameData.runningCount, gameData.deck.length]);

  // Timer effect for player turn
  useEffect(() => {
    if (gameData.gameState === 'player-turn' && gameData.turnTimeLeft > 0) {
      const timer = setTimeout(() => {
        setGameData(prev => ({
          ...prev,
          turnTimeLeft: Math.max(0, prev.turnTimeLeft - 1)
        }));
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Auto-stand when timer reaches 0 (only if not in slow mode)
    if (gameData.gameState === 'player-turn' && gameData.turnTimeLeft === 0 && getTimerLength() > 0) {
      handleStand();
    }
  }, [gameData.gameState, gameData.turnTimeLeft, getTimerLength]);

  const updateGameStats = useCallback((playerHand: Hand, dealerHand: Hand, winnings: number) => {
    const winner = determineWinner(playerHand, dealerHand);
    const newStats = { ...gameData.stats };

    switch (winner) {
      case 'player':
      case 'player-blackjack':
        newStats.wins += 1;
        if (winner === 'player-blackjack') {
          newStats.blackjacks += 1;
        }
        newStats.totalChipsWon += Math.abs(winnings);
        break;
      case 'dealer':
        newStats.losses += 1;
        newStats.totalChipsLost += Math.abs(winnings);
        break;
      case 'push':
        newStats.pushes += 1;
        break;
    }

    if (playerHand.isBust) {
      newStats.busts += 1;
    }

    setGameData(prev => ({ ...prev, stats: newStats }));
    saveStats(newStats);
  }, [gameData.stats]);

  const handleBetChange = useCallback((bet: number) => {
    setGameData(prev => ({ ...prev, currentBet: bet }));
  }, []);

  const handleBetClear = useCallback(() => {
    setGameData(prev => ({ ...prev, currentBet: 0 }));
  }, []);

  const handleBetConfirm = useCallback(() => {
    if (gameData.currentBet > 0 && gameData.currentBet <= gameData.chipPot) {
      setGameData(prev => ({ 
        ...prev, 
        gameState: 'dealing',
        gameMessage: 'Dealing cards...'
      }));
      handleDealCards();
    }
  }, [gameData.currentBet, gameData.chipPot]);

  const reshuffleDeck = useCallback(() => {
    const newDeck = createShuffledDecks(gameData.settings.numDecks);
    setGameData(prev => ({
      ...prev,
      deck: newDeck,
      cardCounts: initializeCardCounts(prev.settings.numDecks),
      runningCount: 0,
      originalDeckSize: newDeck.length
    }));
    playShuffle();
  }, [gameData.settings.numDecks]);

  const handleDealCards = useCallback(async () => {
    if (gameData.gameState !== 'dealing') return;

    setIsDealing(true);
    let currentDeck = [...gameData.deck];
    let currentRunningCount = gameData.runningCount;
    let currentCardCounts = { ...gameData.cardCounts };

    const animationSpeed = getAnimationSpeed();

    // Check if deck needs reshuffling
    if (needsReshuffle(currentDeck, gameData.originalDeckSize)) {
      currentDeck = createShuffledDecks(gameData.settings.numDecks);
      currentCardCounts = initializeCardCounts(gameData.settings.numDecks);
      currentRunningCount = 0;
      
      playShuffle();
      setGameData(prev => ({ 
        ...prev, 
        deck: currentDeck,
        cardCounts: currentCardCounts,
        runningCount: 0,
        originalDeckSize: currentDeck.length,
        gameMessage: 'Shuffling new deck...' 
      }));
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Create empty hands
    let playerHand: Hand = { cards: [], value: 0, isBust: false, isBlackjack: false };
    let dealerHand: Hand = { cards: [], value: 0, isBust: false, isBlackjack: false };

    // Deal player first card
    const { newDeck: deck1, newHand: playerHand1 } = dealCard(currentDeck, playerHand);
    const dealtCard1 = playerHand1.cards[playerHand1.cards.length - 1];
    currentDeck = deck1;
    playerHand = playerHand1;
    currentRunningCount = updateRunningCount(currentRunningCount, dealtCard1);
    currentCardCounts = updateCardCounts(currentCardCounts, dealtCard1);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      playerHand: playerHand1, 
      deck: deck1,
      runningCount: currentRunningCount,
      cardCounts: currentCardCounts
    }));
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Deal dealer first card (visible)
    const { newDeck: deck2, newHand: dealerHand1 } = dealCard(currentDeck, dealerHand);
    const dealtCard2 = dealerHand1.cards[dealerHand1.cards.length - 1];
    currentDeck = deck2;
    dealerHand = dealerHand1;
    currentRunningCount = updateRunningCount(currentRunningCount, dealtCard2);
    currentCardCounts = updateCardCounts(currentCardCounts, dealtCard2);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      dealerHand: dealerHand1, 
      deck: deck2,
      runningCount: currentRunningCount,
      cardCounts: currentCardCounts
    }));
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Deal player second card
    const { newDeck: deck3, newHand: playerHand2 } = dealCard(currentDeck, playerHand);
    const dealtCard3 = playerHand2.cards[playerHand2.cards.length - 1];
    currentDeck = deck3;
    playerHand = playerHand2;
    currentRunningCount = updateRunningCount(currentRunningCount, dealtCard3);
    currentCardCounts = updateCardCounts(currentCardCounts, dealtCard3);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      playerHand: playerHand2, 
      deck: deck3,
      runningCount: currentRunningCount,
      cardCounts: currentCardCounts
    }));
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Deal dealer second card (hidden)
    const { newDeck: deck4, newHand: dealerHand2 } = dealCard(currentDeck, dealerHand, false);
    currentDeck = deck4;
    dealerHand = dealerHand2;
    playCardDeal();
    
    // Check for blackjacks
    const timerLength = getTimerLength();
    let newGameState: GameState = 'player-turn';
    let gameMessage = gameData.settings.speed === 'slow' 
      ? 'Your turn! Take your time to decide.'
      : `Your turn! Hit or Stand? (${timerLength}s)`;
    
    if (playerHand.isBlackjack || dealerHand.isBlackjack) {
      newGameState = 'game-over';
      if (playerHand.isBlackjack && dealerHand.isBlackjack) {
        gameMessage = 'Both have Blackjack! Push!';
      } else if (playerHand.isBlackjack) {
        gameMessage = 'Blackjack! You win!';
      } else {
        gameMessage = 'Dealer has Blackjack! You lose!';
      }
    }

    setGameData(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: currentDeck,
      runningCount: currentRunningCount,
      cardCounts: currentCardCounts,
      gameState: newGameState,
      gameMessage,
      turnTimeLeft: newGameState === 'player-turn' ? timerLength : 0
    }));

    setIsDealing(false);

    // Handle game end for blackjacks
    if (newGameState === 'game-over') {
      const winner = determineWinner(playerHand, dealerHand);
      const winnings = calculateWinnings(gameData.currentBet, winner);
      const newChipPot = gameData.chipPot + winnings;
      
      updateGameStats(playerHand, dealerHand, winnings);
      
      setGameData(prev => ({ 
        ...prev, 
        chipPot: newChipPot 
      }));
      saveChipPot(newChipPot);

      // Play appropriate sound for blackjack outcomes
      if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
        playBlackjack();
      } else if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
        playLoss();
      }
    }
  }, [gameData, getAnimationSpeed, getTimerLength, updateGameStats]);

  const handleHit = useCallback(async () => {
    if (gameData.gameState !== 'player-turn') return;

    const animationSpeed = getAnimationSpeed();
    const { newDeck, newHand } = dealCard(gameData.deck, gameData.playerHand);
    const dealtCard = newHand.cards[newHand.cards.length - 1];
    const newRunningCount = updateRunningCount(gameData.runningCount, dealtCard);
    const newCardCounts = updateCardCounts(gameData.cardCounts, dealtCard);
    
    playCardDeal();

    let newGameState: GameState = 'player-turn';
    let gameMessage = gameData.settings.speed === 'slow'
      ? 'Your turn! Take your time to decide.'
      : `Your turn! Hit or Stand? (${getTimerLength()}s)`;
    let turnTimeLeft = getTimerLength();

    if (newHand.isBust) {
      newGameState = 'game-over';
      gameMessage = 'Bust! You lose!';
      turnTimeLeft = 0;
      playBust();
    }

    setGameData(prev => ({
      ...prev,
      playerHand: newHand,
      deck: newDeck,
      runningCount: newRunningCount,
      cardCounts: newCardCounts,
      gameState: newGameState,
      gameMessage,
      turnTimeLeft
    }));

    if (newGameState === 'game-over') {
      const winnings = calculateWinnings(gameData.currentBet, 'dealer');
      const newChipPot = gameData.chipPot + winnings;
      
      updateGameStats(newHand, gameData.dealerHand, winnings);
      
      setGameData(prev => ({ 
        ...prev, 
        chipPot: newChipPot 
      }));
      saveChipPot(newChipPot);
    }
  }, [gameData, getAnimationSpeed, getTimerLength, updateGameStats]);

  const handleStand = useCallback(async () => {
    if (gameData.gameState !== 'player-turn') return;

    setGameData(prev => ({ 
      ...prev, 
      gameState: 'dealer-turn',
      gameMessage: 'Dealer playing...',
      turnTimeLeft: 0
    }));

    // Reveal dealer's hidden card
    const revealedDealerHand = updateHand({
      ...gameData.dealerHand,
      cards: gameData.dealerHand.cards.map(card => ({ ...card, isVisible: true }))
    });

    let newRunningCount = updateRunningCount(gameData.runningCount, revealedDealerHand.cards[1]);
    let newCardCounts = updateCardCounts(gameData.cardCounts, revealedDealerHand.cards[1]);
    
    setGameData(prev => ({ 
      ...prev, 
      dealerHand: revealedDealerHand,
      runningCount: newRunningCount,
      cardCounts: newCardCounts
    }));

    const animationSpeed = getAnimationSpeed();
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Dealer draws cards
    let currentDeck = [...gameData.deck];
    let currentDealerHand = { ...revealedDealerHand };

    while (shouldDealerHit(currentDealerHand)) {
      const dealResult = dealCard(currentDeck, currentDealerHand);
      const dealtCard = dealResult.newHand.cards[dealResult.newHand.cards.length - 1];
      currentDeck = dealResult.newDeck;
      currentDealerHand = dealResult.newHand;
      newRunningCount = updateRunningCount(newRunningCount, dealtCard);
      newCardCounts = updateCardCounts(newCardCounts, dealtCard);
      playCardDeal();
      
      setGameData(prev => ({ 
        ...prev, 
        dealerHand: currentDealerHand, 
        deck: currentDeck,
        runningCount: newRunningCount,
        cardCounts: newCardCounts
      }));
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Determine winner and update chips
    const winner = determineWinner(gameData.playerHand, currentDealerHand);
    const winnings = calculateWinnings(gameData.currentBet, winner);
    const newChipPot = gameData.chipPot + winnings;
    
    let gameMessage = '';
    switch (winner) {
      case 'player':
        gameMessage = `You win! +$${Math.abs(winnings)}`;
        playWin();
        break;
      case 'player-blackjack':
        gameMessage = `Blackjack! +$${Math.abs(winnings)}`;
        playBlackjack();
        break;
      case 'dealer':
        gameMessage = `Dealer wins! -$${Math.abs(winnings)}`;
        playLoss();
        break;
      case 'push':
        gameMessage = 'Push! Bet returned.';
        break;
    }

    updateGameStats(gameData.playerHand, currentDealerHand, winnings);
    
    setGameData(prev => ({
      ...prev,
      gameState: 'game-over',
      gameMessage,
      chipPot: newChipPot
    }));
    
    saveChipPot(newChipPot);
  }, [gameData, getAnimationSpeed, updateGameStats]);

  const handleNewGame = useCallback(() => {
    setGameData(prev => ({
      ...prev,
      playerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      dealerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      gameState: 'waiting',
      gameMessage: 'Place your bet to start a new game.',
      turnTimeLeft: 0,
      currentBet: 0
    }));
  }, []);

  const handleSettingsUpdate = useCallback((newSettings: GameSettings) => {
    // If number of decks changed, reshuffle
    if (newSettings.numDecks !== gameData.settings.numDecks) {
      const newDeck = createShuffledDecks(newSettings.numDecks);
      setGameData(prev => ({
        ...prev,
        settings: newSettings,
        deck: newDeck,
        cardCounts: initializeCardCounts(newSettings.numDecks),
        runningCount: 0,
        originalDeckSize: newDeck.length
      }));
    } else {
      setGameData(prev => ({ ...prev, settings: newSettings }));
    }
    
    saveSettings(newSettings);
    setSoundEnabled(newSettings.soundEnabled);
    setIsCounterVisible(newSettings.showCardCounter);
  }, [gameData.settings.numDecks]);

  const toggleCounter = useCallback(() => {
    setIsCounterVisible(!isCounterVisible);
  }, [isCounterVisible]);

  const toggleDetailedCounter = useCallback(() => {
    const newSettings = { 
      ...gameData.settings, 
      showDetailedCounter: !gameData.settings.showDetailedCounter 
    };
    handleSettingsUpdate(newSettings);
  }, [gameData.settings, handleSettingsUpdate]);

  const decksRemaining = calculateDecksRemaining(gameData.deck.length);
  const trueCount = calculateTrueCount(gameData.runningCount, decksRemaining);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Retro grid background effect */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Main game title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="retro-font text-2xl md:text-4xl text-cyan-400 neon-glow neon-pulse text-center">
          RETRO BLACKJACK
        </h1>
        <div className="retro-font-alt text-center text-xs text-purple-400 mt-1">
          Card Counting • Chip Betting • 80s Style
        </div>
      </div>

      {/* Card Counter */}
      <CardCounter
        runningCount={gameData.runningCount}
        trueCount={trueCount}
        isVisible={isCounterVisible}
        onToggle={toggleCounter}
        deckCount={decksRemaining}
        cardCounts={gameData.cardCounts}
        showDetailedCounter={gameData.settings.showDetailedCounter}
        onToggleDetailed={toggleDetailedCounter}
      />

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsVisible(!isSettingsVisible)}
        className="absolute top-4 right-4 retro-button border-purple-400 text-purple-400 z-10"
      >
        ⚙️ Settings
      </button>

      {/* Dealer Hand */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
        <DealerHand
          hand={gameData.dealerHand}
          isDealing={isDealing}
          gameState={gameData.gameState}
        />
      </div>

      {/* Game message and deck info */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <div className="retro-card p-4 mb-4">
          <div className="retro-font-alt text-lg text-cyan-400 neon-glow mb-2">
            {gameData.gameMessage}
          </div>
          
          {gameData.gameState === 'player-turn' && gameData.turnTimeLeft > 0 && (
            <div className="retro-font text-yellow-400">
              Time: {gameData.turnTimeLeft}s
            </div>
          )}
          
          <div className="retro-font-alt text-xs text-gray-400 mt-2 space-y-1">
            <div>Deck: {gameData.deck.length} cards remaining</div>
            <div>Penetration: {(((gameData.originalDeckSize - gameData.deck.length) / gameData.originalDeckSize) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
        <PlayerHand
          hand={gameData.playerHand}
          isDealing={isDealing}
        />
      </div>

      {/* Chip Pot Display */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="retro-card p-3 text-center">
          <div className="retro-font-alt text-xs text-gray-400 mb-1">CHIP POT</div>
          <div className="retro-font text-lg text-green-400 neon-glow">
            ${gameData.chipPot}
          </div>
          {gameData.currentBet > 0 && (
            <div className="retro-font-alt text-xs text-yellow-400 mt-1">
              Bet: ${gameData.currentBet}
            </div>
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <GameControls
          gameState={gameData.gameState}
          onHit={handleHit}
          onStand={handleStand}
          onNewGame={handleNewGame}
          onDealCards={handleDealCards}
          isDealing={isDealing}
          chipPot={gameData.chipPot}
          currentBet={gameData.currentBet}
        />
      </div>

      {/* Betting Interface */}
      <BettingInterface
        chipPot={gameData.chipPot}
        currentBet={gameData.currentBet}
        recommendedBet={gameData.recommendedBet}
        onBetChange={handleBetChange}
        onBetConfirm={handleBetConfirm}
        onBetClear={handleBetClear}
        isVisible={gameData.gameState === 'waiting'}
        minBet={5}
        maxBet={gameData.chipPot}
      />

      {/* Settings Panel */}
      {isSettingsVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <UISettings
            settings={gameData.settings}
            stats={gameData.stats}
            onSettingsUpdate={handleSettingsUpdate}
            onClose={() => setIsSettingsVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default GameTable;