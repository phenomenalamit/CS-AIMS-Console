import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CodeManagement } from '../Service-Class/code-management';

@Injectable({
  providedIn: 'root'
})
export class FieldManagementServiceService {

  constructor(private httpClient: HttpClient) { }

  // saveNewElement(body):Observable<CodeManagement>{
  //   const headers= new HttpHeaders()
  //   .set('content-type', 'application/json')
  //   .set('Access-Control-Allow-Origin', '*')
  //   .set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS')
  //   .set('Access-Control-Allow-Headers','Content-Type');
  //  return this.httpClient.post<CodeManagement>(`${environment.saveNewElementURL}`,body,{ 'headers': headers});
  // }

  saveNewElement(newElement: CodeManagement):Observable<Object>{
    return this.httpClient.post(`${environment.saveNewElementURL}`,newElement);
  }
}
