import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private baseUrl = `${apiUrls.baseUrl}/receipts`;

  http = inject(HttpClient);

  createReceipt(cartId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { cartId });
  }

  getAllReceipts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getReceiptById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateReceipt(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteReceipt(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${apiUrls.userApi}/${id}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${apiUrls.productDetailsApi}/${id}`);
  }
}