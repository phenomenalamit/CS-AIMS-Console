import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

// import { organization-OrganizationServiceClass } from '../Service-Class/fundingServiceClass-class';
import {environment} from 'src/environments/environment';
import { OrganizationServiceClass } from '../Service-Class/organization-service-class';



@Injectable({
  providedIn: 'root'
})
export class OrganizationServiceService {

  constructor(private httpClient: HttpClient) { }
  getOrganizationCategoryList():Observable<OrganizationServiceClass[]>{
    return this.httpClient.get<OrganizationServiceClass[]>(`${environment.OrganizationCategoryURL}`);
  }
  getOrganizationCityList():Observable<OrganizationServiceClass[]>{
    return this.httpClient.get<OrganizationServiceClass[]>(`${environment.OrganizationCityURL}`);
  }
  
  getAllCategory(searchValue:string):Observable<OrganizationServiceClass[]>{
    return this.httpClient.get<OrganizationServiceClass[]>(`${environment.allCategoryURL}`+"?searchValue="+searchValue);
  }
}
