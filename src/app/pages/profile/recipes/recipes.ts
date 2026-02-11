import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';
import { IRecipeList, IRecipeListResponse } from '@recipe/shared';

import { AuthService } from '../../../shared/services/auth-service';

import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';

import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';
import { RecipeFilter } from '../../../features/recipes/components/recipe-filter/recipe-filter';
import { RecipeCard } from '../../../features/recipes/components/recipe-card/recipe-card';

import { RecipeStore } from '../../../features/recipes/stores/recipe.store';
import { MyRecipeCard } from '../../../features/recipes/components/my-recipe-card/my-recipe-card';

@Component({
  selector: 'app-recipes',
  imports: [RouterLink, RecipeFilter, ConfirmModal, InfiniteScroll, MyRecipeCard],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  public authService = inject(AuthService);
  public recipeStore = inject(RecipeStore);

  isShowDeleteConfirm = false;
  selectedRecipe: IRecipeList | null = null;

  constructor() {}
  ngOnInit(): void {
    //this.recipeService.reset();
    this.recipeStore.getOwnRecipes();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400';
  }
  setRate(rate: { recipeId: string; rate: number }) {
    this.recipeStore.updateRating(rate.recipeId, rate.rate);
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    this.recipeStore.toggleFavorite(favorite.recipeId);
  }

  loadMore(inf: InfiniteScroll) {
    this.loadNext();
  }
  loadNext() {
    //this.recipeService.loadNext(this.searchString, this.categoryId, '', [], true);
  }
  changeCategory(categoryId: string) {
    this.recipeStore.updateMyFilter({ categoryId });
  }
  changeSearchString(search: string) {
    this.recipeStore.updateMyFilter({ search });
  }

  changeCuisine(cuisineId: string) {
    this.recipeStore.updateMyFilter({ cuisineId });
  }
  showDeleteConfirm(recipe: IRecipeList) {
    this.selectedRecipe = recipe;
    if (this.selectedRecipe) {
      this.isShowDeleteConfirm = true;
    }
  }

  onConfirmDelete(confirm: boolean) {
    if (confirm) {
      this.deleteRecipe(this.selectedRecipe!.id);
    }

    this.isShowDeleteConfirm = false;
  }

  deleteRecipe(recipeId: string) {
    this.recipeStore.removeRecipe(recipeId);
  }
}
