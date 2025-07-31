import React, { useState } from 'react';
import { Crown, Check, X, Zap, PlayCircle, Users, Gift } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

const Subscription = () => {
  const { isProUser, isDeveloperMode, setProUser, addApiUsage, getRemainingApiCalls } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pricing');
  
  const remainingCalls = getRemainingApiCalls();
  
  const handleWatchAd = () => {
    setIsProcessing(true);
    
    // Simulate ad watching
    setTimeout(() => {
      addApiUsage(3);
      setIsProcessing(false);
      toast.success('Great! You earned 3 more recipe generations!');
    }, 3000);
  };
  
  const handleUpgradeToPro = () => {
    setIsProcessing(true);
    
    // Simulate Stripe payment processing
    setTimeout(() => {
      setProUser(true);
      setIsProcessing(false);
      toast.success('Welcome to Eternal Cookbook Pro! 🎉');
    }, 2000);
  };
  
  const features = {
    free: [
      '3 AI recipe generations per day',
      'Save up to 10 recipes',
      'Basic recipe search',
      'Mobile-friendly interface',
      'Community support'
    ],
    pro: [
      'Unlimited AI recipe generations',
      'Unlimited recipe storage',
      'Advanced recipe organization',
      'PDF cookbook export',
      'Priority support',
      'No ads',
      'Early access to new features',
      'Advanced dietary filters',
      'Recipe sharing & collections',
      'Meal planning tools'
    ]
  };
  
  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out the app',
      features: features.free,
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      popular: false,
      disabled: true
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: 'month',
      description: 'Unlimited culinary possibilities',
      features: features.pro,
      buttonText: '7-Day Free Trial',
      buttonVariant: 'primary',
      popular: true,
      disabled: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Crown className="h-10 w-10 mr-3 text-primary-500" />
            Eternal Cookbook Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited culinary creativity with our premium features
          </p>
          
          {isDeveloperMode && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-purple-800">
                👨‍💻 Developer Mode: All Pro features are already unlocked
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pricing'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('earn-more')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'earn-more'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Earn More
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'referrals'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Referrals
            </button>
          </div>
        </div>
        
        {/* Content Based on Active Tab */}
        {activeTab === 'pricing' && (
          <div>
            {/* Current Status */}
            {!isDeveloperMode && (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Current Plan: {isProUser ? 'Pro' : 'Free'}
                      </h3>
                      <p className="text-gray-600">
                        {isProUser 
                          ? 'You have unlimited access to all features'
                          : `${remainingCalls} recipe generations remaining today`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      {isProUser ? (
                        <div className="flex items-center text-green-600">
                          <Crown className="h-5 w-5 mr-1" />
                          <span className="font-medium">Pro Active</span>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-primary-600">
                          ${isProUser ? '4.99' : '0'}/mo
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}
            
            {/* Pricing Plans */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative ${plan.popular ? 'border-primary-500 border-2' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <Card.Header className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </Card.Header>
                  
                  <Card.Content>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card.Content>
                  
                  <Card.Footer>
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      disabled={plan.disabled || isProUser || isDeveloperMode}
                      loading={isProcessing && plan.name === 'Pro'}
                      onClick={() => plan.name === 'Pro' && handleUpgradeToPro()}
                    >
                      {isProUser && plan.name === 'Pro' ? 'Current Plan' : plan.buttonText}
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Trusted by thousands of home cooks worldwide</p>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  Cancel anytime
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  Secure payments
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  7-day free trial
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'earn-more' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <Card.Header className="text-center">
                <PlayCircle className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Watch Ads for More Recipes</h2>
                <p className="text-gray-600 mt-2">
                  Get 3 additional recipe generations by watching a short ad
                </p>
              </Card.Header>
              
              <Card.Content className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Status</h3>
                  <p className="text-gray-600">
                    {remainingCalls === 0 
                      ? "You've used all your free generations today"
                      : `${remainingCalls} free generations remaining`
                    }
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Watch ad</span>
                    </div>
                    <span className="font-semibold text-green-600">+3 generations</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Save recipes (watch ad)</span>
                    </div>
                    <span className="font-semibold text-green-600">+5 save slots</span>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6"
                  size="lg"
                  loading={isProcessing}
                  disabled={isDeveloperMode || isProUser}
                  onClick={handleWatchAd}
                >
                  {isDeveloperMode || isProUser 
                    ? 'No ads needed with Pro' 
                    : '🎬 Watch Ad (30 seconds)'
                  }
                </Button>
                
                <p className="text-xs text-gray-500 mt-4">
                  Ads help us keep the basic features free for everyone
                </p>
              </Card.Content>
            </Card>
          </div>
        )}
        
        {activeTab === 'referrals' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <Card.Header className="text-center">
                <Users className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Refer Friends & Earn</h2>
                <p className="text-gray-600 mt-2">
                  Share the love of cooking and get rewarded
                </p>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
                      <Gift className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Refer 5 Friends = 1 Month Pro FREE!
                      </h3>
                      <p className="text-gray-600 text-sm">
                        When your friends sign up and try Pro, you both win
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">How it works:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Share your unique link</p>
                          <p className="text-gray-600 text-sm">Get your personalized referral link below</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Friends sign up & try Pro</p>
                          <p className="text-gray-600 text-sm">They get 7 days free, you get credit</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Unlock rewards</p>
                          <p className="text-gray-600 text-sm">5 successful referrals = 1 month Pro free!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Referral Link:
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value="https://eternalcookbook.com/ref/USER123"
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-gray-600"
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={() => {
                          navigator.clipboard.writeText('https://eternalcookbook.com/ref/USER123');
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Progress: 0/5 successful referrals
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;