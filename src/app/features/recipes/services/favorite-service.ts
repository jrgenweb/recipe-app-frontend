import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { IRecipeFavorite, IRecipeFavoriteResponse } from '@recipe/shared';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../shared/services/auth-service';
import { API_URL } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  favorites$ = new BehaviorSubject<IRecipeFavoriteResponse>({ data: [], total: 0 });
  favoriteIds$ = new BehaviorSubject<string[]>([]);

  getAll() {
    return this.http.get<IRecipeFavoriteResponse>(API_URL + '/favorites');
  }

  set(recipeId: string) {
    return this.http.post<IRecipeFavorite>(API_URL + '/favorites/' + recipeId, {});
  }
  delete(recipeId: string) {
    return this.http.delete<{ deleted: boolean }>(API_URL + '/favorites/' + recipeId);
  }
  check(recipeId: string) {
    return this.http.get(API_URL + '/favorites/check/' + recipeId);
  }
}
