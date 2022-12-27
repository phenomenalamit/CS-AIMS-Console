import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Donor } from 'src/app/Service-Class/donor';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { PaymentDocumentServiceClass } from 'src/app/Service-Class/payment-document-service-class';
import { DonorService } from 'src/app/Service/donor.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-payment-document-upload',
  templateUrl: './payment-document-upload.component.html',
  styleUrls: ['./payment-document-upload.component.css']
})
export class PaymentDocumentUploadComponent implements OnInit {


  public paymentUploadForm!: FormGroup;
  stores;
  fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  donorName = new FormControl('');
  selectedFiles: FileList;
  currentFileUpload: File;
  paymentReference:string
  paymentDocumentData:PaymentDocumentServiceClass=new PaymentDocumentServiceClass();
constructor(private dialog: MatDialog,private router: Router,private paymentService:PaymentCrudServiceService,
  private dialogRef: MatDialogRef<PaymentDocumentUploadComponent>,private folderStrService:FolderStructureService,private fundingOrganizationService: FundingOrganizationService
) {
  this.getPaymentDetails() 
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
paymentFilterOption:Observable<any[]>;
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
  this.paymentReference=localStorage.getItem('paymentReference')
  this.getPathAccordingToModule();
  this.paymentUploadForm = new FormGroup({

    // reference: new FormControl('', [Validators.required]),
    module: new FormControl({value:(this.browserLang=='en')?'Payment':'Pagamento',disabled:true}),
    filePath:new FormControl('', Validators.required),
    paymentRef:new FormControl('', Validators.required),
    uploadFile: new FormControl('', Validators.required)
  });
  this.getValueByLang();
    this.paymentUploadForm.controls.paymentRef.disable();
    if(this.paymentUploadForm != null && this.paymentUploadForm != undefined) {
      this.paymentUploadForm.controls.module.patchValue((this.browserLang=='en')?'Payment':'Pagamento');
    }
}
paymentRef=new FormControl('')
onCloseDialog() {
  this.dialogRef.close();
}
submit() {
this.dialogRef.close(this.paymentUploadForm.value);
}
browserLang:any;
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
  this.paymentUploadForm.controls.module.patchValue((this.browserLang=='en')?'Payment':'Pagamento');
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
    if(result.isConfirmed) {
      this.paymentDocumentData.module = this.paymentUploadForm.controls['module'].value;
      this.paymentDocumentData.paymentNm = this.paymentUploadForm.controls['paymentRef'].value;
      this.paymentDocumentData.fileName = this.paymentUploadForm.controls['filePath'].value;
      // console.log("payment adta ",JSON.stringify(this.paymentDocumentData))
      /* Here we call saveDoc() to call service */
      this.saveDoc();
   // this.moveToSelectedTab;
  } }else if(result.isDenied) {
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
  this.paymentService.savePaymentDocumnet(this.paymentDocumentData, this.currentFileUpload).pipe(first()).subscribe(
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
goToCreatePayment(){
  /* Close the dialog */
  const dialogRef = this.dialog.closeAll(
    );
    this.router.navigate(['/admin/payment']);
  }
/* This is for clear all field except module name */
clearForm(form: FormGroup) {
  // this.paymentUploadForm.controls['donorName'].reset();
  this.paymentUploadForm.controls['filePath'].reset();
  this.paymentUploadForm.controls['uploadFile'].reset();
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
  this.paymentUploadForm.controls['uploadFile'].reset();
}
paymentDetails: PaymentCrudService[] = [];
private getPaymentDetails() {
  this.paymentService.getPaymentAllDetails().subscribe(data => {
    this.paymentDetails = data;
    this.paymentFilterOption = this.filePath.valueChanges
      .pipe(
        startWith(''),
        map(paymentFilterOption => paymentFilterOption ? this.filterPaymentDetails(paymentFilterOption) : this.paymentDetails.slice())

       );
  });

}
/* filter Payment dtl */
private filterPaymentDetails(name: string) {
  return this.paymentDetails.filter(paymentDetails =>
    paymentDetails.paymentReference.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}

