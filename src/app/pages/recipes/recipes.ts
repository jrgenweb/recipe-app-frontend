import { Component, inject, OnInit, signal } from '@angular/core';

import { IRecipeIngredient } from '@recipe/shared';

import { InfiniteScroll } from '../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeCard } from '../../features/recipes/components/recipe-card/recipe-card';
import { SelectIngredient } from '../../features/recipes/components/select-ingredient/select-ingredient';
import { RecipeStore } from '../../features/recipes/stores/recipe.store';
import { Spinner } from '../../components/spinner/spinner';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RecipeCard, InfiniteScroll, SelectIngredient, Spinner],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  public recipeStore = inject(RecipeStore);

  ingredientIds = signal<string[]>([]);

  filterChanged = signal(false);
  recipeLoading = toObservable(this.recipeStore.isLoading);

  constructor() {
    this.recipeLoading.subscribe((loading) => {
      if (!loading) {
        this.filterChanged.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.recipeStore.loadNext();
  }

  loadMore(inf: InfiniteScroll) {
    this.recipeStore.loadNext();
    inf.done();
  }

  changeCategory(categoryId: string) {
    this.filterChanged.set(true);
    this.recipeStore.updateFilters({ categoryId });
  }

  changeCuisin(cuisineId: string) {
    this.filterChanged.set(true);
    this.recipeStore.updateFilters({ cuisineId });
  }

  changeSearchString(search: string) {
    this.filterChanged.set(true);
    this.recipeStore.updateFilters({ search });
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);
    this.filterChanged.set(true);
    this.recipeStore.updateFilters({ ingredientIds });
  }
}
