import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from '../../config/config';
import { IRegister, IUser, LoginResponse } from '@recipe/shared';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'access_token';

  public currentUser = signal<IUser | null>(null);
  public isLoggedin$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    if (this.getToken()) {
      this.isLoggedin$.next(true);
      this.loadCurrentUser();
    }
  }

  loadCurrentUser() {
    const token = this.getToken();
    if (!token) return; // nincs token, nem hívjuk

    this.http
      .get<IUser>(API_URL + '/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: (user) => this.currentUser.set(user),
        //error: () => this.logout(), // ha token érvénytelen
      });
  }

  // Bejelentkezés
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL + '/auth/login', { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.isLoggedin$.next(true);
        this.currentUser.set(res.user);
      }),
    );
  }

  // Regisztráció

  register(user: IRegister) {
    return this.http.post(API_URL + '/auth/register', user);
  }

  // Kijelentkezés
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedin$.next(false);
    this.currentUser.set(null); // törli a felhasználót
    this.router.navigate(['/']);
  }

  // Lekéri az access token-t
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Ellenőrzi, hogy be van-e jelentkezve
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
