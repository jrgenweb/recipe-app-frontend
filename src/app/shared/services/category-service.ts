import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/config';

import { BehaviorSubject } from 'rxjs';
import { IRecipeCategory, IRecipeCategoryResponse } from '@recipe/shared';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories$ = new BehaviorSubject<IRecipeCategory[]>([]);

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {}

  getAll() {
    return this.http.get<IRecipeCategoryResponse>(API_URL + '/categories').subscribe({
      next: (resp) => {
        this.categories$.next(resp.data);
      },
      error: (err) => {
        console.error(err);
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
      .subscribe((resp) => {
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
