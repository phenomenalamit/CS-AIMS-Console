import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Label } from "../components/main-components/manage-language/manage-language.component";
import { GlobalLink } from "../model/global-link";
import { PrimaryLink } from "../Service-Class/primary-link";

@Injectable({
    providedIn: 'root'
})
export class ManageLanguageService {


    constructor(private httpClient: HttpClient) { }

    getModules(): Observable<GlobalLink[]> {
        return this.httpClient.get<GlobalLink[]>(`${environment.getManageLanguageServiceAllGlobalLink}`);
    }
    getSubmodules(glId: number): Observable<PrimaryLink[]> {
        return this.httpClient.get<PrimaryLink[]>(`${environment.getManageLanguageServicePrimaryLink}` + glId);
    }
    getLabelDetails(plId: number){
        return this.httpClient.get<any>(`${environment.getManageLanguageServiceLabelData}` + plId);
    }
    updateLabel(data:Label):Observable<string>{
          return this.httpClient.patch<string>(`${environment.updateManageLanguageServiceLabelValue}`,data,{responseType: "text" as "json"});
    }
}