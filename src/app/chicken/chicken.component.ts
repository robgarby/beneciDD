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

  currentItem: any = [];
  currentItemArray: any = [];
  currentCat: string = 'Chicken';
  currentLink : string = 'CHICKEN';
  currentSize: string = '-';
  itemDescription: string = '';
  detailArray: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  holdBaseCost: number = 0;
  currentTitle: string = '';

  noCostItems: any = [];
  costItems: any = [];
  extraCostItems: any = [];
  itemsPicked: any = [];
  modArray: any = [];
  priceSystem: number = -1;
  isPlatter: boolean = false;
  platterItems: any = [];
  platterSelected: any = [];
  hasSauce: boolean = false;
  sauceItems: any = [];
  sauceSelected: any = [];
  checkOut: boolean = false;
  isWarningBox : boolean = false;
  mask:boolean= false;
  isLastItemBox : boolean = false;




  async ngOnInit() {
    // if (this.global.theLocation === 'select location') {
    //   this.router.navigateByUrl('START');
    //   return;
    // }
    this.currentItemArray = this.global.fullDatabase.filter((data: any) => data.catagory === this.currentCat);
    this.detailArray = [];
    this.whatStep = 0;
    this.detailArray.push("home");
    this.detailArray.push(this.currentCat);
  }

  checkPriceSystem(currentItem: any) {
    return currentItem.priceSystem === '2' ? true : false;
  }

  setItem(currentItem: any) {
    this.modArray = [];
    this.checkOut = false;
    this.detailArray.length = 2;
    this.currentItem = currentItem;
    this.detailArray.push(currentItem.title);
    this.currentTitle = currentItem.title;
    this.currentSize = '-';
    this.itemsPicked = currentItem.itemsPicked.split(',');
    this.noCostItems = currentItem.noCostItems.split(',');
    this.costItems = currentItem.costItems.split(',');
    this.isPlatter = false;
    this.hasSauce = false;
    if (currentItem.hasSauce === 'Yes') {
      this.hasSauce = true;
      this.sauceItems = currentItem.sauceItems.split(',');
      this.sauceSelected = currentItem.sauceSelected.split(',');
    }
    if (currentItem.isPlatter === 'Yes') {
      this.isPlatter = true;
      this.platterItems = currentItem.platterItems.split(',');
      this.platterSelected = currentItem.platterSelected.split(',');
    }
    var pushObject: any = {};
    this.noCostItems.forEach((name: string) => {
      pushObject = {};
      pushObject.title = name;
      pushObject.cost = 0;
      pushObject.count = 1;
      this.modArray.push(pushObject);
    });
    var tempArray: any = [];
    if (this.costItems[0] !== "") {
      this.costItems.forEach((element: string) => {
        tempArray = [];
        tempArray = element.split(':');
        pushObject = {};
        pushObject.title = tempArray[0];
        pushObject.cost = tempArray[1];
        pushObject.count = 0;
        this.extraCostItems.push(pushObject);
        this.modArray.push(pushObject);
      });
    }
    if (currentItem.priceSystem === '2') {
      this.whatStep = 1;
      this.itemCost = this.calcCost(currentItem, this.currentSize);
    } else {
      this.whatStep = 2;
      this.currentSize = '-';
      this.itemCost = this.calcCost(currentItem, 'ONE');
      this.holdBaseCost = this.calcCost(currentItem, 'ONE');
      console.log(this.hasSauce,this.isPlatter);
      if ((!this.hasSauce) && (!this.isPlatter)){
        this.checkOut = true;
      }
    }
  }


  calcCost(inItem: any, size: string) {
    var returnCost: number = 0;
    switch (size) {
      case 'Small': returnCost = inItem.SM2; break;
      case 'Large': returnCost = inItem.LG2; break;
      case 'ONE': returnCost = inItem.ONE; break;
      default: returnCost = 0; break;
    }
    return returnCost;
  }

  buildDescription(inArray: any) {
    var theDescription: string = '';
    this.itemsPicked.forEach((name: string) => {
      theDescription += name + ', ';
    });
    theDescription = theDescription.slice(0, -2);
    return theDescription;
  }

  resetItem(i: number) {
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1: this.router.navigateByUrl(this.currentLink); this.ngOnInit(); break;
      case 2: this.router.navigateByUrl(this.currentLink); this.ngOnInit(); break;
      case 3: this.detailArray.length = 3; this.whatStep = 1; this.currentTitle = this.currentItem.title; this.itemCost = 0; this.currentSize = '-'; break;
    }
  }
  whatButtonColor(size: string) {
    return this.currentSize === size ? 'bg-primary' : 'bg-secondary';
  }

  setSize(inval: string, cost: number) {
    this.currentSize = inval;
    this.whatStep = 2;
    this.itemCost = cost;
    this.holdBaseCost = cost;
    this.detailArray.push(inval);
    switch (inval) {
      case 'Small': this.currentTitle = 'SM ' + this.currentTitle; break;
      case 'Large': this.currentTitle = 'LG ' + this.currentTitle; break;
      default: this.currentTitle = this.currentTitle; break;
    }
    if ((this.hasSauce) || (this.isPlatter)){
      this.checkOut = false;
    } else {
      this.checkOut = true;
    }

  }

  displayModCost(item: any) {
    var builtItem: string = '';
    if (item.cost > 0) {
      builtItem = item.title + ' $' + item.cost;
    } else {
      builtItem = item.title
    }
    return builtItem;
  }

  isSelected(item: string) {
    var found: boolean = false;
    this.itemsPicked.forEach((element: any) => {
      if (element === item) {
        found = true;
      }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  changeItem(title: string) {
    var found: boolean = false;
    var foundAt: number = -1;
    this.itemsPicked.forEach((element: any, i: number) => {
      if (title === element) {
        found = true;
        foundAt = i;
      }
    });
    if (found) {
      if (this.itemsPicked.length === 1){
        this.isLastItemBox = !this.isLastItemBox;
        this.mask = !this.mask;
      } else {
        this.itemsPicked.splice(foundAt, 1);
      }
    } else {
      this.itemsPicked.push(title);
    }
    var newTotal: number = 0;
    var costFound: boolean = false;
    this.modArray.forEach((element: any) => {
      this.itemsPicked.forEach((picked: string) => {
        if (picked === element.title) {
          newTotal += parseFloat(element.cost.toString());
        }
      });
    });
    this.itemCost = parseFloat(this.holdBaseCost.toString()) + newTotal;
  }


  addToOrder(currentItem: any) {
    var itemName = this.currentTitle;
    var buildArray: any = this.readyToPrint(this.itemsPicked,this.sauceSelected,this.platterSelected);
    this.global.addToCartPrint(itemName, buildArray, this.currentTitle, this.itemCost);
    this.router.navigateByUrl('MENU');
  }


  readyToPrint(extraArray: any,sauce:any,side:any) {
    var translated: any = [];
    var theObject: any = {};
    var found: boolean = false;
    this.noCostItems.forEach((noCost: any) => {
      found = false;
      extraArray.forEach((picked: any) => {
        if (picked === noCost) {
          found = true;
        }
      });
      if (!found) {
        theObject.title = 'No ' + noCost;
        translated.push(theObject);
        theObject = {};
      }
    });
    this.extraCostItems.forEach((yesCost: any) => {
      found = false;
      extraArray.forEach((picked: any) => {
        if (picked === yesCost.title) {
          found = true;
        }
      });
      if (found) {
        theObject.title = 'Add ' + yesCost.title;
        translated.push(theObject);
        theObject = {};
      }
    });
    if(sauce.length > 0){
      theObject = {};
      theObject.title = "Sauce/Dressing: "+ sauce;
      translated.push(theObject);
    }
    if (side.length > 0){
      side.forEach((theSide:string) => {
          theObject = {};
          theObject.title = "With "+ theSide;
          translated.push(theObject);
      });
    }
    return translated;
  }

  moveToSauce() {
    this.whatStep = 3;
    if (!this.isPlatter) {
      this.checkOut = true;
    }
  }

  moveToPlatter() {
    this.whatStep = 4;
    this.checkOut = true;
  }

  checkSkipSauce() {
    if ((!this.hasSauce) && (this.isPlatter)) {
      return false;
    } else {
      return true;
    }
  }

  whichSauceSelected(sauce: string) {
    var found: boolean = false;
    this.sauceSelected.forEach((element: string) => {
      if (element === sauce) {
        found = true;
      }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  selectSauce(sauce: string) {
    this.sauceSelected = [];
    this.sauceSelected.push(sauce);
  }

  selectPlatter(side: string) {
    var found = false;
    var foundAt = -1;
    this.platterSelected.forEach((element: string,index:number) => {
      if (element === side) {
        found = true;
        foundAt = index;
      }
    });
    if (found) {
      this.platterSelected.splice(foundAt,1);
    } else {
      this.platterSelected.push(side);
    }
    if (this.platterSelected.length > this.currentItem.maxSelected){
      this.mask = !this.mask;
      this.isWarningBox = !this.isWarningBox;
    }
  }

  whichPlatterSelected(side: string) {
    var found: boolean = false;
    this.platterSelected.forEach((element: string) => {
      if (element === side) {
        found = true;
      }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  checkSideSize(){
    return this.platterSelected.length > 2 ? false:true;
  }

  resetWarning(){
    this.platterSelected = [];
    this.mask = !this.mask;
    this.isWarningBox = !this.isWarningBox;
  }
}

