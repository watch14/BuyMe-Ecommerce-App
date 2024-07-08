import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component , inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../validators/confirm-password-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm !: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: confirmPasswordValidator('password', 'confirmPassword')    }
    );
  }

  register(){
    this.authService.registerService(this.registerForm.value).subscribe({
      next:(res)=>{
        alert("USer Created!");
        this.registerForm.reset();
        this.router.navigate(['login'])
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
