import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { IRecipeCategory, IRecipeCategoryResponse } from '@recipe/shared';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getAll() {
    return this.http.get<IRecipeCategoryResponse>(environment.apiUrl + '/categories');
  }
  fetchCategories(search?: string, skip = 0, take = 20) {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    return this.http.get<{ data: IRecipeCategory[]; total: number }>(
      environment.apiUrl + '/categories',
      {
        params,
      },
    );
  }
}
