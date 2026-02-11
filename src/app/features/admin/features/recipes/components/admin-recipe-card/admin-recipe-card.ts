import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AdminRecipeStore } from '../../stores/admin-recipe.store';
import { IRecipeList } from '@recipe/shared';
import { AuthService } from '../../../../../../shared/services/auth-service';
import { onImageError } from '../../../../../../shared/functions';
import { RouterLink } from '@angular/router';
import { ShortenPipe } from '../../../../../../shared/pipes/shorten-pipe';

@Component({
  selector: 'app-admin-recipe-card',
  imports: [RouterLink, ShortenPipe],
  templateUrl: './admin-recipe-card.html',
  styleUrl: './admin-recipe-card.scss',
})
export class AdminRecipeCard {
  @Input() recipe!: IRecipeList;
  @Input() editUrl: string = '';
  @Output() confirmDeleteEvent = new EventEmitter<IRecipeList>();

  isSmallScreen = window.innerWidth < 576;
  isShowRatingModal = false;

  public authService = inject(AuthService);

  public recipeStore = inject(AdminRecipeStore);

  constructor() {}

  onImageError(event: Event) {
    onImageError(event);
  }

  onDelete(recipeId: string) {
    this.confirmDeleteEvent.emit(this.recipe);
  }
}
