import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userCount: number = 0;
  users: any[] = [];
  showUsers: boolean = false;
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.data;
          this.userCount = this.users.length;
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getAllUsers(): Observable<ApiResponse> {
    console.log("no users")
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  toggleUserList(): void {
    this.showUsers = !this.showUsers;
  }

  editUser(user: any): void {
    // Implement edit functionality here
    console.log('Edit user:', user);
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.apiUrl}${userId}`).subscribe(
      (response: any) => {
        if (response.success) {
          this.users = this.users.filter(user => user._id !== userId);
          this.userCount = this.users.length;
        }
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
}
