import { CommonModule } from '@angular/common';
import { Component, Renderer2, ElementRef, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  authServise = inject(AuthService)
  isLoggedIn: boolean = this.authServise.isLoggedIn();

  cartCount = 1;
  showDropdown = false;
  isUserClicked = false;


  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
        this.isUserClicked = false;
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
  }
}