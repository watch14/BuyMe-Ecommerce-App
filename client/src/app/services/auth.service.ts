import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  http = inject(HttpClient);

  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());
  cartCount$ = new BehaviorSubject<number>(0);

  registerService(registerObj: any){
    return this.http.post<any>(`${apiUrls.AuthServiceApi}/register`, registerObj);
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
    this.cartCount$.next(0);
  }

  logIn() {
    this.isLoggedIn$.next(true);
    this.updateCartCount();
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
    return this.http.post<any>(`${apiUrls.cartApi}/add-to-cart`, { userId, productId, quantity }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  removeFromCart(productId: string) {
    const userId = localStorage.getItem("user_id");
    return this.http.post<any>(`${apiUrls.cartApi}/delete-from-cart`, { userId, productId }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  getUserCart() {
    const userId = localStorage.getItem("user_id");
    return this.http.get<any>(`${apiUrls.cartApi}/get-cart?userId=${userId}`);
  }

  getCartCount(): Observable<any> {
    const userId = localStorage.getItem("user_id");
    return this.http.get<any>(`${apiUrls.cartApi}/count?userId=${userId}`);
  }
  
  getProductDetails(productId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.ProductApi}/${productId}`);
  }

  updateCartCount() {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      this.getCartCount().subscribe(
        (response) => {
          if (response.status === 200) {
            this.cartCount$.next(response.data.count);
          } else {
            console.error('Error fetching cart count:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching cart count:', error);
        }
      );
    }
  }

  // Method to get cart by user ID
  getCartByUserId(userId: string): Observable<any> {
    return this.http.get(`${apiUrls.cartApi}/get-cart`, { params: { userId } });
  }
  
  emptyCart(userId: string): Observable<any> {
    return this.http.post<any>(`${apiUrls.cartApi}/empty-cart`, { userId }).pipe(
      tap(() => this.updateCartCount())
    );
  }


  createCheckoutSession(): Observable<any> {
    const userId = localStorage.getItem("user_id");
    return this.http.post<any>(`${apiUrls.paymentApi}/create-checkout-session`, { userId });
  }
}