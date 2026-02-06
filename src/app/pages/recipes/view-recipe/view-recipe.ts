import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../shared/services/recipe-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AddComment } from '../add-comment/add-comment';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';
import { RecipeGallery } from '../../../components/recipe-gallery/recipe-gallery';

@Component({
  selector: 'app-view-recipe',
  imports: [RouterLink, AsyncPipe, AddComment, TimeAgoPipe, RecipeGallery],
  templateUrl: './view-recipe.html',
  styleUrl: './view-recipe.scss',
})
export class ViewRecipe implements OnInit {
  recipe$!: Observable<any>;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.getRecipe();
  }

  getRecipe() {
    this.recipe$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => {
        if (!id) return EMPTY;
        return this.recipeService.getRecipeWithComments(id).pipe(
          catchError((err) => {
            this.router.navigate(['/error']);
            return EMPTY;
          }),
        );
      }),
    );
  }
  onComment(state: boolean) {
    this.getRecipe();
  }
}
