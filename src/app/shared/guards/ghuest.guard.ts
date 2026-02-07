import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  constructor() {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedin$.pipe(
      take(1), // csak egyszer ellenőrizzük
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/recipes']); // vagy dashboard
          return false;
        }
        return true; // vendégeknek engedélyezve
      }),
    );
  }
}
