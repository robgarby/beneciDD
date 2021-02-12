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
  halfOne : any = [];
  halfTwo : any = [];
  currentSize : string = '';
  currentSauce : string = '';
  currentCrust : string = '';
  modData : any = [];
  dataImported : boolean = false;
  premiumPrices : any =  { "SM": "2.5", "MD": "3.6", "LG": "4.45", "XL": "5" };
  glutenPrices : any =   { "SM": "2.95", "MD": "3.95", "LG": "0", "XL": "0" };
  allMods : any = [];


  sauceArray : any = [
    {"sauce":'Regular'},
    {"sauce":'No'},
    {"sauce":'Garlic'},
    {"sauce":'Pesto'},

  ];

  extraPlaterItems : any = [
    {"ID" : "1", "product": "Fries", "Cost": "0"},
    {"ID" : "2", "product": "Onion Rings", "Cost": "0"},
    {"ID" : "3", "product": "Coleslaw", "Cost": "0"},
  ];

  subArray : any = [];
  sandwichArray : any = [];
  saladArray : any = [];
  sideArray : any = [];
  chickenArray : any = [];

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
    var addTo : number;
    var wasTotal : number;
    addTo = details[2];
    wasTotal = this.theCartTotal;
    var newTotal : number;
    newTotal = parseFloat(wasTotal.toString()) + parseFloat(addTo.toString());
    this.currentSauce = '';
    this.modDataBase = '';
    this.currentCrust = '';
    this.currentSize = 'Small';
    this.modData = [];
    this.theCart.push(details);
    this.theCartTotal = newTotal;
    this.cartEmitter.emit(this.theCart);
    this.cartTotalEmitter.emit(this.theCartTotal);

  }

  async getAllMods() {
    await this.http.get('https://www.beneci.com/DATA/getMods.php').subscribe(
      (response) => {
        this.allMods = Object.values(response);
      }
    )
  }
}
