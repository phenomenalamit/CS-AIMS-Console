import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../Service-Class/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  
  constructor(private httpClient: HttpClient) { }

  saveNotificationDetails(notification:Notification):Observable<Object>{
    return this.httpClient.post(`${environment.saveNotificationTableDetails}`,notification);
  }

  getNotificationDetails():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.getNotificationTableDetails}`);
  }

  checkPasswordExpireAlert(userAccessId:number):Observable<String>{
    return this.httpClient.get<String>(`${environment.checkPasswordExpireAlert}`+"?userAccessId="+userAccessId);
  }

  checkFinancialAgreementOngoing():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.checkFinancialAgreementOngoing}`);
  }

  checkFinancialAgreementEntersTheFinalYear():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.checkFinancialAgreementEntersTheFinalYear}`);
  }

  checkProjectOngoing():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.checkProjectOngoing}`);
  }

  projectWithNoUpdates():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.projectWithNoUpdates}`);
  }

  financialAgreementWithNoUpdates():Observable<Notification[]>{
    return this.httpClient.get<Notification[]>(`${environment.financialAgreementWithNoUpdates}`);
  }

  checkDisbursementFinancingSituation(idFinancialAgreement:number):Observable<Notification>{
    return this.httpClient.get<Notification>(`${environment.checkDisbursementFinancingSituation}`+"?idFinancialAgreement="+idFinancialAgreement);
  }

  findRestFundingAmountAfterDisbursed(fundingId:number,currDisbAmt:string):Observable<Notification>{
    return this.httpClient.get<Notification>(`${environment.findRestFundingAmountAfterDisbursed}`+"?fundingId="+fundingId+"&currDisbAmt="+currDisbAmt);
  }

  findRestDisbursedAmountAfterPayment(fundingId:number,currPmtAmt:string):Observable<Notification>{
    return this.httpClient.get<Notification>(`${environment.findRestDisbursedAmountAfterPayment}`+"?fundingId="+fundingId+"&currPmtAmt="+currPmtAmt);
  }
}
