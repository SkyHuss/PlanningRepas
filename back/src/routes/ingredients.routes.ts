import { Router } from 'express';
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
} from '../controllers/ingredients.controller';
import { validateDto } from '../middlewares/validate-dto.middleware';
import { createIngredientSchema } from '../schema/ingredients/ingredient.schema';

const router = Router();

router.get('/', getAllIngredients);
router.get('/:id', getIngredientById);
router.post('/', validateDto(createIngredientSchema), createIngredient);
router.put('/:id', validateDto(createIngredientSchema), updateIngredient);
router.delete('/:id', deleteIngredient);

export default router;
