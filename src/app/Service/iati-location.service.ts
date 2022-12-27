import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IatiLocation } from '../Service-Class/iati-location';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IatiLocationService {
  //private iatiLocationURL="http://localhost:8080/api/getIatiLocationDetails";

  constructor(private httpClient: HttpClient) { }

  getIatiLocationList():Observable<IatiLocation[]>{
    return this.httpClient.get<IatiLocation[]>(`${environment.iatiLocationURL}`);
  }
}
