import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { IRecipeIngredient, IRecipeList } from '@recipe/shared';
import { RecipeCard } from '../../../../features/recipes/components/recipe-card/recipe-card';
import { ConfirmModal } from '../../../../components/confirm-modal/confirm-modal';
import { InfiniteScroll } from '../../../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeService } from '../../../../features/recipes/services/recipe-service';
import { FavoriteService } from '../../../../features/recipes/services/favorite-service';
import { AuthService } from '../../../../shared/services/auth-service';
import { AdminRecipeStore } from '../../../../features/admin/features/recipes/stores/admin-recipe.store';
import { AdminRecipeFilter } from '../../../../features/admin/features/recipes/components/admin-recipe-filter/admin-recipe-filter';
import { AdminRecipeCard } from '../../../../features/admin/features/recipes/components/admin-recipe-card/admin-recipe-card';

@Component({
  selector: 'app-recipes',
  imports: [
    RouterLink,
    RouterLinkActive,

    InfiniteScroll,
    ConfirmModal,
    AdminRecipeFilter,
    AdminRecipeCard,
  ],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  // Signals a filter state-re
  categoryId = signal('');
  cuisinId = signal('');
  searchString = signal('');
  ingredientIds = signal<string[]>([]);

  // Stores
  public recipeStore = inject(AdminRecipeStore);

  // Delete modal
  isShowDeleteConfirm = signal(false);
  selectedRecipe = signal<IRecipeList | null>(null);

  // Effect a filter változásokra
  private changeFilter() {
    this.categoryId();
    this.cuisinId();
    this.searchString();
    this.ingredientIds();
    this.recipeStore.reset();
    this.recipeStore.loadAll();
  }

  constructor() {}

  ngOnInit(): void {
    this.changeFilter();
  }

  changeCategory(categoryId: string) {
    this.categoryId.set(categoryId);
    this.changeFilter();
  }

  changeCuisin(cuisinId: string) {
    this.cuisinId.set(cuisinId);
    this.changeFilter();
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
    this.changeFilter();
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);
    this.ingredientIds.set(ingredientIds);
    this.changeFilter();
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
