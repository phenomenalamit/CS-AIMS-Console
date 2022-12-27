import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndividualCrudServiceClass } from '../Service-Class/individual-crud-service-class';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualCrudServiceService {

  constructor(private httpClient: HttpClient) { }
  //save method start
  saveIndividualCurd(individualCrudData: IndividualCrudServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.individualCrudSaveUrl}`,individualCrudData);
  }

  //save as draft
  saveIndividualDraft(individualCrudData: IndividualCrudServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.individualSaveAsDraftUrl}`,individualCrudData);
  }
  
  //get draft data
  getIndividualDraftViewList():Observable<IndividualCrudServiceClass[]>{
    return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.getIndividualDraftViewListURL}`);
  }
  //patch the data is in drafted mode 
  patchIndividualDraftValue(individualId:any):Observable<IndividualCrudServiceClass[]>{
    return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.patchIndividualDraftValueURL}`+"?individualId="+individualId);
  }
  // getting data from database
  getIndividualCurd(limits:any):Observable<IndividualCrudServiceClass[]>{
    return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.individualCrudGetUrl}`+"?limits="+limits);
  }


  getIndividualById(individualId :any):Observable<any>{
    // console.log("?provinces_id="+individualId);
    return this.httpClient.get(`${environment.individualGetByIdURL}`+"?individualId="+individualId);
  }
  //for edit
  editById(individualId :any):Observable<any>{
    // console.log("?provinces_id="+individualId);
    return this.httpClient.get(`${environment.individualEditById}`+"?individualId="+individualId);
  }
  //for view more
  getIndividualViewMoreById(individualId:any):Observable<IndividualCrudServiceClass[]>{
   return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.individualViewMoreByIdURL}`+"?individualId="+individualId);
  }
  //for update
  
  updateIndividualDetails(individual:IndividualCrudServiceClass):Observable<Object>{
    console.log("aasuchi Individual update service ku");
    return this.httpClient.put(`${environment.updateIndividualCrudDetailsById}`,individual);

  }
  
  //delete 
  deleteById(id:string):Observable<any>{
    return this.httpClient.put<any>(`${environment.deleteIndividualCrudDetailsById}`,id);
  }

  deleteByIds(ids:number[],language:string):Observable<any>{
    return this.httpClient.get<any>(`${environment.deleteIndividualCrudDetailsByIds}`+"?ids="+ids+"&language="+language);
  }

  //individualDropdownURL
  getIndividualDropdownURL():Observable<IndividualCrudServiceClass[]>{
    return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.individualDropdownURL}`);
  }

  //publish 
  publishById(id:string[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.pubishIndividualById}`,id);
  }
  //discard 
  discardById(id:string[]):Observable<any>{
    return this.httpClient.put<any>(`${environment.discardIndividualById}`,id);
  }

  getDraftedIndividualCurd():Observable<IndividualCrudServiceClass[]>{
    return this.httpClient.get<IndividualCrudServiceClass[]>(`${environment.getDraftedIndividualList}`);
  }

  findProjectIndividualOrgByIndividualIds(ids:number[]):Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.findProjectIndividualOrgByIndividualIds}`+"?ids="+ids);
  }

  checkDuplicateIndividual(name:string,surname:string):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateIndividual}`+"?names="+name+"&nicknames="+surname);
  }
  checkDuplicateMailInIndividual(email:string):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.checkDuplicateMailIndividual}`+"?email="+email);
  }
  
}
// individualCrudSaveUrl