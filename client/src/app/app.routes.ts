import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

export const routes: Routes = [
    {'path': '', component:HomeComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'register', component:RegisterComponent},
    {'path': 'reset-password', component:ResetPasswordComponent},
    {'path': 'image-uploader', component:ImageUploaderComponent},
];
