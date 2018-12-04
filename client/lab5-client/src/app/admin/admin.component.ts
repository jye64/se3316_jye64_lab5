import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  logs = [];
  showDelete:boolean = false;
  showAdd:boolean = false;
  addItemMsg = '';
  deleteItemMsg = '';
  privacyMsg = '';
  dmcaMsg = '';

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.getLogs()
    this.addItemMsg = '';
    this.deleteItemMsg = '';
    this.privacyMsg = '';
    this.dmcaMsg = '';
  }

  toggleDelete(){
    this.showDelete = !this.showDelete;
  }

  toggleAdd(){
    this.showAdd = !this.showAdd;
  }

  // Function handles log submission, and post a new log to the log section
  submitLog(type,content){
    this.httpClient.post('http://localhost:8081/api/log', {
      type:type,
      description:content
    }).subscribe(function (res) {
      console.log(res);
    });
    this.getLogs();

  }

  // retrieve logs from database
  getLogs(){
    var request = new Request('http://localhost:8081/api/log',{
      method:'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then(function(res){
      res.json().then(function(data){
        here.logs = data;
      });
    }).catch(err=>{
      console.log(err);
    });
  }

  // manager delete an item
  deleteItem(name){
    var request = new Request('http://localhost:8081/api/publicitems',{
      method:'DELETE',
      body:JSON.stringify({name: name}),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then(function(res){
      res.json().then(function(data){

      });
    }).catch(err=>{
      console.log(err);
    });

  }

  // manager add a new item
  createItem(name,price,desc){
    this.httpClient.post('http://localhost:8081/api/publicitems', {
      name: name,
      price:price,
      description:desc
    }).subscribe(function (res) {
      console.log(res);
    });
    this.addItemMsg = 'item saved.';
  }


  // update privacy policy
  savePrivacy(content){
    this.httpClient.put('http://localhost:8081/api/privacy',{
      content:content
    }).subscribe(function(res){
      console.log(res);
    })
  }

  // update dmca policy
  saveDMCA(content){
    this.httpClient.put('http://localhost:8081/api/dmca',{
      content:content
    }).subscribe(function(res){
      console.log(res);
    })

  }

}
