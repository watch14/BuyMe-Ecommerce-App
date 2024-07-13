import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    {'path': '', component:AdminComponent},
    {'path': 'edit-product', component:EditProductComponent},
    {'path': 'users', component:UsersComponent},
];
