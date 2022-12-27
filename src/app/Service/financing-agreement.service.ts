import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancingAgreement } from '../Service-Class/financing-agreement';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FinancingAgreementService {

  constructor(private httpClient: HttpClient) { }

  getFinancingAgreementList():Observable<FinancingAgreement[]>{
    return this.httpClient.get<FinancingAgreement[]>(`${environment.financingAgreementURL}`);
  }
}
