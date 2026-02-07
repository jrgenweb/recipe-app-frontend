import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../config/config';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast-service';

export interface ICuisin {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CuisinService {
  cuisines$ = new BehaviorSubject<ICuisin[]>([]);
  private http: HttpClient = inject(HttpClient);
  private toastService: ToastService = inject(ToastService);
  isLoading = false;
  total = 0;
  pageSize = 20;
  constructor() {}

  loadNext(search?: string) {
    if (this.isLoading) return;
    if (this.total && this.cuisines$.value.length >= this.total) return;
    this.isLoading = true;
    const skip = this.cuisines$.value.length;
    const take = this.pageSize;

    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    this.http
      .get<{ data: ICuisin[]; total: number }>(API_URL + '/cuisines', {
        params,
      })
      .subscribe((resp) => {
        this.cuisines$.next([...this.cuisines$.value, ...resp.data]);
        this.total = resp.total;
        this.isLoading = false;
        //inf?.done();
      });
  }

  reset() {
    this.cuisines$.next([]);
    this.total = 0;
  }

  getAll() {
    this.http.get<{ data: ICuisin[]; total: number }>(API_URL + '/cuisines').subscribe({
      next: (resp) => {
        this.cuisines$.next(resp.data);
      },
      error: (_err) => {
        //console.error(err);
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
    });
  }
  create(cuisinName: string) {
    this.http.post<ICuisin>(API_URL + '/cuisines', { name: cuisinName }).subscribe((resp) => {
      const oldcuisines = [...this.cuisines$.value];
      oldcuisines.push(resp);
      this.cuisines$.next(oldcuisines);

      this.toastService.add({ message: 'Sikeresen hozzáadtad a kategóriát!', type: 'primary' });
    });
  }
  delete(id: string) {
    if (id)
      this.http.delete<{ deleted: boolean }>(API_URL + '/cuisines/' + id).subscribe((resp) => {
        if (resp.deleted) {
          const updatedCuisines = this.cuisines$.value.filter((c) => c.id !== id);

          this.cuisines$.next(updatedCuisines);
          this.toastService.add({ message: 'Sikeresen törölted a kategóriát!', type: 'primary' });
        } else {
          this.toastService.add({ message: 'Hiba történt', type: 'danger' });
        }
      });
  }
  update(cuisin: ICuisin) {
    this.http
      .patch<ICuisin>(API_URL + '/cuisines/' + cuisin.id, { name: cuisin.name })
      .subscribe((resp) => {
        const oldCuisines = [...this.cuisines$.value];
        oldCuisines.push(resp);
        this.cuisines$.next(oldCuisines);
        this.toastService.add({
          message: 'Sikeresen szerkesztetted a kategóriát!',
          type: 'primary',
        });
      });
  }
}
