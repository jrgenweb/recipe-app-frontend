import { Component, inject, OnInit, signal } from '@angular/core';

import { IRecipeIngredient } from '@recipe/shared';

import { InfiniteScroll } from '../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeCard } from '../../features/recipes/components/recipe-card/recipe-card';
import { SelectIngredient } from '../../features/recipes/components/select-ingredient/select-ingredient';
import { RecipeStore } from '../../features/recipes/stores/recipe.store';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RecipeCard, InfiniteScroll, SelectIngredient],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  public recipeStore = inject(RecipeStore);

  ingredientIds = signal<string[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.recipeStore.loadAll();
  }

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
}
