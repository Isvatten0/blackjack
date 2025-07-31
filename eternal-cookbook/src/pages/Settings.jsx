import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, User, Bell, Shield, Code, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { 
    isDeveloperMode, 
    isProUser, 
    setDeveloperMode, 
    disableDeveloperMode,
    getRemainingApiCalls,
    savedRecipesCount 
  } = useAppStore();
  
  const [devKey, setDevKey] = useState('');
  const [showDevKey, setShowDevKey] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  
  const handleEnableDeveloperMode = () => {
    if (!devKey.trim()) {
      toast.error('Please enter a developer key');
      return;
    }
    
    const success = setDeveloperMode(devKey);
    if (success) {
      setDevModeEnabled(true);
      toast.success('🎉 Developer Mode activated! You now have unlimited access.');
      setDevKey('');
    } else {
      toast.error('Invalid developer key. Please check and try again.');
    }
  };
  
  const handleDisableDeveloperMode = () => {
    disableDeveloperMode();
    setDevModeEnabled(false);
    toast.success('Developer Mode disabled');
  };
  
  const remainingCalls = getRemainingApiCalls();
  
  const settingsSections = [
    {
      title: 'Account Information',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Account Type</h4>
              <p className="text-gray-600">
                {isDeveloperMode ? 'Developer' : isProUser ? 'Pro User' : 'Free User'}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">API Usage</h4>
              <p className="text-gray-600">
                {isDeveloperMode || isProUser ? 'Unlimited' : `${remainingCalls}/3 remaining today`}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Saved Recipes</h4>
              <p className="text-gray-600">
                {isDeveloperMode || isProUser ? `${savedRecipesCount} (unlimited)` : `${savedRecipesCount}/10`}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Member Since</h4>
              <p className="text-gray-600">January 2024</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Developer Access',
      icon: Code,
      content: (
        <div className="space-y-6">
          {isDeveloperMode ? (
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">
                    👨‍💻 Developer Mode Active
                  </h4>
                  <p className="text-purple-700 text-sm">
                    You have unlimited access to all Pro features for development and testing.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisableDeveloperMode}
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  Disable
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Enable Developer Mode
                </h4>
                <p className="text-blue-700 text-sm mb-4">
                  Enter your developer access key to unlock unlimited features for testing and development.
                </p>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showDevKey ? 'text' : 'password'}
                      value={devKey}
                      onChange={(e) => setDevKey(e.target.value)}
                      placeholder="Enter developer key..."
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDevKey(!showDevKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showDevKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <Button
                    onClick={handleEnableDeveloperMode}
                    className="w-full"
                    disabled={!devKey.trim()}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Activate Developer Mode
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Developer mode is intended for testing purposes only. 
                    It grants full access to all Pro features without payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Preferences',
      icon: SettingsIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recipe Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Default serving size</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>2 people</option>
                  <option>4 people</option>
                  <option>6 people</option>
                  <option>8 people</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Preferred cuisine</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>No preference</option>
                  <option>Italian</option>
                  <option>Asian</option>
                  <option>Mexican</option>
                  <option>Mediterranean</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Dietary restrictions</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>None</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Gluten-free</option>
                  <option>Dairy-free</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Display Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Measurement units</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>Imperial (cups, oz)</option>
                  <option>Metric (ml, g)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Theme</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Recipe recommendations</h4>
              <p className="text-sm text-gray-600">Get personalized recipe suggestions</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Daily cooking tips</h4>
              <p className="text-sm text-gray-600">Receive helpful cooking tips and tricks</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">New features</h4>
              <p className="text-sm text-gray-600">Be the first to know about new features</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing emails</h4>
              <p className="text-sm text-gray-600">Special offers and promotions</p>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Download my data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Delete account
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Make recipes public</label>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Analytics tracking</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-primary-500" />
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and developer settings
          </p>
        </div>
        
        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <Card.Header>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Icon className="h-5 w-5 mr-2 text-primary-500" />
                    {section.title}
                  </h2>
                </Card.Header>
                
                <Card.Content>
                  {section.content}
                </Card.Content>
              </Card>
            );
          })}
        </div>
        
        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            onClick={() => toast.success('Settings saved successfully!')}
          >
            Save Changes
          </Button>
        </div>
        
        {/* App Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Eternal Cookbook v1.0.0</p>
          <p>Made with ❤️ for home cooks everywhere</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;