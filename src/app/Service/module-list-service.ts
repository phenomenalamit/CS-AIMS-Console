import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ModuleListClass } from "../Service-Class/module-list-class";

@Injectable({
    providedIn: 'root'
  })
export class ModuleListService {
    constructor(private httpClient: HttpClient) { }

    getModuleList():Observable<ModuleListClass[]>{
        return this.httpClient.get<ModuleListClass[]>(`${environment.moduleListURL}`);
      }
}
