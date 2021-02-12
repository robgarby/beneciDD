import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.css']
})
export class DrinksComponent implements OnInit {

  constructor(private router : Router, private global :DataService) { }

  localDrinkArray: any = [
    {"ID":"1","title": 'Diet Coke', "cost":"1.25", "count": 0},
    {"ID":"2","title": 'Diet Pepsi', "cost":"1.25", "count": 0},
    {"ID":"3","title": 'Coke Zero', "cost":"1.25", "count": 0},
    {"ID":"4","title": 'Coke', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Pepsi', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Sprite', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Ginger Ale', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Dr. Pepper', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Iced Tea', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Cream Soda', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Grape', "cost":"1.25", "count": 0},
    {"ID":"5","title": 'Root Beer', "cost":"1.25", "count": 0},
    {"ID":"6","title": 'Bottled Water', "cost":"1.25", "count": 0},
  ];
  detailArray: any = [];
  showDescription : boolean = false;
  currentDrink : any = [];
  currentSelected : number = 0;
  mask : boolean = false;
  indiPrice : number = 0;
  drinksTotal : number = 0;

  ngOnInit(): void {
    this.detailArray.push('HOME');
    this.detailArray.push('Drinks');
    this.currentDrink = this.localDrinkArray[this.currentSelected];  
    this.drinksTotal = 0;
    this.calculateDrinks();
  }

  showCount(count:number){
    return count > 0 ? count: '';
  }

  resetItem(i: number) {
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('DRINK');
        this.detailArray = [];
        this.ngOnInit();
        break;
    }
  }

  isSelected(i:number){
    var found = false;
    if (this.localDrinkArray[i].count > 0){
            found = true;
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }


  calcPrice(i:number){
    var returnCost = this.localDrinkArray[i].cost * this.localDrinkArray[i].count;
    return returnCost;
  }

  saveDrink(){
      this.localDrinkArray[this.currentSelected].count = this.currentDrink.count;
      this.calculateDrinks();
      this.showDescription = !this.showDescription;
      this.mask = !this.mask;
  }

  changeCount(inval:number){
    var value = 0;
    value = this.currentDrink.cost * inval;
    this.currentDrink.count = inval;
    this.indiPrice = value;
  }

  calculateDrinks(){
    var drinkTotal : number = 0;
    this.localDrinkArray.forEach((element:any) => {
        drinkTotal += (element.count * element.cost);
    });
    console.log(drinkTotal);
    this.drinksTotal = drinkTotal;
  }

  selectDrink(i:number){
    this.currentDrink = this.localDrinkArray[i];
    this.mask = !this.mask;
    this.showDescription = !this.showDescription;
    this.indiPrice = this.currentDrink.count * this.currentDrink.cost;
    this.currentSelected = i;

  }

  getCount(){
    return this.currentDrink.count;
  }

  addToOrder() {
    var itemName = 'Drinks';
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.drinksTotal);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

}
