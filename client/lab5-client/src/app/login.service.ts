import { Injectable } from '@angular/core';
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

  verify(email,password, callbackFunction){

    let headers = new Headers();
    headers.append('authentication', this.cookieService.get('verified'));

    this.httpClient.get('/api/login?email='+email+'&password='+password, httpOptions)
      .subscribe(response=>{

      });

  }
}
