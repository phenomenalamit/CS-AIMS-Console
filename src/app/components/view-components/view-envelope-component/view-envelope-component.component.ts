// This business logic TS file used for View envelope html
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
import { ViewTableModalEnvelopeComponent } from '../../view-more-components/view-table-modal-envelope/view-table-modal-envelope.component';
import { EnvelopeDocumentViewComponent } from '../../document-repository/view-document/envelope-document-view/envelope-document-view.component';
import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { MatSliderChange } from '@angular/material/slider';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EnvelopeDocumentUploadComponent } from '../../document-repository/upload-document/envelope-document-upload/envelope-document-upload.component';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';

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
  selector: 'app-view-envelope-component',
  templateUrl: './view-envelope-component.component.html',
  styleUrls: ['./view-envelope-component.component.css']
})

export class ViewEnvelopeComponentComponent implements OnInit {
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  authorised_flag = false;
  displayedColumns: string[] = ['select', 'edit', 'envRef', 'partner', 'purdaccrs',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];
  displayedColumnsReadOnly: string[] = ['viewmore', 'partner', 'purdaccrs', 'year',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];

  displayedColumnsReadUpdate: string[] = ['position', 'partner', 'purdaccrs', 'year',
    'envagrcurr', 'exchangerateUsd', 'amtannenvmeti', 'comments', 'edit', 'viewmore'];
  filterValues = {};
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  filterSelectObj = [];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  myControl = new FormControl();
  chosenYearDate!: Date;
  rangeValues: number[] = [0, 2000];
  usergroup: any;
  userId:number;
  evelopeDetails: EnvelopeServiceClass[] = [];
  datasourcee: MatTableDataSource<EnvelopeServiceClass>;
  envelopedataSource = new MatTableDataSource<EnvelopeServiceClass>(envelopeDetails);
  elements!: NodeListOf<Element>;
  filterData = [];
  package: any;
  min = 0;
  totalAmnt: any;
  totalAmntUsd: any;
  totalAmntFilter: any = 0;
  amnt_flag = false;
  userNameForNotification: string = "Charlie Adams"; //This field will be softcoded later.
  userGroupForNotification: string = "DNGDP Admin"; //This field will be softcoded later.
  value: number = 40;
  highValue: number = 60;
  // options: Options = {
  //   floor: 0,
  //   ceil: 100
  // };

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument, private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location,
    private envelopeService: EnvelopeServiceService, private notificationService: NotificationService) {
    /* Table Heading Name */
    this.displayedColumns = ['select', 'edit', 'envRef', 'partner', 'purdaccrs', 'year', 'endYear',
      'envagrcurr', 'exchangerateUsd', 'amtannenvmeti'];
    /* Filter Names */
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang == 'en') {
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
    } else {
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
          name: 'MOEDA',
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
  maxValue: number = 6000000000;

  minValueMZN: number = 1000;
  maxValueMZN: number = 600000000000;
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
            if (this.browserLang == 'en') {
              return '<b>Min Amount (MZN) : </b> ' + value;
            } else {
              return '<b>Montante mínimo (MZN) : </b> ' + value;
            }

          }
        case LabelType.High:
          {
            max = value;
            if (this.browserLang == 'en') {
              return '<b>Max Amount (MZN) : </b> ' + value;
            } else {
              return '<b>Montante máximo (MZN) : </b> ' + value;
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
              return '<b>Min Amount (USD) : </b> ' + value;
            } else {
              return '<b>Montante mínimo (USD) : </b> ' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
            if (this.browserLang == 'en') {
              return '<b>Max Amount (USD) : </b> ' + value;
            } else {
              return '<b>Montante máximo (USD) : </b> ' + value;
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





  /* If we move the amount usd slider then here we get filter data */
  getRange() {
    console.log("max:" + this.maxValue);
    console.log("main:" + this.minValue);
    this.totalRows = 0;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.envelopedataSource.data = envelopeDetails;
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
    this.totalRows = 0;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.envelopedataSource.data = envelopeDetails;
    //console.log("envelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValueMZN;
    const to = this.maxValueMZN;

    this.envelopedataSource.data = this.envelopedataSource.data.filter(e => Number.parseFloat(e.amount) >= from && Number.parseFloat(e.amount) <= to);
    this.totalRows = this.envelopedataSource.data.length;

    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.filteredData[i].amount;
      this.totalAmntUsd = this.totalAmntUsd + Number.parseFloat(this.envelopedataSource.filteredData[i].usdAmount);
    }
  }

  formatLabel(value: number) {
    console.log("value:" + value);
    //this.envelopedataSource.data = envelopeDetails;
    console.log("this.envelopedataSource.data:" + envelopeDetails);
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
    this.envelopedataSource.data = envelopeDetails;
    const from = this.minValueMZN;
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e => Number.parseFloat(e.amount) >= from && Number.parseFloat(e.amount) <= event.value);
    this.totalRows = this.envelopedataSource.data.length;
    // console.log("data ",this.envelopedataSource.data)
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    /* The below loop is for to find all total amount and total usd amount  summation */
    for (let i = 0; i < this.envelopedataSource.data.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.data[i].amount;
      this.totalAmntUsd = this.totalAmnt + this.envelopedataSource.data[i].usdAmount;
    }
  }

  onInputChange1(event: MatSliderChange) {
    //console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.envelopedataSource.data = envelopeDetails;
    const from = this.minValueMZN;
    this.envelopedataSource.data = this.envelopedataSource.data.filter(e => Number.parseFloat(e.usdAmount) >= from && Number.parseFloat(e.usdAmount) <= event.value);
    this.totalRows = this.envelopedataSource.data.length;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    /* The below loop is for to find all total amount and total usd amount summation */
    for (let i = 0; i < this.envelopedataSource.data.length; i++) {
      this.totalAmnt = this.totalAmnt + this.envelopedataSource.data[i].amount;
      this.totalAmntUsd = this.totalAmnt + this.envelopedataSource.data[i].usdAmount;
    }
  }
  browserLang: any;
  fundingOrgFinal = [];
  // userEmail: any;
  ngOnInit(): void {
    localStorage.setItem('envelopeReference', null);
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    /* Here we can get which usergroup is login */
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.browserLang = localStorage.getItem("browserLang");
    this.setToAuthFlag();
    this.setToUserPermission();
    // this.userEmail = localStorage.getItem('userEmail')
    // console.log("this.userEmail ", this.userEmail)
    // this.filterSelectObj.filter((o) => {
    //   o.options = this.getFilterObject(ELEMENT_DATA, o.columnProp);
    // });

    // this.dataSource.filterPredicate = this.createFilter();

    /* purpose of call this method is to fetch all envelope data */
    this.fetchEnvelopeData();

  }
  checkedFilterColumn: any = {};

  /* This is for filter data that will be present in db */
  filterChange(filter, event) {
    this.amnt_flag = true;
    console.log("event:" + event.value);
    console.log("filter: " + filter.columnProp);
    this.filterValues[filter.columnProp] = event.value

    this.envelopedataSource.filter = JSON.stringify(this.filterValues);
    //console.log("filter values ",this.dataSource.filteredData.length)
    console.log("env filter values ", this.envelopedataSource.filter)
    this.checkedFilterColumn = this.envelopedataSource.filter;
    this.totalAmnt = 0;
    this.totalAmntUsd = 0;
    this.totalRows = 0;
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + Number.parseFloat(this.envelopedataSource.filteredData[i].amount);
      this.totalAmntUsd = this.totalAmntUsd + Number.parseFloat(this.envelopedataSource.filteredData[i].usdAmount);
    }
    this.totalRows = this.envelopedataSource.filteredData.length;

  }

  partner = [];
  purdaccrs = [];
  year = [];
  exchangerateUsd = [];
  acronym = []

  // Custom filter method fot Angular Material Datatable
  createFilter() {

    let filterFunction = (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
          this.acronym = [];
          /* Here we push all amount in an array */
          for (let i = 0; i < envelopeDetails.length; i++) {
            this.minAmount.push(envelopeDetails[i].amount)
            if (envelopeDetails[i].purposeDacCrs != "") {
              this.purdaccrs.push(envelopeDetails[i].purposeDacCrs)
            }
            this.acronym.push(envelopeDetails[i].acronym)
            this.partner.push(envelopeDetails[i].fundingOrg)
            this.year.push(envelopeDetails[i].year)
            this.exchangerateUsd.push(envelopeDetails[i].currency)

          }

          this.acronym = [...new Set(this.acronym)];
          this.purdaccrs = [...new Set(this.purdaccrs)];
          this.year = [...new Set(this.year)];
          this.exchangerateUsd = [...new Set(this.exchangerateUsd)];
          this.partner = [...new Set(this.partner)];
          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(envelopeDetails, o.columnProp);
          });
        }
      }
      let colName = '';

      let nameSearch = () => {
        let found = false;
        let checkIn = 0;
        let total = 0;
        if (isFilterSet) {
          for (const col in searchTerms) {
            total++;
            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              // this.fundingOrgFinal=this.partner;
              if (this.partner.length != 0)
                this.fundingOrgFinal = this.partner;
              this.purdaccrs = [];
              this.year = [];
              this.exchangerateUsd = [];
              this.partner = [];
              this.acronym = [];
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                /* adding Running filter start */
                this.browserLang = localStorage.getItem("browserLang");

                for (let j = 0; j < envelopeDetails.length; j++) {

                  if (col == 'fundingOrg') {
                    if (envelopeDetails[j].fundingOrg != null) {
                      if (spl[i].toLowerCase() == (envelopeDetails[j].fundingOrg).toString().toLowerCase()) {
                        if (envelopeDetails[j].purposeDacCrs != "") {
                          if (this.browserLang == 'en') {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrs);
                          } else {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrsPt);
                          }
                          colName = col;
                        }
                        this.acronym.push(envelopeDetails[j].acronym);
                        this.year.push(envelopeDetails[j].year);
                        this.exchangerateUsd.push(envelopeDetails[j].currency);
                      }
                    }

                  } else if (col == 'year') {
                    if (envelopeDetails[j].year != null) {
                      if (spl[i].toLowerCase() == (envelopeDetails[j].year).toString().toLowerCase()) {
                        if (envelopeDetails[j].purposeDacCrs != "") {
                          if (this.browserLang == 'en') {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrs);
                          } else {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrsPt);
                          }
                        }
                        this.acronym.push(envelopeDetails[j].acronym);
                        this.partner.push(envelopeDetails[j].fundingOrg);
                        this.exchangerateUsd.push(envelopeDetails[j].currency);
                      }
                    }

                  } else if (col == 'purposeDacCrs' || col == 'purposeDacCrsPt') {
                    if (envelopeDetails[j].purposeDacCrs != null) {
                      if (spl[i].toLowerCase() == (envelopeDetails[j].purposeDacCrs).toString().toLowerCase()) {
                        this.year.push(envelopeDetails[j].year);
                        this.partner.push(envelopeDetails[j].fundingOrg);
                        this.exchangerateUsd.push(envelopeDetails[j].currency);
                      }
                    }

                  } else if (col == 'currency') {
                    if (envelopeDetails[j].currency != null) {
                      if (spl[i].toLowerCase() == (envelopeDetails[j].currency).toString().toLowerCase()) {
                        this.year.push(envelopeDetails[j].year);
                        this.partner.push(envelopeDetails[j].fundingOrg);
                        if (envelopeDetails[j].purposeDacCrs != "") {
                          if (this.browserLang == 'en') {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrs);
                          } else {
                            this.purdaccrs.push(envelopeDetails[j].purposeDacCrsPt);
                          }
                        }
                        this.acronym.push(envelopeDetails[j].acronym);
                      }
                    }

                  }
                }
                /* adding Running filter end */
                if (data[col] != null) {
                  if ((data[col].toString()).trim().toLowerCase() == spl[i].trim().toLowerCase() && isFilterSet) {
                    found = true;
                    checkIn++;
                  }
                }


              }
            });
          }
          this.purdaccrs = [...new Set(this.purdaccrs)];
          this.year = [...new Set(this.year)];
          this.exchangerateUsd = [...new Set(this.exchangerateUsd)];
          this.partner = [...new Set(this.partner)];
          //  this.acronym=[...new Set(this.acronym)];
          this.acronym = [];
          if (colName !== 'fundingOrg') {
            for (let j = 0; j < this.partner.length; j++) {
              for (let k = 0; k < envelopeDetails.length; k++) {

                if (this.partner[j] === envelopeDetails[k].fundingOrg) {
                  this.acronym.push(envelopeDetails[k].acronym);
                  break;
                }

              }
            }
          }
          else {
            for (let j = 0; j < this.fundingOrgFinal.length; j++) {
              for (let k = 0; k < envelopeDetails.length; k++) {

                if (this.fundingOrgFinal[j] === envelopeDetails[k].fundingOrg) {
                  this.acronym.push(envelopeDetails[k].acronym);
                  break;
                }

              }
            }
            console.log("fundingOrgFinal", this.fundingOrgFinal);
            console.log("acronymelse", this.acronym);
          }

          if (this.partner.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'fundingOrg') {
                o.options = this.partner, 'fundingOrg';

              }
            });
          }
          if (this.purdaccrs.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (this.browserLang == 'en') {
                if (o.columnProp == 'purposeDacCrs') {
                  o.options = this.purdaccrs, 'purposeDacCrs';
                }
              } else {
                if (o.columnProp == 'purposeDacCrsPt') {
                  o.options = this.purdaccrs, 'purposeDacCrsPt';
                }
              }

            });
          }
          if (this.year.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'year') {
                o.options = this.year, 'year';
              }
            });
          }
          if (this.exchangerateUsd.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'currency') {
                o.options = this.exchangerateUsd, 'currency';
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
    console.log("filter data", this.envelopedataSource);
    if (this.envelopedataSource.paginator) {
      this.envelopedataSource.paginator.firstPage();
      this.totalRows = this.envelopedataSource.filteredData.length;
      this.totalAmntUsd = 0;
      this.totalAmnt = 0;
      /* The below loop is for to find all total amount summation */
      for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
        this.totalAmnt = this.totalAmnt + this.envelopedataSource.filteredData[i].amount;
        this.totalAmntUsd = this.totalAmntUsd + this.envelopedataSource.filteredData[i].usdAmount;
      }
    }

  }

  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Envelope List')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Envelope List') {
        this.authorised_flag = true;
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
    let envAmntId = [];
    for (let i = 0; i < this.envelopedataSource.filteredData.length; i++) {
      envAmntId.push(this.envelopedataSource.filteredData[i].envelopeId)
    }
    window.open(environment.envelopeExcelUrl + envAmntId + '/' + btoa(this.checkedFilterColumn), '_self')
    // window.open(environment.envelopeExcelUrl,'_self')
    //console.log("this.epltable.nativeElement:"+this.epltable.nativeElement);
    // let obj = new ViewEnvelopeComponentComponent( this._document, this.excelService, this.router, this.dialog, this.location, this.envelopeService);
    // this.resetFilters();
    // setTimeout(() => {
    //   obj.ExportTOExcel();
    // }, 5000);

  }

  //for notification alert, execute on delete disbursement
  saveEnvelopeDeleteAlert(id: number[]) {
    let todayTime = new Date();
    let envName: string[] = [];
    let fundName: string[] = [];
    id.forEach(id => {
      let envNm = this.findEnvRefById(id);
      envName.push(envNm);

      let fundNm = this.findFundRefById(id);
      fundName.push(fundNm);
    });
    //let notificationDetails:Notification=new Notification();
    // notificationDetails.notificationGroup=this.userGroupForNotification;
    // notificationDetails.updatedBy=this.userNameForNotification;
    // notificationDetails.notificationMsg=this.userNameForNotification+" has delete envelope on "+(todayTime+'').substring(0,24);
    // notificationDetails.updatedOn=todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail: string = 'Envelope Reference ID "'
      + envName
      + '" Deleted on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Envelope Reference ID "'
      + envName
      + '" for Funding Organization "'
      + fundName
      + '" has been deleted by user "' + this.userNameForNotification + '" in AIMS on "'
      + ((todayTime + '').substring(0, 24));

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
  private findEnvRefById(id: number): string {
    let envName: string = null;
    for (let i = 0; i < envelopeDetails.length; i++) {
      if (envelopeDetails[i].envelopeTableId == id) {
        envName = envelopeDetails[i].envelopeReference;
      }
    }
    return envName;
  }

  //for notification alert
  private findFundRefById(id: number): string {
    let fundingName: string = null;
    for (let i = 0; i < envelopeDetails.length; i++) {
      if (envelopeDetails[i].envelopeTableId == id) {
        fundingName = envelopeDetails[i].fundingOrg;
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
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* If we click on delete button then it gives an alert */
  opensweetalertDelete() {
    this.getValueByLang();
    if (this.ids.length > 0) {
      Swal.fire({
        /* Whenever we click on delete button then it will give two more button i.e. delete and cancel */
        title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
        denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
      }).then((result) => {


        /* If we click on delete button then by given id that record will deleted*/
        if (result.isConfirmed) {
          this.deleteEnvTableById(this.ids);

        }
        /* If we click on Cancel button then no record will be deleted */
        else if (result.isDenied) {
          if (this.browserLang == 'en')
            Swal.fire('Cancelled', '', 'info');
          else {
            Swal.fire('Cancelado', '', 'info');
          }
          this.selection.clear();
          this.ids = [];
        }
      });
    } else {
      if (this.browserLang == 'en')
        Swal.fire('Select at least one record');
      else
        Swal.fire('Seleccione pelo menos um registo');
    }
  }
  private deleteEnvTableById(envelopeTableId: number[]) {
    this.getValueByLang()
 /* Here we call service to delete data from db by given id */
 let language=localStorage.getItem("browserLang");
 this.envelopeService.deleteEnvelopeByIds(envelopeTableId,language).subscribe(data => {
  if(this.browserLang=='en'){
    Swal.fire('Deleted successfully', '', 'success')
  }else{
    Swal.fire('Apagado com sucesso', '', 'success')
  }
  this.fetchEnvelopeData();
  this.saveEnvelopeDeleteAlert(envelopeTableId);
   });
  
  
  }
  /* This is for open document modal */
  openDocumentDialog(envelopeRefNm: string) {
    localStorage.setItem("envelopeRefNm", envelopeRefNm);
    const dialogRef = this.dialog.open(EnvelopeDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-envelope']);
    });
  }
  emailInIndividual:string[];
  fundingOrganizationList: OrganizationCrudServiceClass[];
  fundingOrgs:string[]=[];
  loadingAllData:boolean=false;
  loadAllData(){
this.limits=1;
this.fetchEnvelopeData();
  }
  /* Here we can fetch all envelope data by calling servie */
  limits:number=0;
  private fetchEnvelopeData() {
    // var limits=$("#limitDropDown").val();
    // if(limits==undefined)
    //   limits=0;
    // var arr = new Array();
    this.envelopeService.getEnvelope(this.limits).toPromise().then(data => {
      this.envelopeService.getFundingOrgDetailsByUserAccessId(this.userId).toPromise().then(envData=>{
       
        this.fundingOrganizationList = envData;
        
        this.fundingOrganizationList.forEach(fundingOrg=>{
          this.fundingOrgs.push(fundingOrg.names);
        });
        for (let i = 0; i < envelopeDetails.length; i++) {
          this.totalAmnt = this.totalAmnt + envelopeDetails[i].amount;
         this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(envelopeDetails[i].usdAmount) ;
        
         envelopeDetails[i].emailChk = false;
         for (let j=0;j<this.fundingOrgs.length;j++) {
           if (envelopeDetails[i].fundingOrg == this.fundingOrgs[j]) {
            envelopeDetails[i].emailChk = true;
           }
         }
        }
      });
      envelopeDetails = data;
      this.totalRows = envelopeDetails.length;
      /* Add data in MatTableDataSource */
      this.envelopedataSource = new MatTableDataSource<EnvelopeServiceClass>(envelopeDetails);
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
      // for (let i = 0; i < envelopeDetails.length; i++) {
      //   this.totalAmnt = this.totalAmnt + envelopeDetails[i].amount;
      //  this.totalAmntUsd=this.totalAmntUsd+Number.parseFloat(envelopeDetails[i].usdAmount) ;
      
      //  envelopeDetails[i].emailChk = false;
      //  for (let j=0;j<this.fundingOrgs.length;j++) {
      //    if (envelopeDetails[i].fundingOrg == this.fundingOrgs[j]) {
      //     envelopeDetails[i].emailChk = true;
      //    }
      //  }
      // }
      
  
      this.acronym=[];
      /* Here we push all amount in an array */
      for (let i = 0; i < envelopeDetails.length; i++) {
        // arr = envelopeDetails[i].records;
        this.minAmount.push(envelopeDetails[i].amount)
        if (envelopeDetails[i].purposeDacCrs != "") {
          this.purdaccrs.push(envelopeDetails[i].purposeDacCrs)
        }
        // this.acronym.push(envelopeDetails[i].acronym)
        this.partner.push(envelopeDetails[i].fundingOrg)
        this.year.push(envelopeDetails[i].year)
        this.exchangerateUsd.push(envelopeDetails[i].currency)

      }

      // try{
      //   $('#limitDropDown').find('option').remove();
      //   arr.forEach(str=>{
      //     console.log(str);
      //     $("#limitDropDown").append('<option value="'+str+'">'+str+'</option>');
      //   });
      //   $("#limitDropDown").val(envelopeDetails.length);
      // }
      // catch(e)
      // {console.error('while ploting in dropdown')}

      // this.acronym=[...new Set(this.acronym)];
      this.purdaccrs = [...new Set(this.purdaccrs)];
      this.year = [...new Set(this.year)];
      this.exchangerateUsd = [...new Set(this.exchangerateUsd)];
      this.partner = [...new Set(this.partner)];
      for (let j = 0; j < this.partner.length; j++) {
        for (let k = 0; k < envelopeDetails.length; k++) {

          if (this.partner[j] === envelopeDetails[k].fundingOrg) {
            this.acronym.push(envelopeDetails[k].acronym);
            break;
          }
        }
      }
      console.log("this.acronym", this.acronym);
      console.log("this.pudsccrs", this.partner);

      // /* Find minimum amount */
      // this.minValueMZN = this.minAmount.reduce((a, b) => Math.min(a, b));
      // /* Find maximum amount */
      // this.maxValueMZN = this.minAmount.reduce((a, b) => Math.max(a, b));

      /* This is for to find filter options */
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(envelopeDetails, o.columnProp);
      });
      this.envelopedataSource.filterPredicate = this.createFilter();
    });


  }

  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');

  }

  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let partner = [];
    let purdaccrs = [];
    let year = [];
    let exchangerateUsd = [];
    let acronym = []
    this.browserLang = localStorage.getItem("browserLang");
    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < envelopeDetails.length; i++) {

        if (columnName == 'fundingOrg') {
          if (this.partner.length == 0) {
            if ((((envelopeDetails[i].fundingOrg).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) ||
              ((envelopeDetails[i].acronym).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              partner.push(envelopeDetails[i].fundingOrg);
              acronym.push(this.acronym[i])
              console.log("partner chval", this.partner);
              console.log("acronym chk val", this.acronym)
            }

          } else if (this.partner.length != 0) {
            if (this.partner[i] != undefined) {
              if (this.acronym[i] == null || this.acronym[i] == undefined) {
                this.acronym[i] = ''
              }
              console.log("partner chval", this.partner);
              console.log("acronym chk val", this.acronym)
              if ((((this.partner[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) ||
                (((this.acronym[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1)) {
                partner.push(this.partner[i]);
                acronym.push(this.acronym[i])
              }
            }
          }

        } else if (columnName == 'purposeDacCrs' || columnName == 'purposeDacCrsPt') {
          if (this.purdaccrs.length == 0) {
            if (((envelopeDetails[i].purposeDacCrs).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              if (this.browserLang == 'en') {
                purdaccrs.push(envelopeDetails[i].purposeDacCrs);
              } else {
                purdaccrs.push(envelopeDetails[i].purposeDacCrsPt);
              }

            }
          } else if (this.purdaccrs.length != 0) {
            if (this.purdaccrs[i] != undefined) {
              if (((this.purdaccrs[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                purdaccrs.push(this.purdaccrs[i]);
              }
            }
          }
        } else if (columnName == 'year') {
          if (this.year.length == 0) {
            if (((envelopeDetails[i].year).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              year.push(envelopeDetails[i].year);
            }
          }
          else if (this.year.length != 0) {
            if (this.year[i] != undefined) {
              if (((this.year[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                year.push(this.year[i]);

              }
            }
          }
        } else if (columnName == 'currency') {
          if (this.exchangerateUsd.length == 0) {
            if (((envelopeDetails[i].currency).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              exchangerateUsd.push(envelopeDetails[i].currency);
            }
          }
          else if (this.exchangerateUsd.length != 0) {
            if (this.exchangerateUsd[i] != undefined) {
              if (((this.exchangerateUsd[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                exchangerateUsd.push(this.exchangerateUsd[i]);

              }
            }
          }
        }
      }
    } if (columnName == 'fundingOrg') {
      partner = [...new Set(partner)];
      if (this.partner.length == 0) {
        this.partner = partner
      }
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrg') {
          o.options = partner, 'fundingOrg';

        }
      });
    } if (columnName == 'purposeDacCrs' || columnName == 'purposeDacCrsPt') {
      purdaccrs = [...new Set(purdaccrs)];
      this.filterSelectObj.filter((o) => {
        if (this.browserLang == 'en') {
          if (o.columnProp == 'purposeDacCrs') {
            o.options = purdaccrs, 'purposeDacCrs';
          }
        } else {
          if (o.columnProp == 'purposeDacCrsPt') {
            o.options = purdaccrs, 'purposeDacCrsPt';
          }
        }

      });
    } if (columnName == 'year') {
      year = [...new Set(year)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'year') {
          o.options = year, 'year';
        }
      });
    } if (columnName == 'currency') {
      exchangerateUsd = [...new Set(exchangerateUsd)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'currency') {
          o.options = exchangerateUsd, 'currency';
        }
      });
    }

    if (searchFilterVal.length == 0 && columnName == 'fundingOrg' && this.partner.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrg')
          o.options = this.partner, 'fundingOrg';
      });
    }
    if ((searchFilterVal.length == 0 && columnName == 'purposeDacCrs' && this.purdaccrs.length != 0) || (searchFilterVal.length == 0 && columnName == 'purposeDacCrsPt' && this.purdaccrs.length != 0)) {
      this.filterSelectObj.filter((o) => {
        if (this.browserLang == 'en') {
          if (o.columnProp == 'purposeDacCrs')
            o.options = this.purdaccrs, 'purposeDacCrs';
        } else {
          if (o.columnProp == 'purposeDacCrsPt')
            o.options = this.purdaccrs, 'purposeDacCrsPt';
        }

      });
    }
    if (searchFilterVal.length == 0 && columnName == 'year' && this.year.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'year')
          o.options = this.year, 'year';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'currency' && this.exchangerateUsd.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'currency')
          o.options = this.exchangerateUsd, 'currency';
      });
    }
  }
  selection = new SelectionModel<EnvelopeServiceClass>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: EnvelopeServiceClass) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.envelopeTableId);
    } else {
      let index = this.ids.indexOf(row.envelopeTableId, 0);
      this.ids.splice(index, 1);
    }
  }
  /*Document upload modal open */
  openDialog2(referenceName: string) {
    localStorage.setItem("refNM", referenceName);
    // let refNm=localStorage.getItem("refNM");
    // if(refNm == null || refNm== ''){
    //   Swal.fire('Please Enter Envelope Reference Name.')
    // }else{
    const dialogRef = this.dialog.open(EnvelopeDocumentUploadComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['envelope']);
      // console.log(`Dialog result: ${result}`);
      // localStorage.removeItem('refNM');
    }
    );
    // }

  }
}
export interface PeriodicElement {
  // position: number;
  partner: string;
  year: string;
  envagrcurr: number;
  exchangerateUsd: string;
  exchangerateMzn: string;
  amtannenvmeti: number;
  annenvamtusd: number;
  purdaccrs: string;
  // comments: string;
}


let envelopeDetails: EnvelopeServiceClass[] = [];

const ELEMENT_DATA: PeriodicElement[] = [
  { partner: 'WHO', year: '2018', envagrcurr: 10079.00, exchangerateUsd: 'Australia Dollar ( AUD )', exchangerateMzn: '20.2', amtannenvmeti: 10078.00, annenvamtusd: 10079.00, purdaccrs: 'Education' },
  { partner: 'UNESCO', year: '2021', envagrcurr: 4026.00, exchangerateUsd: 'Great Britain Pound ( GBP )', exchangerateMzn: '19.2', amtannenvmeti: 4026.00, annenvamtusd: 4026.00, purdaccrs: 'School feeding' },
  { partner: 'UNICEF', year: '2020', envagrcurr: 6941.00, exchangerateUsd: 'Japan Yen ( JPY )', exchangerateMzn: '18.2', amtannenvmeti: 6941.00, annenvamtusd: 10079.00, purdaccrs: 'Health' },
  { partner: 'WORLD BANK', year: '2019', envagrcurr: 90122.00, exchangerateUsd: 'Great Britain Pound ( GBP )', exchangerateMzn: '20.2', amtannenvmeti: 90122.00, annenvamtusd: 4026.00, purdaccrs: 'Foreign affairs' },
  { partner: 'UNESCO', year: '2018', envagrcurr: 90122.00, exchangerateUsd: 'Australia Dollar ( AUD )', exchangerateMzn: '16.2', amtannenvmeti: 120107.00, annenvamtusd: 10079.00, purdaccrs: 'Basic sanitation' },
  { partner: 'UNICEF', year: '2020', envagrcurr: 120107.00, exchangerateUsd: 'Japan Yen( JPY )', exchangerateMzn: '20.2', amtannenvmeti: 120107.00, annenvamtusd: 4026.00, purdaccrs: 'Marine energy' },
  { partner: 'UNESCO', year: '2020', envagrcurr: 140067.00, exchangerateUsd: 'Australia Dollar ( AUD )', exchangerateMzn: '18.2', amtannenvmeti: 12107.00, annenvamtusd: 10079.00, purdaccrs: 'Foreign affairs' },
  { partner: 'UNICEF', year: '2017', envagrcurr: 1994.00, exchangerateUsd: 'Euro ( EUR )', exchangerateMzn: '19.2', amtannenvmeti: 120107.00, annenvamtusd: 4026.00, purdaccrs: 'National audit' },
  { partner: 'UNICEF', year: '2019', envagrcurr: 1984.00, exchangerateUsd: 'Euro ( EUR )', exchangerateMzn: '14.2', amtannenvmeti: 120107.00, annenvamtusd: 10079.00, purdaccrs: 'Biodiversity' },
  { partner: 'UNICEF', year: '2018', envagrcurr: 201574.00, exchangerateUsd: 'Australia Dollar ( AUD )', exchangerateMzn: '20.2', amtannenvmeti: 120107.00, annenvamtusd: 4026.00, purdaccrs: 'Education' },

];


export enum SelectType {
  single,
  multiple
}



