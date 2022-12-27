import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import { MatRadioChange } from '@angular/material/radio';
import { ViewTableModalPaymentComponent } from '../../view-more-components/view-table-modal-payment/view-table-modal-payment.component';
import { Location } from '@angular/common';
import { PaymentDocumentViewComponent } from '../../document-repository/view-document/payment-document-view/payment-document-view.component';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { MatSliderChange } from '@angular/material/slider';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-publish-payment',
  templateUrl: './publish-payment.component.html',
  styleUrls: ['./publish-payment.component.css']
})
export class PublishPaymentComponent implements OnInit {

  
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
  displayedColumns: string[] = ['select','edit', 'paymentReference', 'stateBudget', 'amount', 'currency', "paymentAmountMZN", "paymentAmountUSD"];
  displayedColumnsReadOnly: string[] = ['PaymentReference', 'financing', 'project', 'UGBMEO', 'MEOResourceSources', 'paymentDate', 'paymentAmount', 'amountofPayment'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  usergroup: any;
  myControl = new FormControl();
  chosenYearDate: Date;


  donorOptions: string[] = ['Organization 1', 'Organization 2', 'Organization 3', 'Organization 4', 'Organization 5'];
  fundingOrganizationOptions: string[] = ['Organization 6', 'Organization 7', 'Organization 8', 'Organization 9', 'Organization 10'];
  responsibleOrganizationOptions: string[] = ['Organization 11', 'Organization 12', 'Organization 13', 'Organization 14', 'Organization 15'];
  typesOfAidDacCrs: string[] = ['General Budget Support', 'Sectorial Budget Support', 'Base funding to NGOs/Universities', 'Common Funds', 'Project', 'Grants and Training', 'Debt Relief'];
  typeOfFinanceOptions: string[] = ['Type of finance 1', 'Type of finance 2'];
  meoResourceSourceOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  pillarPqgMeoOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  strategicObjectivePqgMeoOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  projectTypeOptions: string[] = ['On-Budget', 'Off-Budget', 'All'];
  favoriteSeason: string;

  projectTypefilter: Observable<string[]>;
  currencyfilter: Observable<string[]>;
  donorfilter: Observable<string[]>;
  fundingorganizationFilter: Observable<string[]>;
  responsibleorganizationFilter: Observable<string[]>;
  financingsituationFilter: Observable<string[]>;
  typesOfAidDacCrsFilter: Observable<string[]>;
  autoComeInLikeFilters: Observable<string[]>;
  typeOfFinanceFilter: Observable<string[]>;
  meoResourceSourceFilter: Observable<string[]>;
  pillarPqgMeoFilter: Observable<string[]>;
  strategicObjectivePqgMeoFilter: Observable<string[]>;
  radioSelected: number = 0;
  signatureDate = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  userNameForNotification: string = "Charlie Adams"; //This field will be softcoded later.
  userGroupForNotification: string = "DNGDP Admin"; //This field will be softcoded later.
  authorised_flag=false;
  filterSelectObj = [];

  constructor(private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location
    , private paymentCrud: PaymentCrudServiceService, private notificationService: NotificationService)
    {
      this.filterSelectObj = [
        {
          name: 'Payment Reference',
          columnProp: 'paymentReference',
          options: []
        }, {
          name: 'State Budget',
          columnProp: 'stateBudget',
          options: []
        }
        ,  {
          name: 'Financial Agreement',
          columnProp: 'fundingDonorTitle',
          options: []
        }
        , {
          name: 'Project',
          columnProp: 'projectTitle',
          options: []
        } , {
          name: 'UGB MEO',
          columnProp: 'ugbMEO',
          options: []
        }, {
          name: 'MPO Resource Source',
          columnProp: 'meoResourceSource',
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
      this.paymentdataSource.filter = JSON.stringify(this.filterValues)

      this.paymentdataSource.paginator = this.paginator;
      this.paymentdataSource.sort = this.sort;
      this.totalAmnt = 0;
      this.totalRows = 0;
      this.totalAmntMZN = 0;
      this.totalAmntUsd = 0;

      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        if (this.paymentdataSource.filteredData[i].paymentAmountMZN != null) {
          this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
        } else {
          this.totalAmntMZN = this.totalAmntMZN + 0;
        }
        if (this.paymentdataSource.filteredData[i].paymentAmountUSD != null) {
          this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
        }
        else {
          this.totalAmntUsd = this.totalAmntUsd + 0;
        }
        if (this.paymentdataSource.filteredData[i].amount != null) {
          this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          // console.log("amnt outside init", this.totalAmnt)
        }
        else {
          this.totalAmnt = this.totalAmnt + 0;
        }

        //console.log("amnt ", this.paymentdataSource.filteredData[i].amount)

      }
      //  for(let i=0;i<this.paymentdataSource.filteredData.length;i++){
      //    this.totalAmnt=this.totalAmnt+Number.parseFloat(this.paymentdataSource[i].amount_of_disbursement);
      //    this.totalAmntMZN=this.totalAmntMZN+Number.parseFloat(this.paymentdataSource[i].amountOfdisbursementMeticais);
      //    this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(this.paymentdataSource[i].amountOfdisbursementUSD);
      //  }
      this.totalRows = this.paymentdataSource.filteredData.length;
    }


  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.findTotalAmount();
    this.getPaymentDetails();
    this.usergroup = localStorage.getItem('usergroup');
    this.setToUserPermission();
    setTimeout(() => this.paymentdataSource.paginator = this.paginator);
    // this.paymentdataSource.paginator = this.paginator;

    setTimeout(() => this.paymentdataSource.sort = this.sort);

    this.projectTypefilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.projectTypeFilter(value))
    );

    // this.currencyfilter = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this.currencyFilter(value))
    // );
    this.donorfilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.donorFilter(value))
    );
    this.fundingorganizationFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.fundingOrganizationFilter(value))
    );
    this.responsibleorganizationFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.responsibleOrganizationFilter(value))
    );
    this.typesOfAidDacCrsFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.typesOfAidDacCrsFilterMethod(value))
    );
    this.typeOfFinanceFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.typeOfFinanceFilterMethod(value))
    );
    this.meoResourceSourceFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.meoResourceSourceFilterMethod(value))
    );
    this.pillarPqgMeoFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.pillarPqgMeoMethod(value))
    );
    this.strategicObjectivePqgMeoFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.strategicObjectivePqgMeoFilterMethod(value))
    );
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
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Payment');
    //this.excelService.exportTableElmToExcel(this.epltable, 'Payment');
  }


  generateExcel() {
    window.open(environment.paymentExcelUrl, '_self')

  }
  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Payment List')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Payment List'){
        this.authorised_flag=true;
      }
    }
  }

  totalRows: any;
  moveToSelectedTab1(tabName: string) {
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/payment']));
    // console.log("after route");
    this.location.back();

  }
  publishPayment(payment_id: any) {
    Swal.fire({
      title: 'Do you want to publish ?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Publish`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.paymentCrud.publishById(payment_id).subscribe(data => {
          paymentDetails = data;
          this.totalRows = paymentDetails.length;
          console.log(data);
          console.log("aasuchi ts file  ku");
          /* Add data in MatTableDataSource */
          this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
          /* Set Paginator */
          setTimeout(() =>
            this.paymentdataSource.paginator = this.paginator
          );
          /* Set sorting */
          setTimeout(() =>
            this.paymentdataSource.sort = this.sort
          );
        },
          error => console.log(error));
        this.savePaymentDeleteAlert();
        Swal.fire('Published Successfully!', '', 'success')
        // this.moveToSelectedTab;
      }
    })
  }

  discardPayment(payment_id: any) {
    Swal.fire({
      title: 'Do you want to discard ?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Discard`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.paymentCrud.discardById(payment_id).subscribe(data => {
          paymentDetails = data;
          this.totalRows = paymentDetails.length;
          console.log(data);
          console.log("aasuchi ts file  ku");
          /* Add data in MatTableDataSource */
          this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
          /* Set Paginator */
          setTimeout(() =>
            this.paymentdataSource.paginator = this.paginator
          );
          /* Set sorting */
          setTimeout(() =>
            this.paymentdataSource.sort = this.sort
          );
        },
          error => console.log(error));
        this.savePaymentDeleteAlert();
        Swal.fire('Discarded Successfully!', '', 'success')
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  paymentCurrency: any;

  moveToSelectedTab(payment_id: string) {
    console.log("before route", payment_id);
    localStorage.setItem("EditPayment", "EditPayment");

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-payment', payment_id]));
    console.log("after route", payment_id);
    // localStorage.setItem("payment_id",payment_id);
  }

  applyFilter(filterValue: string) {
    console.log("all data ", this.paymentdataSource)
    this.totalAmntUsd = 0;
    this.totalAmnt = 0;
    this.totalAmntMZN = 0;
    this.totalRows = 0;
    if (this.radioSelected == 1) {
      console.log("coming to One");
      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        if (this.paymentdataSource.filteredData[i].stateBudget == 'On-Budget') {
          this.paymentdataSource.filter = filterValue.trim().toLowerCase();
          this.paymentdataSource.paginator.firstPage();
          this.totalRows = this.totalRows + 1;
          this.paymentdataSource.sort = this.sort;
        }

      }
      if (this.paymentdataSource.filteredData.length > 0) {
        for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
          this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
          this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
        }
      }
      else if (this.paymentdataSource.filteredData.length == 0) {
        this.totalAmntUsd = 0;
        this.totalAmnt = 0;
        this.totalAmntMZN = 0;
        this.totalRows = 0;
      }
    } else if (this.radioSelected == 2) {
      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        if (this.paymentdataSource.filteredData[i].stateBudget == 'Off-Budget') {
          this.paymentdataSource.filter = filterValue.trim().toLowerCase();
          this.paymentdataSource.paginator.firstPage();
           setTimeout(() =>
            this.paymentdataSource.paginator = this.paginator
          );
          this.paymentdataSource.sort = this.sort;
          this.totalRows = this.paymentdataSource.filteredData.length;
          if (this.paymentdataSource.filteredData.length > 0) {
              this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
              this.totalAmnt = this.totalAmnt + this.amountValue;
              this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
              this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
              this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
              this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
           } else if (this.paymentdataSource.filteredData.length == 0) {
            this.totalAmntUsd = 0;
            this.totalAmnt = 0;
            this.totalAmntMZN = 0;

          }
        }
      }
      console.log("coming to One");

    } else if (this.radioSelected == 3) {
      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        if (this.paymentdataSource.filteredData[i].stateBudget == 'Off-Budget' || this.paymentdataSource.filteredData[i].stateBudget == 'On-Budget') {
          this.paymentdataSource.filter = filterValue.trim().toLowerCase();
          this.paymentdataSource.paginator = this.paginator
          this.paymentdataSource.sort = this.sort;
          this.totalRows = this.paymentdataSource.filteredData.length;
          if (this.paymentdataSource.filteredData.length > 0) {
              this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
              this.totalAmnt = this.totalAmnt + this.amountValue;
              this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
              this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
              this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
              this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;

          } else if (this.paymentdataSource.filteredData.length == 0) {
            this.totalAmntUsd = 0;
            this.totalAmnt = 0;
            this.totalAmntMZN = 0;

          }
        }
      }

    } else if (this.radioSelected == 0) {

      this.paymentdataSource.filter = filterValue.trim().toLowerCase();
      this.totalRows = this.paymentdataSource.filteredData.length;
      this.paymentdataSource.paginator.firstPage();
      if (this.paymentdataSource.filteredData.length > 0) {
        for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
          this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
          this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
        }
      } else if (this.paymentdataSource.filteredData.length == 0) {
        this.totalAmntUsd = 0;
        this.totalAmnt = 0;
        this.totalAmntMZN = 0;

      }
    }


  }

  radioChange($event: MatRadioChange) {
    console.log('radio identifier change--->', $event.source.name, $event.value);
    this.totalAmntUsd = 0;
    this.totalAmnt = 0;
    this.totalAmntMZN = 0;
    this.totalRows = 0;
    if ($event.value === 'On-Budget') {
      //this.totalRows=0;

      // this.paymentdataSource.sort = this.sort;

      this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
      this.paymentdataSource.filter = $event.value.trim().toLowerCase();

      console.log("data =>", this.paymentdataSource)
      this.radioSelected = 1;
      // if (this.paymentdataSource.filteredData.length != 0) {

        this.totalRows = this.paymentdataSource.filteredData.length;
        for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
          this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
          this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;

          // }
        }
        setTimeout(() =>
          this.paymentdataSource.paginator = this.paginator
        );
        setTimeout(() =>
          this.paymentdataSource.sort = this.sort
        );
      }
    else if ($event.value === 'Off-Budget') {
      this.radioSelected = 2;
      this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
      this.totalRows = this.paymentdataSource.filteredData.length;
      // alert("length:--"+ this.paymentdataSource.filteredData.length)
      // alert("Row:--"+  this.totalRows)

      this.paymentdataSource.filter = $event.value.trim().toLowerCase();
      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
        this.totalAmnt = this.totalAmnt + this.amountValue;
        this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
        this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
        this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
        this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;

      }
      setTimeout(() =>
        this.paymentdataSource.paginator = this.paginator
      );
      setTimeout(() =>
        this.paymentdataSource.sort = this.sort
      );
    } if ($event.value === 'All') {
      this.radioSelected = 3;

      this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
      for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
        if (this.paymentdataSource.filteredData[i].stateBudget == 'Off-Budget' || this.paymentdataSource.filteredData[i].stateBudget == 'On-Budget') {
          this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
          this.totalAmnt = this.totalAmnt + this.amountValue;
          this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
          this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
          this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
          this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;

        }

      }
      this.totalRows = this.paymentdataSource.filteredData.length;
      setTimeout(() =>
        this.paymentdataSource.paginator = this.paginator
      );
      setTimeout(() =>
        this.paymentdataSource.sort = this.sort
      );
      // this.paymentdataSource.paginator.firstPage();

    }
  }

  viewMorePayment(payment_id: any) {

    // localStorage.setItem("ViewMorePayment", "ViewMorePayment");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-drafted-payment', payment_id]));

  }

  //for notification alert, execute on delete disbursement
  savePaymentDeleteAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();
    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    notificationDetails.notificationMsg = this.userNameForNotification + " has deleted payment on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
    });
  }

  private projectTypeFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projectTypeOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  // private currencyFilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.currencyOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  // }
  private donorFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.donorOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private fundingOrganizationFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fundingOrganizationOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private responsibleOrganizationFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.responsibleOrganizationOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private typesOfAidDacCrsFilterMethod(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.typesOfAidDacCrs.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private typeOfFinanceFilterMethod(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.typeOfFinanceOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private strategicObjectivePqgMeoFilterMethod(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.strategicObjectivePqgMeoOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private pillarPqgMeoMethod(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.pillarPqgMeoOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private meoResourceSourceFilterMethod(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.meoResourceSourceOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }

  editPayment(element: any) {
    console.log('element----->', JSON.stringify(element));
    this.router.navigate(['edit-payment']);
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

    for (let i = 0; i < this.paymentdataSource.filteredData.length; i++) {
      this.amountValue = Number.parseFloat(this.paymentdataSource.filteredData[i].amount.replaceAll(",", ""));
      this.totalAmnt = this.totalAmnt + this.amountValue;
      this.amountValueMZN = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",", ""));
      this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
      this.amountValueUSD = Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",", ""));
      this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      //console.log("amnt ",ELEMENT_DATA[i].amount_of_disbursement)
    }
  }
  openDialog(payment_id: any) {
    localStorage.setItem("paymentId_vm", payment_id);
    const dialogRef = this.dialog.open(ViewTableModalPaymentComponent, {
      disableClose: true,
    });
  }

  openDocumentDialog() {
    const dialogRef = this.dialog.open(PaymentDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-payment']);
    });
  }

  private getPaymentDetails() {
    this.paymentCrud.getDraftedPaymentDetails().subscribe(data => {
      paymentDetails = data;
      this.totalRows = paymentDetails.length;
      this.totalAmntUsd = 0;
      this.totalAmntMZN = 0;
      this.totalAmnt = 0;
      for (let i = 0; i < paymentDetails.length; i++) {
        this.amountValue = Number.parseFloat(paymentDetails[i].amount.replaceAll(",", ""));
        this.totalAmnt = this.totalAmnt + this.amountValue;
        this.amountValueMZN = Number.parseFloat(paymentDetails[i].paymentAmountMZN.replaceAll(",", ""));
        this.totalAmntMZN = this.totalAmntMZN + this.amountValueMZN;
        this.amountValueUSD = Number.parseFloat(paymentDetails[i].paymentAmountUSD.replaceAll(",", ""));
        this.totalAmntUsd = this.totalAmntUsd + this.amountValueUSD;
      }
      /* Add data in MatTableDataSource */
      this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
      /* Set Paginator */
      setTimeout(() =>
        this.paymentdataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.paymentdataSource.sort = this.sort
      );
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(paymentDetails, o.columnProp);
      });
      this.paymentdataSource.filterPredicate = this.createFilter();
    });
  }

  sync_flag = true;
  CurrentDate: Date;
  getLastSync() {
    this.sync_flag = false;
    this.CurrentDate = new Date();
  }


  onInputChange(event: MatSliderChange) {
    // console.log("This is emitted as the thumb slides");
     this.paymentdataSource.data = paymentDetails;
     const from = this.minValueMZN;
     this.paymentdataSource.data = this.paymentdataSource.data.filter(e => e.paymentAmountMZN >= from && e.paymentAmountMZN <= event.value);
     this.totalRows = this.paymentdataSource.data.length;
     // console.log("data ",this.paymentdataSource.data)
     this.totalAmntMZN=0;
     this.totalAmntUsd=0;
     /* The below loop is for to find all total amount and total usd amount  summation */
     for (let i = 0; i < this.paymentdataSource.data.length; i++) {
      this.amountValueMZN=Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",",""));
      this.totalAmntMZN=this.totalAmntMZN+this.amountValueMZN;
      this.amountValueUSD=Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",",""));
      this.totalAmntUsd=this.totalAmntUsd+this.amountValueUSD;
     }
   }
   onInputChange1(event: MatSliderChange){
 //console.log("This is emitted as the thumb slides");
 this.paymentdataSource.data = paymentDetails;
 const from = this.minValueMZN;
 this.paymentdataSource.data = this.paymentdataSource.data.filter(e => Number.parseFloat(e.paymentAmountUSD) >= from && Number.parseFloat(e.paymentAmountUSD) <= event.value);
 this.totalRows = this.paymentdataSource.data.length;
 this.totalAmntMZN=0;
 this.totalAmntUsd=0;
 /* The below loop is for to find all total amount and total usd amount summation */
 for (let i = 0; i < this.paymentdataSource.data.length; i++) {
  this.amountValueMZN=Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountMZN.replaceAll(",",""));
      this.totalAmntMZN=this.totalAmntMZN+this.amountValueMZN;
      this.amountValueUSD=Number.parseFloat(this.paymentdataSource.filteredData[i].paymentAmountUSD.replaceAll(",",""));
      this.totalAmntUsd=this.totalAmntUsd+this.amountValueUSD;
 }
   }
  resetFilters(){
    this.minValueMZN= 0;
    this.minValue=0;
  this.getPaymentDetails();
  }

  optionsMZN: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            return '<b>Min Amount : </b>' + value;
          }
        case LabelType.High:
          {
            max = value;
            return '<b>Max Amount : </b>' + value;
          }
        default:
          return 'Filter Amount (MZN)';
      }

    }
  };

  optionsUSD: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            return '<b>Min Amount : </b>' + value;
          }
        case LabelType.High:
          {
            max = value;
            return '<b>Max Amount : </b>' + value;
          }
        default:
          return 'Filter Amount (USD)';
      }

    }
  };
  getAmtMzn() {
    this.paymentdataSource.data = paymentDetails;
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    this.paymentdataSource.data = this.paymentdataSource.data.filter(e => e.paymentAmountMZN >= from && e.paymentAmountMZN <= to);
    this.totalRows = this.paymentdataSource.data.length;
  }

  getAmtUsd() {
    this.paymentdataSource.data = paymentDetails;
    const from = this.minValue;
    const to = this.maxValue;
    this.paymentdataSource.data = this.paymentdataSource.data.filter(e => e.paymentAmountUSD >= from && e.paymentAmountUSD <= to);
    this.totalRows = this.paymentdataSource.data.length;
  }
  displayType = SelectType.multiple;
  ids: number[] = [];
  selection = new SelectionModel<PaymentCrudService>(true, []);

  selectHandler(row: PaymentCrudService) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.payment_id);
    } else {
      let index = this.ids.indexOf(row.payment_id, 0);
      this.ids.splice(index, 1);
    }
  }

  publish() {
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
          this.paymentCrud.publishById(this.ids).subscribe(data => {
            paymentDetails = data;
            /* Add data in MatTableDataSource */
            this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
  
            /* Set Paginator */
            setTimeout(() =>
              this.paymentdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.paymentdataSource.sort = this.sort
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
  discard() {
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
          this.paymentCrud.discardById(this.ids).subscribe(data => {
            paymentDetails = data;
            /* Add data in MatTableDataSource */
            this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
  
            /* Set Paginator */
            setTimeout(() =>
              this.paymentdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.paymentdataSource.sort = this.sort
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

}
let paymentDetails: PaymentCrudService[] = [];

export enum SelectType {
  single,
  multiple
}