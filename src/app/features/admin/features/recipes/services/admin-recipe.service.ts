import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, delay, forkJoin, map, tap } from 'rxjs';

import {
  IRecipeListResponse,
  ISetRatingResponse,
  ICreateRecipe,
  IRecipeDetail,
  IRecipeCommentResponse,
  IRecipeList,
} from '@recipe/shared';
import { API_URL } from '../../../../../config/config';
import { IUpdateRecipe } from '../../../../../shared/interfaces/update-recipe.interface';

//import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class AdminRecipeService {
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
    return this.http.get<IRecipeListResponse>(API_URL + '/recipes', { params }).pipe(delay(500));
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

    return this.http
      .get<IRecipeListResponse>(API_URL + (own ? '/recipes/my' : '/recipes'), { params })
      .pipe(delay(500)); //delay(500)
  }

  getOwnRecipes(search?: string, categoryId?: string, skip?: number, take?: number) {
    let params = new HttpParams();
    if (skip) params = params.set('skip', String(skip));
    if (take) params = params.set('take', String(take));
    if (categoryId) params = params.set('categoryId', String(categoryId));
    if (search) params = params.set('search', String(search));
    return this.http.get<IRecipeListResponse>(API_URL + '/recipes/my', { params });
  }

  get(id: string) {
    return this.http.get<IRecipeDetail>(API_URL + '/recipes/' + id);
  }
  create(recipe: ICreateRecipe) {
    return this.http.post<IRecipeList>(API_URL + '/recipes', { ...recipe });
  }

  //
  delete(recipeId: string) {
    return this.http.delete<{ deleted: boolean }>(API_URL + '/recipes/' + recipeId);
  }
  update(recipeId: string, recipe: IUpdateRecipe) {
    return this.http.patch(API_URL + '/recipes/' + recipeId, { ...recipe });
  }

  getRecipeDetail(recipeId: string) {
    return this.http.get<IRecipeDetail>(API_URL + '/recipes/' + recipeId);
  }
  getRecipeWithComments(id: string) {
    return forkJoin({
      recipe: this.http.get<IRecipeDetail>(API_URL + '/recipes/' + id),
      comments: this.http.get<{ data: IRecipeCommentResponse[] }>(
        API_URL + '/recipes/' + id + '/comments',
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
    return this.http.post<ISetRatingResponse>(API_URL + '/recipes/' + recipeId + '/ratings', {
      rate: rate,
    });
  }

  getRatingStat(recipeId: string) {
    return this.http.get(API_URL + '/recipes/' + recipeId + '/ratings/stat');
  }
  //- `GET /recipes/:recipeId/ratings/me` – Saját értékelés (védett)
  getRatingMe(recipeId: string) {
    return this.http.get(API_URL + '/recipes/' + recipeId + '/ratings/me');
  }
}
