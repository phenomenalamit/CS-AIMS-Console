import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisbursmentDocumentServiceClass } from 'src/app/Service-Class/disbursment-document-service-class';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
/*
* @Author Sunita Parida
* This page is belongs to Disbursment document View module
*/
@Component({
  selector: 'app-disbursement-document-view',
  templateUrl: './disbursement-document-view.component.html',
  styleUrls: ['./disbursement-document-view.component.css']
})
export class DisbursementDocumentViewComponent implements OnInit {
  disbursmentDocDetails: DisbursmentDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  constructor(private httpClient: HttpClient,private disbursmentService:DisbursementCrudServiceService,private dialog: MatDialog) { }
  disbursementRefNm:string
  ngOnInit(): void {
this.disbursementRefNm=localStorage.getItem('disbursementRefNm');
   /* At page loading time we call the below method to fetch all Disbursment document details */
  //  this.fetchDisbursmentData();
  this.fetchDisbursmentDataByRefNm(this.disbursementRefNm);
  }
/* Here we can fetch all Disbursment document upload data by calling servie */
private fetchDisbursmentData() {
  this.disbursmentService.getDisbursmentDocument().subscribe(data => {
    this.disbursmentDocDetails = data;
    if (this.disbursmentDocDetails.length == 0) {
      this.noDataHdnFlag = false;
    }
  });
}
private fetchDisbursmentDataByRefNm(disbursementRefNm:string) {
  this.disbursmentService.getDisbursmentDocumentByRefNm(disbursementRefNm).subscribe(data => {
    this.disbursmentDocDetails = data;
    if (this.disbursmentDocDetails.length == 0) {
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
    // window.open(environment.disbursmentDocDownloadrl + id, '_self')
    this.httpClient.get(environment.disbursmentDocDownloadrl + id,{responseType: 'blob'})
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
    this.disbursmentService.disbursementDocDeleteByIdUrl(id).subscribe(data=>{
      // this.projectDocDetails = data;
      this.fetchDisbursmentData();
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
