import { Component, OnInit } from '@angular/core';
import { LoginService} from "../login.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService]
})

export class LoginComponent implements OnInit {

  loginMsg:String;

  constructor(private loginService:LoginService, private router:Router) { }

  ngOnInit(){
    this.loginMsg = '' ;
  }


  login(email,pass,check,code){
    this.loginService.verify(email,pass, this.callBackFunction.bind(this));

  }

  callBackFunction(res:string){
    if(JSON.parse(JSON.stringify(res)).message){
      this.loginMsg = JSON.parse(JSON.stringify(res)).message;
    }
    else{
      this.loginMsg = 'You are signed in';
    }
    // this.router.navigateByUrl('/home');
  }




}
