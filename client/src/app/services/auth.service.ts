import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  registerService(registerOgj: any){
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/register`, registerOgj);
  }

}
