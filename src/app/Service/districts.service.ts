import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Districts } from 'src/app/Service-Class/districts';
import {environment} from 'src/environments/environment';
import { Provinces } from '../Service-Class/provinces';


@Injectable({
  providedIn: 'root'
})
export class DistrictsService {
  
  //private districtURL="http://localhost:8080/api/getDistrictsDetailsUnderprovincesId";
  
  constructor(private httpClient: HttpClient) { }

  getDistrictByProvinceId(provinceId :number[]):Observable<Districts[]>{
    console.log("?provinces_id="+provinceId);
    return this.httpClient.get<Districts[]>(`${environment.districtURL}`+"?provinces_id="+provinceId);
  }

  getAllDistrictURL(){
    return this.httpClient.get<Districts[]>(`${environment.getAllDistrictURL}`);
  }
  getAllDistrictsURL(searchValue:string){
    return this.httpClient.get<Districts[]>(`${environment.allDistrictURL}`+"?searchValue="+searchValue);
  }

  
}