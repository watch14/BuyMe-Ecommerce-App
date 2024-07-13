import { Component } from '@angular/core';
import { SliderComponent } from '../../components/slider/slider.component';
import { ShopComponent } from "../shop/shop.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, ShopComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
