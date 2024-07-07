import { CommonModule } from '@angular/common';
import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartCount = 1; // Simulated cart count
  showDropdown = false; // Initially hide the dropdown
  isUserClicked = false; // Flag to track user click

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Subscribe to document click events to hide dropdown and reset user click
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
}