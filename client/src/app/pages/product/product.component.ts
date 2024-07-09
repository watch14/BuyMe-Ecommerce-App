import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  readonly baseAPIUrl = 'http://localhost:3000/api/';
  productId: string | undefined;
  product: any = {};
  categoryName$: Observable<string> | undefined;
  quantity: number = 1; // Initial quantity
  isFavorite: boolean = false;

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
        this.product = response.data; 
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

  addToFavorites() {
    if (this.isFavorite) {
      // Remove from favorites
      this.isFavorite = false;
      // Perform any necessary API calls or local operations for removing from favorites
    } else {
      // Add to favorites
      this.isFavorite = true;
      // Perform any necessary API calls or local operations for adding to favorites
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
