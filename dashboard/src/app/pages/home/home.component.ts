import { Component } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { UsersComponent } from '../../components/users/users.component';
import { ProductComponent } from '../../components/product/product.component';
import { RouterModule } from '@angular/router';
import { AppComponent } from "../../app.component";
import { OrdersComponent } from '../../components/orders/orders.component';
import { ChartComponent } from '../../components/chart/chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdminComponent,
            EditProductComponent,
            UsersComponent,
            ProductComponent,
            RouterModule,
            OrdersComponent,
            ChartComponent

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
