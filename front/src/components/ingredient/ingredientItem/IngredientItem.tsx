import type { Ingredient } from "../../../models/Ingredient";

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
      {ingredient.name}
      {ingredient.imageUrl ? (
        <img src={imageSrc} alt={ingredient.name} />
      ) : null}
    </div>
  );
}
