import { Component, inject, signal, OnInit } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { IRecipeIngredient, IRecipeList } from '@recipe/shared';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';

import { AdminRecipeStore } from '../../../../features/admin/features/recipes/stores/admin-recipe.store';
import { AdminRecipeFilter } from '../../../../features/admin/features/recipes/components/admin-recipe-filter/admin-recipe-filter';
import { AdminRecipeCard } from '../../../../features/admin/features/recipes/components/admin-recipe-card/admin-recipe-card';
import { Spinner } from '../../../../components/spinner/spinner';

@Component({
  selector: 'app-recipes',
  imports: [RouterLink, InfiniteScroll, ConfirmModal, AdminRecipeFilter, AdminRecipeCard, Spinner],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  // Stores
  public recipeStore = inject(AdminRecipeStore);

  // Delete modal
  isShowDeleteConfirm = signal(false);
  selectedRecipe = signal<IRecipeList | null>(null);

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

  showDeleteConfirm(recipe: IRecipeList) {
    this.selectedRecipe.set(recipe);
    if (this.selectedRecipe()) {
      this.isShowDeleteConfirm.set(true);
    }
  }
  onConfirmDelete(confirm: boolean) {
    if (confirm && this.selectedRecipe()) {
      this.recipeStore.removeRecipe(this.selectedRecipe()!.id);
    }
    this.isShowDeleteConfirm.set(false);
  }
}
