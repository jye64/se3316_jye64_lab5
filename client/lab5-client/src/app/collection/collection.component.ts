import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  collections = [];
  show:boolean = false;

  constructor() { }

  ngOnInit() {
    // load public collections when the page is loaded
    this.getCollection();
  }

  //user click the collection name, hence display the details of the item
  showInfo(){
    this.show = !this.show;
  }

  // return public collections on public landing page
  getCollection(){
    var request = new Request('http://localhost:8081/api/publicitems',{
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then( function(resp){
      resp.json().then(function(data) {
        here.collections = data;
      });
    }).catch(err =>{
      console.log(err);
    });

  }

}
