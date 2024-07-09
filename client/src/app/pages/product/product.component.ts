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
  displayedCategories: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProduct();
    });
    this.fetchRecommendedProducts(); // Fetch recommended products on init
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

  fetchRecommendedProducts() {
    const apiUrl = `${this.baseAPIUrl}category/`;
    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        const categories = response.data; // Ensure response.data contains categories array
        console.log('Fetched categories:', categories);
  
        categories.forEach((category: { _id: string; products: any[]; categoryName: any; }) => {
          this.fetchProductsByCategory(category._id).subscribe(
            (products: any[]) => {
              category.products = products; // Assign fetched products to category
              console.log(`Fetched products for ${category.categoryName}:`, category.products);
            },
            (error: any) => {
              console.error(`Error fetching products for ${category.categoryName}:`, error);
            }
          );
        });
  
        this.displayedCategories = categories; // Assign categories with products to displayedCategories
        console.log('Displayed Categories:', this.displayedCategories); // Check if categories and products are correctly assigned
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  
  fetchProductsByCategory(categoryId: string): Observable<any[]> {
    const apiUrl = `${this.baseAPIUrl}product/search?category=${categoryId}`;
    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => response.data)
    );
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
