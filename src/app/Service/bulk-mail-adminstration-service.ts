import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BulkMailAdminstrationServiceClass } from "../Service-Class/bulk-mail-adminstration-service-class";
@Injectable({
    providedIn: 'root'
  })
export class BulkMailAdminstrationService {
    constructor(private httpClient: HttpClient) { }
    sendMail(bulkMailAdminstrationData: BulkMailAdminstrationServiceClass):Observable<Object>{
        return this.httpClient.post(`${environment.bulkMailSendUrl}`,bulkMailAdminstrationData);
      }
}

