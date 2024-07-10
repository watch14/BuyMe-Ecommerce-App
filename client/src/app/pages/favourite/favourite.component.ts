import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css'
})


export class FavouriteComponent implements OnInit {

  products: any[] = [];
  baseUrl: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.userFavorites()
  }

  userFavorites() {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserFavorites().subscribe(
        (response: any) => {
          console.log('Full favorites response:', response);
          console.log('Data property:', response.data);
          this.products = response.data.productIds.map((product: any) => ({
            ...product,
            isFavorite: true
          }));
          console.log('productIds:', response.data.productIds);
        },
        error => console.error('Error fetching favorites:', error)
      );
    }
  }

  toggleFavorite(product: any) {
    if (!this.authService.isLoggedIn()) {
      alert("You need to be logged in!");
      return;
    }

    if (product.isFavorite) {
      this.authService.removeFromFavorites(product._id).subscribe(
        () => {
          product.isFavorite = false;
        },
        error => console.error('Error removing from favorites:', error)
      );
    } else {
      this.authService.addToFavorites(product._id).subscribe(
        () => {
          product.isFavorite = true;
        },
        error => console.error('Error adding to favorites:', error)
      );
    }
  }
}