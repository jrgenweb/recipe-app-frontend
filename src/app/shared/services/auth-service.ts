import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { API_URL } from '../../config/config';
import { ICreateUser, IRegister, IUser, LoginResponse } from '@recipe/shared';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';

interface ChangePasswordSuccess {
  updated: boolean;
  message: string;
}

interface ChangePasswordError {
  error: string;
}

type ChangePasswordResponse = ChangePasswordSuccess | ChangePasswordError;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'access_token';

  public currentUser = signal<IUser | null>(null);
  public isInitialized = signal<boolean>(false); // Ez lesz a kulcs!
  //public isLoggedin$ = new BehaviorSubject<boolean>(false);

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private toastService = inject(ToastService);

  public isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }
  loadCurrentUser() {
    const token = this.getToken();
    if (!token) {
      this.isInitialized.set(true); // Nincs token, inicializálva vagyunk (üresen)
      return;
    }

    this.http.get<IUser>(API_URL + '/auth/me').subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isInitialized.set(true);
      },
      error: () => {
        this.logout(); // Törli a tokent
        this.isInitialized.set(true); // Hiba esetén is végeztünk az inicializálással
      },
    });
  }
  private redirectAfterLogin() {
    const role = this.currentUser()?.role;
    const target = role === 'ADMIN' ? '/dashboard' : '/recipes';
    this.router.navigate([target]);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.currentUser.set(res.user);
        this.redirectAfterLogin();
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
    //this.isLoggedin$.next(false);
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

  changePassword(oldPassword: string, newPassword: string): Observable<ChangePasswordResponse> {
    const token = this.getToken();
    if (!token) return of({ message: 'Nincs érvényes token', updated: false }); // nincs token, nem hívjuk

    return this.http
      .patch<ChangePasswordResponse>(API_URL + '/users/change-password/' + this.currentUser()?.id, {
        oldPassword,
        newPassword,
      })
      .pipe(
        tap({
          next: (res) => {
            if ('error' in res && res.error) {
              // hibakezelés toast
              this.toastService.add({ message: res.error, type: 'danger' });
              return; // ne logout
            }

            // sikeres változtatás
            this.toastService.add({ message: 'Jelszó sikeresen megváltoztatva!', type: 'success' });
            this.logout(); // jelszóváltoztatás után kijelentkeztetjük
          },
          error: (err) => {
            this.toastService.add({
              message:
                'Hiba történt a jelszóváltoztatás során: ' + (err.error?.message ?? err.message),
              type: 'danger',
            });
          },
        }),
      );
  }
  updateUser(user: Partial<ICreateUser>) {
    const token = this.getToken();
    if (!token) return;

    this.http
      .patch<{ message: string }>(API_URL + '/users/' + this.currentUser()?.id, user)
      .subscribe({
        next: () => {
          this.loadCurrentUser(); // Frissíti a felhasználót a szerverről
        },
      });
  }
  deleteUser(password: string) {
    const token = this.getToken();
    if (!token) return;

    this.http
      .delete<{ deleted: boolean }>(API_URL + '/users/' + this.currentUser()?.id, {
        body: { password },
      })
      .subscribe({
        next: (resp) => {
          if (resp.deleted) this.logout(); // Kijelentkezés a profil törlése után
          this.toastService.add({ message: 'Sikeresen törölted a profilod', type: 'success' });
          this.router.navigate(['/']);
        },
      });
  }
}
