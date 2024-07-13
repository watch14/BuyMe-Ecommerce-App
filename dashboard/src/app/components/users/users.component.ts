import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userCount: number = 0;
  users: any[] = [];
  showUsers: boolean = false;
  private userApiUrl = 'http://localhost:3000/api/user';

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

  getAllUsers() {
    return this.http.get<ApiResponse>(this.userApiUrl);
  }

  toggleUserList(): void {
    this.showUsers = !this.showUsers;
  }

  editUser(user: any): void {
    console.log('Edit user:', user);
  }

  deleteUser(userId: string): void {
    this.http.delete(`${this.userApiUrl}/${userId}`).subscribe(
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
