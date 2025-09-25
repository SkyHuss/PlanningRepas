import { Repository } from 'typeorm';
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

    const updatedIngredient: Ingredient = {
      ...existingIngredient,
      ...ingredient,
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
