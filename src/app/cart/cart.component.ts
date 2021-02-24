import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {

  constructor(private global : DataService, private router :Router) { }

  theCart : any = [];
  theDetails : any = [];
  isUp : number = -1;
  showCart : boolean= false;

  ngOnInit(): void {
    this.global.cartShowEmmiter.subscribe(
      (response:boolean) => {
        this.showCart= response;
      }
    )
  }

calcTotal(){
  var total : number = 0;
  this.theCart.forEach((element:any) => {
      total += parseFloat(element.cost.toString());
  });
  return total;
}

calcTax(){
  var total : number = 0;
  this.theCart.forEach((element:any) => {
      total += parseFloat(element.cost.toString());
  });
  if (total > 3.99){
    return total *.13;
  } else {
    return total *.05;
  }
}

checkSpecial(inval:string){
  if (inval === 'SIDE ONE ITEMS'){
    return '<---SIDE ONE ITEMS--->';
  }
  if (inval === 'SIDE TWO ITEMS'){
    return '<---SIDE TWO ITEMS--->';
  }
  return inval;
}

removeItem(i:number){
  this.theCart.splice(i,1);
  this.global.theCartTotal = this.theCart;
}

calcGrandTotal(){
  var total : number = 0;
  this.theCart.forEach((element:any) => {
      total += parseFloat(element.cost.toString());
  });
  if (total > 3.99){
    return total *1.13;
  } else {
    return total *1.05;
  }
}

whatItem : number = -1;

inspectItem(i:number){
  this.theDetails = this.theCart[i].detail;
  console.log(this.theDetails);
  if (this.whatItem === i){
    this.whatItem = -1;
  } else {
    this.whatItem = i;
  }
  
}

checkExtra(i:number){
  return this.theCart[i].length === 0 ? true : false;
}

printIt(){
  this.global.printIt(this.theCart);
}

}
