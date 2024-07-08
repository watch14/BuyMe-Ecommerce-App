import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  readonly APIUrl = 'http://localhost:3000/api/product/search?skip=0&take=16'; // Update with your API endpoint
  products: any[] = [];

  constructor(private http: HttpClient) {}

  fetchProducts() {
    this.http.get<any>(this.APIUrl).subscribe(
      (response: any) => {
        this.products = response.data; // Assign products array from response.data
        console.log('Fetched products:', this.products);
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  ngOnInit() {
    this.fetchProducts();
  }
}
