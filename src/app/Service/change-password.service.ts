import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePassword } from '../Service-Class/change-password';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private httpClient: HttpClient) { }

  changePassword(changePasswordClass:ChangePassword):Observable<Object>{
    return this.httpClient.post(`${environment.changePassword}`,changePasswordClass);
  }

  saveFirstTimeLoginUserDetails(changePasswordClass:ChangePassword):Observable<Object>{
    console.log("aasuchi service ku firstTimeLogin password change pain");
    return this.httpClient.post(`${environment.resetFirstTimeLoginUserPassword}`,changePasswordClass);
}
}
