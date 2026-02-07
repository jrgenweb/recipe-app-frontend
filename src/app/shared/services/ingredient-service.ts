import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../../config/config';
import {
  ICreateRecipeIngredient,
  IRecipeIngredient,
  IUpdateRecipeIngredient,
} from '@recipe/shared';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  ingredients$ = new BehaviorSubject<IRecipeIngredient[]>([]);

  isLoading = false;
  total?: number;
  pageSize = 20;

  private http: HttpClient = inject(HttpClient);

  constructor() {}

  loadNext(search?: string) {
    if (this.isLoading) return;
    if (this.total && this.ingredients$.value.length >= this.total) return;
    this.isLoading = true;
    const skip = this.ingredients$.value.length;
    const take = this.pageSize;

    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    return this.http
      .get<{ data: IRecipeIngredient[]; total: number }>(API_URL + '/ingredients', {
        params,
      })
      .subscribe((resp) => {
        this.ingredients$.next([...this.ingredients$.value, ...resp.data]);
        this.total = resp.total;
        this.isLoading = false;
      });
  }

  reset() {
    this.ingredients$.next([]);
    this.total = undefined;
    this.isLoading = false;
  }

  getAll() {
    this.http
      .get<{ data: IRecipeIngredient[]; total: number }>(API_URL + '/ingredients')
      .subscribe((resp) => {
        this.ingredients$.next(resp.data);
      });
  }

  create(ingredient: ICreateRecipeIngredient) {
    this.http.post(API_URL + '/ingredients', ingredient).subscribe((_resp) => {});
  }

  update(ingredient: IUpdateRecipeIngredient, ingredientId: string) {
    return this.http.patch(API_URL + '/ingredients/' + ingredientId, ingredient);
  }

  delete(id: string) {
    return this.http.delete(API_URL + '/ingredients/' + id);
  }
}
