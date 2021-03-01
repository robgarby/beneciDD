import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private global : DataService, private router :Router, private cookie : CookieService) { }

  fullData : any = [];
  theDate : Date = new Date();
  dayOfWeek : number = 0;
  displayTime :string = '';
  client : any = [];
  isMember: boolean = false;

  navToLogIn(){
    this.router.navigateByUrl('LOGIN');
  }

  async ngOnInit() {
    this.global.cartEmitter.subscribe(
      (response:boolean) => {
        this.global.theCart = response;
      }
    )
    this.global.menuEmitter.subscribe(
      (response:boolean) => {
        this.global.theMenu = response;
      }
    )
    this.global.memberEmitter.subscribe(
      (response:boolean) => {
        this.isMember = response;
      }
    )
    this.dayOfWeek = this.theDate.getDay();
    this.displayTime = this.global.storeHours[this.dayOfWeek].title + ' '+this.global.storeHours[this.dayOfWeek].hours;
    this.isMember = this.global.isMember;
  }

  orderOnline(){
    this.router.navigateByUrl('/MENU');
  }

}
