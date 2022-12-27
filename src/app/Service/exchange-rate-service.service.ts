import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExchangeRate, ExchangeRateBean } from '../Service-Class/exchange-rate';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateServiceService {
 

  constructor(private httpClient: HttpClient) { }

  getExchangeRate():Observable<ExchangeRate[]>{
    return this.httpClient.get<ExchangeRate[]>(`${environment.getAllExchangeRateURL}`);
  }


  saveExchangeRate(exchangeRateObj: ExchangeRate) {
    return this.httpClient.post(`${environment.saveExchangeURL}`,exchangeRateObj);
  }

  deleteExchangeRate(id: number):Observable<ExchangeRate[]> {
    return this.httpClient.get<ExchangeRate[]>(`${environment.deleteExchangeRateURL}`+"?id="+id);
  }
  filterData(exchangeData:ExchangeRateBean):Observable<ExchangeRate[]>{
    return this.httpClient.post<ExchangeRate[]>(`${environment.filterExchangeRate}`,exchangeData);
  }
  
}
