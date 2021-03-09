import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class ADMINComponent implements OnInit {

    constructor(private global: DataService, private router: Router, private http: HttpClient) { }
    theUser: any = [
        { "user": "SAM-ADMIN", "location": "WEST", "security": "1" },
        { "user": "NAT-ADMIN", "location": "EAST", "security": "1" },
        { "user": "WEST-ADMIN", "location": "WEST", "security": "100" },
        { "user": "EAST-ADMIN", "location": "EAST", "security": "100" },
    ]
    logginName: string = '';
    currentLogin: any = [];

    ngOnInit(): void {
        this.isTimer();
        this.logginName = this.global.adminName;
        var found = false;
        var foundAt = -1;
        this.theUser.forEach((element: any, i: number) => {
            if (element.user === this.logginName) {
                found = true;
                foundAt = i;
            }
        });
        if (!found) {
            this.router.navigateByUrl('HOME');
        } else {
            this.currentLogin = this.theUser[foundAt];
        }
        this.loadOrders();

    }

    clientOrders: any = [];
    orderDetails: any = [];
    clientDetails: any = [];
    StatusPopupVisible: boolean = false;
    heldIndex: number = -1;
    showNewOrder = false;
    showCountNewOrder: number = 0;

    loadOrders() {
        let params = new HttpParams;
        var dataBack: any;
        params = params.append('location', this.currentLogin['location']);
        this.http.get('https://www.beneci.com/DATA/getAdminOrders.php', { params: params })
            .subscribe(
                (response) => {
                    dataBack = Object.values(response);
                    this.clientOrders = dataBack;
                    let countOfNew: number = 0;
                    this.clientOrders.forEach((element: any) => {
                        if (element.status === 'Ordered') {
                            countOfNew += 1;
                        }
                    });
                    if (countOfNew > 0) {
                        this.showNewOrder = true;
                        this.showCountNewOrder = countOfNew;
                    }
                }
            )
    }

    changeStatus(i: number) {
        this.heldIndex = i;
        this.StatusPopupVisible = !this.StatusPopupVisible;
    }

    saveStatus(inval: string) {
        this.StatusPopupVisible = !this.StatusPopupVisible;
        this.clientOrders[this.heldIndex].status = inval;
        let params = new HttpParams;
        var dataBack: any;
        params = params.append('order', JSON.stringify(this.clientOrders[this.heldIndex]));
        this.http.get('https://www.beneci.com/DATA/updateStatus.php', { params: params })
            .subscribe(
                (response) => {
                    dataBack = Object.values(response);
                    console.log(dataBack);
                }
            )
    }

    colorOfButton(inval: string) {
        switch (inval) {
            case 'Ordered': return 'bg-warning'; break;
            case 'Accepted': return 'orderAccepted'; break;
            case 'Ready': return 'orderReady'; break;
            case 'Delivery': return 'orderDelivery'; break;
            case 'Completed': return 'orderCompleted'; break;
            case 'Pickup': return 'pickup'; break;
            default: return 'bg-light'; break;
        }
    }

    findDelPick(i: number) {
        var useOrder = this.clientOrders[i];
        var undo = JSON.parse(useOrder['theClient'])
        return undo.method;

    }

    displayDate(inval: string) {
        var dateInfo = inval.split(' ');
        var yearStuff: any = dateInfo[0].split('-');
        var timeStuff: any = dateInfo[1].split(':');
        var BuildDate = new Date(yearStuff[0], yearStuff[1] - 1, yearStuff[2], timeStuff[0], timeStuff[2]);
        return BuildDate;
    }

    findFees(one: number, two: number) {
        return parseFloat(one.toString()) + parseFloat(two.toString());
    }

    theCounter: number = 0;
    interval: any = 0;

    isTimer() {
        this.interval = setInterval(() => {
            this.theCounter += 1;
            this.clientOrders = [];
            this.loadOrders();
        }, 240300);
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    actualOrder: any = [];
    showAllDetails: boolean = false;
    localClientDetails: any = [];
    localClientOrder: any = [];
    showDetails(i: number) {
        console.log(this.clientOrders[i]);
        this.actualOrder = this.clientOrders[i];
        this.localClientDetails = JSON.parse(this.actualOrder['actualClient']);
        this.localClientOrder = JSON.parse(this.actualOrder['theOrder']);
        this.showAllDetails = true;
    }

    rePrint(inval: any) {
        console.log(inval);
        var cart = JSON.parse(inval['theOrder']);
        var totals = JSON.parse(inval['theTotals']);
        var client = JSON.parse(inval['theClient'])
        let params = new HttpParams;
        params = params.append('cart', JSON.stringify(cart));
        params = params.append('totals', JSON.stringify(totals));
        params = params.append('client', JSON.stringify(client));
        this.http.get('https://www.beneci.com/DATA/parseNoDB.php', { params: params })
            .subscribe(
                (response) => {
                    var theResponse: any = Object.values(response);
                    var didwork = theResponse[0].worked;
                }
            )
    }

    theDetails: any = [];
    whatItem: number = -1;

    inspectItem(i: number) {
        this.theDetails = this.localClientOrder[i].detail;
        if (this.whatItem === i) {
            this.whatItem = -1;
        } else {
            this.whatItem = i;
        }
    }

    checkExtra(i: number) {
        return this.localClientOrder[i].length === 0 ? true : false;
    }

    checkIsDetail(i:number){
        return this.localClientOrder[i].detail.length === 0 ? 'bg-secondary' : 'bg-success';
    }

    countSubs(i:number){
        return this.localClientOrder[i].detail.length;
    }

}
