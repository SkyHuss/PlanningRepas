export type Ingredient = {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  recipesLinks: string[];
  image?: string;
};
