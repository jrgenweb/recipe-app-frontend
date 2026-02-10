import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { IRecipeList } from '@recipe/shared';

import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Rating } from '../../../../components/rating/rating';
import { BtnFavorite } from '../../../../components/btn-favorite/btn-favorite';
import { ShortenPipe } from '../../../../shared/pipes/shorten-pipe';
import { RatingModal } from '../../../../components/rating-modal/rating-modal';
import { FavoriteService } from '../../services/favorite-service';
import { AuthService } from '../../../../shared/services/auth-service';
import { RecipeService } from '../../services/recipe-service';
import { onImageError } from '../../../../shared/functions';
import { RecipeStore } from '../../stores/recipe.store';

@Component({
  selector: 'app-recipe-card-favorite',
  imports: [BtnFavorite, ShortenPipe, RouterLink],
  templateUrl: './recipe-card-favorite.html',
  styleUrl: './recipe-card-favorite.scss',
})
export class RecipeCardFavorite {
  @Input() recipe!: IRecipeList;
  @Input() isFavorite = false;
  @ViewChild('ratingModal') ratingModal!: ElementRef<RatingModal>;

  isSmallScreen = window.innerWidth < 576;
  isShowRatingModal = false;

  public authService = inject(AuthService);

  //private recipeService: RecipeService = inject(RecipeService);
  public recipeStore = inject(RecipeStore);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }

  setFavorite(favorite: { recipeId: string; state: boolean }) {
    this.recipeStore.toggleFavorite(favorite.recipeId);
  }
}
