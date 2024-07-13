import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any[]; // Adjust the type if you have a specific interface for users
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  userCount: number = 0;
  private apiUrl = 'http://localhost:3000/api/user/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllUsers().subscribe(
      (response) => {
        if (response.success) {
          this.userCount = response.data.length;
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getAllUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }
}