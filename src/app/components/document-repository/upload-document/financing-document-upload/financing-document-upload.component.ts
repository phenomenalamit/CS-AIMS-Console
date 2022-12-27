import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { Donor } from 'src/app/Service-Class/donor';
import { FinancialDocumentServiceClass } from 'src/app/Service-Class/financial-document-service-class';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { DonorService } from 'src/app/Service/donor.service';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-financing-document-upload',
  templateUrl: './financing-document-upload.component.html',
  styleUrls: ['./financing-document-upload.component.css']
})

/*
* @Author Sunita Parida
* This page is belongs to Financing document Upload module
*/
export class FinancingDocumentUploadComponent implements OnInit {

  public financingUploadForm!: FormGroup;
  stores;
  fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  donorName = new FormControl('');
  selectedFiles: FileList;
  financingDocumentData:FinancialDocumentServiceClass=new FinancialDocumentServiceClass();
  currentFileUpload: File;
constructor( private financingServiceData: FinancingServiceService,private dialog: MatDialog,private router: Router,
  private folderStrService:FolderStructureService,private financingService:FinancingServiceService,
  private dialogRef: MatDialogRef<FinancingDocumentUploadComponent>,private fundingOrganizationService: FundingOrganizationService,
) { 
  this.getFinancialAgreementList()
  this.getPathAccordingToModule();
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
fundingRefNm:string;
filePath=new FormControl('');
financeDetails=new FormControl('');
folderPathList:FolderStructureServiceClass[];
pathFilterOption:Observable<any[]>;
financeFilterOption:Observable<any[]>;
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
  /* filter Donor */
  private filterfundingOrganization(name: string) {
    return this.fundingOrganizationList.filter(fundingOrganization =>
      fundingOrganization.fundingOrganizationName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
ngOnInit(): void {
  this.getValueByLang();
  this.financingUploadForm = new FormGroup({
    // reference: new FormControl('', [Validators.required]),
    module: new FormControl({value:(this.browserLang=='en')?'Financing':'Financiamento',disabled:true}),
    filePath:new FormControl('', Validators.required),
    financeDetails:new FormControl('', Validators.required),
    // donorName:new FormControl('', Validators.required),
    uploadFile: new FormControl('', Validators.required)
  });
  this.fundingRefNm=localStorage.getItem("fundingRefNM");
  this.financingUploadForm.controls.financeDetails.setValue(this.fundingRefNm);
  this.financingUploadForm.controls.financeDetails.disable();
}

onCloseDialog() {
  this.dialogRef.close();
  // localStorage.removeItem('fundingRefNM');
}
submit() {
this.dialogRef.close(this.financingUploadForm.value);
}
browserLang:any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    if(this.financingUploadForm!=null && this.financingUploadForm!=undefined) {
      this.financingUploadForm.controls.module.patchValue((this.browserLang=='en')?'Financing':'Financiamento');
    }
  }
opensweetalert() {
  this.getValueByLang();
Swal.fire({
  title: (this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
      allowOutsideClick: false,
}).then((result) => {


  /* Read more about isConfirmed, isDenied below */
  if(result.isConfirmed) {
    this.financingDocumentData.module = this.financingUploadForm.controls['module'].value;
     this.financingDocumentData.financeRefNm = this.financingUploadForm.controls['financeDetails'].value;
    this.financingDocumentData.fileName = this.financingUploadForm.controls['filePath'].value;
    /* Here we call saveFinancingDoc() to call service */
    this.saveFinancingDoc();
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
saveFinancingDoc(){
  this.currentFileUpload = this.selectedFiles.item(0);
  this.financingServiceData.saveFinancingDocumnet(this.financingDocumentData, this.currentFileUpload).pipe(first()).subscribe(
    {
      next: () => {
        if (this.browserLang == 'en')
        Swal.fire('Submitted successfully', '', 'success');
      else
        Swal.fire('Submetido com sucesso', '', 'success');

        
        /* If data will store successfully then we call this method to go to view page */
        // this.goToCreateFinancing();
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
goToCreateFinancing(){
/* Close the dialog */
const dialogRef = this.dialog.closeAll(
  );
  this.router.navigate(['/admin/funding']);
}
/* This is for clear all field except module name */
clearForm(form: FormGroup) {
  // this.financingUploadForm.controls['donorName'].reset();
  this.financingUploadForm.controls['filePath'].reset();
  this.financingUploadForm.controls['uploadFile'].reset();
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
  this.financingUploadForm.controls['uploadFile'].reset();
}
financialAgreementList:FinancialAgreement[] = [];
/* get all finance list*/
private getFinancialAgreementList() {
  this.financingService.getFinancialAgreementAllList().subscribe(data => {
    this.financialAgreementList = data;
    this.financeFilterOption = this.financeDetails.valueChanges
      .pipe(
        startWith(''),
        map(financeFilterOption => financeFilterOption ? this.filterFinance(financeFilterOption) : this.financialAgreementList.slice())

      );
   });
}
 /* filter Finance */
 private filterFinance(name: string) {
  return this.financialAgreementList.filter(financeDetails =>
    financeDetails.donor_funding_title.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}
