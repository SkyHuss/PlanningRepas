import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { HttpError } from '../errors/httpError';
import { IngredientsService } from '../services/ingredients.service';

export const getAllIngredients = asyncHandler(async (_req: Request, res: Response) => {
  const ingredients = await IngredientsService.findAll();
  res.status(200).json(ingredients);
});

export const getIngredientById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const ingredient = await IngredientsService.findById(id);
  if (!ingredient) throw new HttpError(404, 'Ingredient not found');
  res.status(200).json(ingredient);
});

export const createIngredient = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await IngredientsService.create(payload);
  res.status(201).json(created);
});

export const updateIngredient = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const updated = await IngredientsService.update(id, payload);
  if (!updated) throw new HttpError(404, 'Ingredient not found');
  res.status(200).json(updated);
});

export const deleteIngredient = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await IngredientsService.delete(id);
  res.status(200).json({ message: 'Ingredient deleted successfully' });
});
