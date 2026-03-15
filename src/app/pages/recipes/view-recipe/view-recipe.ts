import { Component, inject, OnInit, signal } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';
import { DatePipe } from '@angular/common';

import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';

import { ProfilePicture } from '../../../components/profile-picture/profile-picture';
import { Rating } from '../../../components/rating/rating';
import { toSignal } from '@angular/core/rxjs-interop';

import { IRecipeCommentResponse } from '@recipe/shared';
import { RecipeGallery } from '../../../features/recipes/components/recipe-gallery/recipe-gallery';
import { AddComment } from '../../../features/recipes/components/add-comment/add-comment';

import { RecipeStore } from '../../../features/recipes/stores/recipe.store';
import { CommentStore } from '../../../features/comments/store/comment.store';
import { Spinner } from '../../../components/spinner/spinner';

@Component({
  selector: 'app-view-recipe',
  imports: [
    RouterLink,
    TimeAgoPipe,
    RecipeGallery,
    ProfilePicture,
    DatePipe,
    Rating,
    AddComment,
    Spinner,
  ],
  templateUrl: './view-recipe.html',
  styleUrl: './view-recipe.scss',
})
export class ViewRecipe implements OnInit {
  private route = inject(ActivatedRoute);

  public recipeStore = inject(RecipeStore);
  public commentStore = inject(CommentStore);

  // Signal a route param-ra
  private recipeId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id') || '')));

  // Signal a receptre a service-ből
  // létrehozol egy üres signal-t
  //  recipe = signal<IRecipeDetail | undefined>(undefined);
  comments = signal<IRecipeCommentResponse[]>([]);

  ngOnInit() {
    this.recipeStore.loadDetail(this.recipeId() || ''); // IDEIGLENESEN
    this.commentStore.loadAll(this.recipeId() || ''); // IDEIGLENESEN
  }

  loadRating() {}

  constructor() {}

  // Új komment esetén frissítés
  onComment(_state: boolean) {}

  onChangeRate(rate: { recipeId: string; rate: number }) {
    this.recipeStore.updateRating(rate.recipeId, rate.rate);
  }
}
