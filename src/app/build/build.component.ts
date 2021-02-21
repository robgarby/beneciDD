import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
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
  displayArray: any = [];
  modified: boolean = false;
  whichMod: number = -1;
  smallPrice: number = 0;
  mediumPrice: number = 0;
  largePrice: number = 0;
  xLargePrice: number = 0;
  buildPriceArray: any = [];
  modTranslated : any = [];

  async ngOnInit() {
    if (this.global.theLocation === 'select location') {
      this.router.navigateByUrl('START');
      return;
    }
    this.detailArray = [];
    this.currentSize = this.global.currentSize;
    this.currentSauce = this.global.currentSauce;
    this.currentCrust = this.global.currentCrust;
    this.modData = this.global.modData;
    switch (this.currentSize) {
      case 'Small': this.currentPizza.title = 'SM Build Your Own'; break;
      case 'Medium': this.currentPizza.title = 'Med Build Your Own'; break;
      case 'Large': this.currentPizza.title = 'LG Build Your Own'; break;
      case 'X-Large': this.currentPizza.title = 'XL Build Your Own'; break;
      default: this.currentPizza.title = 'SM Build Your Own'; this.currentSize = 'Small'; this.global.currentSize = 'Small'; break;
    }
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

  modifyItem(value: number, mod: string) {
    var newModString: any = [];
    this.modData.forEach((element: string) => {
      if (element.toString() !== mod.toString()) {
        newModString.push(element);
      }
    });
    for (var a = 0; a < value; a++) {
      newModString.push(mod);
    }
    this.global.modData = newModString;
    this.whichMod = -1;
    this.ngOnInit();
  }

  setMod(inval: number) {
    if (inval === this.whichMod) {
      this.whichMod = -1;
    } else {
      this.whichMod = inval;
    }
  }

  async buildPizza(temp: any, mods: any) {
    var theObject: any = {};
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
      var foundAt: number = -1;
      this.displayArray.forEach((indy: any, i: number) => {
        if (indy.code === element) {
          found = true;
          foundAt = i;
        }
      });
      if (found) {
        this.displayArray[foundAt].count += 1;
      } else {
        this.displayArray.push({ "code": element, "count": 1, "modifier": this.translate(element) })
      }
    })
    this.modTranslated = [];
    this.displayArray.forEach((item: any) => {
      if (item.count > 1) {
        this.modString += item.count + 'X ' + item.modifier + ', ';
        theObject = {};
        theObject.title = "Add "+item.count + 'X ' + item.modifier;
        this.modTranslated.push(theObject);
      } else {
        this.modString += item.modifier + ', ';
        theObject = {};
        theObject.title = "Add "+item.modifier;
        this.modTranslated.push(theObject);
      }
    });
    this.modString = this.modString.slice(0, -2);
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
        this.global.modDataBase = temp;
        mods = this.global.modData;
        this.buildPizza(temp, mods);
      }
    )
  }

  colorMod(inval: number, premium: string) {
    var occurs: number = 0;
    var returnVal = 'none';
    this.modData.forEach((element: number) => {
      if (inval === element) {
        occurs += 1;
      }
    });
    switch (occurs) {
      case 0:
        return premium === 'No' ? 'none' : 'no-red'; break;
      case 1:
        return premium === 'No' ? 'one-black' : 'one-red'; break;
      case 2:
        return premium === 'No' ? 'two-black' : 'two-red'; break;
      case 3:
        return premium === 'No' ? 'three-black' : 'three-red'; break;
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

  async resetItem(i: number) {
    switch (i) {
      case -1: this.router.navigateByUrl('PIZZA'); break;
      case -2: this.router.navigateByUrl('MENU');  break;
      case 0:
        this.whatStep = 0;
        this.detailArray.length = 1;
        break;
      case 1:
        this.whatStep = 0;
        this.detailArray.length = 1; break;
      case 2:
        this.smallPrice = await this.calcPrice('Small', this.regMods, this.premiumMods);
        this.mediumPrice = await this.calcPrice('Medium', this.regMods, this.premiumMods);
        this.largePrice = await this.calcPrice('Large', this.regMods, this.premiumMods);
        this.xLargePrice = await this.calcPrice('X-Large', this.regMods, this.premiumMods);
        this.buildPriceArray = [];
        this.buildPriceArray.push({ "short": "SM", "size": "Small", "cost": this.smallPrice });
        this.buildPriceArray.push({ "short": "MD", "size": "Medium", "cost": this.mediumPrice });
        this.buildPriceArray.push({ "short": "LG", "size": "Large", "cost": this.largePrice });
        this.buildPriceArray.push({ "short": "XL", "size": "X-Large", "cost": this.xLargePrice });
        this.whatStep = 1;
        this.detailArray.length = 2;
        break;
        case 3:
          this.detailArray.length = 3;
          this.whatStep = 2;
        break;
        case 4:
          this.detailArray.length = 4;
          this.whatStep = 3;
        break;
    }
  }



  async clickSize(i: number) {
    this.displayArray = [];
    this.itemCost = this.buildPriceArray[i].cost;
    this.global.currentSize = this.buildPriceArray[i].size;
    this.currentPizza.title = this.buildPriceArray[i].short + ' Build Your Own';
    this.currentPizza.cost = this.itemCost;
    await this.showCrusts();
    this.whatStep = 2;
    this.ngOnInit();
  }

  crustArray: any = [];

  async showCrusts() {
    this.crustArray = [];
    if (this.currentSize === 'Small') {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" },
        { "crust": "Gluten Free", "cost": "2.95" },
      ]
    }
    if (this.currentSize === 'Medium') {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" },
        { "crust": "Gluten Free", "cost": "3.95" },
      ]
    }
    if ((this.currentSize === 'Large') || (this.currentSize === 'X-Large')) {
      this.crustArray = [
        { "crust": "Regular", "cost": "0" },
        { "crust": "Thin", "cost": "0" },
        { "crust": "Thick", "cost": "0" }
      ]
    }
  }

  displayCost(inval: number) {
    if (inval.toString() === '0') {
      return '';
    } else {
      return 'Add $' + parseFloat(inval.toString());
    }

  }

  sauceArray: any = [];

  clickCrust(index: number) {
    this.sauceArray = this.global.sauceArray;
    var item: number = parseFloat(this.itemCost.toString());
    var theCost: number = parseFloat(this.crustArray[index].cost);
    var newTotal: number = parseFloat(this.itemCost.toString()) + theCost;
    this.itemCost = newTotal;
    this.detailArray.push(this.crustArray[index].crust + ' Crust');
    this.currentCrust = this.crustArray[index].crust;
    this.whatStep = 3;
    this.currentSauce = '';
  }

  clickSauce(index: number) {
    this.detailArray.push(this.sauceArray[index].sauce + ' Sauce');
    this.currentSauce = this.sauceArray[index].sauce;
    if (this.currentSauce !== 'Garlic') {
      this.whatStep = 4;
      this.global.currentSauce = this.currentSauce;
    }
  }

  yesGarlicSauce() {
    this.currentSauce = 'Garlic';
    this.whatStep = 4;
  }

  noGarlicSauce() {
    this.detailArray.pop();
    this.currentSauce = '';
    this.whatStep = 3;
  }

  addToCart() {
    var itemName = this.currentSize + ' '+this.currentPizza.title;
    var buildArray: any = this.readyToPrint(this.currentCrust,this.currentSauce);
    this.modTranslated.forEach((element:any) => {
        buildArray.push(element);
    });
    this.global.addToCartPrint(itemName, buildArray, itemName, this.itemCost);
    this.router.navigateByUrl('MENU');
    var itemName = this.currentSize + ' ' + this.currentPizza.title;
  }

  readyToPrint(crust:string,sauce:string,mods:any=[]){
    var theObject : any = {};
    var translate : any = [];
    if (crust !== 'Regular') {
      theObject = {};
      theObject.title = "Crust : "+crust + " Crust";
      translate.push(theObject);
    }
    if (sauce !== 'Regular') {
      theObject = {};
      theObject.title = "Sauce : "+sauce+ " Sauce";
      translate.push(theObject);
    }
    return translate;
  }

  resetIngredients() {
    this.global.modData = [];
    this.global.currentSize = 'Small';
    this.ngOnInit();
  }

  checkModsAmount() {
    if (this.modData.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  checkTransfer() {
    return this.currentSauce !== '' ? false : true;
  }

}
