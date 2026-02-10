import { inject, Injectable } from '@angular/core';
import { IRecipeCommentResponse } from '@recipe/shared';
import { API_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);

  getAll(recipeId: string) {
    return this.http.get<{ data: IRecipeCommentResponse[] }>(
      API_URL + '/recipes/' + recipeId + '/comments',
    );
  }

  /**
   * later fetch logic
   *
   */
  fetchCategories(recipeId: string, skip = 0, take = 20) {
    return this.http.get<{ data: IRecipeCommentResponse[] }>(
      API_URL + '/recipes/' + recipeId + '/comments',
    );
  }

  /* Comments */
  create(recipeId: string, text: string) {
    return this.http.post<IRecipeCommentResponse>(API_URL + '/recipes/' + recipeId + '/comments', {
      text,
    });
  }
}
