// Business Logic TS component of view-monitoring
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/Service/excel.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MonitoringDocumentViewComponent } from '../../document-repository/view-document/monitoring-document-view/monitoring-document-view.component';
import { ViewTableModalMonitoringComponent } from '../../view-more-components/view-table-modal-monitoring/view-table-modal-monitoring.component';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { MonitoringCrudService } from 'src/app/Service/monitoring-crud-service';
import { MonitoringCrudServiceClass } from 'src/app/Service-Class/monitoring-crud-service-class';
import { environment } from 'src/environments/environment';
import { I } from '@angular/cdk/keycodes';
import { SelectionModel } from '@angular/cdk/collections';
import { MonitoringDocumentUploadComponent } from '../../document-repository/upload-document/monitoring-document-upload/monitoring-document-upload.component';
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
  selector: 'app-view-monitoring-component',
  templateUrl: './view-monitoring-component.component.html',
  styleUrls: ['./view-monitoring-component.component.css']
})

export class ViewMonitoringComponentComponent implements OnInit {
  displayedColumns: string[] = ['select','edit', 'projname', 'provience', 'district', 'totbudget', 'financialExeRate', 'physicalExeRate'];

  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  authorised_flag = false;
  userNameForNotification:string="Charlie Adams";
  userGroupForNotification:string="DNGDP Data Administrator";
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  searchFilter = new FormControl('');
  browserLang: any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  filterValues = {};
  filterSelectObj = [];
  totalRows: any = 0;
  totalAmnt: number = 0;
  totalFinancialExeRate: number = 0;
  totalphysicalExeRate: number = 0;
  maxFinanceRate: number = 0;
  minFinanceRate: number = 0;
  maxPhysicalRate: number = 0;
  minPhysicalRate: number = 0;
  maxBudgetMzn: number = 0;
  minBudgetMzn: number = 0;
  usergroup: any;
  proviceFinal = [];
  projectName = [];
  province = [];
  district = [];
  implementingOrg = [];
  strategicPriorityPQG = [];
  strategicObjectivePQG = [];
  disbursementCondition = [];
  startDatee = [];
  endDatee = [];
  levelofAction = [];
  nationalOrderProvince:any=['NIASSA','CABO DELGADO','NAMPULA','ZAMBEZIA','TETE','MANICA','SOFALA','INHAMBANE',
                          'GAZA','MAPUTO PROVINCIA','MAPUTO CIDADE']
  monitoringdataSource = new MatTableDataSource<MonitoringCrudServiceClass>(monitoringDetails);
  constructor(private excelService: ExcelService, private router: Router, private dialog: MatDialog, private location: Location,
    private monitoringCrudService: MonitoringCrudService) {
      this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
    this.filterSelectObj = [
      {
        name: 'Project name',
        columnProp: 'projectNm',
        options: []
      }, {
        name: 'Province',
        columnProp: 'province',
        options: []
      }, {
        name: 'District',
        columnProp: 'districts',
        options: []
      },
      {
        name: 'Implementing Organization',
        columnProp: 'organization',
        options: []
      },
      {
        name: 'Strategic Priority PQG',
        columnProp: 'strategicPriorityPQG',
        options: []
      }, {
        name: 'Strategic Objective PQG',
        columnProp: 'strategicObjectivePQG',
        options: []
      }, 
      // {
      //   name: 'Disbursement Condition',
      //   columnProp: 'conditionOfDisbursment',
      //   options: []
      // }, 
      // {
      //   name: 'Start Date',
      //   columnProp: 'startDate',
      //   options: []
      // }, {
      //   name: 'End Date',
      //   columnProp: 'endDate',
      //   options: []
      // }, 
      {
        name: 'Level of Action',
        columnProp: 'levelOfActionn',
        options: []
      }
    ]
  }else{
    this.filterSelectObj = [
      {
        name: 'Nome do Projecto',
        columnProp: 'projectNm',
        options: []
      }, {
        name: 'Província',
        columnProp: 'province',
        options: []
      }, {
        name: 'Distrito',
        columnProp: 'districts',
        options: []
      },
      {
        name: 'Organização Implementadora',
        columnProp: 'organization',
        options: []
      },
      {
        name: 'Prioridade estratégica PQG',
        columnProp: 'strategicPriorityPQG',
        options: []
      }, {
        name: 'Objetivo Estratégico PQG',
        columnProp: 'strategicObjectivePQG',
        options: []
      }, 
      // {
      //   name: 'Data de início',
      //   columnProp: 'startDate',
      //   options: []
      // }, {
      //   name: 'Data final',
      //   columnProp: 'endDate',
      //   options: []
      // }, 
      {
        name: 'Nível de Ação',
        columnProp: 'levelOfActionnPt',
        options: []
      }
    ]
  }
  }
  checkedFilterColumn:any={};
  filterChange(filter, event) {
    this.filterValues[filter.columnProp] = event.value
    this.monitoringdataSource.filter = JSON.stringify(this.filterValues)
    this.totalAmnt = 0;
    // console.log(" filter values ", this.monitoringdataSource.filter)
    this.totalRows = 0;
    this.checkedFilterColumn=this.monitoringdataSource.filter;
    for (let i = 0; i < this.monitoringdataSource.filteredData.length; i++) {
      this.totalAmnt = this.totalAmnt + Number.parseFloat(this.monitoringdataSource.filteredData[i].totalBudgetMzn);
    }
    this.totalRows = this.monitoringdataSource.filteredData.length;
  }
  generateExcel() {
    let monitoringId=[];
    let fieldVisitId=[];
for(let i=0;i<this.monitoringdataSource.filteredData.length;i++){
  monitoringId.push(this.monitoringdataSource.filteredData[i].monitoringId)
  fieldVisitId.push(this.monitoringdataSource.filteredData[i].fieldVisitId)
}
window.open(environment.monitoringExcelUrl+monitoringId+'/'+fieldVisitId+'/'+btoa(this.checkedFilterColumn),'_self')
    // window.open(environment.monitoringExcelUrl, '_self')
    // console.log("123456");
    // let obj = new ViewMonitoringComponentComponent(this.excelService, this.router, this.dialog, this.location,this.monitoringCrudService);
    // obj.ExportTOExcel();
  }
  getRangeFinanceRate() {
    this.totalRows = 0;
    this.totalAmnt = 0;
    this.monitoringdataSource.data = monitoringDetails;
    const from = this.minFinanceRate;
    const to = this.maxFinanceRate;
    this.monitoringdataSource.data = this.monitoringdataSource.data.filter(e => Number.parseFloat(e.financialExeRateContract) >= from && Number.parseFloat(e.financialExeRateContract) <= to);
    this.totalRows = this.monitoringdataSource.filteredData.length;
    for (let i = 0; i < this.monitoringdataSource.filteredData.length; i++) {

      this.totalAmnt = this.totalAmnt + Number.parseFloat(this.monitoringdataSource.filteredData[i].totalBudgetMzn);
    }
  }

  getRangePhysicalRate() {
    this.totalRows = 0;
    this.totalAmnt = 0;
    this.monitoringdataSource.data = monitoringDetails;
    const from = this.minPhysicalRate;
    const to = this.maxPhysicalRate;
    this.monitoringdataSource.data = this.monitoringdataSource.data.filter(e => Number.parseFloat(e.physicalExeRateContract) >= from && Number.parseFloat(e.physicalExeRateContract) <= to);
    this.totalRows = this.monitoringdataSource.filteredData.length;
    for (let i = 0; i < this.monitoringdataSource.filteredData.length; i++) {

      this.totalAmnt = this.totalAmnt + Number.parseFloat(this.monitoringdataSource.filteredData[i].totalBudgetMzn);
    }
  }

  getTotalBudget() {
    this.totalRows = 0;
    this.totalAmnt = 0;
    this.monitoringdataSource.data = monitoringDetails;
    const from = this.minBudgetMzn;
    const to = this.maxBudgetMzn;
    this.monitoringdataSource.data = this.monitoringdataSource.data.filter(e => Number.parseFloat(e.totalBudgetMzn) >= from && Number.parseFloat(e.totalBudgetMzn) <= to);
    this.totalRows = this.monitoringdataSource.filteredData.length;
    for (let i = 0; i < this.monitoringdataSource.filteredData.length; i++) {

      this.totalAmnt = this.totalAmnt + Number.parseFloat(this.monitoringdataSource.filteredData[i].totalBudgetMzn);
    }
  }
  optionsFr: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if(this.browserLang=='en'){
              return '<b>Min Rate : </b>' + value;
            }else{
              return '<b>Taxa mínima : </b>' + value;
            }
           
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang=='en'){
            return '<b>Max Rate : </b>' + value;
            }else{
              return '<b>Taxa máxima : </b>' + value;
            }
          }
        default:
          if(this.browserLang=='en'){
          return 'Filter Financial Execution Rate (in %)';
          }else{
            return 'Filtrar taxa de execução financeira (em %)';
          }
      }
    }
  };

  optionsPr: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if(this.browserLang=='en'){
              return '<b>Min Rate : </b>' + value;
            }else{
              return '<b>Taxa mínima : </b>' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
             if(this.browserLang=='en'){
              return '<b>Max Rate : </b>' + value;
              }else{
                return '<b>Taxa máxima : </b>' + value;
              }  
          }
        default:
          if(this.browserLang=='en'){
          return 'Filter Physical Execution Rate (in %)';
          }else{
            return 'Filtrar taxa de execução física (em %)';
          }
      }
    }
  };

  optionsBudMz: Options = {
    floor: 0,
    ceil: 1000000000,
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
          return 'Filter Financial Execution Amount (MZN)';
          }else{
            return 'Filtrar montante de execução financeira (MZN)';
          }
      }
    }
  };
  public ExportTOExcel() {
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Monitoring');

  }


  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    //this.totalRows = ELEMENT_DATA.length;
    this.usergroup = localStorage.getItem('usergroup');
    this.usergroup = localStorage.getItem('usergroup');
    this.setToUserPermission();
    // this.findTotalAmount();
    this.fetchMonitoringData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }
  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {

        if (obj[key] != '') {
          uniqChk.push(obj[key]);
        }

      }
      return obj;
    });
    uniqChk.sort(function (a, b) {
      return a.localeCompare(b); //using String.prototype.localCompare()
    });

    return uniqChk;
  }
  di = [];
  provName: any;
  provinceNm(district: string) {
    //  console.log("count------------>");
    for (let i = 0; i < monitoringDetails.length; i++) {
      if (district === monitoringDetails[i].districts) {
        this.provName = monitoringDetails[i].province;
      }


    }
    //  console.log("chk  ", this.provName);
    // console.log("chk2  ",provinceName);
    return this.provName;
  }
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
          this.proviceFinal = [];
          for (let k = 0; k < monitoringDetails.length; k++) {
            this.proviceFinal.push(monitoringDetails[k].province)
          }
          this.proviceFinal = [...new Set(this.proviceFinal)];
          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(monitoringDetails, o.columnProp);
          });
        }
      }

      let district = [];

      let nameSearch = () => {

        let found = false;
        let checkIn = 0;
        let total = 0;
        if (isFilterSet) {
          for (const col in searchTerms) {
            total++;

            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              this.projectName = [];
              this.province = [];
              this.proviceFinal = [];
              this.district = [];
              this.implementingOrg = [];
              this.strategicPriorityPQG = [];
              this.strategicObjectivePQG = [];
              this.disbursementCondition = [];
              this.startDatee = [];
              this.endDatee = [];
              this.levelofAction = [];
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                /* adding Running filter start */

                for (let j = 0; j < monitoringDetails.length; j++) {

                  if (col == 'projectNm') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].projectNm).toString().toLowerCase()) {
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                        
                    }
                  } else if (col == 'province') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].province).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'districts') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].districts).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm);
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      for (let k = 0; k < monitoringDetails.length; k++) {
                        if (monitoringDetails[j].province != '')
                          this.proviceFinal.push(monitoringDetails[k].province)
                      }
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'organization') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].organization).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'strategicPriorityPQG') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].strategicPriorityPQG).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'strategicObjectivePQG') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].strategicObjectivePQG).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'conditionOfDisbursment') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].conditionOfDisbursment).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'startDate') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].startDate).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'endDate') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].endDate).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                      if (monitoringDetails[j].levelOfActionn != '')
                      if(this.browserLang == 'en'){
                        this.levelofAction.push(monitoringDetails[j].levelOfActionn)
                      }else{
                        this.levelofAction.push(monitoringDetails[j].levelOfActionnPt)
                      }
                    }
                  } else if (col == 'levelOfActionn') {
                    if (spl[i].toLowerCase() == (monitoringDetails[j].levelOfActionn).toString().toLowerCase()) {
                      if ((monitoringDetails[j].projectNm) != '')
                        this.projectName.push(monitoringDetails[j].projectNm)
                      if (monitoringDetails[j].districts != '')
                        this.district.push(monitoringDetails[j].districts)
                      if (monitoringDetails[j].province != '')
                        this.proviceFinal.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].province != '')
                        this.province.push(monitoringDetails[j].province)
                      if (monitoringDetails[j].organization != '')
                        this.implementingOrg.push(monitoringDetails[j].organization)
                      if (monitoringDetails[j].strategicObjectivePQG != '')
                        this.strategicObjectivePQG.push(monitoringDetails[j].strategicObjectivePQG)
                      if (monitoringDetails[j].conditionOfDisbursment != '')
                        this.disbursementCondition.push(monitoringDetails[j].conditionOfDisbursment)
                      if (monitoringDetails[j].startDate != '')
                        this.startDatee.push(monitoringDetails[j].startDate)
                      if (monitoringDetails[j].endDate != '')
                        this.endDatee.push(monitoringDetails[j].endDate)
                      if (monitoringDetails[j].strategicPriorityPQG != '')
                        this.strategicPriorityPQG.push(monitoringDetails[j].strategicPriorityPQG)
                    }
                  }
                }

                /* adding Running filter end */
                if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                  found = true;
                  checkIn++;
                }
              }

            });
          }

          // this.di = [...new Set(district)];
          // if(this.di.length !=0){
          //   this.filterSelectObj.filter((o) => {
          //     if (o.columnProp == 'districts') {
          //       o.options = this.di, 'districts';
          //     }
          //   });
          // }

          this.projectName = [...new Set(this.projectName)];
          this.province = [...new Set(this.province)];
          this.district = [...new Set(this.district)];
          this.implementingOrg = [...new Set(this.implementingOrg)];
          this.strategicPriorityPQG = [...new Set(this.strategicPriorityPQG)];
          this.strategicObjectivePQG = [...new Set(this.strategicObjectivePQG)];
          this.disbursementCondition = [...new Set(this.disbursementCondition)];
          this.startDatee = [...new Set(this.startDatee)];
          this.endDatee = [...new Set(this.endDatee)];
          this.levelofAction = [...new Set(this.levelofAction)];
          this.proviceFinal = [...new Set(this.proviceFinal)];

          if (this.projectName.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'projectNm') {
                o.options = this.projectName, 'projectNm';

              }
            });
          }
          if (this.province.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'province') {
                o.options = this.province, 'province';

              }
            });
          }
          if (this.district.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'districts') {
                o.options = this.district, 'districts';
              }
            });
          }
          if (this.implementingOrg.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'organization') {
                o.options = this.implementingOrg, 'organization';
              }
            });
          } else {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'organization') {
                // console.log("o.options  ", o.options)
              }
            });
          }

          if (this.strategicPriorityPQG.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'strategicPriorityPQG') {
                o.options = this.strategicPriorityPQG, 'strategicPriorityPQG';

              }
            });
          }
          if (this.strategicObjectivePQG.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'strategicObjectivePQG') {
                o.options = this.strategicObjectivePQG, 'strategicObjectivePQG';

              }
            });
          }
          if (this.disbursementCondition.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'conditionOfDisbursment') {
                o.options = this.disbursementCondition, 'conditionOfDisbursment';
              }
            });
          }
          if (this.startDatee.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'startDate') {
                o.options = this.startDatee, 'startDate';
              }
            });
          }

          if (this.endDatee.length != 0) {
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'endDate') {
                o.options = this.endDatee, 'endDate';
              }
            });
          }
          if (this.levelofAction.length != 0) {
            this.filterSelectObj.filter((o) => {
              if(this.browserLang == 'en'){
                if (o.columnProp == 'levelOfActionn') {
                  o.options = this.levelofAction, 'levelOfActionn';
                }
              }else{
                if (o.columnProp == 'levelOfActionnPt') {
                  o.options = this.levelofAction, 'levelOfActionnPt';
                }
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

  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Monitoring')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Monitoring') {
        this.authorised_flag = true;
      }
    }
  }

  moveToSelectedTab(tabName: string) {
    this.location.back();

  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  opensweetalertDelete() {
    this.getValueByLang();
    if(this.ids.length>0){
    Swal.fire({
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deletemonitoringByContractId(this.ids);
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
        this.selection.clear();
        this.ids = [];
      }
    })
  }else{
    if(this.browserLang=='en')
    Swal.fire('Select at least one record');
    else
    Swal.fire('Seleccione pelo menos um registo');
  }
  }

  //for notification alert, execute on delete monitoring
  monitoringDeleteAlert(id:number[]) {
    let todayTime = new Date();
    let budgetProjectName:string[] = [];
   
    id.forEach(id => {
      let budgetProjectNm= this.findbudgetProjectName(id);
      budgetProjectName.push(budgetProjectNm);
    });
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete monitoring on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Monitoring Reference ID  "'
      +id
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Monitoring Reference ID "'
      +id
      +'" for Budget Project "'
      +budgetProjectName
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
  private findbudgetProjectName(id:number):string{
    let budgetProject:string=null;
    for(let i=0;i<monitoringDetails.length;i++){
      if(monitoringDetails[i].monitoringContractId==id){
        budgetProject=monitoringDetails[i].projectNm;
      }
    }
    return budgetProject;
  }

  openDialog(id,index) {
for(let i=0;i<monitoringDetails.length;i++){
  if(monitoringDetails[i].monitoringId == id){

    localStorage.setItem("prioritypqg", monitoringDetails[i].strategicPriorityPQG);
    localStorage.setItem("objpqg", monitoringDetails[i].strategicObjectivePQG);
    localStorage.setItem("conddisburse", monitoringDetails[i].conditionOfDisbursment);
    localStorage.setItem("implementing organization", monitoringDetails[i].organization);
    if(this.browserLang=='en'){
      localStorage.setItem("levelOfAction", monitoringDetails[i].levelOfActionn);
    }else{
      localStorage.setItem("levelOfAction", monitoringDetails[i].levelOfActionnPt);
    }
    
    localStorage.setItem("startDate", monitoringDetails[i].startDate);
    localStorage.setItem("endDate", monitoringDetails[i].endDate)
    break;
  }
}

    const dialogRef = this.dialog.open(ViewTableModalMonitoringComponent, {
      disableClose: true,
    });

  }
  editMonitoring(element: any, monitoringId: any) {
    localStorage.setItem("editMonitoring", "editMonitoring");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-monitoring', monitoringId]));


  }

  viewMoreMonitoring(contractId: number) {
    localStorage.setItem("viewMonitoring", "viewMonitoring");
    // console.log("View More inside view--->", localStorage.getItem("viewMonitoring"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-monitoring', contractId]));

  }

  private findTotalAmount() {
    this.totalAmnt = 0;
    this.totalFinancialExeRate = 0;
    this.totalphysicalExeRate = 0;
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      this.totalAmnt = this.totalAmnt + Number.parseFloat(ELEMENT_DATA[i].totbudget);

    }
  }
  openDocumentDialog(budgetProjectName:string) {
    localStorage.setItem("budgetProjectName",budgetProjectName);
    const dialogRef = this.dialog.open(MonitoringDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-monitoring']);
    });
  }
limits:number=0
loadAllData(){
  this.limits=1;
  this.fetchMonitoringData();
    }
  private fetchMonitoringData() {
   
    this.monitoringCrudService.getMonitoringDetails(this.limits).subscribe(data => {
      monitoringDetails = data;
      // console.log("all data ",monitoringDetails)
      monitoringDetails.forEach(e=>{
        // console.log(e.projectNm,e.startDate,e.endDate);
      })
      this.totalRows = monitoringDetails.length;
      /* Add data in MatTableDataSource */
      this.monitoringdataSource = new MatTableDataSource<MonitoringCrudServiceClass>(monitoringDetails);

      /* Set Paginator */
      setTimeout(() =>
        this.monitoringdataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.monitoringdataSource.sort = this.sort
      );
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(monitoringDetails, o.columnProp);
      });
      this.monitoringdataSource.filterPredicate = this.createFilter();
      this.totalAmnt = 0;
      //financialExe slider
      this.minFinanceRate = 0;
      this.maxFinanceRate = 0;
      let minFinanceRateArr = [];
      //physical execution slider
      this.minPhysicalRate = 0;
      this.maxPhysicalRate = 0;
      let physicalRateArray = [];
      //Total budget slider
      this.minBudgetMzn = 0
      this.maxBudgetMzn = 0;
      let totalBudgetMznArray = [];
      /* The below loop is for to find all total amount summation */
      for (let i = 0; i < monitoringDetails.length; i++) {
        this.totalAmnt = this.totalAmnt + Number.parseFloat(monitoringDetails[i].totalBudgetMzn);
        if (monitoringDetails[i].financialExeRateContract != "")
          minFinanceRateArr.push(Number.parseFloat(monitoringDetails[i].financialExeRateContract));
        if (monitoringDetails[i].physicalExeRateContract != "")
          physicalRateArray.push(Number.parseFloat(monitoringDetails[i].physicalExeRateContract));
        if (monitoringDetails[i].totalBudgetMzn != "")
          totalBudgetMznArray.push(Number.parseFloat(monitoringDetails[i].totalBudgetMzn));
        this.proviceFinal.push(monitoringDetails[i].province);
        this.projectName.push(monitoringDetails[i].projectNm)
        if (monitoringDetails[i].province != '')
          this.province.push(monitoringDetails[i].province)
        if (monitoringDetails[i].districts != '')
          this.district.push(monitoringDetails[i].districts)
        if (monitoringDetails[i].province != '')
          this.proviceFinal.push(monitoringDetails[i].province)
        if (monitoringDetails[i].organization != '')
          this.implementingOrg.push(monitoringDetails[i].organization)
        if (monitoringDetails[i].strategicPriorityPQG != '')
          this.strategicPriorityPQG.push(monitoringDetails[i].strategicPriorityPQG)
        if (monitoringDetails[i].strategicObjectivePQG != '')
          this.strategicObjectivePQG.push(monitoringDetails[i].strategicObjectivePQG)
        if (monitoringDetails[i].conditionOfDisbursment != '')
          this.disbursementCondition.push(monitoringDetails[i].conditionOfDisbursment)
        if (monitoringDetails[i].startDate != '')
          this.startDatee.push(monitoringDetails[i].startDate)
        if (monitoringDetails[i].endDate != '')
          this.endDatee.push(monitoringDetails[i].endDate)
        if (monitoringDetails[i].levelOfActionn != '')
        if(this.browserLang=='en'){
          this.levelofAction.push(monitoringDetails[i].levelOfActionn)
        }else{
          this.levelofAction.push(monitoringDetails[i].levelOfActionnPt)
        }
         
      }
      
        
      this.proviceFinal = [...new Set(this.proviceFinal)];
      this.projectName = [...new Set(this.projectName)];
      this.province = [...new Set(this.province)];
      this.district = [...new Set(this.district)];
      this.implementingOrg = [...new Set(this.implementingOrg)];
      this.strategicPriorityPQG = [...new Set(this.strategicPriorityPQG)];
      this.strategicObjectivePQG = [...new Set(this.strategicObjectivePQG)];
      this.disbursementCondition = [...new Set(this.disbursementCondition)];
      this.startDatee = [...new Set(this.startDatee)];
      this.endDatee = [...new Set(this.endDatee)];
      this.levelofAction = [...new Set(this.levelofAction)];

      this.minFinanceRate = Math.min(...minFinanceRateArr);
      this.maxFinanceRate = Math.max(...minFinanceRateArr);

      this.minPhysicalRate = Math.min(...physicalRateArray);
      this.maxPhysicalRate = Math.max(...physicalRateArray);

      this.minBudgetMzn = Math.min(...totalBudgetMznArray);
      this.maxBudgetMzn = Math.max(...totalBudgetMznArray);

      
      let provInLocal=this.province;
      this.province=[];
      console.log("province list for filter ",provInLocal)
      console.log("province in national order ",this.nationalOrderProvince)
      for(let k=0;k<this.nationalOrderProvince.length;k++){
        for(let l=0;l<provInLocal.length;l++){
          // for(let k=0;k<this.nationalOrderProvince.length;k++){
            if(this.nationalOrderProvince[k]==provInLocal[l]){
              this.province.push(provInLocal[l])
            }
          }
          
        }
        console.log("prov aftr ",this.province)
        this.filterSelectObj.filter((o) => {
        if(o.columnProp=='province')
        o.options = this.province;
      });
      // }
    });

  }
  openOptionSearch() {
    this.searchFilter.patchValue('');
    // this.filterSelectObj.filter((o) => {
    //   if (o.columnProp == 'projectNm')
    //     o.options = this.projectName, 'projectNm';
    //   if (o.columnProp == 'province')
    //     o.options = this.province, 'province';
    //   if (o.columnProp == 'districts')
    //     o.options = this.district, 'districts';
    //   if (o.columnProp == 'organization')
    //     o.options = this.implementingOrg, 'organization';
    //   if (o.columnProp == 'strategicPriorityPQG')
    //     o.options = this.strategicPriorityPQG, 'strategicPriorityPQG';
    //   if (o.columnProp == 'strategicObjectivePQG')
    //     o.options = this.strategicObjectivePQG, 'strategicObjectivePQG';
    //   if (o.columnProp == 'conditionOfDisbursment')
    //     o.options = this.disbursementCondition, 'conditionOfDisbursment';
    //   if (o.columnProp == 'startDate')
    //     o.options = this.startDatee, 'startDate';
    //   if (o.columnProp == 'endDate')
    //     o.options = this.endDatee, 'endDate';
    //   if (o.columnProp == 'levelOfActionn')
    //     o.options = this.levelofAction, 'levelOfActionn';
    // });

    //  console.log(this.province)
  }
  chkValue(filter) {

    var searchFilterVal = this.searchFilter.value;

    let columnName = filter.columnProp;

    let province = [];
    let districts = [];
    let projectNm = [];
    let organization = [];
    let strategicObjectivePQG = [];
    let strategicPriorityPQG = [];
    let conditionOfDisbursment = [];
    let startDate = [];
    let endDate = [];
    let levelOfActionn = [];


    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < monitoringDetails.length; i++) {
        if (columnName == 'province') {
          if (this.province.length == 0) {
            if (((monitoringDetails[i].province).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              province.push(monitoringDetails[i].province);
            }
          } else if (this.province.length != 0) {
            if (this.province[i] != undefined) {
              if (((this.province[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                province.push(this.province[i]);
              }
            }
          }
        }
        if (columnName == 'districts') {

          if (this.district.length == 0) {
            if (((monitoringDetails[i].districts).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              districts.push(monitoringDetails[i].districts);
            }

          } else if (this.district.length != 0) {
            if (this.district[i] != undefined) {
              if (((this.district[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                districts.push(this.district[i]);
              }
            }
          }

        } if (columnName == 'projectNm') {
          if (this.projectName.length == 0) {
            if (((monitoringDetails[i].projectNm).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              projectNm.push(monitoringDetails[i].projectNm);
            }
          } else if (this.projectName.length != 0) {
            if (this.projectName[i] != undefined) {
              if (((this.projectName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                projectNm.push(this.projectName[i]);
              }
            }
          }
        }
        if (columnName == 'organization') {
          if (this.implementingOrg.length == 0) {
            if (((monitoringDetails[i].organization).toString().toLowerCase()).indexOf((searchFilterVal.toString()).toLowerCase()) > -1) {
              organization.push(monitoringDetails[i].organization);
            }
          } else if (this.implementingOrg.length != 0) {
            if (this.implementingOrg[i] != undefined) {
              if (((this.implementingOrg[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                organization.push(this.implementingOrg[i]);
              }
            }
          }
        } if (columnName == 'strategicObjectivePQG') {
          if (this.strategicObjectivePQG.length == 0) {
            if (((monitoringDetails[i].strategicObjectivePQG).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              strategicObjectivePQG.push(monitoringDetails[i].strategicObjectivePQG);
            }
          } else if (this.strategicObjectivePQG.length != 0) {
            if (this.strategicObjectivePQG[i] != undefined) {
              if (((this.strategicObjectivePQG[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                strategicObjectivePQG.push(this.strategicObjectivePQG[i]);
              }
            }
          }
        } if (columnName == 'strategicPriorityPQG') {
          if (this.strategicPriorityPQG.length == 0) {
            if (((monitoringDetails[i].strategicPriorityPQG).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              strategicPriorityPQG.push(monitoringDetails[i].strategicPriorityPQG);
            }
          } else if (this.strategicPriorityPQG.length != 0) {
            if (this.strategicPriorityPQG[i] != undefined) {
              if (((this.strategicPriorityPQG[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                strategicPriorityPQG.push(this.strategicPriorityPQG[i]);
              }
            }
          }
        } if (columnName == 'conditionOfDisbursment') {
          if (this.disbursementCondition.length == 0) {
            if (((monitoringDetails[i].conditionOfDisbursment).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              conditionOfDisbursment.push(monitoringDetails[i].conditionOfDisbursment);
            }
          } else if (this.disbursementCondition.length != 0) {
            if (this.disbursementCondition[i] != undefined) {
              if (((this.disbursementCondition[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                conditionOfDisbursment.push(this.disbursementCondition[i]);
              }
            }
          }
        } if (columnName == 'startDate') {
          if (this.startDatee.length == 0) {
            if (((monitoringDetails[i].startDate).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              startDate.push(monitoringDetails[i].startDate);
            }
          } else if (this.startDatee.length != 0) {
            if (this.startDatee[i] != undefined) {
              if (((this.startDatee[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                startDate.push(this.startDatee[i]);
              }
            }
          }
        } if (columnName == 'endDate') {
          if (this.endDatee.length == 0) {
            if (((monitoringDetails[i].endDate).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              endDate.push(monitoringDetails[i].endDate);
            }
          } else if (this.endDatee.length != 0) {
            if (this.endDatee[i] != undefined) {
              if (((this.endDatee[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                endDate.push(this.endDatee[i]);
              }
            }
          }
        } if (columnName == 'levelOfActionn' || columnName == 'levelOfActionnPt') {
          if (this.levelofAction.length == 0) {
            if (((monitoringDetails[i].levelOfActionn).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              if(this.browserLang=='en'){
                levelOfActionn.push(monitoringDetails[i].levelOfActionn);
              }else{
                levelOfActionn.push(monitoringDetails[i].levelOfActionnPt);
              }
             
            }
          } else if (this.levelofAction.length != 0) {
            if (this.levelofAction[i] != undefined) {
              if (((this.levelofAction[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                levelOfActionn.push(this.levelofAction[i]);
              }
            }
          }
        }
      }
      if (columnName == 'province') {
        province = [...new Set(province)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'province') {
            o.options = province, 'province';
          }
        });
      } else if (columnName == 'districts') {
        districts = [...new Set(districts)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'districts') {
            o.options = districts, 'districts';
          }
        });
      } else if (columnName == 'projectNm') {
        projectNm = [...new Set(projectNm)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'projectNm') {
            o.options = projectNm, 'projectNm';
          }
        });
      } else if (columnName == 'strategicObjectivePQG') {
        strategicObjectivePQG = [...new Set(strategicObjectivePQG)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'strategicObjectivePQG') {
            o.options = strategicObjectivePQG, 'strategicObjectivePQG';
          }
        });
      } else if (columnName == 'strategicPriorityPQG') {
        strategicPriorityPQG = [...new Set(strategicPriorityPQG)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'strategicPriorityPQG') {
            o.options = strategicPriorityPQG, 'strategicPriorityPQG';
          }
        });
      } else if (columnName == 'conditionOfDisbursment') {
        conditionOfDisbursment = [...new Set(conditionOfDisbursment)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'conditionOfDisbursment') {
            o.options = conditionOfDisbursment, 'conditionOfDisbursment';
          }
        });
      } else if (columnName == 'startDate') {
        startDate = [...new Set(startDate)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'startDate') {
            o.options = startDate, 'startDate';
          }
        });
      } else if (columnName == 'endDate') {
        endDate = [...new Set(endDate)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'endDate') {
            o.options = endDate, 'endDate';
          }
        });
      } else if (columnName == 'levelOfActionn' || columnName == 'levelOfActionnPt') {
        levelOfActionn = [...new Set(levelOfActionn)];
        this.filterSelectObj.filter((o) => {
          if(this.browserLang=='en'){
            if (o.columnProp == 'levelOfActionn') {
              o.options = levelOfActionn, 'levelOfActionn';
            }
          }else{
            if (o.columnProp == 'levelOfActionnPt') {
              o.options = levelOfActionn, 'levelOfActionnPt';
            }
          }
          
        });
      }
      else if (columnName == 'organization') {
        organization = [...new Set(organization)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'organization') {
            o.options = organization, 'organization';
          }
        });
      }
    }
    if (searchFilterVal.length == 0 && columnName == 'projectNm' && this.projectName.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'projectNm')
          o.options = this.projectName, 'projectNm';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'province' && this.province.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'province')
          o.options = this.province, 'province';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'districts' && this.district.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'districts')
          o.options = this.district, 'districts';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'organization' && this.implementingOrg.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'organization')
          o.options = this.implementingOrg, 'organization';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'strategicPriorityPQG' && this.strategicPriorityPQG.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'strategicPriorityPQG')
          o.options = this.strategicPriorityPQG, 'strategicPriorityPQG';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'strategicObjectivePQG' && this.strategicObjectivePQG.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'strategicObjectivePQG')
          o.options = this.strategicObjectivePQG, 'strategicObjectivePQG';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'conditionOfDisbursment' && this.disbursementCondition.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'conditionOfDisbursment')
          o.options = this.disbursementCondition, 'conditionOfDisbursment';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'startDate' && this.startDatee.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'startDate')
          o.options = this.startDatee, 'startDate';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'endDate' && this.endDatee.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'endDate')
          o.options = this.endDatee, 'endDate';
      });
    }
    if ((searchFilterVal.length == 0 && columnName == 'levelOfActionn' && this.levelofAction.length != 0)|| (searchFilterVal.length == 0 && columnName == 'levelOfActionnPt' && this.levelofAction.length != 0)) {
      this.filterSelectObj.filter((o) => {
        if(this.browserLang == 'en'){
          if (o.columnProp == 'levelOfActionn')
          o.options = this.levelofAction, 'levelOfActionn';
        }else{
          if (o.columnProp == 'levelOfActionnPt')
          o.options = this.levelofAction, 'levelOfActionnPt';
        }
       
      });
    }
    // if (searchFilterVal.length == 0) {
    //   this.filterSelectObj.filter((o) => {
    //     o.options = this.getFilterObject(monitoringDetails, o.columnProp);
    //   });
    // }
    // if (searchFilterVal.length == 0 && columnName== 'districts' && this.di.length!=0) {
    //   this.filterSelectObj.filter((o) => {
    //     o.options = this.di, 'districts';
    //   });
    // }

  }
  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];
  selection = new SelectionModel<MonitoringCrudServiceClass>(true, []);
  selectHandler(row: MonitoringCrudServiceClass) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.monitoringContractId);
    } else {
      let index = this.ids.indexOf(row.monitoringContractId, 0);
      this.ids.splice(index, 1);
    }
  }
  private deletemonitoringByContractId(contractId:number[]){
    this.getValueByLang()
    this.monitoringCrudService.deleteMonitoring(contractId,this.browserLang).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Deleted successfully', '', 'success')
      }else{
        Swal.fire('Apagado com sucesso', '', 'success')
      }
          this.monitoringDeleteAlert(contractId);
          this.fetchMonitoringData();
        });
  }
  openDialog2(budgetPrjNm:string) {
    localStorage.setItem("budgetPrjNm",budgetPrjNm);
    const dialogRef = this.dialog.open(MonitoringDocumentUploadComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['monitoring']);
      // console.log(`Dialog result: ${result}`);
    });
  }
  filterDictionary= new Map<string,_moment.Moment>();
  public dateFilterForm= new FormGroup({
    fromDate: new FormControl({value: null,disabled: false}),
    toDate: new FormControl({value: null,disabled: false}),
});
get fromDate() { return this.dateFilterForm.get('fromDate').value; }
get toDate() { return this.dateFilterForm.get('toDate').value; }

applyDateFilter(dateFilterName:string,ob: _moment.Moment){
  let fromDate = moment(this.dateFilterForm.value.fromDate);
  let toDate =  moment(this.dateFilterForm.value.toDate);
  // fromDate = moment(fromDate).format('DD-MMM-yyyy');
  // toDate = moment(toDate).format('DD-MMM-yyyy');
  // console.log('fromDate:',fromDate);
  // console.log('toDate:',toDate);

    // console.log("Inside");
    if(!fromDate.isValid() && !toDate.isValid()){
      this.monitoringdataSource = new MatTableDataSource(monitoringDetails);
      this.monitoringdataSource.filterPredicate = this.createFilter();
      setTimeout(() => {
        this.monitoringdataSource.paginator = this.paginator;
      });
      return
    }else{
      this.filterDictionary.set(dateFilterName,ob);
      var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.monitoringdataSource.filterPredicate = this.createFilterPredicate;
      this.monitoringdataSource.filter = jsonString;
    }
    
}
createFilterPredicate(data:MonitoringCrudServiceClass, filter:string) {
    
    var map = new Map<string,_moment.Moment>(JSON.parse(filter));
    let isMatch = false;
    for(let [key,value] of map){
      if(key=='startDate'){
        isMatch = moment(value).isSameOrBefore(data[key]);
      } 
      else if(key == 'endDate'){
          isMatch = moment(value).isSameOrAfter(data[key]); 
      }
      if(!isMatch) 
        return false;
    }
    return isMatch;
}

clearToDate(){
  this.dateFilterForm.controls.toDate.reset();
  // console.log('after to date clear:', this.dateFilterForm.value.toDate);
  this.applyDateFilter('end_date',this.dateFilterForm.value.toDate);
}
clearFromDate(){
  this.dateFilterForm.controls.fromDate.reset();
  // console.log('after from date clear:', this.dateFilterForm.value.fromDate);
  this.applyDateFilter('start_date',this.dateFilterForm.value.toDate);
}
}
let monitoringDetails: MonitoringCrudServiceClass[] = [];
export interface PeriodicElement {
  projname: string;
  startdate: string;
  enddate: string;
  totbudget: string;
  levelofact: string;
  prioritypqg: string;
  objpqg: string;
  conddisburse: string;
  province: string;
  district: string;
  financialExeRate: string;
  physicalExeRate: string;
  implementingOrganization: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { projname: 'Project 001 - Health', startdate: '10/03/2021', enddate: '14/03/2021', totbudget: '100000.00', levelofact: 'Central', prioritypqg: 'Strategic Priority PQG 1', objpqg: 'Strategic Objective PQG 1', conddisburse: 'Disbursed amount successfully', province: "CABO DELGADO,GAZA,INHAMBANE", district: "CIDADE DE PEMBA", financialExeRate: '8.6', physicalExeRate: '2.3', implementingOrganization: 'Austria' },
  { projname: 'Project 002 - Education', startdate: '10/03/2021', enddate: '15/03/2021', totbudget: '200000.00', levelofact: 'Provincial', prioritypqg: 'Strategic Priority PQG 1', objpqg: 'Strategic Objective PQG 2', conddisburse: 'Disbursed amount successfully', province: "GAZA", district: "CHIBUTO", financialExeRate: '9.2', physicalExeRate: '2.5', implementingOrganization: 'Denmark' },
  { projname: 'Project 003 - Transport', startdate: '10/03/2021', enddate: '16/03/2021', totbudget: '300000.00', levelofact: 'Central', prioritypqg: 'Strategic Priority PQG 2', objpqg: 'Strategic Objective PQG 1', conddisburse: 'Disbursed amount successfully', province: "INHAMBANE", district: "BILENE", financialExeRate: '7.3', physicalExeRate: '3.3', implementingOrganization: 'France' },
  { projname: 'Project 004 - Communication', startdate: '10/03/2021', enddate: '17/03/2021', totbudget: '400000.00', levelofact: 'Central', prioritypqg: 'Strategic Priority PQG 1', objpqg: 'Strategic Objective PQG 2', conddisburse: 'Disbursed amount successfully', province: "MANICA", district: "BARUE", financialExeRate: '6.8', physicalExeRate: '4.6', implementingOrganization: 'Sweden' },
  { projname: 'Project 001 - Health', startdate: '10/03/2021', enddate: '18/03/2021', totbudget: '500000.00', levelofact: 'Provincial', prioritypqg: 'Strategic Priority PQG 2', objpqg: 'Strategic Objective PQG 1', conddisburse: 'Disbursed amount successfully', province: "NIASSA", district: "CUAMBA", financialExeRate: '8.3', physicalExeRate: '6.8', implementingOrganization: 'Switzerland' },
  { projname: 'Project 002 - Education', startdate: '10/03/2021', enddate: '19/03/2021', totbudget: '600000.00', levelofact: 'Provincial', prioritypqg: 'Strategic Priority PQG 1', objpqg: 'Strategic Objective PQG 2', conddisburse: 'Disbursed amount successfully', province: "SOFALA", district: "ANGONIA", financialExeRate: '7.5', physicalExeRate: '4.5', implementingOrganization: 'Canada' }
];
export enum SelectType {
  single,
  multiple
}