import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {

  constructor(private global: DataService, private router: Router) { }

  localSideArray: any = [];
  detailArray: any = [];
  currentSide: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  currentSize: string = 'Small';
  sideMods: any = [];
  sideModArray: any = [];
  platter: string = 'No';
  extraPlatterArray: any = [];
  twoSize: boolean = false;

  async ngOnInit() {
    this.sideMods = [];
    this.twoSize = false;
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    this.localSideArray = this.global.theMenu.filter((data: any) => data.category === 'Side');
    this.localSideArray.forEach((element: any, i: number) => {
      this.localSideArray[i].extra = '';
      this.localSideArray[i].extraSauce = '';
      if (element.title === 'Super Snack') {
        this.localSideArray[i].extra = '1,2,3,4,5';
        this.localSideArray[i].extraSauce = '1,2,3';
      }
      if (element.title === 'Zucchini') {
        this.localSideArray[i].extraSauce = '1,2,3';
      }
    });
    this.detailArray.push("home");
    this.detailArray.push("side");
    this.currentSide = this.localSideArray[0];
    this.extraPlatterArray = this.global.extraPlaterItems;
  }

  resetItem(i: number) {
    this.platter = 'No';
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('SIDE');
        this.whatStep = 0;
        this.detailArray = [];
        this.ngOnInit();
        break;
      case 2:
        this.whatStep = 0;
        this.currentSide = [];
        this.detailArray.length = 2;
        break;
      case 3:
        this.whatStep = 1;
        this.detailArray.length = 3;
        break;
    }
  }

  whichPrice(i: number) {
    return this.localSideArray[i].TWOSM > 0 ? true : false;
  }

  sideDetail(i: number) {
    this.platter = 'No';
    this.currentSide = this.localSideArray[i];
    this.detailArray.push(this.localSideArray[i].title);
    this.platter = this.localSideArray[i].platter;
    this.sideMods = this.localSideArray[i].platterSet.split(",");
    if (this.localSideArray[i].TWOSM > 0) {
      this.twoSize = true;
      this.itemCost = this.localSideArray[i].TWOSM;
    } else {
      this.twoSize = false;
      this.itemCost = this.localSideArray[i].ONE;
    }
    this.whatStep = 1;
  }

  whatButtonColor(inval: string) {
    return inval === this.currentSize ? 'bg-primary' : 'bg-secondary';
  }

  sizeClick(size: string, cost: number) {
    this.currentSize = size;
    this.itemCost = cost;
  }

  addToOrder() {
    var itemName = this.currentSize + ' ' + this.currentSide.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.sideMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

  superSnackArray: any = [
    { "count": "1", "ID": "1", "title": "Zucchini", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "2", "title": "Onion Rings", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "3", "title": "Chicken Nuggets", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "4", "title": "Chicken Wings", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "5", "title": "Fries", "cost": "0", "choice": "1" },
  ]

  superSnackSauceArray: any = [
    { "count": "1", "ID": "1", "title": "Garlic Sauce", "cost": "0", "choice": "3" },
    { "count": "1", "ID": "2", "title": "Plum Sauce", "cost": "0", "choice": "3" },
    { "count": "1", "ID": "3", "title": "Hot Sauce", "cost": "0", "choice": "3" },
  ]

  zuchArray : any = [
    { "count": "1", "ID": "1", "title": "Garlic Sauce", "cost": "0", "choice": "3" },
    { "count": "1", "ID": "2", "title": "Sour Creme", "cost": "0", "choice": "3" },
  ]

  ss(i: number) {
    var found: boolean = false;
    if (this.currentSide.title === 'Super Snack') {
      var specialExtra: any = this.currentSide.extra.split(',');
      specialExtra.forEach((element: number) => {
        console.log(element);
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  ss1(i: number) {
    var found: boolean = false;
    if (this.currentSide.title === 'Super Snack') {
      var specialExtra: any = this.currentSide.extraSauce.split(',');
      specialExtra.forEach((element: number) => {
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  ssz(i: number) {
    var found: boolean = false;
    if (this.currentSide.title === 'Zucchini') {
      var specialExtra: any = this.currentSide.extraSauce.split(',');
      specialExtra.forEach((element: number) => {
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifySS(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentSide.title === 'Super Snack') {
      var specialExtra: any = this.currentSide.extra.split(',');
      specialExtra.forEach((element: number,id:number) => {
        if (i.toString() === element.toString()) {
          found = true;
          foundAt = id;
        }
      });
      if (found){
        specialExtra.splice(foundAt,1);
      } else {
        specialExtra.push(i);
      }
      var theString = '';
      specialExtra.forEach((n:number) => {
          theString += n+',';
      });
      theString = theString.slice(0,-1);
      this.currentSide.extra = theString;
    }
  }

  modifySS1(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentSide.title === 'Super Snack') {
      var specialExtra: any = this.currentSide.extraSauce.split(',');
      specialExtra.forEach((element: number,id:number) => {
        if (i.toString() === element.toString()) {
          found = true;
          foundAt = id;
        }
      });
      if (found){
        specialExtra.splice(foundAt,1);
      } else {
        specialExtra.push(i);
      }
      var theString = '';
      specialExtra.forEach((n:number) => {
          theString += n+',';
      });
      theString = theString.slice(0,-1);
      this.currentSide.extraSauce = theString;
    }
  }

  modifySSz(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentSide.title === 'Zucchini') {
      var specialExtra: any = this.currentSide.extraSauce.split(',');
      specialExtra.forEach((element: number,id:number) => {
        if (i.toString() === element.toString()) {
          found = true;
          foundAt = id;
        }
      });
      if (found){
        specialExtra.splice(foundAt,1);
      } else {
        specialExtra.push(i);
      }
      var theString = '';
      specialExtra.forEach((n:number) => {
          theString += n+',';
      });
      theString = theString.slice(0,-1);
      this.currentSide.extraSauce = theString;
    }
  }

  checkIf(inval: string) {
    return this.currentSide.title === inval ? true : false;
  }

}
