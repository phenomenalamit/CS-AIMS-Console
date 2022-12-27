import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { DisbursmentDocumentServiceClass } from 'src/app/Service-Class/disbursment-document-service-class';
import { Donor } from 'src/app/Service-Class/donor';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { DonorService } from 'src/app/Service/donor.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disbursement-document-upload',
  templateUrl: './disbursement-document-upload.component.html',
  styleUrls: ['./disbursement-document-upload.component.css']
})
export class DisbursementDocumentUploadComponent implements OnInit {

  public disbursementUploadForm!: FormGroup;
    stores;
    fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  donorName = new FormControl('');
  selectedFiles: FileList;
  currentFileUpload: File;
  
  disbursmentDocumentData:DisbursmentDocumentServiceClass=new DisbursmentDocumentServiceClass();
  constructor(private fundingOrganizationService: FundingOrganizationService,private dialog: MatDialog,private router: Router,
    private folderStrService:FolderStructureService,private dialogRef: MatDialogRef<DisbursementDocumentUploadComponent>,
  private disbursmentData:DisbursementCrudServiceService,private disbursementCrud: DisbursementCrudServiceService
  ) {
    // this.getDisbursementDetails();
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
  browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    if(this.disbursementUploadForm !=null && this.disbursementUploadForm!=undefined) {
      this.disbursementUploadForm.controls.module.patchValue((this.browserLang=='en')?'Disbursement':'Desembolso');
    }
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
disbursmentRefNm:string;
  ngOnInit(): void {
    this.getValueByLang();
    this.getPathAccordingToModule();
    this.disbursementUploadForm = new FormGroup({
      module: new FormControl({value:(this.browserLang=='en')?'Disbursement':'Desembolso',disabled:true}),
      filePath:new FormControl('', Validators.required),
      disbursmentRef:new FormControl('', Validators.required),
      uploadFile: new FormControl('', Validators.required)
    });
     this.disbursmentRefNm=localStorage.getItem("disbursmentRefNm");
    this.disbursementUploadForm.controls.disbursmentRef.setValue(this.disbursmentRefNm);
    this.disbursementUploadForm.controls.disbursmentRef.disable();
  }
  
  onCloseDialog() {
    this.dialogRef.close();
    // localStorage.removeItem('disbRefNM');
}
submit() {
  this.dialogRef.close(this.disbursementUploadForm.value);
}
opensweetalert() {
  this.getValueByLang()
  Swal.fire({
    title: (this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?',
    showDenyButton: true,
    confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
    denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    allowOutsideClick: false,
  }).then((result) => {


    /* Read more about isConfirmed, isDenied below */
    if(result.isConfirmed) {
      this.disbursmentDocumentData.module = this.disbursementUploadForm.controls['module'].value;
       this.disbursmentDocumentData.disbursmentRefNm = this.disbursementUploadForm.controls['disbursmentRef'].value;
      this.disbursmentDocumentData.fileName = this.disbursementUploadForm.controls['filePath'].value;
      /* Here we call saveDoc() to call service */
      this.saveDoc();
    } else if(result.isDenied) {
      if(this.browserLang=='en')
      Swal.fire('Cancelled', '', 'info');
      else
      Swal.fire('Cancelado', '', 'info');
    
    }
  })
  // Swal.showLoading();
}
/* Here we take data from front end and Go to backend to save data in db   */
saveDoc(){
  this.currentFileUpload = this.selectedFiles.item(0);
  this.disbursmentData.saveDisbursmentDocumnet(this.disbursmentDocumentData, this.currentFileUpload).pipe(first()).subscribe(
    {
      next: () => {

        if (this.browserLang == 'en')
        Swal.fire('Submitted successfully', '', 'success');
      else
        Swal.fire('Submetido com sucesso', '', 'success');
        /* If data will store successfully then we call this method to go to view page */
        const dialogRef = this.dialog.closeAll(
          );
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
goToCreateDisbursment(){
  /* Close the dialog */
  const dialogRef = this.dialog.closeAll(
    );
    this.router.navigate(['/admin/disbursement']);
  }
/* This is for clear all field except module name */
clearForm(form: FormGroup) {
  // this.disbursementUploadForm.controls['donorName'].reset();
  this.disbursementUploadForm.controls['filePath'].reset();
  this.disbursementUploadForm.controls['uploadFile'].reset();
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
  this.disbursementUploadForm.controls['uploadFile'].reset();
}
disbursementDetails: DisbursementCrudService[] = [];
disbursmentRef=new FormControl('');
disbursmentFilterOption: Observable<any[]>;
private getDisbursementDetails() {
  this.disbursementCrud.getDisbursementAllDetails().subscribe(data => {
    this.disbursementDetails = data;
    this.disbursmentFilterOption = this.disbursmentRef.valueChanges
    .pipe(
      startWith(''),
      map(pathFilterOption => pathFilterOption ? this.filterDisbursment(pathFilterOption) : this.disbursementDetails.slice())

    );
  });
}
/* filter disbursment */
private filterDisbursment(name: string) {
  return this.disbursementDetails.filter(disbursementDetails =>
    disbursementDetails.disbursementReference.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}
