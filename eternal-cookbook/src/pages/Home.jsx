import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Refrigerator, TrendingUp, Clock, ChefHat } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RecipeCard from '../components/RecipeCard';
import useAppStore from '../store/useAppStore';

const Home = () => {
  const { recentRecipes, resetDailyUsage, isDeveloperMode, isProUser, getRemainingApiCalls } = useAppStore();
  
  useEffect(() => {
    resetDailyUsage();
  }, [resetDailyUsage]);
  
  const remainingCalls = getRemainingApiCalls();
  
  // Sample featured recipes for demo
  const featuredRecipes = [
    {
      id: 'featured-1',
      title: 'Mediterranean Quinoa Bowl',
      description: 'A healthy and colorful bowl packed with fresh vegetables, quinoa, and a zesty lemon dressing.',
      prepTime: '20 min',
      cookTime: '15 min',
      difficulty: 'easy',
      servings: 4,
      cuisine: 'Mediterranean',
      ingredients: [
        { item: 'quinoa', amount: '1 cup' },
        { item: 'cherry tomatoes', amount: '1 cup' },
        { item: 'cucumber', amount: '1 large' }
      ],
      nutrition: {
        highlights: ['High Protein', 'Vegan', 'Gluten-Free']
      },
      tags: ['healthy', 'quick', 'vegetarian']
    },
    {
      id: 'featured-2',
      title: 'Spicy Thai Basil Chicken',
      description: 'An authentic Thai stir-fry with ground chicken, holy basil, and chilies served over jasmine rice.',
      prepTime: '15 min',
      cookTime: '10 min',
      difficulty: 'medium',
      servings: 2,
      cuisine: 'Thai',
      ingredients: [
        { item: 'ground chicken', amount: '1 lb' },
        { item: 'thai basil', amount: '1 cup' },
        { item: 'thai chilies', amount: '3-5' }
      ],
      nutrition: {
        highlights: ['High Protein', 'Low Carb', 'Spicy']
      },
      tags: ['spicy', 'authentic', 'quick']
    },
    {
      id: 'featured-3',
      title: 'Classic French Ratatouille',
      description: 'A rustic French vegetable stew featuring eggplant, zucchini, peppers, and tomatoes.',
      prepTime: '30 min',
      cookTime: '45 min',
      difficulty: 'medium',
      servings: 6,
      cuisine: 'French',
      ingredients: [
        { item: 'eggplant', amount: '1 large' },
        { item: 'zucchini', amount: '2 medium' },
        { item: 'bell peppers', amount: '2' }
      ],
      nutrition: {
        highlights: ['Vegetarian', 'Low Calorie', 'High Fiber']
      },
      tags: ['vegetarian', 'comfort', 'traditional']
    }
  ];
  
  const quickActions = [
    {
      title: 'Generate Recipe',
      description: 'Create a new recipe with AI assistance',
      icon: Sparkles,
      path: '/generate',
      color: 'bg-primary-500',
      disabled: !isDeveloperMode && !isProUser && remainingCalls <= 0
    },
    {
      title: 'Fridge Mode',
      description: 'Find recipes based on what you have',
      icon: Refrigerator,
      path: '/fridge',
      color: 'bg-secondary-500',
      disabled: !isDeveloperMode && !isProUser && remainingCalls <= 0
    },
    {
      title: 'My Recipes',
      description: 'View your saved and favorite recipes',
      icon: ChefHat,
      path: '/recipes',
      color: 'bg-purple-500',
      disabled: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-primary-500">Eternal Cookbook</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover endless culinary possibilities with AI-powered recipe generation. 
            Turn your ingredients into delicious meals instantly.
          </p>
          
          {!isDeveloperMode && !isProUser && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                {remainingCalls === 0 ? (
                  <>🎬 Watch an ad to get 3 more recipe generations today!</>
                ) : (
                  <>✨ You have {remainingCalls} free recipe generations left today</>
                )}
              </p>
            </div>
          )}
          
          {isDeveloperMode && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-purple-800">
                👨‍💻 Developer Mode: Unlimited access to all features
              </p>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} hover={!action.disabled} className={action.disabled ? 'opacity-50' : ''}>
                <Card.Content className="text-center p-8">
                  <div className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Link to={action.path}>
                    <Button 
                      className="w-full" 
                      disabled={action.disabled}
                    >
                      {action.disabled ? 'No calls left' : 'Get Started'}
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            );
          })}
        </div>
        
        {/* Recent Recipes */}
        {recentRecipes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-primary-500" />
                Recently Generated
              </h2>
              <Link to="/recipes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRecipes.slice(0, 6).map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  showActions={true}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Featured Recipes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary-500" />
              Featured Recipes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showActions={true}
              />
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Amazing Recipes?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of home cooks discovering new flavors every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate">
              <Button 
                variant="outline" 
                className="bg-white text-primary-500 border-white hover:bg-gray-50"
                disabled={!isDeveloperMode && !isProUser && remainingCalls <= 0}
              >
                Generate Your First Recipe
              </Button>
            </Link>
            <Link to="/subscription">
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-500"
              >
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;