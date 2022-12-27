import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FundingOrganization } from '../Service-Class/funding-organization';
import {environment} from 'src/environments/environment';
import { Donor } from '../Service-Class/donor';
import { Organization } from '../model/organization';


@Injectable({
  providedIn: 'root'
})
export class FundingOrganizationService {
  //private fundingOrganizationURL="http://localhost:8080/api/getFundingOrganizationDetails";

  constructor(private httpClient: HttpClient) { }

  getFundingOrganizationList():Observable<FundingOrganization[]>{
    console.log("environment.fundingOrganizationURL",`${environment.fundingOrganizationURL}`);
    return this.httpClient.get<FundingOrganization[]>(`${environment.fundingOrganizationURL}`);
  }

  getFundingOrganizationListByDonor(donorName:string):Observable<FundingOrganization[]>{
    // console.log("environment.fundingOrganizationURL",`${environment.fundingOrganizationURL}`);
    return this.httpClient.get<FundingOrganization[]>(`${environment.fundingOrganizationByDonorURL+'/'+donorName}`);
  }


  getDonorListbyFundingOrg(fundingOrg:string):Observable<Donor[]>{
    return this.httpClient.get<Donor[]>(`${environment.donorByFundingOrgURL+'/'+fundingOrg}`);
  }

  getFundingOrganizationListByDonorId(donorId:string):Observable<Organization[]>{
    // console.log("environment.fundingOrganizationURL",`${environment.fundingOrganizationURL}`);
    return this.httpClient.get<Organization[]>(`${environment.fundingOrganizationByDonorIdURL+'/'+donorId}`);
  }
}
