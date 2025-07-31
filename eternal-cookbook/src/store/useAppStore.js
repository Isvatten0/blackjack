import { create } from 'zustand';

const DEV_KEY = "2C4EF7920DAF4B6D9E10F1D338BC13EA";

const useAppStore = create((set, get) => ({
  // User & Auth
  user: null,
  isAuthenticated: false,
  
  // Developer Mode
  isDeveloperMode: false,
  
  // Subscription & Usage
  isProUser: false,
  dailyApiUsage: 0,
  dailyApiLimit: 3,
  savedRecipesCount: 0,
  savedRecipesLimit: 10,
  lastResetDate: new Date().toDateString(),
  
  // Recipes
  savedRecipes: [],
  recentRecipes: [],
  favoriteRecipes: [],
  
  // UI State
  isLoading: false,
  currentPage: 'home',
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setDeveloperMode: (devKey) => {
    if (devKey === DEV_KEY) {
      set({ 
        isDeveloperMode: true,
        isProUser: true,
        dailyApiLimit: Infinity,
        savedRecipesLimit: Infinity
      });
      return true;
    }
    return false;
  },
  
  disableDeveloperMode: () => set({ 
    isDeveloperMode: false,
    isProUser: false,
    dailyApiLimit: 3,
    savedRecipesLimit: 10
  }),
  
  resetDailyUsage: () => {
    const today = new Date().toDateString();
    const { lastResetDate } = get();
    
    if (today !== lastResetDate) {
      set({
        dailyApiUsage: 0,
        lastResetDate: today
      });
    }
  },
  
  incrementApiUsage: () => {
    const { dailyApiUsage, dailyApiLimit } = get();
    if (dailyApiUsage < dailyApiLimit) {
      set({ dailyApiUsage: dailyApiUsage + 1 });
      return true;
    }
    return false;
  },
  
  addApiUsage: (count) => {
    const { dailyApiUsage, dailyApiLimit } = get();
    const newUsage = Math.min(dailyApiUsage + count, dailyApiLimit);
    set({ dailyApiUsage: newUsage });
  },
  
  saveRecipe: (recipe) => {
    const { savedRecipes, savedRecipesCount, savedRecipesLimit } = get();
    
    if (savedRecipesCount >= savedRecipesLimit) {
      return false;
    }
    
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      isFavorite: false
    };
    
    set({
      savedRecipes: [newRecipe, ...savedRecipes],
      savedRecipesCount: savedRecipesCount + 1
    });
    
    return true;
  },
  
  removeRecipe: (recipeId) => {
    const { savedRecipes } = get();
    const updatedRecipes = savedRecipes.filter(r => r.id !== recipeId);
    set({
      savedRecipes: updatedRecipes,
      savedRecipesCount: updatedRecipes.length
    });
  },
  
  toggleFavorite: (recipeId) => {
    const { savedRecipes } = get();
    const updatedRecipes = savedRecipes.map(recipe =>
      recipe.id === recipeId
        ? { ...recipe, isFavorite: !recipe.isFavorite }
        : recipe
    );
    set({ savedRecipes: updatedRecipes });
  },
  
  addRecentRecipe: (recipe) => {
    const { recentRecipes } = get();
    const newRecent = [recipe, ...recentRecipes.filter(r => r.title !== recipe.title)].slice(0, 10);
    set({ recentRecipes: newRecent });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setProUser: (isPro) => set({ isProUser: isPro }),
  
  // Helper getters
  canUseApi: () => {
    const { isDeveloperMode, isProUser, dailyApiUsage, dailyApiLimit } = get();
    return isDeveloperMode || isProUser || dailyApiUsage < dailyApiLimit;
  },
  
  canSaveRecipe: () => {
    const { isDeveloperMode, isProUser, savedRecipesCount, savedRecipesLimit } = get();
    return isDeveloperMode || isProUser || savedRecipesCount < savedRecipesLimit;
  },
  
  getRemainingApiCalls: () => {
    const { isDeveloperMode, isProUser, dailyApiUsage, dailyApiLimit } = get();
    if (isDeveloperMode || isProUser) return Infinity;
    return Math.max(0, dailyApiLimit - dailyApiUsage);
  }
}));

export default useAppStore;