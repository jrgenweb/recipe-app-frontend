import { Component, inject, Input } from '@angular/core';

import { IRecipeList } from '@recipe/shared';

import { RouterLink } from '@angular/router';
import { BtnFavorite } from '../../../../components/btn-favorite/btn-favorite';
import { ShortenPipe } from '../../../../shared/pipes/shorten-pipe';
import { FavoriteService } from '../../services/favorite-service';
import { onImageError } from '../../../../shared/functions';

@Component({
  selector: 'app-recipe-card-favorite',
  imports: [BtnFavorite, ShortenPipe, RouterLink],
  templateUrl: './recipe-card-favorite.html',
  styleUrl: './recipe-card-favorite.scss',
})
export class RecipeCardFavorite {
  @Input() recipe!: IRecipeList;
  @Input() isFavorite = false;

  private favoriteService: FavoriteService = inject(FavoriteService);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }

  setFavorite(favorite: { recipeId: string; state: boolean }) {
    //const oldFavorites = this.favoriteService.favoriteIds$.value;
    if (favorite.state) {
      this.favoriteService.set(favorite.recipeId);
    } else {
      this.favoriteService.delete(favorite.recipeId);
    }
  }
}
