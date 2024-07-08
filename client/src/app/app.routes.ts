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

export const routes: Routes = [
    {'path': '', component:HomeComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'register', component:RegisterComponent},
    {'path': 'reset-password', component:ResetPasswordComponent},

    {'path': 'admin-dashboard', component:AdminDashboardComponent},

    {'path': 'shop', component:ShopComponent},
    {'path': 'product', component:ProductComponent},

    {'path': 'contact', component:ContactComponent},

    {'path': 'not-found', component:NotFoundComponent},


];