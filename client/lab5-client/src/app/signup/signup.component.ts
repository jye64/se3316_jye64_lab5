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

  userName = '';
  password = '';
  signUpMsg = '';

  constructor(private signUpService:SignupService, private cookieService:CookieService) { }

  ngOnInit() {
  }

  createUser(){
    this.signUpService.signUp(this.userName, this.password, this.callBackFunction.bind(this));
  }

  callBackFunction(res:string){

  }



}
