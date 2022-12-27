import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { ProjectCrudService } from 'src/app/Service-Application/project-crud.service';
import { Donor } from 'src/app/Service-Class/donor';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { ProjectCrud } from 'src/app/Service-Class/project-crud';
import { ProjectDocumentServiceClass } from 'src/app/Service-Class/project-document-service-class';
import { DonorService } from 'src/app/Service/donor.service';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { ProjectService } from 'src/app/Service/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-document-upload',
  templateUrl: './project-document-upload.component.html',
  styleUrls: ['./project-document-upload.component.css']
})
export class ProjectDocumentUploadComponent implements OnInit {

  public projectUploadForm!: FormGroup;
  stores;
  fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  donorName = new FormControl('');
  selectedFiles: FileList;
  currentFileUpload: File;
  projectDocumentData:ProjectDocumentServiceClass=new ProjectDocumentServiceClass();
  projectTitle:any
constructor( private fundingOrganizationService: FundingOrganizationService,private dialog: MatDialog,private router: Router,
  private folderStrService:FolderStructureService,private projectCrudService:ProjectCrudService,private dialogRef: MatDialogRef<ProjectDocumentUploadComponent>,private projectServiceData: ProjectService,
) { 
  // this.getProjectViewDetails()
  /* Service Call for get Donor List */
  // this.fundingOrganizationService.getFundingOrganizationList().subscribe(data => {
  //   this.fundingOrganizationList = data;
  //   this.fundingOrganizationfilteredOption = this.donorName.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())

  //     );
  // });
}
/* filter Donor */
private filterfundingOrganization(name: string) {
  return this.fundingOrganizationList.filter(fundingOrganization =>
    fundingOrganization.fundingOrganizationName.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
filePath=new FormControl('');
folderPathList:FolderStructureServiceClass[];
pathFilterOption:Observable<any[]>;
private getPathAccordingToModule(){
   /* Service Call for get Path */
   this.folderStrService.getFolderStr().subscribe(data => {
    this.folderPathList = data;
    this.pathFilterOption = this.filePath.valueChanges
      .pipe(
        startWith(''),
        map(pathFilterOption => pathFilterOption ? this.filterPath(pathFilterOption) : this.folderPathList.slice())

      );
  });
}
 /* filter Path */
 private filterPath(name: string) {
  return this.folderPathList.filter(path =>
    path.subFolder.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
 
ngOnInit(): void {
  this.getValueByLang();
  this.projectTitle=localStorage.getItem('projectTitle');
  this.getPathAccordingToModule();
  this.projectUploadForm = new FormGroup({

    module: new FormControl({value:(this.browserLang=='en')?'Project':'Projecto',disabled:true}),
    filePath:new FormControl('', Validators.required),
    projectId:new FormControl('', Validators.required),
    uploadFile: new FormControl('', Validators.required)
  })
  // let refNm=localStorage.getItem("prjRefNm");
  this.projectUploadForm.controls.projectId.setValue(this.projectTitle);
  this.projectUploadForm.controls.projectId.disable();
}

onCloseDialog() {
  this.dialogRef.close();
  localStorage.removeItem('prjRefNm');
}
submit() {
this.dialogRef.close(this.projectUploadForm.value);
}
browserLang:any
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
  if(this.projectUploadForm != null && this.projectUploadForm != undefined) {
    this.projectUploadForm.controls.module.patchValue((this.browserLang=='en')?'Project':'Projecto');
  }
}
opensweetalert() {
  this.getValueByLang()
Swal.fire({
  title: (this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?',
  showDenyButton: true,
  confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
  denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
  allowOutsideClick: false,
}).then((result) => {

  if(result.isConfirmed) {
    this.projectDocumentData.module = this.projectUploadForm.controls['module'].value;
     this.projectDocumentData.projectNm = this.projectUploadForm.controls['projectId'].value;
    this.projectDocumentData.fileName = this.projectUploadForm.controls['filePath'].value;
    /* Here we call saveDoc() to call service */
    this.saveDoc();
  } else if(result.isDenied) {
    if (this.browserLang == 'en')
      Swal.fire('Cancelled', '', 'info');
    else {
      Swal.fire('Cancelado', '', 'info');
    }
  }
})
// Swal.showLoading();
}
/* Here we take data from front end and Go to backend to save data in db   */
saveDoc(){
  this.getValueByLang()
  this.currentFileUpload = this.selectedFiles.item(0);
  this.projectServiceData.saveProjectDocumnet(this.projectDocumentData, this.currentFileUpload).pipe(first()).subscribe(
    {
      next: () => {
        if(this.browserLang=='en'){
          Swal.fire('Submitted successfully', '', 'success');
        }else{
          Swal.fire('Submetido com sucesso', '', 'success');
        }
        /* If data will store successfully then we call this method to go to view page */
        const dialogRef = this.dialog.closeAll(
          );
        // this.goToCreateProject();
      },
      /* At Data save time if there is an error occured then here we can handel that error */
      error: error => {
        if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
          Swal.fire(error.error.message, '', 'error');
        } else {
          Swal.fire(error.error, '', 'error');
        }
      }
    }
  );
}

/* If data save successfully in db then it will redirect to view page */
goToCreateProject(){
  /* Close the dialog */
  const dialogRef = this.dialog.closeAll(
    );
    this.router.navigate(['/admin/project']);
  }

/* This is for clear all field except module name */
clearForm(form: FormGroup) {
  // this.projectUploadForm.controls['donorName'].reset();
  this.projectUploadForm.controls['filePath'].reset();
  this.projectUploadForm.controls['uploadFile'].reset();
}

/* If we change the file then here we store the file in selectedFiles */
selectFile(event) {
  this.selectedFiles = event.target.files;
  if(((this.selectedFiles)[0].name).length<= 20){
    $("#fileName").html((this.selectedFiles)[0].name);
    $("#fileNameForLabel").attr('title',(this.selectedFiles)[0].name);
  }
  else{
  $("#fileName").html( ((this.selectedFiles)[0].name).substring(0,9)+'...'+ ((this.selectedFiles)[0].name).substring(((this.selectedFiles)[0].name).length-8,((this.selectedFiles)[0].name).length));
  $("#fileName").attr('title',(this.selectedFiles)[0].name);
  $("#fileNameForLabel").attr('title',(this.selectedFiles)[0].name);
  }
}
 /* If you are not fill all mandatory fields then it will give an alert */
 openMandatoryAlert() {
  Swal.fire('Please Fill All Mandatory Fields.')
}
/* If we want to clear the choosen file the we call this method */
resetFile() {
  this.projectUploadForm.controls['uploadFile'].reset();
}
projectDetails:ProjectCrud[]=[];
projectId=new FormControl('');
projectFilterOption:Observable<any[]>;
// private getProjectViewDetails(){
//   this.projectCrudService.getProjectViewDetails().subscribe(data=>{
//     this.projectDetails=data;
//     this.projectFilterOption = this.filePath.valueChanges
//     .pipe(
//       startWith(''),
//       map(projectFilterOption => projectFilterOption ? this.filterProject(projectFilterOption) : this.projectDetails.slice())

//     );
//   });
// }
 /* filter project */
 private filterProject(name: string) {
  return this.projectDetails.filter(projectDetails =>
    projectDetails.projectTitle.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}

