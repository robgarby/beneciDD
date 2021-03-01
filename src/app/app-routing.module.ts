import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { CartComponent } from './cart/cart.component';
import { PizzaComponent } from './pizza/pizza.component';
import { BuildComponent } from './build/build.component';
import { SubsComponent } from './subs/subs.component';
import { SandwichComponent } from './sandwich/sandwich.component';
import { PastaComponent } from './pasta/pasta.component';
import { ChickenComponent } from './chicken/chicken.component';
import { HalfNhalfComponent } from './half-nhalf/half-nhalf.component';
import { SaladComponent } from './salad/salad.component';
import { SideComponent } from './side/side.component';
import { DrinksComponent } from './drinks/drinks.component';
import { MenuComponent } from './menu/menu.component';
import { OnlineMenuComponent } from './online-menu/online-menu.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: 'START', component: StartComponent},
  {path: 'order online', component: MenuComponent},
  {path: 'MENU', component: MenuComponent},
  {path: 'CART', component:CartComponent},
  {path: 'PIZZA', component: PizzaComponent},
  {path: 'CHICKEN', component: ChickenComponent},
  {path: 'PASTA', component: PastaComponent},
  {path: 'SANDWICH', component: SandwichComponent},
  {path: 'SIDE', component: SideComponent},
  {path: 'SALAD', component: SaladComponent},
  {path: 'SUBS', component: SubsComponent},
  {path: 'BUILD', component: BuildComponent},
  {path: 'HALF', component: HalfNhalfComponent},
  {path: 'LOGIN', component: LoginComponent},
  {path: 'DRINK', component: DrinksComponent},
  {path: 'locations', component: StartComponent},
  {path: 'menu', component: OnlineMenuComponent},
  {path: 'about us', component: AboutUsComponent},
  {path: '**', component: StartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
