import { Component, OnInit } from '@angular/core';
import { DMCA} from "./DMCA";


@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent implements OnInit {

  policy={name:"DMCA",content:""};

  constructor() {
    //load privacy policy when the component is rendered
    var request = new Request('http://localhost:8081/api/dmca',{
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
