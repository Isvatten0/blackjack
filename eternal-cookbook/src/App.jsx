import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navigation from './components/layout/Navigation';

// Pages
import Home from './pages/Home';
import GenerateRecipe from './pages/GenerateRecipe';
import FridgeMode from './pages/FridgeMode';
import MyRecipes from './pages/MyRecipes';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';

// Store
import useAppStore from './store/useAppStore';

function App() {
  // Initialize store on app load
  const { resetDailyUsage } = useAppStore();
  
  React.useEffect(() => {
    resetDailyUsage();
  }, [resetDailyUsage]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<GenerateRecipe />} />
            <Route path="/fridge" element={<FridgeMode />} />
            <Route path="/recipes" element={<MyRecipes />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
