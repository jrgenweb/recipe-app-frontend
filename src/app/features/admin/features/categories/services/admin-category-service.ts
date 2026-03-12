import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { IRecipeCategory, IRecipeCategoryResponse } from '@recipe/shared';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
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
  create(categoryName: string) {
    return this.http.post<IRecipeCategory>(environment.apiUrl + '/categories', {
      name: categoryName,
    });
  }
  delete(id: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/categories/' + id);
  }
  update(category: IRecipeCategory) {
    return this.http.patch<IRecipeCategory>(environment.apiUrl + '/categories/' + category.id, {
      name: category.name,
    });
  }
}
