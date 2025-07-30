import React, { useState, useEffect, useCallback } from 'react';
import { GameData, Hand, GameState, GameSettings, GameStats } from '../types/game';
import { 
  createShuffledDecks, 
  dealCard, 
  updateRunningCount, 
  needsReshuffle,
  getSpeedSettings,
  determineWinner,
  shouldDealerHit,
  updateHand
} from '../utils/gameLogic';
import { loadSettings, saveSettings, loadStats, saveStats } from '../utils/storage';
import { playCardDeal, playWin, playLoss, playBust, playBlackjack, playShuffle, setSoundEnabled } from '../utils/sounds';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import GameControls from './GameControls';
import CardCounter from './CardCounter';
import UISettings from './UISettings';

const GameTable: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => {
    const settings = loadSettings();
    const stats = loadStats();
    
    return {
      playerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      dealerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      deck: createShuffledDecks(settings.numDecks),
      gameState: 'waiting' as GameState,
      gameMessage: 'Welcome to Blackjack! Click Deal Cards to start.',
      runningCount: 0,
      settings,
      stats,
      turnTimeLeft: 0,
    };
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCounterVisible, setIsCounterVisible] = useState(gameData.settings.showCardCounter);
  const [isDealing, setIsDealing] = useState(false);

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
    return speedSettings.timerLength;
  }, [gameData.settings]);

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
    
    setGameData(prev => ({ 
      ...prev, 
      dealerHand: revealedDealerHand,
      runningCount: newRunningCount
    }));

    const animationSpeed = getAnimationSpeed();
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Dealer draws cards
    let currentDeck = [...gameData.deck];
    let currentDealerHand = { ...revealedDealerHand };

    while (shouldDealerHit(currentDealerHand)) {
      const dealResult = dealCard(currentDeck, currentDealerHand);
      currentDeck = dealResult.newDeck;
      currentDealerHand = dealResult.newHand;
      newRunningCount = updateRunningCount(newRunningCount, dealResult.newHand.cards[dealResult.newHand.cards.length - 1]);
      playCardDeal();
      
      setGameData(prev => ({ 
        ...prev, 
        dealerHand: currentDealerHand, 
        deck: currentDeck,
        runningCount: newRunningCount
      }));
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Determine winner
    const winner = determineWinner(gameData.playerHand, currentDealerHand);
    let gameMessage = '';
    
    switch (winner) {
      case 'player':
        gameMessage = 'You win!';
        playWin();
        break;
      case 'player-blackjack':
        gameMessage = 'Blackjack! You win!';
        playBlackjack();
        break;
      case 'dealer':
        gameMessage = 'Dealer wins!';
        if (currentDealerHand.isBust) {
          playWin(); // Player wins because dealer busted
        } else {
          playLoss();
        }
        break;
      case 'push':
        gameMessage = 'Push! It\'s a tie!';
        break;
    }

    setGameData(prev => ({
      ...prev,
      dealerHand: currentDealerHand,
      deck: currentDeck,
      runningCount: newRunningCount,
      gameState: 'game-over',
      gameMessage
    }));

    updateGameStats(gameData.playerHand, currentDealerHand);
  }, [gameData, getAnimationSpeed]);

  // Timer for player turns
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (gameData.gameState === 'player-turn' && gameData.turnTimeLeft > 0) {
      timer = setTimeout(() => {
        setGameData(prev => ({
          ...prev,
          turnTimeLeft: prev.turnTimeLeft - 1
        }));
      }, 1000);
    } else if (gameData.gameState === 'player-turn' && gameData.turnTimeLeft === 0) {
      // Auto-stand when timer runs out
      handleStand();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameData.gameState, gameData.turnTimeLeft, handleStand]);

  // Save settings and stats when they change
  useEffect(() => {
    saveSettings(gameData.settings);
  }, [gameData.settings]);

  useEffect(() => {
    saveStats(gameData.stats);
  }, [gameData.stats]);

  // Update counter visibility when settings change
  useEffect(() => {
    setIsCounterVisible(gameData.settings.showCardCounter);
  }, [gameData.settings.showCardCounter]);

  // Update sound settings when they change
  useEffect(() => {
    setSoundEnabled(gameData.settings.soundEnabled);
  }, [gameData.settings.soundEnabled]);

  const dealInitialCards = useCallback(async () => {
    setIsDealing(true);
    setGameData(prev => ({ ...prev, gameState: 'dealing', gameMessage: 'Dealing cards...' }));

    const animationSpeed = getAnimationSpeed();
    let currentDeck = [...gameData.deck];
    let currentRunningCount = gameData.runningCount;
    
    // Check if we need to reshuffle
    const totalCards = gameData.settings.numDecks * 52;
    if (needsReshuffle(currentDeck, totalCards)) {
      currentDeck = createShuffledDecks(gameData.settings.numDecks);
      currentRunningCount = 0;
      playShuffle();
      setGameData(prev => ({ 
        ...prev, 
        deck: currentDeck,
        runningCount: 0,
        gameMessage: 'Shuffling new deck...' 
      }));
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }

    // Create empty hands
    let playerHand: Hand = { cards: [], value: 0, isBust: false, isBlackjack: false };
    let dealerHand: Hand = { cards: [], value: 0, isBust: false, isBlackjack: false };

    // Deal player first card
    const { newDeck: deck1, newHand: playerHand1 } = dealCard(currentDeck, playerHand);
    currentDeck = deck1;
    playerHand = playerHand1;
    currentRunningCount = updateRunningCount(currentRunningCount, playerHand1.cards[playerHand1.cards.length - 1]);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      playerHand: playerHand1, 
      deck: deck1,
      runningCount: currentRunningCount 
    }));
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Deal dealer first card (visible)
    const { newDeck: deck2, newHand: dealerHand1 } = dealCard(currentDeck, dealerHand);
    currentDeck = deck2;
    dealerHand = dealerHand1;
    currentRunningCount = updateRunningCount(currentRunningCount, dealerHand1.cards[dealerHand1.cards.length - 1]);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      dealerHand: dealerHand1, 
      deck: deck2,
      runningCount: currentRunningCount 
    }));
    await new Promise(resolve => setTimeout(resolve, animationSpeed));

    // Deal player second card
    const { newDeck: deck3, newHand: playerHand2 } = dealCard(currentDeck, playerHand);
    currentDeck = deck3;
    playerHand = playerHand2;
    currentRunningCount = updateRunningCount(currentRunningCount, playerHand2.cards[playerHand2.cards.length - 1]);
    playCardDeal();
    
    setGameData(prev => ({ 
      ...prev, 
      playerHand: playerHand2, 
      deck: deck3,
      runningCount: currentRunningCount 
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
    let gameMessage = 'Your turn! Hit or Stand?';
    
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
      gameState: newGameState,
      gameMessage,
      turnTimeLeft: newGameState === 'player-turn' ? timerLength : 0
    }));

    setIsDealing(false);

    // Update stats for blackjacks
    if (newGameState === 'game-over') {
      updateGameStats(playerHand, dealerHand);
      // Play appropriate sound for blackjack outcomes
      if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
        playBlackjack();
      } else if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
        playLoss();
      }
    }
  }, [gameData.deck, gameData.runningCount, gameData.settings, getAnimationSpeed, getTimerLength]);

  const handleHit = useCallback(() => {
    if (gameData.gameState !== 'player-turn') return;

    const { newDeck, newHand } = dealCard(gameData.deck, gameData.playerHand);
    const newRunningCount = updateRunningCount(gameData.runningCount, newHand.cards[newHand.cards.length - 1]);
    playCardDeal();
    
    let newGameState: GameState = 'player-turn';
    let gameMessage = 'Your turn! Hit or Stand?';
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
      gameState: newGameState,
      gameMessage,
      turnTimeLeft
    }));

    if (newGameState === 'game-over') {
      updateGameStats(newHand, gameData.dealerHand);
    }
  }, [gameData, getTimerLength]);

  const updateGameStats = (playerHand: Hand, dealerHand: Hand) => {
    const winner = determineWinner(playerHand, dealerHand);
    
    setGameData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        wins: prev.stats.wins + (winner === 'player' || winner === 'player-blackjack' ? 1 : 0),
        losses: prev.stats.losses + (winner === 'dealer' ? 1 : 0),
        pushes: prev.stats.pushes + (winner === 'push' ? 1 : 0),
        blackjacks: prev.stats.blackjacks + (playerHand.isBlackjack ? 1 : 0),
        busts: prev.stats.busts + (playerHand.isBust ? 1 : 0)
      }
    }));
  };

  const handleNewGame = () => {
    let newDeck = gameData.deck;
    let newRunningCount = gameData.runningCount;

    // Check if we need to reshuffle
    if (needsReshuffle(newDeck, gameData.settings.numDecks * 52)) {
      newDeck = createShuffledDecks(gameData.settings.numDecks);
      newRunningCount = 0;
    }

    setGameData(prev => ({
      ...prev,
      playerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      dealerHand: { cards: [], value: 0, isBust: false, isBlackjack: false },
      deck: newDeck,
      gameState: 'waiting',
      gameMessage: 'Click Deal Cards to start a new game.',
      runningCount: newRunningCount,
      turnTimeLeft: 0
    }));
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setGameData(prev => ({
      ...prev,
      settings: newSettings
    }));

    // If deck count changed, create new deck
    if (newSettings.numDecks !== gameData.settings.numDecks) {
      const newDeck = createShuffledDecks(newSettings.numDecks);
      setGameData(prev => ({
        ...prev,
        deck: newDeck,
        runningCount: 0
      }));
    }
  };

  const handleClearStats = () => {
    const newStats: GameStats = {
      wins: 0,
      losses: 0,
      pushes: 0,
      blackjacks: 0,
      busts: 0
    };
    
    setGameData(prev => ({
      ...prev,
      stats: newStats
    }));
  };

  const estimateDecksRemaining = () => {
    const totalCards = gameData.settings.numDecks * 52;
    const cardsRemaining = gameData.deck.length;
    return Math.max(1, Math.ceil(cardsRemaining / 52));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-green-felt relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Card Counter */}
      <CardCounter
        runningCount={gameData.runningCount}
        isVisible={isCounterVisible}
        onToggle={() => setIsCounterVisible(!isCounterVisible)}
        deckCount={estimateDecksRemaining()}
      />

      {/* Settings */}
      <UISettings
        settings={gameData.settings}
        stats={gameData.stats}
        onSettingsChange={handleSettingsChange}
        onClearStats={handleClearStats}
        isVisible={isSettingsVisible}
        onToggle={() => setIsSettingsVisible(!isSettingsVisible)}
      />

      {/* Main game area */}
      <div className="relative z-5 flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        {/* Game title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">
            Blackjack
          </h1>
          <div className="text-lg sm:text-xl text-green-200">
            {gameData.gameMessage}
          </div>
        </div>

        {/* Dealer area */}
        <div className="w-full max-w-4xl">
          <DealerHand 
            hand={gameData.dealerHand}
            isDealing={isDealing}
            animationSpeed={getAnimationSpeed()}
          />
        </div>

        {/* Game controls */}
        <div className="my-8">
          <GameControls
            gameState={gameData.gameState}
            onHit={handleHit}
            onStand={handleStand}
            onDeal={dealInitialCards}
            onNewGame={handleNewGame}
            turnTimeLeft={gameData.turnTimeLeft}
            isTimerActive={getTimerLength() > 0}
          />
        </div>

        {/* Player area */}
        <div className="w-full max-w-4xl">
          <PlayerHand 
            hand={gameData.playerHand}
            isDealing={isDealing}
            animationSpeed={getAnimationSpeed()}
          />
        </div>
      </div>
    </div>
  );
};

export default GameTable;