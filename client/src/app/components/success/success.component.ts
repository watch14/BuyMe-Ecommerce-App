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
        this.router.navigate(['/payment-error']); // Redirect if no session ID is found
      }
    });
  }

  verifyPayment(sessionId: string): void {
    this.http.get(`${apiUrls.paymentApi}/payment-success?session_id=${sessionId}`).subscribe(
      (response: any) => {
        if (response.success) {
          // Call the backend API to empty the cart
          console.log(response.message);
          
        } else {
          console.error('Payment verification failed:', response.message);
          this.router.navigate(['/payment-error']);
        }
      },
      (error: any) => {
        console.error('Error verifying payment:', error);
        this.router.navigate(['/payment-error']);
      }
    );
  }


}