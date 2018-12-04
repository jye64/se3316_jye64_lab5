import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  logs = [];
  collections = [];

  showDelete:boolean = false;
  showAdd:boolean = false;
  addItemMsg = '';
  deleteItemMsg = '';
  privacyMsg = '';
  dmcaMsg = '';
  submitLogMsg ='';

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.getLogs()
    this.addItemMsg = '';
    this.deleteItemMsg = '';
    this.privacyMsg = '';
    this.dmcaMsg = '';
    this.submitLogMsg = '';
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
    this.submitLogMsg = 'log submitted';
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


  searchCollection(name){


  }

  // manager delete the public items
  deleteItem(name){
    fetch('http://localhost:8081/api/publicitems',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:name})
    });
    this.deleteItemMsg = 'item deleted';
  }

  // manager add a new public item
  createItem(name,price,desc){
    var here = this;
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
    });
    this.privacyMsg = 'privacy policy updated';
  }

  // update dmca policy
  saveDMCA(content){
    this.httpClient.put('http://localhost:8081/api/dmca',{
      content:content
    }).subscribe(function(res){
      console.log(res);
    });
    this.dmcaMsg = 'dmca policy updated';
  }



  toggleDelete(){
    this.showDelete = !this.showDelete;
  }

  toggleAdd(){
    this.showAdd = !this.showAdd;
  }

}
