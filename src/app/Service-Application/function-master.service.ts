import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FunctionMaster, FunctionMasterFilterBean } from '../model/function-master';



@Injectable({
  providedIn: 'root'
})
export class FunctionMasterService {
  // private getURL = "http://localhost:8080/api/getFunctionMasterDetails";
  // private saveURL = "http://localhost:8080/api/registerFunctionMaster";
  // private getByIdURL = "http://localhost:8080/api/getFunctionMasterDetailsById";
  // private updateURL="http://localhost:8080/api/updateFunctionMasterDetails";
  constructor(private httpClient: HttpClient) { }

  getFunctionMasterList(): Observable<FunctionMaster[]> {
    return this.httpClient.get<FunctionMaster[]>(`${environment.getFunctionMasterURL}`);
  }

  getFunctionMasterDetailsForPLinkByOrder(): Observable<FunctionMaster[]> {
    return this.httpClient.get<FunctionMaster[]>(`${environment.getFunctionMasterDetailsForPLinkByOrder}`);
  }

  checkFunctionMasterName(functionMaster: FunctionMaster):Observable<FunctionMaster[]>{
    return this.httpClient.post<FunctionMaster[]>(`${environment.checkDuplicateFunctionMasterURL}`,functionMaster);
  }

  saveFunctionMaster(functionMaster: FunctionMaster): Observable<Object> {
 
    return this.httpClient.post(`${environment.saveFunctionMasterURL}`, functionMaster);

  }


  getFunctionMasterById(functionId: number): Observable<FunctionMaster> {
    return this.httpClient.get<FunctionMaster>(`${environment.getFunctionMasterByIdURL}/${functionId}`);
  }

  updateFunctionMaster(functionMaster:FunctionMaster):Observable<Object>{

    return this.httpClient.post(`${environment.updateFunctionMasterURL}`,functionMaster);

  }

  filterData(functionMasterFilterBean :FunctionMasterFilterBean):Observable<FunctionMaster[]>{
    return this.httpClient.post<FunctionMaster[]>(`${environment.filterfunctionMaster}`,functionMasterFilterBean);
  }
}
