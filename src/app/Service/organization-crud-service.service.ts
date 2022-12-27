import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationCrudServiceClass } from '../Service-Class/organization-crud-service-class';
import {environment} from 'src/environments/environment';
import { Country } from '../Service-Class/country';


@Injectable({
  providedIn: 'root'
})
export class OrganizationCrudServiceService {

  constructor(private httpClient: HttpClient) { }
  //save method start
    saveOrganizationCurd(organizationCrudData: OrganizationCrudServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.organizationCrudSaveUrl}`,organizationCrudData);
  }

// getting data from database
getOrganizationCurd(limits:any):Observable<OrganizationCrudServiceClass[]>{
  return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.organizationCrudGetUrl}`+"?limits="+limits);
}

//getting country or parent org list 
getCountryOrParentOrganization():Observable<OrganizationCrudServiceClass[]>{
  return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.countryOrParentOrganizationURL}`);
}


getOrganizationById(organizationId :any):Observable<OrganizationCrudServiceClass[]>{
  // console.log("?provinces_id="+individualId);
  return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.organizationGetByIdURL}`+"?organizationId="+organizationId);
}
//for edit
editById(organizationId :any):Observable<any>{
  // console.log("?provinces_id="+individualId);
  return this.httpClient.get(`${environment.organizationEditById}`+"?organizationId="+organizationId);
}
//for update

updateOrganizationDetails(organization:OrganizationCrudServiceClass):Observable<Object>{
  console.log("aasuchi organization update service ku");
  return this.httpClient.put(`${environment.updateOrganizationCrudDetailsById}`,organization);

}
  //delete 
  deleteById(id:number[],language:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.deleteOrganizationCrudDetailsById}`+"?id="+id+"&language="+language);
  }

  //getFundingOrganization Details
  getFundingOrganization():Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.fundingOrgURL}`);
  }
  getFundingOrganizationDetails():Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.fundingOrgDetailsURL}`);
  }
  getFundingOrgDetailsByUserAccessId(userAccessId:any):Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.getFundingOrgDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }
//saveOrganizationDraft
saveOrganizationDraft(organizationData: OrganizationCrudServiceClass):Observable<Object>{
    console.log("------inside Organization service" )
    return this.httpClient.post(`${environment.organizationDraftSaveUrl}`,organizationData);

  }
//getting list of drafted data
getOrganizationDraftList():Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.getOrganizationDraftViewListURL}`);
  }

  patchOrganizationDraftValue(id:any):Observable<any>{
    return this.httpClient.get<any>(`${environment.patchOrganizationDraftValueURL}`+"?organizationId="+id);
  }

  getAllCountryDetails(searchValue:string):Observable<Country[]>{
    return this.httpClient.get<Country[]>(`${environment.allCountryUrl}`+"?searchValue="+searchValue);
  }

  // getting drafted data from database
getDraftedOrganizationCurd():Observable<OrganizationCrudServiceClass[]>{
  return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.draftedorganizationCrudGetUrl}`);
}

  publishOrganizationById(id:number[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.publishOrganizationById}`,id);
  }

  //delete 
  discardOrganizationById(id:number[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.discardOrganizationById}`,id);
  }

  checkDuplicateOrganization(organizationName:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.checkDuplicateOrganization}`+"?organizationName="+organizationName);
  }
}
