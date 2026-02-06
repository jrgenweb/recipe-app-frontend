import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  //- `POST /recipes/:recipeId/ratings` – Értékelés 1–5 (védett, body: rate)
  setRating(recipeId: string, rate: number) {}

  //- `GET /recipes/:recipeId/ratings/stats` – Átlag és darabszám
  getRatingStat(recipeId: string) {
    return this.http.get(API_URL + '/recipes/' + recipeId + '/ratings/stat');
  }
  //- `GET /recipes/:recipeId/ratings/me` – Saját értékelés (védett)
  getRatingMe(recipeId: string) {
    return this.http.get(API_URL + '/recipes/' + recipeId + '/ratings/me');
  }
}
