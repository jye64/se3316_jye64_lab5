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

  constructor() { }

  ngOnInit() {
  }

  showLogin(){
    this.login = !this.login;
  }

  showSignup(){
    this.signup = !this.signup;
  }

  showPrivacy(){
    this.privacy = !this.privacy;
  }

  showDMCA(){
    this.DMCA = !this.DMCA;

  }



}
