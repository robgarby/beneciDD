import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-subs',
  templateUrl: './subs.component.html',
  styleUrls: ['./subs.component.css']
})
export class SubsComponent implements OnInit {

  constructor(private global : DataService, private router : Router, private http:HttpClient) { }

  localSubArray : any = [];
  detailArray : any = [];
  currentSub : any = [];
  whatStep: number = 0;
  itemCost : number = 0;
  currentSize : string = 'Small';
  currentMods : any = [];
  subModArray : any = [];


  async ngOnInit() {
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    } 
    if (this.global.subArray.length === 0){
      this.localSubArray = this.global.theMenu.filter((data:any) => data.category === 'Sub');
    }
    this.detailArray.push("home");
    this.detailArray.push("subs");
    this.subModArray = this.global.allMods.filter((data:any) => data.product === 'Sub');
  }

  resetItem(i:number){
    console.log(i);
    switch (i){
      case 0 : this.router.navigateByUrl('MENU'); break;
      case 1 : 
          this.router.navigateByUrl('SUBS');
          this.whatStep = 0;
          this.detailArray = [];
          this.ngOnInit();
      break;
      case 2 :
          this.whatStep = 0;
          this.currentSub = [];
          this.detailArray.length = 2;
      break;
      case 3 :
        this.whatStep = 1;
        this.detailArray.length = 3;
    break;
    }
  }

  subDetail(i:number){
      this.currentSub = this.localSubArray[i];
      this.detailArray.push(this.localSubArray[i].title);
      this.itemCost = this.localSubArray[i].TWOSM;
      this.currentMods = this.localSubArray[i].modHold.split(",");
      this.whatStep = 1;
      console.log(this.localSubArray);
  }

  returnSize(){
    return this.currentSize === 'Small' ? 'SM' : 'LG';
  }

  returnPrice(currentSub:any){
    return this.currentSize === 'Small' ? currentSub.TWOSM : currentSub.TWOLG;
  }

  whatButtonColor(size:string){
   return this.currentSize === size ? 'bg-primary' : 'bg-secondary';
  }

  sizeClick(inval:string, cost:number){
    this.currentSize = inval;
    this.whatStep = 2;
    this.itemCost = cost;
    this.detailArray.push(inval);
  }

  modSelected(i:number){
    var found = false;
    var modValue : number = 1.25;
    this.currentMods.forEach((element:any) => {
        if (parseFloat(i.toString()) === parseInt(element.toString())) {
          found = true;
        }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  modifyMods(i:number){
    var found : boolean = false;
    var foundAt : number = -1;
    var startNumber : any  = parseFloat(this.itemCost.toString());
    this.currentMods.forEach((element:number, index:number) => {
        if (element === i){
          found = true;
          foundAt = index;
        }
    });
    if (found) {
      this.currentMods.splice(foundAt,1);
      if (i.toString() === '105'){
        startNumber -= parseFloat('1.25');
      }
    } else {
      this.currentMods.push(i);
      if (i.toString() === '105'){
        startNumber += parseFloat('1.25');
      }
    }
    this.itemCost = startNumber;
  

  }

  displayModData(inval:string){
    if (inval === 'Extra Cheese'){
      return 'Extra Cheese + $1.25';
    } else {
      return inval;
    }
  }

  addToOrder() {
    var itemName = this.currentSize + ' ' + this.currentSub.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.currentMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }
}
