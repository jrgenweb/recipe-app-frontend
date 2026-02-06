import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/config';
import { BehaviorSubject, delay, forkJoin, interval, Observable, tap, timeout } from 'rxjs';
import { RatingService } from './rating-service';

import { IUpdateRecipe } from '../interfaces/update-recipe.interface';
import {
  IRecipeList,
  IRecipeListResponse,
  ISetRatingResponse,
  ICreateRecipe,
} from '@recipe/shared';
import { IRecipeDetail } from '@recipe/shared';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes$ = new BehaviorSubject<IRecipeListResponse>({ data: [], total: 0 });
  ownRecipes$ = new BehaviorSubject<IRecipeListResponse>({ data: [], total: 0 });
  loading = false;
  pageSize = 20;
  total = 0;

  constructor(
    private http: HttpClient,
    private ratingService: RatingService,
    private toastService: ToastService,
  ) {}

  getAllRecipes(search?: string, categoryId?: string) {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', String(categoryId));
    if (search) params = params.set('search', String(search));

    this.http.get<IRecipeListResponse>(API_URL + '/recipes', { params }).subscribe((resp) => {
      console.log(resp);
      this.recipes$.next(resp);
    });
  }

  loadNext(search?: string, categoryId?: string, cuisinId?: string, own = false) {
    if (this.loading) return;
    if (this.total && this.recipes$.value.data.length >= this.total) return;
    this.loading = true;
    const skip = this.recipes$.value.data.length;
    const take = this.pageSize;

    let params = new HttpParams();

    if (categoryId && categoryId !== 'all') params = params.set('categoryId', String(categoryId));
    if (cuisinId && cuisinId !== 'all') params = params.set('cuisinId', String(cuisinId));

    if (search) params = params.set('search', String(search));
    params = params.set('skip', skip);
    params = params.set('take', take);

    this.http
      .get<IRecipeListResponse>(API_URL + (own ? '/recipes/my' : '/recipes'), { params })
      .pipe(delay(500))
      .subscribe(
        (resp) => {
          console.log(resp);

          const updatedRecipes = {
            data: [...this.recipes$.value.data, ...resp.data],
            total: resp.total, // vagy: Math.max(this.recipes$.value.total, resp.total)
          };

          this.recipes$.next(updatedRecipes);
          this.total = resp.total;

          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
  }
  reset() {
    this.recipes$.next({ data: [], total: 0 });
    this.total = 0;
    this.loading = false;
  }

  getOwnRecipes(search?: string, categoryId?: string, skip?: number, take?: number) {
    let params = new HttpParams();
    if (skip) params = params.set('skip', String(skip));
    if (take) params = params.set('take', String(take));
    if (categoryId) params = params.set('categoryId', String(categoryId));
    if (search) params = params.set('search', String(search));
    this.http.get<IRecipeListResponse>(API_URL + '/recipes/my', { params }).subscribe((resp) => {
      this.ownRecipes$.next(resp);
    });
  }

  get(id: string) {
    return this.http.get<IRecipeDetail>(API_URL + '/recipes/' + id);
  }
  postComment(recipeId: string, text: string) {
    return this.http.post(API_URL + '/recipes/' + recipeId + '/comments', { text });
  }
  getRecipeWithComments(id: string) {
    return forkJoin({
      recipe: this.http.get<any>(API_URL + '/recipes/' + id),
      comments: this.http.get<any[]>(API_URL + '/recipes/' + id + '/comments'),
    }).pipe(
      tap((resp) => {
        console.log(resp);
      }),
    );
  }
  //recipes/:recipeId/ratings
  rateRecipe(recipeId: string, rate: number) {
    return this.http
      .post<ISetRatingResponse>(API_URL + '/recipes/' + recipeId + '/ratings', {
        rate: rate,
      })

      .subscribe({
        next: (resp) => {
          const oldRecipes = this.recipes$.value.data;
          const updatedRecipes = oldRecipes.map((r) => {
            if (r.id === resp.id) {
              return {
                ...r,
                avgRating: resp.avgRating, // a backendből jövő új érték
                ratingCount: resp.ratingCount,
              };
            }
            return r;
          });

          this.recipes$.next({
            ...this.recipes$.value,
            data: updatedRecipes,
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  create(recipe: ICreateRecipe) {
    this.http.post(API_URL + '/recipes', { ...recipe }).subscribe((resp) => {
      this.toastService.add({ message: 'Sikeresen hozzáadtad a receptet', type: 'success' });
    });
  }

  //
  delete(recipeId: string) {
    this.http.delete<{ deleted: boolean }>(API_URL + '/recipes/' + recipeId).subscribe((resp) => {
      if (resp.deleted && resp.deleted === true) {
        const oldRecipesData = [...this.recipes$.value.data];

        const updatedRecipesData = oldRecipesData.filter((r) => r.id !== recipeId);
        const updatedRecipeCount = this.recipes$.value.total - 1;
        this.recipes$.next({ data: updatedRecipesData, total: updatedRecipeCount });
        this.toastService.add({ message: 'Sikeresen törölted a receptet', type: 'success' });
      } else {
        this.toastService.add({ message: 'Hiba a recept törlésekor ', type: 'danger' });
      }
    });
  }
  update(recipeId: string, recipe: IUpdateRecipe) {
    this.http.patch(API_URL + '/recipes/' + recipeId, { ...recipe }).subscribe((resp) => {
      this.toastService.add({ message: 'Sikeresen szerkesztetted a receptet', type: 'success' });
    });
  }
}
