
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-half-nhalf',
  templateUrl: './half-nhalf.component.html',
  styleUrls: ['./half-nhalf.component.css']
})
export class HalfNhalfComponent implements OnInit {

  constructor(private global: DataService, private route: Router, private http: HttpClient) { }

  itemCost: number = 0;
  currentPizza: any = { "category": "Pizza", "title": 'Half N Half', "description": '-', "cost": '12.99' };
  currentSize: string = '';
  currentCrust: string = '';
  currentSauce: string = '';
  detailArray: any = [];
  highHalf: number = 0;
  mask: boolean = false;
  showDescription: boolean = false;
  sideOneDescription: string = '';
  sideTwoDescription: string = '';
  sideOneCost: number = 0;
  sideTwoCost: number = 0;
  modDataOne: any = [];
  modDataTwo: any = [];
  localS1Mods: any = [];
  localS2Mods: any = [];
  activeSide: number = 1;
  currentMod: string = '';
  pickCrust: number = -1;
  halfOnePlain: boolean = false;
  halfTwoPlain: boolean = false;
  whatStep = 1;
  itemName: string = 'Half/Half'
  holdBaseName: string = 'Half/Half';
  crustArray: any = [];
  explainGarlic: boolean = false;

  async ngOnInit() {
    this.detailArray = [];
    this.global.currentSize = 'Small';
    this.global.currentSauce = '';
    this.global.currentCrust = '';
    this.detailArray.push('MENU');
    this.detailArray.push('PIZZA');
    this.detailArray.push('HALF/HALF');
    // this.global.currentSize !== '' && this.detailArray.push(this.global.currentSize);
    // this.global.currentCrust !== '' && this.detailArray.push(this.global.currentCrust + ' Crust');
    // this.global.currentSauce !== '' && this.detailArray.push(this.global.currentSauce + ' Sauce');
    this.global.pizzaMods.forEach((element: any) => {
      element.count = 0;
      this.localS1Mods.push(element);
      this.pickCrust = -1;
    });;
    this.modDataTwo = this.localS1Mods.map((x: any) => Object.assign({}, x));
    this.activeSide = 1;
    this.halfOnePlain = false;
    this.halfTwoPlain = false;
    this.itemName = 'Half/Half';
  }

  reset(i: number) {
    switch (i) {
      case 0: this.route.navigateByUrl('MENU'); break;
      case 1: this.route.navigateByUrl('PIZZA'); break;
      case 2: this.route.navigateByUrl('HALF'); break;
    }
  }

  whatSide(inval: number) {
    return this.activeSide === inval ? 'active-button' : 'not-active-button';
  }

  moveCrust(inval: number) {
    return inval === 1 ? false : true;
  }

  setSide(inval: number) {
    this.activeSide = inval;
  }

  showSideButton() {
    let returnValue = false;
    if ((this.pickCrust > 0) || (this.halfOnePlain)) {
      returnValue = true;
    }
    return returnValue;
  }

  showCount(inval: number) {
    switch (inval) {
      case 0: return ''; break;
      case 1: return '1x '; break;
      case 2: return '2x '; break;
      case 3: return '3x '; break;
      default: return '';
    }
  }

  setModView(inval: string) {
    this.currentMod = inval;
  }

  quantityCheck(inval: number) {
    switch (inval) {
      case 0: return 'clear'; break;
      case 1: return 'bg-one'; break;
      case 2: return 'bg-two'; break;
      case 3: return 'bg-three'; break;
      default: return 'clear';
    }
  }

  activatePlain(side: number) {
    switch (side) {
      case 1:
        this.halfOnePlain = true;
        this.pickCrust = 1;
        this.activeSide = 2;
        this.localS1Mods.forEach((element: any) => {
          element.count = 0;
        });
        this.sideOneDescription = 'Plain';
        this.sideOneCost = this.calcPrice('Small', this.localS1Mods, this.global.buildPrices, this.global.premiumPrices);
        break;
      case 2:
        this.halfTwoPlain = true;
        this.pickCrust = 3;
        this.activeSide = 2;
        this.modDataTwo.forEach((element: any) => {
          element.count = 0;
        });
        this.sideTwoDescription = 'Plain';
        this.sideTwoCost = this.calcPrice('Small', this.modDataTwo, this.global.buildPrices, this.global.premiumPrices);
        break;
    }
    console.log(this.halfOnePlain, this.halfTwoPlain);
  }

  setModCount1(num: number, mod: string) {
    var modCount = 0;
    this.halfOnePlain = false;
    this.localS1Mods.forEach((element: any, index: number) => {
      if (element.title === mod) {
        this.localS1Mods[index].count = num;
      }
      if (element.count > 0) {
        modCount += 1;
      }
    });
    if ((modCount > 0) || (this.halfOnePlain)) {
      this.pickCrust = 1;
    }
    this.currentMod = '';
    this.translateSide(this.localS1Mods, this.activeSide);
    this.sideOneCost = this.calcPrice('Small', this.localS1Mods, this.global.buildPrices, this.global.premiumPrices);
  }

  calcPrice(size: string, local: any, buildPrice: any, premiumPrice: any): any {
    let regular: number = 0;
    let premium: number = 0;
    local.forEach((local: any) => {
      if (local.count > 0) {
        if (local.type === 'regular') {
          regular += local.count;
        } else {
          premium += local.count;
        }
      }
    });
    let regPrice: number = this.regularPrice(size, regular, buildPrice);
    let premPrice: number = this.premPrice(size, premium, premiumPrice);
    return parseFloat(regPrice.toString()) + parseFloat(premPrice.toString());
  }

  regularPrice(size: string, regular: number, buildPrice: any) {
    switch (size) {
      case '': return buildPrice[regular].SM; break;
      case 'Small': return buildPrice[regular].SM; break;
      case 'Medium': return buildPrice[regular].MD; break;
      case 'Large': return buildPrice[regular].LG; break;
      case 'XLarge': return buildPrice[regular].XL; break;
    }
  }

  premPrice(size: string, premium: number, premiumPrice: any): any {
    switch (size) {
      case '': return premiumPrice.SM * premium; break;
      case 'Small': return premiumPrice.SM * premium; break;
      case 'Medium': return premiumPrice.MD * premium; break;
      case 'Large': return premiumPrice.LG * premium; break;
      case 'XLarge': return premiumPrice.XL * premium; break;
    }
  }

  baseCost(size: string, buildPrice: any) {
    switch (size) {
      case '': return buildPrice[0].SM; break;
      case 'Small': return buildPrice[0].SM; break;
      case 'Medium': return buildPrice[0].MD; break;
      case 'Large': return buildPrice[0].LG; break;
      case 'XLarge': return buildPrice[0].XL; break
    }
  }

  translateSide(inArray: any, side: number) {
    var description: string = '';
    inArray.forEach((element: any) => {
      if (element.count > 0) {
        description += this.showCount(element.count) + element.title + ', ';
      }
    });
    if (side === 1) {
      this.sideOneDescription = ''
      this.sideOneDescription = description.slice(0, -2);
    } else {
      this.sideTwoDescription = ''
      this.sideTwoDescription = description.slice(0, -2);
    }
  }

  isPlain(inval: number) {
    switch (inval) {
      case 1: return this.halfOnePlain ? 'active-button' : 'bg-warning'; break;
      case 2: return this.halfTwoPlain ? 'active-button' : 'bg-warning'; break;
      default: return this.halfOnePlain ? 'active-button' : 'bg-warning'; break;
    }
  }

  readyForCrust() {
    return this.pickCrust === 3 ? false : true;
  }

  setModCount2(num: number, mod: string) {
    var modCount = 0;
    this.halfTwoPlain = false;
    this.modDataTwo.forEach((selement: any, index: number) => {
      if (selement.title === mod) {
        this.modDataTwo[index].count = num;
      }
      if (selement.count > 0) {
        modCount += 1;
      }
    });
    if ((modCount > 0) || (this.halfTwoPlain)) {
      this.pickCrust = 3;
    }
    this.currentMod = '';
    this.translateSide(this.modDataTwo, this.activeSide);
    this.sideTwoCost = this.calcPrice('Small', this.modDataTwo, this.global.buildPrices, this.global.premiumPrices);
  }

  highSideArray: any = [];

  switchToSize() {
    this.highSideArray = [];
    if (this.sideOneCost > this.sideTwoCost) {
      this.itemCost = this.sideOneCost;
      this.highSideArray = this.localS1Mods;
    } else {
      this.highSideArray = this.modDataTwo;
      this.itemCost = this.sideTwoCost;
    }
    let smallCost: number = this.calcPrice('Small', this.highSideArray, this.global.buildPrices, this.global.premiumPrices);
    let mediumCost: number = this.calcPrice('Medium', this.highSideArray, this.global.buildPrices, this.global.premiumPrices);
    let largeCost: number = this.calcPrice('Large', this.highSideArray, this.global.buildPrices, this.global.premiumPrices);
    let xLargeCost: number = this.calcPrice('XLarge', this.highSideArray, this.global.buildPrices, this.global.premiumPrices);
    this.priceArray.push({ "short": "SM", "title": "Small", "cost": smallCost });
    this.priceArray.push({ "short": "MD", "title": "Medium", "cost": mediumCost });
    this.priceArray.push({ "short": "LG", "title": "Large", "cost": largeCost });
    this.priceArray.push({ "short": "XL", "title": "X-Large", "cost": xLargeCost });
    this.whatStep = 2;
  }

  priceArray: any = [];

  setSize(i: number) {
    this.currentSize = this.priceArray[i].title;
    this.itemName = this.priceArray[i].short + ' ' + this.holdBaseName;
    this.sideOneCost = this.priceArray[i].cost;
    this.sideTwoCost = this.priceArray[i].cost;
    this.itemCost = this.priceArray[i].cost;
    this.whatStep = 3;
    this.crustArray = this.global.crustArray;
    if ((this.currentSize === 'Large') || (this.currentSize === 'X-Large')) {
      this.crustArray.length = 3;
    } else {
      if (this.currentSize === 'Small') {
        this.crustArray[3].cost = this.global.glutenPrices.SM;
      } else {
        this.crustArray[3].cost = this.global.glutenPrices.MD;
      }
    }
  }

  displayCost(inval: number): any {
    let returnValue = '';
    if (inval > 0) {
      returnValue = 'Add $' + inval;
    }
    return returnValue;
  }

  sauceArray: any = [];
  clickCrust(index: number) {
    this.sauceArray = this.global.sauceArray;
    console.log(this.itemCost);
    var theCost: number = parseFloat(this.crustArray[index].cost);
    var newTotal: number = parseFloat(this.itemCost.toString()) + theCost;
    this.itemCost = newTotal;
    this.sideOneCost = newTotal;
    this.sideTwoCost = newTotal;
    this.detailArray.push(this.crustArray[index].crust + ' Crust');
    this.currentCrust = this.crustArray[index].crust;
    this.whatStep = 4;
    this.currentSauce = '';
  }

  clickSauce(i: number) {
    this.currentSauce = this.sauceArray[i].sauce;
    if (this.currentSauce === 'Garlic') {
      this.explainGarlic = !this.explainGarlic;
      this.mask = !this.mask;
    } else {
      this.detailArray.push(this.currentSauce + ' Sauce');
      this.whatStep = 5;
    }
    this.splitSides()
  }

  setGarlic() {
    this.explainGarlic = !this.explainGarlic;
    this.mask = !this.mask;
    this.currentSauce = 'Garlic';
    this.detailArray.push('Garlic Sauce');
    this.whatStep = 5;
    this.splitSides()
  }

  sideOneList : any = [];
  sideTwoList : any = [];

  splitSides(){
    this.sideOneList = this.sideOneDescription.split(',');
    this.sideTwoList = this.sideTwoDescription.split(',');
  }

  addToCart() {
    var itemName = this.itemName;
    var buildArray: any = this.readyToPrint(this.currentCrust,this.currentSauce);
    let theObject :any = {};
    theObject.title = 'SIDE ONE ITEMS';
    buildArray.push(theObject);
    this.sideOneList.forEach((element:any) => {
        theObject = {};
        theObject.title = "ADD "+element;
        buildArray.push(theObject);
    });
    theObject = {};
    theObject.title = 'SIDE TWO ITEMS';
    buildArray.push(theObject);
    this.sideTwoList.forEach((element:any) => {
        theObject = {};
        theObject.title = "ADD "+element;
        buildArray.push(theObject);
    });
    this.global.addToCartPrint(itemName, buildArray, itemName, this.itemCost);
    this.route.navigateByUrl('MENU');
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

  //   async resetItem(i: number) {
  //     switch (i) {
  //       case 0: this.route.navigateByUrl('MENU'); break;
  //       case 1: this.route.navigateByUrl('PIZZA'); break;
  //       case 2: this.showDescription = !this.showDescription; this.mask = !this.mask; break;
  //       case 3: this.whatStep = 1; this.activeMods = this.global.halfOne;  break;
  //       case 4: this.whatStep = 2; this.activeMods = this.global.halfTwo;
  //           //this is displaying the size with prices
  //           if (this.sideOneCost > this.sideTwoCost) {
  //               this.smallCost = await this.calculateRegPrem(this.global.halfOne,'Small');
  //               this.mediumCost = await this.calculateRegPrem(this.global.halfOne,'Medium');
  //               this.largeCost = await this.calculateRegPrem(this.global.halfOne,'Large');
  //               this.xLargeCost = await this.calculateRegPrem(this.global.halfOne,'X-Large');
  //           } else {
  //             this.smallCost = await this.calculateRegPrem(this.global.halfTwo,'Small');
  //             this.mediumCost = await this.calculateRegPrem(this.global.halfTwo,'Medium');
  //             this.largeCost = await this.calculateRegPrem(this.global.halfTwo,'Large');
  //             this.xLargeCost = await this.calculateRegPrem(this.global.halfTwo,'X-Large');
  //           }
  //           this.priceArray = [];
  //           this.priceArray.push({"short" : "SM","size":"Small","cost" : this.smallCost});
  //           this.priceArray.push({"short" : "MD","size":"Medium","cost" : this.mediumCost});
  //           this.priceArray.push({"short" : "LG","size":"Large","cost" : this.largeCost});
  //           this.priceArray.push({"short" : "XL","size":"X-Large","cost" : this.xLargeCost});
  //       break;
  //       case 5 :
  //           this.detailArray.length = 5;
  //           this.whatStep = 3;
  //       break;
  //       case 6: 
  //         this.detailArray.length = 6;
  //         this.whatStep = 4;
  //       break;
  //       case 7: 
  //           this.detailArray.length = 7;
  //           this.whatStep = 5;
  //           this.currentSauce = '';
  //       break;
  //     }
  //   }

  //   regCount : number = 0;
  //   premCount : number = 0;

  //   async calculateRegPrem(modsIn:any,size:string){
  //     var theValue : number = 0;
  //     var tempTemp: any = {};
  //     this.tempArray = [];
  //     modsIn.forEach((element: any) => {
  //       var found = false;
  //       var tx : number = 0;
  //       this.tempArray.forEach((id: any, index: number) => {
  //         if (element === id.code) {
  //           found = true;
  //           tx = index;
  //         }
  //       });
  //       if (found) {
  //         this.tempArray[tx].count += 1;
  //       } else {
  //         tempTemp = {};
  //         tempTemp.translate = this.translate(element);
  //         tempTemp.premium = this.findPremium(element);
  //         tempTemp.count = 1;
  //         tempTemp.code = element;
  //         this.tempArray.push(tempTemp);
  //       }
  //     });
  //     this.regCount = await this.countReg(this.tempArray);
  //     this.premCount = await this.countPrem(this.tempArray);
  //     var thecost: number = 0;
  //     var basePrices: any = this.global.buildPrices;
  //     thecost = await this.startValueFind(size,basePrices,this.regCount,this.premCount,'');
  //     return thecost;
  //   }

  // countReg(tempArray:any){
  //   var count : number = 0;
  //   tempArray.forEach((element:any) => {
  //     if (element.premium === 'No') {
  //       count += element.count;
  //     }
  //   });
  //   return count;
  // }

  // countPrem(tempArray:any){
  //   var count : number = 0;
  //   tempArray.forEach((element:any) => {
  //     if (element.premium !== 'No') {
  //       count += element.count;
  //     }
  //   });
  //   return count;
  // }

  //   checkModsAmount() {
  //     switch (this.whatStep){
  //       case 1 : return this.modDataOne.length === 0 ? true : false; break;
  //       case 2 : return this.modDataTwo.length === 0 ? true : false; break;
  //       default : return this.modDataOne.length === 0 ? true : false; break;
  //     }
  //   }

  //   clearMods(){
  //     switch(this.whatStep){
  //       case 1 : this.modDataOne = []; this.global.halfOne = []; this.sideOneDescription = ''; break;
  //       case 2 : this.modDataTwo = []; this.global.halfTwo = []; this.sideTwoDescription = ''; break;
  //       default : this.modDataOne = []; this.global.halfOne = []; this.sideOneDescription = ''; break;
  //     }
  //     this.ngOnInit();
  //   }

  //   setMod(inval: number) {
  //     if (inval === this.whichMod) {
  //       this.whichMod = -1;
  //     } else {
  //       this.whichMod = inval;
  //     }
  //   }

  //   colorMod(inval: number, premium: string) {
  //     var occurs: number = 0;
  //     var returnVal = 'none';
  //       this.activeMods.forEach((element: number) => {
  //         if (inval === element) {
  //           occurs += 1;
  //         }
  //       });
  //     switch (occurs) {
  //       case 0:
  //         return premium === 'No' ? 'none' : 'no-red'; break;
  //       case 1:
  //         return premium === 'No' ? 'one-black' : 'one-red'; break;
  //       case 2:
  //         return premium === 'No' ? 'two-black' : 'two-red'; break;
  //       case 3:
  //         return premium === 'No' ? 'three-black' : 'three-red'; break;
  //       default: return 'none'; break;
  //     }
  //   }

  //   async modifyItemOne(value: number, mod: string, side: number) {
  //     //side 1 = 1; side 2 = 2
  //     var newModString: any = [];
  //     this.activeMods.forEach((element: string) => {
  //       if (element.toString() !== mod.toString()) {
  //         newModString.push(element);
  //       }
  //     });
  //     for (var a = 0; a < value; a++) {
  //       newModString.push(mod);
  //     }
  //     this.activeMods = newModString;
  //     if (this.whatStep === 1){
  //        this.global.halfOne = newModString;
  //        this.sideOneDescription = await this.buildPizzaLine(this.activeMods);
  //        this.sideOneCost = await this.calculatePizzaCost(this.tempArray, this.global.currentSize);
  //     } else {
  //        this.global.halfTwo = newModString;
  //        this.sideTwoDescription = await this.buildPizzaLine(this.activeMods);
  //        this.sideTwoCost = await this.calculatePizzaCost(this.tempArray, this.global.currentSize);
  //     }
  //     console.log(this.global.halfOne);
  //     console.log(this.global.halfTwo);
  //     this.whichMod = -1;
  //   }

  //   tempArray: any = [];

  //   buildPizzaLine(inArray: any) {
  //     var tempString: string = '';
  //     var tempTemp: any = {};
  //     this.tempArray = [];
  //     inArray.forEach((element: any) => {
  //       var found = false;
  //       var translate = '';
  //       var tx = -1;
  //       this.tempArray.forEach((id: any, index: number) => {
  //         if (element === id.code) {
  //           found = true;
  //           tx = index;
  //         }
  //       });
  //       if (found) {
  //         this.tempArray[tx].count += 1;
  //       } else {
  //         tempTemp = {};
  //         tempTemp.translate = this.translate(element);
  //         tempTemp.premium = this.findPremium(element);
  //         tempTemp.count = 1;
  //         tempTemp.code = element;
  //         this.tempArray.push(tempTemp);
  //       }
  //     });
  //     var tempString = '';
  //     this.tempArray.forEach((line: any) => {
  //       if (line.count === 1) {
  //         tempString += line.translate + ', ';
  //       } else {
  //         tempString += line.count + 'X ' + line.translate + ', ';
  //       }
  //     });
  //     tempString = tempString.slice(0, -2);
  //     return tempString;
  //   }

  //   findPremium(inval: string) {
  //     var value: string = 'No';
  //     this.modDataBase.forEach((element: any) => {
  //       if (element.code === inval) {
  //         value = element.premium;
  //       }
  //     });
  //     return value;
  //   }

  //   translate(inval: string) {
  //     var value: string = '-';
  //     this.modDataBase.forEach((element: any) => {
  //       if (element.code === inval) {
  //         value = element.modifier;
  //       }
  //     });
  //     return value;
  //   }



  //   startValueFind(size: string, basePrices: any, regCount: number, premiumCount: number, gluten: string) {
  //     var returnValue: number = 0;
  //     var premiumPrices: any = this.global.premiumPrices;
  //     var glutenPrices: any = this.global.glutenPrices;
  //     var glutenValue: number = 0;
  //     var premiumValue: number = 0;
  //     switch (size) {
  //       case 'Small':
  //         returnValue = parseFloat(basePrices[regCount].SM.toString());
  //         if ((gluten === 'Gluten') || (gluten === 'Gluten Crust')) {
  //           glutenValue = glutenPrices.SM;
  //         };
  //         premiumValue = premiumCount * premiumPrices.SM;
  //         returnValue += parseFloat(glutenValue.toString()) + parseFloat(premiumValue.toString());
  //         break;
  //       case 'Medium':
  //         returnValue = parseFloat(basePrices[regCount].MD.toString());
  //         if ((gluten === 'Gluten') || (gluten === 'Gluten Crust')) {
  //           glutenValue = glutenPrices.MD;
  //         };
  //         premiumValue = premiumCount * premiumPrices.MD;
  //         returnValue += parseFloat(glutenValue.toString()) + parseFloat(premiumValue.toString());
  //         break;
  //       case 'Large':
  //         returnValue = parseFloat(basePrices[regCount].LG.toString());
  //         if ((gluten === 'Gluten') || (gluten === 'Gluten Crust')) {
  //           glutenValue = glutenPrices.LG;
  //         };
  //         premiumValue = premiumCount * premiumPrices.LG;
  //         returnValue += parseFloat(glutenValue.toString()) + parseFloat(premiumValue.toString());
  //         break;
  //       case 'X-Large':
  //         returnValue = parseFloat(basePrices[regCount].XL.toString());
  //         if ((gluten === 'Gluten') || (gluten === 'Gluten Crust')) {
  //           glutenValue = glutenPrices.XL;
  //         };
  //         premiumValue = premiumCount * premiumPrices.XL;
  //         returnValue += parseFloat(glutenValue.toString()) + parseFloat(premiumValue.toString());
  //         break;
  //     }
  //     return returnValue;
  //   }

  //   async calculatePizzaCost(inArray: any, size: string) {
  //     var cost: number = 0;
  //     var basePrices: any = this.global.buildPrices;
  //     var startValue: number = 0;
  //     var premiumItem: number = 0;
  //     var regularItem: number = 0;
  //     var gluten: string = this.global.currentCrust;
  //     inArray.forEach((element: any) => {
  //       if (element.premium !== 'Yes') {
  //         regularItem += element.count;
  //       } else {
  //         premiumItem += element.count;
  //       }
  //     });
  //     if (basePrices.length === 0) {
  //       startValue = 11.60;
  //     } else {
  //       startValue = await this.startValueFind(size, basePrices, regularItem, premiumItem, gluten);
  //     }
  //     cost = startValue;
  //     return cost;
  //   }

  //   async clickSize(i:number){
  //     this.global.currentSize = this.priceArray[i].size;
  //     this.currentSize = this.priceArray[i].size;
  //     this.currentPizza.title = this.priceArray[i].short+' Half/Half';
  //     this.currentPizza.cost = this.priceArray[i].cost;
  //     this.detailArray.length = 5;
  //     this.detailArray.push(this.priceArray[i].size);
  //     this.itemCost = this.currentPizza.cost;
  //     this.whatStep = 4;
  //     this.buildCrusts();
  //   }

  //   crustArray : any = []; 

  //   buildCrusts() {
  //     this.crustArray = [];
  //     if (this.currentSize === 'Small') {
  //       this.crustArray = [
  //         { "crust": "Regular", "cost": "0" },
  //         { "crust": "Thin", "cost": "0" },
  //         { "crust": "Thick", "cost": "0" },
  //         { "crust": "Gluten Free", "cost": "2.95" },
  //       ]
  //     }
  //     if (this.currentSize === 'Medium') {
  //       this.crustArray = [
  //         { "crust": "Regular", "cost": "0" },
  //         { "crust": "Thin", "cost": "0" },
  //         { "crust": "Thick", "cost": "0" },
  //         { "crust": "Gluten Free", "cost": "3.95" },
  //       ]
  //     }
  //     if ((this.currentSize === 'Large') || (this.currentSize === 'X-Large')) {
  //       this.crustArray = [
  //         { "crust": "Regular", "cost": "0" },
  //         { "crust": "Thin", "cost": "0" },
  //         { "crust": "Thick", "cost": "0" }
  //       ]
  //     }
  //   }

  //   sauceArray : any = [];
  //   clickCrust(index: number) {
  //     this.sauceArray = this.global.sauceArray;
  //     var item : number = parseFloat(this.itemCost.toString());
  //     var theCost :number = parseFloat(this.crustArray[index].cost);
  //     var newTotal : number = parseFloat(this.itemCost.toString()) + theCost;
  //     this.itemCost = newTotal;
  //     this.detailArray.push(this.crustArray[index].crust + ' Crust');
  //     this.currentCrust = this.crustArray[index].crust;
  //     this.global.currentSize = this.currentSize;
  //     this.whatStep = 5;
  //   }

  //   displayCost(inval:number){
  //     if (inval.toString() === '0'){
  //       return '';
  //     } else {
  //       return 'Add $'+parseFloat(inval.toString());
  //     }

  //   }

  //   clickSauce(index: number) {
  //     this.detailArray.push(this.sauceArray[index].sauce + ' Sauce');
  //     this.currentSauce = this.sauceArray[index].sauce;
  //     if (this.currentSauce !== 'Garlic'){
  //       this.whatStep = 6;
  //       this.global.currentSauce = this.currentSauce;
  //     }
  //   }

  //   yesGarlicSauce() {
  //     this.currentSauce = 'Garlic';
  //     this.whatStep = 6;
  //   }

  //   noGarlicSauce() {
  //     this.resetItem(7);
  //   }

  //   addToCart(){
  //     var itemName = this.currentSize + ' '+this.currentPizza.title;
  //     var extraDetail : any = [];
  //     extraDetail.push(itemName);
  //     extraDetail.push('Pizza');
  //     extraDetail.push(this.itemCost);
  //     extraDetail.push(this.currentSauce);
  //     extraDetail.push(this.currentCrust);
  //     extraDetail.push(this.currentPizza.modHold);
  //     extraDetail.push(this.currentPizza.modHold);
  //     this.global.addToCart(itemName,extraDetail);
  //     this.route.navigateByUrl('MENU');
  //   }

}
