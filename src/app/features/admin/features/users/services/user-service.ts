import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAdminCreateUser, IUser, IUserList } from '@recipe/shared';
import { BehaviorSubject, tap } from 'rxjs';
import { ToastService } from '../../../../../shared/services/toast-service';
import { API_URL } from '../../../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users$ = new BehaviorSubject<IUserList[]>([]);

  isLoading = false;
  total?: number;
  pageSize = 20;

  private http: HttpClient = inject(HttpClient);
  private toastService: ToastService = inject(ToastService);

  constructor() {}

  loadNext(name?: string, email?: string) {
    if (this.isLoading) return;
    if (this.total && this.users$.value.length >= this.total) return;
    this.isLoading = true;
    const skip = this.users$.value.length;
    const take = this.pageSize;

    let params = new HttpParams().set('skip', skip).set('take', take);
    if (name) params = params.set('name', String(name));
    if (email) params = params.set('email', String(email));
    return this.http
      .get<{ data: IUserList[]; total: number }>(API_URL + '/users/admin', {
        params,
      })
      .subscribe((resp) => {
        this.users$.next([...this.users$.value, ...resp.data]);
        this.total = resp.total;
        this.isLoading = false;
      });
  }

  reset() {
    this.users$.next([]);
    this.total = undefined;
    this.isLoading = false;
  }

  getAll() {
    this.http
      .get<{ data: IUserList[]; total: number }>(API_URL + '/users/admin')
      .subscribe((resp) => {
        this.users$.next(resp.data);
      });
  }
  getById(userId: string) {
    return this.http.get<IUser>(API_URL + '/users/' + userId).pipe(
      tap((user) => {
        if (user && user.id) {
          this.toastService.add({ message: 'MInden történt', type: 'success' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      }),
    );
  }

  create(user: IAdminCreateUser) {
    this.http.post(API_URL + '/users/admin', user).subscribe((_resp) => {});
  }

  update(userId: string, user: Partial<IAdminCreateUser>) {
    return this.http.patch(API_URL + '/users/admin' + userId, user);
  }

  delete(userId: string) {
    this.http.delete<{ deleted: boolean }>(API_URL + '/users/admin/' + userId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          this.toastService.add({ message: 'Sikeresen törölted', type: 'success' }, 3000);
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' }, 3000);
        }
      },
      error: () => {
        this.toastService.add({ message: 'Hiba történt', type: 'danger' }, 3000);
      },
    });
  }
}
