import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private httpClient: HttpClient) { }

  signUp(email:string, password:string, callBackFunction){

    this.httpClient.post('http://localhost:8081/api/signUp',{
      email:email,
      password:password,
      type:'register'
    }).subscribe(function(res){
      console.log(res);
      callBackFunction(res);
    })

  }

  resend(email:string,password:string,callBackFunction){
    this.httpClient.post('http://localhost:8081/api/signUp',{
      email:email,
      password:password,
      type:'resend'
    }).subscribe(function(res){
      console.log(res);
      callBackFunction(res);
    })
  }
}
