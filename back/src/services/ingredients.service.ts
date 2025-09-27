import { Repository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import { Ingredient } from '../entities/ingredient.entity';
import { DatabaseService } from './database.service';
import { CreateIngredientDTO } from '../dto/ingredients/create-ingredient.dto';
import { v4 as uuidv4 } from 'uuid';

export class IngredientsService {
  private static getRepository(): Repository<Ingredient> {
    const datasource = DatabaseService.getInstance().getDataSource();
    return datasource.getRepository(Ingredient);
  }

  static async findAll(): Promise<Ingredient[]> {
    const ingredientRepository = this.getRepository();
    return await ingredientRepository.find();
  }

  static async findById(id: string): Promise<Ingredient | null> {
    const ingredientRepository = this.getRepository();
    return await ingredientRepository.findOne({ where: { id } });
  }

  static async create(ingredient: CreateIngredientDTO): Promise<Ingredient> {
    const ingredientRepository = this.getRepository();
    const newIngredient: Ingredient = {
      ...ingredient,
      id: uuidv4(),
      imageUrl: ingredient.imageUrl || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      recipeLinks: ingredient.recipeLinks ?? [],
    };
    return await ingredientRepository.save(newIngredient);
  }

  static async update(
    id: string,
    ingredient: Partial<CreateIngredientDTO>,
  ): Promise<Ingredient | null> {
    const ingredientRepository = this.getRepository();
    const existingIngredient = await ingredientRepository.findOne({ where: { id } });

    if (!existingIngredient) {
      console.warn(`Ingredient with id ${id} not found for update.`);
      return null;
    }

    // Determine image handling:
    let newImageUrl = existingIngredient.imageUrl;
    if (Object.prototype.hasOwnProperty.call(ingredient, 'imageUrl')) {
      if (ingredient.imageUrl) {
        // replace image: remove old file if present and different
        if (existingIngredient.imageUrl && existingIngredient.imageUrl !== ingredient.imageUrl) {
          try {
            const uploadsDir = path.join(process.cwd(), 'uploads');
            const oldFilename = path.basename(existingIngredient.imageUrl);
            const oldPath = path.join(uploadsDir, oldFilename);
            await fs.promises.unlink(oldPath);
          } catch (err) {
            // if file doesn't exist or deletion fails, log and continue
            console.warn(`Failed to remove old image for ingredient ${id}:`, err);
          }
        }

        newImageUrl = ingredient.imageUrl;
      } else {
        // payload contains imageUrl but falsy (e.g. empty string or null) -> clear image
        // set to undefined in DB
        if (existingIngredient.imageUrl) {
          try {
            const uploadsDir = path.join(process.cwd(), 'uploads');
            const oldFilename = path.basename(existingIngredient.imageUrl);
            const oldPath = path.join(uploadsDir, oldFilename);
            await fs.promises.unlink(oldPath);
          } catch (err) {
            console.warn(`Failed to remove old image for ingredient ${id}:`, err);
          }
        }

        newImageUrl = undefined;
      }
    }

    const updatedIngredient: Ingredient = {
      ...existingIngredient,
      ...ingredient,
      imageUrl: newImageUrl,
      updatedAt: new Date(),
    };

    return await ingredientRepository.save(updatedIngredient);
  }

  static async delete(id: string): Promise<void> {
    const ingredientRepository = this.getRepository();
    const result = await ingredientRepository.delete(id);

    if (result.affected === 0) {
      console.warn(`Ingredient with id ${id} not found for deletion.`);
    }

    return;
  }
}
