import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  cartEmitter = new EventEmitter();
  cartTotalEmitter = new EventEmitter();
  cartShowEmmiter = new EventEmitter();
  showNavBarEmitter = new EventEmitter();
  menuEmitter = new EventEmitter();
  memberEmitter = new EventEmitter();
  clientEmitter = new EventEmitter();
  orderCompleteEmitter = new EventEmitter();
  showCartButtonEmitter = new EventEmitter();
  // theCart: any = [
  //   { detail: [{ title: "No Lettuce" }, { title: "No Tomatoes" }, { title: "Add Extra Cheese" }], title: "Turkey Sub", catagory: "SM Turkey Sub", cost: 8.9 },
  // ];
  theCart: any = [];
  theCartTotal: number = 0;
  theLocation = 'WEST';
  theMenu: any = [];
  modDataBase: any = [];
  buildPrices: any = [];
  showCart : boolean= false;

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
  isLoggedIn:boolean = false;
  backToCart : boolean = false;
  orderCompleted : boolean = false;
  adminName : string = 'WEST-ADMIN';
  showCartButton : boolean = false;

  sauceArray: any = [
    { "sauce": 'Regular' },
    { "sauce": 'No' },
    { "sauce": 'Garlic' },
    { "sauce": 'Pesto' },
  ];

  storeHours : any = [
    {"day":"0","title":"Sunday","hours":"3pm to 9pm"},
    {"day":"1","title":"Monday","hours":"11am to 9pm"},
    {"day":"2","title":"Tuesday","hours":"11am to 10pm"},
    {"day":"3","title":"Wednesday","hours":"11am to 10pm"},
    {"day":"4","title":"Thursday","hours":"11am to 10pm"},
    {"day":"5","title":"Friday","hours":"11am to 11pm"},
    {"day":"6","title":"Saturday","hours":"11am to 10pm"},
  ]

  locations = [
    {"location": 'West', "menuFilter" : "WEST", "phone":"613-828-2828"},
    {"location": 'East', "menuFilter" : "EAST", "phone":"613-739-7777"},
  ]

  cats : any = [
    {"title":"Pizza"},
    {"title":"Chicken"},
    {"title":"Sub"},
    {"title":"Pasta"},
    {"title":"Sandwich"},
    {"title":"Salad"},
    {"title":"Side"},
    {"title":"Drinks"},
  ]

  siteLinks : any = [
    {"title":"about us","dropDown":"No"},
    {"title":"menu","dropDown":"Yes"},
    {"title":"order online","dropDown":"No"},
  ]

  showHideCart(){
    this.showCart = !this.showCart;
    this.cartShowEmmiter.emit(this.showCart);
  }

  changeMember(boo:boolean){
    this.isMember = boo;
    this.memberEmitter.emit(boo);
  }


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
  client : any = [];
  isMember : boolean = false;

  constructor(private http: HttpClient, private router : Router) { }

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

//   addToCart(title: string, details: any) {
//     var addTo: number;
//     var wasTotal: number;
//     addTo = details[2];
//     wasTotal = this.theCartTotal;
//     var newTotal: number;
//     newTotal = parseFloat(wasTotal.toString()) + parseFloat(addTo.toString());
//     this.theCart.push(details);
//     this.theCartTotal = newTotal;
//     this.cartEmitter.emit(this.theCart);
//     this.cartTotalEmitter.emit(this.theCartTotal);
//     this.showCartButton = !this.showCartButton;
//     this.showCartButtonEmitter.emit(this.showCartButton);
//     console.log(this.showCartButton);
//   }

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
    this.showCartButton = true;
    this.showCartButtonEmitter.emit(this.showCartButton);
  }

  getAllMods() {
    this.http.get('https://www.beneci.com/DATA/getMods.php').subscribe(
      (response) => {
        this.allMods = Object.values(response);
      }
    )
  }

 printIt(cart:any,order:any,totals:any,client:any){
  let params = new HttpParams;
  params = params.append('data', JSON.stringify(cart));
  params = params.append('client', JSON.stringify(order));
  params = params.append('totals', JSON.stringify(totals));
  params = params.append('clientInfo', JSON.stringify(client));
  console.log(totals,cart,order);
  this.http.get('https://www.beneci.com/DATA/parse.php',{params : params})
  .subscribe(
    (response) => {
      var theResponse : any = Object.values(response);
      var didwork = theResponse[0].worked;
      if (didwork){
            this.theCart = [];
            this.theCartTotal = 0;
            this.cartTotalEmitter.emit(this.theCartTotal);
            this.cartEmitter.emit(this.theCart);
            this.showCartButton = false;
            this.showCartButtonEmitter.emit(this.showCartButton);
            this.showCart = false;
            this.cartShowEmmiter.emit(this.showCart);
            this.router.navigateByUrl('LOGIN');
      }
    }
  )
}



  fullDatabase: any = [];

  async getFullBase() {
    this.http.get('https://www.beneci.com/DATA/getFullMenu.php').subscribe(
      (response) => {
        this.fullDatabase = Object.values(response);
      }
    )
  }


}
