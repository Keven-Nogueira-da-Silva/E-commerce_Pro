import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, ProductRequest, ProductResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 20): Observable<Page<ProductResponse>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', 'createdAt,desc');
    return this.http.get<Page<ProductResponse>>(this.API, { params });
  }

  getById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API}/${id}`);
  }

  getByCategory(category: string, page = 0, size = 20): Observable<Page<ProductResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<ProductResponse>>(`${this.API}/category/${category}`, { params });
  }

  search(name: string, page = 0, size = 20): Observable<Page<ProductResponse>> {
    const params = new HttpParams().set('name', name).set('page', page).set('size', size);
    return this.http.get<Page<ProductResponse>>(`${this.API}/search`, { params });
  }

  create(request: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.API, request);
  }

  update(id: number, request: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.API}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
