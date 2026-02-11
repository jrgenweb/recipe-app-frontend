import { inject, Injectable, signal, computed } from '@angular/core';

import {
  IRecipeCategoryResponse,
  IRecipeCategory,
  IRecipeIngredient,
  ICreateRecipeIngredient,
  IUpdateRecipeIngredient,
} from '@recipe/shared';
import { finalize, tap } from 'rxjs';

import { ToastService } from '../../../../../shared/services/toast-service';

import { AdminIngredientService } from '../services/admin-ingredient.service';

@Injectable({ providedIn: 'root' })
export class AdminIngredientStore {
  private ingredientService = inject(AdminIngredientService);
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

  create(ingredient: ICreateRecipeIngredient) {
    this._loading.set(true);
    this.ingredientService.create(ingredient).subscribe({
      next: (resp) => {
        this._ingredients.update((state) => ({
          data: [...state.data, resp],
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a hozzávalót!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  update(ingredientId: string, ingredient: IUpdateRecipeIngredient) {
    this._loading.set(true);
    this.ingredientService.update(ingredientId, ingredient).subscribe({
      next: (resp) => {
        this._ingredients.update((state) => ({
          data: state.data.map((c) => {
            if (c.id === resp.id) {
              return resp;
            } else {
              return c;
            }
          }),
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a hozzávalót!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  delete(cusineId: string) {
    this._loading.set(true);
    this.ingredientService.delete(cusineId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          this._ingredients.update((state) => ({
            data: state.data.filter((c) => c.id !== cusineId),
            total: state.total - 1,
          }));
          this.toastService.add({ message: 'Sikeresen törölted a hozzávalót!', type: 'primary' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      },
      complete: () => this._loading.set(false),
    });
  }

  reset() {
    this._ingredients.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
