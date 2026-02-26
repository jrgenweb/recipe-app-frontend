import { inject, Injectable, signal, computed, effect, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe-service';
import {
  IRecipeListResponse,
  IRecipeFavoriteResponse,
  ICreateRecipe,
  IRecipeDetail,
} from '@recipe/shared';
import { debounceTime, finalize, Subject, tap } from 'rxjs';
import { FavoriteService } from '../services/favorite-service';
import { ToastService } from '../../../shared/services/toast-service';
import { IUpdateRecipe } from '../../../shared/interfaces/update-recipe.interface';
import { AuthService } from '../../../shared/services/auth-service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class RecipeStore implements OnInit {
  private recipeService = inject(RecipeService);
  private favoriteService = inject(FavoriteService);
  private toastService = inject(ToastService);
  private auth = inject(AuthService);

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

  //filterezéshez
  readonly filters = signal({
    search: '',
    categoryId: '',
    cuisineId: '',
    ingredientIds: [] as string[],
  });
  readonly myFilters = signal({ search: '', categoryId: '', cuisineId: '' });

  isFavorite = (recipeId: string) => computed(() => this._favoriteRecipeIds().includes(recipeId));

  // --- Trigger subject a debounce-hoz ---
  private filterChange$ = new Subject<void>();
  private myFilterChange$ = new Subject<void>();

  constructor() {
    this.filterChange$.pipe(debounceTime(300)).subscribe(() => {
      const { search, categoryId, cuisineId, ingredientIds } = this.filters();
      this.loadAll(search, categoryId, cuisineId, ingredientIds);
    });

    this.myFilterChange$.pipe(debounceTime(300)).subscribe(() => {
      const myFilters = this.myFilters();
      this.getOwnRecipes(myFilters.search, myFilters.categoryId, myFilters.cuisineId);
    });

    const isAuthenticated$ = toObservable(this.auth.isAuthenticated);
    isAuthenticated$.subscribe((state) => {
      if (state) {
        this.loadFavorites();
        this.getOwnRecipes();
      }
    });
  }

  ngOnInit(): void {}
  // --- Actions ---

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

  getOwnRecipes(search?: string, categoryId?: string, cuisineId?: string) {
    if (this._loading() || (this.total() > 0 && this.recipes().length >= this.total())) return;
    this._loading.set(true);
    const skip = this._myRecipes().data.length;

    this._loading.set(true);
    this.recipeService.getOwnRecipes(search, categoryId, cuisineId).subscribe({
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
  updateMyFilter(partial: Partial<{ search: string; categoryId: string; cuisineId: string }>) {
    this.myFilters.update((f) => ({ ...f, ...partial }));
    this.myFilterChange$.next();
  }

  /** Kedvencek betöltése (például alkalmazás indításakor vagy login után) */
  loadFavorites() {
    this._loading.set(true);
    this.favoriteService.getAll().subscribe({
      next: (favs) => {
        this._favoriteRecipes.set(favs);
        this._favoriteRecipeIds.set(favs.data.map((r) => r.recipeId));
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Kedvenc állapot váltása (Add/Remove) */
  toggleFavorite(recipeId: string) {
    const isFav = this._favoriteRecipeIds().includes(recipeId);

    // Optimista UI update
    if (isFav) {
      // Eltávolítás
      this._favoriteRecipeIds.update((ids) => ids.filter((id) => id !== recipeId));
      this._favoriteRecipes.update((state) => ({
        data: state.data.filter((f) => f.recipeId !== recipeId),
        total: state.total - 1,
      }));

      this.favoriteService.delete(recipeId).subscribe({
        error: () => {
          // rollback
          this._favoriteRecipeIds.update((ids) => [...ids, recipeId]);
          this._favoriteRecipes.update((state) => ({
            data: [...state.data.filter((f) => f.recipeId !== recipeId)], // minimal rollback
            total: state.total + 1,
          }));
        },
      });
    } else {
      // Hozzáadás
      this._favoriteRecipeIds.update((ids) => [...ids, recipeId]);

      const setFavoritedRecipe = this.recipes().find((r) => r.id === recipeId);

      if (setFavoritedRecipe) {
        this._favoriteRecipeIds.update((ids) => [...ids, recipeId]);
        this._favoriteRecipes.update((state) => ({
          data: [
            ...state.data,
            {
              createdAt: setFavoritedRecipe?.creatadAt,
              recipeId: setFavoritedRecipe?.id,
              recipe: setFavoritedRecipe,
              updatedAt: setFavoritedRecipe?.updatedAt,
              userId: setFavoritedRecipe?.userId,
            },
          ],
          total: state.total + 1,
        }));
      }

      this.favoriteService.set(recipeId).subscribe({
        error: () => {
          // rollback
          this._favoriteRecipeIds.update((ids) => ids.filter((id) => id !== recipeId));
          this._favoriteRecipes.update((state) => ({
            data: state.data.filter((f) => f.recipeId !== recipeId),
            total: state.total - 1,
          }));
        },
      });
    }
  }

  /** Értékelés frissítése a listában */
  updateRating(id: string, rate: number) {
    this.recipeService.updateRating(id, rate).subscribe({
      next: (resp) => {
        const { avgRating, ratingCount } = resp;
        this._recipes.update((state) => ({
          ...state,
          data: state.data.map((r) => (r.id === id ? { ...r, avgRating, ratingCount } : r)),
        }));

        // Frissítjük a részletes nézetet (ha épp ezt a receptet nézzük)
        const currentSelected = this._selectedRecipe();
        if (currentSelected && currentSelected.id === id) {
          this._selectedRecipe.set({
            ...currentSelected,
            avgRating,
            ratingCount,
          });
        }
      },
      error: () => {},
    });
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
  update(recipeId: string, recipe: IUpdateRecipe) {
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
