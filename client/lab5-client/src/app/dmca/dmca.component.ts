import { Component, OnInit } from '@angular/core';
import { DMCA} from "./DMCA";


@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent implements OnInit {

  policy;

  constructor() {
    //load the DMCA policy when the component is rendered
    var request = new Request('/dmca',{
      method:'GET'
    });

    var here = this;
    fetch(request).then(function(res){
      res.json().then(function(data){
        console.log(data);
        here.policy = data.content;
      });
    }).catch(err=>{
      console.log(err);
    });


  }

  ngOnInit() {

  }

}
