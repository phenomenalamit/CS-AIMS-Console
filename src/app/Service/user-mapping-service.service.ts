import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserMappingClass } from '../Service-Class/user-mapping-class';

@Injectable({
  providedIn: 'root'
})
export class UserMappingServiceService {

  constructor(private httpClient: HttpClient) { }

  getUserNameList():Observable<UserMappingClass[]>{
    return this.httpClient.get<UserMappingClass[]>(`${environment.UserAccountDetailsURl}`);
  }
  
  getUserTypeList():Observable<UserMappingClass[]>{
    return this.httpClient.get<UserMappingClass[]>(`${environment.getUserTypeURl}`);
  }
  saveUserMapping(userMapping:UserMappingClass):Observable<Object>{
    if(userMapping.fundingOrganization==null || userMapping.fundingOrganization==undefined
      || userMapping.fundingOrganization.length==0)
      {
        userMapping.fundingOrganization=null;
      }
    return this.httpClient.post(`${environment.userMappingSaveURl}`,userMapping);

  }
  checkDuplicateUser(userMapping:UserMappingClass):Observable<Object>{
    userMapping.fundingOrganization=null;
    return this.httpClient.post(`${environment.userMappingDuplicateUserURl}`,userMapping);

  }
  updateUserMapping(userMapping:UserMappingClass):Observable<Object>{
    return this.httpClient.post(`${environment.userMappingUpdateURl}`,userMapping);
  }
  getUserMappingDetails():Observable<UserMappingClass[]>{
    return this.httpClient.get<UserMappingClass[]>(`${environment.getUserMappingURl}`);
  }
  getUserMappingObjectById(userMappingId:number):Observable<UserMappingClass>{
    return this.httpClient.get<UserMappingClass>(`${environment.getUserMappingByIdURl}/${userMappingId}`);
  }
  getUserTypeById(userAccessId:number):Observable<UserMappingClass>{
    return this.httpClient.get<UserMappingClass>(`${environment.getUserTypeIdURl}/${userAccessId}`);
  }
  changeUserMappingStatus(userMappingId:number):Observable<UserMappingClass[]>{
    return this.httpClient.get<UserMappingClass[]>(`${environment.changeUserMappingStatusByIdURl}/${userMappingId}`);
  }
}
