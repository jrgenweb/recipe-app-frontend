import { Component, HostListener, OnInit } from '@angular/core';
import { RecipeFilter } from '../../components/recipe/recipe-filter/recipe-filter';
import { RecipeService } from '../../shared/services/recipe-service';

import { AsyncPipe } from '@angular/common';

import { FavoriteService } from '../../shared/services/favorite-service';
import { AuthService } from '../../shared/services/auth-service';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { InfiniteScrollComponent } from '../../components/infinite-scroll-component/infinite-scroll-component';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, AsyncPipe, RecipeCard, InfiniteScrollComponent],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  categoryId: string = '';
  cuisinId: string = '';
  searchString: string = '';

  constructor(
    public recipeService: RecipeService,
    public favoriteService: FavoriteService,
    public authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.recipeService.reset();
    this.loadNext();
    this.favoriteService.getAll();
  }

  loadNext() {
    this.recipeService.loadNext(this.searchString, this.categoryId, this.cuisinId);
  }

  onScroll(scroll: boolean) {
    if (scroll) {
      this.loadNext();
    }
  }

  changeCategory(categoryId: string) {
    this.categoryId = categoryId;
    this.recipeService.reset();
    this.loadNext();
  }
  changeCuisin(cuisinId: string) {
    this.cuisinId = cuisinId;
    this.recipeService.reset();
    this.loadNext();
  }
  changeSearchString(searchString: string) {
    this.searchString = searchString;
    this.recipeService.reset();
    this.loadNext();
  }
}
