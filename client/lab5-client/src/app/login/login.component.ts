import { Component, OnInit } from '@angular/core';
import { LoginService} from "../login.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService]
})

export class LoginComponent implements OnInit {

  email:'';
  password:'';
  loginMsg:String;

  constructor(private loginService:LoginService) { }

  ngOnInit(){
    this.loginMsg = '' ;
  }


  login(email,pass){
    this.loginService.verify(email,pass, this.callBackFunction.bind(this));
  }

  callBackFunction(res:string){
    if(JSON.parse(JSON.stringify(res)).message){
      this.loginMsg = JSON.parse(JSON.stringify(res)).message;
    }
    else{
      this.loginMsg = 'You are signed in';

    }
  }




}
