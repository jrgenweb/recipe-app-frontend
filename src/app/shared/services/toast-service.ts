import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface IToast {
  id: string;
  message: string;
  type: 'primary' | 'success' | 'danger' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts$ = new BehaviorSubject<IToast[]>([]);
  add(toast: Omit<IToast, 'id'>, duration = 3000) {
    const newToast: IToast = {
      ...toast,
      id: crypto.randomUUID(),
    };

    this.toasts$.next([...this.toasts$.value, newToast]);

    setTimeout(() => {
      this.remove(newToast.id);
    }, duration);
  }

  remove(id: string) {
    this.toasts$.next(this.toasts$.value.filter((t) => t.id !== id));
  }
}
