import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from '../Service-Class/currency';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  //private currencyURL="http://localhost:8080/api/getCurrencyDetails";
  constructor(private httpClient: HttpClient) { }

  getCurrencyDetails():Observable<Currency[]>{
    return this.httpClient.get<Currency[]>(`${environment.currencyURL}`);
  }
  getAllCurrencyDetails(searchVal:string):Observable<Currency[]>{
    return this.httpClient.get<Currency[]>(`${environment.allCurrencyURL}`+"?searchVal="+searchVal);
  }
}
