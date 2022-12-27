import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccessClass } from '../Service-Class/user-access-class';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserAccessClassService {

  

  constructor(private httpClient :HttpClient) { }

  

  getUserTypeList():Observable<UserAccessClass[]>{
    return this.httpClient.get<UserAccessClass[]>(`${environment.getUserTypeURl}`);
  }
  saveUserAccess(userAccess:UserAccessClass):Observable<Object>{
    return this.httpClient.post(`${environment.userAccessSaveURl}`,userAccess);
  }
  checkDuplicateUserName(userAccess:UserAccessClass):Observable<Object>{
    console.log("aasuchi service ku duplicate UserName check pain");
    return this.httpClient.post(`${environment.checkUserNameDuplicateValues}`,userAccess);

  }
  checkDuplicateEmail(userAccess:UserAccessClass):Observable<Object>{
   
    return this.httpClient.post(`${environment.checkEmailDuplicateValues}`,userAccess);

  }
  updateUserAccess(userAccess:UserAccessClass):Observable<Object>{
    console.log("aasuchi service ku update ");
    return this.httpClient.post(`${environment.userAccessUpdateURl}`,userAccess);

  }

  updateUserAccessProfilePicture(file:FormData){
    // const httpOptions = {
    //   params: {
    //     'userAccessId' : userAccessId+''
    //   }
    // };
    return this.httpClient.post(`${environment.updateUserAccessProfilePicture}`,file);
  }
  getUserAccessDetailsEmail():Observable<UserAccessClass[]>{
    return this.httpClient.get<UserAccessClass[]>(`${environment.getUserAccessDetailsEmailURl}`);
  }
  getUserAccessDetails():Observable<UserAccessClass[]>{
    return this.httpClient.get<UserAccessClass[]>(`${environment.getUserAccessDetailsURl}`);
  }
  getUserAccessDetailsToGetUserNmAndEmail():Observable<UserAccessClass[]>{
    return this.httpClient.get<UserAccessClass[]>(`${environment.getUserAccessDetailsToGetUserNmAndEmail}`,{headers:{skip:"true"}});
  }
  getUserAccessObjectById(userAccessId:number):Observable<UserAccessClass>{
    return this.httpClient.get<UserAccessClass>(`${environment.getUserAccessByIdURl}/${userAccessId}`);
  }
  changeUserAccessStatus(userAccessId:number,language:string):Observable<UserAccessClass[]>{
    return this.httpClient.get<UserAccessClass[]>(`${environment.changeUserAccessStatusByIdURl}`+"?userAccessId="+userAccessId+"&language="+language);
  }
  getUserAccessObjectByUserName(userName:string):Observable<UserAccessClass>{
    return this.httpClient.get<UserAccessClass>(`${environment.getUserDetailsByuserName}/${userName}`);
  }
  // getUserAccessObjectByUserName1(userName: string) :Observable<UserAccessClass>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.checkUserNameDuplicateValues}/${userName}`);
  // }
  // getUserAccessObjectById(id:number):Observable<UserAccessClass[]>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.userAccessObjectURL}`);
  // }

  // getUserTypeList():Observable<UserAccessClass[]>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.userAccessObjectURL}`);
  // }

  // saveUserAccess(userAccessData: UserAccessClass):Observable<Object>{
  //   return this.httpClient.post(`${environment.saveUserAccess}`,userAccessData);
  // }

  // updateUserAccess(userAccessData: UserAccessClass):Observable<Object>{
  //   return this.httpClient.post(`${environment.updateUserAccess}`,userAccessData);
  // }

  // getUserAccessDetails(id:number):Observable<UserAccessClass[]>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.getUserAccessDetailsById}`);
  // }

  // changeUserAccessStatus(id:number):Observable<UserAccessClass[]>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.changeUserAccessStatus}`);
  // }

  // getUserAccessDetailsList():Observable<UserAccessClass[]>{
  //   return this.httpClient.get<UserAccessClass[]>(`${environment.getUserAccessDetails}`)
  // }
}
    

