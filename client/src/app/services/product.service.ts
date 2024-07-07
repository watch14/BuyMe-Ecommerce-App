import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly APIUrl = "http://localhost:3000/api/product/search?skip=0&take=10";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.APIUrl, productData);
  }
}
