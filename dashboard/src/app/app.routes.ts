import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { UserComponent } from './components/users/users.component';

export const routes: Routes = [
    {'path': 'admin', component:AdminComponent},
    {'path': 'edit-product', component:EditProductComponent},
    {'path': 'users', component:UserComponent},
];
