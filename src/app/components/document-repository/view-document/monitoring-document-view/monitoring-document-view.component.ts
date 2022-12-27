import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MonitoringDocumentServiceClass } from 'src/app/Service-Class/monitoring-document-service-class';
import { MonitoringCrudService } from 'src/app/Service/monitoring-crud-service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-monitoring-document-view',
  templateUrl: './monitoring-document-view.component.html',
  styleUrls: ['./monitoring-document-view.component.css']
})
/*
* @Author Sunita Parida
* This page is belongs to Monitoring document View module
*/
export class MonitoringDocumentViewComponent implements OnInit {

 monitoringDocDetails: MonitoringDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  budgetProjectName:string;
  constructor(private httpClient: HttpClient,private monitoringService:MonitoringCrudService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.budgetProjectName=localStorage.getItem("budgetProjectName");
    this.fetchMonitoringDataByBudgetProject(this.budgetProjectName);
   /* At page loading time we call the below method to fetch all project document details */
  //  this.fetchMonitoringData();
  }
  private fetchMonitoringDataByBudgetProject(budgetProjectName:string) {
    this.monitoringService.getMonitoringDocumentByBudgetPrj(budgetProjectName).subscribe(data => {
      this.monitoringDocDetails = data;
      if (this.monitoringDocDetails.length == 0) {
        this.noDataHdnFlag = false;
  
      }
    });
  }
/* Here we can fetch all project document upload data by calling servie */
private fetchMonitoringData() {
  this.monitoringService.getMonitoringDocument().subscribe(data => {
    this.monitoringDocDetails = data;
    if (this.monitoringDocDetails.length == 0) {
      this.noDataHdnFlag = false;

    }
  });
}
/* We call below method to download the upload file */
downloadFile(id: any, docAvailable: boolean,fileUpload: String) {
  if (docAvailable == true) {
    // window.open(environment.monitoringDocDownloadrl + id, '_self')
    this.httpClient.get(environment.monitoringDocDownloadrl + id,{responseType: 'blob'})
    .subscribe((resp: any) => {
       FileSaver.saveAs(resp, fileUpload)
    });
  }
  else {
    Swal.fire('Document is not available.', '', 'error')
  }
}
browserLang:any
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
}

dropFile(id: any, docAvailable: boolean) {
  this.getValueByLang()
  if (docAvailable == true) {
    this.monitoringService.monitoringDocDeleteByIdUrl(id).subscribe(data=>{
      // this.projectDocDetails = data;
      this.fetchMonitoringDataByBudgetProject(this.budgetProjectName);
    });
  }
  else {
    (this.browserLang=='en')?Swal.fire('Document is not available.', '', 'error'):Swal.fire('O documento não está disponível.', '', 'error')
  }
}
  /*Dialouge close */
  closeDialoge(){
    const dialogRef = this.dialog.closeAll(
      );
  }
}
