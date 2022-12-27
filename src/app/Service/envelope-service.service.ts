import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';
import { EnvelopeServiceClass } from '../Service-Class/envelope-service-class';
import {environment} from 'src/environments/environment';
import { EnvelopeDocumentServiceClass } from '../Service-Class/envelope-document-service-class';
import { FinancialAgreement } from '../model/financial-agreement';
import { EnvelopeModal } from '../model/envelopeModal';
import { BankOfMozambique } from '../Service-Class/bank-of-mozambique';
import { OrganizationCrudServiceClass } from '../Service-Class/organization-crud-service-class';


@Injectable({
  providedIn: 'root'
})
/*
* @Author Sunita Parida
* This page is belongs to Envelope Service File
*/
export class EnvelopeServiceService {
  getFinancialDetails() :Observable<FinancialAgreement[]>{
    return this.httpClient.get<FinancialAgreement[]>(`${environment.financialUrl}`);
  }

  constructor(private httpClient: HttpClient) { }
/* saveEnvelope This method is for to save envelope data */
  saveEnvelope(envelopeData: EnvelopeServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.envelopeUrl}`,envelopeData);
  }
  /* getEnvelope This method is for to fetch all envelope data */
  getEnvelope(limits:any):Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.envelopeDetailsUrl}`+"?limits="+limits);
  }
  getAllEnvelope():Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.envelopeDetailsAllUrl}`);
  }
  getDraftedEnvelope():Observable<EnvelopeModal[]>{
    return this.httpClient.get<EnvelopeModal[]>(`${environment.draftedEnvelopeDetailsUrl}`);
  }
  getEnvelopeRefNm():Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.envelopeRefDetailsUrl}`);
  }
  /* updateEnvelope This method is for to update data by given id */
  updateEnvelope(envelopeId :number):Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.editEnvelopeUrl}`+"?envelopeId="+envelopeId);
  }
  /* deleteEnvelope This method is for to delete a  single record by given id */
  deleteEnvelope (envelopeId :number[]):Observable<EnvelopeServiceClass[]>{
    // return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.deleteEnvelopeUrl}`,envelopeId);
    return this.httpClient.put<EnvelopeServiceClass[]>(`${environment.deleteEnvelopeUrl}`,envelopeId);
  }
/* deleteEnvelope This method is for to delete a  single record by given id */
deleteEnvelopeByIds (envelopeId :number[],language:String):Observable<EnvelopeServiceClass[]>{
  // return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.deleteEnvelopeUrl}`,envelopeId);
  return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.deleteEnvelopeUrlById}`+"?envelopeId="+envelopeId+"&language="+language);
}
  /* saveAsDraftEnvelope This method is for to save envelope save as draft value */
  saveAsDraftEnvelope(envelopeData: EnvelopeServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.envelopeSaveAsDrftUrl}`,envelopeData);
  }
  /* getSaveAsDraftEnvelope This method is for to fetch all envelope save as draft values*/
  getSaveAsDraftEnvelope(usergroup:string):Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.envelopeSaveAsDraftDetailsUrl}`+"?usergroup="+usergroup);
  }
  /* patchSaveAsDraftEnvelope This is for fetch single data of save as draft by given draft id */
  patchSaveAsDraftEnvelope(envelopeId :number):Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.setSaveAsDraftUrl}`+"?envelopeId="+envelopeId);
  }
  /* viewMoreEnvelope This is for to fetch envelope details by envelope table id */
  viewMoreEnvelope(envelopeTableId :number):Observable<EnvelopeServiceClass[]>{
    return this.httpClient.get<EnvelopeServiceClass[]>(`${environment.viewMoreUrl}`+"?envelopeTAbId="+envelopeTableId);
  }
 /* saveEnvelopeDocumnet This is for save envelope document data */
  saveEnvelopeDocumnet(envelopeDocData: EnvelopeDocumentServiceClass,file: File ):Observable<Object>{
    
    const formdata: FormData = new FormData();  
    formdata.append('file', file); 
    formdata.append('envelope', JSON.stringify(envelopeDocData)); 
    let url=`${environment.envelopeDocUrl}`;
    return this.httpClient.post(url,formdata);
  }
  /* getEnvelopeDocument This is for to fetch all envelope document details */
  getEnvelopeDocument():Observable<EnvelopeDocumentServiceClass[]>{
    return this.httpClient.get<EnvelopeDocumentServiceClass[]>(`${environment.envelopeDocDetailsUrl}`);
  }
  getEnvelopeDocumentByRefNm(envelopeRefNm :string):Observable<EnvelopeDocumentServiceClass[]>{
    return this.httpClient.get<EnvelopeDocumentServiceClass[]>(`${environment.envelopeDocDetailsByRefNmUrl}`+"?envelopeRefNm="+envelopeRefNm);
  }

  envelopeDocDeleteByIdUrl(envelopeId:number):Observable<EnvelopeDocumentServiceClass[]>{
    return this.httpClient.put<EnvelopeDocumentServiceClass[]>(`${environment.envelopeDocDeleteByIdUrl+"/"+envelopeId}`,"");
  }

  getExchangeRateEnvelope(body:BankOfMozambique):Observable<BankOfMozambique>{
    return this.httpClient.post<BankOfMozambique>(`${environment.getExchangeRateEenvelopeURL}`, body);
  }

  getFundingOrgDetailsByUserAccessId(userAccessId:any):Observable<OrganizationCrudServiceClass[]>{
    return this.httpClient.get<OrganizationCrudServiceClass[]>(`${environment.getFundingOrgDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }
}
