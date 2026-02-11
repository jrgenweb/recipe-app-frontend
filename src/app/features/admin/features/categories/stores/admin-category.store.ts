import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeCategoryResponse, IRecipeCategory } from '@recipe/shared';
import { finalize, tap } from 'rxjs';
import { AdminCategoryService } from '../services/admin-category-service';
import { ToastService } from '../../../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class AdminCategoryStore {
  private categoryService = inject(AdminCategoryService);
  private toastService = inject(ToastService);

  // --- State ---
  private _categories = signal<IRecipeCategoryResponse>({ data: [], total: 0 });

  // --- Selectors ---

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- Selectors (Publikus readonly jelek) ---
  readonly categories = computed(() => this._categories().data);
  readonly total = computed(() => this._categories().total);
  readonly isLoading = computed(() => this._loading());

  // --- Actions ---

  /** Kezdeti betöltés vagy keresés */
  loadAll(search?: string) {
    this._loading.set(true);
    this.categoryService.fetchCategories(search).subscribe({
      next: (resp) => {
        this._categories.set(resp);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext(search?: string) {
    if (this._loading() || (this.total() > 0 && this.categories().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.categories().length;
    this.categoryService
      .fetchCategories(search, skip, 20)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._categories.update((state) => ({
          data: [...state.data, ...resp.data],
          total: resp.total,
        }));
      });
  }

  create(categoryName: string) {
    this._loading.set(true);
    this.categoryService.create(categoryName).subscribe({
      next: (resp) => {
        this._categories.update((state) => ({
          data: [...state.data, resp],
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a kategóriát!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  update(category: IRecipeCategory) {
    this._loading.set(true);
    this.categoryService.update(category).subscribe({
      next: (resp) => {
        this._categories.update((state) => ({
          data: state.data.map((c) => {
            if (c.id === resp.id) {
              return resp;
            } else {
              return c;
            }
          }),
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a kategóriát!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  delete(categoryId: string) {
    this._loading.set(true);
    this.categoryService.delete(categoryId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          this._categories.update((state) => ({
            data: state.data.filter((c) => c.id !== categoryId),
            total: state.total - 1,
          }));
          this.toastService.add({ message: 'Sikeresen törölted a kategóriát!', type: 'primary' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      },
      complete: () => this._loading.set(false),
    });
  }

  reset() {
    this._categories.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
