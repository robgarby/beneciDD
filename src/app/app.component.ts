import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (private global:DataService, private router : Router, private cookie : CookieService) {}
  title = 'BeneciDD';

  dropShown = false;
  showLocation = '';
  cartTotal = 0;
  showCart : boolean = false;
  theCart : any = this.global.theCart;
  showNavBar : boolean = true;
  siteLink : any = this.global.siteLinks;
  hideMenu : boolean = true;
  theDetails : any = [];
  isUp : number = -1;
  isMember : boolean = false;

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
    this.global.cartShowEmmiter.subscribe(
      (response:boolean) => {
        this.showCart= response;
      }
    )
    this.global.memberEmitter.subscribe(
      (response:boolean) => {
        this.isMember = response;
      }
    )
    if (this.cookie.get('client').length !== 0){
      this.global.client = JSON.parse(this.cookie.get('client'));
      this.global.memberEmitter.emit(true);
      this.isMember = true;
      this.global.isMember = true;
    } else {
      this.global.memberEmitter.emit(false);
      this.isMember = false;
      this.global.isMember = false;
    }
    console.log(this.global.client);
    this.global.getAllMods();
    this.global.getFullBase();
    this.global.getMenu();
    this.showCart = this.global.showCart;
  }

  goToLink(link:string){
    this.router.navigateByUrl(link);
  }

  goToLinkBurger(link:string){
    this.hideMenu = !this.hideMenu;
    this.router.navigateByUrl(link);
  }

  navigateClick(link:string){
    this.router.navigateByUrl('/');
  }
  showCartFunction(){
    this.global.showHideCart();
  }

  showMenu(){
      this.hideMenu = !this.hideMenu;
  }

  showMenuClicked(){
    return !this.hideMenu ? 'text-warning' : 'text-white';
  }

  calcTotal(){
    var total : number = 0;
    this.theCart.forEach((element:any) => {
        total += parseFloat(element.cost.toString());
    });
    return total;
  }

  navToLogIn(){
    this.router.navigateByUrl('LOGIN');
  }
  
  calcTax(){
    var total : number = 0;
    this.theCart.forEach((element:any) => {
        total += parseFloat(element.cost.toString());
    });
    if (total > 3.99){
      return total *.13;
    } else {
      return total *.05;
    }
  }
  
  checkSpecial(inval:string){
    if (inval === 'SIDE ONE ITEMS'){
      return '<---SIDE ONE ITEMS--->';
    }
    if (inval === 'SIDE TWO ITEMS'){
      return '<---SIDE TWO ITEMS--->';
    }
    return inval;
  }
  
  removeItem(i:number){
    this.theCart.splice(i,1);
    this.global.theCartTotal = this.theCart;
  }
  
  calcGrandTotal(){
    var total : number = 0;
    this.theCart.forEach((element:any) => {
        total += parseFloat(element.cost.toString());
    });
    if (total > 3.99){
      return total *1.13;
    } else {
      return total *1.05;
    }
  }
  
  whatItem : number = -1;
  
  inspectItem(i:number){
    this.theDetails = this.theCart[i].detail;
    if (this.whatItem === i){
      this.whatItem = -1;
    } else {
      this.whatItem = i;
    }
    
  }
  
  checkExtra(i:number){
    return this.theCart[i].length === 0 ? true : false;
  }
  
  printIt(){
    this.global.printIt(this.theCart);
  }

  isLoggedIn : boolean = this.global.isLoggedIn;

  checkColorLogin(){
    return this.isMember ? 'bg-success' : 'bg-danger';
  }

}
