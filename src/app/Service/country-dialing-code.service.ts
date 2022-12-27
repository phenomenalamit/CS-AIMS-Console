import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountryDialingCode } from '../Service-Class/country-dialing-code';

@Injectable({
  providedIn: 'root'
})
export class CountryDialingCodeService {

  constructor(private httpClient:HttpClient) { }

  getCountryDialingCodeDetails():Observable<CountryDialingCode[]>{
    return this.httpClient.get<CountryDialingCode[]>(`${environment.countryDialingCodeURl}`);
  }

  getCountryCodeByCountryName(countryName:string):Observable<CountryDialingCode[]>{
    return this.httpClient.get<CountryDialingCode[]>(`${environment.countryCodeByCountryNameURL+'/'+countryName}`);
  }

  getAllCountryDialingCodeDetails():Observable<CountryDialingCode[]>{
    return this.httpClient.get<CountryDialingCode[]>(`${environment.allCountryDialingCodeURl}`);
  }
}
