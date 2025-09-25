import { RecipeIngredient } from '../../entities/recipe.ingredient.entity';

export interface CreateIngredientDTO {
  name: string;
  description?: string;
  imageUrl?: string;
  recipeLinks?: RecipeIngredient[];
}
