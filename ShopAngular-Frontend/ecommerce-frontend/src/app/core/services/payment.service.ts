import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly API = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayment(paymentId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.API}/${paymentId}`);
  }

  refundPayment(paymentId: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API}/${paymentId}/refund`, null);
  }
}
