import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private global: DataService) { }

    showPass: boolean = true;
    thePassword: string = '';
    createAccount: boolean = false;
    isMember: boolean = this.global.isMember;
    // client: any = {
    //   "first" : "Rob",
    //   "last" : "garby",
    //   "email" : "robgarby@me.com",
    //   "password1" : "123",
    //   "password2" : "123",
    //   "phone" : "6138803625",
    //   "address" : "40 Rue Des Erables",
    // };
    client: any = {};
    signIn: any = {};
    passRed: boolean = false;
    created: boolean = false;
    pickLocationOn: boolean = false;
    isAMember: boolean = false;
    verified: string = 'Yes';
    orderSearch: boolean = false;
    theCart: any = [];
    menuDetail: boolean = false;
    menuDetailMask: boolean = false;
    whichListShowing: string = 'CURRENT';
    hideForgotPop: boolean = true;
    recoverEmail: string = '';


    pickLocation() {
        this.pickLocationOn = !this.pickLocationOn;
    }

    verifiedClassData(inval: string) {
        return this.client.verified === 'No' ? 'btn-warning' : 'btn-success';
    }

    verifiedValue() {
        return this.client.verified === 'No' ? 'No' : 'Yes';
    }

    didLogIn : boolean = false;
    logInAttempted : boolean = false;
    signInButton() {
        let params = new HttpParams;
        let dataBack: any;
        let adminSignin = false;
        if ((this.signIn.email === 'WEST') && (this.signIn.thePassword === '8282')) {
            this.global.adminName = 'WEST-ADMIN';
            adminSignin = true;
            this.router.navigateByUrl('ADMIN');
        }
        if ((this.signIn.email === 'EAST') && (this.signIn.thePassword === '7397')) {
            this.global.adminName = 'EAST-ADMIN';
            adminSignin = true;
            this.router.navigateByUrl('ADMIN');
        }
        if (!adminSignin) {
            this.logInAttempted = true;
            params = params.append('data', JSON.stringify(this.signIn));
            this.http.get('https://www.beneci.com/DATA/signIn.php', { params: params })
                .subscribe(
                    (response) => {
                        dataBack = Object.values(response);
                        var theData: any = dataBack[0];
        
                        if (theData.worked === false) {
                            this.isAMember = false;
                            this.didLogIn = false;
                        } else {
                            this.client = JSON.parse(theData.client);
                            this.cookieService.set('client', JSON.stringify(this.client), 72000);
                            this.global.client = this.client;
                            this.global.changeMember(true);
                            this.didLogIn = true;
                            // do not forget to forward to acocunt on ok
                        }
                    }
                )
        }
    }

    setLocation(inval: any) {
        this.pickLocationOn = !this.pickLocationOn;
        this.client.location = inval.target.value;
    }

    orderComplete: boolean = false;
    adminUser: string = '';

    ngOnInit(): void {
        this.isMember = this.global.isMember;
        this.adminUser = this.global.adminName;
        this.client = {};
        this.signIn = {};
        if (this.cookieService.get('client').length !== 0) {
            this.global.client = JSON.parse(this.cookieService.get('client'));
            this.client = this.global.client;
        } else {
            this.client = {};
        }
        this.global.orderCompleteEmitter.subscribe(
            (response: any) => {
                this.global.orderCompleted = response;
                this.orderComplete = response;
            }
        )
        this.orderComplete = this.global.orderCompleted;
    }

    showHidePass() {
        this.showPass = !this.showPass;
    }

    goToAdmin() {
        this.router.navigateByUrl('ADMIN');
    }

    signOut() {
        this.cookieService.delete('client');
        this.global.isMember = false;
        this.global.memberEmitter.emit(false);
        this.router.navigateByUrl('/');
    }

    clearOrder() {
        this.global.orderCompleteEmitter.emit(false);
    }

    ReadyToGo() {
        return this.points > 5 ? 'bg-success' : 'bg-danger';
    }

    passDoNotMatch(inval: boolean) {
        this.passRed = inval;
    }

    points: number = 0;
    calcPoints() {
        var ok: boolean = false;
        var count: number = 0;
        if (this.client.first !== undefined) {
            if (this.client.first.length > 1) {
                count += 1;
            }
        }
        if (this.client.last !== undefined) {
            if (this.client.last.length > 1) {
                count += 1;
            }
        }
        if (this.client.email !== undefined) {
            if (this.client.email.length > 1) {
                count += 1;
            }
        }
        if ((this.client.password1 !== undefined) && (this.client.password2 !== undefined)) {
            if (this.client.password1 === this.client.password2) {
                count += 1;
                this.passDoNotMatch(false);
            } else {
                this.passDoNotMatch(true);
            }
        }
        if (this.client.phone !== undefined) {
            if (this.client.phone.length > 8) {
                count += 1;
            }
        }
        if (this.client.address !== undefined) {
            if (this.client.address.length > 1) {
                count += 1;
            }
        }
        this.points = count;

    }

    setRose() {
        return this.passRed ? 'bg-rose' : 'bg-white';
    }

    createTheAccount() {
        if (this.points > 5) {
            var dataBack: any;
            let params = new HttpParams;
            params = params.append('data', JSON.stringify(this.client));
            this.http.get('https://www.beneci.com/DATA/createClient.php', { params: params })
                .subscribe(
                    (response) => {
                        dataBack = Object.values(response);
                        var theData: any = dataBack[0];
                        if (theData['worked'] === false) {
                            this.global.changeMember(false);
                            this.global.client = {};
                            this.client = {};
                            this.cookieService.delete('client');
                            this.router.navigateByUrl('/');
                        } else {
                            this.client = JSON.parse(theData['client']);
                            this.global.client = this.client;
                            this.cookieService.set('client', JSON.stringify(this.client), 72000);
                            this.global.changeMember(true);
                            this.router.navigateByUrl('/');
                        }
                    }
                )

        } else {
            this.showErrors()
        }
    }

    showErrors() {
        console.log('in errors');
    }

    saveClient() {
        this.cookieService.set('client', JSON.stringify(this.client), 72000);
        this.global.client = this.client;
        var dataBack: any;
        let params = new HttpParams;
        params = params.append('data', JSON.stringify(this.client));
        this.http.get('https://www.beneci.com/DATA/updateClient.php', { params: params })
            .subscribe(
                (response) => {
                    dataBack = Object.values(response);
                    var theData = dataBack[0];
                    if (this.global.backToCart) {
                        this.global.backToCart = false;
                        this.global.cartShowEmmiter.emit(true);
                        this.global.clientEmitter.emit(this.client);
                        this.router.navigateByUrl('/');
                    } else {
                        this.router.navigateByUrl('/');
                    }
                }
            )
    }
    clientOrders: any = [];
    interval: any = 0;
    loadOrders(inval: string) {
        let params = new HttpParams;
        var dataBack: any;
        params = params.append('client', this.client.ID);
        this.http.get('https://www.beneci.com/DATA/getOrders.php', { params: params })
            .subscribe(
                (response) => {
                    dataBack = Object.values(response);
                    if (inval === 'current') {
                        this.clientOrders = dataBack.filter((data: any) => data.status !== 'Complete');
                        this.whichListShowing = 'CURRENT';
                        if (!this.interval) {
                            this.interval = setInterval(() => {
                                this.clientOrders = [];
                                console.log('fired');
                                this.loadOrders('current');
                            }, 60000);
                        }
                    } else {
                        this.clientOrders = dataBack.filter((data: any) => data.status === 'Complete');
                        this.whichListShowing = 'COMPLETE';
                        if (this.interval) {
                            console.log('cleared');
                            clearInterval(this.interval);
                            this.interval = 0;
                        }
                    }
                    this.orderSearch = true;
                }
            )
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = 0;
            console.log('timer destroyed');
        }
    }

    findFees(one: number, two: number) {
        return parseFloat(one.toString()) + parseFloat(two.toString());
    }

    priceData: any = [];
    orderTax: number = 0;
    orderTotal: number = 0;
    secondSub: number = 0;

    detailOrder(inval: number) {
        console.log(this.clientOrders[inval]);
        this.theCart = JSON.parse(this.clientOrders[inval].theOrder);
        this.priceData = JSON.parse(this.clientOrders[inval].theTotals);
        this.secondSub = this.priceData.sub - this.priceData.discount;
        if (this.secondSub > 3.99) {
            this.orderTax = this.secondSub * .13;
        } else {
            this.orderTax = this.secondSub * .05;
        }
        this.orderTotal = this.orderTax + this.secondSub + this.priceData.processFee + this.priceData.deliveryFee;
        this.menuDetail = true;
        this.menuDetailMask = true;
    }

    closeMenuDetail() {
        this.menuDetailMask = false;
        this.menuDetail = false;
    }

    displayDate(inval: string) {
        var dateInfo = inval.split(' ');
        var yearStuff: any = dateInfo[0].split('-');
        var timeStuff: any = dateInfo[1].split(':');
        var BuildDate = new Date(yearStuff[0], yearStuff[1] - 1, yearStuff[2], timeStuff[0], timeStuff[2]);
        return BuildDate;
    }

    checkStatus(inval: string) {
        switch (inval) {
            case 'Ordered': return 'bg-warning'; break;
            case 'Accepted': return 'orderAccepted'; break;
            case 'Ready': return 'orderReady'; break;
            case 'Delivery': return 'orderDelivery'; break;
            case 'Completed': return 'orderCompleted'; break;
            default: return 'bg-light'; break;
        }
    }

    recoverySent : boolean = false;
    foundBack : boolean = false;

    sendPassword() {
        let params = new HttpParams;
        var dataBack: any;
        params = params.append('email', this.recoverEmail);
        this.http.get('https://www.beneci.com/DATA/recoverPassword.php', { params: params })
            .subscribe(
                (response) => {
                    dataBack = Object.values(response);
                    this.recoverySent = dataBack[0].worked;
                    this.foundBack = true;
                }
            )
    }

    decideSent(){
        return this.recoverySent ? 'alert-success' : 'alert-danger';
    }

    didLogInColor(){
        return this.didLogIn ? 'alert-success' : 'alert-danger';
    }

    goToLogAccount(){
        this.logInAttempted = false; 
        this.didLogIn = !this.didLogIn;
        this.global.isMember = true;
        this.router.navigateByUrl('HOME');
    }


} // this is end of program
