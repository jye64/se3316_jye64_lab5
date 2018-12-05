import { Component, OnInit } from '@angular/core';
import { SignupService} from "../signup.service";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[SignupService,CookieService]
})
export class SignupComponent implements OnInit {

  signUpMsg = '';
  model: any = {};

  onSubmit(){
    this.signUpService.signUp(this.model.email,this.model.password,this.callBackFunction.bind(this));
  }

  constructor(private signUpService:SignupService, private cookieService:CookieService, private route:Router) { }

  ngOnInit() {
  }


  callBackFunction(res:string){
    console.log(JSON.parse(JSON.stringify(res))._body);
    if(JSON.parse(JSON.stringify(res))._body){
      this.signUpMsg = JSON.parse(JSON.parse(JSON.stringify(res))._body).msg;
    }
  }

  resend(){
    this.signUpService.resend(this.model.email,this.model.password,this.callBackFunction.bind(this));
  }



}
