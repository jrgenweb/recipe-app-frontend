import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { forkJoin, map, tap } from 'rxjs';

import {
  IRecipeListResponse,
  ISetRatingResponse,
  ICreateRecipe,
  IRecipeDetail,
  IRecipeCommentResponse,
  IRecipeList,
} from '@recipe/shared';

import { IUpdateRecipe } from '../../../shared/interfaces/update-recipe.interface';
import { environment } from '../../../../environments/environment';

//import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);

  constructor() {}

  getRecipes(search?: string, categoryId?: string, cuisineId?: string, ingredientIds?: string[]) {
    let params = new HttpParams();
    if (categoryId && categoryId != 'all') params = params.set('categoryId', String(categoryId));
    if (search) params = params.set('search', String(search));
    if (cuisineId && cuisineId !== 'all') params = params.set('cuisinId', String(cuisineId));
    if (ingredientIds && ingredientIds.length > 0) {
      params = params.set('ingredientIds', ingredientIds.join(','));
    }
    return this.http.get<IRecipeListResponse>(environment.apiUrl + '/recipes', { params });
  }

  fetchRecipes(
    search?: string,
    categoryId?: string,
    cuisinId?: string,
    ingredientIds?: string[],
    skip?: number,
    take?: number,
    own = false,
  ) {
    let params = new HttpParams();
    if (categoryId && categoryId !== 'all') params = params.set('categoryId', String(categoryId));
    if (cuisinId && cuisinId !== 'all') params = params.set('cuisinId', String(cuisinId));
    if (ingredientIds && ingredientIds.length > 0) {
      params = params.set('ingredientIds', ingredientIds.join(','));
    }

    if (search) params = params.set('search', String(search));
    if (skip) params = params.set('skip', skip);
    if (take) params = params.set('take', take);

    return this.http.get<IRecipeListResponse>(
      environment.apiUrl + (own ? '/recipes/my' : '/recipes'),
      {
        params,
      },
    );
  }

  getOwnRecipes(search?: string, categoryId?: string, cuisineId?: string) {
    let params = new HttpParams();
    if (categoryId && categoryId != 'all') params = params.set('categoryId', String(categoryId));
    if (search) params = params.set('search', String(search));
    if (cuisineId && cuisineId !== 'all') params = params.set('cuisineId', String(cuisineId));
    return this.http.get<IRecipeListResponse>(environment.apiUrl + '/recipes/my', { params });
  }

  get(id: string) {
    return this.http.get<IRecipeDetail>(environment.apiUrl + '/recipes/' + id);
  }
  create(recipe: ICreateRecipe) {
    return this.http.post<IRecipeList>(environment.apiUrl + '/recipes', { ...recipe });
  }

  //
  delete(recipeId: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/recipes/' + recipeId);
  }
  update(recipeId: string, recipe: IUpdateRecipe) {
    return this.http.patch(environment.apiUrl + '/recipes/' + recipeId, { ...recipe });
  }

  getRecipeDetail(recipeId: string) {
    return this.http.get<IRecipeDetail>(environment.apiUrl + '/recipes/' + recipeId);
  }
  getRecipeWithComments(id: string) {
    return forkJoin({
      recipe: this.http.get<IRecipeDetail>(environment.apiUrl + '/recipes/' + id),
      comments: this.http.get<{ data: IRecipeCommentResponse[] }>(
        environment.apiUrl + '/recipes/' + id + '/comments',
      ),
    }).pipe(
      map((res) => ({ recipe: res.recipe, comments: res.comments.data })),
      tap(() => {}),
    );
  }

  /**
   * Recipe rating
   * @param recipeId
   * @param rate
   * @returns
   */
  //recipes/:recipeId/ratings
  updateRating(recipeId: string, rate: number) {
    return this.http.post<ISetRatingResponse>(
      environment.apiUrl + '/recipes/' + recipeId + '/ratings',
      {
        rate: rate,
      },
    );
  }

  getRatingStat(recipeId: string) {
    return this.http.get(environment.apiUrl + '/recipes/' + recipeId + '/ratings/stat');
  }
  //- `GET /recipes/:recipeId/ratings/me` – Saját értékelés (védett)
  getRatingMe(recipeId: string) {
    return this.http.get(environment.apiUrl + '/recipes/' + recipeId + '/ratings/me');
  }
}
