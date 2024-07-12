import { CommonModule } from '@angular/common';
import { Component, Renderer2, ElementRef, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { apiUrls } from '../../api.urls';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {

  authService = inject(AuthService);
  isLoggedIn: boolean = false;

  cartCount = 1;
  showDropdown = false;

  productDropdown = false;
  isUserClicked = false;

  products: any[] = [];
  searchResults: any[] = [];

  iconSrc: string = '../../../assets/icons/Wishlist.svg';

  changeIcon(isHover: boolean): void {
    this.iconSrc = isHover 
      ? '../../../assets/icons/Wishlist-red.svg' 
      : '../../../assets/icons/Wishlist.svg';
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.authService.updateCartCount(); // Fetch cart count if logged in
      }
    });

    this.authService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // Set the initial isLoggedIn state based on the current login status
    this.isLoggedIn = this.authService.isLoggedIn();

    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
        this.productDropdown = false; 
        this.isUserClicked = false;

        this.authService.isLoggedIn$.subscribe(res=>{
          this.isLoggedIn = this.authService.isLoggedIn();
        })
      }


    });
  }

  logOut(){
    this.authService.logOut();
  }

  fetchProducts(query?: string): void {
    let apiUrl = `${apiUrls.ProductApi}/search?skip=0&take=10`;
    if (query) {
      apiUrl += `&q=${query}`;
    }
  
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('Fetched products:', response.data);
        if (response.success && Array.isArray(response.data)) {
          this.products = response.data;
          this.searchResults = response.data; // search results initially with all products
          this.productDropdown = true; 
        } else {
          console.error('Error fetching products:', response.message);
          this.products = [];
          this.searchResults = [];
          this.productDropdown = false; 
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = [];
        this.searchResults = [];
        this.productDropdown = false; 
      }
    );
  }

  fetchSearchResults(query: string): void {
    if (!query) {
      this.searchResults = []; 
      this.productDropdown = false; 
      return;
    }

    //  products based on query
    this.searchResults = this.products.filter(product =>
      product.productName.toLowerCase().includes(query.toLowerCase()) ||
      product.productDescription.toLowerCase().includes(query.toLowerCase())
    );

    this.productDropdown = true; // Show dropdown when there are results
  }

  clearSearchResults(): void {
    this.searchResults = [];
    this.productDropdown = false; // Hide dropdown when clearing results
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}