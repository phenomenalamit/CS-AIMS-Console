import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../Service-Class/organization';
import {environment} from 'src/environments/environment';
import { Category } from '../components/add-components/add-organization-component/add-organization-component.component';
import { OrganizationCrudServiceClass } from '../Service-Class/organization-crud-service-class';


@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  //private organizationURL="http://localhost:8080/api/getOrganizationDetails";

  constructor(private httpClient: HttpClient) { }

  getOrganizationList():Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.organizationURL}`);
  }

  getFundingOrgDetailsByUserAccessId(userAccessId:any):Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.getFundingOrgDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }

  getFundingOrganizationDetails():Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.fundingOrgDetailsURL}`);
  }
}
