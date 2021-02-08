import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {

  constructor(private global: DataService, private router : Router, private http:HttpClient) { }

  pizza: any = [];
  detailArray: any = [];
  itemCost: number = 0;
  currentPizza: any = [];
  currentSize: string = 'Small';
  currentCrust : string = '';
  currentSauce : string = '';
  priceArray: any = [];
  whatStep: number = -1;
  crustArray: any = [];
  modOut :any = [];
  buildPrice : any = [];
  sauceArray : any = [];

  async ngOnInit() {
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    } 
    this.sauceArray = this.global.sauceArray;
    var temp = this.global.theMenu;
    this.pizza = temp.filter((data: any) => data.category === 'Pizza');
    if (this.global.buildPrices.length === 0) {
        this.getPrice();
    }
  }

  async getPrice(){
    await this.http.get('https://www.beneci.com/DATA/getBuild.php').subscribe(
      (response) => {
       this.global.buildPrices = Object.values(response);
       return this.global.buildPrices;
      }
    )
  }

  buildIt(){
    this.global.currentCrust = this.currentCrust;
    this.global.currentSauce = this.currentSauce;
    this.global.currentSize = this.currentSize;
    this.global.modData = this.currentPizza.modHold.split(',');
    this.router.navigateByUrl('BUILD');
  }

  halfNhalf(){
    this.global.currentCrust = '';
    this.global.currentSauce = '';
    this.global.currentSize = 'Small';
    this.global.modData = [];
    this.router.navigateByUrl('HALF');
  }

  clickPizza(title: string, index: number) {
    this.detailArray.push(title);
    this.currentPizza = this.pizza[index];
    this.whatStep = 1;
    switch (this.currentPizza.priceSystem) {
      case '4':
        this.priceArray.push(this.currentPizza.PSM);
        this.priceArray.push(this.currentPizza.PMD);
        this.priceArray.push(this.currentPizza.PLG);
        this.priceArray.push(this.currentPizza.PXL);
        break;
    }
  }

  setSize(index: number) {
    switch (index) {
      case 0: return 'Small'; break;
      case 1: return 'Medium'; break;
      case 2: return 'Large'; break;
      case 3: return 'X-Large'; break;
      default : return 'None'; break;
    }
  }

  clickSize(index: number) {
    this.itemCost = this.priceArray[index];
    switch (index) {
      case 0: this.detailArray.push('Small'); this.currentSize = 'Small'; break;
      case 1: this.detailArray.push('Medium'); this.currentSize = 'Medium'; break;
      case 2: this.detailArray.push('Large'); this.currentSize = 'Large'; break;
      case 3: this.detailArray.push('X-Large'); this.currentSize = 'X-Large'; break;
    }
    this.whatStep = 2;
    this.showCrusts();
  }

  showCrusts() {
    if (this.currentSize === 'Small') {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" },
        { "crust": "Gluten Free", "cost": "2.95" },
      ]
    }
    if (this.currentSize === 'Medium') {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" },
        { "crust": "Gluten Free", "cost": "3.95" },
      ]
    }
    if ((this.currentSize === 'Large') || (this.currentSize === 'X-Large')) {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" }
      ]
    }
  }

  displayCost(inval:number){
    if (inval.toString() === '0'){
      return '';
    } else {
      return 'Add $'+parseFloat(inval.toString());
    }
   
  }

  clickCrust(index: number) {
    var item : number = parseFloat(this.itemCost.toString());
    var theCost :number = parseFloat(this.crustArray[index].cost);
    var newTotal : number = parseFloat(this.itemCost.toString()) + theCost;
    this.itemCost = newTotal;
    this.detailArray.push(this.crustArray[index].crust + ' Crust');
    this.currentCrust = this.crustArray[index].crust;
    this.whatStep = 3;
    this.currentSauce = '';
  }

  clickSauce(index: number) {
    this.detailArray.push(this.sauceArray[index].sauce + ' Sauce');
    this.currentSauce = this.sauceArray[index].sauce;
    if (this.currentSauce !== 'Garlic'){
      this.whatStep = 4;
    }
  }

  yesGarlicSauce() {
    this.currentSauce = 'Garlic';
    this.whatStep = 4;
  }

  noGarlicSauce() {
    this.detailArray.pop();
    this.currentSauce = '';
    this.whatStep = 3;

  }

  resetItem(inval:number){
    console.log(inval);
    if (inval === 0){
      this.currentPizza = [];
      this.crustArray = [];
      this.currentSize = '';
      this.itemCost = 0;
      this.priceArray = [];
      this.whatStep = -1;
      this.currentCrust = '';
      this.currentSauce = '';
    }
    if (inval === 3){
      this.currentSauce = '';
    }
    this.detailArray.splice(inval);
    this.whatStep = inval;
  }

  addToCart(){
    var itemName = this.currentSize + ' '+this.currentPizza.title;
    var extraDetail : any = [];
    extraDetail.push(itemName);
    extraDetail.push('Pizza');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.currentSauce);
    extraDetail.push(this.currentCrust);
    extraDetail.push(this.currentPizza.modHold);
    this.global.addToCart(itemName,extraDetail);
    this.router.navigateByUrl('MENU');
  }

  goHome(){
    this.router.navigateByUrl('MENU');
  }

  buildYourOwn(){
    this.router.navigateByUrl('BUILD');
  }

}
