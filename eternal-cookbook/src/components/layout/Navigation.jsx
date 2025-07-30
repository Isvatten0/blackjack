import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, Home, Sparkles, Refrigerator, BookOpen, Crown, Settings } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDeveloperMode, isProUser, getRemainingApiCalls } = useAppStore();
  
  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/generate', icon: Sparkles, label: 'Generate' },
    { path: '/fridge', icon: Refrigerator, label: 'Fridge' },
    { path: '/recipes', icon: BookOpen, label: 'My Recipes' },
    { path: '/subscription', icon: Crown, label: 'Pro' }
  ];
  
  const remainingCalls = getRemainingApiCalls();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900">
              Eternal Cookbook
            </span>
            {isDeveloperMode && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                👨‍💻 Developer Mode
              </span>
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* API Usage Indicator */}
            {!isDeveloperMode && !isProUser && (
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {remainingCalls === Infinity ? '∞' : remainingCalls} calls left
              </div>
            )}
            
            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            
            {/* Mobile API Usage */}
            {!isDeveloperMode && !isProUser && (
              <div className="px-3 py-2">
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg text-center">
                  {remainingCalls === Infinity ? '∞' : remainingCalls} API calls remaining today
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;