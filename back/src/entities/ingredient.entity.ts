import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecipeIngredient } from "./recipe.ingredient.entity";

@Entity("ingredients")
export class Ingredient {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true, nullable: false })
    name!: string;

    @Column({nullable: true})
    description?: string;

    @OneToMany(() => RecipeIngredient, ri => ri.ingredient)
    recipeLinks!: RecipeIngredient[];
}