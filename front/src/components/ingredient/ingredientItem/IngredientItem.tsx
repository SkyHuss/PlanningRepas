import type { Ingredient } from "../../../models/Ingredient";
import "./IngredientItem.css";

interface Props {
  ingredient: Ingredient;
}

const joinUrl = (base: string | undefined, p: string | undefined) => {
  if (!p) return "";
  const b = (base ?? "").replace(/\/$/, ""); // remove trailing slash
  const path = p.startsWith("/") ? p : `/${p}`;
  return b ? `${b}${path}` : path; // if no base, return path (relative)
};

export default function IngredientItem({ ingredient }: Props) {
  const imageSrc = joinUrl(import.meta.env.VITE_API_URL, ingredient.imageUrl);

  return (
    <div className="ingredient-item-container">
      {ingredient.imageUrl ? (
        <img src={imageSrc} alt={ingredient.name} />
      ) : (
        <img
          src="/assets/no-pictures.png"
          alt="no-image"
          className="no-image"
        />
      )}

      <div className="details">
        <div className="name">{ingredient.name}</div>
        <div className="description">{ingredient.description}</div>
        <div className="stock-container">
          <div className="amount">x5</div>
        </div>
      </div>
    </div>
  );
}
