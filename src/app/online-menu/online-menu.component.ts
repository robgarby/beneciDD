import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-online-menu',
  templateUrl: './online-menu.component.html',
  styleUrls: ['./online-menu.component.css']
})
export class OnlineMenuComponent implements OnInit {

  constructor(private global : DataService) { }

  pizzaMenu :any = [];
  chickenMenu : any = [];
  subMenu : any = [];
  theMenu : any = [];
  pastaMenu : any = [];
  sandwichMenu : any = [];
  saladMenu : any = [];
  sideMenu : any = [];

  async ngOnInit() {
    this.pizzaMenu = await this.global.theMenu.filter((data: any) => data.category === 'Pizza');
    this.chickenMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Chicken');
    this.subMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Sub');
    this.pastaMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Pasta');
    this.sandwichMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Sandwich');
    this.saladMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Salad');
    this.sideMenu = await this.global.fullDatabase.filter((data: any) => data.catagory === 'Side');
    console.log(this.sandwichMenu)
  }

  checkCount(num:number,count:number){
    console.log(num,count);
    return num === parseFloat(count.toString()) ? false : true;
  }

}
