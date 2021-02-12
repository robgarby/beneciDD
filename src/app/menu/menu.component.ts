import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private global : DataService, private router:Router) { }

  menuCats : any = [];
  theMenu : any = [];
  theCats : any = [];
  whichMenu = 'All';
  navMenu : any = [];
  pizzaID : Number = 0;

  ngOnInit(): void {
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    } 
    this.global.menuEmitter.subscribe(
      (response:any) => {
        this.theMenu = Object.values(response);
        this.splitCats(this.theMenu);
      }
    )
   this.theMenu = this.global.theMenu;
   this.splitCats(this.theMenu);
  }

async splitCats(inval:any){
    var cats:any  = [];
    inval.forEach((element:any) => {
      var found = false;
      cats.forEach((inside:any) => {
        if (element.category === inside) {
          found = true;
        }
      });
      if (!found) {
        cats.push(element.category);
      }
    });
    this.theCats = cats;
  }

  setMenu(inval:string){
    this.whichMenu = inval;
    console.log(this.whichMenu);
    switch (inval) {
      case 'Pizza' : this.router.navigateByUrl('PIZZA'); break;
      case 'Chicken' : this.router.navigateByUrl('CHICKEN'); break;
      case 'Pasta' : this.router.navigateByUrl('PASTA'); break;
      case 'Sub' : this.router.navigateByUrl('SUBS'); break;
      case 'Sandwich' : this.router.navigateByUrl('SANDWICH'); break;
      case 'Salad' : this.router.navigateByUrl('SALAD'); break;
      case 'Side' : this.router.navigateByUrl('SIDE'); break;
      case 'Drinks' : this.router.navigateByUrl('DRINK'); break;
    }
  }

  resetMenu(inval:string,index:Number){
    this.whichMenu = inval;
    if (index !== 0){
      this.navMenu.splice(index);
    } else {
      this.navMenu = [];
    }
  }

  filterPizza(title:string,index:Number){
    this.navMenu.push(title);
    this.pizzaID = index;
    console.log(this.pizzaID)
  }

  showPizza(){
    var value = false;
    if (this.whichMenu === 'Pizza') {
      if (this.pizzaID ===0) {
        value = true;
      }
    }
    return value;
  }
}
