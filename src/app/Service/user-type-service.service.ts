import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserTypeClass } from '../Service-Class/user-type-class';

@Injectable({
  providedIn: 'root'
})
export class UserTypeServiceService {

  constructor(private httpClient: HttpClient) { }

  saveUserType(userType:UserTypeClass):Observable<Object>{
    console.log("aasuchi service ku");
    return this.httpClient.post(`${environment.userTypeSaveURl}`,userType);

  }
  saveUserTypeUserAssign(userType:UserTypeClass):Observable<Object>{
    console.log("aasuchi service ku userAssign group sav pain");
    return this.httpClient.post(`${environment.saveUserAssignGroup}`,userType);

  }
  checkDuplicateUserType(userType:UserTypeClass):Observable<Object>{
    console.log("aasuchi service ku");
    return this.httpClient.post(`${environment.checkUserTypeNameURl}`,userType);

  }
  getUserType():Observable<UserTypeClass[]>{
    return this.httpClient.get<UserTypeClass[]>(`${environment.getUserTypeURl}`);
  }
  getUserTypeId(userTypeId:number):Observable<UserTypeClass>{
    return this.httpClient.get<UserTypeClass>(`${environment.getUserTypeByIdURl}/${userTypeId}`);
  }
  getUserTypeForUserWiseAssignDetails(userAccessId:number):Observable<UserTypeClass>{
    return this.httpClient.get<UserTypeClass>(`${environment.getUserTypeByUserAccessURl}/${userAccessId}`);
  }
  changeUserTypeStatus(userTypeId:number,language:string):Observable<UserTypeClass[]>{
    return this.httpClient.get<UserTypeClass[]>(`${environment.changeUserTypeStatusByIdURl}`+"?userTypeId="+userTypeId+"&language="+language);
  }
  
  updateUserType(userType:UserTypeClass):Observable<Object>{
    console.log("aasuchi service ku");
    return this.httpClient.post(`${environment.updateUserTypeSaveURl}`,userType);

  }
}
