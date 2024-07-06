import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly APIUrl = "http://localhost:3000/api/product/create";

  constructor(private http: HttpClient) {}

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.APIUrl, productData);
  }
}
