import { Component, Input } from '@angular/core';
import { IRecipeList } from '@recipe/shared';
import { AuthService } from '../../shared/services/auth-service';
import { Rating } from '../rating/rating';
import { BtnFavorite } from '../btn-favorite/btn-favorite';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../shared/services/favorite-service';
import { RecipeService } from '../../shared/services/recipe-service';
import { ShortenPipe } from '../../shared/pipes/shorten-pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recipe-card',
  imports: [Rating, BtnFavorite, RouterLink, ShortenPipe, AsyncPipe],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss',
})
export class RecipeCard {
  @Input() recipe!: IRecipeList;
  @Input() isFavorite = false;

  constructor(
    public authService: AuthService,
    private favoriteService: FavoriteService,
    private recipeService: RecipeService,
  ) {}

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400';
  }
  setRate(rate: { recipeId: string; rate: number }) {
    this.recipeService.rateRecipe(rate.recipeId, rate.rate);
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
