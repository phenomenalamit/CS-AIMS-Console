import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SustainableDevelopmentGoal } from '../Service-Class/sustainable-development-goal';

@Injectable({
  providedIn: 'root'
})
export class SustainableDevelopmentGoalService {

  constructor(private httpClient:HttpClient) { }

  getSustainableDevelopmentGoal(): Observable<SustainableDevelopmentGoal[]>{
     return this.httpClient.get<SustainableDevelopmentGoal[]>(`${environment.sustainableDevelopmentGoal}`);
  }
  getAllSustainableDevelopmentGoal(searchValue:string): Observable<SustainableDevelopmentGoal[]>{
    return this.httpClient.get<SustainableDevelopmentGoal[]>(`${environment.allSustainableDevelopmentGoal}`+"?searchValue="+searchValue);
 }
}
