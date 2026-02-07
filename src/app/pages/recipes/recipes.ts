import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { RecipeService } from '../../shared/services/recipe-service';

import { FavoriteService } from '../../shared/services/favorite-service';
import { AuthService } from '../../shared/services/auth-service';
import { RecipeCard } from '../../components/recipe-card/recipe-card';

import { SelectIngredient } from '../../components/select-ingredient/select-ingredient';
import { toSignal } from '@angular/core/rxjs-interop';
import { IRecipeIngredient } from '@recipe/shared';
import { RecipeFilter } from '../../components/recipe-filter/recipe-filter';
import { InfiniteScroll } from '../../components/infinite-scroll/infinite-scroll';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RecipeCard, InfiniteScroll, SelectIngredient],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  // Signals a filter state-re
  categoryId = signal('');
  cuisinId = signal('');
  searchString = signal('');

  //Services
  private recipeService = inject(RecipeService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  recipes = toSignal(this.recipeService.recipes$, { initialValue: { data: [], total: 0 } });
  favoriteRecipeIds = toSignal(this.favoriteService.favoriteIds$, { initialValue: [] });
  ingredientIds = signal<string[]>([]);

  // Computed view model
  vm = computed(() => ({
    categoryId: this.categoryId(),
    cuisinId: this.cuisinId(),
    searchString: this.searchString(),
    recipes: this.recipes(),
    favoriteRecipes: this.favoriteRecipeIds(),
    loading: this.recipeService.loading,
    hasResults: this.recipeService.recipes$.value.data?.length > 0,
  }));

  // 🔥 Effect a filter változásokra
  private filterEffect = effect(() => {
    this.categoryId();
    this.cuisinId();
    this.searchString();
    this.ingredientIds();

    // minden változáskor reset + loadNext
    this.recipeService.reset();
    this.loadNext();
  });

  constructor() {}

  ngOnInit(): void {
    // Alapadatok
    this.favoriteService.getAll();
  }

  loadMore(inf: InfiniteScroll) {
    this.loadNext();
  }
  // LoadNext mindig signalsból hívható
  loadNext() {
    this.recipeService.loadNext(
      this.searchString(),
      this.categoryId(),
      this.cuisinId(),
      this.ingredientIds(),
    );
  }

  // Setterek – ez triggereli az effect-et
  changeCategory(categoryId: string) {
    this.categoryId.set(categoryId);
  }

  changeCuisin(cuisinId: string) {
    this.cuisinId.set(cuisinId);
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);
    this.ingredientIds.set(ingredientIds);
  }
}
