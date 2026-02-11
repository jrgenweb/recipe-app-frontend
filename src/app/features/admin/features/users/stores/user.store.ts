import { inject, Injectable, signal, computed } from '@angular/core';

import { IAdminCreateUser, IRecipeCategoryResponse, IUser, IUserList } from '@recipe/shared';
import { debounceTime, finalize, single, Subject, tap } from 'rxjs';
import { AdminUserService } from '../services/user-service';
import { ToastService } from '../../../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class AdminUserStore {
  private userService = inject(AdminUserService);
  private toastService = inject(ToastService);

  // --- State ---
  private _users = signal<{ data: IUserList[]; total: number }>({ data: [], total: 0 });
  private _selectedUser = signal<IUser | undefined>(undefined);

  // --- Selectors ---

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  private filters = signal({ name: '', email: '' });

  // --- Selectors (Publikus readonly jelek) ---
  readonly users = computed(() => this._users().data);
  readonly total = computed(() => this._users().total);
  readonly isLoading = computed(() => this._loading());
  readonly selectedUser = computed(() => this._selectedUser());

  private filterChange$ = new Subject<void>();

  constructor() {
    this.filterChange$.pipe(debounceTime(300)).subscribe(() => {
      const { name, email } = this.filters();
      this.loadAll(name, email);
    });
  }

  /** Kezdeti betöltés vagy keresés */
  loadAll(name?: string, email?: string) {
    this._loading.set(true);
    this.userService.getAll(name, email).subscribe({
      next: (resp) => {
        this._users.set(resp);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext() {
    if (this._loading() || (this.total() > 0 && this.users().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.users().length;
    const { name, email } = this.filters();
    this.userService
      .fetchUsers(name, email, skip, 20)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._users.update((state) => ({
          data: [...state.data, ...resp.data],
          total: resp.total,
        }));
      });
  }

  getById(userId: string) {
    this._loading.set(true);
    this._selectedUser.set(undefined);
    this.userService.getById(userId).subscribe({
      next: (user) => {
        if (user && user.id) {
          this._selectedUser.set(user);
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      },
      complete: () => {
        this._loading.set(false);
      },
    });
  }
  create(user: IAdminCreateUser) {
    this._loading.set(true);
    this.userService.create(user).subscribe({
      next: (resp) => {
        this._users.update((state) => ({
          data: [...state.data, resp],
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a felhasználót!', type: 'primary' });
      },
      error: (err) => {
        console.log(err);
        this.toastService.add({ message: err.error.message, type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  update(userId: string, user: Partial<IAdminCreateUser>) {
    this._loading.set(true);
    this.userService.update(userId, user).subscribe({
      next: (resp) => {
        this._users.update((state) => ({
          data: state.data.map((c) => {
            if (c.id === resp.id) {
              return resp;
            } else {
              return c;
            }
          }),
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a felhasználót!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  delete(userId: string) {
    this._loading.set(true);
    this.userService.delete(userId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          this._users.update((state) => ({
            data: state.data.filter((c) => c.id !== userId),
            total: state.total - 1,
          }));
          this.toastService.add({ message: 'Sikeresen törölted a felhasználót!', type: 'primary' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      },
      complete: () => this._loading.set(false),
    });
  }

  updateFilters(partial: Partial<{ name: string; email: string }>) {
    this.filters.update((f) => ({ ...f, ...partial }));
    this.filterChange$.next();
  }
  reset() {
    this._users.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
