import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js'; // Import Stripe.js
>>>>>>> main

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

<<<<<<< HEAD
}
=======

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  products: any[] = [];
  stripe: Stripe | null = null;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      alert("You need to be logged in to access the Cart.");
      this.router.navigate(['/login']);
      return;
    }

    this.loadStripe();
    this.loadCart();
  }

  loadCart(): void {
    this.authService.getUserCart().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.cartItems = response.data.products;
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
    this.products = [];
    this.cartItems.forEach(item => {
      const productId = item.productId?._id || item.productId;
      if (productId) {
        this.authService.getProductDetails(productId).subscribe(
          (productResponse: any) => {
            this.products.push({
              ...productResponse.data,
              quantity: item.quantity
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

  removeFromCart(productId: string): void {
    this.authService.removeFromCart(productId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadCart();
        } else {
          console.error('Failed to remove item from cart:', response.message);
        }
      },
      (error: any) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }

  getTotalPrice(): number {
    return this.products.reduce((total, product) => total + product.productPrice * product.quantity, 0);
  }
  
  continueShopping(): void {
    this.router.navigate(['/shop']); // Adjust the route as necessary
  }


  async loadStripe() {
    this.stripe = await loadStripe('pk_test_51PbNu1AJZrW6cjlxFDYLGslRYgdfev77tIzfARL1NQMrT1zFoEFqFFO3vDKPThqifH1GYf2nWHwJhVST2EiitWoT00XQw3j5VT');
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
>>>>>>> main
