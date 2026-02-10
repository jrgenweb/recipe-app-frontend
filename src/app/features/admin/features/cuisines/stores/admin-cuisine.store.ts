import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeCategoryResponse, IRecipeCategory } from '@recipe/shared';
import { finalize, tap } from 'rxjs';

import { ToastService } from '../../../../../shared/services/toast-service';
import { AdminCuisinService, ICuisin } from '../services/admin-cuisine-service';

@Injectable({ providedIn: 'root' })
export class AdminCuisineStore {
  private cuisineService = inject(AdminCuisinService);
  private toastService = inject(ToastService);

  // --- State ---
  private _cuisines = signal<{ data: ICuisin[]; total: number }>({ data: [], total: 0 });

  // --- Selectors ---

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- Selectors (Publikus readonly jelek) ---
  readonly cuisines = computed(() => this._cuisines().data);
  readonly total = computed(() => this._cuisines().total);
  readonly isLoading = computed(() => this._loading());

  // --- Actions ---

  /** Kezdeti betöltés vagy keresés */
  loadAll(search?: string) {
    this._loading.set(true);
    this.cuisineService.getAll().subscribe({
      next: (resp) => {
        this._cuisines.set(resp);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext(search?: string) {
    if (this._loading() || (this.total() > 0 && this.cuisines().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.cuisines().length;
    this.cuisineService
      .fetchCuisines(search, skip, 20)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._cuisines.update((state) => ({
          data: [...state.data, ...resp.data],
          total: resp.total,
        }));
      });
  }

  create(cuisineName: string) {
    this._loading.set(true);
    this.cuisineService.create(cuisineName).subscribe({
      next: (resp) => {
        this._cuisines.update((state) => ({
          data: [...state.data, resp],
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a konyhát!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  update(cuisin: ICuisin) {
    this._loading.set(true);
    this.cuisineService.update(cuisin).subscribe({
      next: (resp) => {
        this._cuisines.update((state) => ({
          data: state.data.map((c) => {
            if (c.id === resp.id) {
              return resp;
            } else {
              return c;
            }
          }),
          total: state.total + 1,
        }));

        this.toastService.add({ message: 'Sikeresen hozzáadtad a konyhát!', type: 'primary' });
      },
      complete: () => this._loading.set(false),
    });
  }

  delete(cusineId: string) {
    this._loading.set(true);
    this.cuisineService.delete(cusineId).subscribe({
      next: (resp) => {
        if (resp.deleted) {
          this._cuisines.update((state) => ({
            data: state.data.filter((c) => c.id !== cusineId),
            total: state.total - 1,
          }));
          this.toastService.add({ message: 'Sikeresen törölted a konyhát!', type: 'primary' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      },
      complete: () => this._loading.set(false),
    });
  }

  reset() {
    this._cuisines.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
