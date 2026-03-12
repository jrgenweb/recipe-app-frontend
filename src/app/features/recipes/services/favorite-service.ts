import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { IRecipeFavorite, IRecipeFavoriteResponse } from '@recipe/shared';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../shared/services/auth-service';

import { environment } from '../../../../environments/environment';

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
    return this.http.get<IRecipeFavoriteResponse>(environment.apiUrl + '/favorites');
  }

  set(recipeId: string) {
    return this.http.post<IRecipeFavorite>(environment.apiUrl + '/favorites/' + recipeId, {});
  }
  delete(recipeId: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/favorites/' + recipeId);
  }
  check(recipeId: string) {
    return this.http.get(environment.apiUrl + '/favorites/check/' + recipeId);
  }
}
