import { inject, Injectable, signal, computed } from '@angular/core';

import {
  IRecipeListResponse,
  IRecipeFavoriteResponse,
  ICreateRecipe,
  IRecipeDetail,
  IUpdateRecipeIngredient,
} from '@recipe/shared';
import { debounceTime, filter, finalize, Subject, tap } from 'rxjs';
import { AdminRecipeService } from '../services/admin-recipe.service';
import { ToastService } from '../../../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class AdminRecipeStore {
  private recipeService = inject(AdminRecipeService);

  private toastService = inject(ToastService);

  // --- State ---
  private _recipes = signal<IRecipeListResponse>({ data: [], total: 0 });

  private _favoriteRecipes = signal<IRecipeFavoriteResponse>({ data: [], total: 0 });
  private _favoriteRecipeIds = signal<string[]>([]);
  private _myRecipes = signal<IRecipeListResponse>({ data: [], total: 0 });
  private _selectedRecipe = signal<IRecipeDetail | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- Selectors (Publikus readonly jelek) ---
  readonly recipes = computed(() => this._recipes().data);
  readonly total = computed(() => this._recipes().total);
  readonly isLoading = computed(() => this._loading());
  readonly favoriteRecipes = computed(() => this._favoriteRecipes().data);
  readonly favoriteRecipeIds = computed(() => this._favoriteRecipeIds());
  readonly selectedRecipe = computed(() => this._selectedRecipe());
  readonly myRecipes = computed(() => this._myRecipes().data);

  readonly filters = signal({
    search: '',
    categoryId: '',
    cuisineId: '',
    ingredientIds: [] as string[],
  });

  private filterChange$ = new Subject<void>();
  //isFavorite = (recipeId: string) => computed(() => this._favoriteRecipeIds().includes(recipeId));

  constructor() {
    this.filterChange$.pipe(debounceTime(300)).subscribe(() => {
      const { search, categoryId, cuisineId, ingredientIds } = this.filters();
      this.loadAll(search, categoryId, cuisineId, ingredientIds);
    });
  }

  /** Kezdeti betöltés vagy keresés */
  loadAll(search?: string, categoryId?: string, cuisinId?: string, ingredientIds?: string[]) {
    this._loading.set(true);
    this.recipeService.getRecipes(search, categoryId, cuisinId, ingredientIds).subscribe({
      next: (resp) => this._recipes.set(resp),
      error: (err) => this._error.set(err.message),
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext() {
    if (this._loading() || (this.total() > 0 && this.recipes().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.recipes().length;
    const { search, categoryId, cuisineId, ingredientIds } = this.filters();
    this.recipeService
      .fetchRecipes(search, categoryId, cuisineId, ingredientIds, skip, 20, false)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._recipes.update((state) => ({
          data: [...state.data, ...resp.data],
          total: resp.total,
        }));
      });
  }

  getOwnRecipes() {
    this._loading.set(true);
    this.recipeService.getOwnRecipes().subscribe({
      next: (resp) => {
        this._myRecipes.set(resp);
      },
      error: (err) => this._error.set(err.message),
      complete: () => this._loading.set(false),
    });
  }

  loadDetail(id: string) {
    this._loading.set(true);
    this._selectedRecipe.set(null);
    this.recipeService
      .getRecipeDetail(id)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._selectedRecipe.set(res);
        },
        error: (err: { message: string }) => this._error.set(err.message),
      });
  }

  updateFilters(
    partial: Partial<{
      search: string;
      categoryId: string;
      cuisineId: string;
      ingredientIds: string[];
    }>,
  ) {
    this.filters.update((f) => ({ ...f, ...partial }));
    this.filterChange$.next();
  }

  create(recipe: ICreateRecipe) {
    this.recipeService.create(recipe).subscribe((resp) => {
      this._recipes.update((state) => ({
        data: [...state.data, resp], // itt megkell nézni az interface-t
        total: state.total + 1,
      }));
      this.toastService.add({ message: 'Sikeresen hozzáadtad a receptet', type: 'success' });
    });
  }
  update(recipeId: string, recipe: IUpdateRecipeIngredient) {
    this.recipeService.update(recipeId, recipe).subscribe(() => {
      this.toastService.add({ message: 'Sikeresen szerkesztetted a receptet', type: 'success' });
    });
  }

  /** Törlés a listából */
  removeRecipe(id: string) {
    this.recipeService.delete(id).subscribe((resp) => {
      if (resp.deleted && resp.deleted === true) {
        this._recipes.update((state) => ({
          data: state.data.filter((r) => r.id !== id),
          total: state.total - 1,
        }));
        this.toastService.add({ message: 'Sikeresen törölted a receptet', type: 'success' });
      } else {
        this.toastService.add({ message: 'Hiba a recept törlésekor ', type: 'danger' });
      }
    });
  }

  reset() {
    this._recipes.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
