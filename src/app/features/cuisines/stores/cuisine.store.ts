import { inject, Injectable, signal, computed } from '@angular/core';

import { finalize } from 'rxjs';
import { CuisinService, ICuisin } from '../services/cuisine.service';
import { ToastService } from '../../../shared/services/toast-service';

@Injectable({ providedIn: 'root' })
export class CuisineStore {
  private cuisineService = inject(CuisinService);
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

  reset() {
    this._cuisines.set({ data: [], total: 0 });
    this._loading.set(false);
  }
}
