import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StartComponent } from './start/start.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

const appRoutes : Routes = [
  {path: 'START', component: StartComponent},
  {path: 'MENU', component: MenuComponent},
  {path: 'CART', component: CartComponent},
  {path: 'PIZZA', component: PizzaComponent},
  {path: 'CHICKEN', component: ChickenComponent},
  {path: 'PASTA', component: PastaComponent},
  {path: 'SANDWICH', component: SandwichComponent},
  {path: 'SIDE', component: SideComponent},
  {path: 'SALAD', component: SaladComponent},
  {path: 'SUBS', component: SubsComponent},
  {path: 'BUILD', component: BuildComponent},
  {path: 'HALF', component: HalfNhalfComponent},
  {path: 'DRINK', component: DrinksComponent},
  {path: '**', component: StartComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    MenuComponent,
    CartComponent,
    PizzaComponent,
    BuildComponent,
    SubsComponent,
    SandwichComponent,
    PastaComponent,
    ChickenComponent,
    HalfNhalfComponent,
    SaladComponent,
    SideComponent,
    DrinksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxNumberSpinnerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
