import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sandwich',
  templateUrl: './sandwich.component.html',
  styleUrls: ['./sandwich.component.css']
})
export class SandwichComponent implements OnInit {

  constructor(private global: DataService, private router: Router) { }

  localSandwichArray: any = [];
  detailArray: any = [];
  currentSandwich: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  currentSize: string = 'Small';
  currentMods: any = [];
  sandwichModArray: any = [];
  theCurrentID: number = -1;
  platter: string = 'No';
  extraPlatterArray: any = [];
  halfSize: boolean = false;

  gravyArray : any = [
    { "count": "1", "ID": "1", "title": "Gravy", "cost": "0", "choice": "3" },
  ]

  clubArray : any = [
    { "count": "1", "ID": "1", "title": "Tomato", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "2", "title": "chicken", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "3", "title": "lettuce", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "4", "title": "bacon", "cost": "0", "choice": "1" },
    { "count": "1", "ID": "5", "title": "mayo", "cost": "0", "choice": "1" },
  ]


  async ngOnInit() {
    this.theCurrentID = -1;
    this.platter = 'No';
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    if (this.global.sandwichArray.length === 0) {
      this.localSandwichArray = this.global.theMenu.filter((data: any) => data.category === 'Sandwich');
    }
    this.localSandwichArray.forEach((element: any, i: number) => {
      this.localSandwichArray[i].extraSauce = '';
      if (element.title === 'Hamburger Steak Platter') {
        this.localSandwichArray[i].extraSauce = '1';
        this.localSandwichArray[i].modHold = '102';
      }
      if (element.title === 'Club Sandwich Platter') {
        this.localSandwichArray[i].modHold = '100';
        this.localSandwichArray[i].extra = "1,2,3,4,5";
      }
    });
    this.detailArray.push("home");
    this.detailArray.push("sandwich");
    this.sandwichModArray = this.global.allMods.filter((data: any) => data.product === 'Sandwich');
    this.extraPlatterArray = this.global.extraPlaterItems;
  }

  resetItem(i: number) {
    this.platter = 'No';
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('SANDWICH');
        this.whatStep = 0;
        this.detailArray = [];
        this.ngOnInit();
        break;
      case 2:
        this.whatStep = 0;
        this.currentSandwich = [];
        this.detailArray.length = 2;
        break;
      case 3:
        this.whatStep = 1;
        this.detailArray.length = 3;
        break;
    }
  }

  sandwichDetail(i: number) {
    this.platter = 'No';
    this.currentSandwich = this.localSandwichArray[i];
    this.detailArray.push(this.localSandwichArray[i].title);
    this.platter = this.localSandwichArray[i].platter;
    this.itemCost = this.localSandwichArray[i].ONE;
    this.currentMods = this.localSandwichArray[i].modHold.split(",");
    this.whatStep = 1;
    this.theCurrentID = this.localSandwichArray[i].ID;
  }

  returnPrice(currentSandwich: any) {
    return this.currentSize === 'Small' ? currentSandwich.TWOSM : currentSandwich.TWOLG;
  }

  whatButtonColor(size: string) {
    return this.currentSize === size ? 'bg-primary' : 'bg-secondary';
  }

  sizeClick(inval: string, cost: number) {
    this.currentSize = inval;
    this.whatStep = 2;
    this.itemCost = cost;
    this.detailArray.push(inval);
  }

  modSelected(i: number) {
    var found = false;
    this.currentMods.forEach((element: any) => {
      if (parseFloat(i.toString()) === parseInt(element.toString())) {
        found = true;
      }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifyMods(i: string) {
    if ((i === '104') && (this.currentSandwich.title === 'Hamburger')) {
      this.currentSandwich = this.localSandwichArray[1];
      this.itemCost = this.currentSandwich.ONE;
      this.detailArray.length = 2;
      this.detailArray.push(this.currentSandwich.title);
    } else {
      if ((i === '104') && (this.currentSandwich.title === 'Cheese Burger')) {
        this.currentSandwich = this.localSandwichArray[0];
        this.itemCost = this.currentSandwich.ONE;
        this.detailArray.length = 2;
        this.detailArray.push(this.currentSandwich.title);
      }
    }
    var found: boolean = false;
    var foundAt: number = -1;
    var startNumber: any = parseFloat(this.itemCost.toString());
    this.currentMods.forEach((element: string, index: number) => {
      if (element === i) {
        found = true;
        foundAt = index;
      }
    });
    if (found) {
      this.currentMods.splice(foundAt, 1);
      if (i.toString() === '105') {
        startNumber -= parseFloat('1.25');
      }
    } else {
      this.currentMods.push(i);
      if (i.toString() === '105') {
        startNumber += parseFloat('1.25');
      }
    }
    this.itemCost = startNumber;


  }

  displayModData(inval: string) {
    if (inval === 'Extra Cheese') {
      return 'Extra Cheese + $1.25';
    } else {
      return inval;
    }
  }

  addToOrder() {
    var itemName = this.currentSize + ' ' + this.currentSandwich.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.currentMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

  extraSelected(ID: string) {
    var found = false;
    if (this.platter === 'Yes') {
      var temp = this.currentSandwich.platterSet.split(',');

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
      var temp: any = this.currentSandwich.platterSet.split(',');
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
      this.currentSandwich.platterSet = dataString;
      var fries = dataString.includes("1");
      var onion = dataString.includes("2");
      if ((fries) && (onion)) {
        this.halfSize = true;
      } else {
        this.halfSize = false;
      }
    }
  }

  checkIf(inval: string) {
    return this.currentSandwich.title === inval ? true : false;
  }

  ss(i: number) {
    var found: boolean = false;
    if (this.currentSandwich.title === 'Hamburger Steak Platter') {
      var specialExtra: any = this.currentSandwich.extraSauce.split(',');
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
    if (this.currentSandwich.title === 'Hamburger Steak Platter') {
      var specialExtra: any = this.currentSandwich.extraSauce.split(',');
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
      this.currentSandwich.extraSauce = theString;
    }
  }
  ssc(i: number) {
    var found: boolean = false;
    if (this.currentSandwich.title === 'Club Sandwich Platter') {
      var specialExtra: any = this.currentSandwich.extra.split(',');
      specialExtra.forEach((element: number) => {
        if (i.toString() === element.toString()) {
          found = true;
        }
      });
    }
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifySSc(i: number) { //ID
    var found: boolean = false;
    var foundAt = -1;
    if (this.currentSandwich.title === 'Club Sandwich Platter') {
      var specialExtra: any = this.currentSandwich.extra.split(',');
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
      this.currentSandwich.extra = theString;
    }
  }
}
