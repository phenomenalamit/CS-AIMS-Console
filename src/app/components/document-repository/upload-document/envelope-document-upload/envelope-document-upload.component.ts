import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Donor } from 'src/app/Service-Class/donor';
import { EnvelopeDocumentServiceClass } from 'src/app/Service-Class/envelope-document-service-class';
import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { DonorService } from 'src/app/Service/donor.service';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-envelope-document-upload',
  templateUrl: './envelope-document-upload.component.html',
  styleUrls: ['./envelope-document-upload.component.css']
})
/*
* @Author Sunita Parida
* This page is belongs to Envelope document upload module
*/
export class EnvelopeDocumentUploadComponent implements OnInit {
  public envelopeUploadForm!: FormGroup;
  stores;
  envelopeDocData: EnvelopeDocumentServiceClass = new EnvelopeDocumentServiceClass();
  envelopeSaveData: EnvelopeDocumentServiceClass[];
  selectedFiles: FileList;
  currentFileUpload: File;
  id: number;
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private donorService: DonorService, private fundingOrganizationService: FundingOrganizationService,
private folderStrService:FolderStructureService,
    private dialogRef: MatDialogRef<EnvelopeDocumentUploadComponent>, private envelopeServiceData: EnvelopeServiceService, private router: Router
  ) {
    this.fetchEnvelopeData();
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
  filePath=new FormControl('');
  folderPathList:FolderStructureServiceClass[];
  pathFilterOption:Observable<any[]>;
  envFilterOption:Observable<any[]>;
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
  fundingOrganizationList: FundingOrganization[];
  
  fundingOrganizationfilteredOption: Observable<any[]>;
  
  donorName = new FormControl('');
 
  /* filter Donor */
  private filterfundingOrganization(name: string) {
    return this.fundingOrganizationList.filter(fundingOrganization =>
      fundingOrganization.fundingOrganizationName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  refNm:any;
  ngOnInit(): void {
    this.getPathAccordingToModule();
    this.envelopeUploadForm = new FormGroup({
      module: new FormControl({ value: 'Envelope', disabled: true }, Validators.required),
      filePath: new FormControl('', Validators.required),
      envRef: new FormControl('', Validators.required),
      uploadFile: new FormControl('', Validators.required)
    })
    this.refNm=localStorage.getItem("refNM");
    this.envelopeUploadForm.controls.envRef.setValue(this.refNm);
    this.envelopeUploadForm.controls.envRef.disable();
    // this.getValueByLang();
    // if(this.browserLang=='en'){
    //   $("#fileName").html('No file chosen');
    //   $("#fileName").attr('title','No file chosen');
    // }else{
    //   $("#fileName").html('Nenhum arquivo selecionado');
    //   $("#fileName").attr('title','Nenhum arquivo selecionado');
    // }
    
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

  /* Here we can close the dialog box */
  onCloseDialog() {
    this.dialogRef.close();
    // localStorage.removeItem('refNM');
  }

  submit() {
    this.dialogRef.close(this.envelopeUploadForm.value);
  }
  browserLang:any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* Whenever we click on submit button then it will show an alert */
  opensweetalert() {
    this.getValueByLang();
    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: (this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
      denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
     
      /* If we click on submit button then we can save data */
      if (result.isConfirmed) {

        this.envelopeDocData.module = this.envelopeUploadForm.controls['module'].value;
         this.envelopeDocData.envRefName = this.envelopeUploadForm.controls['envRef'].value;
        this.envelopeDocData.fileName =(this.envelopeUploadForm.controls['filePath'].value);
        /* Here we call saveEnvelopeDoc() to call service */
        this.saveEnvelopeDoc();

      }
      /* If we click on cancel button then we can not store data in db */
      else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
    // Swal.showLoading();
  }
  files:any=[];
  // openFile(){
  //   $("#files").change(function() {
  //    let filename= this.files[0].name;
  //     console.log(filename);
  //   });
  // }
  /* Here we take data from front end and Go to backend to save data in db   */
  saveEnvelopeDoc() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.envelopeServiceData.saveEnvelopeDocumnet(this.envelopeDocData, this.currentFileUpload).pipe(first()).subscribe(
      {
        next: () => {

          if (this.browserLang == 'en')
          Swal.fire('Submitted successfully', '', 'success');
        else
          Swal.fire('Submetido com sucesso', '', 'success');
          
          /* If data will store successfully then we call this method to go to view page */
          const dialogRef = this.dialog.closeAll(
            );
          //  this.goToCreateEnvelope();
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
  goToCreateEnvelope() {
    /* Close the dialog */
    const dialogRef = this.dialog.closeAll(
    );
    this.router.navigate(['/admin/envelope']);
  }
  /* If we want to clear the choosen file the we call this method */
  resetFile() {
    this.envelopeUploadForm.controls['uploadFile'].reset();
  }

  /* This is for clear all field except module name */
  clearForm(form: FormGroup) {
    // this.envelopeUploadForm.controls['donorName'].reset();
    this.envelopeUploadForm.controls['filePath'].reset();
    this.envelopeUploadForm.controls['uploadFile'].reset();
  }
  /* If you are not fill all mandatory fields then it will give an alert */
  openMandatoryAlert() {
    Swal.fire('Please Fill All Mandatory Fields.')
  }
  envelopeDetails: EnvelopeServiceClass[] = [];
  envRef=new FormControl('')
  /* Here we can fetch all envelope data by calling servie */
  private fetchEnvelopeData() {
    this.envelopeServiceData.getEnvelopeRefNm().subscribe(data => {
      this.envelopeDetails = data;
      this.envFilterOption = this.envRef.valueChanges
      .pipe(
        startWith(''),
        map(envFilterOption => envFilterOption ? this.filterEnvelope(envFilterOption) : this.envelopeDetails.slice())

      );
  });
}
 /* filter Envelope */
 private filterEnvelope(name: string) {
  return this.envelopeDetails.filter(envelopeDetails =>
    envelopeDetails.envelopeReference.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}
