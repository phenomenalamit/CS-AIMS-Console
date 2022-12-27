/**
 * View Payment :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
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
import { PaymentDocumentUploadComponent } from '../../document-repository/upload-document/payment-document-upload/payment-document-upload.component';
import { Project } from 'src/app/Service-Class/project';

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
  selector: 'app-view-payment-component',
  templateUrl: './view-payment-component.component.html',
  styleUrls: ['./view-payment-component.component.css']
})
export class ViewPaymentComponentComponent implements OnInit {

  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  paymentdataSource = new MatTableDataSource<PaymentCrudService>(paymentDetails);
  displayedColumns: string[] = ['select','edit', 'paymentReference', 'stateBudget', 'amount', 'currency', "paymentAmountMZN", "paymentAmountUSD"];
  displayedColumnsReadOnly: string[] = ['PaymentReference', 'financing', 'project', 'UGBMEO', 'MEOResourceSources', 'paymentDate', 'paymentAmount', 'amountofPayment'];
  // dataSource = new MatTableDataSource<PeriodicElement>(paymentDetails);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  usergroup: any;
  userId:number;
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
  browserLang: any;
  constructor(private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location
    , private paymentCrud: PaymentCrudServiceService, private notificationService: NotificationService)
    {
      this.browserLang = localStorage.getItem("browserLang");
      if(this.browserLang == 'en'){
      this.filterSelectObj = [
        {
          name: 'Funding Organization',
          columnProp: 'fundingOrganization',
          options: []
        }
        , {
          name: 'Donor',
          columnProp: 'donor',
          options: []
        } 
        ,{
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
        } 
        ,  {
          name: 'UGB MEO',
          columnProp: 'ugbMEO',
          options: []
        }, {
          name: 'MPO Resource Source',
          columnProp: 'meoResourceSource',
          options: []
        }
      ]
    }else{
      this.filterSelectObj = [
        {
          name: 'Organização Financiadora',
          columnProp: 'fundingOrganization',
          options: []
        }
        , {
          name: 'Doador',
          columnProp: 'Donor',
          options: []
        } 
        ,{
          name: 'Referência do pagamento',
          columnProp: 'paymentReference',
          options: []
        }, {
          name: 'Orçamento do Estado',
          columnProp: 'stateBudget',
          options: []
        }
        ,  {
          name: 'Acordo de Financiamento',
          columnProp: 'fundingDonorTitle',
          options: []
        }
        , {
          name: 'Projecto',
          columnProp: 'projectTitle',
          options: []
        } 
        , {
          name: 'UGB MEO',
          columnProp: 'ugbMEO',
          options: []
        }, {
          name: 'Fonte de Recurso MPO',
          columnProp: 'meoResourceSource',
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
    filterData:any;
    checkedFilterColumn:any={};
    filterChange(filter, event) {

      this.filterValues[filter.columnProp] = event.value
      this.paymentdataSource.filter = JSON.stringify(this.filterValues)

      this.paymentdataSource.paginator = this.paginator;
      this.paymentdataSource.sort = this.sort;
      this.totalAmnt = 0;
      this.totalRows = 0;
      this.totalAmntMZN = 0;
      this.totalAmntUsd = 0;
      this.checkedFilterColumn=this.paymentdataSource.filter;
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

  userEmail:string;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.userEmail=localStorage.getItem('userEmail');
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.setToAuthFlag();
    this.findTotalAmount();
    this.getPaymentDetails();
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
  PaymentReference = [];
  SateBudget = [];
  financing = [];
  project = [];
  UGBMEO = [];
  MEOResourceSources = [];
  donor = [];
  fundingOrganization = [];
  // Custom filter method fot Angular Material Datatable
  createFilter() {

    let filterFunction =  (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
          this.PaymentReference=[];
              this.SateBudget=[];
              this.financing=[];
              this.project=[];
              this.UGBMEO=[];
              this.MEOResourceSources=[];
              this.fundingOrganization=[];
              this.donor=[];
          for(let i=0;i<paymentDetails.length;i++){
            this.PaymentReference.push(paymentDetails[i].paymentReference);
            this.SateBudget.push(paymentDetails[i].stateBudget);
            this.financing.push(paymentDetails[i].fundingDonorTitle);
            this.project.push(paymentDetails[i].projectTitle);
            this.UGBMEO.push(paymentDetails[i].ugbMEO);
            this.MEOResourceSources.push(paymentDetails[i].meoResourceSource);
            this.fundingOrganization.push(paymentDetails[i].fundingOrganization);
            this.donor.push(paymentDetails[i].donor);
          }
          this.SateBudget = [...new Set(this.SateBudget)];
          this.financing = [...new Set(this.financing)];
         this.project = [...new Set(this.project)];
         this.PaymentReference=[...new Set(this.PaymentReference)];
         this.UGBMEO=[...new Set(this.UGBMEO)];
         this.MEOResourceSources=[...new Set(this.MEOResourceSources)];
         this.fundingOrganization=[...new Set(this.fundingOrganization)];
         this.donor=[...new Set(this.donor)];
          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(paymentDetails, o.columnProp);
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
              this.PaymentReference=[];
              this.SateBudget=[];
              this.financing=[];
              this.project=[];
              this.UGBMEO=[];
              this.MEOResourceSources=[];
              this.fundingOrganization=[];
              this.donor=[];
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                /* adding Running filter start */

              for (let j = 0; j < paymentDetails.length; j++) {
                if (col == 'paymentReference') {
                  if (spl[i].toLowerCase() == (paymentDetails[j].paymentReference).toString().toLowerCase()) {
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }else if(col == 'fundingDonorTitle'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].fundingDonorTitle).toString().toLowerCase()) {
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }else if(col == 'stateBudget'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].stateBudget).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }else if(col == 'projectTitle'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].projectTitle).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }
                else if(col == 'ugbMEO'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].ugbMEO).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }
                else if(col == 'MEOResourceSources'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].meoResourceSource).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.donor.push(paymentDetails[j].donor);
                  }
                }
                else if(col == 'fundingOrganization'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].fundingOrganization).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                    this.donor.push(paymentDetails[j].donor);
                }
              }
                else if(col == 'donor'){
                  if (spl[i].toLowerCase() == (paymentDetails[j].fundingOrganization).toString().toLowerCase()) {
                    this.financing.push(paymentDetails[j].fundingDonorTitle);
                    this.PaymentReference.push(paymentDetails[j].paymentReference);
                    this.SateBudget.push(paymentDetails[j].stateBudget);
                    this.UGBMEO.push(paymentDetails[j].ugbMEO);
                    this.project.push(paymentDetails[j].projectTitle);
                    this.fundingOrganization.push(paymentDetails[j].fundingOrganization);
                    this.MEOResourceSources.push(paymentDetails[j].meoResourceSource);
                }
              }
              }
              /* adding Running filter end */
                if(data[col]!=null){
                  if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                    found = true;
                    checkIn++;
                  }
                }

              }

            });
          }
          this.SateBudget = [...new Set(this.SateBudget)];
          this.financing = [...new Set(this.financing)];
          this.project = [...new Set(this.project)];
          this.PaymentReference=[...new Set(this.PaymentReference)];
          this.UGBMEO=[...new Set(this.UGBMEO)];
          this.MEOResourceSources=[...new Set(this.MEOResourceSources)];
          this.fundingOrganization=[...new Set(this.fundingOrganization)];
          this.donor=[...new Set(this.donor)];
     if(this.PaymentReference.length !=0){
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'paymentReference') {
          o.options = this.PaymentReference, 'paymentReference';

        }
      });
    }
      if(this.SateBudget.length !=0){
          this.filterSelectObj.filter((o) => {
            if (o.columnProp == 'stateBudget') {
              o.options = this.SateBudget, 'stateBudget';

            }
          });
        }
  if(this.financing.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'fundingDonorTitle') {
            o.options = this.financing, 'fundingDonorTitle';
          }
        });
      }
      if(this.project.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'projectTitle') {
            o.options = this.project, 'projectTitle';
          }
        });
      }
      if(this.UGBMEO.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'ugbMEO') {
            o.options = this.UGBMEO, 'ugbMEO';
          }
        });
      }
      if(this.MEOResourceSources.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'meoResourceSource') {
            o.options = this.MEOResourceSources, 'meoResourceSource';
          }
        });
      }
      if(this.fundingOrganization.length != 0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'fundingOrganization') {
            o.options = this.fundingOrganization, 'fundingOrganization';
          }
        });
      }
      if(this.donor.length != 0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'donor') {
            o.options = this.donor, 'donor';
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
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Payment');
    //this.excelService.exportTableElmToExcel(this.epltable, 'Payment');
  }


  generateExcel() {
    let envAmntId=[];
for(let i=0;i<this.paymentdataSource.filteredData.length;i++){
  envAmntId.push(this.paymentdataSource.filteredData[i].payment_id)
}
  window.open(environment.paymentExcelUrl+envAmntId+'/'+btoa(this.checkedFilterColumn),'_self')
    // window.open(environment.paymentExcelUrl, '_self')

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
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  opensweetalertDelete() {
    this.getValueByLang();
    if(this.ids.length>0){
      Swal.fire({
        title:(this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
        denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
      }).then((result) => {
  
  
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.paymentCrud.deleteByIds(this.ids,this.browserLang).subscribe(data => {
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
            for(let i=0;i<paymentDetails.length;i++){
              this.PaymentReference.push(paymentDetails[i].paymentReference);
              this.SateBudget.push(paymentDetails[i].stateBudget);
              this.financing.push(paymentDetails[i].fundingDonorTitle);
              this.project.push(paymentDetails[i].projectTitle);
              this.UGBMEO.push(paymentDetails[i].ugbMEO);
              this.MEOResourceSources.push(paymentDetails[i].meoResourceSource);
              this.fundingOrganization.push(paymentDetails[i].fundingOrganization);
              this.donor.push(paymentDetails[i].donor);
            }
            this.SateBudget = [...new Set(this.SateBudget)];
            this.financing = [...new Set(this.financing)];
           this.project = [...new Set(this.project)];
           this.PaymentReference=[...new Set(this.PaymentReference)];
           this.UGBMEO=[...new Set(this.UGBMEO)];
           this.MEOResourceSources=[...new Set(this.MEOResourceSources)];
           this.fundingOrganization=[...new Set(this.fundingOrganization)];
           this.donor=[...new Set(this.donor)];
            this.filterSelectObj.filter((o) => {
              o.options = this.getFilterObject(paymentDetails, o.columnProp);
            });
            this.paymentdataSource.filterPredicate = this.createFilter();
            if(this.browserLang=='en'){
              Swal.fire('Deleted successfully', '', 'success')
            }else{
              Swal.fire('Apagado com sucesso', '', 'success')
            }
          },
            error => console.log(error));
          this.savePaymentDeleteAlert(this.ids);
          // this.moveToSelectedTab;
        } else if (result.isDenied) {
          if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
          this.selection.clear();
        this.ids = [];
        }
      });
    }
    else{
      if(this.browserLang=='en')
      Swal.fire('Select at least one record');
      else
      Swal.fire('Seleccione pelo menos um registo');
    }
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
      // if (this.paymentdataSource.paginator) {
      // console.log("paginator ",this.paymentdataSource.paginator.firstPage())
      // this.paymentdataSource.paginator.firstPage();

      //  }
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

    localStorage.setItem("ViewMorePayment", "ViewMorePayment");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-payment', payment_id]));

  }

  //for notification alert, execute on delete disbursement
  savePaymentDeleteAlert(ids:number[]) {
    let todayTime = new Date();
    let pmtRefNameArr:string[] = [];
    let projectTitelNameArr:string[]=[];
    ids.forEach(id=>{
      let pmtRefName:string = this.findPmtRefById(id);
      pmtRefNameArr.push(pmtRefName);
      let projectTitelName:string=this.findProjTitelById(id);
      projectTitelNameArr.push(projectTitelName);
    });
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.userGroupForNotification;
    // notificationDetails.updatedBy = this.userNameForNotification;
    // notificationDetails.notificationMsg = this.userNameForNotification + " has delete payment on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Payment Reference ID "'
      +pmtRefNameArr
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Payment Reference ID "'
      +pmtRefNameArr
      +'" for Project "'
      +projectTitelNameArr
      +'" has been deleted by user "'+this.userNameForNotification+'" in AIMS on "'
    +((todayTime+'').substring(0, 24))+'" ';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
  }

  //for notification alert
  private findPmtRefById(id:number):string{
    let pmtRefName:string=null;
    for(let i=0;i<paymentDetails.length;i++){
      if(paymentDetails[i].payment_id==id){
        pmtRefName=paymentDetails[i].paymentReference;
      }
    }
    return pmtRefName;
  }

  //for notification alert
  private findProjTitelById(id:number):string{
    let projectTitle:string=null;
    for(let i=0;i<paymentDetails.length;i++){
      if(paymentDetails[i].payment_id==id){
        projectTitle=paymentDetails[i].projectTitle;
      }
    }
    return projectTitle;
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
    // localStorage.setItem('EditPayment',"EditPayment");
    // localStorage.setItem('EditPaymentElement',JSON.stringify(element));
    this.router.navigate(['edit-payment']);
    // const dialogRef = this.dialog.open(DialogboxIndividualComponentsComponent, { disableClose: true });
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

  openDocumentDialog(paymentReferenceName:string) {
    localStorage.setItem('paymentReferenceName',paymentReferenceName)
    const dialogRef = this.dialog.open(PaymentDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-payment']);
    });
  }

  projectTitleList: Project[];
  projectTitles:string[]=[];
  limits:number=0
  loadAllData(){
    this.limits=1;
    this.getPaymentDetails();
      }
  private getPaymentDetails() {
    
    this.paymentCrud.getPaymentDetails(this.limits).toPromise().then(data => {
      this.paymentCrud.getPmtProjectTitleDetailsByUserAccessId(this.userId).toPromise().then(pmtData=>{
        this.projectTitleList = pmtData;
        this.projectTitleList.forEach(projectTitel=>{
          this.projectTitles.push(projectTitel.projectTitle);
        });
        for (let i =0; i< paymentDetails.length; i++) {
          paymentDetails[i].emailChk = false;
          for (let j=0;j<this.projectTitles.length;j++) {
            if (paymentDetails[i].projectTitle == this.projectTitles[j]) {
              paymentDetails[i].emailChk = true;
            }
          }
        }
      });
     
      console.log("return data" + data.length);
      paymentDetails = data;
      console.log("return data" , paymentDetails);
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
      for(let i=0;i<paymentDetails.length;i++){
        this.PaymentReference.push(paymentDetails[i].paymentReference);
        this.SateBudget.push(paymentDetails[i].stateBudget);
        this.financing.push(paymentDetails[i].fundingDonorTitle);
        this.project.push(paymentDetails[i].projectTitle);
        this.UGBMEO.push(paymentDetails[i].ugbMEO);
        this.MEOResourceSources.push(paymentDetails[i].meoResourceSource);
      }
      this.SateBudget = [...new Set(this.SateBudget)];
      this.financing = [...new Set(this.financing)];
     this.project = [...new Set(this.project)];
     this.PaymentReference=[...new Set(this.PaymentReference)];
     this.UGBMEO=[...new Set(this.UGBMEO)];
     this.MEOResourceSources=[...new Set(this.MEOResourceSources)];
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(paymentDetails, o.columnProp);
      });
      this.paymentdataSource.filterPredicate = this.createFilter();
      // console.log("init filter value is:", this.paymentdataSource.filterPredicate)
      // console.log("all data", paymentDetails);
    });
  }

  sync_flag = true;
  CurrentDate: Date;
  getLastSync() {
    this.sync_flag = false;
    this.CurrentDate = new Date();
    this.paymentCrud.getMEXData().subscribe(data => {
      console.log("mex url ")
      
    });
    //  window.location.reload();
  }


  onInputChange(event: MatSliderChange) {
    // console.log("This is emitted as the thumb slides");
     console.log(event.value);
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
 console.log(event.value);
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
  //   this.minValueMZN= 0;
  //   this.minValue=0;
  // this.getPaymentDetails();
  let currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);
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
            if(this.browserLang=='en'){
              return '<b>Min Amount : </b>' + value;
            }else{
              return '<b>Montante mínimo : </b>' + value;
            }

          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang=='en'){
            return '<b>Max Amount : </b>' + value;
            }else{
              return '<b>Montante máximo : </b>' + value;
            }
          }
        default:
          if(this.browserLang=='en'){
          return 'Filter Amount (MZN)';
          }else{
            return 'Filtrar montante (MZN)';
          }
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
            if(this.browserLang=='en'){
            return '<b>Min Amount : </b>' + value;
            }else{
              return '<b>Montante mínimo : </b>' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang=='en'){
            return '<b>Max Amount : </b>' + value;
            }else{
              return '<b>Montante máximo : </b>' + value;
            }
          }
        default:
          if(this.browserLang=='en'){
          return 'Filter Amount (USD)';
          }else{
            return 'Filtrar montante (USD)';
          }
      }

    }
  };
  getAmtMzn() {
    // console.log("max:" + this.maxValueMZN);
    // console.log("main:" + this.minValueMZN);
    // this.dataSource.data = ELEMENT_DATA;
    // const from = this.minValueMZN;
    // const to = this.maxValueMZN;
    // this.dataSource.data = this.dataSource.data.filter(e=>e.envagrcurr >= from && e.envagrcurr <= to ) ;

    //console.log("ELEMENT_DATA:"+ELEMENT_DATA);
    this.paymentdataSource.data = paymentDetails;
    //console.log("envelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    // for(var i=0;i<envelopeDetails.length;i++){
    //   console.log("amount:"+envelopeDetails[i].amount);
    // }
    this.paymentdataSource.data = this.paymentdataSource.data.filter(e => e.paymentAmountMZN >= from && e.paymentAmountMZN <= to);
    this.totalRows = this.paymentdataSource.data.length;
  }

  getAmtUsd() {
    // console.log("max:" + this.maxValueMZN);
    // console.log("main:" + this.minValueMZN);
    // this.dataSource.data = ELEMENT_DATA;
    // const from = this.minValueMZN;
    // const to = this.maxValueMZN;
    // this.dataSource.data = this.dataSource.data.filter(e=>e.envagrcurr >= from && e.envagrcurr <= to ) ;

    //console.log("ELEMENT_DATA:"+ELEMENT_DATA);
    this.paymentdataSource.data = paymentDetails;
    //console.log("envelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValue;
    const to = this.maxValue;
    // for(var i=0;i<envelopeDetails.length;i++){
    //   console.log("amount:"+envelopeDetails[i].amount);
    // }
    this.paymentdataSource.data = this.paymentdataSource.data.filter(e => e.paymentAmountUSD >= from && e.paymentAmountUSD <= to);
    this.totalRows = this.paymentdataSource.data.length;
  }
  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
  }
  chkValue(filter) {

    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let PaymentReference = [];
    let SateBudget = [];
    let financing = [];
    let project = [];
    let UGBMEO = [];
    let MEOResourceSources = [];
    let fundingOrganization = [];
    let donor = [];

    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < paymentDetails.length; i++) {

        if (columnName == 'paymentReference') {
          if(this.PaymentReference.length ==0){
          if (((paymentDetails[i].paymentReference).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            PaymentReference.push(paymentDetails[i].paymentReference);
          }
        }else if(this.PaymentReference.length !=0){
          if(this.PaymentReference[i] !=undefined)  {
          if (((this.PaymentReference[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            PaymentReference.push(this.PaymentReference[i]);
          }
        }
        }

      }else if (columnName == 'stateBudget') {
        if(this.SateBudget.length ==0){
          if (((paymentDetails[i].stateBudget).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {

            SateBudget.push(paymentDetails[i].stateBudget);
          }
        }else if(this.SateBudget.length !=0){
          if(this.SateBudget[i] !=undefined)  {
          if (((this.SateBudget[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            SateBudget.push(this.SateBudget[i]);
          }
        }
      }
        }else if (columnName == 'fundingDonorTitle') {
          if(this.financing.length ==0){
          if (((paymentDetails[i].fundingDonorTitle).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            financing.push(paymentDetails[i].fundingDonorTitle);
          } }
          else if(this.financing.length !=0){
            if(this.financing[i] !=undefined)  {
            if (((this.financing[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              financing.push(this.financing[i]);

          }
        }
        }
        }else if (columnName == 'projectTitle') {
          if(this.project.length ==0){
          if (((paymentDetails[i].projectTitle).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            project.push(paymentDetails[i].projectTitle);
          }
          }
          else if(this.project.length !=0){
            if(this.project[i] !=undefined)  {
            if (((this.project[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              project.push(this.project[i]);

          }
        }
        }
        }else if (columnName == 'ugbMEO') {
          if(this.UGBMEO.length ==0){
          if (((paymentDetails[i].ugbMEO).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            UGBMEO.push(paymentDetails[i].ugbMEO);
          }
          }
          else if(this.UGBMEO.length !=0){
            if(this.UGBMEO[i] !=undefined)  {
            if (((this.UGBMEO[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              UGBMEO.push(this.UGBMEO[i]);

          }
        }
        }
        }else if (columnName == 'meoResourceSource') {
          if(this.MEOResourceSources.length ==0){
          if (((paymentDetails[i].meoResourceSource).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            MEOResourceSources.push(paymentDetails[i].meoResourceSource);
          }
          }
          else if(this.MEOResourceSources.length !=0){
            if(this.MEOResourceSources[i] !=undefined)  {
            if (((this.MEOResourceSources[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              MEOResourceSources.push(this.MEOResourceSources[i]);

          }
        }
        }
        }
        else if (columnName == 'fundingOrganization') {
          if(this.fundingOrganization.length ==0){
          if (((paymentDetails[i].fundingOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            fundingOrganization.push(paymentDetails[i].fundingOrganization);
          }
          }
          else if(this.fundingOrganization.length !=0){
            if(this.fundingOrganization[i] !=undefined)  {
            if (((this.fundingOrganization[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              fundingOrganization.push(this.fundingOrganization[i]);
          }
        }
        }
        }
        else if (columnName == 'donor') {
          if(this.donor.length ==0){
          if (((paymentDetails[i].donor).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            donor.push(paymentDetails[i].donor);
          }
          }
          else if(this.donor.length !=0){
            if(this.donor[i] !=undefined)  {
            if (((this.donor[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              donor.push(this.donor[i]);

          }
        }
        }
        }
      }
    }if (columnName == 'paymentReference') {
      PaymentReference = [...new Set(PaymentReference)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'paymentReference') {
          o.options = PaymentReference, 'paymentReference';

        }
      });
    } if(columnName == 'stateBudget') {
      SateBudget = [...new Set(SateBudget)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'stateBudget') {
          o.options = SateBudget, 'stateBudget';
        }
      });
    }if(columnName == 'fundingDonorTitle') {
      financing = [...new Set(financing)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingDonorTitle') {
          o.options = financing, 'fundingDonorTitle';
        }
      });
    } if(columnName == 'projectTitle') {
      project = [...new Set(project)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'projectTitle') {
          o.options = project, 'projectTitle';
        }
      });
    }
    if(columnName == 'ugbMEO') {
      UGBMEO = [...new Set(UGBMEO)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'ugbMEO') {
          o.options = UGBMEO, 'ugbMEO';
        }
      });
    }
    if(columnName == 'meoResourceSource') {
      MEOResourceSources = [...new Set(project)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'meoResourceSource') {
          o.options = MEOResourceSources, 'meoResourceSource';
        }
      });
    }
    if(columnName == 'fundingOrganization') {
      fundingOrganization = [...new Set(fundingOrganization)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrganization') {
          o.options = fundingOrganization, 'fundingOrganization';
        }
      });
    }
    if(columnName == 'donor') {
      donor = [...new Set(donor)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'donor') {
          o.options = donor, 'donor';
        }
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'paymentReference' && this.PaymentReference.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'paymentReference')
        o.options = this.PaymentReference, 'paymentReference';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'stateBudget' && this.SateBudget.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'stateBudget')
        o.options = this.SateBudget, 'stateBudget';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'fundingDonorTitle' && this.financing.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'fundingDonorTitle')
        o.options = this.financing, 'fundingDonorTitle';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'projectTitle' && this.project.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'projectTitle')
        o.options = this.project, 'projectTitle';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'ugbMEO' && this.UGBMEO.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'ugbMEO')
        o.options = this.UGBMEO, 'ugbMEO';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'meoResourceSource' && this.MEOResourceSources.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'meoResourceSource')
        o.options = this.MEOResourceSources, 'meoResourceSource';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'fundingOrganization' && this.fundingOrganization.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'fundingOrganization')
        o.options = this.fundingOrganization, 'fundingOrganization';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'donor' && this.donor.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'donor')
        o.options = this.donor, 'donor';
      });
    }
  }

  selection = new SelectionModel<PaymentCrudService>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

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
  openDialog2(paymentReference:string) {
localStorage.setItem('paymentReference',paymentReference);
    const dialogRef = this.dialog.open(PaymentDocumentUploadComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['payment']);
      console.log(`Dialog result: ${result}`);
    });
  
  }
}
let paymentDetails: PaymentCrudService[] = [];

export enum SelectType {
  single,
  multiple
}





