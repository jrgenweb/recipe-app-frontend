import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/config';
import { IRecipeFavorite, IRecipeFavoriteResponse } from '@recipe/shared';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  favorites$ = new BehaviorSubject<IRecipeFavoriteResponse>({ data: [], total: 0 });
  favoriteIds$ = new BehaviorSubject<string[]>([]);

  getAll() {
    if (this.authService.isLoggedIn()) {
      this.http.get<IRecipeFavoriteResponse>(API_URL + '/favorites').subscribe((resp) => {
        resp.data.map;
        this.favorites$.next(resp);
        this.favoriteIds$.next(resp.data.map((f) => f.recipeId));
      });
    }
  }
  set(recipeId: string) {
    this.http.post<IRecipeFavorite>(API_URL + '/favorites/' + recipeId, {}).subscribe({
      next: (resp) => {
        const updatedFavoriteIds = [...this.favoriteIds$.value, recipeId];
        this.favoriteIds$.next(updatedFavoriteIds);

        const updatedFavorites = [...this.favorites$.value.data, resp];
        const updatedTotal = this.favorites$.value.total + 1;
        this.favorites$.next({ data: updatedFavorites, total: updatedTotal });
      },
      error: (err) => {},
    });
  }
  delete(recipeId: string) {
    this.http.delete<{ deleted: boolean }>(API_URL + '/favorites/' + recipeId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          const updatedFavoriteIds = this.favoriteIds$.value.filter((f) => f !== recipeId);
          this.favoriteIds$.next(updatedFavoriteIds);
          const updatedFavorites = this.favorites$.value.data.filter(
            (f) => f.recipeId !== recipeId,
          );
          const updatedTotal = this.favorites$.value.total - 1;
          this.favorites$.next({ data: updatedFavorites, total: updatedTotal });
        }
      },
      error: (err) => {},
    });
  }
  check(recipeId: string) {
    return this.http.get(API_URL + '/favorites/check/' + recipeId);
  }
}
