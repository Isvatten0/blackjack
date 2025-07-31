import React, { useState } from 'react';
import { Refrigerator, Plus, X, Sparkles, AlertTriangle, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import RecipeCard from '../components/RecipeCard';
import useAppStore from '../store/useAppStore';
import { RecipeAI } from '../lib/openai';
import toast from 'react-hot-toast';

const FridgeMode = () => {
  const { canUseApi, incrementApiUsage, addRecentRecipe, isDeveloperMode, isProUser, getRemainingApiCalls } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  
  // Form state
  const [ingredients, setIngredients] = useState(['']);
  const [mustUse, setMustUse] = useState(['']);
  const [pantryItems, setPantryItems] = useState(true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['']);
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  
  const remainingCalls = getRemainingApiCalls();
  
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };
  
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  const updateIngredient = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };
  
  const addMustUse = () => {
    setMustUse([...mustUse, '']);
  };
  
  const removeMustUse = (index) => {
    setMustUse(mustUse.filter((_, i) => i !== index));
  };
  
  const updateMustUse = (index, value) => {
    const updated = [...mustUse];
    updated[index] = value;
    setMustUse(updated);
  };
  
  const addDietaryRestriction = () => {
    setDietaryRestrictions([...dietaryRestrictions, '']);
  };
  
  const removeDietaryRestriction = (index) => {
    setDietaryRestrictions(dietaryRestrictions.filter((_, i) => i !== index));
  };
  
  const updateDietaryRestriction = (index, value) => {
    const updated = [...dietaryRestrictions];
    updated[index] = value;
    setDietaryRestrictions(updated);
  };
  
  const validateForm = () => {
    const validIngredients = ingredients.filter(i => i.trim()).length;
    const validMustUse = mustUse.filter(i => i.trim()).length;
    
    if (validIngredients === 0 && validMustUse === 0) {
      toast.error('Please add at least one ingredient');
      return false;
    }
    return true;
  };
  
  const handleFindRecipes = async () => {
    if (!canUseApi()) {
      toast.error('No API calls remaining. Upgrade to Pro or watch an ad!');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setGeneratedRecipes([]);
    
    try {
      const validIngredients = ingredients.filter(i => i.trim());
      const validMustUse = mustUse.filter(i => i.trim());
      
      const options = {
        mustUse: validMustUse,
        canUse: validIngredients,
        pantryItems,
        dietaryRestrictions: dietaryRestrictions.filter(d => d.trim()),
        cuisine,
        difficulty: difficulty || 'medium'
      };
      
      // Generate multiple recipe suggestions
      const recipePromises = [];
      const numRecipes = isDeveloperMode || isProUser ? 3 : 2;
      
      for (let i = 0; i < numRecipes; i++) {
        recipePromises.push(
          RecipeAI.generateFromFridge([...validIngredients, ...validMustUse], options)
        );
      }
      
      const recipes = await Promise.all(recipePromises);
      const validRecipes = recipes.filter(r => r && r.title);
      
      if (validRecipes.length > 0) {
        setGeneratedRecipes(validRecipes);
        validRecipes.forEach(recipe => addRecentRecipe(recipe));
        incrementApiUsage();
        toast.success(`Found ${validRecipes.length} recipe${validRecipes.length > 1 ? 's' : ''} for you!`);
      } else {
        toast.error('No recipes found. Try different ingredients or preferences.');
      }
    } catch (error) {
      console.error('Recipe search failed:', error);
      toast.error(error.message || 'Failed to find recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const commonIngredients = [
    'chicken breast', 'ground beef', 'salmon', 'eggs', 'milk', 'cheese',
    'onion', 'garlic', 'tomatoes', 'bell peppers', 'carrots', 'potatoes',
    'rice', 'pasta', 'bread', 'flour', 'olive oil', 'butter',
    'salt', 'pepper', 'herbs', 'spices'
  ];
  
  const cuisineOptions = [
    '', 'Italian', 'Mexican', 'Asian', 'Indian', 'French', 'Mediterranean', 
    'Thai', 'Chinese', 'Japanese', 'American', 'Greek', 'Spanish', 'Korean'
  ];
  
  if (!canUseApi() && !isDeveloperMode && !isProUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <Card.Content className="text-center p-8">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Recipe Searches Left
            </h2>
            <p className="text-gray-600 mb-6">
              You've used all your free recipe searches for today. 
              Watch an ad to get 3 more or upgrade to Pro for unlimited access!
            </p>
            <div className="space-y-3">
              <Button className="w-full">
                🎬 Watch Ad for 3 More
              </Button>
              <Button variant="outline" className="w-full">
                Upgrade to Pro
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Refrigerator className="h-8 w-8 mr-3 text-primary-500" />
            Fridge Mode
          </h1>
          <p className="text-gray-600">
            Tell us what's in your fridge and we'll find amazing recipes you can make right now
          </p>
          
          {!isDeveloperMode && !isProUser && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                ✨ {remainingCalls} free searches remaining today
              </p>
            </div>
          )}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients Form */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">
                  What's in your fridge?
                </h2>
              </Card.Header>
              
              <Card.Content className="space-y-6">
                {/* Available Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Ingredients
                  </label>
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        placeholder="e.g., chicken breast, tomatoes"
                        className="flex-1"
                      />
                      {ingredients.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Ingredient
                  </Button>
                  
                  {/* Quick Add Common Ingredients */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-1">
                      {commonIngredients.slice(0, 8).map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => {
                            const emptyIndex = ingredients.findIndex(i => !i.trim());
                            if (emptyIndex !== -1) {
                              updateIngredient(emptyIndex, ingredient);
                            } else {
                              setIngredients([...ingredients, ingredient]);
                            }
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          + {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Must Use Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Must Use (expiring soon)
                  </label>
                  {mustUse.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateMustUse(index, e.target.value)}
                        placeholder="e.g., spinach, milk"
                        className="flex-1"
                      />
                      {mustUse.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMustUse(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addMustUse}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Must-Use
                  </Button>
                </div>
                
                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  {dietaryRestrictions.map((restriction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={restriction}
                        onChange={(e) => updateDietaryRestriction(index, e.target.value)}
                        placeholder="e.g., vegetarian, gluten-free"
                        className="flex-1"
                      />
                      {dietaryRestrictions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDietaryRestriction(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addDietaryRestriction}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Restriction
                  </Button>
                </div>
                
                {/* Options */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Preference
                    </label>
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {cuisineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option || 'Any Cuisine'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pantryItems"
                      checked={pantryItems}
                      onChange={(e) => setPantryItems(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="pantryItems" className="text-sm text-gray-700">
                      I have basic pantry items (salt, pepper, oil, etc.)
                    </label>
                  </div>
                </div>
                
                <Button
                  onClick={handleFindRecipes}
                  loading={isGenerating}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Recipes
                </Button>
              </Card.Content>
            </Card>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-2">
            {/* Loading */}
            {isGenerating && (
              <Card>
                <Card.Content className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Searching your fridge...
                  </h3>
                  <p className="text-gray-600">
                    Finding the perfect recipes with your available ingredients
                  </p>
                </Card.Content>
              </Card>
            )}
            
            {/* Recipe Results */}
            {generatedRecipes.length > 0 && !isGenerating && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recipes You Can Make ({generatedRecipes.length})
                </h3>
                <div className="space-y-6">
                  {generatedRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={index}
                      recipe={recipe}
                      showActions={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!isGenerating && generatedRecipes.length === 0 && (
              <Card>
                <Card.Content className="text-center p-12">
                  <Refrigerator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Cook?
                  </h3>
                  <p className="text-gray-600">
                    Add your available ingredients and we'll find amazing recipes you can make right now.
                  </p>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeMode;