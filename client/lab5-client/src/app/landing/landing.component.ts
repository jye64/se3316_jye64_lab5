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
    this.login = true;
    this.loginBtn = false;
  }

  showSignup(){
    this.signup = true;
    this.signupBtn = false;
  }

  showPrivacy(){
    this.privacy = true;
  }

  showDMCA(){
    this.DMCA = true;
  }

  hidePrivacy(){
    this.privacy = false;
  }

  hideDMCA(){
    this.DMCA = false;
  }



}
