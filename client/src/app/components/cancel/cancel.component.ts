import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent implements OnInit {
  ngOnInit(): void {
    console.log('Cancel Component Loaded');
  }
}