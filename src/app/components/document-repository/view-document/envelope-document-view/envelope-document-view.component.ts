import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EnvelopeDocumentServiceClass } from 'src/app/Service-Class/envelope-document-service-class';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { environment } from 'src/environments/environment';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-envelope-document-view',
  templateUrl: './envelope-document-view.component.html',
  styleUrls: ['./envelope-document-view.component.css']
})
/*
* @Author Sunita Parida
* This page is belongs to Envelope document View module
*/
export class EnvelopeDocumentViewComponent implements OnInit {
  envelopeDocDetails: EnvelopeDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  downloadHdnFlag:boolean=true;
  referenceNm:any;
  id:any=null;
  constructor(private httpClient: HttpClient,private envelopeService: EnvelopeServiceService,private dialog: MatDialog,private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get("id");
    
    /* At page loading time we call the below method to fetch all envelope document details */
    this.fetchEnvelopeData()

  }
  /* Here we can fetch all envelope document upload data by calling servie */
  private fetchEnvelopeData() {
    // this.referenceNm=localStorage.getItem("envelopeReference");
    let referenceName=localStorage.getItem("envelopeRefNm")
    // if(this.referenceNm=='null'){
    //   this.envelopeService.getEnvelopeDocument().subscribe(data => {
    //     this.envelopeDocDetails = data;
    //     if (this.envelopeDocDetails.length == 0) {
    //       this.noDataHdnFlag = false;
    //     }
    //   });
    // }else{
      this.envelopeService.getEnvelopeDocumentByRefNm(referenceName).subscribe(data => {
        this.envelopeDocDetails = data;
        if (this.envelopeDocDetails.length == 0) {
          this.noDataHdnFlag = false;
        }
      });
    // }
    

  }
  /* We call below method to download the upload file */
  downloadFile(id: any, docAvailable: boolean,fileUpload: String) {
    if (docAvailable == true) {
      //  return this.httpClient.get(`${environment.envelopeDocDownloadrl }`,id);
      // window.open(this.httpClient.get>(`${environment.envelopeDocDownloadrl}`+id));
      //  window.open(environment.envelopeDocDownloadrl + id);


      this.httpClient.get(environment.envelopeDocDownloadrl+id,{responseType: 'blob'})
 .subscribe((resp: any) => {
    FileSaver.saveAs(resp, fileUpload)
 });

      // this.httpClient.get(environment.envelopeDocDownloadrl+id).subscribe(data => {
        // let data=this.httpClient.get(environment.envelopeDocDownloadrl+id);
        // console.log("data",data);
        // let blob = new Blob(data.fileName, { type: 'application/octet-stream' });
        // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      // });
    }
    else {
      Swal.fire('Document is not available.', '', 'error')
      // return new Observable<Blob>();
    }
  }
  browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }

  /* We call below method to drop the upload file */
  dropFile(id: any, docAvailable: boolean) {
    this.getValueByLang()
    if (docAvailable == true) {
      this.envelopeService.envelopeDocDeleteByIdUrl(id).subscribe(data=>{
        // this.projectDocDetails = data;
        this.fetchEnvelopeData();
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
