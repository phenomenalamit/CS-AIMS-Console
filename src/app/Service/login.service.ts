import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginClass } from '../Service-Class/login-class';
import { ChangePassword } from '../Service-Class/change-password';
import { UserAccessClass } from '../Service-Class/user-access-class';

@Injectable({
  providedIn: 'root'
})


export class LoginService {
  getEmailIdOfUser(userName:string):Observable<String>{
    return this.httpClient.get<String>(`${environment.getEmailOfUser}`+"?userName="+userName);
  }
  
  
  constructor(private httpClient: HttpClient) { }

  

  loginUser(loginClass:LoginClass):Observable<Object>{
    console.log("aasuchi service ku login pain");
    return this.httpClient.post(`${environment.loginUserUrl}`,loginClass);

  }
  firstTimeLoginUser(changePassword:ChangePassword):Observable<Object>{
    return this.httpClient.post(`${environment.firstTimeloginUserUrl}`,changePassword);

  }
  getToken(tokenRequestBody):Observable<Object>{
    return this.httpClient.post(`${environment.getToken}`,tokenRequestBody,{headers:{skip:"true"}});
  }
  getExpirationTimeMilliToken(token:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.getExpirationTimeMilliToken}`+"?token="+token);
  }

  userIdPasswordValidation(loginClass):Observable<Object>{
    console.log("aasuchi service ku login pain");
    return this.httpClient.post(`${environment.userIdPasswordValidateUrl}`,loginClass,{headers:{skip:"true"}});

  }

  captchaValidation(loginClass):Observable<Object>{
    console.log("aasuchi service ku login pain",loginClass);
    return this.httpClient.post(`${environment.captchaValidateUrl}`,loginClass,{headers:{skip:"true"}});

  }
}
