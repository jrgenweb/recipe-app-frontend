import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeIngredient } from '@recipe/shared';
import { debounceTime, Subject } from 'rxjs';
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
  readonly filters = signal({ name: '' });

  private filterChange$ = new Subject<void>();

  constructor() {
    this.filterChange$.pipe(debounceTime(300)).subscribe(() => {
      const { name } = this.filters();
      this.loadAll(name);
    });
  }
  // --- Actions ---

  /** Kezdeti betöltés vagy keresés */
  loadAll(search?: string) {
    this._loading.set(true);
    this.ingredientService.fetchIngredients(search, 0, 8).subscribe({
      next: (resp) => {
        this._ingredients.set(resp);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  updateFilter(name: string) {
    this.filters.update((state) => ({ ...state, name }));
    this.filterChange$.next();
  }

  reset() {
    this._ingredients.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
