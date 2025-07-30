import React from 'react';
import { Clock, Users, ChefHat, Heart, BookmarkPlus, Star, Zap } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

const RecipeCard = ({ recipe, onSave, onFavorite, showActions = true }) => {
  const { canSaveRecipe, saveRecipe, toggleFavorite } = useAppStore();
  
  const handleSave = () => {
    if (canSaveRecipe()) {
      const success = saveRecipe(recipe);
      if (success) {
        toast.success('Recipe saved!');
        onSave && onSave(recipe);
      } else {
        toast.error('Failed to save recipe');
      }
    } else {
      toast.error('Save limit reached. Upgrade to Pro for unlimited saves!');
    }
  };
  
  const handleFavorite = () => {
    if (recipe.id) {
      toggleFavorite(recipe.id);
      onFavorite && onFavorite(recipe);
    }
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <Card hover className="h-full flex flex-col">
      <Card.Header className="relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {recipe.title}
              {recipe.isRare && (
                <span className="ml-2 text-sm">
                  <Zap className="inline h-4 w-4 text-yellow-500" />
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {recipe.description}
            </p>
          </div>
          
          {recipe.isFavorite && (
            <Heart className="h-5 w-5 text-red-500 fill-current" />
          )}
        </div>
        
        {recipe.isRare && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-medium">
              🏆 Rare Recipe Alert! This combination has never been cooked before!
            </p>
          </div>
        )}
      </Card.Header>
      
      <Card.Content className="flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime || '15 min'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{recipe.servings || 4} servings</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <ChefHat className="h-4 w-4 text-gray-600" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty || 'Medium'}
            </span>
          </div>
          
          {recipe.cuisine && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{recipe.cuisine}</span>
            </div>
          )}
        </div>
        
        {recipe.nutrition?.highlights && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {recipe.nutrition.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {recipe.ingredients && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Ingredients:</h4>
            <div className="text-sm text-gray-600">
              {recipe.ingredients.slice(0, 3).map((ing, index) => (
                <span key={index}>
                  {typeof ing === 'string' ? ing : ing.item}
                  {index < Math.min(recipe.ingredients.length - 1, 2) && ', '}
                </span>
              ))}
              {recipe.ingredients.length > 3 && '...'}
            </div>
          </div>
        )}
      </Card.Content>
      
      {showActions && (
        <Card.Footer className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="flex-1"
          >
            <BookmarkPlus className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          {recipe.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className="px-3"
            >
              <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`} />
            </Button>
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default RecipeCard;