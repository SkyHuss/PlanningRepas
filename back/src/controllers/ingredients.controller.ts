import fs from 'fs';
import path from 'path';
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
  const payload = await buildPayloadFromRequest(req);
  const created = await IngredientsService.create(payload);
  res.status(201).json(created);
});

export const updateIngredient = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = await buildPayloadFromRequest(req);

  const updated = await IngredientsService.update(id, payload);
  if (!updated) throw new HttpError(404, 'Ingredient not found');
  res.status(200).json(updated);
});

export const deleteIngredient = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const response = await IngredientsService.delete(id);
  res.status(200).json(response);
});

const buildPayloadFromRequest = async (req: Request) => {
  const raw = { ...req.body };

  if (req.file) {
    const file = req.file as Express.Multer.File & { path?: string; buffer?: Buffer };

    if (file.path) {
      raw.imageUrl = `/uploads/${path.basename(file.path)}`;
    } else if (file.buffer) {
      const uploadsDir = path.join(__dirname, '../../uploads');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(filePath, file.buffer);
      raw.imageUrl = `/uploads/${safeName}`;
    }
  }

  return raw;
};
