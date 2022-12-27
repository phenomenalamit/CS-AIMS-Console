import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserAccessClass } from "../Service-Class/user-access-class";
@Injectable({
    providedIn: 'root'
  })
export class ForgotPasswordService {
    constructor(private httpClient :HttpClient) { }

    mailPassword(userAccessId: number,language:string):Observable<Object>{
        return this.httpClient.post(`${environment.passwordSentUrl}`+"?language="+language,userAccessId,{headers:{skip:"true"}});
      }
}
