import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (response: any) => { // Update the type to 'any'
        this.products = response.data; // Access 'data' property here
        console.log(this.products);
      },
      (error: any) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
