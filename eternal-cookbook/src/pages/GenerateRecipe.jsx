import React, { useState } from 'react';
import { Sparkles, Plus, X, Wand2, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import RecipeCard from '../components/RecipeCard';
import useAppStore from '../store/useAppStore';
import { RecipeAI } from '../lib/openai';
import toast from 'react-hot-toast';

const GenerateRecipe = () => {
  const { canUseApi, incrementApiUsage, addRecentRecipe, isDeveloperMode, isProUser, getRemainingApiCalls } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [humorousReaction, setHumorousReaction] = useState(null);
  
  // Form state
  const [prompt, setPrompt] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['']);
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState('30-60 minutes');
  
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
    if (!prompt.trim() && ingredients.filter(i => i.trim()).length === 0) {
      toast.error('Please provide either a recipe description or ingredients');
      return false;
    }
    return true;
  };
  
  const handleGenerate = async () => {
    if (!canUseApi()) {
      toast.error('No API calls remaining. Upgrade to Pro or watch an ad!');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setGeneratedRecipe(null);
    setHumorousReaction(null);
    
    try {
      // Check for humorous reactions
      const validIngredients = ingredients.filter(i => i.trim());
      const reaction = RecipeAI.getHumorousReaction(validIngredients);
      if (reaction) {
        setHumorousReaction(reaction);
      }
      
      const options = {
        ingredients: validIngredients,
        dietaryRestrictions: dietaryRestrictions.filter(d => d.trim()),
        cuisine,
        difficulty,
        servings,
        cookingTime
      };
      
      const recipe = await RecipeAI.generateRecipe(prompt, options);
      
      if (recipe) {
        setGeneratedRecipe(recipe);
        addRecentRecipe(recipe);
        incrementApiUsage();
        toast.success('Recipe generated successfully!');
        
        // Show rare recipe alert if applicable
        if (recipe.isRare) {
          toast('🏆 Rare recipe discovered! This is a unique combination!', {
            duration: 5000,
            style: {
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #f59e0b'
            }
          });
        }
      }
    } catch (error) {
      console.error('Recipe generation failed:', error);
      toast.error(error.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const cuisineOptions = [
    '', 'Italian', 'Mexican', 'Asian', 'Indian', 'French', 'Mediterranean', 
    'Thai', 'Chinese', 'Japanese', 'American', 'Greek', 'Spanish', 'Korean'
  ];
  
  const timeOptions = [
    '15-30 minutes', '30-60 minutes', '1-2 hours', '2+ hours'
  ];
  
  if (!canUseApi() && !isDeveloperMode && !isProUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <Card.Content className="text-center p-8">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Recipe Generations Left
            </h2>
            <p className="text-gray-600 mb-6">
              You've used all your free recipe generations for today. 
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate AI Recipe
          </h1>
          <p className="text-gray-600">
            Describe what you want to cook and let AI create the perfect recipe for you
          </p>
          
          {!isDeveloperMode && !isProUser && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                ✨ {remainingCalls} free generations remaining today
              </p>
            </div>
          )}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-primary-500" />
                Recipe Preferences
              </h2>
            </Card.Header>
            
            <Card.Content className="space-y-6">
              {/* Main prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to cook? *
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A healthy dinner for two with chicken and vegetables"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              
              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Ingredients (optional)
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
              </div>
              
              {/* Dietary Restrictions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions (optional)
                </label>
                {dietaryRestrictions.map((restriction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={restriction}
                      onChange={(e) => updateDietaryRestriction(index, e.target.value)}
                      placeholder="e.g., vegetarian, gluten-free, dairy-free"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
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
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings
                  </label>
                  <Input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 4)}
                    min="1"
                    max="12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cooking Time
                  </label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Recipe
              </Button>
            </Card.Content>
          </Card>
          
          {/* Results */}
          <div className="space-y-6">
            {/* Humorous Reaction */}
            {humorousReaction && (
              <Card className="border-yellow-200 bg-yellow-50">
                <Card.Content className="p-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    {humorousReaction}
                  </p>
                </Card.Content>
              </Card>
            )}
            
            {/* Loading */}
            {isGenerating && (
              <Card>
                <Card.Content className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cooking up something amazing...
                  </h3>
                  <p className="text-gray-600">
                    Our AI chef is crafting the perfect recipe for you
                  </p>
                </Card.Content>
              </Card>
            )}
            
            {/* Generated Recipe */}
            {generatedRecipe && !isGenerating && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Generated Recipe
                </h3>
                <RecipeCard
                  recipe={generatedRecipe}
                  showActions={true}
                />
                
                {/* Detailed Recipe View */}
                <Card className="mt-4">
                  <Card.Header>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Full Recipe Details
                    </h4>
                  </Card.Header>
                  
                  <Card.Content className="space-y-6">
                    {/* Ingredients */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Ingredients:</h5>
                      <ul className="space-y-1">
                        {generatedRecipe.ingredients?.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">
                            • {ingredient.amount} {ingredient.item}
                            {ingredient.notes && (
                              <span className="text-gray-500 text-sm"> ({ingredient.notes})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Instructions */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Instructions:</h5>
                      <ol className="space-y-2">
                        {generatedRecipe.instructions?.map((step, index) => (
                          <li key={index} className="text-gray-700">
                            <span className="font-medium text-primary-600">{index + 1}.</span> {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {/* Tips */}
                    {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Tips:</h5>
                        <ul className="space-y-1">
                          {generatedRecipe.tips.map((tip, index) => (
                            <li key={index} className="text-gray-700">
                              💡 {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Substitutions */}
                    {generatedRecipe.substitutions && generatedRecipe.substitutions.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Substitutions:</h5>
                        <div className="space-y-2">
                          {generatedRecipe.substitutions.map((sub, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium">{sub.original}</span> → 
                                <span className="font-medium text-primary-600"> {sub.substitute}</span>
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{sub.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateRecipe;