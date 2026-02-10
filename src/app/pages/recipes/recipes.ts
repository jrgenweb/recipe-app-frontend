import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { AuthService } from '../../shared/services/auth-service';

import { toSignal } from '@angular/core/rxjs-interop';
import { IRecipeIngredient } from '@recipe/shared';

import { InfiniteScroll } from '../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeCard } from '../../features/recipes/components/recipe-card/recipe-card';
import { SelectIngredient } from '../../features/recipes/components/select-ingredient/select-ingredient';
import { RecipeService } from '../../features/recipes/services/recipe-service';
import { FavoriteService } from '../../features/recipes/services/favorite-service';
import { RecipeStore } from '../../features/recipes/stores/recipe.store';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RecipeCard, InfiniteScroll, SelectIngredient],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  // Signals a filter state-re
  categoryId = signal('');
  cuisineId = signal('');
  searchString = signal('');

  public recipeStore = inject(RecipeStore);

  //recipes = toSignal(this.recipeService.recipes$, { initialValue: { data: [], total: 0 } });
  //favoriteRecipeIds = toSignal(this.favoriteService.favoriteIds$, { initialValue: [] });
  ingredientIds = signal<string[]>([]);

  // Computed view model
  /* vm = computed(() => ({
    categoryId: this.categoryId(),
    cuisinId: this.cuisinId(),
    searchString: this.searchString(),
    recipes: this.recipes(),
    favoriteRecipes: this.favoriteRecipeIds(),
    loading: this.recipeService.loading,
    hasResults: this.recipeService.recipes$.value.data?.length > 0,
  })); */

  // 🔥 Effect a filter változásokra

  constructor() {}

  ngOnInit(): void {
    // Alapadatok
    //this.favoriteService.getAll();
    this.recipeStore.loadAll();
    console.log(this.recipeStore.recipes(), 'StoreBol');
  }
  /* 
  loadMore(inf: InfiniteScroll) {
    this.loadNext();
  } */
  // LoadNext mindig signalsból hívható
  loadNext() {
    /*   this.recipeService.loadNext(
      this.searchString(),
      this.categoryId(),
      this.cuisinId(),
      this.ingredientIds(),
    ); */
  }
  private updateFilters() {
    this.recipeStore.reset();
    this.recipeStore.loadAll(
      this.searchString(),
      this.categoryId(),
      this.cuisineId(),
      this.ingredientIds(),
    );
  }
  // Setterek – ez triggereli az effect-et
  changeCategory(categoryId: string) {
    this.categoryId.set(categoryId);
    this.updateFilters();
  }

  changeCuisin(cuisinId: string) {
    this.cuisineId.set(cuisinId);
    this.updateFilters();
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
    this.updateFilters();
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);
    this.ingredientIds.set(ingredientIds);
    this.updateFilters();
  }
}
