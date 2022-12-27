import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UserAccountClass } from '../Service-Class/user-account-class';
import {environment} from 'src/environments/environment';





@Injectable({
  providedIn: 'root'
})

export class UserAccountService {
  // private typeOfUserURL="http://localhost:8080/api/getTypeOfUserDetails";
  // private userGroupURL="http://localhost:8080/api/getUserGroupDetails";
  // private permissionsURL="http://localhost:8080/api/getPermissionsDetails";
  // private operationsURL="http://localhost:8080/api/getOperationsDetails";
  // private featuresURL="http://localhost:8080/api/getFeaturesDetails";
  constructor(private httpClient: HttpClient) { }
  getTypeOfUserList():Observable<UserAccountClass[]>{
    return this.httpClient.get<UserAccountClass[]>(`${environment.typeOfUserURL}`);
  }
  getUserGroupDetailsList():Observable<UserAccountClass[]>{
    return this.httpClient.get<UserAccountClass[]>(`${environment.userGroupURL}`);
  }
  getPermissionsDetailsList():Observable<UserAccountClass[]>{
    return this.httpClient.get<UserAccountClass[]>(`${environment.permissionsURL}`);
  }
  getOperationsetailsList():Observable<UserAccountClass[]>{
    return this.httpClient.get<UserAccountClass[]>(`${environment.operationsURL}`);
  }
  getFeaturesList():Observable<UserAccountClass[]>{
    return this.httpClient.get<UserAccountClass[]>(`${environment.featuresURL}`);
  }
}
