import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../../../shared/services/toast-service';
import { environment } from '../../../../../../environments/environment';

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
    return this.http.get<{ data: ICuisin[]; total: number }>(environment.apiUrl + '/cuisines');
  }
  fetchCuisines(search?: string, skip = 0, take = 20) {
    let params = new HttpParams().set('skip', skip).set('take', take);
    if (search) params = params.set('search', String(search));

    return this.http.get<{ data: ICuisin[]; total: number }>(environment.apiUrl + '/cuisines', {
      params,
    });
  }
  create(cuisinName: string) {
    return this.http.post<ICuisin>(environment.apiUrl + '/cuisines', { name: cuisinName });
  }
  delete(id: string) {
    return this.http.delete<{ deleted: boolean }>(environment.apiUrl + '/cuisines/' + id);
  }
  update(cuisin: ICuisin) {
    return this.http.patch<ICuisin>(environment.apiUrl + '/cuisines/' + cuisin.id, {
      name: cuisin.name,
    });
  }
}
