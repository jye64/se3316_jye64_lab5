import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent implements OnInit {

  policy:{name:'DMCA',content:''};

  constructor() {
    //load the DMCA policy when the component is rendered

    var request = new Request('/api/dmca',{
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
