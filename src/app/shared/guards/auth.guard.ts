import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedin$.pipe(
      take(1), // csak egyszer nézzük meg
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']); // átirányítás login oldalra
          return false;
        }
        return true;
      }),
    );
  }
}
