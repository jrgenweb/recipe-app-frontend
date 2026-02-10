import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
  selector: 'app-my-recipe-card',
  imports: [Rating, BtnFavorite, RouterLink, ShortenPipe, AsyncPipe, RatingModal],
  templateUrl: './my-recipe-card.html',
  styleUrl: './my-recipe-card.scss',
})
export class MyRecipeCard {
  @Input() recipe!: IRecipeList;
  @Output() confirmDeleteEvent = new EventEmitter<string>();

  isSmallScreen = window.innerWidth < 576;
  isShowRatingModal = false;

  public authService = inject(AuthService);

  public recipeStore = inject(RecipeStore);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }

  onDelete(recipeId: string) {
    this.confirmDeleteEvent.emit(recipeId);
  }
}
