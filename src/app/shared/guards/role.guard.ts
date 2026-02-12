import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Role } from '@recipe/shared';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take, timeout } from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data?.['role'];

  // 1. Ha nincs is token, azonnal tudjuk, hogy esélytelen
  if (!auth.getToken()) {
    //const redirectUrl = expectedRole === Role.ADMIN ? '/dashboard/signin' : '/signin';
    return router.parseUrl('/signin');
  }

  // 2. Ha van token, megvárjuk, amíg a currentUser betöltődik (ha még null)
  // A toObservable segít a signalt stream-mé alakítani
  return toObservable(auth.isInitialized).pipe(
    // Megvárjuk az első olyan értéket, ami nem null (vagy hiba esetén leállunk)
    filter((init) => init),
    take(1),
    map(() => {
      const user = auth.currentUser();
      if (!user) {
        return router.parseUrl('/signin');
      }
      if (expectedRole && user?.role !== expectedRole) {
        return router.parseUrl('/recipes');
      }
      return true;
    }),
  );
};
