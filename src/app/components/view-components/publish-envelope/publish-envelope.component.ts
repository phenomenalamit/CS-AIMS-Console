import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, first, map, pairwise, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from '../../../Service/excel.service';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';

import { EnvelopeComponent } from '../../main-components/envelope/envelope.component';

import { DOCUMENT } from '@angular/common';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
// import * as xlsx from 'xlsx';
//import { Options,LabelType } from 'ng5-slider';
import { Options, LabelType } from "@angular-slider/ngx-slider";
// import { Options, LabelType } from 'ng5-slider';
import { MatDialog } from '@angular/material/dialog';
import { ViewTableModalEnvelopeComponent }  from '../../view-more-components/view-table-modal-envelope/view-table-modal-envelope.component';
import { EnvelopeDocumentViewComponent } from '../../document-repository/view-document/envelope-document-view/envelope-document-view.component';
import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import {environment} from 'src/environments/environment';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { MatSliderChange } from '@angular/material/slider';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { EnvelopeModal } from 'src/app/model/envelopeModal';

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
  selector: 'app-publish-envelope',
  templateUrl: './publish-envelope.component.html',
  styleUrls: ['./publish-envelope.component.css']
})
export class PublishEnvelopeComponent implements OnInit {


  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  authorised_flag=false;
  displayedColumns: string[] = ['edit', 'envRef','partner', 'purdaccrs',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];
  displayedColumnsReadOnly: string[] = ['viewmore', 'partner', 'purdaccrs', 'year',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];

  displayedColumnsReadUpdate: string[] = ['position', 'partner', 'purdaccrs', 'year',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti', 'comments', 'edit', 'viewmore'];
  filterValues = {};
  dataSource = null;
  filterSelectObj = [];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  myControl = new FormControl();
  chosenYearDate!: Date;
  rangeValues: number[] = [0, 2000];
  usergroup: any;
  evelopeDetails: EnvelopeServiceClass[] = [];
  datasourcee: MatTableDataSource<EnvelopeServiceClass>;
  envelopedataSource = null;
  elements!: NodeListOf<Element>;
  filterData = [];
  package: any;
  min=0;
  totalAmnt: any;
  totalAmntUsd: any;
  totalAmntFilter: any = 0;
  amnt_flag = false;
  userNameForNotification:string="Charlie Adams"; //This field will be softcoded later.
  userGroupForNotification:string="DNGDP Admin"; //This field will be softcoded later.
  value: number = 40;
  highValue: number = 60;
  // options: Options = {
  //   floor: 0,
  //   ceil: 100
  // };
  
  constructor( @Inject(DOCUMENT) private _document: HTMLDocument, private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location,
   private envelopeService: EnvelopeServiceService,private notificationService:NotificationService) {
    /* Table Heading Name */
    this.displayedColumns = ['edit','envRef', 'partner', 'purdaccrs', 'year',
      'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];
    /* Filter Names */
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
      this.filterSelectObj = [
        {
          name: 'Funding Organization',
          columnProp: 'fundingOrg',
          options: []
        }, {
          name: 'DAC-CRS Sector',
          columnProp: 'purposeDacCrs',
          options: []
        }, {
          name: 'CURRENCY',
          columnProp: 'currency',
          options: []
        }, {
          name: 'YEAR',
          columnProp: 'year',
          options: []
        },
      ]
    }else {
      this.filterSelectObj = [
        {
          name: 'Organização financiadora',
          columnProp: 'fundingOrg',
          options: []
        }, {
          name: 'Sector DAC-CRS',
          columnProp: 'purposeDacCrsPt',
          options: []
        }, {
          name:'MOEDA',
          columnProp: 'currency',
          options: []
        }, {
          name: 'ANO',
          columnProp: 'year',
          options: []
        },
      ]
    }
    
  }

  minValue: number = 1000;
  maxValue: number = 6000;

  minValueMZN: number = 1000;
  maxValueMZN: number = 6000;
  minAmount: any = [];

  totalRows: any;
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
            if(this.browserLang == 'en'){
              return '<b>Min Amount : </b> MZN' + value;
            }else{
              return '<b>Montante mínimo : </b> MZN' + value;
            }
            
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang == 'en'){
            return '<b>Max Amount : </b> MZN' + value;
            }else{
              return '<b>Montante máximo : </b> MZN' + value;
            }
          }
        default:
          if(this.browserLang == 'en'){
          return 'Filter Amount (MZN)';
          }else{
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
            if(this.browserLang == 'en'){
            return '<b>Min Amount : </b> $' + value;
            }else{
              return '<b>Montante mínimo : </b> $' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang == 'en'){
            return '<b>Max Amount : </b> $' + value;
            }else{
              return '<b>Montante máximo : </b> $' + value;
            }
          }
        default:
          if(this.browserLang == 'en'){
          return 'Filter Amount (USD)';
          }else{
            return 'Filtrar montante (USD)';
          }
      }

    }
  };



  

  /* If we move the amount usd slider then here we get filter data */
  getRange() {
    console.log("max:" + this.maxValue);
    console.log("main:" + this.minValue);
    this.totalRows =0;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.envelopedataSource.data = this.draftedEnvelopeDetails;
    const from = this.minValue;
    const to = this.maxValue;
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e => Number.parseFloat(e.usdAmount) >= this.minValue && Number.parseFloat(e.usdAmount) <= this.maxValue);
    this.totalRows = this.envelopedataSource.data.length;
   
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.filteredData[i].amount;
      this.totalAmntUsd = this.totalAmntUsd + Number.parseFloat(this.envelopedataSource.filteredData[i].usdAmount);
    }
  }

/* If we move the amount slider then here we get filter data */
  getRangeForMZN() {
    this.totalRows =0;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.envelopedataSource.data = this.draftedEnvelopeDetails;
    //console.log("this.draftedEnvelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e =>  Number.parseFloat(e.amount) >= from &&  Number.parseFloat( e.amount) <= to);
    this.totalRows = this.envelopedataSource.data.length;
    
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.filteredData[i].amount;
      this.totalAmntUsd = this.totalAmntUsd + Number.parseFloat(this.envelopedataSource.filteredData[i].usdAmount);
    }
  }

  formatLabel(value: number) {
    console.log("value:"+value);
    //this.envelopedataSource.data = this.draftedEnvelopeDetails;
    console.log("this.envelopedataSource.data:"+this.draftedEnvelopeDetails);
    // const from = this.minValueMZN;
    // this.envelopedataSource.data = this.envelopedataSource.data.filter(e => e.amount >= from && e.amount <= value);
    // this.totalRows = this.envelopedataSource.data.length;
    // if (value >= 1000) {
    //   return Math.round(value / 1000) + 'k';
    // }

    return value;
  }


  onInputChange(event: MatSliderChange) {
   // console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.envelopedataSource.data = this.draftedEnvelopeDetails;
    const from = this.minValueMZN;
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e =>  Number.parseFloat(e.amount) >= from &&  Number.parseFloat(e.amount) <= event.value);
    this.totalRows = this.envelopedataSource.data.length;
    // console.log("data ",this.envelopedataSource.data)
    this.totalAmnt=0;
    this.totalAmntUsd=0;
    /* The below loop is for to find all total amount and total usd amount  summation */
    for (let i = 0; i < this.envelopedataSource.data.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.data[i].amount;
      this.totalAmntUsd = this.totalAmnt + this.envelopedataSource.data[i].usdAmount;
    }
  }

  onInputChange1(event: MatSliderChange) {
    //console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.envelopedataSource.data = this.draftedEnvelopeDetails;
    const from = this.minValueMZN;
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e => Number.parseFloat(e.usdAmount) >= from && Number.parseFloat(e.usdAmount) <= event.value);
    this.totalRows = this.envelopedataSource.data.length;
    this.totalAmnt=0;
    this.totalAmntUsd=0;
    /* The below loop is for to find all total amount and total usd amount summation */
    for (let i = 0; i < this.envelopedataSource.data.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.data[i].amount;
      this.totalAmntUsd = this.totalAmnt + this.envelopedataSource.data[i].usdAmount;
    }
  }
  browserLang: any;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    /* Here we can get which usergroup is login */
    this.usergroup = localStorage.getItem('usergroup');
    this.browserLang = localStorage.getItem("browserLang");
    this.setToAuthFlag();
    this.setToUserPermission();

    // this.filterSelectObj.filter((o) => {
    //   o.options = this.getFilterObject(ELEMENT_DATA, o.columnProp);
    // });

    // this.dataSource.filterPredicate = this.createFilter();

    /* purpose of call this method is to fetch all envelope data */
    this.fetchEnvelopeData();

  }


  /* This is for filter data that will be present in db */
  filterChange(filter, event) {
    this.amnt_flag = true;
    
    this.filterValues[filter.columnProp] = event.value
    // this.dataSource.filter = JSON.stringify(this.filterValues)
    this.envelopedataSource.filter = JSON.stringify(this.filterValues);
    //console.log("filter values ",this.dataSource.filteredData.length)
    console.log("env filter values ", this.envelopedataSource.filter)
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.totalRows=0;
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt +  Number.parseFloat(this.envelopedataSource.filteredData[i].amount);
      this.totalAmntUsd = this.totalAmntUsd + Number.parseFloat(this.envelopedataSource.filteredData[i].usdAmount);
    }
    this.totalRows=this.envelopedataSource.filteredData.length;
    
  }

  partner=[];
  purdaccrs=[];
   year=[];
   exchangerateUsd=[];

// Custom filter method fot Angular Material Datatable
// createFilter() {

//   let filterFunction =  (data: any, filter: string): boolean => {
//   let searchTerms = JSON.parse(filter);
//   let isFilterSet = false;
//   for (const col in searchTerms) {
//       if (searchTerms[col].toString() !== '') {
//       isFilterSet = true;
//       } else {
//       delete searchTerms[col];
//       this.filterSelectObj.filter((o) => {
//       o.options = this.getFilterObject(this.draftedEnvelopeDetails, o.columnProp);
//     });
//       }
//   }
  
//   let nameSearch = () => {
//       let found = false;
//       let checkIn = 0;
//         let total = 0;
//       if (isFilterSet) {
//       for (const col in searchTerms) {
//         total++;
//         ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
//           this.purdaccrs=[];
//           this.year=[];
//           this.exchangerateUsd=[];
//           this.partner=[];
//             let spl = word.split(",");
//             for(let i=0;i<spl.length;i++)
//             {
//                /* adding Running filter start */
//                this.browserLang = localStorage.getItem("browserLang");

//               for (let j = 0; j < this.draftedEnvelopeDetails.length; j++) {
              
//                 if (col == 'fundingOrg') {
//                   if(this.draftedEnvelopeDetails[j].fundingOrg != null){
//                     if (spl[i].toLowerCase() == (this.draftedEnvelopeDetails[j].fundingOrgList.names).toString().toLowerCase()) {
//                       if(this.draftedEnvelopeDetails[j].purposeDacCrs !=""){
//                         if(this.browserLang=='en'){
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrs);
//                         }else{
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrsPt);
//                         }
                        
//                       }
//                       this.year.push(this.draftedEnvelopeDetails[j].year);
//                       this.exchangerateUsd.push(this.draftedEnvelopeDetails[j].currency);
//                     }
//                   }
                 
//                 }else if(col == 'year'){
//                   if(this.draftedEnvelopeDetails[j].year !=null){
//                     if (spl[i].toLowerCase() == (this.draftedEnvelopeDetails[j].envelopeAllTableData[j].startYear).toString().toLowerCase()) {
//                       if(this.draftedEnvelopeDetails[j].purposeDacCrs !=""){
//                         if(this.browserLang=='en'){
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrs);
//                         }else{
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrsPt);
//                         }
//                       }
//                       this.partner.push(this.draftedEnvelopeDetails[j].fundingOrg);
//                       this.exchangerateUsd.push(this.draftedEnvelopeDetails[j].currency);
//                     }
//                   }
                  
//                 }else if(col == 'purposeDacCrs' || col == 'purposeDacCrsPt'){
//                   if(this.draftedEnvelopeDetails[j].purposeDacCrs !=null){
//                     if (spl[i].toLowerCase() == (this.draftedEnvelopeDetails[j].envelopeAllTableData[j].purposeCode.name_EN).toString().toLowerCase()) {
//                       this.year.push(this.draftedEnvelopeDetails[j].year);
//                       this.partner.push(this.draftedEnvelopeDetails[j].fundingOrg);
//                       this.exchangerateUsd.push(this.draftedEnvelopeDetails[j].currency);
//                     }
//                   }
                  
//                 }else if(col == 'currency'){
//                   if(this.draftedEnvelopeDetails[j].currency !=null){
//                     if (spl[i].toLowerCase() == (this.draftedEnvelopeDetails[j].currency).toString().toLowerCase()) {
//                       this.year.push(this.draftedEnvelopeDetails[j].year);
//                       this.partner.push(this.draftedEnvelopeDetails[j].fundingOrg);
//                       if(this.draftedEnvelopeDetails[j].purposeDacCrs !=""){
//                         if(this.browserLang=='en'){
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrs);
//                         }else{
//                           this.purdaccrs.push(this.draftedEnvelopeDetails[j].purposeDacCrsPt);
//                         }
//                       }
//                     }
//                   }
                 
//                 }
//               }
//               /* adding Running filter end */
//              if(data[col] !=null){
//               if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
//                 found = true;
//                 checkIn++;
//             }
//           }
            
              
//             }
//           });
//       }
//       this.purdaccrs = [...new Set(this.purdaccrs)];
//       this.year = [...new Set(this.year)];
//      this.exchangerateUsd = [...new Set(this.exchangerateUsd)];
//      this.partner=[...new Set(this.partner)];

//      if(this.partner.length !=0){
//       this.filterSelectObj.filter((o) => {
//         if (o.columnProp == 'fundingOrg') {
//           o.options = this.partner, 'fundingOrg';
         
//         }
//       });
//     }
//       if(this.purdaccrs.length !=0){
//           this.filterSelectObj.filter((o) => {
//             if(this.browserLang== 'en'){
//               if (o.columnProp == 'purposeDacCrs') {
//                 o.options = this.purdaccrs, 'purposeDacCrs';
//               }
//             }else{
//               if (o.columnProp == 'purposeDacCrsPt') {
//                 o.options = this.purdaccrs, 'purposeDacCrsPt';
//               }
//             }
            
//           });
//         }
//   if(this.year.length !=0){
//         this.filterSelectObj.filter((o) => {
//           if (o.columnProp == 'year') {
//             o.options = this.year, 'year';
//           }
//         });
//       }
//       if(this.exchangerateUsd.length !=0){
//         this.filterSelectObj.filter((o) => {
//           if (o.columnProp == 'currency') {
//             o.options = this.exchangerateUsd, 'currency';
//           }
//         });
//       }
//       return (checkIn == total);
//       } else {
//       return true;
//       }
//   }
//   return nameSearch()
//   }
//   return filterFunction
// }


  /* Reset table filters */
  resetFilters() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    //this.fetchMonitoringData();
  }

  /* Get Unique values from columns to build filter */
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      
      if (!uniqChk.includes(obj[key])) {

         if (obj[key] != "") {
          uniqChk.push(obj[key]);
         }
      }
      return obj;
    });
//     uniqChk.sort(function (a, b) {
//  /* using String.prototype.localCompare() */
//       return a.localeCompare(b);
//     });
//     if (key === 'envagrcurr' || key === 'amtannenvmeti') {
//       uniqChk.sort(function (a, b) {
//         return a - b;
//       });
//     }
    return uniqChk;
  }

  /* If we type something for filter then here the data will filter */
  applyFilter(filterValue: string) {
    this.envelopedataSource.filter = filterValue.trim().toLowerCase();
    console.log("filter data",this.envelopedataSource);
    if (this.envelopedataSource.paginator) {
      this.envelopedataSource.paginator.firstPage();
      this.totalRows=this.envelopedataSource.filteredData.length;
      this.totalAmntUsd = 0;
    this.totalAmnt = 0;
    /* The below loop is for to find all total amount summation */
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.filteredData[i].amount;
      this.totalAmntUsd=this.totalAmntUsd+ this.envelopedataSource.filteredData[i].usdAmount;
    }
    }
    
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Envelope List')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Envelope List'){
        this.authorised_flag=true;
      }
    }
  }


  /* This is export an excel */
  public ExportTOExcel() {
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Envelope');
    //this.excelService.exportTableElmToExcel(this.epltable, 'Envelope');
  }

  /* This is for view more */
  viewMoreEnvelope(envelopeTableId: any) {
    // localStorage.setItem("ViewMoreEnv", "ViewMoreEnv");
    this.router.navigateByUrl('/').then(() =>
      this.router.navigate(['/admin/view-envelope', envelopeTableId]));
  }

  /* This is for to download excel file */
  generateExcel() {

  window.open(environment.envelopeExcelUrl,'_self')

    //console.log("this.epltable.nativeElement:"+this.epltable.nativeElement);
   // let obj = new ViewEnvelopeComponentComponent( this._document, this.excelService, this.router, this.dialog, this.location, this.envelopeService);
    // this.resetFilters();
    // setTimeout(() => {
    //   obj.ExportTOExcel();
    // }, 5000);

  }

  //for notification alert, execute on delete disbursement
  saveEnvelopeDeleteAlert(id:number){
    let todayTime=new Date();
    let envName=this.findEnvRefById(id);
    let fundName=this.findFundRefById(id);
    //let notificationDetails:Notification=new Notification();
    // notificationDetails.notificationGroup=this.userGroupForNotification;
    // notificationDetails.updatedBy=this.userNameForNotification;
    // notificationDetails.notificationMsg=this.userNameForNotification+" has delete envelope on "+(todayTime+'').substring(0,24);
    // notificationDetails.updatedOn=todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Envelope Reference ID "'
      +envName
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Envelope Reference ID "'
      +envName
      +'" for Funding Organization "'
      +fundName
      +'" has been deleted by user "'+this.userNameForNotification+'" in AIMS on "'
    +((todayTime+'').substring(0, 24));

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
  }

  //for notification alert
  private findEnvRefById(id:number):string{
    let envName:string=null;
    for(let i=0;i<this.draftedEnvelopeDetails.length;i++){
      if(this.draftedEnvelopeDetails[i].envelopeTableId==id){
        envName=this.draftedEnvelopeDetails[i].envelopeReference;
      }
    }
    return envName;
  }

  //for notification alert
  private findFundRefById(id:number):string{
    let fundingName:string=null;
    for(let i=0;i<this.draftedEnvelopeDetails.length;i++){
      if(this.draftedEnvelopeDetails[i].envelopeTableId==id){
        fundingName=this.draftedEnvelopeDetails[i].fundingOrg;
      }
    }
    return fundingName;
  }

  /* This for move to previous page */
  moveToSelectedTab1(tabName: string) {
    this.location.back();
  }

  /* This is for go to edit page */
  moveToSelectedTab(envelopeId: any) {
    // localStorage.setItem("EditEnv", "EditEnv");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-envelope', envelopeId]));
  }

  /* If we click on delete button then it gives an alert */
  opensweetalertDelete(envelopeTableId: any) {
    Swal.fire({
      /* Whenever we click on delete button then it will give two more button i.e. delete and cancel */
      title: 'Do you want to delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Delete`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* If we click on delete button then by given id that record will deleted*/
      if (result.isConfirmed) {
        /* Here we call service to delete data from db by given id */
        this.envelopeService.deleteEnvelope(envelopeTableId).subscribe(data => {
        //   this.draftedEnvelopeDetails = data;
        //   this.envelopedataSource = new MatTableDataSource<EnvelopeServiceClass>(this.draftedEnvelopeDetails);
        //   this.totalRows = this.draftedEnvelopeDetails.length;
        //   this.totalAmntUsd = 0;
        //   this.totalAmnt = 0;
        //   for (let i = 0; i < this.draftedEnvelopeDetails.length; i++) {
        //     this.totalAmnt = this.totalAmnt + this.draftedEnvelopeDetails[i].amount;
        //    this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(this.draftedEnvelopeDetails[i].usdAmount) ;
        //   }
        //   setTimeout(() =>
        //     this.envelopedataSource.paginator = this.paginator
        //   );
        //   setTimeout(() =>
        //     this.envelopedataSource.sort = this.sort
        //   );
        this.fetchEnvelopeData();
         });
        Swal.fire('Deleted Successfully!', '', 'success');
        this.saveEnvelopeDeleteAlert(envelopeTableId);
      }
      /* If we click on Cancel button then no record will be deleted */
      else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    });
  }

  /* This is for open document modal */
  openDocumentDialog() {
    const dialogRef = this.dialog.open(EnvelopeDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-envelope']);
    });
  }

  draftedEnvelopeDetails:EnvelopeModal[] = [];
  /* Here we can fetch all envelope data by calling servie */
  private fetchEnvelopeData() {
    this.envelopeService.getDraftedEnvelope().subscribe(data => {
      this.draftedEnvelopeDetails = data;
      console.log("data in fetch Evenlope data:",data);
      this.totalRows = this.draftedEnvelopeDetails.length;
      /* Add data in MatTableDataSource */
      this.envelopedataSource = new MatTableDataSource<EnvelopeModal>(this.draftedEnvelopeDetails);
      this.browserLang = localStorage.getItem("browserLang");
      /* Set Paginator */
      setTimeout(() =>
        this.envelopedataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.envelopedataSource.sort = this.sort
      );
      this.totalAmntUsd = 0;
      this.totalAmnt = 0;
      /* The below loop is for to find all total amount summation */
      for (let i = 0; i < this.draftedEnvelopeDetails.length; i++) {
        this.totalAmnt = this.totalAmnt + this.draftedEnvelopeDetails[i].amount;
       this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(this.draftedEnvelopeDetails[i].usdAmount) ;
      }
      /* Here we push all amount in an array */
      for (let i = 0; i < this.draftedEnvelopeDetails.length; i++) {
        this.minAmount.push(this.draftedEnvelopeDetails[i].amount)
        if(this.draftedEnvelopeDetails[i].purposeDacCrs !=""){
          this.purdaccrs.push(this.draftedEnvelopeDetails[i].purposeDacCrs)
        }
        
        this.partner.push(this.draftedEnvelopeDetails[i].fundingOrg)
        this.year.push(this.draftedEnvelopeDetails[i].year)
        this.exchangerateUsd.push(this.draftedEnvelopeDetails[i].currency)
      }
        
      
      this.purdaccrs = [...new Set(this.purdaccrs)];
        this.year = [...new Set(this.year)];
       this.exchangerateUsd = [...new Set(this.exchangerateUsd)];
       this.partner=[...new Set(this.partner)];
      // /* Find minimum amount */
      // this.minValueMZN = this.minAmount.reduce((a, b) => Math.min(a, b));
      // /* Find maximum amount */
      // this.maxValueMZN = this.minAmount.reduce((a, b) => Math.max(a, b));

      /* This is for to find filter options */
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.draftedEnvelopeDetails, o.columnProp);
      });
      // this.envelopedataSource.filterPredicate = this.createFilter();
    });

    
  }

  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
    
  }

  // chkValue(filter) {
  //   var searchFilterVal = this.searchFilter.value;
  //   let columnName = filter.columnProp;
  //   let partner=[];
  //   let purdaccrs=[];
  //   let year=[];
  //   let exchangerateUsd=[];
  //   this.browserLang = localStorage.getItem("browserLang");
  //   // return nothing if empty value in input
  //   if (searchFilterVal !== "") {
  //     for (var i = 0; i < this.draftedEnvelopeDetails.length; i++) {
       
  //       if (columnName == 'fundingOrg') {
  //         if(this.partner.length ==0){
  //         if (((this.draftedEnvelopeDetails[i].fundingOrg).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //           partner.push(this.draftedEnvelopeDetails[i].fundingOrg);
  //         }
  //       }else if(this.partner.length !=0){
  //         if(this.partner[i] !=undefined)  {
  //         if (((this.partner[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //           partner.push(this.partner[i]);
  //         }
  //       }
  //       } 
            
  //     }else if (columnName == 'purposeDacCrs' || columnName == 'purposeDacCrsPt') {
  //       if(this.purdaccrs.length ==0){
  //         if (((this.draftedEnvelopeDetails[i].purposeDacCrs).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //          if(this.browserLang=='en'){
  //           purdaccrs.push(this.draftedEnvelopeDetails[i].purposeDacCrs);
  //          }else{
  //           purdaccrs.push(this.draftedEnvelopeDetails[i].purposeDacCrsPt);
  //          }
            
  //         }
  //       }else if(this.purdaccrs.length !=0){
  //         if(this.purdaccrs[i] !=undefined)  {
  //         if (((this.purdaccrs[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //           purdaccrs.push(this.purdaccrs[i]);
  //         }
  //       }
  //     }
  //       }else if (columnName == 'year') {
  //         if(this.year.length ==0){
  //         if (((this.draftedEnvelopeDetails[i].year).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //           year.push(this.draftedEnvelopeDetails[i].year);
  //         } }
  //         else if(this.year.length !=0){
  //           if(this.year[i] !=undefined)  {
  //           if (((this.year[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //             year.push(this.year[i]);
           
  //         }
  //       }
  //       }
  //       }else if (columnName == 'currency') {
  //         if(this.exchangerateUsd.length ==0){
  //         if (((this.draftedEnvelopeDetails[i].currency).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //           exchangerateUsd.push(this.draftedEnvelopeDetails[i].currency);
  //         }
  //         }
  //         else if(this.exchangerateUsd.length !=0){
  //           if(this.exchangerateUsd[i] !=undefined)  {
  //           if (((this.exchangerateUsd[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
  //             exchangerateUsd.push(this.exchangerateUsd[i]);
           
  //         }
  //       }
  //       }
  //       }
  //     }
  //   }if (columnName == 'fundingOrg') {
  //     partner = [...new Set(partner)];
  //     this.filterSelectObj.filter((o) => {
  //       if (o.columnProp == 'fundingOrg') {
  //         o.options = partner, 'fundingOrg';
         
  //       }
  //     });
  //   } if(columnName == 'purposeDacCrs' || columnName == 'purposeDacCrsPt') {
  //     purdaccrs = [...new Set(purdaccrs)];
  //     this.filterSelectObj.filter((o) => {
  //       if(this.browserLang == 'en'){
  //         if (o.columnProp == 'purposeDacCrs') {
  //           o.options = purdaccrs, 'purposeDacCrs';
  //         }
  //       }else{
  //         if (o.columnProp == 'purposeDacCrsPt') {
  //           o.options = purdaccrs, 'purposeDacCrsPt';
  //         }
  //       }
        
  //     });
  //   }if(columnName == 'year') {
  //     year = [...new Set(year)];
  //     this.filterSelectObj.filter((o) => {
  //       if (o.columnProp == 'year') {
  //         o.options = year, 'year';
  //       }
  //     });
  //   } if(columnName == 'currency') {
  //     exchangerateUsd = [...new Set(exchangerateUsd)];
  //     this.filterSelectObj.filter((o) => {
  //       if (o.columnProp == 'currency') {
  //         o.options = exchangerateUsd, 'currency';
  //       }
  //     });
  //   }
  //   debugger
  //   if (searchFilterVal.length == 0 && columnName== 'fundingOrg' && this.partner.length!=0) {
  //     this.filterSelectObj.filter((o) => {
  //       if(o.columnProp== 'fundingOrg')
  //       o.options = this.partner, 'fundingOrg';
  //     });
  //   }
  //   if ((searchFilterVal.length == 0 && columnName== 'purposeDacCrs' && this.purdaccrs.length!=0) || (searchFilterVal.length == 0 && columnName== 'purposeDacCrsPt' && this.purdaccrs.length!=0)) {
  //     this.filterSelectObj.filter((o) => {
  //       if(this.browserLang =='en'){
  //         if(o.columnProp== 'purposeDacCrs')
  //         o.options = this.purdaccrs, 'purposeDacCrs';
  //       }else{
  //         if(o.columnProp== 'purposeDacCrsPt')
  //       o.options = this.purdaccrs, 'purposeDacCrsPt';
  //       }
        
  //     });
  //   }
  //   if (searchFilterVal.length == 0 && columnName== 'year' && this.year.length!=0) {
  //     this.filterSelectObj.filter((o) => {
  //       if(o.columnProp== 'year')
  //       o.options = this.year, 'year';
  //     });
  //   }
  //   if (searchFilterVal.length == 0 && columnName== 'currency' && this.exchangerateUsd.length!=0) {
  //     this.filterSelectObj.filter((o) => {
  //       if(o.columnProp== 'currency')
  //       o.options = this.exchangerateUsd, 'currency';
  //     });
  //   }
  // }

}