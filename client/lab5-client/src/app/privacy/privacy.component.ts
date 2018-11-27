import { Component, OnInit } from '@angular/core';
import { Privacy} from "./privacy";



@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {

  policy:{name:'privacy',content:''};

  constructor() {

    var request = new Request('/api/privacy',{
      method: 'GET'
    });
    var tt = this;
    fetch(request).then( function(resp){
      resp.json().then(function(data) {
        console.log(data);
        tt.policy.content = data.content;

      });
    }).catch(err =>{
      console.log(err);
    });

  }


  ngOnInit() {

  }
}



