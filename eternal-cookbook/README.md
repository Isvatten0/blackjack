# 🍳 Eternal Cookbook

> AI-powered recipe generation and cooking companion

A modern, mobile-first web application that uses AI to generate personalized recipes, help users discover what they can cook with available ingredients, and manage their recipe collection with optional Pro features.

## ✨ Features

### 🏠 Core Features
- **AI Recipe Generation**: Create custom recipes using OpenAI GPT-4/3.5
- **Fridge Mode**: Find recipes based on available ingredients
- **Recipe Management**: Save, organize, and favorite recipes
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Smart Search**: Filter recipes by cuisine, difficulty, dietary restrictions

### 💎 Pro Features
- Unlimited AI recipe generations
- Unlimited recipe storage
- PDF cookbook export
- Advanced filtering and organization
- No ads
- Priority support

### 🔧 Developer Features
- **Developer Access Key**: `2C4EF7920DAF4B6D9E10F1D338BC13EA`
- Unlimited access to all Pro features for testing
- Developer mode indicator in UI
- Full feature access without payment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (required for recipe generation)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd eternal-cookbook
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Add your OpenAI API key to `.env`:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173)

## 🔑 Developer Access

For testing and development, use the built-in developer access key:

1. Navigate to **Settings** page
2. Scroll to **Developer Access** section
3. Enter the key: `2C4EF7920DAF4B6D9E10F1D338BC13EA`
4. Click **Activate Developer Mode**

This grants unlimited access to all Pro features without payment.

## 📱 Pages & Features

### 🏠 Home
- Featured recipes
- Recent generations
- Quick access to main features
- Usage statistics

### ✨ Generate Recipe
- AI-powered recipe creation
- Custom ingredient selection
- Dietary restriction support
- Cuisine preferences
- Difficulty and serving options

### 🧊 Fridge Mode
- Recipe suggestions based on available ingredients
- "Must use" ingredient prioritization
- Pantry staples consideration
- Multiple recipe suggestions

### 📚 My Recipes
- Recipe collection management
- Search and filter functionality
- Favorite system
- PDF export functionality
- Recipe statistics

### 👑 Subscription
- Pro plan features and pricing
- Ad-watching for additional credits
- Referral system
- Stripe integration (demo)

### ⚙️ Settings
- Account information
- Developer access key input
- User preferences
- Privacy settings

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4/3.5 Turbo
- **PDF Export**: jsPDF
- **Notifications**: React Hot Toast

## 💰 Monetization Strategy

### Free Tier
- 3 AI recipe generations per day
- Save up to 10 recipes
- Basic features

### Earning More (Free Users)
- Watch ads for +3 generations
- Watch ads for +5 recipe save slots

### Pro Subscription ($4.99/month)
- Unlimited AI generations
- Unlimited recipe storage
- PDF export
- No ads
- Advanced features

### Referral Program
- Refer 5 friends = 1 month Pro free
- Progressive rewards system

## 🎨 Design System

### Colors
- **Primary**: Orange tones (#f97316)
- **Secondary**: Green tones (#22c55e)
- **UI**: Gray scale with soft shadows

### Layout
- Mobile-first responsive design
- Clean card-based interface
- Consistent spacing and typography
- Accessible color contrast

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── RecipeCard.jsx   # Recipe display component
├── pages/               # Page components
├── store/               # Zustand state management
├── lib/                 # Utilities and integrations
└── App.jsx             # Main app component
```

## 🔧 Configuration

### Environment Variables
- `VITE_OPENAI_API_KEY`: OpenAI API key (required)
- `VITE_FIREBASE_*`: Firebase config (optional)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe key (optional)

### Developer Key
The developer access key is hardcoded for testing purposes:
```javascript
const DEV_KEY = "2C4EF7920DAF4B6D9E10F1D338BC13EA";
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The app is ready for deployment on modern hosting platforms with environment variable support.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for demonstration purposes. Please respect API usage limits and terms of service for all integrated services.

## 🎯 Future Enhancements

- Recipe sharing and social features
- Meal planning calendar
- Shopping list generation
- Voice-guided cooking mode
- Nutritional analysis
- Recipe scaling and conversions
- Integration with grocery delivery services

---

**Made with ❤️ for home cooks everywhere**
