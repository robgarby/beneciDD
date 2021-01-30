import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

const appRoutes : Routes = [
  {path: 'START', component: StartComponent},
  {path: 'MENU', component: MenuComponent},
  {path: 'CART', component: CartComponent},
  {path: 'PIZZA', component: PizzaComponent},
  {path: 'BUILD', component: BuildComponent},
  {path: '**', component: StartComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    MenuComponent,
    CartComponent,
    PizzaComponent,
    BuildComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
