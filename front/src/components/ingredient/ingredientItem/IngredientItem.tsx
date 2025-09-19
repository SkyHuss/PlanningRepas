import type { Ingredient } from "../../../models/Ingredient";

interface Props {
  ingredient: Ingredient;
}

export default function IngredientItem({ ingredient }: Props) {
  return <div className="ingredient-item-container">{ingredient.name}</div>;
}
