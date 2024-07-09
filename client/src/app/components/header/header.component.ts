import { CommonModule } from '@angular/common';
import { Component, Renderer2, ElementRef, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  authService = inject(AuthService)
  isLoggedIn: boolean = false

  cartCount = 1;
  showDropdown = false;
  isUserClicked = false;


  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
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

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    // Toggle user clicked state only when opening dropdown 
    if (this.showDropdown) {
      this.isUserClicked = !this.isUserClicked;
    }
  }

  logOut(){
    localStorage.removeItem("user_id")
    this.authService.isLoggedIn$.next(false)

  }
}