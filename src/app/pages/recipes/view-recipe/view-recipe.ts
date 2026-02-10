import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, EMPTY, map } from 'rxjs';
import { DatePipe } from '@angular/common';

import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';

import { ProfilePicture } from '../../../components/profile-picture/profile-picture';
import { Rating } from '../../../components/rating/rating';
import { toSignal } from '@angular/core/rxjs-interop';
import { IRecipeDetail } from '@recipe/shared';
import { IRecipeCommentResponse } from '@recipe/shared';
import { RecipeGallery } from '../../../features/recipes/components/recipe-gallery/recipe-gallery';
import { AddComment } from '../../../features/recipes/components/add-comment/add-comment';
import { RecipeService } from '../../../features/recipes/services/recipe-service';

@Component({
  selector: 'app-view-recipe',
  imports: [RouterLink, TimeAgoPipe, RecipeGallery, ProfilePicture, DatePipe, Rating, AddComment],
  templateUrl: './view-recipe.html',
  styleUrl: './view-recipe.scss',
})
export class ViewRecipe implements OnInit {
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signal a route param-ra
  private recipeId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id') || '')));

  // Signal a receptre a service-ből
  // létrehozol egy üres signal-t
  recipe = signal<IRecipeDetail | undefined>(undefined);
  comments = signal<IRecipeCommentResponse[]>([]);

  avgRating = signal(this.recipe()?.avgRating || 0); // kezdeti érték a recept értékelése, vagy 0, ha nincs

  ngOnInit() {
    this.loadRecipe();
  }

  loadRecipe() {
    this.recipeService
      .getRecipeWithComments(this.recipeId() || '')
      .pipe(
        catchError(() => {
          this.router.navigate(['/error']);
          return EMPTY;
        }),
        //tap((res) => {}),
      )
      .subscribe((res) => {
        this.recipe.set(res.recipe);
        this.comments.set(res.comments);
        this.avgRating.set(res.recipe.avgRating);
      });
  }

  //Rating visszatöltése a backendről, pl. új értékelés után
  loadRating() {}

  // Computed view model
  vm = computed(() => {
    const recipe = this.recipe();

    return {
      recipe: this.recipe(),
      hasRecipe: !!recipe,
      comments: this.comments() ?? [],
    };
  });

  constructor() {}

  // Új komment esetén frissítés
  onComment(_state: boolean) {
    // újra lekéri a receptet
    this.loadRecipe();
    //this.loadComments(); majd később
  }

  onChangeRate(rate: { recipeId: string; rate: number }) {
    this.recipeService.updateRating(rate.recipeId, rate.rate);
    this.avgRating.set(rate.rate); // frissíti a jelzett értékelést

    this.loadRecipe();
  }
}
