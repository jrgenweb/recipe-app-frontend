import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';

import { IRecipeIngredient } from '@recipe/shared';
import { environment } from '../../../environments/environment';

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

  reset() {
    this.ingredients$.next([]);
    this.total = undefined;
    this.isLoading = false;
  }

  getAll() {
    this.http
      .get<{ data: IRecipeIngredient[]; total: number }>(environment.apiUrl + '/ingredients')
      .subscribe((resp) => {
        this.ingredients$.next(resp.data);
      });
  }
}
