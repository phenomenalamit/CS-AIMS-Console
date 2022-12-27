import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDocumentServiceClass } from 'src/app/Service-Class/payment-document-service-class';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-document-view',
  templateUrl: './payment-document-view.component.html',
  styleUrls: ['./payment-document-view.component.css']
})
export class PaymentDocumentViewComponent implements OnInit {
  paymentDocDetails: PaymentDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  paymentReferenceName:string
  constructor(private httpClient: HttpClient,private paymentService:PaymentCrudServiceService,private dialog: MatDialog) { }

  ngOnInit(): void {
   /* At page loading time we call the below method to fetch all payment document details */
  //  this.fetchPaymentData();
  this.paymentReferenceName=localStorage.getItem('paymentReferenceName')
  this.fetchPaymentDataByRefNm(this.paymentReferenceName);
  }
  private fetchPaymentDataByRefNm(paymentReferenceName:string) {
    this.paymentService.getPaymentDocumentByRefNm(paymentReferenceName).subscribe(data => {
      this.paymentDocDetails = data;
      if (this.paymentDocDetails.length == 0) {
        this.noDataHdnFlag = false;
      }
    });
  }
/* Here we can fetch all payment document upload data by calling servie */
private fetchPaymentData() {
  this.paymentService.getPaymentDocument().subscribe(data => {
    this.paymentDocDetails = data;
    if (this.paymentDocDetails.length == 0) {
      this.noDataHdnFlag = false;
    }
  });
}
browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
/* We call below method to download the upload file */
downloadFile(id: any, docAvailable: boolean,fileUpload:String) {
  this.getValueByLang()
  if (docAvailable == true) {
    // window.open(environment.paymentDocDownloadrl + id, '_self')
    this.httpClient.get(environment.paymentDocDownloadrl + id,{responseType: 'blob'})
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
    this.paymentService.paymentDocDeleteByIdUrl(id).subscribe(data=>{
      // this.projectDocDetails = data;
      this.fetchPaymentData();
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
