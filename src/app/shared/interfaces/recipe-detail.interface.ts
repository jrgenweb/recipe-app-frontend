export interface IRecipeDetail {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  recipeImages: IRecipeImage[];
}

interface IRecipeImage {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
