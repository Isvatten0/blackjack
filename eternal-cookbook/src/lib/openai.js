import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend service
});

export class RecipeAI {
  static async generateRecipe(prompt, options = {}) {
    const {
      ingredients = [],
      dietaryRestrictions = [],
      cuisine = '',
      difficulty = 'medium',
      servings = 4,
      cookingTime = '30-60 minutes'
    } = options;

    const systemPrompt = `You are an expert chef and recipe creator. Generate detailed, practical recipes that are easy to follow. Always include:
1. Recipe title
2. Description (2-3 sentences)
3. Prep time and cook time
4. Difficulty level
5. Ingredients list with measurements
6. Step-by-step instructions
7. Helpful tips or substitutions
8. Nutritional highlights

Format the response as JSON with the following structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "difficulty": "easy|medium|hard",
  "servings": 4,
  "cuisine": "cuisine type",
  "ingredients": [
    {"item": "ingredient name", "amount": "1 cup", "notes": "optional notes"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tips": ["tip 1", "tip 2"],
  "substitutions": [
    {"original": "ingredient", "substitute": "alternative", "reason": "why it works"}
  ],
  "nutrition": {
    "calories": "approximate per serving",
    "highlights": ["high protein", "low carb", etc.]
  },
  "tags": ["tag1", "tag2"],
  "isRare": false
}

If the ingredient combination is unusual or creative, set "isRare": true and add humorous but helpful commentary in the description.`;

    const userPrompt = `Create a recipe with the following requirements:
${prompt}

${ingredients.length > 0 ? `Available ingredients: ${ingredients.join(', ')}` : ''}
${dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${cuisine ? `Cuisine preference: ${cuisine}` : ''}
Difficulty: ${difficulty}
Servings: ${servings}
Preferred cooking time: ${cookingTime}

Please create a detailed recipe that makes the best use of these parameters.`;

    try {
      // Try GPT-4 first
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0].message.content;
      return this.parseRecipeResponse(content);
    } catch (error) {
      console.warn('GPT-4 failed, trying GPT-3.5-turbo:', error.message);
      
      try {
        // Fallback to GPT-3.5
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        });

        const content = completion.choices[0].message.content;
        return this.parseRecipeResponse(content);
      } catch (fallbackError) {
        console.error('Both GPT-4 and GPT-3.5 failed:', fallbackError);
        throw new Error('Unable to generate recipe. Please try again later.');
      }
    }
  }

  static parseRecipeResponse(content) {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const recipe = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'ingredients', 'instructions'];
      for (const field of requiredFields) {
        if (!recipe[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      // Add metadata
      recipe.generatedAt = new Date().toISOString();
      recipe.source = 'AI Generated';
      
      return recipe;
    } catch (error) {
      console.error('Failed to parse recipe response:', error);
      throw new Error('Failed to parse recipe. Please try again.');
    }
  }

  static async suggestSubstitutions(ingredient, context = {}) {
    const prompt = `Suggest 3-5 practical substitutions for "${ingredient}" in cooking. Consider:
- Dietary restrictions: ${context.dietaryRestrictions?.join(', ') || 'none'}
- Cuisine type: ${context.cuisine || 'any'}
- Available ingredients: ${context.availableIngredients?.join(', ') || 'common pantry items'}

Return as JSON array:
[
  {
    "substitute": "alternative ingredient",
    "ratio": "1:1 or specific measurement",
    "reason": "why it works",
    "flavor": "how it affects taste",
    "availability": "common|specialty"
  }
]`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 500
      });

      const content = completion.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Substitution suggestion failed:', error);
      return [];
    }
  }

  static async generateFromFridge(ingredients, options = {}) {
    const { mustUse = [], canUse = [], pantryItems = true } = options;
    
    const prompt = `I have these ingredients in my fridge/pantry: ${ingredients.join(', ')}
    
${mustUse.length > 0 ? `MUST use: ${mustUse.join(', ')}` : ''}
${canUse.length > 0 ? `Can optionally use: ${canUse.join(', ')}` : ''}
${pantryItems ? 'Assume I have basic pantry staples (salt, pepper, oil, flour, etc.)' : 'Only use the ingredients I specified'}

Create a delicious recipe that makes the best use of what I have. Be creative but practical!`;

    return this.generateRecipe(prompt, options);
  }

  static getHumorousReaction(ingredients) {
    const weirdCombos = [
      { keywords: ['horse', 'meat'], reaction: "🐎 Hold your horses there, chef! While we appreciate culinary adventure, let's stick to more conventional proteins!" },
      { keywords: ['toothpaste', 'mint'], reaction: "🦷 That's quite the minty fresh idea, but perhaps save the toothpaste for after dinner!" },
      { keywords: ['soap', 'detergent'], reaction: "🧼 I think you might be mixing up your kitchen with your laundry room!" },
      { keywords: ['cardboard', 'paper'], reaction: "📦 While high in fiber, cardboard isn't quite the ingredient we're looking for!" },
      { keywords: ['uranium', 'radioactive'], reaction: "☢️ That's definitely not FDA approved! Let's keep things deliciously safe!" }
    ];

    const ingredientText = ingredients.join(' ').toLowerCase();
    
    for (const combo of weirdCombos) {
      if (combo.keywords.some(keyword => ingredientText.includes(keyword))) {
        return combo.reaction;
      }
    }
    
    return null;
  }
}

export default RecipeAI;