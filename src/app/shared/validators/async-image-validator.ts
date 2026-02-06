import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export function asyncImageValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const url = control.value;
    if (!url) return of(null);

    return new Observable((observer) => {
      const img = new Image();
      img.onload = () => {
        observer.next(null); // érvényes kép
        observer.complete();
      };
      img.onerror = () => {
        observer.next({ invalidImageUrl: true });
        observer.complete();
      };
      img.src = url;
    });
  };
}
