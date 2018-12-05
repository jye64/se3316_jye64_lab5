import { Component, OnInit } from '@angular/core';
import { LoginService} from "../login.service";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService]
})

export class LoginComponent implements OnInit {

  loginMsg:String;
  model: any = {};

  constructor(private loginService:LoginService, private router:Router, private cookieService:CookieService) { }

  onSubmit(){
    this.loginService.verify(this.model.email,this.model.password,this.callBackFunction.bind(this));

    // just for demo purpose since login functionality is not properly implemented
    if(this.model.email == 'alanye1997@gmail.com'){
      this.router.navigateByUrl('/home');
    }
    else if(this.model.email == 'jye64@uwo.ca'){
      this.router.navigateByUrl('/admin');
    }
  }

  ngOnInit(){
    this.loginMsg = '' ;
  }


  callBackFunction(res:string){
    if(JSON.parse(JSON.stringify(res)).message){
      this.loginMsg = JSON.parse(JSON.stringify(res)).message;
      if(this.loginMsg == 'You are already signed in!'){
        this.router.navigateByUrl('/home');
      }
    }
    else{
      this.loginMsg = 'Try again';
    }

  }




}
