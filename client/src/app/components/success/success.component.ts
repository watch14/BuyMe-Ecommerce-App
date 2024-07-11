import { Component, OnInit } from '@angular/core';
import { apiUrls } from '../../api.urls';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})


export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];
      if (sessionId) {
        this.verifyPayment(sessionId);
      } else {
        this.router.navigate(['/cancel']); // Redirect if no session ID is found
      }
    });
  }

  verifyPayment(sessionId: string): void {
    this.http.get(`${apiUrls.paymentApi}/payment-success?session_id=${sessionId}`).subscribe(
      (response: any) => {
        if (response.success) {
          // Call the backend API to empty the cart
          this.emptyCart();
          console.log(response.message);
        }
      },
      (error: any) => {
        console.error('Error verifying payment:', error);
        // Optionally redirect to an error page
        this.router.navigate(['/cancel']);
      }
    );
  }

  emptyCart(): void {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      this.http.post(`${apiUrls.cartApi}/empty-cart`, { userId }).subscribe(
        (response: any) => {
          if (response.success) {
            console.log('Cart emptied successfully');
          } else {
            console.error('Failed to empty cart:', response.message);
          }
        },
        (error: any) => {
          console.error('Error emptying cart:', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
}