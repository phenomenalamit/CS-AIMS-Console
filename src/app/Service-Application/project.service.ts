import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurposeCode } from '../model/purpose-code';
import { Donor } from '../Service-Class/donor';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private donorURL="http://localhost:8080/api/getDonorDetails";
  private purposeCodeURL="http://localhost:8080/api/getPurposeCodesDetails";
  constructor(private httpclient:HttpClient) { }

  getDonorList():Observable<Donor[]>{

    return this.httpclient.get<Donor[]>(`${this.donorURL}`);
  }

  getPurposeCodeList():Observable<PurposeCode[]>{
    console.log("values aasuni");
    return this.httpclient.get<PurposeCode[]>(`${this.purposeCodeURL}`);
  }
}
