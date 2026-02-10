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

  //private recipeService: RecipeService = inject(RecipeService);
  public recipeStore = inject(RecipeStore);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }
  setRate(rate: { recipeId: string; rate: number }) {
    //this.recipeService.updateRating(rate.recipeId, rate.rate);
    this.recipeStore.updateRating(rate.recipeId, rate.rate);
    this.isShowRatingModal = false;
  }
  setFavorite(favorite: { recipeId: string; state: boolean }) {
    this.recipeStore.toggleFavorite(favorite.recipeId);
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
