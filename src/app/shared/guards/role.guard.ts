import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Role } from '@recipe/shared';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data?.['role']; // 'ADMIN' | 'USER'
  const user = auth.currentUser();

  //  nincs bejelentkezve

  if (!user) {
    if (expectedRole === Role.ADMIN) {
      router.navigate(['/dashboard/signin']);
    } else {
      router.navigate(['/signin']);
    }
    return false;
  }

  //  rossz role
  if (expectedRole && user.role !== expectedRole) {
    router.navigate(['/recipes']);
    return false;
  }

  return true;
};
