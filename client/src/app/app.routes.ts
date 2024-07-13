import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductComponent } from './pages/product/product.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CartComponent } from './pages/cart/cart.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { FavouriteComponent } from './pages/favourite/favourite.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';

export const routes: Routes = [
    {'path': '', component:HomeComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'register', component:RegisterComponent},
    {'path': 'forget-password', component:ForgetPasswordComponent},
    {'path': 'reset/:token', component:ResetPasswordComponent},

    {'path': 'admin-dashboard', component:AdminDashboardComponent},

    {'path': 'shop', component:ShopComponent},
    {'path': 'product/:id', component:ProductComponent},
    {'path': 'favourite', component:FavouriteComponent},

    {'path': 'categories', component:CategoriesComponent},

    {'path': 'cart', component:CartComponent},

    {'path': 'contact', component:ContactComponent},
    {'path': 'about-us', component:AboutUsComponent},

    {'path': 'not-found', component:NotFoundComponent},

    { 'path': 'success', component:SuccessComponent },
    { 'path': 'cancel', component:CancelComponent }, 

    { 'path': '**', redirectTo: '/not-found' } 
    


];