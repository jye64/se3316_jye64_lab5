import { Injectable, NgModule } from '@angular/core';
import { CookieService} from "ngx-cookie-service";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
  })
};

@Injectable({
  providedIn: 'root',

})

export class LoginService {

  constructor(private httpClient:HttpClient, private cookieService:CookieService) { }

  verify(email,password, callBackFunction){
    var request = new Request('http://localhost:8081/api/login?email='+email+'&password='+password,{
      method:'GET',
      headers: new Headers({
        type:'authentication',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Control-Allow-Origin':'*'
      })
    });
    var here = this;
    fetch(request).then(function(res){
      res.json().then(function(data){
        callBackFunction(data);
      });
    }).catch(err=>{
      console.log(err);
    });
  }
}
