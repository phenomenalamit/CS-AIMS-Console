import { L } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Donor } from 'src/app/Service-Class/donor';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { MonitoringDocumentServiceClass } from 'src/app/Service-Class/monitoring-document-service-class';
import { DonorService } from 'src/app/Service/donor.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { MonitoringCrudService } from 'src/app/Service/monitoring-crud-service';
import { MonitoringService } from 'src/app/Service/monitoring.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-monitoring-document-upload',
  templateUrl: './monitoring-document-upload.component.html',
  styleUrls: ['./monitoring-document-upload.component.css']
})
export class MonitoringDocumentUploadComponent implements OnInit {

  public monitoringUploadForm!: FormGroup;
  stores;
  fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  donorName = new FormControl('');
  selectedFiles: FileList;
  currentFileUpload: File;
  monitoringDocumentData:MonitoringDocumentServiceClass= new MonitoringDocumentServiceClass();
  budgetPrjNm:string;
constructor(private fundingOrganizationService: FundingOrganizationService,private dialog: MatDialog,private router: Router,
  private folderStrService:FolderStructureService, private dialogRef: MatDialogRef<MonitoringDocumentUploadComponent>,private monitoringService:MonitoringCrudService,
) { /* Service Call for get Donor List */
  // this.fundingOrganizationService.getFundingOrganizationList().subscribe(data => {
  //   this.fundingOrganizationList = data;
  //   this.fundingOrganizationfilteredOption = this.donorName.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())

  //     );
  // });
  this.getPathAccordingToModule();
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
    console.log("all data ",data)
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
  this.monitoringUploadForm = new FormGroup({
    module: new FormControl({value:(this.browserLang=='en')?'Monitoring':'Monitoria',disabled:true}),
    filePath:new FormControl('', Validators.required),
    budgetPrj:new FormControl('', Validators.required),
    // donorName:new FormControl('', Validators.required),
    uploadFile: new FormControl('', Validators.required)
  })
  this.budgetPrjNm=localStorage.getItem("budgetPrjNm");
  this.monitoringUploadForm.controls.budgetPrj.setValue(this.budgetPrjNm)
  this.monitoringUploadForm.controls.budgetPrj.disable();
}

onCloseDialog() {
  this.dialogRef.close();
}
submit() {
this.dialogRef.close(this.monitoringUploadForm.value);
}
browserLang:any
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
  if (this.monitoringUploadForm != null&& this.monitoringUploadForm != undefined) {
    this.monitoringUploadForm.controls.module.patchValue((this.browserLang=='en')?'Monitoring':'Monitoria');
  }
}
opensweetalert() {
  this.getValueByLang();
Swal.fire({
  title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
      allowOutsideClick: false,
}).then((result) => {


  /* Read more about isConfirmed, isDenied below */
  if(result.isConfirmed) {
    this.monitoringDocumentData.module = this.monitoringUploadForm.controls['module'].value;
    this.monitoringDocumentData.budgetProject = this.monitoringUploadForm.controls['budgetPrj'].value;
    this.monitoringDocumentData.fileName = this.monitoringUploadForm.controls['filePath'].value;
    /* Here we call saveDoc() to call service */
    this.saveDoc();
  } else if(result.isDenied) {
    if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
  }
})
// Swal.showLoading();
}
/* Here we take data from front end and Go to backend to save data in db   */
saveDoc(){
  this.currentFileUpload = this.selectedFiles.item(0);
  this.monitoringService.saveMonitoringDocumnet(this.monitoringDocumentData, this.currentFileUpload).pipe(first()).subscribe(
    {
      next: () => {
        this.getValueByLang()
        if(this.browserLang=='en'){
          Swal.fire('Submitted successfully', '', 'success');
        }else{
          Swal.fire('Submetido com sucesso', '', 'success');
        }
        /* If data will store successfully then we call this method to go to view page */
        const dialogRef = this.dialog.closeAll(
          );
        // this.goToCreateMonitoring();
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
goToCreateMonitoring(){
  /* Close the dialog */
  const dialogRef = this.dialog.closeAll(
    );
    this.router.navigate(['/admin/monitoring']);
  }
/* This is for clear all field except module name */
clearForm(form: FormGroup) {
  // this.monitoringUploadForm.controls['donorName'].reset();
  this.monitoringUploadForm.controls['filePath'].reset();
  this.monitoringUploadForm.controls['uploadFile'].reset();
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
  this.monitoringUploadForm.controls['uploadFile'].reset();
}
}

