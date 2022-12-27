import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FolderStructureServiceClass } from "../Service-Class/folder-structure-service-class";

@Injectable({
    providedIn: 'root'
  })
  /*
  * @Author Sunita Parida
  * This page is belongs to Folder structure Service File
  */
export class FolderStructureService {
   constructor(private httpClient: HttpClient) { }
/* saveFolderStructure This method is for to save Folder Structure data */
  saveFolderStructure(folderStrData: FolderStructureServiceClass):Observable<Object>{
    return this.httpClient.post(`${environment.foderStrSaveUrl}`,folderStrData);
  }

   /* getFolderStr This method is for to fetch all folder structure details */
   getFolderStr():Observable<FolderStructureServiceClass[]>{
    return this.httpClient.get<FolderStructureServiceClass[]>(`${environment.folderStrDetailsUrl}`);
  }

  /* getFolderStrDataById This method is for to update data by given id */
  getFolderStrDataById(folderStrId :number):Observable<FolderStructureServiceClass[]>{
    return this.httpClient.get<FolderStructureServiceClass[]>(`${environment.editfolderStrIdUrl}`+"?folderStrId="+folderStrId);
  }

  /* deleteFolderStr This method is for to delete a  single record by given id */
  deleteFolderStr(folderStrId :number):Observable<FolderStructureServiceClass[]>{
    return this.httpClient.get<FolderStructureServiceClass[]>(`${environment.deleteFolderStrUrl}`+"?folderStrId="+folderStrId);
  }
}
