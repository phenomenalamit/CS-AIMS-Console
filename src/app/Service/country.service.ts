import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../Service-Class/country';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private httpClient: HttpClient) { }

  getCountry():Observable<Country[]>{
    return this.httpClient.get<Country[]>(`${environment.countryURL}`);
  }
}
