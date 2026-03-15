import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

import { IRecipeIngredient } from '@recipe/shared';

import { InfiniteScroll } from '../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeCard } from '../../features/recipes/components/recipe-card/recipe-card';
import { SelectIngredient } from '../../features/recipes/components/select-ingredient/select-ingredient';
import { RecipeStore } from '../../features/recipes/stores/recipe.store';
import { Spinner } from '../../components/spinner/spinner';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RecipeCard, InfiniteScroll, SelectIngredient, Spinner],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit, OnDestroy {
  @ViewChild(InfiniteScroll) inf!: InfiniteScroll;
  public recipeStore = inject(RecipeStore);
  ingredientIds = signal<string[]>([]);

  loadingSubscription$ = toObservable(this.recipeStore.isLoading).subscribe((loading) => {
    const allLoaded = this.recipeStore.recipes().length >= this.recipeStore.total();
    if (!loading && !allLoaded && this.inf && !this.inf.loading) {
      requestAnimationFrame(() => this.inf.checkAnchor());
    }
  });

  constructor() {}

  ngOnInit(): void {}

  loadMore(inf: InfiniteScroll) {
    this.recipeStore.loadNext();
    inf.done();
  }

  changeCategory(categoryId: string) {
    this.recipeStore.updateFilters({ categoryId });
  }

  changeCuisin(cuisineId: string) {
    this.recipeStore.updateFilters({ cuisineId });
  }

  changeSearchString(search: string) {
    this.recipeStore.updateFilters({ search });
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);

    this.recipeStore.updateFilters({ ingredientIds });
  }
  ngOnDestroy(): void {
    this.loadingSubscription$.unsubscribe();
  }
}
