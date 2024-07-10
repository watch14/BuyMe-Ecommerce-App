import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router for navigation

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

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert("You need to be logged to access the Cart.");
      this.router.navigate(['/login']); // Adjust the route as necessary
      return;
    }

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
      const productId = item.productId?._id || item.productId; // Adjusted to access _id directly from productId
      console.log('Fetching details for productId:', productId); // Add logging here
      if (productId) {
        this.authService.getProductDetails(productId).subscribe(
          (productResponse: any) => {
            console.log('Product response:', productResponse); // Log the product response
            this.products.push({
              ...productResponse.data, // Ensure data is correctly merged
              quantity: item.quantity // Ensure quantity is correctly merged
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