import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  getAll() {
    this.http
      .get<{ data: IRecipeIngredient[]; total: number }>(API_URL + '/ingredients')
      .subscribe((resp) => {
        this.ingredients$.next(resp.data);
      });
  }
  create(ingredient: ICreateRecipeIngredient) {
    this.http.post(API_URL + '/ingredients', ingredient).subscribe((reps) => {});
  }
  update(ingredient: IUpdateRecipeIngredient, ingredientId: string) {
    return this.http.patch(API_URL + '/ingredients/' + ingredientId, ingredient);
  }
  delete(id: string) {
    return this.http.delete(API_URL + '/ingredients/' + id);
  }
}
