import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  readonly baseAPIUrl = 'http://localhost:3000/api/product/';
  productId: string | undefined;
  product: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProduct();
    });
  }

  fetchProduct() {
    const apiUrl = this.baseAPIUrl + this.productId;
    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.product = response.data; // Ensure response.data contains the product object
        console.log('Fetched product:', this.product);
      },
      (error: any) => {
        console.error('Error fetching product:', error);
      }
    );
  }
}
