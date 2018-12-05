import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {


  model: any = {};
  collections= [];
  show:boolean = false;

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.getCollections();
  }

  showInfo(){
    this.show = !this.show;
  }

  add(){
    var pub:boolean;
    if(this.model.privacy){
      pub = false;
    }else{
      pub = true;
    }
    this.httpClient.post('http://localhost:8081/api/collections', {
      name: this.model.name,
      description: this.model.description,
      privacy:pub
    }).subscribe(function (res) {
      console.log(res);
    })
  }

  getCollections(){
    var request = new Request('http://localhost:8081/api/collections', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      })
    });
    var here = this;
    fetch(request).then(function (resp) {
      resp.json().then(function (data) {
        here.collections = data;
      });
    }).catch(err => {
      console.log(err);
    });

  }

}
