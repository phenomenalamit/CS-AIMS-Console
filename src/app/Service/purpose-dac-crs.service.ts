import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurposeDACCRS } from '../Service-Class/purpose-dac-crs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PurposeDACCRSService {
 // private PurposeDacCrsURL="http://localhost:8080/api/getPurposeCodesDetails";
  constructor(private httpClient: HttpClient) { }

  getPurposeCodesDetails():Observable<PurposeDACCRS[]>{
    return this.httpClient.get<PurposeDACCRS[]>(`${environment.PurposeDacCrsURL}`);
  }

  getPurposeCodesFiveDetails():Observable<PurposeDACCRS[]>{
    return this.httpClient.get<PurposeDACCRS[]>(`${environment.purposeDacCrsFiveURL}`);
  }

  getPurposeCodesThreeDetails():Observable<PurposeDACCRS[]>{
    return this.httpClient.get<PurposeDACCRS[]>(`${environment.purposeDacCrsThreeURL}`);
  }
  getPurposeCodesAllThreeDetails(searchValue:string):Observable<PurposeDACCRS[]>{
    return this.httpClient.get<PurposeDACCRS[]>(`${environment.purposeDacCrsThreeDigitAllURL}`+"?searchValue="+searchValue);
  }
  getAllPurposeCodesFiveDetails(searchValue:string):Observable<PurposeDACCRS[]>{
    return this.httpClient.get<PurposeDACCRS[]>(`${environment.allPurposeDacCrsFiveURL}`+"?searchValue="+searchValue);
  }
}
