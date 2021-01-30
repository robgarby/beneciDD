import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.css']
})
export class BuildComponent implements OnInit {

  constructor(private router: Router, private global: DataService, private http: HttpClient) { }

  itemCost: number = 0;
  currentPizza: any = { "category": "Pizza", "title": 'Build Your Own', "description": '-', "cost": '12.99' };
  currentSize: string = '';
  currentCrust: string = '';
  currentSauce: string = '';
  modData: any = [];
  modDataBase: any = [];
  modString: string = '-';
  regMods: number = 0;
  premiumMods: number = 0;
  detailArray: any = [];
  whatStep: number = 0;
  displayArray:any = [];
  modified : boolean = false;
  whichMod : number = -1;

  async ngOnInit() {
    this.detailArray = [];
    this.currentSize = this.global.currentSize;
    this.currentSauce = this.global.currentSauce;
    this.currentCrust = this.global.currentCrust;
    this.modData = this.global.modData;
    this.detailArray.push('Build Your Own');
    this.detailArray.push('Ingredients');
    this.currentSize !== '' && this.detailArray.push(this.currentSize);
    this.currentCrust !== '' && this.detailArray.push(this.currentCrust + ' Crust');
    this.currentSauce !== '' && this.detailArray.push(this.currentSauce + ' Sauce');
    if (this.global.modDataBase.length === 0) {
      await this.getMods();
    } else {
      this.modDataBase = this.global.modDataBase;
      this.buildPizza(this.modDataBase, this.modData);
    }
  }

  modifyItem(value:number,mod:string){
    var newModString : any = [];
    this.modData.forEach((element:string) => {
      if (element.toString() !== mod.toString()) {
        newModString.push(element);
      }
    });
    for (var a=0; a < value; a++){
      newModString.push(mod);
    }
    this.global.modData = newModString;
    this.whichMod = -1;
    this.ngOnInit();
  }

  setMod(inval:number){
    if (inval === this.whichMod){
      this.whichMod = -1;
    } else {
      this.whichMod = inval;
    }
  }

  async buildPizza(temp: any, mods: any) {
    var filtered: any = [];
    this.modString = '';
    filtered = temp.filter((data: any) => {
      return data.product === 'Pizza';
    });
    this.modString = '';
    this.modDataBase = filtered;
    this.displayArray = [];
    mods.forEach((element: any) => {
      var found = false;
      var foundAt :number = -1;
      this.displayArray.forEach((indy:any, i:number) => {
         if (indy.code === element){
            found = true;
            foundAt = i;
         }
      });
      if (found) {
        this.displayArray[foundAt].count += 1;
      } else {
        this.displayArray.push({"code":element,"count":1,"modifier": this.translate(element)})
      }
    })
   this.displayArray.forEach((item:any) => {
     if (item.count > 1) {
       this.modString += item.count+'X '+item.modifier+', ';
     } else {
      this.modString += item.modifier+', ';
     }
   });
   this.modString= this.modString.slice(0,-2);
   this.currentPizza.description = this.modString;
   await this.modPrice(this.modDataBase, this.modData);
   this.itemCost = this.calcPrice(this.currentSize, this.regMods, this.premiumMods);
  };

  
  async getMods() {
    var temp: any = [];
    var mods: any = [];
    var filtered: any = []
    await this.http.get('https://www.beneci.com/DATA/getMods.php').subscribe(
      (response) => {
        temp = Object.values(response);
        console.log(temp);
        this.global.modDataBase = temp;
        mods = this.global.modData;
        console.log(mods);
        this.buildPizza(temp, mods);
      }
    )
  }

  colorMod(inval: number) {
    var occurs: number = 0;
    var returnVal = 'none';
    this.modData.forEach((element: number) => {
      if (inval === element) {
        occurs += 1;
      }
    });
    switch (occurs) {
      case 0: return 'none'; break;
      case 1: return 'one'; break;
      case 2: return 'two'; break;
      case 3: return 'three'; break;
      default: return 'none'; break;
    }
  }

  calcPrice(size: string, reg: number, prem: number) {
    var premiumPrice: any = { "SM": "2.5", "MD": "3.6", "LG": "4.45", "XL": "5" };
    var glutenPrice: any = { "SM": "2.95", "MD": "3.95" };
    var startPrice: number = 0;
    var premiumAdd: number = 0;
    var glutenAdd: number = 0;
    var sendBack: number = 0;
    console.log(this.global.currentCrust);
    switch (size) {
      case 'Small':
        this.global.buildPrices.forEach((element: any) => {
          if (parseInt(element.regular) === reg) {
            startPrice = element.SM;
          }
        });
        premiumAdd = prem * premiumPrice.SM;
        if ((this.global.currentCrust === 'Gluten') || (this.global.currentCrust === 'Gluten Free')) {
          glutenAdd = glutenPrice.SM;
        }
        sendBack = parseFloat(startPrice.toString()) + parseFloat(premiumAdd.toString()) + parseFloat(glutenAdd.toString());
        break;
      case 'Medium':
        this.global.buildPrices.forEach((element: any) => {
          if (parseInt(element.regular) === reg) {
            startPrice = element.MD;
          }
        });
        premiumAdd = prem * premiumPrice.MD;
        if ((this.global.currentCrust === 'Gluten') || (this.global.currentCrust === 'Gluten Free')) {
          glutenAdd = glutenPrice.MD;
        }
        sendBack = parseFloat(startPrice.toString()) + parseFloat(premiumAdd.toString()) + parseFloat(glutenAdd.toString());
        break;
      case 'Large':
        this.global.buildPrices.forEach((element: any) => {
          if (parseInt(element.regular) === reg) {
            startPrice = element.LG;
          }
        });
        premiumAdd = prem * premiumPrice.LG;
        sendBack = parseFloat(startPrice.toString()) + parseFloat(premiumAdd.toString()) + parseFloat(glutenAdd.toString());
        break;
      case 'X-Large':
        this.global.buildPrices.forEach((element: any) => {
          if (parseInt(element.regular) === reg) {
            startPrice = element.XL;
          }
        });
        premiumAdd = prem * premiumPrice.XL;
        sendBack = parseFloat(startPrice.toString()) + parseFloat(premiumAdd.toString()) + parseFloat(glutenAdd.toString());
        break;
      default: sendBack = 0; break;
    }
    return sendBack;
  }

  async modPrice(inArray: any, mods: any) {
    var regCount = 0;
    var premiumCount = 0;
    inArray.forEach((element: any) => {
      mods.forEach((data: any) => {
        if (data === element.code) {
          if (element.premium === 'No') {
            regCount += 1;
          } else {
            premiumCount += 1;
          }
        }
      });
    });
    this.regMods = regCount;
    this.premiumMods = premiumCount;
    return 'done';
  }

  translate(mod: string) {
    var theValue = '-';
    this.modDataBase.forEach((element: any) => {
      if (element.code === mod) {
        theValue = element.modifier;
      }
    });
    return theValue;
  }

  goTO(inval: string) {
    this.router.navigateByUrl(inval);
  }

  resetItem(i: number) {
    console.log(i);
    switch (i) {
      case -1: this.router.navigateByUrl('PIZZA'); this.resetFullBuild(4); break;
      case -2: this.router.navigateByUrl('MENU'); this.resetFullBuild(4); break;
      case 0: this.resetFullBuild(4); break;
      case 1: this.resetFullBuild(3); break;

    }
  }

  resetFullBuild(inval: number) {
    switch (inval) {
      case 3:
        this.global.currentCrust = '';
        this.global.currentSauce = '';
        this.global.modData = [];
        break;
      case 4:
        this.global.currentCrust = '';
        this.global.currentSauce = '';
        this.global.currentSize = '';
        this.global.modData = [];
        break;
      default:
        this.global.currentCrust = '';
        this.global.currentSauce = '';
        this.global.currentSize = '';
        this.global.modData = [];
        break;
    }
    this.ngOnInit();
  }

}
