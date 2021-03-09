import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private global: DataService, private router: Router, private cookie: CookieService) { }
    title = 'BeneciDD';

    dropShown = false;
    showLocation = '';
    cartTotal = 0;
    showCart: boolean = false;
    theCart: any = this.global.theCart;
    showNavBar: boolean = true;
    siteLink: any = this.global.siteLinks;
    hideMenu: boolean = true;
    theDetails: any = [];
    isUp: number = -1;
    isMember: boolean = false;
    memberStatus = 'Sign In';
    cartStep: any = [];
    processData: any = {};
    theClient: any = [];
    orderComplete: boolean = false;
    showCartButton: boolean = false;

    displayMember() {
        return this.isMember ? 'Account' : 'Sign In';
    }

    ngOnInit() {
        this.showLocation = this.global.theLocation;
        this.global.cartEmitter.subscribe(
            (response: boolean) => {
                this.global.theCart = response;
                this.theCart = response;
            }
        )
        this.global.cartTotalEmitter.subscribe(
            (response: number) => {
                this.cartTotal = response;
                this.global.theCartTotal = response;
            }
        )
        this.global.showNavBarEmitter.subscribe(
            (response: boolean) => {
                this.showNavBar = response;
            }
        )
        this.global.menuEmitter.subscribe(
            (response: boolean) => {
                this.global.theMenu = response;
            }
        )
        this.global.cartShowEmmiter.subscribe(
            (response: boolean) => {
                this.showCart = response;
            }
        )
        this.global.memberEmitter.subscribe(
            (response: boolean) => {
                this.isMember = response;
            }
        )
        this.global.clientEmitter.subscribe(
            (response: any) => {
                this.theClient = response;
            }
        )
        this.global.showCartButtonEmitter.subscribe(
            (response: any) => {
                this.showCartButton = response;
                console.log(this.showCartButton);
            }
        )
        this.global.orderCompleteEmitter.subscribe(
            (response: any) => {
                this.orderComplete = response;
                this.global.orderCompleted = response;
            }
        )
        if (this.cookie.get('client').length !== 0) {
            this.global.client = JSON.parse(this.cookie.get('client'));
            this.global.memberEmitter.emit(true);
            this.isMember = true;
            this.global.isMember = true;
        } else {
            this.global.memberEmitter.emit(false);
            this.isMember = false;
            this.global.isMember = false;
        }
        this.global.getAllMods();
        this.global.getFullBase();
        this.global.getMenu();
        this.showCart = this.global.showCart;
        this.theClient = this.global.client;
        this.cartStep = [];
    }

    createAccount() {
        this.showCartFunction();
        this.router.navigateByUrl('LOGIN');
    }

    goToLink(link: string) {
        this.router.navigateByUrl(link);
    }

    goToLinkBurger(link: string) {
        this.hideMenu = !this.hideMenu;
        this.router.navigateByUrl(link);
    }

    navigateClick(link: string) {
        this.router.navigateByUrl('/');
    }

    showCartFunction() {
        this.global.showHideCart();
        this.theClient = this.global.client;
    }

    showMenu() {
        this.hideMenu = !this.hideMenu;
    }

    showMenuClicked() {
        return !this.hideMenu ? 'text-warning' : 'text-white';
    }

    calcTotal() {
        var total: number = 0;
        this.theCart.forEach((element: any) => {
            total += parseFloat(element.cost.toString());
        });
        return total;
    }

    navToLogIn() {
        this.router.navigateByUrl('LOGIN');
    }

    keepShoppingButton() {
        this.showCartFunction();
    }

    calcTax() {
        var total: number = 0;
        this.theCart.forEach((element: any) => {
            total += parseFloat(element.cost.toString());
        });
        if (total > 3.99) {
            return total * .13;
        } else {
            return total * .05;
        }
    }

    calcTaxNew() {
        var taxable: number = this.taxable();
        if (taxable > 3.99) {
            return taxable * .13;
        } else {
            return taxable * .05;
        }
    }

    checkSpecial(inval: string) {
        if (inval === 'SIDE ONE ITEMS') {
            return '<---SIDE ONE ITEMS--->';
        }
        if (inval === 'SIDE TWO ITEMS') {
            return '<---SIDE TWO ITEMS--->';
        }
        return inval;
    }

    removeItem(i: number) {
        this.theCart.splice(i, 1);
        this.global.theCartTotal = this.theCart;
        if (this.theCart.length === 0) {
            this.global.showCartButton = false;
            this.global.showCartButtonEmitter.emit(this.global.showCartButton);
            this.global.showCart = false;
            this.global.cartShowEmmiter.emit(this.global.showCart);
        }
    }

    calcGrandTotal() {
        var grandTotal: number = 0;
        var taxable: number = this.taxable();
        var taxes: number = this.calcTaxNew();
        var processFee: number = this.processFee()
        var deliveryFee: number = this.deliveryFee()
        grandTotal = taxable + taxes + processFee + deliveryFee;
        return grandTotal;
    }

    whatItem: number = -1;

    inspectItem(i: number) {
        this.theDetails = this.theCart[i].detail;
        if (this.whatItem === i) {
            this.whatItem = -1;
        } else {
            this.whatItem = i;
        }

    }

    checkExtra(i: number) {
        return this.theCart[i].length === 0 ? true : false;
    }

    isLoggedIn: boolean = this.global.isLoggedIn;

    checkColorLogin() {
        return this.isMember ? 'member' : 'notMember';
    }

    startCheckOut() {
        this.cartStep = [
            "Method",
            "Location",
            "Address",
            "Payment",
            "AllDone"
        ]
    }

    checkEmptyProcess() {
        return this.cartStep.length === 0 ? false : true;
    }

    checkShow(inval: string) {
        return this.cartStep[0] === inval ? false : true;
    }

    processStep(inval: string, data: any) {
        this.theClient = this.global.client;
        switch (inval) {
            case 'Method':
                this.processData.method = data;
                this.cartStep.shift();
                break;
            case 'Location':
                this.processData.location = data;
                this.cartStep.shift();
                if (this.processData.method !== 'Delivery') {
                    this.cartStep.shift();
                }
                break;
            case 'Address':
                if (data === 'CHANGE') {
                    this.global.backToCart = true;
                    this.global.cartShowEmmiter.emit(false);
                    this.router.navigateByUrl('LOGIN');
                } else {
                    this.processData.address = this.theClient.address;
                    this.processData.appt = this.theClient.appt;
                    this.processData.phone = this.theClient.phone;
                    this.processData.client = this.theClient;
                    this.cartStep.shift();
                }
                break;
            case 'Payment':
                this.processData.payment = data;
                this.cartStep.shift();
                break;
            default:
                console.log('error');
                break;
        }
    }

    checkCartLength() {
        console.log(this.theCart.length);
        return this.theCart.length === 0 ? false : true;
    }

    restartOrder() {
        this.cartStep = [];
    }

    findDiscount() {
        var discount = 0;
        var dayOfWeek: number = -1;
        var theDate: Date = new Date();
        var fiftyDiscount: number = 0;
        var walkinDiscount: number = 0;
        if (this.processData.method !== 'Delivery') {
            dayOfWeek = theDate.getDay();
            var pizzaArray: any = [];
            if (dayOfWeek < 3) {
                var pizzaCount: number = 0;
                this.theCart.forEach((element: any) => {
                    if (element.catagory === 'pizza') {
                        pizzaCount += 1;
                        pizzaArray.push(element);
                    }
                });
                if (pizzaCount > 1) {
                    var lowPrice = 100;
                    pizzaArray.forEach((pp: any) => {
                        if (pp.cost < lowPrice) {
                            lowPrice = pp.cost;
                        }
                    });
                    discount = lowPrice / 2;
                    fiftyDiscount = discount;
                }
            } else {
                var pizzaTenTotal: number = 0
                this.theCart.forEach((element: any) => {
                    if (element.catagory === 'pizza') {
                        pizzaTenTotal += element.cost;
                    }
                });
                walkinDiscount = pizzaTenTotal * .1;
            }
            if (fiftyDiscount > walkinDiscount) {
                discount = fiftyDiscount;
            } else {
                discount = walkinDiscount;
            }
        }
        return discount;
    }

    processFee() {
        if (this.processData.method === 'Delivery') {
            if (this.processData.location === 'WEST') {
                return 1.50;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    deliveryFee() {
        if (this.processData.method === 'Delivery') {
            return 0;
        } else {
            return 0;
        }
    }

    taxable() {
        var subTotal: number = this.calcTotal();
        var discount: number = this.findDiscount();
        var taxable: number = subTotal - discount;
        return taxable;
    }

    placeTheOrder() {
        var totals: any = {};
        this.cartStep = [];
        var subTotal: number = this.calcTotal();
        var discount: number = this.findDiscount();
        var processFee: number = this.processFee()
        var deliveryFee: number = this.deliveryFee()
        totals.sub = subTotal;
        totals.discount = discount;
        totals.processFee = processFee;
        totals.deliveryFee = deliveryFee;
        this.global.printIt(this.theCart, this.processData, totals, this.theClient);
        this.global.theCart = [];
        this.global.theCartTotal = 0;
    }

}
