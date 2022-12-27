import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Donor } from '../Service-Class/donor';
import {environment} from 'src/environments/environment';
import { Organization } from '../model/organization';


@Injectable({
  providedIn: 'root'
})
export class DonorService {
  //private donorURL="http://localhost:8080/api/getDonorDetails";

  constructor(private httpClient: HttpClient) { }

  getDonorList():Observable<Donor[]>{
    return this.httpClient.get<Donor[]>(`${environment.donorURL}`);
  }

  getDonorListFunding():Observable<Organization[]>{
    return this.httpClient.get<Organization[]>(`${environment.getdonorFundingURL}`);
  }

  getDonorListByUserAccess(userAccessId:any):Observable<Organization[]>{
    return this.httpClient.get<Organization[]>(`${environment.getDonorListByUserAccess}`+"?userAccessId="+userAccessId);
  }
}
