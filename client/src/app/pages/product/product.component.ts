import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  productId = '668af32a7f6d0bc641d8978f'; // Default product ID

  product: any = {}; // Assuming a single product object

  constructor(private http: HttpClient) {}

  fetchProduct() {
    const apiUrl = this.baseAPIUrl + this.productId;
    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.product = response; // Assign product object from response
        console.log('Fetched product:', this.product);
      },
      (error: any) => {
        console.error('Error fetching product:', error);
      }
    );
  }
  ngOnInit() {
    this.fetchProduct();
  }
}
