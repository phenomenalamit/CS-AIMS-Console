import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DisbursementCrudService } from '../Service-Class/disbursement-crud-service';
import { DisbursementClass } from '../Service-Class/Disbursment';
import { DisbursmentDocumentServiceClass } from '../Service-Class/disbursment-document-service-class';

@Injectable({
  providedIn: 'root'
})
export class DisbursementCrudServiceService {

  constructor(private httpClient: HttpClient) { }
   //save method start
   saveDisbursement(disbursementData: DisbursementCrudService):Observable<Object>{
    console.log("------inside Disbursement service" )
    return this.httpClient.post(`${environment.disbursementSaveUrl}`,disbursementData);
  }

  editDisbursement(disbursementData: DisbursementCrudService):Observable<Object>{
    return this.httpClient.put(`${environment.disbursementUpdateUrl}`,disbursementData);
  }

  getDisbursementDetails(limits:any):Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.disbursementViewListURL}`+"?limits="+limits);
  }
  getDisbursementAllDetails():Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.disbursementAllViewListURL}`);
  }
  getDisuburementViewMoreById(disbursement_id:any):Observable<DisbursementCrudService[]>{
     console.log("disbursement_id is=",disbursement_id);
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.disbursementViewMoreByIdURL}`+"?disbursement_id="+disbursement_id);
  }

  getEditDisbursementById(disbursement_id:any):Observable<DisbursementCrudService[]>{
   return this.httpClient.get<DisbursementCrudService[]>(`${environment.editDisbursementByIdURL}`+"?disbursement_id="+disbursement_id);
 }

  deleteByIds(disbursement_ids:number[],language:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.deleteByIdsURL}`+"?disbursement_ids="+disbursement_ids+"&language="+language);
  }

  deleteById(disbursement_id:number):Observable<any>{
    return this.httpClient.put<any>(`${environment.deleteByIdURL}`,disbursement_id);
  }

  getDuplicateReference(disbursementReference:string,fundingId:number):Observable<any>{
    return this.httpClient.get<any>(`${environment.getDuplicateReferenceURL}`+"?disbursementReference="+disbursementReference+"&fundingId="+fundingId);
  }


  saveDisbursementDraft(disbursementData: DisbursementCrudService):Observable<Object>{
    console.log("------inside Disbursement service" )
    return this.httpClient.post(`${environment.disbursementDraftSaveUrl}`,disbursementData);

  }

  getDisbursementDraftViewList():Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.getDisbursementDraftViewListURL}`);
  }

  patchDisbursemntDraftValue(disbursement_id:any):Observable<DisbursementCrudService[]>{
    return this.httpClient.get<DisbursementCrudService[]>(`${environment.patchDisbursemntDraftValueURL}`+"?disbursement_id="+disbursement_id);
  }

     /* Disbursment Doument upload start */
     saveDisbursmentDocumnet(disbursmentDocumentData: DisbursmentDocumentServiceClass,file: File ):Observable<Object>{
      const formdata: FormData = new FormData();
      formdata.append('file', file);
      formdata.append('disbursment', JSON.stringify(disbursmentDocumentData));
      let url=`${environment.disbursmentDocUrl}`;
      return this.httpClient.post(url,formdata);
    }

   /* getDisbursmentDocument This is for to fetch all project document details */
   getDisbursmentDocument():Observable<DisbursmentDocumentServiceClass[]>{
    return this.httpClient.get<DisbursmentDocumentServiceClass[]>(`${environment.disbursmentDocDetailsUrl}`);
  }
  getDisbursmentDocumentByRefNm(disbursementRefNm:string):Observable<DisbursmentDocumentServiceClass[]>{
    return this.httpClient.get<DisbursmentDocumentServiceClass[]>(`${environment.disbursmentDocDetailsByRefNmUrl}`+'?disbursementRefNm='+disbursementRefNm);
  }
    /* Disbursment Doument upload end */

    publishById(disbursement_id:number[]):Observable<any>{
      return this.httpClient.put<any>(`${environment.publishDisbursementByIdURL}`,disbursement_id);
    }

    discardById(disbursement_id:number[]):Observable<any>{
      return this.httpClient.put<any>(`${environment.discardDisbursementByIdURL}`,disbursement_id);
    }

    getDraftedDisbursementDetails():Observable<DisbursementCrudService[]>{
      return this.httpClient.get<DisbursementCrudService[]>(`${environment.draftedDisbursementViewListURL}`);
    }

    disbursementDocDeleteByIdUrl(disbursementId:number):Observable<DisbursmentDocumentServiceClass[]>{
      return this.httpClient.put<DisbursmentDocumentServiceClass[]>(`${environment.disbursementDocDeleteByIdUrl+"/"+disbursementId}`,"");
    }

    getProjectTitleDetailsByUserAccessId(userAccessId:any):Observable<DisbursementClass[]>{
      return this.httpClient.get<DisbursementClass[]>(`${environment.getProjectTitleDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
    }
    
}

