import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';
import { IRecipeList, IRecipeListResponse } from '@recipe/shared';
import { AsyncPipe } from '@angular/common';
import { RecipeService } from '../../../shared/services/recipe-service';
import { FavoriteService } from '../../../shared/services/favorite-service';
import { AuthService } from '../../../shared/services/auth-service';
import { RecipeFilter } from '../../../components/recipe-filter/recipe-filter';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';
import { RecipeCard } from '../../../components/recipe-card/recipe-card';
import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';

@Component({
  selector: 'app-recipes',
  imports: [RouterLink, AsyncPipe, RecipeFilter, ConfirmModal, RecipeCard, InfiniteScroll],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  ownRecipes$!: Observable<IRecipeListResponse>;
  favoriteRecipeIds: string[] = [];
  searchString = '';
  categoryId = '';

  //services

  public recipeService = inject(RecipeService);
  public favoriteService = inject(FavoriteService);
  public authService = inject(AuthService);
  //pagination
  currentPage = 1;
  take = 1;
  skip = 0;

  isShowDeleteConfirm = false;
  selectedRecipe: IRecipeList | null = null;

  constructor() {}
  ngOnInit(): void {
    this.recipeService.reset();
    this.loadNext();
    this.favoriteService.getAll();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400';
  }
  setRate(rate: { recipeId: string; rate: number }) {
    this.recipeService.rateRecipe(rate.recipeId, rate.rate);
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    if (favorite.state) {
      this.favoriteService.set(favorite.recipeId);
    } else {
      this.favoriteService.delete(favorite.recipeId);
    }
  }

  loadMore(inf: InfiniteScroll) {
    this.loadNext();
  }
  loadNext() {
    this.recipeService.loadNext(this.searchString, this.categoryId, '', [], true);
  }
  changeCategory(categoryId: string) {
    this.categoryId = categoryId;
    this.recipeService.reset();
    this.loadNext();
  }
  changeSearchString(searchString: string) {
    this.searchString = searchString;
    this.recipeService.reset();
    this.loadNext();
  }

  onPageChange(event: { skip: number; take: number; page: number }) {
    this.currentPage = event.page;
    this.skip = event.skip;
    this.take = event.take;
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
    this.recipeService.delete(recipeId);
  }
}
