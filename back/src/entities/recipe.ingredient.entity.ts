import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipes.entity';
import { Ingredient } from './ingredient.entity';
import { Unit } from '../types/unit.type';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeLinks, { eager: true })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient!: Ingredient;

  @Column({ type: 'float' })
  quantity!: number;

  @Column({ type: 'enum', enum: Unit, default: Unit.UNIT })
  unit!: Unit;

  @Column({ type: 'text', nullable: true })
  preparation?: string; // ex: "hashed", "diced", "sliced", etc.
}
