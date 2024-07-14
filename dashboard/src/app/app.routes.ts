import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { UsersComponent } from './components/users/users.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ChartComponent } from './components/chart/chart.component';

export const routes: Routes = [
    {'path': '', component:HomeComponent},
    {'path': 'admin', component:AdminComponent},
    {'path': 'edit-product', component:EditProductComponent},
    {'path': 'users', component:UsersComponent},
    {'path': 'product', component:ProductComponent},

    {'path': 'order', component:OrdersComponent},
    {'path': 'chart', component:ChartComponent},

];
