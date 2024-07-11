import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SliderComponent } from '../../components/slider/slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, SliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
    const url = `${this.baseUrl}?skip=${this.skip}&take=${this.take}&sort=createdAt:desc`;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        const fetchedProducts = response.data.map((product: any) => ({
          ...product,
          isFavorite: false,
        }));

        // Determine if there are more products to fetch
        if (fetchedProducts.length < this.take) {
          this.hasMoreProducts = false; // No more products to fetch
        } else {
          this.hasMoreProducts = true; // There may be more products to fetch
        }

        // Update products array with fetched products
        this.products = fetchedProducts;

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

          // Access productIds inside the data property
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
