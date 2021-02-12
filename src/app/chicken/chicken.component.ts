import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chicken',
  templateUrl: './chicken.component.html',
  styleUrls: ['./chicken.component.css']
})
export class ChickenComponent implements OnInit {

  constructor(private global: DataService, private router: Router) { }

  localChickenArray: any = [];
  detailArray: any = [];
  currentChicken: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  currentSize: string = 'Small';
  chickenMods: any = [];
  chickenModArray: any = [];
  platter: string = 'No';
  extraPlatterArray: any = [];
  twoSize: boolean = false;
  halfSize: boolean = false;
  isWings: boolean = false;
  wingSauce: any = [
    { "ID": "1", "title": "Hot", "cost": "0" },
    { "ID": "2", "title": "Medium", "cost": "0" },
    { "ID": "3", "title": "mild", "cost": "0" },
    { "ID": "4", "title": "Honey Garlic", "cost": "0" },
  ];

  dipArray: any = [
    { "count": "1", "ID": "1", "title": "Garlic Sauce", "cost": "0", "choice": "3" },
    { "count": "1", "ID": "2", "title": "Sour Creme", "cost": "0", "choice": "3" },
  ]

  nuggetArray: any = [
    { "count": "1", "ID": "1", "title": "Garlic Sauce", "cost": "0", "choice": "3" },
    { "count": "1", "ID": "2", "title": "Plum Sauce", "cost": "0", "choice": "3" },
  ]

  async ngOnInit() {
    this.chickenMods = [];
    this.twoSize = false;
    this.halfSize = false;
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    if (this.global.chickenArray.length === 0) {
      this.localChickenArray = this.global.theMenu.filter((data: any) => data.category === 'Chicken');
    }
    this.localChickenArray.forEach((element: any, i: number) => {
      this.localChickenArray[i].extra = '';
      this.localChickenArray[i].extraSauce = '';
      if (element.title === 'Chicken Wings') {
        this.localChickenArray[i].extraSauce = '1,2';
      }
      if (element.title === 'Chicken Nuggets') {
        this.localChickenArray[i].extraSauce = '1,2';
      }
      if (element.title === 'Chicken Fingers') {
        this.localChickenArray[i].extraSauce = '1,2';
      }
    });
    this.detailArray.push("home");
    this.detailArray.push("chicken");
    this.currentChicken = [];
    this.extraPlatterArray = this.global.extraPlaterItems;
  }

  resetItem(i: number) {
    this.platter = 'No';
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('CHICKEN');
        this.whatStep = 0;
        this.detailArray = [];
        this.ngOnInit();
        break;
      case 2:
        this.whatStep = 0;
        this.currentChicken = [];
        this.detailArray.length = 2;
        break;
      case 3:
        this.whatStep = 1;
        this.detailArray.length = 3;
        break;
    }
  }

  whichPrice(i: number) {
    return this.localChickenArray[i].TWOSM > 0 ? true : false;
  }

  chickenDetail(i: number) {
    this.platter = 'No';
    this.isWings = false;
    this.currentChicken = this.localChickenArray[i];
    if (this.currentChicken.title === 'Chicken Wings') {
      this.isWings = true;
    }

    this.detailArray.push(this.localChickenArray[i].title);
    this.platter = this.localChickenArray[i].platter;
    this.chickenMods = this.localChickenArray[i].platterSet.split(",");
    if (this.localChickenArray[i].TWOSM > 0) {
      this.twoSize = true;
      this.itemCost = this.localChickenArray[i].TWOSM;
    } else {
      this.twoSize = false;
      this.itemCost = this.localChickenArray[i].ONE;
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
    var itemName = this.currentSize + ' ' + this.currentChicken.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.chickenMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

  extraSelected(ID: string) {
    var found = false;
    if (this.platter === 'Yes') {
      var temp = this.currentChicken.platterSet.split(',');

      temp.forEach((element: string) => {
        if (element === ID) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  extraWings(ID: string) {
    var found = false;
    if (this.isWings) {
      var temp = this.currentChicken.platterSet.split(',');
      temp.forEach((element: string) => {
        if (element === ID) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifyExtra(ID: string) {
    if (this.platter === 'Yes') {
      var temp: any = this.currentChicken.platterSet.split(',');
      var found = false;
      var foundAt = -1;
      var dataString = '';
      temp.forEach((element: string, index: number) => {
        if (ID === element) {
          found = true;
          foundAt = index;
        }
      });
      if (found) {
        temp.splice(foundAt, 1);
      } else {
        temp.push(ID);
      }
      temp.forEach((data: string) => {
        dataString += data + ',';
      });
      dataString = dataString.slice(0, -1);
      this.currentChicken.platterSet = dataString;
      var fries = dataString.includes("1");
      var onion = dataString.includes("2");
      if ((fries) && (onion)) {
        this.halfSize = true;
      } else {
        this.halfSize = false;
      }
    }
  }

  modifyWings(ID: string) {
    console.log(ID);
    console.log(this.isWings);
    if (this.isWings) {
      var temp: any = this.currentChicken.platterSet.split(',');
      var found = false;
      var foundAt = -1;
      var dataString = '';
      temp.forEach((element: string, index: number) => {
        if (ID === element) {
          found = true;
          foundAt = index;
        }
      });
      if (found) {
        temp.splice(foundAt, 1);
      } else {
        temp.push(ID);
      }
      temp.forEach((data: string) => {
        dataString += data + ',';
      });
      dataString = dataString.slice(0, -1);
      this.currentChicken.platterSet = dataString;
      if (this.currentChicken.platterSet.length > 2) {
        this.halfSize = true;
      } else {
        this.halfSize = false;
      }
    }
  }

  checkIf(inval: string) {
    return this.currentChicken.title === inval ? true : false;
  }

  ss(i: number) {
    var found: boolean = false;
    if (this.currentChicken.title === 'Chicken Wings') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
      specialExtra.forEach((element: number) => {
        console.log(element);
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
    if (this.currentChicken.title === 'Chicken Wings') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
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
      this.currentChicken.extraSauce = theString;
    }
  }

  ss1(i: number) {
    var found: boolean = false;
    if (this.currentChicken.title === 'Chicken Nuggets') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
      specialExtra.forEach((element: number) => {
        console.log(element);
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifySS1(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentChicken.title === 'Chicken Nuggets') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
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
      this.currentChicken.extraSauce = theString;
    }
  }

  ss2(i: number) {
    var found: boolean = false;
    if (this.currentChicken.title === 'Chicken Fingers') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
      specialExtra.forEach((element: number) => {
        console.log(element);
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifySS2(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentChicken.title === 'Chicken Fingers') {
      var specialExtra: any = this.currentChicken.extraSauce.split(',');
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
      this.currentChicken.extraSauce = theString;
    }
  }
}

