import { inject, Injectable } from '@angular/core';
import { IRecipeCommentResponse } from '@recipe/shared';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);

  getAll(recipeId: string) {
    return this.http.get<{ data: IRecipeCommentResponse[] }>(
      environment.apiUrl + '/recipes/' + recipeId + '/comments',
    );
  }

  /**
   * later fetch logic
   *
   */
  fetchCategories(recipeId: string, skip = 0, take = 20) {
    return this.http.get<{ data: IRecipeCommentResponse[] }>(
      environment.apiUrl + '/recipes/' + recipeId + '/comments',
    );
  }

  /* Comments */
  create(recipeId: string, text: string) {
    return this.http.post<IRecipeCommentResponse>(
      environment.apiUrl + '/recipes/' + recipeId + '/comments',
      {
        text,
      },
    );
  }
}
