import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../Service-Class/project';
import {environment} from 'src/environments/environment';
import { ProjectDocumentServiceClass } from '../Service-Class/project-document-service-class';
import { ProjectCrud } from '../Service-Class/project-crud';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
 // private baseURL="http://localhost:8080/api/getProjectDetails";

  constructor(private httpClient: HttpClient) { }

  getProjectList():Observable<Project[]>{
    return this.httpClient.get<Project[]>(`${environment.projectURL}`);
  }

  getPmtProjectTitleDetailsByUserAccessId(userAccessId:any):Observable<Project[]>{
    return this.httpClient.get<Project[]>(`${environment.getPmtProjectTitleDetailsByUserAccessId}`+"?userAccessId="+userAccessId);
  }

  getOnBudgetProjectList():Observable<ProjectCrud[]>{
    return this.httpClient.get<ProjectCrud[]>(`${environment.onBudgetProjectURL}`);
  }
   /* Project Doument upload start */
   saveProjectDocumnet(projectDocumentData: ProjectDocumentServiceClass,file: File ):Observable<Object>{
    const formdata: FormData = new FormData();  
    formdata.append('file', file); 
    formdata.append('project', JSON.stringify(projectDocumentData)); 
    let url=`${environment.projectDocUrl}`;
    return this.httpClient.post(url,formdata);
  }

  /* getProjectDocument This is for to fetch all project document details */
  getProjectDocument():Observable<ProjectDocumentServiceClass[]>{
    return this.httpClient.get<ProjectDocumentServiceClass[]>(`${environment.projectDocDetailsUrl}`);
  }
  getProjectDocumentById(projectTitle :string):Observable<ProjectDocumentServiceClass[]>{
    return this.httpClient.get<ProjectDocumentServiceClass[]>(`${environment.prjDocDetailsByIdUrl}`+"?projectTitle="+projectTitle);
  }
  projectDocDeleteByIdUrl(projectId:number):Observable<ProjectDocumentServiceClass[]>{
    return this.httpClient.put<ProjectDocumentServiceClass[]>(`${environment.projectDocDeleteByIdUrl+"/"+projectId}`,"");
  }
  /* Project Doument upload end */
}
