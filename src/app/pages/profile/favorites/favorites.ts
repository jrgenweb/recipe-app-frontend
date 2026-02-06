import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../../shared/services/favorite-service';
import { AsyncPipe } from '@angular/common';

import { RecipeCard } from '../../../components/recipe-card/recipe-card';

@Component({
  selector: 'app-favorites',
  imports: [AsyncPipe, RecipeCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  constructor(public favoriteService: FavoriteService) {}
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
