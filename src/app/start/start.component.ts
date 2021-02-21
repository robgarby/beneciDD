import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private global : DataService) { }

  fullData : any = [];

  async ngOnInit() {
    this.global.cartEmitter.subscribe(
      (response:boolean) => {
        this.global.theCart = response;
      }
    )
  }

}
