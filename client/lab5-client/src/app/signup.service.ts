import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private httpClient: HttpClient) { }

  signUp(email:string, password:string, callBackFunction){

    this.httpClient.post('/api/signUp',{
      email:email,
      password:password,
      type:'register'
    }).subscribe(function(res){
      console.log(res);
      callBackFunction(res);
    })

  }
}
