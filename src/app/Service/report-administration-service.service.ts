import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReportAdministration } from '../Service-Class/report-administration';

@Injectable({
  providedIn: 'root'
})
export class ReportAdministrationServiceService {

  constructor(private httpClient: HttpClient) { }

  getReportAdmin():Observable<ReportAdministration[]>{
    return this.httpClient.get<ReportAdministration[]>(`${environment.getAllReportsURL}`);
  }

  saveReports(reportObj: ReportAdministration) {
    return this.httpClient.post(`${environment.saveReportURL}`,reportObj);
  }

  deleteReports(id: number):Observable<ReportAdministration[]> {
    return this.httpClient.get<ReportAdministration[]>(`${environment.deleteReportURL}`+"?id="+id);
  }
}
