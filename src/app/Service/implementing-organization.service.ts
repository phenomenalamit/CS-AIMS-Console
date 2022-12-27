import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImplementingOrganization } from '../Service-Class/implementing-organization';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ImplementingOrganizationService {
  //private implementingOrganizationURL="http://localhost:8080/api/getImplementingOrganizationDetails";

  constructor(private httpClient: HttpClient) { }

  getImplementingOrganizationList():Observable<ImplementingOrganization[]>{
    return this.httpClient.get<ImplementingOrganization[]>(`${environment.implementingOrganizationURL}`);
  }
  getAllImplementingOrganizationList(searchValue:string):Observable<ImplementingOrganization[]>{
    return this.httpClient.get<ImplementingOrganization[]>(`${environment.allImplementingOrganizationURL}`+"?searchValue="+searchValue);
  }
}
