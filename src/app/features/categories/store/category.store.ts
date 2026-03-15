import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeCategoryResponse, IRecipeCategory } from '@recipe/shared';
import { finalize } from 'rxjs';

import { ToastService } from '../../../shared/services/toast-service';

import { CategoryService } from '../services/category-service';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
  private categoryService = inject(CategoryService);
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
    this.categoryService.getAll().subscribe({
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
  reset() {
    this._categories.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
