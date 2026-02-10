import { Component, inject, OnInit } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { RecipeCard } from '../../../features/recipes/components/recipe-card/recipe-card';
import { RecipeCardFavorite } from '../../../features/recipes/components/recipe-card-favorite/recipe-card-favorite';
import { FavoriteService } from '../../../features/recipes/services/favorite-service';

@Component({
  selector: 'app-favorites',
  imports: [AsyncPipe, RecipeCardFavorite, RecipeCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public favoriteService: FavoriteService = inject(FavoriteService);
  constructor() {}
  ngOnInit(): void {
    this.favoriteService.getAll();
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    if (favorite.state) {
      this.favoriteService.set(favorite.recipeId);
    } else {
      this.favoriteService.delete(favorite.recipeId);
    }
  }
}
