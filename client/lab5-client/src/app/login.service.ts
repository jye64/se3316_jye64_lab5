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

  verify(email,password, callbackFunction){



  }
}
