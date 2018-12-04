import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  collections= [];
  carts = [];
  show: boolean = false;
  showCreate:boolean = false;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.getCollection();
    this.updateCart();
  }

  showInfo() {
    this.show = !this.show;
  }

  toggleCreate(){
    this.showCreate = !this.showCreate;
  }

  // return user collection from userItems
  getCollection() {
    var request = new Request('http://localhost:8081/api/useritems', {
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

  // add item to shopping cart
  addToCart(name, quan) {
    this.httpClient.post('http://localhost:8081/api/addCart', {
      name: name,
      quantity: quan,
    }).subscribe(function (res) {
      console.log(res);
    })
    //this.ensureStock(name, quan);
    this.updateCart();
  }

  // clear shopping cart
  clearCart() {
    fetch('http://localhost:8081/api/addCart/clear',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'}
    });
    this.updateCart();
  }

  // update item quantity in cart
  updateQuan(name, quan) {
    this.httpClient.put('http://localhost:8081/api/addCart', {
      name: name,
      quantity: quan,
    }).subscribe(function (res) {
      console.log(res);
    })
    this.updateCart();
  }

  // delete single item in cart
  deleteItem(name) {
    fetch('http://localhost:8081/api/addCart',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name})
    });
    this.updateCart();
  }

  // update cart view
  updateCart() {
    var request = new Request('http://localhost:8081/api/addCart', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      })
    });
    var here = this;
    fetch(request).then(function (resp) {
      resp.json().then(function (data) {
        here.carts = data;
      });
    }).catch(err => {
      console.log(err);
    });
  }


  // track stock level, update quantity in userItems
  ensureStock(name, quan) {

  }

  buy() {
  }

  // not working
  submitRating(name,rate){
    fetch('http://localhost:8081/api/useritems/rating',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name,rating:rate})
    });

  }

  // not working
  submitComment(name,comment){
    fetch('http://localhost:8081/api/useritems/comment',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name,comment:comment})
    });
  }

  // not working
  createItem(name,desc){

  }


}

