# 🃏 React Blackjack Game

A fully-featured, production-ready 2D Blackjack game built with React, TypeScript, and TailwindCSS. Features classic Blackjack gameplay with advanced features like card counting, customizable game speeds, and comprehensive statistics tracking.

## 🎮 Features

### Core Gameplay
- **Classic Blackjack Rules**: Standard 21-based gameplay with proper dealer rules
- **Proper Card Values**: Aces count as 1 or 11, face cards as 10
- **Dealer AI**: Dealer hits on soft 17, follows standard casino rules
- **Blackjack Detection**: Automatic detection and scoring of natural blackjacks

### Advanced Features
- **🎯 High-Low Card Counter**: 
  - Real-time running count display
  - True count calculation based on remaining decks
  - Toggleable visibility for practice
  - Color-coded advantage indicators

- **🎲 Deck Configuration**:
  - Choose from 1-6 decks
  - Automatic reshuffling when <50% cards remain
  - Realistic deck penetration

- **⚡ Speed Settings**:
  - **Beginner**: No timer, slow animations for learning
  - **Medium**: 10-second turn timer, moderate pace
  - **Fast**: 3-second timer, casino-style speed
  - **Custom**: Independent timer and animation speed controls

- **📊 Statistics Tracking**:
  - Win/loss/push tracking
  - Blackjack and bust counters
  - Win rate calculation
  - Persistent storage in localStorage

- **🔊 Sound Effects**:
  - Card dealing sounds
  - Win/loss audio feedback
  - Blackjack celebration sounds
  - Toggleable audio settings

### Technical Features
- **Responsive Design**: Mobile-friendly interface
- **2D Card Visualization**: Clean, casino-style card design
- **Smooth Animations**: Card dealing and flip animations
- **Persistent Settings**: All preferences saved locally
- **TypeScript**: Full type safety throughout
- **Modular Architecture**: Clean component separation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd blackjack-game

# Install dependencies
npm install

# Start development server
npm start
```

The game will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## 🎯 How to Play

1. **Start Game**: Click "Deal Cards" to begin
2. **Player Turn**: Choose "Hit" to draw cards or "Stand" to hold
3. **Goal**: Get as close to 21 as possible without going over
4. **Dealer Turn**: Dealer reveals hidden card and draws according to rules
5. **Winning**: 
   - Blackjack (21 with 2 cards) beats regular 21
   - Closest to 21 without busting wins
   - Ties are pushes (no winner)

## 🎛️ Game Settings

### Speed Configuration
- **Beginner**: Perfect for learning, no time pressure
- **Medium**: Balanced gameplay with reasonable timer
- **Fast**: Casino-style rapid play
- **Custom**: Fine-tune timer length (0-30s) and animation speed

### Deck Options
- **Single Deck**: Traditional gameplay
- **Multi-Deck**: Up to 6 decks for card counting practice

### Advanced Options
- **Card Counter**: Toggle High-Low counting system
- **Sound Effects**: Enable/disable audio feedback
- **Statistics**: Track performance over time

## 🧮 Card Counting Guide

The built-in High-Low counting system assigns values:
- **+1**: Cards 2, 3, 4, 5, 6 (low cards)
- **0**: Cards 7, 8, 9 (neutral)
- **-1**: Cards 10, J, Q, K, A (high cards)

**Running Count**: Sum of all card values seen
**True Count**: Running count ÷ estimated decks remaining
**Advantage**: Higher positive counts favor the player

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Card.tsx        # Individual card display
│   ├── PlayerHand.tsx  # Player's cards and status
│   ├── DealerHand.tsx  # Dealer's cards and status
│   ├── GameControls.tsx # Hit/Stand/Deal buttons
│   ├── CardCounter.tsx # Card counting display
│   ├── UISettings.tsx  # Settings panel
│   └── GameTable.tsx   # Main game orchestrator
├── types/              # TypeScript type definitions
│   └── game.ts         # Game interfaces and types
├── utils/              # Utility functions
│   ├── gameLogic.ts    # Core blackjack logic
│   ├── storage.ts      # localStorage management
│   └── sounds.ts       # Audio system
└── styles/             # CSS and styling
    └── index.css       # TailwindCSS imports
```

## 🛠️ Technical Details

### Built With
- **React 18** with hooks and functional components
- **TypeScript** for type safety
- **TailwindCSS** for styling and responsive design
- **Web Audio API** for sound effects
- **localStorage** for data persistence

### Key Algorithms
- **Fisher-Yates Shuffle**: Ensures truly random card distribution
- **Ace Calculation**: Dynamic adjustment of Ace values (1 or 11)
- **High-Low Counting**: Industry-standard card counting implementation
- **Dealer Logic**: Accurate soft-17 rules and decision making

### Performance Features
- **Memoized Components**: Optimized re-rendering
- **Callback Optimization**: Prevents unnecessary function recreation
- **Efficient State Management**: Minimal state updates
- **Background Processing**: Non-blocking game operations

## 🎨 Customization

The game is built with modularity in mind. Easy customization options:

- **Card Designs**: Modify the `Card.tsx` component
- **Sound Effects**: Update the `sounds.ts` utility
- **Game Rules**: Adjust logic in `gameLogic.ts`
- **Styling**: Customize TailwindCSS classes
- **New Features**: Add components following the existing pattern

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests (if added)
- `npm run eject` - Eject from Create React App

### Contributing
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with Web Audio API support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

Potential improvements for future versions:
- **Multiplayer Support**: Multiple players at one table
- **Side Bets**: Insurance, Perfect Pairs, 21+3
- **Tournament Mode**: Competitive gameplay
- **Advanced Strategies**: Basic strategy hints
- **Custom Card Decks**: Different visual themes
- **Achievement System**: Unlock rewards for milestones

---

**Enjoy playing Blackjack!** 🎰✨

For questions or support, please open an issue on the repository.
