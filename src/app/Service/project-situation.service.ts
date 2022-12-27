import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectSituation } from '../Service-Class/project-situation';

@Injectable({
  providedIn: 'root'
})
export class ProjectSituationService {

  constructor(private httpClient: HttpClient) { }

  getProjectSituationList(): Observable<ProjectSituation[]>{
      return this.httpClient.get<ProjectSituation[]>(`${environment.projectSituationURL}`);
  }
  getAllProjectSituationList(searchValue:string): Observable<ProjectSituation[]>{
    return this.httpClient.get<ProjectSituation[]>(`${environment.allProjectSituationURL}`+"?searchValue="+searchValue);
}
}
