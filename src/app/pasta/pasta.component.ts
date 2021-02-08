import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-pasta',
  templateUrl: './pasta.component.html',
  styleUrls: ['./pasta.component.css']
})
export class PastaComponent implements OnInit {

  constructor(private global : DataService, private router : Router) { }

  localPastaArray: any = [];
  detailArray: any = [];
  currentPasta: any = [];
  whatStep: number = 0;
  itemCost: number = 0;
  currentSize: string = 'Small';
  pastaMods: any = [];
  pastaModArray: any = [];
  theCurrentID: number = -1;
  platter: string = 'No';
  extraPlatterArray: any = [];
  halfSize: boolean = false;

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
    this.theCurrentID = -1;
    this.pastaMods = [];
    this.platter = 'No';
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    if (this.global.sandwichArray.length === 0) {
      this.localPastaArray = this.global.theMenu.filter((data: any) => data.category === 'Pasta');
    }
    this.detailArray.push("home");
    this.detailArray.push("pasta");
    this.currentPasta = [];
    this.pastaModArray = this.global.allMods.filter((data: any) => data.product === 'Pasta');
    this.extraPlatterArray = this.global.extraPlaterItems;
    console.log(this.localPastaArray);
  }

  resetItem(i: number) {
    this.platter = 'No';
    switch (i) {
      case 0: this.router.navigateByUrl('MENU'); break;
      case 1:
        this.router.navigateByUrl('PASTA');
        this.whatStep = 0;
        this.detailArray = [];
        this.ngOnInit();
        break;
      case 2:
        this.whatStep = 0;
        this.currentPasta = [];
        this.detailArray.length = 2;
        break;
      case 3:
        this.whatStep = 1;
        this.detailArray.length = 3;
        break;
    }
  }

  pastaDetail(i: number) {
    this.platter = 'No';
    this.currentPasta = this.localPastaArray[i];
    this.detailArray.push(this.localPastaArray[i].title);
    this.platter = this.localPastaArray[i].platter;
    this.itemCost = this.localPastaArray[i].ONE;
    this.pastaMods = this.localPastaArray[i].platterSet.split(",");
    this.whatStep = 1;
  }

  extraSelected(ID:string){
    var found = false;
    this.pastaMods.forEach((element:string) => {
      if (ID === element){
        found = true;
      }
    });
    return found ? 'bg-primary' : 'bg-secondary';
  }

  setNewPrice(i:number){
    var found = false;
    var currentMod : any = this.pastaExtra[i];
    var foundAt : number = 0;
    var modifyNumber : number = 0;
    this.pastaMods.forEach((element:string,index:number) => {
      var total : number = this.itemCost;

      if (currentMod.ID === element){
        found = true;
        foundAt = index;
      }
    });
    if (found) {
      this.pastaMods.splice(foundAt,1);
      modifyNumber = parseFloat(this.pastaExtra[i].cost.toString());
      this.itemCost = this.itemCost - modifyNumber;
    } else {
      this.pastaMods.push(currentMod.ID);
      modifyNumber = parseFloat(this.pastaExtra[i].cost.toString());
      this.itemCost = parseFloat(this.itemCost.toString()) + modifyNumber;
    }
    var setLine : string = '';
    this.pastaMods.forEach((element:string) => {
      setLine += element + ',';
    });
    setLine = setLine.slice(0,-1);
    this.currentPasta.platterSet = setLine;
  }

  addToOrder() {
    var itemName = this.currentSize + ' ' + this.currentPasta.title;
    var extraDetail: any = [];
    extraDetail.push(itemName);
    extraDetail.push('Sub');
    extraDetail.push(this.itemCost);
    extraDetail.push(this.pastaMods);
    this.global.addToCart(itemName, extraDetail);
    this.router.navigateByUrl('MENU');
  }

}
