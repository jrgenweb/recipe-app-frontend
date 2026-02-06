import { ICreateRecipe as ICreateRecipeShared } from '@recipe/shared';

export interface IUpdateRecipe extends Partial<ICreateRecipeShared> {}
