import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { LabelMaster } from './label-master';

@Injectable({
  providedIn: 'root'
})
export class LabelMasterService {

  // private baseURL = "http://192.168.203.117:9090/languageservice/api/v1/";

  // private baseURL = "http://192.168.203.117:8081/api/v1/";

  // private baseURL = "http://localhost:8081/api/v1/";

  private baseURL = "http://117.247.252.237/languageservice/api/v1/";

  // private baseURL = "http://192.168.10.76/languageservice/api/v1/";

  private viewURL= this.baseURL+"viewLabelMaster";
  private saveURL = this.baseURL+"saveLabel";
  
  constructor(private httpClient: HttpClient) { }

  // getLabelMasterList(): Observable<LabelMaster[]>{
  //   return this.httpClient.get<LabelMaster[]>(`${this.viewURL}`);
  // }

  // createLabel(label: LabelMaster): Observable<Object>{
  //   return this.httpClient.post(`${this.saveURL}`,label,{responseType: "text" as "json"});
  // }

}
