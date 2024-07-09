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
  readonly baseUrl = 'http://localhost:3000/api/product/search';
  skip = 0;
  take = 4;
  products: any[] = [];
  hasMoreProducts = true; // Flag to track if there are more products available

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const url = `${this.baseUrl}?skip=${this.skip}&take=${this.take}`;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.products = response.data; // Replace current products with new ones
        this.hasMoreProducts = response.data.length === this.take; // Check if there are more products to fetch
        console.log('Fetched products:', this.products);
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  nextSet() {
    this.skip += this.take; // Move to the next set of products
    this.fetchProducts();
  }

  prevSet() {
    this.skip -= this.take; // Move to the previous set of products
    if (this.skip < 0) {
      this.skip = 0; // Ensure skip doesn't go below zero
    }
    this.fetchProducts();
  }
}