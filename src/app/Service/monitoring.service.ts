import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonitoringClass } from '../Service-Class/monitoring-class';
import {environment} from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  //private recommendationURL="http://localhost:8080/api/getRecommendationDetails";
  //private findingURL="http://localhost:8080/api/getFindingDetails";
  //private optionFindingURL="http://localhost:8080/api/getOptionFindingUnderFindingId";



  constructor(private httpClient: HttpClient) { }

  getRecommendationList():Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.recommendationURL}`);
  }
  getFindingList():Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.findingURL}`);
  }

  getOptionByFindingId(findingId :number):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.optionFindingURL}`+"?findingId="+findingId);
  }
  getLevelOfAction():Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.levelOfActionUrl}`);
  }
  getReasonForAddendum():Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.reasonForAddendumUrl}`);
  }
  getConstraintList():Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.constraintURL}`);
  }

  getAllLevelOfAction(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allLevelOfActionUrl}`+"?searchValue="+searchValue);
  }
  getAllReasonForAddendum(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allReasonForAddendumUrl}`+"?searchValue="+searchValue);
  }
  getAllFindingList(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allFindingURL}`+"?searchValue="+searchValue);
  }
  getAllOptionForFinding(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allOptionForFindingURL}`+"?searchValue="+searchValue);
  }
  getAllConstraintList(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allConstraintURL}`+"?searchValue="+searchValue);
  }
  getAllRecommendationList(searchValue:string):Observable<MonitoringClass[]>{
    return this.httpClient.get<MonitoringClass[]>(`${environment.allRecommendationURL}`+"?searchValue="+searchValue);
  }
}
