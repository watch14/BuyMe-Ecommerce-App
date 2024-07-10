import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  products: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserCart().subscribe(
      (response: any) => {
        if (response.status === 200) {
          console.log('Cart response:', response);
          this.cartItems = response.data.products; // Adjust the path based on the response structure
          this.fetchProductDetails();
        } else {
          console.error('Failed to fetch cart items:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  fetchProductDetails(): void {
    this.cartItems.forEach(item => {
      const productId = item.productId?.$oid; // Ensure productId is correctly accessed
      console.log('Fetching details for productId:', productId); // Add logging here
      if (productId) {
        this.authService.getProductDetails(productId).subscribe(
          (productResponse: any) => {
            this.products.push({
              ...item,
              ...productResponse
            });
          },
          (error: any) => {
            console.error('Error fetching product details:', error);
          }
        );
      } else {
        console.error('Product ID is undefined for item:', item);
      }
    });
  }
}

