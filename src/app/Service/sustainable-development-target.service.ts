import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SustainableDevelopmentTarget } from '../Service-Class/sustainable-development-target';

@Injectable({
  providedIn: 'root'
})
export class SustainableDevelopmentTargetService {

  constructor(private httpClient:HttpClient) { }

  getSustainableDevelopmentTargets(goal_id:string[]): Observable<SustainableDevelopmentTarget[]>{
      return this.httpClient.get<SustainableDevelopmentTarget[]>(`${environment.sustainableDevelopmentTarget}`+"?goal_id="+goal_id);
  }
  getAllSustainableDevelopmentTargets(searchValue:string): Observable<SustainableDevelopmentTarget[]>{
    return this.httpClient.get<SustainableDevelopmentTarget[]>(`${environment.allSustainableDevelopmentTarget}`+"?searchValue="+searchValue);
}
}
