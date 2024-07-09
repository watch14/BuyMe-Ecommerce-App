import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  readonly baseAPIUrl = 'http://localhost:3000/api/';
  categories: any[] = [
    { image: 'Frame 106.svg', categoryName: 'Desktops', showProducts: false },
    { image: 'Frame 107.svg', categoryName: 'PC', showProducts: false },
    { image: 'Frame 109.svg', categoryName: 'Monitor', showProducts: false },
    { image: 'Frame 110.svg', categoryName: 'Keyboard', showProducts: false },
    {
      image: 'Frame 111.svg',
      categoryName: 'Gaming Mouse',
      showProducts: false,
    },
    { image: 'Frame 112.svg', categoryName: 'Controller', showProducts: false },
    { image: 'Frame 113.svg', categoryName: 'Headsets', showProducts: false },
    {
      image: 'Frame 114.svg',
      categoryName: 'Microphones',
      showProducts: false,
    },
    { image: 'Frame 115.svg', categoryName: 'Other', showProducts: false },
    { image: 'Frame 116.svg', categoryName: 'Components', showProducts: false },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategoriesWithProducts();
  }

  fetchCategoriesWithProducts() {
    const apiUrl = `${this.baseAPIUrl}category/`;
    this.http
      .get<any>(apiUrl)
      .pipe(
        map((response: any) => response.data),
        switchMap((categories: any[]) => {
          const productObservables = categories.map((category) => {
            const productsUrl = `${this.baseAPIUrl}product/search?categoryId=${category._id}`;
            return this.http.get<any>(productsUrl).pipe(
              map((productsResponse: any) => ({
                ...category,
                products: productsResponse.data.filter(
                  (product: { categoryId: any }) =>
                    product.categoryId === category._id
                ),
                showProducts: false, // Initialize showProducts to false for fetched categories
              })),
              catchError((error) => {
                console.error(
                  `Error fetching products for category ${category.categoryName}:`,
                  error
                );
                return of({ ...category, products: [], showProducts: false });
              })
            );
          });

          return forkJoin(productObservables);
        })
      )
      .subscribe(
        (processedCategories: any[]) => {
          this.categories = this.categories.map((staticCategory) => {
            const matchedCategory = processedCategories.find(
              (category) =>
                category.categoryName === staticCategory.categoryName
            );
            return matchedCategory
              ? { ...staticCategory, products: matchedCategory.products }
              : { ...staticCategory, products: [] };
          });
          console.log('Fetched categories with products:', this.categories);
        },
        (error: any) => {
          console.error('Error fetching categories with products:', error);
        }
      );
  }

  toggleCategoryProducts(category: any) {
    category.showProducts = !category.showProducts;
  }
}
