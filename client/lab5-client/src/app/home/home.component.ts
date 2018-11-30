import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  collections;
  carts;
  show:boolean = false;

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.getCollection();
    this.getCart();
  }

  showInfo(){
    this.show = !this.show;
  }

  //return user collection from userItems
  getCollection(){
    var request = new Request('http://localhost:8081/api/useritems',{
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


  addToCart(name,quan){
    this.httpClient.post('http://localhost:8081/api/addCart',{
      name:name,
      quantity:quan,
    }).subscribe(function(res){
      console.log(res);
    })
    this.ensureStock(name,quan);
    this.updateView();
  }

  clearCart(){

  }

  updateQuan(name,quan){

  }

  //not working
  deleteItem(name){
    var request = new Request('http://localhost:8081/api/addCart',{
      method: 'DELETE',
      body: JSON.stringify({name:name}),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    this.updateView();
  }

  updateView(){
    var request = new Request('http://localhost:8081/api/addCart',{
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then( function(resp){
      resp.json().then(function(data) {
        here.carts = data;
      });
    }).catch(err =>{
      console.log(err);
    });
  }

  //return the stored shopping cart items
  getCart(){
    var request = new Request('http://localhost:8081/api/addCart',{
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then( function(resp){
      resp.json().then(function(data) {
        here.carts = data;
      });
    }).catch(err =>{
      console.log(err);
    });
  }

  // track stock level, update quantity in userItems
  ensureStock(name,quan){

  }

}
