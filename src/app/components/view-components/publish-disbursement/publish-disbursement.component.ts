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
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-publish-disbursement',
  templateUrl: './publish-disbursement.component.html',
  styleUrls: ['./publish-disbursement.component.css']
})
export class PublishDisbursementComponent implements OnInit {
  disbursementDataList: DisbursementCrudService[];
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  dialogRef: MatDialogRef<DisbursementDocumentViewComponent>
  disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(disbursementDetails);
  displayedColumns: string[] = ['select','edit', 'disbursementReference', 'projectTitle', 'amount', 'currency', 'disbursementAmountMZN', 'disbursementAmountUSD'];
  displayedColumnsReadOnly: string[] = ['disbursementReference', 'project', 'fundingTitle', 'amount',
    , 'disbursementAmountMZN', 'disbursementAmountUSD', 'amountOfdisbursementAgreement', 'names',
    'date', 'swiftcode', 'receivedswiftcode', 'receivedBankNIB'];
  // disbursementdataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  myControl = new FormControl();

  usergroup: any;
  userName: string = "Charlie Adams"; //This field will be softcoded later.
  userGroup: string = "DNGDP Admin"; //This field will be softcoded later.
  totalRows: any;
  filterSelectObj = [];
  authorised_flag=false;



  constructor(private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location,
    private disbursementCrud: DisbursementCrudServiceService, private notificationService: NotificationService,public translate: TranslateService) {
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


  }
  minValue: number = 0;
  maxValue: number = 6000;

  minValueMZN: number = 0;
  maxValueMZN: number = 6000;
  minAmount: any = [];
  filterValues = {};
  filterData:any;
  filterChange(filter, event) {

    this.filterValues[filter.columnProp] = event.value
    this.disbursementdataSource.filter = JSON.stringify(this.filterValues)

    this.disbursementdataSource.paginator = this.paginator;
    this.disbursementdataSource.sort = this.sort;

    
    this.totalRows = this.disbursementdataSource.filteredData.length;
  }

  browserLang: any;
  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getDisbursementDetails();
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
  // Custom filter method fot Angular Material Datatable
  createFilter() {

    let filterFunction = function (data: any, filter: string): boolean {
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
        }
      }
      // }

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                if(data[col]!=null){
                  if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                    found = true
                  }
                }

              }

            });
          }
          return found
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
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Disbursement List'){
        this.authorised_flag=true;
      }
    }
  }

  generateExcel() {
    window.open(environment.disbursemntExcelUrl, '_self')

  }
  openDocumentDialog() {
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
      this.totalRows = this.disbursementdataSource.filteredData.length
      
    }
  }
  viewMoreDisbursement(disbursement_id: any) {

    // localStorage.setItem("ViewMoreDisbursement", "ViewMoreDisbursement");
    // localStorage.setItem("disbursementId_view", disbursement_id);
    // console.log("View More inside view--->",localStorage.getItem("ViewMoreDisbursement"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-drafted-disbursement', disbursement_id]));
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
  moveToSelectedTab1(tabName: string) {
    this.location.back();

  }

  publishDisbursement() {
    Swal.fire({
      title: 'Do you want to publish?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Publish`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.ids.length > 0) {
          this.disbursementCrud.publishById(this.ids).subscribe(data => {
            disbursementDetails = data;
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
            Swal.fire('Published Successfully', '', 'success')
          },
            error => console.log(error));
          
        }else {
          Swal.fire('Select atleast 1 record', '', 'info');
        }
      } 
    })
  }
  discardDisbursement() {
    Swal.fire({
      title: 'Do you want to discard?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Discard`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.ids.length > 0) {
          this.disbursementCrud.discardById(this.ids).subscribe(data => {
            disbursementDetails = data;
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
            Swal.fire('Discarded Successfully', '', 'success')
          },
            error => console.log(error));
        }else {
          Swal.fire('Select atleast 1 record', '', 'info');
        }
      } 
    })
  }

  openDialog(disbursement_id: any) {
    localStorage.setItem("disbursementId_vm", disbursement_id);
    const dialogRef = this.dialog.open(ViewTableModalDisbursmentComponent, {
      disableClose: true,
    });
  }
  private getDisbursementDetails() {

    this.disbursementCrud.getDraftedDisbursementDetails().subscribe(data => {
      console.log("return data" + data.length);
      disbursementDetails = data;

      this.totalRows = disbursementDetails.length;
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
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(disbursementDetails, o.columnProp);
      });
      this.disbursementdataSource.filterPredicate = this.createFilter();
      console.log("init filter value is:", this.disbursementdataSource.filterPredicate)
      console.log("all data", disbursementDetails);
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
            return '<b>Min Amount : </b> MZN' + value;
          }
        case LabelType.High:
          {
            max = value;
            return '<b>Max Amount : </b> MZN' + value;
          }
        default:
          return 'Filter Amount (MZN)';
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
            return '<b>Min Amount : </b> $' + value;
          }
        case LabelType.High:
          {
            max = value;
            return '<b>Max Amount : </b> $' + value;
          }
        default:
          return 'Filter Amount (USD)';
      }

    }
  };

  getRangeForMZN() {
    this.disbursementdataSource.data = disbursementDetails;
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    // this.disbursementdataSource.data = this?.disbursementdataSource.data.filter(e => e.amount >= from && e.amount <= to);
    // this.totalRows = this.disbursementdataSource.data.length;
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
    this.totalRows = 0;
    this.totalRows = disbursementDetails.length;
    $("#filter").val("");

  }

  searchFilter = new FormControl('');
  openOptionSearch(e) {
    this.searchFilter.patchValue('');
    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.disbursementdataSource.filteredData, o.columnProp);
    });
  }

  chkValue(filter, event) {

    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;

    let disbursementReference = [];
    let projectTitle = [];
    let fundingDonorTitle = [];
    let names = [];



    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
        if (columnName == 'disbursementReference') {
          if (((this.disbursementdataSource.filteredData[i].disbursementReference).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            disbursementReference.push(this.disbursementdataSource.filteredData[i].disbursementReference);
          }
        }
        if (columnName == 'projectTitle') {
          if (((this.disbursementdataSource.filteredData[i].projectTitle).toString().toLowerCase()).indexOf((searchFilterVal.toString()).toLowerCase()) > -1) {
            projectTitle.push(this.disbursementdataSource.filteredData[i].projectTitle);
          }
        }
        if (columnName == 'fundingDonorTitle') {
          if (((this.disbursementdataSource.filteredData[i].fundingDonorTitle).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            fundingDonorTitle.push(this.disbursementdataSource.filteredData[i].fundingDonorTitle);
          }
        }
        if (columnName == 'names') {
          if (((this.disbursementdataSource.filteredData[i].names).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            names.push(this.disbursementdataSource.filteredData[i].names);
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

    if (searchFilterVal.length == 0) {
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(disbursementDetails, o.columnProp);
      });
    }

  }

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];
  selection = new SelectionModel<DisbursementCrudService>(true, []);

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
}

let disbursementDetails: DisbursementCrudService[] = [];

export enum SelectType {
  single,
  multiple
}