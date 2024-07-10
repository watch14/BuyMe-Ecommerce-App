import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);


  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());


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

  logOut() {
    localStorage.removeItem("user_id");
    this.isLoggedIn$.next(false);
  }

  logIn() {
    this.isLoggedIn$.next(true);
  }

   addToFavorites(productId: string) {
    const userId = localStorage.getItem("user_id");
    return this.http.post<any>(`${apiUrls.favoritApi}`, { userId, productId });
  }

  removeFromFavorites(productId: string) {
    const userId = localStorage.getItem("user_id");
    return this.http.post<any>(`${apiUrls.favoritApi}/remove`, { userId, productId });
  }

  getUserFavorites() {
    const userId = localStorage.getItem("user_id");
    return this.http.get<any>(`${apiUrls.favoritApi}/user/${userId}`);
  }

  addToCart(productId: string, quantity: number) {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("You need to be logged in to add items to the cart.");
      return null;
    }
    return this.http.post<any>(`${apiUrls.cartApi}/add-to-cart`, { userId, productId, quantity });
  }

  getUserCart() {
    const userId = localStorage.getItem("user_id");
    return this.http.get<any>(`${apiUrls.cartApi}/get-cart?userId=${userId}`);

  }

  getProductDetails(productId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.ProductApi}/${productId}`);
  }

}