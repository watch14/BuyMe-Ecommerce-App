import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  registerService(registerOgj: any){
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/register`, registerOgj);
  }

  loginService(loginObj: any) {
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/login`, loginObj);
  }

  sendEmailService(email: string){
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/send-email`, {email: email});
  }

  resettPasswordService(resetObj: any){
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/reset-password`, resetObj);
  }

  isLoggedIn(){
    return !!localStorage.getItem("user_id");
  }

}
