//Business Logic TS file of project.component.html
import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ViewProjectComponentComponent } from '../../view-components/view-project-component/view-project-component.component';
import { ExcelService } from '../../../Service/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectDocumentUploadComponent } from '../../document-repository/upload-document/project-document-upload/project-document-upload.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private router: Router, private excelService: ExcelService, private dialog: MatDialog, public translate: TranslateService) { }
  usergroup: any;
  browserLang: any;
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
    console.log("this.browserLang", this.browserLang);

    this.usergroup = localStorage.getItem('usergroup');
    // if(this.usergroup===undefined || this.usergroup===null)
    // this.router.navigate(['/login']);
    console.log("In project User:" + this.usergroup)
  }


  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  num: any;
  tabClick(index: number) {
    this.num = index;
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Submitted Successfully', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
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
  opensweetalert3() {
    Swal.fire({
      title: 'This Project is complete, funds not yet disbursed.!',

      timer: 3000,
    })

  }
  openDialog2() {
    let refNm = localStorage.getItem("prjRefNm");
    if (refNm == 'null' || refNm == '') {
      Swal.fire('Please Enter Project Title.')
    } else {
      const dialogRef = this.dialog.open(ProjectDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['project']);
        console.log(`Dialog result: ${result}`);
        localStorage.removeItem('prjRefNm');
      });
    }
  }

}

