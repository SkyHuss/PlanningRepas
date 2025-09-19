import type { IngredientFormData } from "../../components/ingredient/form/ingredientForm/IngredientForm";
import type { Ingredient } from "../../models/Ingredient";
import api from "./api";

export const getIngredientsList = async (): Promise<Ingredient[]> => {
  const response = await api.get<Ingredient[]>("/ingredients");
  return response.data;
};

export const postIngredient = async (
  data: IngredientFormData,
): Promise<Ingredient> => {
  const response = await api.post<Ingredient>("/ingredients", data);
  return response.data;
};
