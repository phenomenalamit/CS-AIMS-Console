import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BankOfMozambique } from '../Service-Class/bank-of-mozambique';


@Injectable({
  providedIn: 'root'
})
export class BankOfMozambiqueService {

  constructor(private httpClient: HttpClient) { }


  getCurrencyAmount():Observable<BankOfMozambique[]>{
    return this.httpClient.get<BankOfMozambique[]>(`${environment.currencyAmountURL}`);
  }

  getCurrencyJson(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
    //return this.httpClient.post<BankOfMozambique>(`${environment.currencyJsonURL}`,body,{ 'headers': headers , responseType: 'text' as 'json'});

    return this.httpClient.post<BankOfMozambique>(`${environment.currencyJsonURL}`,body,{ 'headers': headers});
  }

  getFinanceAllocation(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getFinanceAllocationURL}`,body,{ 'headers': headers});
  }

  getYearWiseCurrency(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getYearWiseCurrencyURL}`,body,{ 'headers': headers});
  }

  getOdaAmount(body:BankOfMozambique):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getOdaAmountURL}`,body,{ 'headers': headers});
  }


  getMznAmtFromUSD(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getMznFromUSD}`,body,{ 'headers': headers});
  }
  getOdaAmountUsd(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getOdaAmountUsdURL}`,body,{ 'headers': headers});
  }
  getOdaAmountMzn(body):Observable<BankOfMozambique>{
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
    .set('Access-Control-Allow-Headers','Content-Type');
   return this.httpClient.post<BankOfMozambique>(`${environment.getOdaAmountMznURL}`,body,{ 'headers': headers});
  }
}
