/**
 * View Disbursement :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/Service/excel.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DisbursementDocumentViewComponent } from 'src/app/components/document-repository/view-document/disbursement-document-view/disbursement-document-view.component';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { ViewTableModalDisbursmentComponent } from '../../view-more-components/view-table-modal-disbursment/view-table-modal-disbursment.component';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Notification } from 'src/app/Service-Class/notification';
import { MatSliderChange } from '@angular/material/slider';
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';
import { J } from '@angular/cdk/keycodes';
import { DisbursementDocumentUploadComponent } from '../../document-repository/upload-document/disbursement-document-upload/disbursement-document-upload.component';
import { DisbursementClass } from 'src/app/Service-Class/Disbursment';

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
  selector: 'app-view-disbursement-component',
  templateUrl: './view-disbursement-component.component.html',
  styleUrls: ['./view-disbursement-component.component.css']
})
export class ViewDisbursementComponentComponent implements OnInit {
  disbursementDataList: DisbursementCrudService[];
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  dialogRef: MatDialogRef<DisbursementDocumentViewComponent>
  disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(disbursementDetails);
  displayedColumns: string[] = ['select', 'edit', 'disbursementReference', 'projectTitle', 'amount', 'currency', 'disbursementAmountMZN', 'disbursementAmountUSD'];
  displayedColumnsReadOnly: string[] = ['disbursementReference', 'project', 'fundingTitle', 'amount',
    , 'disbursementAmountMZN', 'disbursementAmountUSD', 'amountOfdisbursementAgreement', 'names',
    'date', 'swiftcode', 'receivedswiftcode', 'receivedBankNIB'];
  // disbursementdataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  myControl = new FormControl();

  usergroup: any;
  userId:number;
  userName: string = "Charlie Adams"; //This field will be softcoded later.
  userGroup: string = "DNGDP Admin"; //This field will be softcoded later.
  totalRows: any;
  filterSelectObj = [];
  authorised_flag = false;


  browserLang: any;
  constructor(private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location,
    private disbursementCrud: DisbursementCrudServiceService, private notificationService: NotificationService) {
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang == 'en') {
      this.filterSelectObj = [
        {
          name: 'Disbursement Reference',
          columnProp: 'disbursementReference',
          options: []
        }, {
          name: 'Project Title',
          columnProp: 'projectTitle',
          options: []
        }
        , {
          name: 'Financial Agreement',
          columnProp: 'fundingDonorTitle',
          options: []
        }
        , {
          name: '	Responsible Organization',
          columnProp: 'names',
          options: []
        }
      ]
    } else {
      this.filterSelectObj = [
        {
          name: 'Referência do desembolso',
          columnProp: 'disbursementReference',
          options: []
        }, {
          name: 'título do projecto',
          columnProp: 'projectTitle',
          options: []
        }
        , {
          name: 'Acordo de Financiamento',
          columnProp: 'fundingDonorTitle',
          options: []
        }
        , {
          name: 'Organização Responsável',
          columnProp: 'names',
          options: []
        }
      ]
    }

  }
  minValue: number = 0;
  maxValue: number = 6000;

  minValueMZN: number = 0;
  maxValueMZN: number = 6000;
  minAmount: any = [];
  filterValues = {};
  filterData: any;
  checkedFilterColumn: any = {};
  filterChange(filter, event) {

    this.filterValues[filter.columnProp] = event.value
    this.disbursementdataSource.filter = JSON.stringify(this.filterValues)

    this.disbursementdataSource.paginator = this.paginator;
    this.disbursementdataSource.sort = this.sort;
    this.totalAmnt = 0;
    this.totalRows = 0;
    this.totalAmntMZN = 0;
    this.totalAmntUsd = 0;
    this.checkedFilterColumn = this.disbursementdataSource.filter;
    console.log("this.checkedFilterColumn ", this.checkedFilterColumn);
    for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
      if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
        this.amountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
        this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
      } else {
        this.totalAmntMZN = this.totalAmntMZN + 0;
      }
      if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
        this.amountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
        this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      }
      else {
        this.totalAmntUsd = this.totalAmntUsd + 0;
      }
      if (this.disbursementdataSource.filteredData[i].amount != null) {
        this.amountValue = Number.parseFloat(this.disbursementdataSource.filteredData[i].amount.replaceAll(",", ""));
        this.totalAmnt = this.totalAmnt + this.amountValue;
        // console.log("amnt outside init", this.totalAmnt)
      }
      else {
        this.totalAmnt = this.totalAmnt + 0;
      }

      //console.log("amnt ", this.disbursementdataSource.filteredData[i].amount)

    }
    //  for(let i=0;i<this.disbursementdataSource.filteredData.length;i++){
    //    this.totalAmnt=this.totalAmnt+Number.parseFloat(this.disbursementdataSource[i].amount_of_disbursement);
    //    this.totalAmntMZN=this.totalAmntMZN+Number.parseFloat(this.disbursementdataSource[i].amountOfdisbursementMeticais);
    //    this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(this.disbursementdataSource[i].amountOfdisbursementUSD);
    //  }
    this.totalRows = this.disbursementdataSource.filteredData.length;
  }


  // userEmail:string;
  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    // this.userEmail=localStorage.getItem('userEmail');
    this.setToAuthFlag();
    this.getDisbursementDetails();
    this.findTotalAmount();
    this.usergroup = localStorage.getItem('usergroup');
    this.setToUserPermission();
    setTimeout(() => this.disbursementdataSource.paginator = this.paginator);
    setTimeout(() => this.disbursementdataSource.sort = this.sort);
    // this.filterSelectObj.filter((o) => {
    //   o.options = this.getFilterObject(disbursementDetails, o.columnProp);
    // });


  }
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    // debugger
    console.log("fullObj value is:", fullObj.value)
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {

        uniqChk.push(obj[key]);
      }
      return obj;
    });
    uniqChk.sort(function (a, b) {
      return a.localeCompare(b); //using String.prototype.localCompare()
    });
    // if(key ==='envagrcurr' || key ==='amtannenvmeti'){
    //   uniqChk.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
    return uniqChk;
  }
  reference = [];
  project = [];
  fundingTitle = [];
  fundingOrganization = [];
  // Custom filter method fot Angular Material Datatable
  createFilter() {

    let filterFunction = (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;

      //console.log("val ",searchTerms)
      // let splat = searchTerms.split(",");
      //   for(let i=0;i<splat.length;i++)
      //   {
      // searchTerms = splat[i];
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
          this.reference = [];
          this.project = [];
          this.fundingTitle = [];
          this.fundingOrganization = [];
          for (let k = 0; k < disbursementDetails.length; k++) {
            this.reference.push(disbursementDetails[k].disbursementReference)
            this.project.push(disbursementDetails[k].projectTitle)
            this.fundingTitle.push(disbursementDetails[k].fundingDonorTitle)
            this.fundingOrganization.push(disbursementDetails[k].names)
          }
          this.reference = [...new Set(this.reference)];
          this.project = [...new Set(this.project)];
          this.fundingTitle = [...new Set(this.fundingTitle)];
          this.fundingOrganization = [...new Set(this.fundingOrganization)];
          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(disbursementDetails, o.columnProp);
          });
        }
      }
      // }

      let nameSearch = () => {
        let found = false;
        let checkIn = 0;
        let total = 0;
        if (isFilterSet) {
          for (const col in searchTerms) {
            total++;
            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              this.reference = [];
              this.project = [];
              this.fundingTitle = [];
              this.fundingOrganization = [];
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                /* adding Running filter start */

                for (let j = 0; j < disbursementDetails.length; j++) {

                  if (col == 'disbursementReference') {
                    if (spl[i].toLowerCase() == (disbursementDetails[j].disbursementReference).toString().toLowerCase()) {
                      this.project.push(disbursementDetails[j].projectTitle);
                      this.fundingTitle.push(disbursementDetails[j].fundingDonorTitle);
                      this.fundingOrganization.push(disbursementDetails[j].names);
                    }
                  } else if (col == 'fundingDonorTitle') {
                    if (spl[i].toLowerCase() == (disbursementDetails[j].fundingDonorTitle).toString().toLowerCase()) {
                      this.project.push(disbursementDetails[j].projectTitle);
                      this.reference.push(disbursementDetails[j].disbursementReference);
                      this.fundingOrganization.push(disbursementDetails[j].names);
                    }
                  } else if (col == 'projectTitle') {
                    if (spl[i].toLowerCase() == (disbursementDetails[j].projectTitle).toString().toLowerCase()) {
                      this.fundingTitle.push(disbursementDetails[j].fundingDonorTitle);
                      this.reference.push(disbursementDetails[j].disbursementReference);
                      this.fundingOrganization.push(disbursementDetails[j].names);
                    }
                  } else if (col == 'names') {
                    if (spl[i].toLowerCase() == (disbursementDetails[j].names).toString().toLowerCase()) {
                      this.fundingTitle.push(disbursementDetails[j].fundingDonorTitle);
                      this.reference.push(disbursementDetails[j].disbursementReference);
                      this.project.push(disbursementDetails[j].projectTitle);
                    }
                  }
                }

                /* adding Running filter end */
                if (data[col] != null) {
                  if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                    found = true;
                    checkIn++;
                  }
                }


              }
            });
          }
          this.project = [...new Set(this.project)];
          this.fundingTitle = [...new Set(this.fundingTitle)];
          this.fundingOrganization = [...new Set(this.fundingOrganization)];
          this.reference = [...new Set(this.reference)];

          if (this.reference.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'disbursementReference') {
                o.options = this.reference, 'disbursementReference';

              }
            });
          }
          if (this.project.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'projectTitle') {
                o.options = this.project, 'projectTitle';

              }
            });
          }
          if (this.fundingTitle.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'fundingDonorTitle') {
                o.options = this.fundingTitle, 'fundingDonorTitle';
              }
            });
          }
          if (this.fundingOrganization.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'names') {
                o.options = this.fundingOrganization, 'names';
              }
            });
          }
          return (checkIn == total);
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  public ExportTOExcel() {
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Disbursement');

  }
  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Disbursement List')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Disbursement List') {
        this.authorised_flag = true;
      }
    }
  }

  generateExcel() {
    let id = [];
    for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
      id.push(this.disbursementdataSource.filteredData[i].disbursement_id)
    }

    window.open(environment.disbursemntExcelUrl + id + '/' + btoa(this.checkedFilterColumn), '_self')
    // window.open(environment.disbursemntExcelUrl, '_self')

  }
  openDocumentDialog(disbursementRefNm: string) {
    localStorage.setItem('disbursementRefNm', disbursementRefNm);
    const dialogRef = this.dialog.open(DisbursementDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-disbursement']);
    });
  }
  applyFilter(filterValue: string) {
    this.disbursementdataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.disbursementdataSource.filter);
    console.log("filter data", this.disbursementdataSource.filter);
    if (this.disbursementdataSource.paginator) {
      this.disbursementdataSource.paginator.firstPage();
      this.totalRows = this.disbursementdataSource.filteredData.length;
      this.totalAmntUsd = 0;
      this.totalAmntMZN = 0;
      this.totalAmnt = 0;
      for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
        if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
          this.amountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
        } else {
          this.totalAmntMZN = this.totalAmntMZN + 0;
        }
        if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
          this.amountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
        }
        else {
          this.totalAmntUsd = this.totalAmntUsd + 0;
        }
        if (this.disbursementdataSource.filteredData[i].amount != null) {
          this.amountValue = Number.parseFloat(this.disbursementdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          // console.log("amnt outside init", this.totalAmnt)
        }
        else {
          this.totalAmnt = this.totalAmnt + 0;
        }

        //console.log("amnt ", this.disbursementdataSource.filteredData[i].amount)

      }
    }
  }
  viewMoreDisbursement(disbursement_id: any) {

    // localStorage.setItem("ViewMoreDisbursement", "ViewMoreDisbursement");
    // localStorage.setItem("disbursementId_view", disbursement_id);
    // console.log("View More inside view--->",localStorage.getItem("ViewMoreDisbursement"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-disbursement', disbursement_id]));
  }
  moveToSelectedTab(disbursement_id: any) {

    console.log("before route", disbursement_id);
    // localStorage.setItem("EditDisbursement", "EditDisbursement");
    //console.log("local storage",localStorage);
    // console.log("EditDisbursement inside view--->",localStorage.getItem("EditDisbursement"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-disbursement', disbursement_id]));
    console.log("after route", disbursement_id);

    // localStorage.setItem("disbursement_id",disbursement_id);
  }

  //for notification alert, execute on delete disbursement
  saveDisbursementDeleteAlert(ids: number[]) {
    let todayTime = new Date();
    let disbRefNameArr: string[] = [];
    let projectTitelNameArr: string[] = [];
    ids.forEach(id => {
      let disbRefName: string = this.findDisbRefById(id);
      disbRefNameArr.push(disbRefName);
      let projectTitelName: string = this.findProjTitelById(id);
      projectTitelNameArr.push(projectTitelName);
    });
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail: string = 'Disbursement Refrence ID  "'
      + disbRefNameArr
      + '" Deleted on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Disbursement Refrence ID "'
      + disbRefNameArr
      + '" for Project "'
      + projectTitelNameArr
      + '" has been deleted by user "' + this.userName + '" in AIMS on "'
      + ((todayTime + '').substring(0, 24)) + '" ';

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
  }

  //for notification alert
  private findDisbRefById(id: number): string {
    let disbName: string = null;
    for (let i = 0; i < disbursementDetails.length; i++) {
      if (disbursementDetails[i].disbursement_id == id) {
        disbName = disbursementDetails[i].disbursementReference;
      }
    }
    return disbName;
  }

  //for notification alert
  private findProjTitelById(id: number): string {
    let projectTitle: string = null;
    for (let i = 0; i < disbursementDetails.length; i++) {
      if (disbursementDetails[i].disbursement_id == id) {
        projectTitle = disbursementDetails[i].projectTitle;
      }
    }
    return projectTitle;
  }


  moveToSelectedTab1(tabName: string) {
    this.location.back();

  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  opensweetalertDelete() {
    this.getValueByLang();
    if (this.ids.length > 0) {
      Swal.fire({
        title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
        denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
      }).then((result) => {


        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.disbursementCrud.deleteByIds(this.ids,this.browserLang).subscribe(data => {
            disbursementDetails = data;
            /* Add data in MatTableDataSource */
            this.disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(disbursementDetails);
            this.totalRows = disbursementDetails.length;
            this.totalAmntUsd = 0;
            this.totalAmntMZN = 0;
            this.totalAmnt = 0;
            /* The below loop is for to find all total amount summation */
            /*Hi*/
            for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
              if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
                this.amountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
                this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
              } else {
                this.totalAmntMZN = this.totalAmntMZN + 0;


              }
              if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
                this.amountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
                this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
              }
              else {
                this.totalAmntUsd = this.totalAmntUsd + 0;
              }
              if (this.disbursementdataSource.filteredData[i].amount != null) {
                this.amountValue = Number.parseFloat(this.disbursementdataSource.filteredData[i].amount.replaceAll(",", ""));
                this.totalAmnt = this.totalAmnt + this.amountValue;
                //console.log("amnt inside init", this.totalAmnt)
              }
              else {
                this.totalAmnt = this.totalAmnt + 0;
              }
              // console.log("amnt ", this.disbursementdataSource.filteredData[i].amount)
            }

            /* Set Paginator */
            setTimeout(() =>
              this.disbursementdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.disbursementdataSource.sort = this.sort
            );
            for (let k = 0; k < disbursementDetails.length; k++) {
              this.reference.push(disbursementDetails[k].disbursementReference)
              this.project.push(disbursementDetails[k].projectTitle)
              this.fundingTitle.push(disbursementDetails[k].fundingDonorTitle)
              this.fundingOrganization.push(disbursementDetails[k].names)
            }
            this.reference = [...new Set(this.reference)];
            this.project = [...new Set(this.project)];
            this.fundingTitle = [...new Set(this.fundingTitle)];
            this.fundingOrganization = [...new Set(this.fundingOrganization)];
            this.filterSelectObj.filter((o) => {
              o.options = this.getFilterObject(disbursementDetails, o.columnProp);
            });
            this.disbursementdataSource.filterPredicate = this.createFilter();
            if (this.browserLang == 'en') {
              Swal.fire('Deleted successfully', '', 'success')
            } else {
              Swal.fire('Apagado com sucesso', '', 'success')
            }
          },
            error => console.log(error));
          this.saveDisbursementDeleteAlert(this.ids);
          // this.deleteDisbursement(disbursement_id);
        } else if (result.isDenied) {
          if (this.browserLang == 'en')
            Swal.fire('Cancelled', '', 'info');
          else {
            Swal.fire('Cancelado', '', 'info');
          }
          this.selection.clear();
          this.ids = [];
        }
      });
    }
    else {
      if (this.browserLang == 'en')
        Swal.fire('Select at least one record');
      else
        Swal.fire('Seleccione pelo menos um registo');
    }
  }
  editDisbursement(element: any) {
    console.log('element----->', JSON.stringify(element));
    localStorage.setItem('EditDisbursement', "EditDisbursement");
    localStorage.setItem('EditDisbursementElement', JSON.stringify(element));
    this.router.navigate(['edit-disbursement']);

  }
  totalAmntMZN: any;
  totalAmntUsd: any;
  totalAmnt: number;
  amountValue: any;
  amountValueMZN: any;
  amountValueUSD: any;

  private findTotalAmount() {
    this.totalAmntUsd = 0;
    this.totalAmntMZN = 0;
    this.totalAmnt = 0;

    for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
      // this.amountValue=Number.parseFloat(this.disbursementdataSource.filteredData[i].amount.replaceAll(",",""));
      // this.totalAmnt=this.totalAmnt+this.amountValue;
      // this.amountValueMZN=Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",",""));
      // this.totalAmntMZN=this.totalAmntMZN+this.amountValueMZN;
      // this.amountValueUSD=Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",",""));
      // this.totalAmntUsd=this.totalAmntUsd+this.amountValueUSD;
      if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
        this.amountValueMZN = Number.parseFloat(disbursementDetails[i].disbursementAmountMZN.replaceAll(",", ""));
        this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
      } else {
        this.totalAmntMZN = this.totalAmntMZN + 0;


      }
      if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
        this.amountValueUSD = Number.parseFloat(disbursementDetails[i].disbursementAmountUSD.replaceAll(",", ""));
        this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      }
      else {
        this.totalAmntUsd = this.totalAmntUsd + 0;
      }
      if (this.disbursementdataSource.filteredData[i].amount != null) {
        this.amountValue = Number.parseFloat(disbursementDetails[i].amount.replaceAll(",", ""));
        this.totalAmnt = this.totalAmnt + this.amountValue;
        //console.log("amnt outside init", this.totalAmnt)
      }
      else {
        this.totalAmnt = this.totalAmnt + 0;
      }

      // console.log("amnt ",this.disbursementdataSource.filteredData[i].amount)
    }
  }
  openDialog(disbursement_id: any) {
    localStorage.setItem("disbursementId_vm", disbursement_id);
    const dialogRef = this.dialog.open(ViewTableModalDisbursmentComponent, {
      disableClose: true,
    });
    //  dialogRef.afterClosed().subscribe((result) => {
    //    this.router.navigate(['view-disbursement']);
    //   });
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/view-table-modal-Disbursment-Component',disbursement_id]));



  }

  projectTitleList: DisbursementClass[];
  projectTitles:string[]=[];
  limits:number=0
  loadAllData(){
    this.limits=1;
    this.getDisbursementDetails();
      }
  private getDisbursementDetails() {
   
    this.disbursementCrud.getDisbursementDetails(this.limits).toPromise().then(data => {
      this.disbursementCrud.getProjectTitleDetailsByUserAccessId(this.userId).toPromise().then(dataProj=>{
        this.projectTitleList = dataProj;
        this.projectTitleList.forEach(projectTitel=>{
          this.projectTitles.push(projectTitel.projectTitle);
        });
        for (let i =0; i< disbursementDetails.length; i++) {
          disbursementDetails[i].emailChk = false;
          for (let j=0;j<this.projectTitles.length;j++) {
            if (disbursementDetails[i].projectTitle == this.projectTitles[j]) {
              disbursementDetails[i].emailChk = true;
            }
          }
        }
      });
      console.log("return data" + data.length);
      disbursementDetails = data;
      console.log("return data" , disbursementDetails);
      this.totalRows = disbursementDetails.length;
      this.totalAmntUsd = 0;
      this.totalAmntMZN = 0;
      this.totalAmnt = 0;
      /* The below loop is for to find all total amount summation */
      for (let i = 0; i < disbursementDetails.length; i++) {
        // arr = disbursementDetails[i].records;
        // alert("hi")
        // console.log("1st value:",disbursementDetails[i].disbursementAmountMZN)
        // console.log("2nd value:",Number.parseFloat(disbursementDetails[i].disbursementAmountMZN))
        // console.log("3rd value:",disbursementDetails[i].disbursementAmountMZN)
        if (disbursementDetails[i].disbursementAmountMZN != null) {
          this.amountValueMZN = Number.parseFloat(disbursementDetails[i].disbursementAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
        } else {
          this.totalAmntMZN = this.totalAmntMZN + 0;


        }
        if (disbursementDetails[i].disbursementAmountUSD != null) {
          this.amountValueUSD = Number.parseFloat(disbursementDetails[i].disbursementAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
        }
        else {
          this.totalAmntUsd = this.totalAmntUsd + 0;
        }
        if (disbursementDetails[i].amount != null) {
          this.amountValue = Number.parseFloat(disbursementDetails[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          // console.log("amnt inside init", this.totalAmnt)
        }
        else {
          this.totalAmnt = this.totalAmnt + 0;
        }
        //this.totalAmnt = this.totalAmnt + disbursementDetails[i].amount;
      }
      
      /* Add data in MatTableDataSource */
      this.disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(disbursementDetails);
      /* Set Paginator */
      setTimeout(() =>
        this.disbursementdataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.disbursementdataSource.sort = this.sort
      );
      for (let k = 0; k < disbursementDetails.length; k++) {
        this.reference.push(disbursementDetails[k].disbursementReference)
        this.project.push(disbursementDetails[k].projectTitle)
        this.fundingTitle.push(disbursementDetails[k].fundingDonorTitle)
        this.fundingOrganization.push(disbursementDetails[k].names)
      }
      this.reference = [...new Set(this.reference)];
      this.project = [...new Set(this.project)];
      this.fundingTitle = [...new Set(this.fundingTitle)];
      this.fundingOrganization = [...new Set(this.fundingOrganization)];
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(disbursementDetails, o.columnProp);
      });
      this.disbursementdataSource.filterPredicate = this.createFilter();
    });
  }

  optionsMT: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if (this.browserLang == 'en') {
              return '<b>Min Amount : </b> ' + value;
            } else {
              return '<b>Montante mínimo : </b> ' + value;
            }

          }
        case LabelType.High:
          {
            max = value;
            if (this.browserLang == 'en') {
              return '<b>Max Amount : </b> ' + value;
            } else {
              return '<b>Montante máximo : </b> ' + value;
            }

          }
        default:
          if (this.browserLang == 'en') {
            return 'Filter Amount (MZN)';
          } else {
            return 'Filtrar montante (MZN)';
          }
      }

    }
  };

  options1: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if (this.browserLang == 'en') {
              return '<b>Min Amount : </b> ' + value;
            } else {
              return '<b>Montante mínimo : </b> ' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
            if (this.browserLang == 'en') {
              return '<b>Max Amount : </b> ' + value;
            } else {
              return '<b>Montante máximo : </b> ' + value;
            }
          }
        default:
          if (this.browserLang == 'en') {
            return 'Filter Amount (USD)';
          } else {
            return 'Filtrar montante (USD)';
          }
      }

    }
  };

  getRangeForMZN() {
    // console.log("max:" + this.maxValueMZN);
    // console.log("main:" + this.minValueMZN);
    // this.disbursementdataSource.data = ELEMENT_DATA;
    // const from = this.minValueMZN;
    // const to = this.maxValueMZN;
    // this.disbursementdataSource.data = this.disbursementdataSource.data.filter(e=>e.envagrcurr >= from && e.envagrcurr <= to ) ;

    //console.log("ELEMENT_DATA:"+ELEMENT_DATA);
    this.disbursementdataSource.data = disbursementDetails;
    //console.log("envelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    // for(var i=0;i<envelopeDetails.length;i++){
    //   console.log("amount:"+envelopeDetails[i].amount);
    // }
    this.disbursementdataSource.data = this.disbursementdataSource.data.filter(e => e.amount >= from && e.amount <= to);
    this.totalRows = this.disbursementdataSource.data.length;
  }

  getRange() {
    console.log("max:" + this.maxValue);
    console.log("main:" + this.minValue);
    this.disbursementdataSource.data = disbursementDetails;
    const from = this.minValue;
    const to = this.maxValue;
    this.disbursementdataSource.data = this.disbursementdataSource.data.filter(e => Number.parseFloat(e.disbursementAmountUSD) >= this.minValue && Number.parseFloat(e.disbursementAmountUSD) <= this.maxValue);
    this.totalRows = this.disbursementdataSource.data.length;
  }
  onInputChange(event: MatSliderChange) {
    // console.log("This is emitted as the thumb slides");
    console.log(event.value);
    console.log("disbursementDetails length:" + disbursementDetails.length);
    this.disbursementdataSource.data = disbursementDetails;
    const from = this.minValueMZN;
    this.disbursementdataSource.data = this.disbursementdataSource.data.filter(e => Number.parseFloat(e.disbursementAmountMZN) >= from && Number.parseFloat(e.disbursementAmountMZN) <= event.value);
    this.totalRows = this.disbursementdataSource.data.length;
    // console.log("data ",this.disbursementdataSource.data)
    this.totalAmntMZN = 0;
    this.totalAmntUsd = 0;
    this.totalAmnt = 0;
    /* The below loop is for to find all total amount and total usd amount  summation */
    for (let i = 0; i < this.disbursementdataSource.data.length; i++) {
      if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
        this.amountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
        this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
      }

      if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
        this.amountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
        this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      }
      if (disbursementDetails[i].amount != null) {
        this.amountValue = Number.parseFloat(disbursementDetails[i].amount.replaceAll(",", ""));
        this.totalAmnt = this.totalAmnt + this.amountValue;
      }


    }
  }
  onInputChange1(event: MatSliderChange) {
    //console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.disbursementdataSource.data = disbursementDetails;
    const from = this.minValue;
    this.disbursementdataSource.data = this.disbursementdataSource.data.filter(e => Number.parseFloat(e.disbursementAmountUSD) >= from && Number.parseFloat(e.disbursementAmountUSD) <= event.value);
    this.totalRows = this.disbursementdataSource.data.length;
    this.totalAmntMZN = 0;
    this.totalAmntUsd = 0;
    this.totalAmnt = 0;
    /* The below loop is for to find all total amount and total usd amount summation */
    for (let i = 0; i < this.disbursementdataSource.data.length; i++) {
      this.amountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
      this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
      this.amountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
      this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      this.amountValue = Number.parseFloat(disbursementDetails[i].amount.replaceAll(",", ""));
      this.totalAmnt = this.totalAmnt + this.amountValue;
    }
  }
  resetFilters() {
    this.minValueMZN = 0;
    this.minValue = 0;
    this.getDisbursementDetails();

    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.disbursementdataSource.filter = "";
    this.disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(disbursementDetails);
    this.disbursementdataSource.paginator = this.paginator;
    this.disbursementdataSource.sort = this.sort;
    this.findTotalAmount();
    this.totalRows = 0;
    this.totalRows = disbursementDetails.length;
    $("#filter").val("");

  }

  searchFilter = new FormControl('');
  openOptionSearch(e) {
    this.searchFilter.patchValue('');
    // this.filterSelectObj.filter((o) => {
    //   o.options = this.getFilterObject(this.disbursementdataSource.filteredData, o.columnProp);
    // });
  }

  chkValue(filter, event) {

    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;

    let disbursementReference = [];
    let projectTitle = [];
    let fundingDonorTitle = [];
    let names = [];
    let refFineRef = [];



    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      refFineRef = this.reference;
      for (var i = 0; i < this.disbursementdataSource.filteredData.length; i++) {

        // localStorage.setItem("totalRef",this.reference);
        if (columnName == 'disbursementReference') {

          if (this.reference.length == 0) {
            console.log("inside o length 1");
            if (((this.disbursementdataSource.filteredData[i].disbursementReference).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              console.log("inside o length");
              disbursementReference.push(this.disbursementdataSource.filteredData[i].disbursementReference);
            }
          }
          else if (this.reference.length != 0) {

            // if (this.reference[i] == undefined){
            //   console.log("inside o length 2",this.disbursementdataSource.filteredData[i].disbursementReference);
            //   // this.reference=refFineRef;
            //   for(let k=0;k<refFineRef.length;k++)
            //   {
            //     // if(refFineRef[k]!==undefined)
            //     // disbursementReference.push(refFineRef[k]);

            //   }

            // }
            if (this.reference[i] != undefined) {
              if (((this.reference[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {

                disbursementReference.push(this.reference[i]);
              }
            }
          }
        }

        if (columnName == 'projectTitle') {
          if (this.project.length == 0) {
            if (((this.disbursementdataSource.filteredData[i].projectTitle).toString().toLowerCase()).indexOf((searchFilterVal.toString()).toLowerCase()) > -1) {
              projectTitle.push(this.disbursementdataSource.filteredData[i].projectTitle);
            }
          }
          else if (this.project.length != 0) {
            if (this.project[i] != undefined) {
              if (((this.project[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                projectTitle.push(this.project[i]);
              }
            }
          }
        }
        if (columnName == 'fundingDonorTitle') {
          if (this.fundingTitle.length == 0) {
            if (((this.disbursementdataSource.filteredData[i].fundingDonorTitle).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              fundingDonorTitle.push(this.disbursementdataSource.filteredData[i].fundingDonorTitle);
            }
          }
          else if (this.fundingTitle.length != 0) {
            if (this.fundingTitle[i] != undefined) {
              if (((this.fundingTitle[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                fundingDonorTitle.push(this.fundingTitle[i]);
              }
            }
          }
        }
        if (columnName == 'names') {
          if (this.fundingOrganization.length == 0) {
            if (((this.disbursementdataSource.filteredData[i].names).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              names.push(this.disbursementdataSource.filteredData[i].names);
            }
          }
        
        else if (this.fundingOrganization.length != 0) {
          if (this.fundingOrganization[i] != undefined) {
            if (((this.fundingOrganization[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              names.push(this.fundingOrganization[i]);
            }
          }
        }
      }
      }

      if (columnName == 'disbursementReference') {
        disbursementReference = [...new Set(disbursementReference)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'disbursementReference') {
            o.options = disbursementReference, 'disbursementReference';
          }
        });
      } else if (columnName == 'projectTitle') {
        projectTitle = [...new Set(projectTitle)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'projectTitle') {
            o.options = projectTitle, 'projectTitle';
          }
        });
      } else if (columnName == 'fundingDonorTitle') {
        fundingDonorTitle = [...new Set(fundingDonorTitle)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'fundingDonorTitle') {
            o.options = fundingDonorTitle, 'fundingDonorTitle';
          }
        });
      } else if (columnName == 'names') {
        names = [...new Set(names)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'names') {
            o.options = names, 'names';
          }
        });
      }
    }

    if (searchFilterVal.length == 0 && columnName == 'disbursementReference' && this.reference.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'disbursementReference')
          o.options = this.reference, 'disbursementReference';
      });
    }

    if (searchFilterVal.length == 0 && columnName == 'projectTitle' && this.project.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'projectTitle')
          o.options = this.project, 'projectTitle';
      });
    }

    if (searchFilterVal.length == 0 && columnName == 'fundingDonorTitle' && this.fundingTitle.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingDonorTitle')
          o.options = this.fundingTitle, 'fundingDonorTitle';
      });
    }

    if (searchFilterVal.length == 0 && columnName == 'names' && this.fundingOrganization.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'names')
          o.options = this.fundingOrganization, 'names';
      });
    }

  }

  selection = new SelectionModel<DisbursementCrudService>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: DisbursementCrudService) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.disbursement_id);
    } else {
      let index = this.ids.indexOf(row.disbursement_id, 0);
      this.ids.splice(index, 1);
    }
  }
  openDialogDoc(disbursmentRefNm) {
    localStorage.setItem("disbursmentRefNm", disbursmentRefNm);
    const dialogRef = this.dialog.open(DisbursementDocumentUploadComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['disbursement']);
      console.log(`Dialog result: ${result}`);
      // localStorage.removeItem('disbRefNM');
    });

  }
}
export interface PeriodicElement {
  // position: number;
  disbursementReference: string;
  project: string;
  fundingDonorTitle: any;
  amount: number;
  currency: any;
  // exchangeRates:number;
  disbursementAmountMZN: any;
  disbursementAmountUSD: any;
  amountOfdisbursementAgreement: any;
  names: any;
  date: string;
  swiftcode: string;
  receivedswiftcode: string;
  receivedBankNIB: string;

}
let disbursementDetails: DisbursementCrudService[] = [];

export enum SelectType {
  single,
  multiple
}

