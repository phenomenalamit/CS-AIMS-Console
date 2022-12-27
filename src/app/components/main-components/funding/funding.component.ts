// Business Logic TS file for funding.component.html

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { CurrencyPipe } from '@angular/common';
import { ViewFundingComponentComponent } from '../../view-components/view-funding-component/view-funding-component.component';
import { ExcelService } from '../../../Service/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { FinancingDocumentUploadComponent } from '../../document-repository/upload-document/financing-document-upload/financing-document-upload.component';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';


const moment = _moment;



export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.css']
})

export class FundingComponent implements OnInit {

  num: any;

  tabClick(index: number) {
    this.num = index;
  }

  today = new Date();
  usergroup: any;

  constructor(private dialog: MatDialog, private router: Router, private excelService: ExcelService, public translate: TranslateService,
    private financingService: FinancingServiceService,
    private route: ActivatedRoute
  ) { }

  browserLang: any;

  EditId: any = null;
  viewMoreId: any = null;
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
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    //console.log("this.browserLang",this.browserLang);

    this.usergroup = localStorage.getItem('usergroup');
    // if(this.usergroup===undefined || this.usergroup===null)
    // this.router.navigate(['/login']);

    this.EditId = this.route.snapshot.paramMap.get("editFaId");
    /* Below is for At View more time we have to get the id from url */
    this.viewMoreId = this.route.snapshot.paramMap.get("viewMoreFaId");

    this.getSaveAsDraftList();
  }
  financialAgreement = new FormGroup({
    SaveAsDraft: new FormControl('')
  });
  saveAsDraftList: FinancialAgreement[] = [];
  getSaveAsDraftList() {
    this.financingService.getFASaveAsDraftList().subscribe((data) => {
      this.saveAsDraftList = data;
      console.log("saveAsDraftList is ", this.saveAsDraftList)
    })
  }
  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewFundingComponentComponent(this.dialog,this.router,this.excelService);
  //   obj.ExportTOExcel();
  // }

  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  openDialog2() {
    let refNm = localStorage.getItem("fundingRefNM");
    if (refNm == null || refNm == '') {
      Swal.fire('Please Enter Funding Donor Title.')
    } else {
      const dialogRef = this.dialog.open(FinancingDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['funding']);
        console.log(`Dialog result: ${result}`);
        // localStorage.removeItem('fundingRefNM');
      });
    }
  }
}

