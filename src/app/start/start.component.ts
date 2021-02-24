import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private global : DataService, private router :Router) { }

  fullData : any = [];
  theDate : Date = new Date();
  dayOfWeek : number = 0;
  displayTime :string = '';

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
    this.dayOfWeek = this.theDate.getDay();
    this.displayTime = this.global.storeHours[this.dayOfWeek].title + ' '+this.global.storeHours[this.dayOfWeek].hours;
    console.log(this.displayTime);
  }

  orderOnline(){
    this.router.navigateByUrl('/MENU');
  }

}
