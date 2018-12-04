import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],

})

export class PrivacyComponent implements OnInit {

  policy={name:"privacy",content:""};

  constructor() {
    //load privacy policy when the component is rendered
    var request = new Request('http://localhost:8081/api/privacy',{
      method: 'GET'
    });
    var here = this;
    fetch(request).then( function(resp){
      resp.json().then(function(data) {
        console.log(data);
        here.policy.content = data.content;
      });
    }).catch(err =>{
      console.log(err);
    });

  }

  ngOnInit() {

  }


}



