import { Injectable,EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService{

  cartEmitter = new EventEmitter();
  cartTotalEmitter = new EventEmitter();
  menuEmitter = new EventEmitter();
  theCart : any = [];
  theCartTotal : number = 0;
  theLocation = 'select location';
  theMenu : any = [];
  modDataBase : any = [];
  buildPrices : any = [];

  // build pizza data
  currentSize : string = '';
  currentSauce : string = '';
  currentCrust : string = '';
  modData : any = [];
  dataImported : boolean = false;

  sauceArray : any = [
    {"sauce":'Regular'},
    {"sauce":'No'},
    {"sauce":'Garlic'}
  ];

  constructor(private http:HttpClient) { }

  changeCart(inval:any){
    this.theCart = inval;
    this.cartEmitter.emit(this.theCart);
  }

  changeLocation(inval:any){
    this.theLocation = inval;
    this.getMenu();
  };

  async getMenu(){
     await this.http.get('https://www.beneci.com/DATA/getMenu.php').subscribe(
      (response) => {
        this.theMenu = Object.values(response);
        this.menuEmitter.emit(Object.values(response));
      }
    )
  }

  addToCart(title:string,details:any){
    this.currentSauce = '';
    this.modDataBase = '';
    this.currentCrust = '';
    this.currentSize = 'Small';
    this.modData = [];
    this.theCart.push(details);
    this.theCartTotal = this.theCartTotal + details[2];
    this.cartEmitter.emit(this.theCart);
    this.cartTotalEmitter.emit(this.theCartTotal);

  }
}
