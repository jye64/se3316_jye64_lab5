import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  login:boolean = false;
  signup:boolean = false;
  privacy:boolean = false;
  DMCA:boolean = false;

  loginBtn:boolean = true;
  signupBtn:boolean = true;

  constructor() { }

  ngOnInit() {
  }

  showLogin(){
    this.login = !this.login;
    this.loginBtn = !this.loginBtn;
  }

  showSignup(){
    this.signup = !this.signup;
    this.signupBtn = !this.signupBtn;
  }

  showPrivacy(){
    this.privacy = !this.privacy;
  }

  showDMCA(){
    this.DMCA = !this.DMCA;

  }



}
