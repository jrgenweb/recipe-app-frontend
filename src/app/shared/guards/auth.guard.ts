import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Signalt Observablé-vá alakítjuk, hogy várni tudjunk rá
  return toObservable(authService.isInitialized).pipe(
    filter((initialized) => initialized === true), // Megvárjuk, amíg az Auth folyamat lefut
    take(1), // Csak az első ilyen érték kell
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }

      // Ha nem hitelesített, irány a signin
      return router.parseUrl('/signin');
    }),
  );
};
