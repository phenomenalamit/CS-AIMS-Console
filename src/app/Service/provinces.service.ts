import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provinces } from '../Service-Class/provinces';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProvincesService {
  //private provincesURL="http://localhost:8080/api/getProvincesDetails";
  constructor(private httpClient: HttpClient) { }

  getProvincesList():Observable<Provinces[]>{
    return this.httpClient.get<Provinces[]>(`${environment.provincesURL}`);
  }
  getAllProvincesList(searchValue:string):Observable<Provinces[]>{
    return this.httpClient.get<Provinces[]>(`${environment.allProvincesURL}`+"?searchValue="+searchValue);
  }
}
