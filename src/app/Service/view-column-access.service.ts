import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ViewColumnAccessServiceClass } from '../Service-Class/view-column-access-service-class';

@Injectable({
  providedIn: 'root'
})
export class ViewColumnAccessService {

  constructor(private httpClient:HttpClient) { }

  // getCloumnAccessByUser(columnObj:ViewColumnAccessServiceClass[]):Observable<ViewColumnAccessServiceClass[]>{
  //   console.log("url is",this.httpClient.get<ViewColumnAccessServiceClass[]>(`${environment.getCloumnAccessByUserURL+'/'+columnObj}`))
  //   // return this.httpClient.get<ViewColumnAccessServiceClass[]>(`${environment.getCloumnAccessByUserURL+'/'+columnObj}`);
  //   return this.httpClient.get<ViewColumnAccessServiceClass[]>(`${environment.getCloumnAccessByUserURL}`+"?columnObj="+columnObj);

  // }

  getCloumnAccessByUser(userGroup:string,moduleName:string):Observable<ViewColumnAccessServiceClass[]>{
    console.log("moduleName=",moduleName)
    return this.httpClient.get<ViewColumnAccessServiceClass[]>(`${environment.getCloumnAccessByUserURL+'?userGroup='+userGroup+'&moduleName='+moduleName}`);

  }
  


  // getOrganizationById(organizationId :any):Observable<OrganizationCrudServiceClass[]>{
  //   // console.log("?provinces_id="+individualId);
  //   return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.organizationGetByIdURL}`+"?organizationId="+organizationId);
  // }


}
