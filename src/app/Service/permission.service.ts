import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from '../Service-Class/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private httpClient: HttpClient) { }

  getPermissionDetailsUrl():Observable<Permission[]>{
    return this.httpClient.get<Permission[]>(`${environment.getPermissionDetailsUrl}`);
  }
  getAllPermissonDetails(searchValue:string):Observable<Permission[]>{
    return this.httpClient.get<Permission[]>(`${environment.allPermissionDetailsUrl}`+"?searchValue="+searchValue);
  }
}
