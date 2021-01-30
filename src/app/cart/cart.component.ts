import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private global : DataService, private router :Router) { }


  ngOnInit(): void {
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
    }
  }

  buttonClick(){
    this.global.changeCart(['one','two','three']);
    this.router.navigateByUrl('MENU');

  }

}
