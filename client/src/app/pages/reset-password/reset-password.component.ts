import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirm-password-validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  restForm !: FormGroup;
  fb = inject(FormBuilder)

  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  authService =inject(AuthService)

  token!:String;

  ngOnInit(): void {
    this.restForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: confirmPasswordValidator('password', 'confirmPassword')    
    }
  )

    this.activatedRoute.params.subscribe(val =>{
      this.token = val['token'];
      console.log(this.token);
    })
  }


  Rest(){
    let resetObj = {
      token: this.token,
      password: this.restForm.value.password
    }
    this.authService.resettPasswordService(resetObj)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.restForm.reset();
        this.router.navigate(['login'])
      },
      error : (err) => {
        alert(err.error.message)
      },
    })

  }



}
