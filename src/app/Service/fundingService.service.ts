import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FundingServiceClass } from '../Service-Class/fundingServiceClass-class';
import {environment} from 'src/environments/environment';
import { EnvelopeServiceClass } from '../Service-Class/envelope-service-class';



@Injectable({
  providedIn: 'root'
})
export class FundingServiceService {
 // private stateBudgetURL="http://localhost:8080/api/getStateBudgetDetails";
  constructor(private httpClient: HttpClient) { }
  getStateBudgetList():Observable<FundingServiceClass[]>{
    return this.httpClient.get<FundingServiceClass[]>(`${environment.stateBudgetURL}`);
  }
  getMpoData(startYr :number,endYr:number):Observable<{}>{
    return this.httpClient.get<{}>(`${environment.getMpoDetails}`+"?startyear="+startYr+"&endYear="+endYr);
  }
}
