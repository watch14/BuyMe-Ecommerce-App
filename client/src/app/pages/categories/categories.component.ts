import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  readonly baseAPIUrl = 'http://localhost:3000/api/';
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategoriesWithProducts();
  }

  fetchCategoriesWithProducts() {
    const apiUrl = `${this.baseAPIUrl}category/`;
    this.http.get<any>(apiUrl).pipe(
      map((response: any) => response.data),
      switchMap((categories: any[]) => {
        const productObservables = categories.map(category => {
          const productsUrl = `${this.baseAPIUrl}product/search?categoryId=${category._id}`;
          return this.http.get<any>(productsUrl).pipe(
            map((productsResponse: any) => ({
              ...category,
              products: productsResponse.data.filter((product: { categoryId: any; }) => product.categoryId === category._id)
            })),
            catchError(error => {
              console.error(`Error fetching products for category ${category.categoryName}:`, error);
              return of({ ...category, products: [] });
            })
          );
        });

        return forkJoin(productObservables);
      })
    ).subscribe(
      (processedCategories: any[]) => {
        this.categories = processedCategories;
        console.log('Fetched categories with products:', this.categories);
      },
      (error: any) => {
        console.error('Error fetching categories with products:', error);
      }
    );
  }

  fetchProductsByCategory(categoryId: string) {
    const productsUrl = `${this.baseAPIUrl}product/search?categoryId=${categoryId}`;
    this.http.get<any>(productsUrl).subscribe(
      (productsResponse: any) => {
        const selectedCategory = this.categories.find(category => category._id === categoryId);
        if (selectedCategory) {
          selectedCategory.products = productsResponse.data;
        }
      },
      (error: any) => {
        console.error(`Error fetching products for category ID ${categoryId}:`, error);
      }
    );
  }
}