import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AddToCartRequest, CartResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  get cartItemCount(): number {
    return this.cartSubject.value?.totalItems ?? 0;
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.API).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.API}/items`, request).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateItem(itemId: number, quantity: number): Observable<CartResponse> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.put<CartResponse>(`${this.API}/items/${itemId}`, null, { params }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/items/${itemId}`).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.API).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }

  clearLocal(): void {
    this.cartSubject.next(null);
  }
}
