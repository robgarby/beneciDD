import { Injectable,EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit{

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
  currentSize : string = 'Medium';
  currentSauce : string = 'Regular';
  currentCrust : string = 'Gluten';
  modData : any = ["110",'101','113',"120",'100','115','110'];

  constructor(private http:HttpClient) { }

  ngOnInit(){

  }

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
    this.theCart.push(details);
    this.theCartTotal = this.theCartTotal + details[2];
    this.cartEmitter.emit(this.theCart);
    this.cartTotalEmitter.emit(this.theCartTotal);

  }
}
