// Business logic TS file for envelope.component.html

import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { Location } from '@angular/common';
import { Envelope } from '../../../model/envelope';
import { ViewEnvelopeComponentComponent } from '../../view-components/view-envelope-component/view-envelope-component.component';
import { ExcelService } from '../../../Service/excel.service';
import { EnvelopeDocumentUploadComponent } from '../../document-repository/upload-document/envelope-document-upload/envelope-document-upload.component';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { NotificationService } from 'src/app/Service-Application/notification.service';



const ELEMENT_DATA: Envelope[] = [
  { position: 1, donor: 'World Bank', year: '2020', envagrcurr: '10079', exchangerateusd: '8.2', exchangeratemzn: '9.2', amtannenvmeti: '10079', annenvamtusd: '10079', purdaccrs: '3 digits (CRS)', comments: 'xyz' },
  { position: 2, donor: 'WHO', year: '2019', envagrcurr: '4026', exchangerateusd: '9.2', exchangeratemzn: '9.2', amtannenvmeti: '4026', annenvamtusd: '4026', purdaccrs: '5 digits (SNPC)', comments: 'abc' },
  { position: 3, donor: 'UNESCO', year: '2020', envagrcurr: '6941', exchangerateusd: '8.2', exchangeratemzn: '9.2', amtannenvmeti: '6941', annenvamtusd: '10079', purdaccrs: '3 digits (CRS)', comments: 'xyz' },
  { position: 4, donor: 'World Bank', year: '2018', envagrcurr: '90122', exchangerateusd: '9.2', exchangeratemzn: '9.2', amtannenvmeti: '90122', annenvamtusd: '4026', purdaccrs: '5 digits (SNPC)', comments: 'xabcyz' },
  { position: 5, donor: 'UNESCO', year: '2018', envagrcurr: '90122', exchangerateusd: '8.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '10079', purdaccrs: '3 digits (CRS)', comments: 'xyz' },
  { position: 6, donor: 'UNESCO', year: '2018', envagrcurr: '120107', exchangerateusd: '9.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '4026', purdaccrs: '5 digits (SNPC)', comments: 'abc' },
  { position: 7, donor: 'WHO', year: '2019', envagrcurr: '140067', exchangerateusd: '8.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '10079', purdaccrs: '3 digits (CRS)', comments: 'xyz' },
  { position: 8, donor: 'WHO', year: '2017', envagrcurr: '1994', exchangerateusd: '9.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '4026', purdaccrs: '5 digits (SNPC)', comments: 'abc' },
  { position: 9, donor: 'UNICEF', year: '2019', envagrcurr: '1984', exchangerateusd: '8.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '10079', purdaccrs: '3 digits (CRS)', comments: 'xyzabc' },
  { position: 10, donor: 'UNICEF', year: '2018', envagrcurr: '201574', exchangerateusd: '9.2', exchangeratemzn: '9.2', amtannenvmeti: '120107', annenvamtusd: '4026', purdaccrs: '5 digits (SNPC)', comments: 'xyz' },

];



@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  public envelopeForm!: FormGroup;
  envelope: Envelope = new Envelope();
  elements!: NodeListOf<Element>;
  usergroup: any;
  displayedColumns: string[] = ['position', 'donor', 'year', 'envagrcurr', 'exchangerateusd', 'amtannenvmeti', 'annenvamtusd', 'purdaccrs', 'comments', 'edit'];
  dataSource = ELEMENT_DATA;
  constructor(private location: Location,
    private router: Router, private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: HTMLDocument, private excelService: ExcelService, private envelopeService: EnvelopeServiceService, private notificationService: NotificationService) { }


  h: HTMLDocument;
  languageId: number;
  num: any;
  tabClick(index: number) {
    this.num = index;

  }

  generateExcel() {
    console.log("123456");
    let obj = new ViewEnvelopeComponentComponent(this.h, this.excelService, this.router, this.dialog, this.location, this.envelopeService, this.notificationService);
    obj.ExportTOExcel();
  }
  EditEnv: any;
  ngOnInit(): void {

    localStorage.setItem("EditEnvUrl", "Reset-EditEnvUrl");
    localStorage.setItem("EditDisbUrl", "Reset-EditDisbUrl");
    localStorage.setItem("EditFundUrl", "Reset-EditFundUrl");
    localStorage.setItem("EditIndUrl", "Reset-EditIndUrl");
    localStorage.setItem("EditMonitoringUrl", "Reset-EditMonitoringUrl");
    localStorage.setItem("EditOrgUrl", "Reset-EditOrgUrl");
    localStorage.setItem("EditPaymentUrl", "Reset-EditPaymentUrl");
    localStorage.setItem("EditProjectUrl", "Reset-EditProjectUrl");
    localStorage.setItem("EditUserAcctUrl", "Reset-EditUserAcctUrl");


    this.EditEnv = localStorage.getItem("EditEnv");

    this.usergroup = localStorage.getItem('usergroup');
    ;
    //Validation Starts form Here
    this.envelopeForm = new FormGroup({
      year: new FormControl('', [Validators.required]),
      envagrcurr: new FormControl('', [Validators.required]),
      donor: new FormControl('', [Validators.required]),
      exchangerateusd: new FormControl(''),
      amtannenvmeti: new FormControl(''),
      annenvamtusd: new FormControl(''),
      purdaccrs: new FormControl(''),
      comments: new FormControl('')
    });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.envelopeForm.controls[controlName].hasError(errorName);
  }

  public createEnvelope = (envelopeFormValue) => {
    if (this.envelopeForm.valid) {
      this.executeEnvelopeCreation(envelopeFormValue);
    }
  }
  private executeEnvelopeCreation = (envelopeFormValue) => {
    let envelope: Envelope = {
      year: envelopeFormValue.year,
      envagrcurr: envelopeFormValue.envagrcurr,
      exchangerateusd: envelopeFormValue.exchangerateusd,
      exchangeratemzn: envelopeFormValue.exchangeratemzn,
      amtannenvmeti: envelopeFormValue.amtannenvmeti,
      donor: envelopeFormValue.donor,
      annenvamtusd: envelopeFormValue.annenvamtusd,
      purdaccrs: envelopeFormValue.purdaccrs,
      comments: envelopeFormValue.comments,
      position: envelopeFormValue.position

    }
  }
  //Validation ends Here
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  //Onsubmit click
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('New record created and saved!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  //Save as draft click
  opensweetalert2() {
    Swal.fire({
      title: 'Do you want to Save as Draft?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved as Draft Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  //Add New FUnding Organization
  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
      console.log(`Dialog result: ${result}`);
    });
  }
  clearForm(form: FormGroup) {
    form.reset();
  }

  hello() {
    console.log("hiii...");
  }

  openDialog2() {
    let refNm = localStorage.getItem("refNM");
    if (refNm == null || refNm == '') {
      Swal.fire('Please Enter Envelope Reference Name.')
    } else {
      const dialogRef = this.dialog.open(EnvelopeDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['envelope']);

      });
    }

  }
}





