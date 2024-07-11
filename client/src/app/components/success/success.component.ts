import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  ngOnInit(): void {
    console.log('Success Component Loaded');
  }
}