import React, { useState } from 'react';
import { BookOpen, Heart, Search, Filter, Download, Trash2, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import RecipeCard from '../components/RecipeCard';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const MyRecipes = () => {
  const { savedRecipes, removeRecipe, isDeveloperMode, isProUser } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, favorites, cuisine
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical
  const [selectedCuisine, setSelectedCuisine] = useState('');
  
  // Filter and sort recipes
  const filteredRecipes = savedRecipes
    .filter(recipe => {
      // Search filter
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      let matchesFilter = true;
      if (filterBy === 'favorites') {
        matchesFilter = recipe.isFavorite;
      } else if (filterBy === 'cuisine' && selectedCuisine) {
        matchesFilter = recipe.cuisine?.toLowerCase() === selectedCuisine.toLowerCase();
      }
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.savedAt) - new Date(b.savedAt);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });
  
  // Get unique cuisines from saved recipes
  const availableCuisines = [...new Set(savedRecipes
    .map(recipe => recipe.cuisine)
    .filter(Boolean)
  )].sort();
  
  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      removeRecipe(recipeId);
      toast.success('Recipe deleted');
    }
  };
  
  const generatePDFCookbook = () => {
    if (savedRecipes.length === 0) {
      toast.error('No recipes to export');
      return;
    }
    
    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      let currentY = 20;
      
      // Title
      pdf.setFontSize(20);
      pdf.text('My Eternal Cookbook', 20, currentY);
      currentY += 20;
      
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, currentY);
      currentY += 20;
      
      filteredRecipes.forEach((recipe, index) => {
        // Check if we need a new page
        if (currentY > pageHeight - 60) {
          pdf.addPage();
          currentY = 20;
        }
        
        // Recipe title
        pdf.setFontSize(16);
        pdf.text(`${index + 1}. ${recipe.title}`, 20, currentY);
        currentY += 10;
        
        // Recipe details
        pdf.setFontSize(10);
        const details = [
          `Servings: ${recipe.servings || 'N/A'}`,
          `Prep Time: ${recipe.prepTime || 'N/A'}`,
          `Cook Time: ${recipe.cookTime || 'N/A'}`,
          `Difficulty: ${recipe.difficulty || 'N/A'}`
        ].join(' | ');
        
        pdf.text(details, 20, currentY);
        currentY += 8;
        
        // Description
        if (recipe.description) {
          const descLines = pdf.splitTextToSize(recipe.description, 170);
          pdf.text(descLines, 20, currentY);
          currentY += descLines.length * 5 + 5;
        }
        
        // Ingredients
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          pdf.setFontSize(12);
          pdf.text('Ingredients:', 20, currentY);
          currentY += 8;
          
          pdf.setFontSize(10);
          recipe.ingredients.forEach(ingredient => {
            const ingredientText = typeof ingredient === 'string' 
              ? ingredient 
              : `${ingredient.amount || ''} ${ingredient.item || ''}`.trim();
            pdf.text(`• ${ingredientText}`, 25, currentY);
            currentY += 5;
          });
          currentY += 5;
        }
        
        // Instructions
        if (recipe.instructions && recipe.instructions.length > 0) {
          pdf.setFontSize(12);
          pdf.text('Instructions:', 20, currentY);
          currentY += 8;
          
          pdf.setFontSize(10);
          recipe.instructions.forEach((step, stepIndex) => {
            const stepLines = pdf.splitTextToSize(`${stepIndex + 1}. ${step}`, 170);
            pdf.text(stepLines, 25, currentY);
            currentY += stepLines.length * 5 + 3;
          });
        }
        
        currentY += 15; // Space between recipes
      });
      
      pdf.save('my-eternal-cookbook.pdf');
      toast.success('Cookbook exported successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to export cookbook');
    }
  };
  
  const favoriteRecipes = savedRecipes.filter(recipe => recipe.isFavorite);
  const totalRecipes = savedRecipes.length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <BookOpen className="h-8 w-8 mr-3 text-primary-500" />
            My Recipes
          </h1>
          <p className="text-gray-600">
            Your personal collection of delicious recipes
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <Card.Content className="text-center p-4">
              <div className="text-2xl font-bold text-primary-600">{totalRecipes}</div>
              <div className="text-sm text-gray-600">Total Recipes</div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center p-4">
              <div className="text-2xl font-bold text-red-500">{favoriteRecipes.length}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center p-4">
              <div className="text-2xl font-bold text-secondary-600">{availableCuisines.length}</div>
              <div className="text-sm text-gray-600">Cuisines</div>
            </Card.Content>
          </Card>
        </div>
        
        {/* Controls */}
        <Card className="mb-8">
          <Card.Content className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Input
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="h-4 w-4 text-gray-400" />}
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) => {
                      setFilterBy(e.target.value);
                      if (e.target.value !== 'cuisine') {
                        setSelectedCuisine('');
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Recipes</option>
                    <option value="favorites">Favorites Only</option>
                    <option value="cuisine">By Cuisine</option>
                  </select>
                  
                  {filterBy === 'cuisine' && (
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Cuisine</option>
                      {availableCuisines.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  )}
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                </div>
              </div>
              
              {/* Export Button */}
              {totalRecipes > 0 && (
                <Button
                  onClick={generatePDFCookbook}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              )}
            </div>
          </Card.Content>
        </Card>
        
        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="relative">
                <RecipeCard
                  recipe={recipe}
                  showActions={false}
                />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {recipe.isFavorite && (
                    <div className="bg-white rounded-full p-2 shadow-md">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : totalRecipes === 0 ? (
          /* Empty State - No Recipes */
          <Card>
            <Card.Content className="text-center p-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Recipes Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your recipe collection by generating or saving recipes
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.href = '/generate'}>
                  Generate Recipe
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/fridge'}>
                  Fridge Mode
                </Button>
              </div>
            </Card.Content>
          </Card>
        ) : (
          /* Empty State - No Search Results */
          <Card>
            <Card.Content className="text-center p-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Recipes Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                  setSelectedCuisine('');
                }}
              >
                Clear Filters
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {/* Pro Features Promotion */}
        {!isDeveloperMode && !isProUser && totalRecipes >= 8 && (
          <Card className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <Card.Content className="text-center p-8">
              <Star className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unlock Unlimited Recipe Storage
              </h3>
              <p className="text-gray-600 mb-6">
                You're getting close to your recipe limit. Upgrade to Pro for unlimited storage, 
                advanced organization, and exclusive features.
              </p>
              <Button 
                className="bg-primary-500 hover:bg-primary-600"
                onClick={() => window.location.href = '/subscription'}
              >
                Upgrade to Pro
              </Button>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;