import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Mivel az isAuthenticated egy computed signal,
  // itt egyszerűen leolvassuk az értékét.
  if (!authService.getToken()) {
    return true;
  }

  // Ha nincs bejelentkezve, irány a login
  return router.parseUrl('/recipes');
};
