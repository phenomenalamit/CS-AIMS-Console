import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { MonitoringCrudServiceClass } from "../Service-Class/monitoring-crud-service-class";
import { MonitoringDocumentServiceClass } from "../Service-Class/monitoring-document-service-class";
@Injectable({
    providedIn: 'root'
  })
export class MonitoringCrudService {

    constructor(private httpClient: HttpClient) { }
    /* saveMonitoringData This method is for to save monitoring data */
    saveMonitoringData(monitoringData: MonitoringCrudServiceClass):Observable<Object>{
      return this.httpClient.post(`${environment.monitoringSaveUrl}`,monitoringData);
    }
  /* getMonitoringDetails This method is for to fetch all monitoring data */
  getMonitoringDetails(limits:any):Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.monitoringDetailsUrl}`+"?limits="+limits);
  }
  getMonitoringAllDetails():Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.monitoringAllDetailsUrl}`);
  }
  download(id):Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.financingDocDownloadrl}`+id);
  }
  /* deleteMonitoring This method is for to delete a  single record by given id */
  deleteMonitoring (contractId :number[],language:string):Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.deleteMonitoringUrl}`+"?contractId="+contractId+"&language="+language);
  }
  /* viewMoreBycontractId This is for to fetch monitoring details by contract id */
  viewMoreBycontractId(contractId :number):Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.viewMoreMonitoringUrl}`+"?contractId="+contractId);
  }
/* editByMonitoringId This is for to fetch monitoring details by contract id */
  editByMonitoringId(monitoringId :number):Observable<MonitoringCrudServiceClass[]>{
    return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.editMonitoringUrl}`+"?monitoringId="+monitoringId);
  }
 /* saveDraftMonitoringData This method is for to save draft monitoring data */
 saveDraftMonitoringData(monitoringData: MonitoringCrudServiceClass):Observable<Object>{
  return this.httpClient.post(`${environment.monitoringSaveDraftUrl}`,monitoringData);
}
  /* getSaveAsDraftMonitoringData This method is for to fetch all monitoring save as draft values*/
getSaveAsDraftMonitoringData(usergroup:string):Observable<MonitoringCrudServiceClass[]>{
  return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.monitoringSaveAsDraftDetailsUrl}`+"?usergroup="+usergroup);
}

getDraftByMonitoringId(monitoringId :number):Observable<MonitoringCrudServiceClass[]>{
  return this.httpClient.get<MonitoringCrudServiceClass[]>(`${environment.getDraftByIdUrl}`+"?monitoringId="+monitoringId);
}

    /* Monitoring Doument upload start */
  saveMonitoringDocumnet(monitoringDocumentData: MonitoringDocumentServiceClass,file: File ):Observable<Object>{
   const formdata: FormData = new FormData();  
   formdata.append('file', file); 
   formdata.append('monitoring', JSON.stringify(monitoringDocumentData)); 
   let url=`${environment.monitoringDocUrl}`;
   return this.httpClient.post(url,formdata);
 }

/* getMonitoringDocument This is for to fetch all monitoring document details */
getMonitoringDocument():Observable<MonitoringDocumentServiceClass[]>{
 return this.httpClient.get<MonitoringDocumentServiceClass[]>(`${environment.monitoringDocDetailsUrl}`);
}
/* getMonitoringDocument This is for to fetch  monitoring document details by budget prj details*/
getMonitoringDocumentByBudgetPrj(budgetProjectName:string):Observable<MonitoringDocumentServiceClass[]>{
  return this.httpClient.get<MonitoringDocumentServiceClass[]>(`${environment.monitoringDocDetailsByBudgetPrjUrl}`+"?budgetProjectName="+budgetProjectName);
 }
 /* Monitoring Doument upload end */
monitoringDocDeleteByIdUrl(monitoringId:number):Observable<MonitoringDocumentServiceClass[]>{
  return this.httpClient.put<MonitoringDocumentServiceClass[]>(`${environment.monitoringDocDeleteByIdUrl+"/"+monitoringId}`,"");
}

}
