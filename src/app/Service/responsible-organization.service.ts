import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsibleOrganization } from '../Service-Class/responsible-organization';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResponsibleOrganizationService {
  //private responsibleOrganizationURL="http://localhost:8080/api/getResponsibleOrganizationDetails";

  constructor(private httpClient: HttpClient) { }

  
  getResponsibleOrganizationList():Observable<ResponsibleOrganization[]>{
    return this.httpClient.get<ResponsibleOrganization[]>(`${environment.responsibleOrganizationURL}`);
  }
  getAllResponsibleOrganizationList():Observable<ResponsibleOrganization[]>{
    return this.httpClient.get<ResponsibleOrganization[]>(`${environment.allResponsibleOrg}`);
  }
}
