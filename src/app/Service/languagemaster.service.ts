import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { LabelMaster } from './label-master';
// import { LanguageMaster } from './language-master';
// import labelData from './data/label-data.json';
// import languageData from './data/language-data.json'
import { of } from 'rxjs/internal/observable/of';
@Injectable({
  providedIn: 'root'
})
export class LanguagemasterService {

//  private baseURL = "http://192.168.203.117:9090/languageservice/api/v1/";

//  private baseURL = "http://192.168.203.117:8081/api/v1/";

//  private baseURL = "http://localhost:8081/api/v1/";

// private baseURL = "http://117.247.252.237/languageservice/api/v1/";

  // private baseURL = "http://192.168.10.76/languageservice/api/v1/";

  private baseURL = "http://localhost:8088/api/v1/";
  private viewURL = this.baseURL+"viewLanguageMaster";
  private saveURL = this.baseURL+"saveLanguage";
  private editURL = this.baseURL+"editLanguage";
  private updateURL = this.baseURL+"updateLanguage";
  private getLanguageCodeURL = this.baseURL+"getLanguageCode";
  private getSelectedLangLabelData = this.baseURL+"getSelectedLangLabelDetails";

  static idChange: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(private httpClient: HttpClient) { }

  // getLanguageMasterList(): Observable<LanguageMaster[]>{
  //   return this.httpClient.get<LanguageMaster[]>(`${this.viewURL}`);
  // }

  // getLanguageMasterList(){
  //   return languageData;
  // }

  // createLanguage(language: LanguageMaster): Observable<Object>{
  //   return this.httpClient.post(`${this.saveURL}`,language,{responseType: "text" as "json"});
  // }

  // getLanguageById(id: number): Observable<LanguageMaster> {
  //   return this.httpClient.get<LanguageMaster>(`${this.editURL}/${id}`);
  // }

  // updateLanguage(language: LanguageMaster): Observable<Object>{
  //   return this.httpClient.post(`${this.updateURL}`,language,{responseType: "text" as "json"});
  // }

  // getLanguageCode(id: number): Observable<string>{
  //   return this.httpClient.get<string>(`${this.getLanguageCodeURL}/${id}`,{responseType: "text" as "json"});
  // }
  // labelArr : LabelMaster[];
  // getSelectedLanguageLabelData(id: number): Observable<LabelMaster[]>{
  //   //debugger
  //   // return this.httpClient.get<LabelMaster[]>(`${this.getSelectedLangLabelData}/${id}`);
  //   if(id==1){
  //     this.labelArr = labelData[1];
  //   }
  //   else if(id==2){
  //     this.labelArr = labelData[2];
  //   }
  //   return of(this.labelArr);
  // }

  // getLabelData(id: number) : any{
  //   if(id==1){
  //     this.labelArr = labelData[1];
  //   }
  //   else if(id==2){
  //     this.labelArr = labelData[2];
  //   }
  //   // debugger
  //   // console.log("label data : ",this.labelArr)
  //  return this.labelArr;
  // }

}
