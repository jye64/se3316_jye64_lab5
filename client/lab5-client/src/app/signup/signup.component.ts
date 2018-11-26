import { Component, OnInit } from '@angular/core';
import { SignupService} from "../signup.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[SignupService,CookieService]
})
export class SignupComponent implements OnInit {

  signUpMsg = '';

  constructor(private signUpService:SignupService, private cookieService:CookieService) { }

  ngOnInit() {
  }

  createUser(email,pass){
    this.signUpService.signUp(email, pass, this.callBackFunction.bind(this));
  }

  callBackFunction(res:string){
    console.log(JSON.parse(JSON.stringify(res))._body);
    if(JSON.parse(JSON.stringify(res))._body){
      this.signUpMsg = JSON.parse(JSON.parse(JSON.stringify(res))._body).msg;
    }
  }



}
