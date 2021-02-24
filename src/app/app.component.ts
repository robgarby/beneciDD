import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (private global:DataService, private router : Router) {}
  title = 'BeneciDD';

  dropShown = false;
  showLocation = '';
  cartTotal = 0;
  showCart : boolean = true;
  theCart : any = this.global.theCart;
  showNavBar : boolean = true;
  siteLink : any = this.global.siteLinks;

  ngOnInit(){
    this.showLocation = this.global.theLocation;
    this.global.cartEmitter.subscribe(
      (response:boolean) => {
        this.global.theCart = response;
      }
    )
    this.global.cartTotalEmitter.subscribe(
      (response:number) => {
        this.cartTotal = response;
      }
    )
    this.global.showNavBarEmitter.subscribe(
      (response:boolean) => {
        this.showNavBar = response;
      }
    )
    this.global.menuEmitter.subscribe(
      (response:boolean) => {
        this.global.theMenu = response;
      }
    )
    this.global.getAllMods();
    this.global.getFullBase();
    this.global.getMenu();
    this.showCart = this.global.showCart;
  }

  goToLink(link:string){
    this.router.navigateByUrl(link);
  }

  navigateClick(link:string){
    this.router.navigateByUrl('/');
  }
  showCartFunction(){
    this.global.showHideCart();
  }

  setLocation(inval:string){
    this.showLocation = inval + ' Location';
    this.global.changeLocation(inval);
    this.dropShown = !this.dropShown;
    this.router.navigateByUrl('MENU');

  }
}
