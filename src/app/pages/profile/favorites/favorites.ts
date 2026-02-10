import { Component, inject, OnInit } from '@angular/core';
import { RecipeCard } from '../../../features/recipes/components/recipe-card/recipe-card';
import { RecipeStore } from '../../../features/recipes/stores/recipe.store';
import { RecipeCardFavorite } from '../../../features/recipes/components/recipe-card-favorite/recipe-card-favorite';

@Component({
  selector: 'app-favorites',
  imports: [RecipeCard, RecipeCardFavorite],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public recipeStore: RecipeStore = inject(RecipeStore);
  constructor() {}
  ngOnInit(): void {
    this.recipeStore.loadAll();
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    this.recipeStore.toggleFavorite(favorite.recipeId);
  }
}
