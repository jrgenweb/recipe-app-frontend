import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { IRecipeList } from '@recipe/shared';
import { AuthService } from '../../shared/services/auth-service';
import { Rating } from '../rating/rating';
import { BtnFavorite } from '../btn-favorite/btn-favorite';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../shared/services/favorite-service';
import { RecipeService } from '../../shared/services/recipe-service';
import { ShortenPipe } from '../../shared/pipes/shorten-pipe';
import { AsyncPipe } from '@angular/common';
import { onImageError } from '../../shared/functions';
import { RatingModal } from '../rating-modal/rating-modal';

@Component({
  selector: 'app-recipe-card',
  imports: [Rating, BtnFavorite, RouterLink, ShortenPipe, AsyncPipe, RatingModal],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss',
})
export class RecipeCard {
  @Input() recipe!: IRecipeList;
  @Input() isFavorite = false;
  @ViewChild('ratingModal') ratingModal!: ElementRef<RatingModal>;

  isSmallScreen = window.innerWidth < 576;
  isShowRatingModal = false;

  public authService = inject(AuthService);
  private favoriteService: FavoriteService = inject(FavoriteService);
  private recipeService: RecipeService = inject(RecipeService);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }
  setRate(rate: { recipeId: string; rate: number }) {
    this.recipeService.rateRecipe(rate.recipeId, rate.rate);
    this.isShowRatingModal = false;
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    //const oldFavorites = this.favoriteService.favoriteIds$.value;
    if (favorite.state) {
      this.favoriteService.set(favorite.recipeId);
    } else {
      this.favoriteService.delete(favorite.recipeId);
    }
  }
  openRatingModal() {
    this.isShowRatingModal = true;
    /* 
   TODO:
    megkellene oldani, hogy dinamikusian jelenitsuk meg, majd varjunk egy esemenyre mellyel végrehajtuk a setRate-t
   this.ratingModal.nativeElement.isModalOpen = true;
    asObs
    RatingModal.prototype.isModalOpen = true;
    RatingModal.prototype.changeRateEvt.asObservable().subscribe((resp) => {
      console.log(resp);
    }); */
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Handle window resize if needed
    this.isSmallScreen = event.target.innerWidth < 576;
  }
}
