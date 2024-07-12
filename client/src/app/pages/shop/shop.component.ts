import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  readonly baseUrl = 'http://localhost:3000/api/product/search';
  skip = 0;
  take = 4;
  products: any[] = [];
  hasMoreProducts = true;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const url = `${this.baseUrl}?skip=${this.skip}&take=${this.take}`;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        const fetchedProducts = response.data.map((product: any) => ({
          ...product,
          isFavorite: false,
        }));
        this.hasMoreProducts = response.data.length === this.take;
        this.loadUserFavorites();
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadUserFavorites() {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserFavorites().subscribe(
        (response: any) => {
          console.log('Full favorites response:', response);
          console.log('Data property:', response.data);

          const favoriteProductIds = response.data?.productIds;

          if (Array.isArray(favoriteProductIds)) {
            favoriteProductIds.forEach((favProduct) => {
              const productIndex = this.products.findIndex(
                (prod) => prod._id === favProduct._id
              );
              if (productIndex !== -1) {
                this.products[productIndex].isFavorite = true;
              }
            });
          } else {
            console.error(
              'Favorites productIds is not an array or undefined:',
              favoriteProductIds
            );
          }
        },
        (error) => console.error('Error fetching user favorites:', error)
      );
    }
  }

  toggleFavorite(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert('You need to be logged in!');
      return;
    }

    if (product.isFavorite) {
      this.authService.removeFromFavorites(product._id).subscribe(
        () => {
          product.isFavorite = false;
        },
        (error) => console.error('Error removing from favorites:', error)
      );
    } else {
      this.authService.addToFavorites(product._id).subscribe(
        () => {
          product.isFavorite = true;
        },
        (error) => console.error('Error adding to favorites:', error)
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
}
