import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ICuisin {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CuisinService {
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
}
