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
export class HeaderComponent implements OnInit{

  authService = inject(AuthService)
  isLoggedIn: boolean = false

  cartCount = 1;
  showDropdown = false;
  isUserClicked = false;

  products: any[] = [];
  searchResults: any[] = [];


  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts(); // Fetch products when component initializes

    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
        this.isUserClicked = false;

        this.authService.isLoggedIn$.subscribe(res=>{
          this.isLoggedIn = this.authService.isLoggedIn();
        })
      }


    });
  }



  logOut(){
    localStorage.removeItem("user_id")
    this.authService.isLoggedIn$.next(false)

  }
  fetchProducts() {
    this.http.get<any[]>(apiUrls.ProductApi).subscribe(
      (data) => {
        console.log('API Response:', data); // Log the response
        this.products = data || []; // Ensure data is an array or initialize as empty array
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = []; // Set products as empty array on error
      }
    );
  }

  fetchSearchResults(query: string) {
    if (!query) {
      this.searchResults = []; // Clear results if query is empty
      return;
    }

    // Filter products based on query
    this.searchResults = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  clearSearchResults() {
    this.searchResults = [];
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.isUserClicked = true;
    }
  }

}