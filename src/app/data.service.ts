import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  cartEmitter = new EventEmitter();
  cartTotalEmitter = new EventEmitter();
  menuEmitter = new EventEmitter();
  // theCart: any = [
  //   { detail: [{ title: "No Lettuce" }, { title: "No Tomatoes" }, { title: "Add Extra Cheese" }], title: "Turkey Sub", catagory: "SM Turkey Sub", cost: 8.9 },
  // ];
  theCart: any = [];
  theCartTotal: number = 0;
  theLocation = 'select location';
  theMenu: any = [];
  modDataBase: any = [];
  buildPrices: any = [];

  // build pizza data
  halfOne: any = [];
  halfTwo: any = [];
  currentSize: string = '';
  currentSauce: string = '';
  currentCrust: string = '';
  modData: any = [];
  dataImported: boolean = false;
  premiumPrices: any = { "SM": "2.5", "MD": "3.6", "LG": "4.45", "XL": "5" };
  glutenPrices: any = { "SM": "2.95", "MD": "3.95", "LG": "0", "XL": "0" };
  allMods: any = [];


  sauceArray: any = [
    { "sauce": 'Regular' },
    { "sauce": 'No' },
    { "sauce": 'Garlic' },
    { "sauce": 'Pesto' },
  ];

  crustArray: any = [
    { "cost":"0","crust": 'Regular' },
    { "cost":"0","crust": 'Thin' },
    { "cost":"0","crust": 'Thick' },
    { "cost":"0","crust": 'Gluten Free' },
  ];

  extraPlaterItems: any = [
    { "ID": "1", "product": "Fries", "Cost": "0" },
    { "ID": "2", "product": "Onion Rings", "Cost": "0" },
    { "ID": "3", "product": "Coleslaw", "Cost": "0" },
  ];

  pizzaMods : any = [
    {"ID":"1","title":"pepperoni","type":"regular"},
    {"ID":"2","title":"ham","type":"regular"},
    {"ID":"3","title":"bacon","type":"regular"},
    {"ID":"4","title":"minced beef","type":"regular"},
    {"ID":"5","title":"salami","type":"regular"},
    {"ID":"7","title":"green olives","type":"regular"},
    {"ID":"8","title":"black olives","type":"regular"},
    {"ID":"9","title":"onions","type":"regular"},
    {"ID":"10","title":"green pepper","type":"regular"},
    {"ID":"11","title":"hot peppers","type":"regular"},
    {"ID":"12","title":"mushrooms","type":"regular"},
    {"ID":"13","title":"tomatoes","type":"regular"},
    {"ID":"14","title":"pineapple","type":"premium"},
    {"ID":"15","title":"anchovies","type":"regular"},
    {"ID":"16","title":"sliced steak","type":"premium"},
    {"ID":"17","title":"chicken","type":"premium"},
    {"ID":"18","title":"Feta Cheese","type":"premium"},
    {"ID":"19","title":"italian sausage","type":"premium"},
    {"ID":"20","title":"Extra Cheese","type":"premium"},
  ]

  
  subArray: any = [];
  sandwichArray: any = [];
  saladArray: any = [];
  sideArray: any = [];
  chickenArray: any = [];

  constructor(private http: HttpClient) { }

  changeCart(inval: any) {
    this.theCart = inval;
    this.cartEmitter.emit(this.theCart);
  }

  changeLocation(inval: any) {
    this.theLocation = inval;
    this.getMenu();
  };

  async getMenu() {
    await this.http.get('https://www.beneci.com/DATA/getMenu.php').subscribe(
      (response) => {
        this.theMenu = Object.values(response);
        this.menuEmitter.emit(Object.values(response));
      }
    )
  }

  addToCart(title: string, details: any) {
    var addTo: number;
    var wasTotal: number;
    addTo = details[2];
    wasTotal = this.theCartTotal;
    var newTotal: number;
    newTotal = parseFloat(wasTotal.toString()) + parseFloat(addTo.toString());
    this.theCart.push(details);
    this.theCartTotal = newTotal;
    this.cartEmitter.emit(this.theCart);
    this.cartTotalEmitter.emit(this.theCartTotal);
  }

  addToCartPrint(title: string, details: any, catagory: string, cost: number) {
    var addTo: number;
    var wasTotal: number;
    var theObject: any = {};
    addTo = cost;
    wasTotal = this.theCartTotal;
    var newTotal: number;
    newTotal = parseFloat(wasTotal.toString()) + parseFloat(addTo.toString());

    theObject.detail = details;
    theObject.title = title;
    theObject.catagory = catagory;
    theObject.cost = cost;
    this.theCart.push(theObject);
    this.theCartTotal = newTotal;
    this.cartEmitter.emit(this.theCart);
    this.cartTotalEmitter.emit(this.theCartTotal);
  }

  getAllMods() {
    this.http.get('https://www.beneci.com/DATA/getMods.php').subscribe(
      (response) => {
        this.allMods = Object.values(response);
      }
    )
  }

 printIt(cart:any){
  let params = new HttpParams;
  params = params.append('data', JSON.stringify(cart));
  console.log(params);
  this.http.get('https://www.beneci.com/DATA/parse.php',{params : params})
  .subscribe(
    (response) => {
      console.log(response);
    }
  )
}

  fullDatabase: any = [];

  async getFullBase() {
    this.http.get('https://www.beneci.com/DATA/getFullMenu.php').subscribe(
      (response) => {
        this.fullDatabase = Object.values(response);
        console.log(this.fullDatabase);
      }
    )
  }
}
