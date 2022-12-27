import { Component, OnInit } from '@angular/core';
import { ProjectDocumentServiceClass } from 'src/app/Service-Class/project-document-service-class';
import { ProjectService } from 'src/app/Service/project.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-document-view',
  templateUrl: './project-document-view.component.html',
  styleUrls: ['./project-document-view.component.css']
})

/*
* @Author Sunita Parida
* This page is belongs to Project document View module
*/
export class ProjectDocumentViewComponent implements OnInit {
  projectDocDetails: ProjectDocumentServiceClass[] = [];
  noDataFound: string = "No Data Present";
  noDataHdnFlag: any = true;
  constructor(private httpClient: HttpClient,private projectService:ProjectService) { }
  projectTitleName:any
  ngOnInit(): void {
    this.projectTitleName=localStorage.getItem("projectTitle")
    this.fetchProjectDataByRefNm(this.projectTitleName);
   /* At page loading time we call the below method to fetch all project document details */
  //  this.fetchProjectData();
  }
  projectTitle=null;
  private fetchProjectDataByRefNm(projectTitleName:string){
    this.projectService.getProjectDocumentById(projectTitleName).subscribe(data => {
      this.projectDocDetails = data;
      console.log(this.projectDocDetails)
      if (this.projectDocDetails.length == 0) {
        this.noDataHdnFlag = false;
      }
    });
  }
/* Here we can fetch all project document upload data by calling servie */
private fetchProjectData() {
  this.projectTitle=localStorage.getItem("projectTitle");
  if(this.projectTitle==null){
    this.projectService.getProjectDocument().subscribe(data => {
      this.projectDocDetails = data;
      if (this.projectDocDetails.length == 0) {
        this.noDataHdnFlag = false;
      }
    });
  }else{
    this.projectService.getProjectDocumentById(this.projectTitle).subscribe(data => {
      this.projectDocDetails = data;
      console.log(this.projectDocDetails)
      if (this.projectDocDetails.length == 0) {
        this.noDataHdnFlag = false;
      }
    });
  }
}
browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* We call below method to download the upload file */
  downloadFile(id: any, docAvailable: boolean,fileUpload:String) {
    this.getValueByLang()
    if (docAvailable == true) {
      // window.open(environment.projectDocDownloadrl + id, '_self')
      this.httpClient.get(environment.projectDocDownloadrl + id,{responseType: 'blob'})
      .subscribe((resp: any) => {
         FileSaver.saveAs(resp, fileUpload)
      });
    }
    else {
      (this.browserLang=='en')?Swal.fire('Document is not available.', '', 'error'):Swal.fire('O documento não está disponível.', '', 'error')
    }
  }

  /* We call below method to drop the upload file */
  dropFile(id: any, docAvailable: boolean) {
    if (docAvailable == true) {
      this.projectService.projectDocDeleteByIdUrl(id).subscribe(data=>{
        // this.projectDocDetails = data;
        this.fetchProjectData();
      });
    }
    else {
      Swal.fire('Document is not available.', '', 'error')
    }
  }
}
