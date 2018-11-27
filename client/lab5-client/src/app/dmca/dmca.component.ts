import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent implements OnInit {

  policy = {name:'DMCA',content:''};

  constructor() {
    //load the DMCA policy when the component is rendered


  }

  ngOnInit() {
  }

}
