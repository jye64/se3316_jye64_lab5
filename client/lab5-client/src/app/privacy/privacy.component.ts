import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  policy = {name:'privacy', content:''};

  constructor() {
    //load privacy policy when the component is rendered

  }

  ngOnInit() {
  }

}
