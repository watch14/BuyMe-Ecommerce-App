import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  readonly baseAPIUrl = 'http://localhost:3000/api/';
  productId: string | undefined;
  product: any = {};
  categoryName$: Observable<string> | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProduct();
    });
  }

  fetchProduct() {
    const apiUrl = `${this.baseAPIUrl}product/${this.productId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.product = response.data; // Ensure response.data contains the product object
        console.log('Fetched product:', this.product);
        this.categoryName$ = this.getCategoryName(this.product.categoryId);
      },
      (error: any) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  getCategoryName(categoryId: string): Observable<string> {
    const apiUrl = `${this.baseAPIUrl}category/${categoryId}`;
    return this.http.get<any>(apiUrl).pipe(map((response: any) => response.data.categoryName));
  }
}
