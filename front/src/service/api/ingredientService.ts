import type { IngredientFormData } from "../../components/ingredient/form/ingredientForm/IngredientForm";
import type { Ingredient } from "../../models/Ingredient";
import api from "./api";

export const getIngredientsList = async (): Promise<Ingredient[]> => {
  const response = await api.get<Ingredient[]>("/ingredients");
  return response.data;
};

export const postIngredient = async (
  data: IngredientFormData, // ajouter le file en second argument optionnel
): Promise<Ingredient> => {
  const form = new FormData();
  form.append("name", data.name);
  if (data.description) form.append("description", data.description);
  if (data.image) form.append("image", data.image);

  const response = await api.post<Ingredient>("/ingredients", form);
  return response.data;
};
