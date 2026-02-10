import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../../../shared/services/toast-service';
import { API_URL } from '../../../../../config/config';

export interface ICuisin {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminCuisinService {
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getAll() {
    return this.http.get<{ data: ICuisin[]; total: number }>(API_URL + '/cuisines');
  }
  fetchCuisines(search?: string, skip = 0, take = 20) {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    return this.http.get<{ data: ICuisin[]; total: number }>(API_URL + '/cuisines', {
      params,
    });
  }
  create(cuisinName: string) {
    return this.http.post<ICuisin>(API_URL + '/cuisines', { name: cuisinName });
  }
  delete(id: string) {
    return this.http.delete<{ deleted: boolean }>(API_URL + '/cuisines/' + id);
  }
  update(cuisin: ICuisin) {
    return this.http.patch<ICuisin>(API_URL + '/cuisines/' + cuisin.id, { name: cuisin.name });
  }
}
