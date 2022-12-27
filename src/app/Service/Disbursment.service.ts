import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DisbursementClass } from '../Service-Class/Disbursment';
import { FundingOrganization } from '../Service-Class/funding-organization';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {
  getFundingTitleListByPrjId(projectId: any) :Observable<DisbursementClass[]>{
    return this.httpClient.get<DisbursementClass[]>(`${environment.fundingTitleByPrjIdURL}`+"?projectId="+projectId);
  }
  constructor(private httpClient: HttpClient) { }

  getProjectTitleList():Observable<DisbursementClass[]>{
    return this.httpClient.get<DisbursementClass[]>(`${environment.projectTitleURL}`);
  }
  getProjectTitleDetailsByUserAccessId(userAccessId:any):Observable<DisbursementClass[]>{
    return this.httpClient.get<DisbursementClass[]>(`${environment.getProjectTitleDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }
  getFundingTitleList():Observable<DisbursementClass[]>{
    return this.httpClient.get<DisbursementClass[]>(`${environment.fundingTitleURL}`);
  }

  getFundingOrganizationList(fundingId:any):Observable<FundingOrganization[]>{
    return this.httpClient.get<FundingOrganization[]>(`${environment.fundingOrganizationByFundIdURL}`+"?fundingId="+fundingId);
  }

  fundingOrganizationByProjectIdURL(projectId:any):Observable<FundingOrganization[]>{
    return this.httpClient.get<FundingOrganization[]>(`${environment.fundingOrganizationByProjectIdURL}`+"?projectId="+projectId);
  }
}
