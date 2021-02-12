import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-salad',
  templateUrl: './salad.component.html',
  styleUrls: ['./salad.component.css']
})
export class SaladComponent implements OnInit {

  constructor(private global :DataService, private router : Router) { }

  localSaladArray: any = [];
  detailArray: any = [];
  currentSalad: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  currentSize: string = 'Small';
  saladMods: any = [];
  saladModArray: any = [];
  platter: string = 'No';
  extraPlatterArray: any = [];
  twoSize: boolean = false;

  pastaExtra : any = [
    {"ID":"1","title": "Meatballs", "cost":"2.45", "visible": "1"},
    {"ID":"2","title": "Italian Sausage", "cost":"2.45", "visible": "1"},
    {"ID":"3","title": "Green Peppers", "cost":"1.45", "visible": "1"},
    {"ID":"4","title": "Mushrooms", "cost":"1.45", "visible": "1"},
    {"ID":"5","title": "Green Olives", "cost":"1.45", "visible": "1"},
    {"ID":"6","title": "Black Olives", "cost":"1.45", "visible": "1"},
    {"ID":"7","title": "Pepperoni", "cost":"1.45", "visible": "1"},
  ]


  async ngOnInit() {
    this.saladMods = [];
    this.platter = 'No';
    this.twoSize = false;
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    if (this.global.saladArray.length === 0) {
      this.localSaladArray = this.global.theMenu.filter((data: any) => data.category === 'Salad');
    }
    this.detailArray.push("home");
    this.detailArray.push("SALAD");
    this.currentSalad = [];
    this.saladModArray = this.global.allMods.filter((data: any) => data.product === 'Pasta');
    this.extraPlatterArray = this.global.extraPlaterItems;
  }

  resetItem(i: number) {
    this.platter = 'No';
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('SALAD');
        this.whatStep = 0;
        this.detailArray = [];
        this.ngOnInit();
        break;
      case 2:
        this.whatStep = 0;
        this.currentSalad = [];
        this.detailArray.length = 2;
        break;
      case 3:
        this.whatStep = 1;
        this.detailArray.length = 3;
        break;
    }
  }

  whichPrice(i:number){
    return this.localSaladArray[i].TWOSM > 0 ? true : false;
  }

  saladDetail(i: number) {
    this.platter = 'No';
    this.currentSalad = this.localSaladArray[i];
    this.detailArray.push(this.localSaladArray[i].title);
    this.platter = this.localSaladArray[i].platter;
    this.saladMods = this.localSaladArray[i].platterSet.split(",");
    if (this.localSaladArray[i].TWOSM > 0){
      this.twoSize = true;
      this.itemCost = this.localSaladArray[i].TWOSM;
    } else {
      this.twoSize = false;
      this.itemCost = this.localSaladArray[i].ONE;
    }
    this.whatStep = 1;
  }

  whatButtonColor(inval:string){
    return inval === this.currentSize ? 'bg-primary' : 'bg-secondary';
  }

  sizeClick(size:string,cost:number){
      this.currentSize = size;
      this.itemCost = cost;
  }

  addToOrder() {
    var itemName = this.currentSize + ' ' + this.currentSalad.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.saladMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

}
