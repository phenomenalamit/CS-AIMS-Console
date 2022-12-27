import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalLink, GlobalLinkFilterBean } from '../model/global-link';


@Injectable({
  providedIn: 'root'
})
export class GlobalLinkServiceService {


  // private saveURL="http://localhost:8080/api/registerGlobalLink";
  // private updateURL="http://localhost:8080/api/updateGlobalLinkDetails";
  // private getURL="http://localhost:8080/api/getGlobalLinkDetails";
  // private getByIdURL="http://localhost:8080/api/getGlobalLinkDetailsById";
  // private checkDuplicateGlobalLinkURL="http://localhost:8080/api/checkDuplicateGlobalLinkName";

  constructor(private httpclient:HttpClient) { }

  saveGlobalLink(globalLink:GlobalLink):Observable<Object>{
 
    return this.httpclient.post(`${environment.saveGlobalLinkURL}`,globalLink);

  }

  checkGlobalLinkName(globalLink:GlobalLink):Observable<Object>{
   
    return this.httpclient.post(`${environment.checkDuplicateGlobalLinkURL}`,globalLink);

  }

  updateGlobalLink(globalLink:GlobalLink):Observable<Object>{
    
    return this.httpclient.post(`${environment.updateGlobalLinkURL}`,globalLink);

  }
  getGlobalLinkById(globalLinkId:number):Observable<GlobalLink>{
    return this.httpclient.get<GlobalLink>(`${environment.getGlobalLinkByIdURL}/${globalLinkId}`);
  }


  getGlobalLinkList():Observable<GlobalLink[]>{
    return this.httpclient.get<GlobalLink[]>(`${environment.getGlobalLinkURL}`);
  }

  getAllGlobalLinkForPrimaryByOrder():Observable<GlobalLink[]>{
    return this.httpclient.get<GlobalLink[]>(`${environment.getAllGlobalLinkForPrimaryByOrder}`);
  }

  filterData(globalLinkFilterBean :GlobalLinkFilterBean):Observable<GlobalLink[]>{
    return this.httpclient.post<GlobalLink[]>(`${environment.filterGlobalLink}`,globalLinkFilterBean);
  }

  // generateExcel():any{
  //   let HTTPOptions:Object = {
  //     headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //     }),
  //     responseType: 'blob' as 'json'  
  //  }
  //   return this.httpclient.get<any>(`${environment.globalLinkExcelUrl}`,HTTPOptions);
  //   // return this.httpclient.get<>(`${environment.globalLinkExcelUrl}`);
  // }

  generateExcel(file: string | undefined): Observable<Blob> {
    return this.httpclient.get(`${environment.globalLinkExcelUrl}`, {
      responseType: 'blob'
    });
  }
}
