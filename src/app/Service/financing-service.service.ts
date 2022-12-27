import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BudgetSupport } from '../components/add-components/add-funding/add-funding.component';
import { FinancialAgreement } from '../model/financial-agreement';
import { Organization } from '../model/organization';
import { BankOfMozambique } from '../Service-Class/bank-of-mozambique';
import { DisbursementCrudService } from '../Service-Class/disbursement-crud-service';
import { EnvelopeServiceClass } from '../Service-Class/envelope-service-class';
import { FinancialDocumentServiceClass } from '../Service-Class/financial-document-service-class';
import { FinancingClass } from '../Service-Class/financing-class';
import { PaymentCrudService } from '../Service-Class/payment-crud-service';

@Injectable({
  providedIn: 'root'
})
export class FinancingServiceService {
  


  // private saveURL = "http://localhost:8080/api/addFinancialAgreement";
  // private getAllFAURL = "http://localhost:8080/api/getFinancialAgreement";

 

  constructor(private httpClient: HttpClient) { }

  getFinancingSituationDetails():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.financingSituationURL}`);
  }
  getAidDacCrsDetails():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.aidDacCrsURL}`);
  }
  getTypeOfImplementation():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.typeOfImplementationURL}`);
  }

  getTypeOfFinance():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.typeOfFinanceURL}`);
  }

  getMeoResourceSource():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.meoResourceSourceURL}`);
  }

  getPillarPqgMeo():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.pillarPqgMeoURL}`);
  }

  getStrategicPqgMeo(pillarPqgMeoId :number[]):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.StrategicPqgMeoByPillarIdURL}`+"?pillarPqgMeoId="+pillarPqgMeoId);
    // return this.httpClient.get<FinancingClass[]>(`${environment.StrategicPqgMeoURL}`);
  }

  getAllStrategicPqgMeo():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.StrategicPqgMeoURL}`);
  }
  createFinancialAgreement(data:Object):Observable<string>{
    // console.log("in servce final json",data)
    return this.httpClient.post<string>(`${environment.saveFinancingServiceServiceURL}`,data,{responseType: 'text' as 'json'});
  }

  getFinancialAgreementList(limits:any):Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.getFinancingServiceServiceAllFAURL}`+"?limits="+limits);
  }
  getFinancialAgreementAllList():Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.getFinancingServiceServiceAllURL}`);
  }
  getDraftedFinancialAgreementList():Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.getDraftedFinancialAgreementList}`);
  }

  /* Financing Doument upload start */
  saveFinancingDocumnet(financingDocumentData: FinancialDocumentServiceClass,file: File ):Observable<Object>{
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('financial', JSON.stringify(financingDocumentData));
    let url=`${environment.finnancialDocUrl}`;
    return this.httpClient.post(url,formdata);
  }

 /* getFinancingDocument This is for to fetch all financing document details */
 getFinancingDocument():Observable<FinancialDocumentServiceClass[]>{
  return this.httpClient.get<FinancialDocumentServiceClass[]>(`${environment.financingDocDetailsUrl}`);
}
getFinancingDocumentByRefNm(fundingReferenceName:string):Observable<FinancialDocumentServiceClass[]>{
  return this.httpClient.get<FinancialDocumentServiceClass[]>(`${environment.financingDocDetailsByRefNmUrl}`+"?fundingReferenceName="+fundingReferenceName);
}
  /* Financing Doument upload end */

  getFinancialAgreementById(faId: string):Observable<FinancialAgreement>{
    return this.httpClient.get<FinancialAgreement>(`${environment.getFinancialAgreementById+'/'+faId}`);
  }

  deleteById(faId: number):Observable<string> {
    return this.httpClient.put<string>(`${environment.deleteFA+"/"+faId}`,"",{responseType: 'text' as 'json'});
  }

  delete(faId: number[],language:string):Observable<string> {
    return this.httpClient.put<string>(`${environment.deleteFAIds+"/"+faId+"/"+language}`,"",{responseType: 'text' as 'json'});
  }

  getFinancialAgreementForEditById(faId: string):Observable<any>{
    return this.httpClient.get<any>(`${environment.getFinancialAgreementForEditById+'/'+faId}`);
  }
  SDFinancialAgreement(data:Object):Observable<string>{
    // console.log("in servce final json",data)
    return this.httpClient.post<string>(`${environment.saveAsDraftFinancingServiceURL}`,data,{responseType: 'text' as 'json'});
  }
  getFASaveAsDraftList():Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.getFASaveAsDraftList}`);
  }

  getFinancialAgreementFromDraftForEditById(faId: number):Observable<any>{
    return this.httpClient.get<any>(`${environment.getFinancialAgreementFromDraftForEditById+'/'+faId}`);
  }
  getAllFinancingSituationDetails(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allFinancingSituationURL}`+"?searchValue="+searchValue);
  }
  getAllCooperationModalities(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allCooperationModalitiesURL}`+"?searchValue="+searchValue);
  }
  getAllComesInLike():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allComesInLikeURL}`);
  }
  getAllTypeofImplementation():Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allTypeofImplementationURL}`);
  }
  getAllStateBudget(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allStateBudgetURL}`+"?searchValue="+searchValue);
  }
  getAllTypeofFinance(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allTypeofFinanceURL}`+"?searchValue="+searchValue);
  }
  getAllPillarPQG(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allPillarPQGURL}`+"?searchValue="+searchValue);
  }
  getStrategicPqgMeoActiveInActive(searchValue:string):Observable<FinancingClass[]>{
    return this.httpClient.get<FinancingClass[]>(`${environment.allStrategicPqgMeoURL}`+"?searchValue="+searchValue);
  }
  getBudgetSupport():Observable<BudgetSupport[]>{
    return this.httpClient.get<BudgetSupport[]>(`${environment.budgetSupportURL}`);
  }
  getAllBudgetSupport(searchValue:string):Observable<BudgetSupport[]>{
    return this.httpClient.get<BudgetSupport[]>(`${environment.allbudgetSupportURL}`+"?searchValue="+searchValue);
  }
  getEnvelopeReferenceList(donorId:number,fundingOrgId):Observable<string[]>{
    // console.log("link : ",`${environment.envelopeReferenceListURL+'/'+donorId}`)
    return this.httpClient.get<string[]>(`${environment.envelopeReferenceListURL+'?donorId='+donorId+'&fundingOrgId='+fundingOrgId}`);
  }

  getDisbursementDetailsByFaId(faID:number):Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.disbursementViewListByFaIdURL+'/'+faID}`);
  }

  getPaymentDetailsByFaId(faID:number):Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.paymentViewListByFaIdURL+'/'+faID}`);
  }

  getExchangeRateFinancialAgreement(body:BankOfMozambique):Observable<BankOfMozambique>{
    return this.httpClient.post<BankOfMozambique>(`${environment.getExchangeRateURL}`, body);
  }

  checkDuplicateFundingDonorTitle(name:string):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateFundingDonorTitleURL+'/'+name}`);
  }
  checkDuplicateFundingDonorTitleOnUpdate(name:string,faId:number):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateFundingDonorTitleURL+'/'+faId+'/'+name}`);
  }
  checkDuplicateFundingDonorReference(name:string,fundOrg:number):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateFundingDonorReferenceURL+'/'+fundOrg+'/'+name}`);
  }
  checkDuplicateFundingDonorReferenceOnUpdate(name:string,fundOrg:number,faId:number):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateFundingDonorReferenceOnUpdateURL+'/'+faId+'/'+fundOrg+'/'+name}`);
  }
  getEnvelopeDetailsByEnvelopeRef(envRef: string):Observable<EnvelopeServiceClass>{
    return this.httpClient.get<EnvelopeServiceClass>(`${environment.getEnvelopeDetailsByEnvelopeRefURL+'/'+envRef}`);
  }

  publishById(id:number[]):Observable<any>{
    return this.httpClient.patch<any>(`${environment.publishFinancialAgreement}`,id);
  }

  discardById(id:number[]):Observable<any>{
    return this.httpClient.patch<any>(`${environment.discardFinancialAgreement}`,id);
  }

  createFinancialAgreementLocation(data:Object):Observable<string>{
    // console.log("in servce final json",data)
    return this.httpClient.post<string>(`${environment.saveFinancialAgreementLocationURL}`,data,{responseType: 'text' as 'json'});
  }

  updateFinancialAgreement(data:Object):Observable<string>{
    // console.log("in servce final json",data)
    return this.httpClient.post<string>(`${environment.updateFinancialAgreementURL}`,data,{responseType: 'text' as 'json'});
  }

  financingDocDeleteByIdUrl(financeId:number):Observable<FinancialDocumentServiceClass[]>{
    return this.httpClient.put<FinancialDocumentServiceClass[]>(`${environment.financeDocDeleteByIdUrl+"/"+financeId}`,"");
  }

   getProvinceList():Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.getProvinceList}`);
  }

  getDistrictList(id:number[]):Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.getDistrictList}`);
  }

  getDonorListByUserAccess(userAccessId:any):Observable<Organization[]>{
    return this.httpClient.get<Organization[]>(`${environment.getDonorListByUserAccess}`+"?userAccessId="+userAccessId);
  }
}
