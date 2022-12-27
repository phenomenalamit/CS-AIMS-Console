import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FinancialAgreement } from '../model/financial-agreement';
import { DisbursementCrudService } from '../Service-Class/disbursement-crud-service';
import { FinancingProvinceDistrict } from '../Service-Class/financing-province-district';
import { OrganizationCrudServiceClass } from '../Service-Class/organization-crud-service-class';
import { PaymentCrudService } from '../Service-Class/payment-crud-service';
import { ProjectCrud } from '../Service-Class/project-crud';
import { ProjectModel } from '../Service-Class/project-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectCrudService {
  constructor(private httpClient: HttpClient) { }

  saveProjectDetails(projectCrud:ProjectCrud):Observable<ProjectCrud>{
    return this.httpClient.post<ProjectCrud>(`${environment.saveProjectURL}`,projectCrud);
  }

  getProjectViewDetails(limits:any):Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.getProjectViewList}`+"?limits="+limits);
  }
  getProjectAllViewDetails():Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.getProjectAllViewList}`);
  }
  deleteProjectById(projectId:number):Observable<ProjectCrud[]>{
    return this.httpClient.put<ProjectCrud[]>(`${environment.deleteProjectById}`,projectId);
  }

  deleteProjectByIds(projectId:number[],language:string):Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.deleteProjectByIds}`+"?projectId="+projectId+"&language="+language);
  }

  deleteProjectFromMozgisById(projectId:number):Observable<ProjectCrud>{
    return this.httpClient.post<ProjectCrud>(`${environment.deleteProjectFromMozgisById}`,projectId);
  }

  getProjectById(projectId:number):Observable<ProjectCrud>{
    return this.httpClient.get<ProjectCrud>(`${environment.getProjectById}`+"?projectId="+projectId);
  }

  updateProjectDetails(projectCrud:ProjectCrud):Observable<ProjectCrud>{
    return this.httpClient.put<ProjectCrud>(`${environment.updateProjectById}`,projectCrud);
  }

  saveAsDraftProjectDetails(projectCrud:ProjectCrud):Observable<ProjectCrud>{
    return this.httpClient.post<ProjectCrud>(`${environment.saveAsDraftProjectDetails}`,projectCrud);
  }

  getProjectDraftDataViewList():Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.getProjectDraftDataViewList}`);
  }

  getProjectDraftById(projectId:number):Observable<ProjectCrud>{
    return this.httpClient.get<ProjectCrud>(`${environment.getProjectDraftById}`+"?projectId="+projectId);
  }

  updateSaveAsDraftProjectById(projectCrud:ProjectCrud):Observable<ProjectCrud>{
    return this.httpClient.put<ProjectCrud>(`${environment.updateSaveAsDraftProjectById}`,projectCrud);
  }

  getDraftedProjectViewDetails():Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.getDraftedProjectViewList}`);
  }

  publishProject(projectId:number[]):Observable<ProjectCrud[]>{
    return this.httpClient.put<ProjectCrud[]>(`${environment.publishProject}`,projectId);
  }

  discardProject(projectId:number[]):Observable<ProjectCrud[]>{
    return this.httpClient.put<ProjectCrud[]>(`${environment.discardProject}`,projectId);
  }

  getProvinceByFinancialAgreementId(financialAgreementIds:number[]):Observable<FinancingProvinceDistrict[]>{
    return this.httpClient.get<FinancingProvinceDistrict[]>(`${environment.getProvinceByFinancialAgreementId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getDistrictByFinancialAgreementId(financialAgreementIds:number[]):Observable<FinancingProvinceDistrict[]>{
    return this.httpClient.get<FinancingProvinceDistrict[]>(`${environment.getDistrictByFinancialAgreementId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getFinancialAgreementByFundingId(financialAgreementIds:number[]):Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.getFinancialAgreementByFundingId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getFinancialAgreementCommitmentsByFundingId(financialAgreementIds:number[]):Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.getFinancialAgreementCommitmentsByFundingId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getFinancialAgreementIdAndNames():Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.getFinancialAgreementIdAndNames}`);
  }

  getFinancialAgreementIdAndNamesByUserAccess(userAccessId:any):Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.getFinancialAgreementIdAndNamesByUserAccess}`+"?userAccessId="+userAccessId);
  }

  getDisbursementByFundingId(financialAgreementIds:number[]):Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.getDisbursementByFundingId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getPaymentByFundingId(financialAgreementIds:number[]):Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.getPaymentByFundingId}`+"?financialAgreementIds="+financialAgreementIds);
  }

  getEsnipToken(user:string,pwd:string):Observable<Object>{
    let tokenRequestBody ={
      "username": user,
      "password": pwd
    };
    return this.httpClient.post(`${environment.getTokenForEsnip}`,tokenRequestBody,{headers:{skip:"true"}});
  }

  getAllTheProjectsFromEsnip(token:any):Observable<any[]>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token,
      skip:"true"
    });
    let options = { headers: headers };
    return this.httpClient.get<any[]>(`${environment.getAllTheProjectsFromEsnip}`,options);
  }

  getProjectsFromEsnipById(token:any,id:number):Observable<any[]>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'EsnipAuthorization': 'Bearer '+token,
      // skip:"true"
    });
    let options = { headers: headers };
    return this.httpClient.get<any[]>(`${environment.getProjectsFromEsnipById}`+"?id="+id,options);
  }

  shareProjectToESnip(token:string,project:any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token,
      skip:"true"
    });
    let options = { headers: headers };
    return this.httpClient.post<any>(`${environment.shareProjectToESnip}`,project,options);
  }

  checkDuplicateProjectTitle(projectTitle:string,responsibleOrganizationId:number):Observable<any>{
    return this.httpClient.get<any>(`${environment.checkDuplicateProjectTitle}`+"?projectTitle="+projectTitle+"&responsibleOrganizationId="+responsibleOrganizationId);
  }

  searchEsnipListByTitel(titel:string):Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.searchEsnipListByTitel}`+"?titel="+titel);
  }

  checkDuplicateFundingOnproject(fundingIds:number[],projectId:number):Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.checkDuplicateFundingOnproject}`+"?fundingIds="+fundingIds+"&projectId="+projectId);
  }

  saveToMozgis(mozgisCrudBean:ProjectModel):Observable<any>{
    
    console.log('saveToMozgis request sent')
    return this.httpClient.post<any>(`${environment.shareProjectToMozgis}`,mozgisCrudBean);
  }
  updateFinancialAgreementToMozgis(mozgisCrudBean:ProjectModel):Observable<any>{
   
    return this.httpClient.post<any>(`${environment.UpdateFinancialAgreementMozgis}`,mozgisCrudBean );
  }
  InactivateToMozgis(mozgisCrudBean:ProjectModel):Observable<any>{
    
    return this.httpClient.post<any>(`${environment.InactivateProjectMozgis}`,mozgisCrudBean);
  }
  getFundingOrgDetailsByUserAccessId(userAccessId:any):Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.getFundingOrgDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }
}
