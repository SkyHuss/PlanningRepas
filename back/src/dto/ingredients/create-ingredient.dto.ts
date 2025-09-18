import { RecipeIngredient } from '../../entities/recipe.ingredient.entity';

export interface CreateIngredientDTO {
  name: string;
  description?: string;
  recipeLinks?: RecipeIngredient[];
}
