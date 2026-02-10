import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { IRecipeCategory, IRecipeCategoryResponse } from '@recipe/shared';
import { ToastService } from '../../../../../shared/services/toast-service';
import { API_URL } from '../../../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories$ = new BehaviorSubject<IRecipeCategory[]>([]);

  isLoading = false;
  total?: number;
  pageSize = 10;

  private http: HttpClient = inject(HttpClient);
  private toastService: ToastService = inject(ToastService);
  constructor() {}

  loadNext(search?: string) {
    if (this.isLoading) return;
    if (this.total && this.categories$.value.length >= this.total) return;
    this.isLoading = true;
    const skip = this.categories$.value.length;
    const take = this.pageSize;

    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    this.http
      .get<{ data: IRecipeCategory[]; total: number }>(API_URL + '/categories', {
        params,
      })
      .subscribe((resp) => {
        this.categories$.next([...this.categories$.value, ...resp.data]);
        this.total = resp.total;
        this.isLoading = false;
        //inf?.done();
      });
  }
  reset() {
    this.categories$.next([]);
    this.total = undefined;
  }
  getAll() {
    return this.http.get<IRecipeCategoryResponse>(API_URL + '/categories').subscribe({
      next: (resp) => {
        this.categories$.next(resp.data);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
    });
  }
  create(categoryName: string) {
    this.http
      .post<IRecipeCategory>(API_URL + '/categories', { name: categoryName })
      .subscribe((resp) => {
        const oldCategories = [...this.categories$.value];
        oldCategories.push(resp);
        this.categories$.next(oldCategories);
        this.toastService.add({ message: 'Sikeresen hozzáadtad a kategóriát!', type: 'primary' });
      });
  }
  delete(id: string) {
    this.http.delete<{ deleted: boolean }>(API_URL + '/categories/' + id).subscribe((resp) => {
      if (resp.deleted) {
        const updatedCategories = this.categories$.value.filter((c) => c.id !== id);

        this.categories$.next(updatedCategories);
        this.toastService.add({ message: 'Sikeresen törölted a kategóriát!', type: 'primary' });
      } else {
        this.toastService.add({ message: 'Hiba történt', type: 'danger' });
      }
    });
  }
  update(category: IRecipeCategory) {
    this.http
      .patch<IRecipeCategory>(API_URL + '/categories/' + category.id, { name: category.name })
      .subscribe((_resp) => {
        /* const oldCategories = [...this.categories$.value];
        oldCategories.push(resp);
        this.categories$.next(oldCategories); */
        this.toastService.add({
          message: 'Sikeresen szerkesztetted a kategóriát!',
          type: 'primary',
        });
      });
  }
}
