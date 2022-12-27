import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentCrudService } from '../Service-Class/payment-crud-service';
import { PaymentDocumentServiceClass } from '../Service-Class/payment-document-service-class';
import { Project } from '../Service-Class/project';

@Injectable({
  providedIn: 'root'
})
export class PaymentCrudServiceService {

  constructor(private httpClient: HttpClient) { }
   //save method start
   savePayment(paymentData: PaymentCrudService):Observable<Object>{
    console.log("------inside Payment service" )
    return this.httpClient.post(`${environment.paymentSaveUrl}`,paymentData);
  }
  getPaymentDetails(limits:any):Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.paymentViewListURL}`+"?limits="+limits);
  }
  getPaymentAllDetails():Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.paymentViewListAllURL}`);
  }

  getPmtProjectTitleDetailsByUserAccessId(userAccessId:any):Observable<Project[]>{
    return this.httpClient.get<Project[]>(`${environment.getPmtProjectTitleDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }

  getPaymentViewMoreById(payment_id:any):Observable<PaymentCrudService[]>{
    console.log("payment_id is=",payment_id);
   return this.httpClient.get<PaymentCrudService[]>(`${environment.paymentViewMoreByIdURL}`+"?payment_id="+payment_id);

  }

  deleteById(payment_id:number):Observable<any>{
    return this.httpClient.put<any>(`${environment.deletePaymentByIdURL}`,payment_id);
  }

  deleteByIds(payment_ids:number[],language:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.deletePaymentByIdsURL}`+"?payment_ids="+payment_ids+"&language="+language);
  }

  getEditPaymentById(payment_id:number):Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.editPaymentByIdURL}`+"?payment_id="+payment_id);
  }

  editPayment(paymentData: PaymentCrudService):Observable<Object>{
    return this.httpClient.put(`${environment.paymentUpdateUrl}`,paymentData);
  }

   /* Payment Doument upload start */
   savePaymentDocumnet(paymentDocumentData: PaymentDocumentServiceClass,file: File ):Observable<Object>{
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('payment', JSON.stringify(paymentDocumentData));
    let url=`${environment.paymentDocUrl}`;
    return this.httpClient.post(url,formdata);
  }

 /* getPaymentDocument This is for to fetch all payment document details */
 getPaymentDocument():Observable<PaymentDocumentServiceClass[]>{
  return this.httpClient.get<PaymentDocumentServiceClass[]>(`${environment.paymentDocDetailsUrl}`);
}
getPaymentDocumentByRefNm(paymentReferenceName:string):Observable<PaymentDocumentServiceClass[]>{
  return this.httpClient.get<PaymentDocumentServiceClass[]>(`${environment.paymentDocDetailsByRefNmUrl}`+'?paymentReferenceName='+paymentReferenceName);
}
  /* Payment Doument upload end */

  getPaymentDraftViewList():Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.getPaymentDraftViewListURL}`);
  }

  patchPaymentDraftValue(payment_id:any):Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.patchPaymentDraftValueURL}`+"?payment_id="+payment_id);

  }

  savePaymentDraft(paymentData: PaymentCrudService):Observable<Object>{
    console.log("------inside Payment service" )
    return this.httpClient.post(`${environment.paymentDraftSaveUrl}`,paymentData);
  }

  publishById(payment_id:number[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.publishPaymentByIdURL}`,payment_id);
  }

  discardById(payment_id:number[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.discardPaymentByIdURL}`,payment_id);
  }

  getDraftedPaymentDetails():Observable<PaymentCrudService[]>{
    return this.httpClient.get<PaymentCrudService[]>(`${environment.draftedPaymentList}`);
  }
  checkDuplicatePaymentReference(paymentReference:string,fundingId:number):Observable<any>{
    return this.httpClient.get<any>(`${environment.checkDuplicatePaymentRefURL}`+"?paymentReference="+paymentReference+"&fundingId="+fundingId);
  }

  paymentDocDeleteByIdUrl(paymentId:number):Observable<PaymentDocumentServiceClass[]>{
    return this.httpClient.put<PaymentDocumentServiceClass[]>(`${environment.paymentDocDeleteByIdUrl+"/"+paymentId}`,"");
  }
  
  getMEXData():Observable<PaymentCrudService[]>{
    return this.httpClient.get<any>(`${environment.mEXURL}`);
  }
}
