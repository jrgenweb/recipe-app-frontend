import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { map, catchError, of, timer, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class AsyncEmailValidator {
  private authService = inject(AuthService);

  validate(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      // A timer(500) vár fél másodpercet a gépelés után, mielőtt hívná az API-t
      return timer(500).pipe(
        switchMap(() => this.authService.checkEmail(control.value)),
        map((res: any) => (res.available ? null : { emailTaken: true })),
        catchError(() => of(null)),
        take(1), // Fontos, hogy lezárjuk a streamet
      );
    };
  }
}
