import { apiUrls } from './../../api.urls';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Options, Ng5SliderModule } from 'ng5-slider';
import { FormsModule } from '@angular/forms';
import { SliderModule } from './slider.module';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule, SliderModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})

export class ShopComponent implements OnInit {
  @Input() take: number = 12;
  baseUrl = apiUrls.productSearchApi;
  skip = 0;
  products: any[] = [];
  hasMoreProducts = true;
  selectedCategory: string = '';
  selectedPriceOrder: string = '';
  minPrice: number = 10;
  maxPrice: number = 3000;
  priceRange: number[] = [this.minPrice, this.maxPrice];

  options: Options = {
    floor: 0,
    ceil: 3000,
    step: 10,
    translate: (value: number): string => {
      return '$' + value;
    }
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    let url = `${this.baseUrl}?skip=${this.skip}&take=${this.take}&minPrice=${this.priceRange[0]}&maxPrice=${this.priceRange[1]}`;
  
    if (this.selectedCategory) {
      url += `&category=${this.selectedCategory}`;
    }
  
    if (this.selectedPriceOrder) {
      url += `&sort=${this.selectedPriceOrder}`;
    }
  
    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.products = response.data.map((product: any) => ({
          ...product,
          isFavorite: false
        }));
        this.hasMoreProducts = response.data.length === this.take;
        this.loadUserFavorites();
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  

  sortProductsByPrice() {
    if (this.selectedPriceOrder === 'asc') {
      this.products.sort((a, b) => a.productPrice - b.productPrice);
    } else if (this.selectedPriceOrder === 'desc') {
      this.products.sort((a, b) => b.productPrice - a.productPrice);
    }
  }

  loadUserFavorites() {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserFavorites().subscribe(
        (response: any) => {
          const favoriteProductIds = response.data?.productIds;

          if (Array.isArray(favoriteProductIds)) {
            favoriteProductIds.forEach(favProduct => {
              const productIndex = this.products.findIndex(prod => prod._id === favProduct._id);
              if (productIndex !== -1) {
                this.products[productIndex].isFavorite = true;
              }
            });
          } else {
            console.error('Favorites productIds is not an array or undefined:', favoriteProductIds);
          }
        },
        error => console.error('Error fetching user favorites:', error)
      );
    }
  }

  toggleFavorite(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert("You need to be logged in!");
      return;
    }

    if (product.isFavorite) {
      this.authService.removeFromFavorites(product._id).subscribe(
        () => {
          product.isFavorite = false;
        },
        error => console.error('Error removing from favorites:', error)
      );
    } else {
      this.authService.addToFavorites(product._id).subscribe(
        () => {
          product.isFavorite = true;
        },
        error => console.error('Error adding to favorites:', error)
      );
    }
  }

  addToCart(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert('You need to be logged in to add items to the cart.');
      return;
    }

    if (!product || !product._id) {
      console.error('Invalid product');
      return;
    }

    const quantity = 1; // Example quantity
    const addToCartObservable = this.authService.addToCart(product._id, quantity);
    if (addToCartObservable) {
      addToCartObservable.subscribe(
        () => {
          console.log('Product added to cart');
        },
        error => console.error('Error adding product to cart:', error)
      );
    }
  }

  nextSet() {
    this.skip += this.take;
    this.fetchProducts();
  }

  prevSet() {
    this.skip -= this.take;
    if (this.skip < 0) {
      this.skip = 0;
    }
    this.fetchProducts();
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.skip = 0; // Reset pagination
    this.fetchProducts();
  }

  filterByPrice(priceOrder: string) {
    this.selectedPriceOrder = priceOrder;
    this.skip = 0; // Reset pagination
    this.fetchProducts();
  }

  onPriceChange() {
    this.skip = 0; // Reset pagination
    this.fetchProducts();
  }
}