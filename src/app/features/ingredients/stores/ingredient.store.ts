import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeIngredient } from '@recipe/shared';
import { finalize, tap } from 'rxjs';
import { IngredientService } from '../services/ingredient.service';
import { ToastService } from '../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class IngredientStore {
  private ingredientService = inject(IngredientService);
  private toastService = inject(ToastService);

  // --- State ---
  private _ingredients = signal<{ data: IRecipeIngredient[]; total: number }>({
    data: [],
    total: 0,
  });

  // --- Selectors ---

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- Selectors (Publikus readonly jelek) ---
  readonly ingredients = computed(() => this._ingredients().data);
  readonly total = computed(() => this._ingredients().total);
  readonly isLoading = computed(() => this._loading());

  // --- Actions ---

  /** Kezdeti betöltés vagy keresés */
  loadAll(search?: string) {
    this._loading.set(true);
    this.ingredientService.fetchIngredients(search).subscribe({
      next: (resp) => {
        this._ingredients.set(resp);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext(search?: string) {
    if (this._loading() || (this.total() > 0 && this.ingredients().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.ingredients().length;
    this.ingredientService
      .fetchIngredients(search, skip, 20)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._ingredients.update((state) => ({
          data: [...state.data, ...resp.data],
          total: resp.total,
        }));
      });
  }

  reset() {
    this._ingredients.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
