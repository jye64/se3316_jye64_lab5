import { Injectable } from '@angular/core';
import { CookieService} from "ngx-cookie-service";
import { HttpClientModule } from '@angular/common/http';



@Injectable({
  providedIn: 'root',

})


export class LoginService {


  constructor(private httpClient:HttpClientModule, private cookieService:CookieService) { }

  verify(email,password, callbackFunction){

    let headers = new Headers();
    headers.append('authentication', this.cookieService.get('verified'));








  }
}
