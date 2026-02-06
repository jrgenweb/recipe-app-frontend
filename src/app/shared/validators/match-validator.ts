import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MatchValidator {
  /**
   * Validátor két mező egyezésére (pl. jelszó + jelszó megerősítés)
   * @param controlName1 az első mező neve
   * @param controlName2 a második mező neve
   */
  public static validate(controlName1: string, controlName2: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control1 = formGroup.get(controlName1);
      const control2 = formGroup.get(controlName2);

      if (!control1 || !control2) return null; // ha nincs, ne dobjon hibát

      if (control1.value !== control2.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
}
