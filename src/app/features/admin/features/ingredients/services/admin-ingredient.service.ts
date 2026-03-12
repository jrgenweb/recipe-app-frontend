import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import {
  ICreateRecipeIngredient,
  IRecipeIngredient,
  IUpdateRecipeIngredient,
} from '@recipe/shared';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminIngredientService {
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getAll() {
    return this.http.get<{ data: IRecipeIngredient[]; total: number }>(
      environment.apiUrl + '/ingredients',
    );
  }

  fetchIngredients(search?: string, skip = 0, take = 20) {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    return this.http.get<{ data: IRecipeIngredient[]; total: number }>(
      environment.apiUrl + '/ingredients',
      {
        params,
      },
    );
  }

  create(ingredient: ICreateRecipeIngredient) {
    return this.http.post<IRecipeIngredient>(environment.apiUrl + '/ingredients', ingredient);
  }

  update(ingredientId: string, ingredient: IUpdateRecipeIngredient) {
    return this.http.patch<IRecipeIngredient>(
      environment.apiUrl + '/ingredients/' + ingredientId,
      ingredient,
    );
  }

  delete(id: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/ingredients/' + id);
  }
}
