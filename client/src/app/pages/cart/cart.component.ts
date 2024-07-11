import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js'; // Import Stripe.js

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
  stripe: Stripe | null = null; // Define the Stripe instance

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {} // Inject HttpClient

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login page if not logged in
      alert("You need to be logged in to access the Cart.");
      this.router.navigate(['/login']); // Adjust the route as necessary
      return;
    }

    this.loadStripe();
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

  async loadStripe() {
    this.stripe = await loadStripe('pk_test_51PbNu1AJZrW6cjlxFDYLGslRYgdfev77tIzfARL1NQMrT1zFoEFqFFO3vDKPThqifH1GYf2nWHwJhVST2EiitWoT00XQw3j5VT'); // Replace with your Stripe public key
  }

  initiateCheckout(): void {
    this.authService.createCheckoutSession().subscribe(
      (response: any) => {
        if (response.status === 200) {
          const sessionId = response.data.id;
          this.redirectToCheckout(sessionId);
        } else {
          console.error('Failed to create checkout session:', response.message);
        }
      },
      (error: any) => {
        console.error('Error creating checkout session:', error);
      }
    );
  }

  redirectToCheckout(sessionId: string): void {
    if (this.stripe) {
      this.stripe.redirectToCheckout({ sessionId }).then((result: any) => {
        if (result.error) {
          console.error('Error redirecting to checkout:', result.error.message);
        }
      });
    } else {
      console.error('Stripe.js has not loaded yet.');
    }
  }
}