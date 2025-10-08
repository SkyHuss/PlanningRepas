import { z } from 'zod';
import { CreateIngredientDTO } from '../../dto/ingredients/create-ingredient.dto';

export const createIngredientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  recipeLinks: z.array(z.string().uuid('Each recipe link must be a valid UUID')).optional(),
});

export type CreateIngredientSchemaType = z.infer<typeof createIngredientSchema>;

export const validateIngredient = (data: unknown): CreateIngredientDTO => {
  return createIngredientSchema.parse(data) as CreateIngredientDTO;
};

export const validateIngredientAsync = (data: unknown): Promise<CreateIngredientDTO> => {
  return createIngredientSchema.parseAsync(data) as Promise<CreateIngredientDTO>;
};
