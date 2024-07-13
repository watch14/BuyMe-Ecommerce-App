import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { apiUrls } from '../../api.urls';
import { ShopComponent } from '../shop/shop.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule, ShopComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})

export class ProductComponent implements OnInit {
  product: any;
  isFavorite: boolean = false;
  quantity: number = 1;
  categoryName$!: Observable<string>;
  productUrl = apiUrls.ProductApi;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadProduct();
    this.loadUserFavorites();
  }

  loadProduct() {
    const productId = this.route.snapshot.paramMap.get('id'); // Get the product ID from the route parameters
    if (productId) {
      this.http.get<any>(`${this.productUrl}/${productId}`).subscribe(
        (response: any) => {
          this.product = response.data;
        },
        error => console.error('Error fetching product details:', error)
      );
    }
  }

  loadUserFavorites() {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserFavorites().subscribe(
        (response: any) => {
          const favoriteProductIds = response.data?.productIds;

          if (Array.isArray(favoriteProductIds)) {
            this.isFavorite = favoriteProductIds.some(favProduct => favProduct._id === this.product._id);
          } else {
            console.error('Favorites productIds is not an array or undefined:', favoriteProductIds);
          }
        },
        error => console.error('Error fetching user favorites:', error)
      );
    }
  }

  toggleFavorite() {
    if (!this.authService.isLoggedIn()) {
      alert("You need to be logged in!");
      return;
    }

    if (this.isFavorite) {
      this.authService.removeFromFavorites(this.product._id).subscribe(
        () => {
          this.isFavorite = false;
        },
        error => console.error('Error removing from favorites:', error)
      );
    } else {
      this.authService.addToFavorites(this.product._id).subscribe(
        () => {
          this.isFavorite = true;
        },
        error => console.error('Error adding to favorites:', error)
      );
    }
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      alert('You need to be logged in to add items to the cart.');
      return;
    }

    if (!this.product || !this.product._id) {
      console.error('Invalid product');
      return;
    }

    const addToCartObservable = this.authService.addToCart(this.product._id, this.quantity);
    if (addToCartObservable) {
      addToCartObservable.subscribe(
        () => {
          console.log('Product added to cart');
        },
        error => console.error('Error adding product to cart:', error)
      );
    }
  }

  changeMainImage(index: number) {
    const temp = this.product.productPicture[0];
    this.product.productPicture[0] = this.product.productPicture[index];
    this.product.productPicture[index] = temp;
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