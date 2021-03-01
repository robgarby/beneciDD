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
  isAMember : boolean = false;


  pickLocation() {
    this.pickLocationOn = !this.pickLocationOn;
  }

  signInButton() {
    let params = new HttpParams;
    let dataBack : any;
    params = params.append('data', JSON.stringify(this.signIn));
    this.http.get('https://www.beneci.com/DATA/signIn.php', { params: params })
      .subscribe(
        (response) => {
          dataBack = Object.values(response);
          if (dataBack[0]['worked'] === false) {
              this.isAMember = false;
          } else {
            this.client = JSON.parse(dataBack[0].client);
            console.log(this.client);
            this.cookieService.set('client', JSON.stringify(this.client), 72000);
            this.global.client = this.client;
            this.global.changeMember(true);
            this.router.navigateByUrl('/');
          }
        }
      )
  }

  setLocation(inval: any) {
    this.pickLocationOn = !this.pickLocationOn;
    this.client.location = inval.target.value;
  }

  ngOnInit(): void {
    this.isMember = this.global.isMember;
    this.client = this.global.client;
  }

  showHidePass() {
    this.showPass = !this.showPass;
  }

  signOut() {
    this.cookieService.delete('client');
    this.global.isMember = false;
    this.global.memberEmitter.emit(false);
    this.router.navigateByUrl('/');

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
            if (dataBack[0]['worked'] === false) {
              this.global.changeMember(false);
              this.cookieService.delete('client');
              this.router.navigateByUrl('/');
            } else {
              this.client.ID = dataBack[0]['ID'];
              delete this.client.password1;
              delete this.client.password2;
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
    console.log('here');
  }

  saveClient() {
    this.cookieService.set('client', JSON.stringify(this.client), 72000);
    this.global.client = this.client;
  }

}
