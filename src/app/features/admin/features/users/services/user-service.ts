import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAdminCreateUser, IUser, IUserList } from '@recipe/shared';
import { BehaviorSubject, tap } from 'rxjs';
import { ToastService } from '../../../../../shared/services/toast-service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  users$ = new BehaviorSubject<IUserList[]>([]);

  isLoading = false;
  total?: number;
  pageSize = 20;

  private http: HttpClient = inject(HttpClient);
  private toastService: ToastService = inject(ToastService);

  constructor() {}

  getAll(name?: string, email?: string) {
    let params = new HttpParams();
    if (name) params = params.set('name', String(name));
    if (email) params = params.set('email', String(email));
    return this.http.get<{ data: IUserList[]; total: number }>(
      environment.apiUrl + '/users/admin',
      {
        params,
      },
    );
  }

  fetchUsers(name?: string, email?: string, skip = 0, take = 20) {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (name) params = params.set('name', String(name));
    if (email) params = params.set('email', String(email));
    return this.http.get<{ data: IUserList[]; total: number }>(
      environment.apiUrl + '/users/admin',
      {
        params,
      },
    );
  }

  reset() {
    this.users$.next([]);
    this.total = undefined;
    this.isLoading = false;
  }

  getById(userId: string) {
    return this.http.get<IUser>(environment.apiUrl + '/users/' + userId);
  }

  create(user: IAdminCreateUser) {
    return this.http.post<IUserList>(environment.apiUrl + '/users/admin', user);
  }

  update(userId: string, user: Partial<IAdminCreateUser>) {
    return this.http.patch<IUserList>(environment.apiUrl + '/users/admin' + userId, user);
  }

  delete(userId: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/users/admin/' + userId);
  }
}
