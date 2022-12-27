import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinancialDocumentServiceClass } from 'src/app/Service-Class/financial-document-service-class';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { MonitoringCrudService } from 'src/app/Service/monitoring-crud-service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';

/*
* @Author Sunita Parida
* This page is belongs to Financing document View module
*/
@Component({
  selector: 'app-financing-document-view',
  templateUrl: './financing-document-view.component.html',
  styleUrls: ['./financing-document-view.component.css']
})
export class FinancingDocumentViewComponent implements OnInit {
  financialDocDetails: FinancialDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  constructor(private httpClient: HttpClient,private financingService:FinancingServiceService,private dialog: MatDialog, private monitoringCrudService: MonitoringCrudService) { }
  fundingReferenceName:string;
  ngOnInit(): void {
     /* At page loading time we call the below method to fetch all project document details */
    //  this.fetchFinancingData();
    this.fundingReferenceName=localStorage.getItem('fundingReferenceName');
    this.fetchFinancingDataByrefNm(this.fundingReferenceName);
    
  }
  private fetchFinancingDataByrefNm(fundingReferenceName:string) {
    this.financingService.getFinancingDocumentByRefNm(fundingReferenceName).subscribe(data => {
      this.financialDocDetails = data;
      if (this.financialDocDetails.length == 0) {
        this.noDataHdnFlag = false;
      }
    });
  }
/* Here we can fetch all financing document upload data by calling servie */
private fetchFinancingData() {
  this.financingService.getFinancingDocument().subscribe(data => {
    this.financialDocDetails = data;
    if (this.financialDocDetails.length == 0) {
      this.noDataHdnFlag = false;

    }
  });
}
browserLang:any
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
}
/* We call below method to download the upload file */
downloadFile(id: any, docAvailable: boolean,fileUpload: String) {
  this.getValueByLang()
  if (docAvailable == true) {

    // window.open(environment.financingDocDownloadrl + id, '_self')
    this.httpClient.get(environment.financingDocDownloadrl + id,{responseType: 'blob'})
    .subscribe((resp: any) => {
       FileSaver.saveAs(resp, fileUpload)
    });
   
  }
  else {
    (this.browserLang=='en')?Swal.fire('Document is not available.', '', 'error'):Swal.fire('O documento não está disponível.', '', 'error')
  }
}


dropFile(id: any, docAvailable: boolean) {
  if (docAvailable == true) {
    this.financingService.financingDocDeleteByIdUrl(id).subscribe(data=>{
      // this.projectDocDetails = data;
      this.fetchFinancingData();
    });
  }
  else {
    Swal.fire('Document is not available.', '', 'error')
  }
}


  /*Dialouge close */
  closeDialoge(){
    const dialogRef = this.dialog.closeAll(
      );
  }
}
