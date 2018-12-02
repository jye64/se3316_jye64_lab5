import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  logs = [];

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.getLogs();
  }

  // Functions take handles log submission, and post a new log to the log section
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

}
