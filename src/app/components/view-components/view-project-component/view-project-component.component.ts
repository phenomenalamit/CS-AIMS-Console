import { ElementRef, ViewChild } from '@angular/core';
import { Component,Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { ProjectDocumentViewComponent } from '../../document-repository/view-document/project-document-view/project-document-view.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { MatSliderChange } from '@angular/material/slider';
import { ProjectCrudService } from 'src/app/Service-Application/project-crud.service';
import { ProjectCrud } from 'src/app/Service-Class/project-crud';
import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectService } from 'src/app/Service/project.service';
import { ProjectDocumentServiceClass } from 'src/app/Service-Class/project-document-service-class';
import { ProjectDocumentUploadComponent } from '../../document-repository/upload-document/project-document-upload/project-document-upload.component';
import { ProjectModel } from 'src/app/Service-Class/project-model';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { DistrictsService } from 'src/app/Service/districts.service';
import { Districts } from 'src/app/Service-Class/districts';
import { ProvincesService } from 'src/app/Service/provinces.service';
import { Provinces } from 'src/app/Service-Class/provinces';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-view-project-component',
  templateUrl: './view-project-component.component.html',
  styleUrls: ['./view-project-component.component.css']
})
export class ViewProjectComponentComponent implements OnInit {

  // displayedColumns: string[] = ['edit',  'projectTitle', 'projectSituation','province','district','implementingOrganizartion', 'ResponsibleOrganization', 'allocatedAmount','allocatedAmountUSD','financialExeAmt','financialExeRate'];
  displayedColumns: string[] = ['select','edit',  'projectTitle', 'projectSituation', 'ResponsibleOrganization', 'allocatedAmount','allocatedAmountUSD','financialExeAmt','financialExeRate'];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  displayedColumnsReadOnly: string[] = [ 'projectTitle', 'projectSituation', 'ResponsibleOrganization', 'projectOverview'];
  dataSource = new MatTableDataSource<Project>(ELEMENT_DATA);
  projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);
  projectTitelArr:string[]=[];
  projectSituationArr:string[]=[];
  responsibleOrgArr:string[]=[];
  province:any=[];
  district:any=[];

  authorised_flag=false;
  nationalOrderProvince:any=[];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  myControl = new FormControl();
  searchFilter = new FormControl('');
  chosenYearDate!: Date;
  usergroup: any;
  userId:number;
  browserLang: any;
  proviceFinal:any = [];
  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,
    private excelService: ExcelService,private router:Router,
    private location: Location,private dialog: MatDialog,private projectService:ProjectService,
    private projectCrudService:ProjectCrudService,private districtsService: DistrictsService,private provincesService: ProvincesService,
  ) { 
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
      this.filterSelectObj = [
        {
          name: 'Project Title',
          columnProp: 'projectTitle',
          options: []
        }, {
          name: 'Project Situation',
          columnProp: 'projectSituation',
          options: []
        }, {
          name: 'Responsible Organization',
          columnProp: 'responsibleOrganization',
          options: []
        },{
          name: 'Province',
          columnProp: 'province',
          options: []
        },{
          name: 'District',
          columnProp: 'district',
          options: []
        }
        // , {
        //   name: 'Implementing Organization',
        //   columnProp: 'implementingOrganizartion',
        //   options: []
        // }
      ];
    }else{
      this.filterSelectObj = [
        {
          name: 'Título do Projecto',
          columnProp: 'projectTitle',
          options: []
        }, {
          name: 'Situação do Projecto',
          columnProp: 'projectSituationPt',
          options: []
        }, {
          name: 'Organização Responsável',
          columnProp: 'responsibleOrganization',
          options: []
        },{
          name: 'Província',
          columnProp: 'province',
          options: []
        },{
          name: 'Distrito',
          columnProp: 'district',
          options: []
        }
      ]
    }
  }
  elements!: NodeListOf<Element>;
  maxExchangeRate:number=20;
  minExchangeRate:number=3;
  filterSelectObj = [];
  filterValues = {};
  maxAlloAmtMzn:number=40000;
  minAlloAmtMzn:number=1000;
  maxAlloAmtUsd:number=40000;
  minAlloAmtUsd:number=3;
  minFinanceAmt:number=1000;
  maxFinanceAmt:number=40000;
  totalAmntMZN:number=0;
  totalAmntUsd:number=0;
  totalFinaceAmt:number=0;
  totalRows:number=0;
  userNameForNotification:string="Charlie Adams";
  userGroupForNotification:string="DNGDP Data Administrator";

  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.setToAuthFlag();
    this.getProjectViewDetails();
    this.findTotalAmount();
    this.setToUserPermission();
    this.getAllDistrict()
    this.getProvinces();
    setTimeout(() =>this.projectDataSource.paginator = this.paginator);
    // this.projectDataSource.paginator = this.paginator;
    setTimeout(() =>this.projectDataSource.sort = this.sort);
  }

  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
  }

  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let prjTitle = [];
    let prjSituation = [];
    let resposibleOrg = [];
    let province=[];
    let district=[];

    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < projectDetails.length; i++) {
        if (columnName == 'projectTitle') {
          if (this.projectTitelArr.length == 0) {
            if (((projectDetails[i].projectTitle).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              prjTitle.push(projectDetails[i].projectTitle);
            }
          } else if (this.projectTitelArr.length != 0) {
            if (this.projectTitelArr[i] != undefined) {
              if (((this.projectTitelArr[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                prjTitle.push(this.projectTitelArr[i]);
              }
            }
          }

        } else if (columnName == 'projectSituation' || columnName == 'projectSituationPt') {
          if (this.projectSituationArr.length == 0) {
            if (((projectDetails[i].projectSituation).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              if(this.browserLang == 'en'){
                prjSituation.push(projectDetails[i].projectSituation);
              }else{
                prjSituation.push(projectDetails[i].projectSituationPt);
              }
              
            }
          } else if (this.projectSituationArr.length != 0) {
            if (this.projectSituationArr[i] != undefined) {
              if (((this.projectSituationArr[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                prjSituation.push(this.projectSituationArr[i]);
              }
            }
          }
        } else if (columnName == 'responsibleOrganization') {
          if (this.responsibleOrgArr.length == 0) {
            if (((projectDetails[i].responsibleOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              resposibleOrg.push(projectDetails[i].responsibleOrganization);
            }
          }
          else if (this.responsibleOrgArr.length != 0) {
            if (this.responsibleOrgArr[i] != undefined) {
              if (((this.responsibleOrgArr[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                resposibleOrg.push(this.responsibleOrgArr[i]);

              }
            }
          }
        }else if (columnName == 'province') {
          
          if (this.province.length == 0) {
            for(let k=0;k<this.allProvinceList.length;k++){
              if(this.allProvinceList[k] !=undefined){
              if (((this.allProvinceList[k]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                province.push(this.allProvinceList[k]);
              }
            }
            }
           
          }
          else if (this.province.length != 0) {
            if (this.province[i] != undefined) {
              if (((this.province[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                province.push(this.province[i].trim());

              }
            }
          }
        }else if (columnName == 'district') {
          if (this.district.length == 0) {
            this.allDistrictList= [...new Set(this.allDistrictList)];
            for(let k=0;k<this.allDistrictList.length;k++){
              if(this.allDistrictList[k]!=undefined){
            if (((this.allDistrictList[k]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              district.push(this.allDistrictList[k]);
            }
          }
          }
          }
          else if (this.district.length != 0) {
            if (this.district[i] != undefined) {
              if (((this.district[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                district.push(this.district[i]);

              }
            }
          }
        }
      }
    }
    if (columnName == 'projectTitle') {
      prjTitle = [...new Set(prjTitle)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'projectTitle') {
          o.options = prjTitle, 'projectTitle';

        }
      });
    } if (columnName == 'projectSituation') {
      prjSituation = [...new Set(prjSituation)];
      this.filterSelectObj.filter((o) => {
        if(this.browserLang=='en'){
          if (o.columnProp == 'projectSituation') {
            o.options = prjSituation, 'projectSituation';
          }
        }else{
          if (o.columnProp == 'projectSituationPt') {
            o.options = prjSituation, 'projectSituationPt';
          }
        }
        
      });
    } if (columnName == 'responsibleOrganization') {
      resposibleOrg = [...new Set(resposibleOrg)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'responsibleOrganization') {
          o.options = resposibleOrg, 'responsibleOrganization';
        }
      });
    }
    if (columnName == 'province') {
      province = [...new Set(province)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'province') {
          o.options = province, 'province';
        }
      });
    }
    if (columnName == 'district') {
      district = [...new Set(district)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'district') {
          o.options = district, 'district';
        }
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'projectTitle' && this.projectTitelArr.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'projectTitle')
          o.options = this.projectTitelArr, 'projectTitle';
      });
    }
    if ((searchFilterVal.length == 0 && columnName == 'projectSituation' && this.projectSituationArr.length != 0) || (searchFilterVal.length == 0 && columnName == 'projectSituationPt' && this.projectSituationArr.length != 0)) {
      this.filterSelectObj.filter((o) => {
        if(this.browserLang=='en'){
          if (o.columnProp == 'projectSituation')
          o.options = this.projectSituationArr, 'projectSituation';
        }else{
          if (o.columnProp == 'projectSituationPt')
          o.options = this.projectSituationArr, 'projectSituationPt';
        }
        
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'responsibleOrganization' && this.responsibleOrgArr.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'responsibleOrganization')
          o.options = this.responsibleOrgArr, 'responsibleOrganization';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'province' && this.province.length != 0) {
      let prov=[];
      for(let k=0;k<this.province.length;k++){
        if(this.province[k] !=undefined)
        prov.push(this.province[k].trim())
      }
      prov = [...new Set(prov)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'province')
          o.options = prov, 'province';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'district' && this.district.length != 0) {
      let district=[];
      for(let k=0;k<this.district.length;k++){
        if(this.district[k] !=undefined)
        district.push(this.district[k].trim())
      }
      district = [...new Set(district)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'district')
          o.options = district, 'district';
      });
    }
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Project List')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Project List'){
        this.authorised_flag=true;
      }
    }
  }

  public ExportTOExcel() {
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Project');
   //this.excelService.exportTableElmToExcel(this.epltable, 'Project');

  }
  // ngAfterViewInit(){
  //   this.excelService.exportTableElmToExcel(this.epltable, 'Project');
  // }

  applyFilter(filterValue: string) {
    this.projectDataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.projectDataSource.filter);
    if (this.projectDataSource.paginator) {
      this.projectDataSource.paginator.firstPage();
    }
    this.totalAmntUsd=0;
    this.totalRows=0;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalFinaceAmt=0;
    for(let i=0;i<this.projectDataSource.filteredData.length;i++){
      if(this.projectDataSource.filteredData[i].totalAmountMzn!=null && this.projectDataSource.filteredData[i].totalAmountMzn!=undefined){
        this.totalAmntMZN=((+this.totalAmntMZN)+(+this.projectDataSource.filteredData[i].totalAmountMzn));
      }
      else{
        this.totalAmntMZN=this.totalAmntMZN+0;
      }
      if(this.projectDataSource.filteredData[i].totalAmountUsd!=null && this.projectDataSource.filteredData[i].totalAmountUsd!=undefined){
        this.totalAmntUsd=((+this.totalAmntUsd)+(+this.projectDataSource.filteredData[i].totalAmountUsd));
      }
      else{
        this.totalAmntUsd=this.totalAmntUsd+0;
      }
      if(this.projectDataSource.filteredData[i].financialExecutionAmount!=null && this.projectDataSource.filteredData[i].financialExecutionAmount!=undefined){
        this.totalFinaceAmt=((+this.totalFinaceAmt)+(+this.projectDataSource.filteredData[i].financialExecutionAmount));
      }
      else{
        this.totalFinaceAmt=this.totalFinaceAmt+0;
      }
    }
    this.totalRows=this.totalRows+this.projectDataSource.filteredData.length;
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {

        uniqChk.push(obj[key]);
      }
      return obj;
    });
    uniqChk.sort(function (a, b) {
      return a.localeCompare(b); //using String.prototype.localCompare()
    });
    if(key ==='allocatedAmount' || key ==='allocatedAmountUSD'){
      uniqChk.sort(function(a, b) {
        return a - b;
      });
    }
    return uniqChk;
  }

  /* Reset table filters */
  resetFilters() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

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
        let prov=[];
        let district=[]
        this.proviceFinal = [];
        console.log("prov->this.province",this.province);
        for(let k=0;k<this.province.length;k++){
          if(this.province[k] !=undefined)
          prov.push(this.province[k].trim())  
        }
        for(let k=0;k<this.district.length;k++){
          if(this.district[k] !=undefined)
          district.push(this.district[k].trim())
        }
        district = [...new Set(district)];
        for(let j=0;j<district.length;j++){
          if(this.districtList.length !=0){
            for(let i=0;i<this.districtList.length;i++){
              if(district[j] == this.districtList[i].districts_name){
                let provId=this.districtList[i].provinces_id;
                if(this.provinceList1.length !=0){
                  for(let k=0;k<this.provinceList1.length;k++){
                    if(Number.parseInt(provId)==this.provinceList1[k].provinces_id){
                      this.proviceFinal.push(this.provinceList1[k].provinces_name)
                    }
                  }
                }
              }
              }
            }
        }
        // for (let k = 0; k < projectDetails.length; k++) {
        //   this.proviceFinal.push(projectDetails[k].province)
        // }
        this.proviceFinal = [...new Set(this.proviceFinal)];
        prov = [...new Set(prov)];
        console.log("prov",prov);
        district = [...new Set(district)];
        this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(projectDetails, o.columnProp);
        if(o.columnProp=='province'){
          o.options = prov;
        }
        console.log("dist ",district)
        if(o.columnProp=='district'){
          o.options = district;
        }
        
      });
      this.filterSelectObj.filter((o) => {
        if(o.columnProp=='district'){
          console.log("dist final ",o.options)
        }
      });
      for(let i=0;i<projectDetails.length;i++){
        this.projectTitelArr.push(projectDetails[i].projectTitle);
        if(this.browserLang == 'en'){
        this.projectSituationArr.push(projectDetails[i].projectSituation);
        }else{
          this.projectSituationArr.push(projectDetails[i].projectSituationPt);
        }
        this.responsibleOrgArr.push(projectDetails[i].responsibleOrganization);
        // let prov=projectDetails[i].province.split("-");
        // this.allProvinceList.push(prov.forEach(e=>{this.allProvinceList.push(e)}))
        // // this.district.push(projectDetails[i].district)

        //let district=projectDetails[i].district.split("-");
        //.allDistrictList.push(district.forEach(e=>{this.allDistrictList.push(e)}))
      }
      // this.allProvinceList = [...new Set( this.allProvinceList)];
      // this.province = this.allProvinceList;
      // this.allDistrictList = [...new Set( this.allDistrictList)];
      // this.district = this.allDistrictList;

      // this.projectTitelArr = [...new Set(this.projectTitelArr)];
      // this.projectSituationArr = [...new Set(this.projectSituationArr)];
      // this.responsibleOrgArr = [...new Set(this.responsibleOrgArr)];
      // this.province = [...new Set(this.province)];
      // this.district = [...new Set(this.district)];
        }
    }
    
    let nameSearch = () => {
        let found = false;
        let checkIn = 0;
          let total = 0;
        if (isFilterSet) {
        for (const col in searchTerms) {
          total++;
          ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
            this.projectTitelArr=[];
            this.projectSituationArr=[];
            this.responsibleOrgArr=[];
            this.province=[];
            this.district=[];
            this.proviceFinal = [];
              let spl = word.split(",");
              for(let i=0;i<spl.length;i++)
              {
                 /* adding Running filter start */

                for (let j = 0; j < projectDetails.length; j++) {
                
                  if (col == 'projectTitle') {
                    if(projectDetails[j].projectTitle != null){
                      if (spl[i].toLowerCase() == (projectDetails[j].projectTitle).toString().toLowerCase()) {
                        if(projectDetails[j].projectSituation !=""){
                          if(this.browserLang == 'en'){
                            this.projectSituationArr.push(projectDetails[j].projectSituation);
                            }else{
                              this.projectSituationArr.push(projectDetails[j].projectSituationPt);
                            }
                          
                        }
                        this.responsibleOrgArr.push(projectDetails[j].responsibleOrganization);
                        //let prov=projectDetails[j].province.split("-");
                        //this.province.push(prov.forEach(e=>{this.province.push(e)}))
                        // this.district.push(projectDetails[j].district)
                        //let district=projectDetails[j].district.split("-");
                        //this.district.push(district.forEach(e=>{this.district.push(e)}))
                        // for (let c = 0; c < district.length; c++) {
                        //   if (this.districtList.length != 0) {
                        //     for (let a = 0; a < this.districtList.length; a++) {
                        //       if (district[c] == this.districtList[a].districts_name) {
                        //         let provId = this.districtList[a].provinces_id;
                        //         if (this.provinceList1.length != 0) {
                        //           for (let b = 0; b < this.provinceList1.length; b++) {
                        //             if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                        //               this.proviceFinal.push(this.provinceList1[b].provinces_name)
                        //             }
                        //           }
                        //         }
                        //       }
                        //     }
                        //   }
                        // }
                      }
                    }
                   
                  }else if(col == 'projectSituation' || col== 'projectSituationPt'){
                    if(projectDetails[j].projectSituation !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].projectSituation).toString().toLowerCase()) {
                        if(projectDetails[j].projectTitle !=""){
                          this.projectTitelArr.push(projectDetails[j].projectTitle);
                        }
                        this.responsibleOrgArr.push(projectDetails[j].responsibleOrganization);
                        //let prov=projectDetails[j].province.split("-");
                        //this.province.push(prov.forEach(e=>{this.province.push(e)}))
                        // this.district.push(projectDetails[j].district)
                        //let district=projectDetails[j].district.split("-");
                        //this.district.push(district.forEach(e=>{this.district.push(e)}))
                        // for (let c = 0; c < district.length; c++) {
                        //   if (this.districtList.length != 0) {
                        //     for (let a = 0; a < this.districtList.length; a++) {
                        //       if (district[c] == this.districtList[a].districts_name) {
                        //         let provId = this.districtList[a].provinces_id;
                        //         if (this.provinceList1.length != 0) {
                        //           for (let b = 0; b < this.provinceList1.length; b++) {
                        //             if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                        //               this.proviceFinal.push(this.provinceList1[b].provinces_name)
                        //             }
                        //           }
                        //         }
                        //       }
                        //     }
                        //   }
                        // }
                      }
                    }
                    
                  }else if(col == 'responsibleOrganization'){
                   
                    if(projectDetails[j].responsibleOrganization !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].responsibleOrganization).toString().toLowerCase()) {
                        this.projectTitelArr.push(projectDetails[j].projectTitle);
                        //let prov=projectDetails[j].province.split("-");
                        //this.province.push(prov.forEach(e=>{this.province.push(e)}))
                        //let district=projectDetails[j].district.split("-");
                        //this.district.push(district.forEach(e=>{this.district.push(e)}))
                        if(this.browserLang == 'en'){
                          this.projectSituationArr.push(projectDetails[j].projectSituation);
                          }else{
                            this.projectSituationArr.push(projectDetails[j].projectSituationPt);
                          }
                          // for (let c = 0; c < district.length; c++) {
                          //   if (this.districtList.length != 0) {
                          //     for (let a = 0; a < this.districtList.length; a++) {
                          //       if (district[c] == this.districtList[a].districts_name) {
                          //         let provId = this.districtList[a].provinces_id;
                          //         if (this.provinceList1.length != 0) {
                          //           for (let b = 0; b < this.provinceList1.length; b++) {
                          //             if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                          //               this.proviceFinal.push(this.provinceList1[b].provinces_name)
                          //             }
                          //           }
                          //         }
                          //       }
                          //     }
                          //   }
                          // }
                      }
                    }
                  }else if(col == 'province'){
                    if(projectDetails[j].province !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].province).toString().toLowerCase()) {
                        this.responsibleOrgArr.push(projectDetails[j].responsibleOrganization);
                        this.projectTitelArr.push(projectDetails[j].projectTitle);
                        if(this.browserLang == 'en'){
                          this.projectSituationArr.push(projectDetails[j].projectSituation);
                          }else{
                            this.projectSituationArr.push(projectDetails[j].projectSituationPt);
                          }
                          // this.district.push(projectDetails[j].district)
                          let district=projectDetails[j].district.split("-");
                          this.district.push(district.forEach(e=>{this.district.push(e)}))
                          for (let c = 0; c < district.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (district[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                      }
                    }
                    
                  }else if(col == 'district'){
                    if(projectDetails[j].district !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].district).toString().toLowerCase()) {
                        this.responsibleOrgArr.push(projectDetails[j].responsibleOrganization);
                        this.projectTitelArr.push(projectDetails[j].projectTitle);
                        if(this.browserLang == 'en'){
                          this.projectSituationArr.push(projectDetails[j].projectSituation);
                          }else{
                            this.projectSituationArr.push(projectDetails[j].projectSituationPt);
                          }
                          //let prov=projectDetails[j].province.split("-");
                          //let district=projectDetails[j].district.split("-");
                        //this.province.push(prov.forEach(e=>{this.province.push(e)}))
                        // for (let c = 0; c < district.length; c++) {
                        //   if (this.districtList.length != 0) {
                        //     for (let a = 0; a < this.districtList.length; a++) {
                        //       if (district[c] == this.districtList[a].districts_name) {
                        //         let provId = this.districtList[a].provinces_id;
                        //         if (this.provinceList1.length != 0) {
                        //           for (let b = 0; b < this.provinceList1.length; b++) {
                        //             if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                        //               this.proviceFinal.push(this.provinceList1[b].provinces_name)
                        //             }
                        //           }
                        //         }
                        //       }
                        //     }
                        //   }
                        // }
                      }
                    }
                    
                  }
                }
                /* adding Running filter end */
               if(data[col] !=null){
                if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                  found = true;
                  checkIn++;
              }
            }
              
                
              }
            });
        }
        this.projectTitelArr = [...new Set(this.projectTitelArr)];
        this.projectSituationArr = [...new Set(this.projectSituationArr)];
        this.responsibleOrgArr = [...new Set(this.responsibleOrgArr)];
        this.province=[...new Set(this.province)];
        console.log("this.province without district",this.province);
        this.district=[...new Set(this.district)];
        let district=this.district;
        this.district=[];
        console.log("district",district);
        for(let k=0;k<district.length;k++)
        {
          if(district[k]!==undefined)
          this.district.push(district[k].trim());
        }
        console.log("this.district",this.district);
        this.proviceFinal = [...new Set(this.proviceFinal)];
      this.district=[...new Set(this.district)];
       if(this.projectTitelArr.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'projectTitle') {
            o.options = this.projectTitelArr, 'projectTitle';
          }
        });
      }
      if(this.province.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'province') {
            o.options = this.province, 'province';
          }
        });
      }
      if(this.district.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'district') {
            o.options = this.district, 'district';
          }
        });
      }
        if(this.projectSituationArr.length !=0){
            this.filterSelectObj.filter((o) => {
              if(this.browserLang == 'en'){
              if (o.columnProp == 'projectSituation') {
                o.options = this.projectSituationArr, 'projectSituation';
              }
            }else{
              if (o.columnProp == 'projectSituationPt') {
                o.options = this.projectSituationArr, 'projectSituationPt';
              }
            }
            });
          }
    if(this.responsibleOrgArr.length !=0){
          this.filterSelectObj.filter((o) => {
            if (o.columnProp == 'responsibleOrganization') {
              o.options = this.responsibleOrgArr, 'responsibleOrganization';
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

  totalAmnt:any;
  checkedFilterColumn:any={};
  filterChange(filter, event) {
    //this.amnt_flag=true;
    this.filterValues[filter.columnProp] = event.value
    this.projectDataSource.filter = JSON.stringify(this.filterValues)
    this.totalAmnt=0;
    this.totalAmntUsd=0;
    this.totalAmntMZN=0;
    this.totalFinaceAmt=0;
    for(let i=0;i<this.projectDataSource.filteredData.length;i++){
      if(this.projectDataSource.filteredData[i].totalAmountMzn!=null && this.projectDataSource.filteredData[i].totalAmountMzn!=undefined){
        this.totalAmntMZN=((+this.totalAmntMZN)+(+this.projectDataSource.filteredData[i].totalAmountMzn));
      }
      else{
        this.totalAmntMZN=this.totalAmntMZN+0;
      }
      if(this.projectDataSource.filteredData[i].totalAmountUsd!=null && this.projectDataSource.filteredData[i].totalAmountUsd!=undefined){
        this.totalAmntUsd=((+this.totalAmntUsd)+(+this.projectDataSource.filteredData[i].totalAmountUsd));
      }
      else{
        this.totalAmntUsd=this.totalAmntUsd+0;
      }
      if(this.projectDataSource.filteredData[i].financialExecutionAmount!=null && this.projectDataSource.filteredData[i].financialExecutionAmount!=undefined){
        this.totalFinaceAmt=((+this.totalFinaceAmt)+(+this.projectDataSource.filteredData[i].financialExecutionAmount));
      }
      else{
        this.totalFinaceAmt=this.totalFinaceAmt+0;
      }
    }
    this.totalRows=this.projectDataSource.filteredData.length;

    this.checkedFilterColumn=this.projectDataSource.filter;

  }

  fundingList: FinancialAgreement[];
  fundingLists:number[]=[];
  allProvinceList:any=[]
  allDistrictList:any=[]
  provName: any;
  districtList:Districts[];
  private getAllDistrict(){
    this.districtsService.getAllDistrictURL().subscribe(data => {
      this.districtList = data;
    });
  }
  provinceList1: Provinces[] = [];
  private getProvinces() {
    this.provincesService.getProvincesList().subscribe((data) => {
      this.provinceList1 = data;     
      for(let i=0;i<this.provinceList1.length;i++)
      {
        this.nationalOrderProvince.push(this.provinceList1[i].provinces_name);
      }
    });
  }
  provinceNm(district: string) {
    if(this.districtList!==undefined){
    if(this.districtList.length !=0){
      for(let i=0;i<this.districtList.length;i++){
        if(district == this.districtList[i].districts_name){
          let provId=this.districtList[i].provinces_id;
          if(this.provinceList1.length !=0){
            for(let k=0;k<this.provinceList1.length;k++){
              if(Number.parseInt(provId)==this.provinceList1[k].provinces_id){
                this.provName=this.provinceList1[k].provinces_name
              }
            }
          }
          
        }
      }
    }
  }
    // for (let i = 0; i < projectDetails.length; i++) {
    //   let dist = projectDetails[i].district.split("-");
    //   for (let k = 0; k < dist.length; k++) {
    //     if (dist[k] != '') {
    //       if (district === dist[k]) {
    //         this.provName = projectDetails[i].province;
    //       }
    //     }
    //   }
    // }
    //  console.log("chk  ", this.provName);
    // console.log("chk2  ",provinceName);
    
    return this.provName;
  }
  limits:number=0;
  loadAllData(){
    this.limits=1;
    this.getProjectViewDetails();
      }
  private getProjectViewDetails(){
    this.totalRows=0;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalAmntUsd=0;
    this.totalFinaceAmt=0;
    // var limits=$("#limitDropDown").val();
    // if(limits==undefined)
    //   limits=0;
    // var arr = new Array();
    this.projectCrudService.getProjectViewDetails(this.limits).toPromise().then(data=>{
      projectDetails=data;

      projectDetails=data;
      console.log("length:-->"+projectDetails.length);
      console.log('All Project datas are--->',projectDetails);
      this.projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);
      (projectDetails.length==null)?this.totalRows=0:this.totalRows=projectDetails.length;
      
      /* Set Paginator */
      setTimeout(() =>
        this.projectDataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.projectDataSource.sort = this.sort
      );
      

      this.projectDataSource.filterPredicate = this.createFilter();
      for(let i=0;i<projectDetails.length;i++){
        this.projectTitelArr.push(projectDetails[i].projectTitle);
        if(this.browserLang == 'en'){
          this.projectSituationArr.push(projectDetails[i].projectSituation);
        }else{
          this.projectSituationArr.push(projectDetails[i].projectSituationPt);
        }
        
        this.responsibleOrgArr.push(projectDetails[i].responsibleOrganization);
        // this.province.push(projectDetails[i].province);
        // this.district.push(projectDetails[i].district);
        if(projectDetails[i].totalAmountMzn!=null && projectDetails[i].totalAmountMzn!=undefined){
          this.totalAmntMZN=((+this.totalAmntMZN)+(+projectDetails[i].totalAmountMzn));
        }
        else{
          this.totalAmntMZN=this.totalAmntMZN+0;
        }
        if(projectDetails[i].totalAmountUsd!=null && projectDetails[i].totalAmountUsd!=undefined){
          this.totalAmntUsd=((+this.totalAmntUsd)+(+projectDetails[i].totalAmountUsd));
        }
        else{
          this.totalAmntUsd=this.totalAmntUsd+0;
        }
        if(projectDetails[i].financialExecutionAmount!=null && projectDetails[i].financialExecutionAmount!=undefined){
          this.totalFinaceAmt=((+this.totalFinaceAmt)+(+projectDetails[i].financialExecutionAmount));
        }
        else{
          this.totalFinaceAmt=this.totalFinaceAmt+0;
        }
      }
      this.projectTitelArr = [...new Set(this.projectTitelArr)];
      this.projectSituationArr = [...new Set(this.projectSituationArr)];
      this.responsibleOrgArr = [...new Set(this.responsibleOrgArr)];
      
      // this.projectCrudService.getFinancialAgreementIdAndNamesByUserAccess(this.userId).toPromise().then(projData=>{
      //   this.fundingList = projData;
      //   this.fundingList.forEach(funding=>{
      //     this.fundingLists.push(funding.funding_id);
      //   });
        
        // for (let i = 0; i < projectDetails.length; i++) {
        //   projectDetails[i].emailChk = false;
        //   if (projectDetails[i].projectFinancialAgreementBean != null && projectDetails[i].projectFinancialAgreementBean.length > 0) {
        //     for (let j=0;j<projectDetails[i].projectFinancialAgreementBean.length;j++) {
        //       for (let k=0;k<this.fundingLists.length;k++) {
        //         if(projectDetails[i].projectFinancialAgreementBean[j].idFinanceAgreement == this.fundingLists[k])
        //           projectDetails[i].emailChk = true;
        //       }
        //     }
        //   }
        // }
        // try{
        //   $('#limitDropDown').find('option').remove();
        //   arr.forEach(str=>{
        //     console.log(str);
        //     $("#limitDropDown").append('<option value="'+str+'">'+str+'</option>');
        //   });
        //   $("#limitDropDown").val(projectDetails.length);
        // }
        // catch(e)
        // {console.error('while ploting in dropdown')}
      // });
      
      for (let i = 0; i < projectDetails.length; i++) {
        //let prov=projectDetails[i].province.split("-");
        //this.allProvinceList.push(prov.forEach(e=>{this.allProvinceList.push(e)}))

        //let district=projectDetails[i].district.split("-");
        //this.allDistrictList.push(district.forEach(e=>{this.allDistrictList.push(e)}))
        // (projectDetails[i].province != '')
        // this.proviceFinal.push(prov.forEach(e=>{this.proviceFinal.push(e)}));
      }
      
      // this.allProvinceList = [...new Set( this.allProvinceList)];
      // this.allDistrictList=[...new Set( this.allDistrictList)];
      
      // this.province = this.allProvinceList;
      // let provInLocal=this.province;
      // this.province=[];
      // console.log("province list for filter ",provInLocal)
      // console.log("province in national order ",this.nationalOrderProvince)
      // for(let k=0;k<this.nationalOrderProvince.length;k++){
      //   for(let l=0;l<provInLocal.length;l++){
      //     // for(let k=0;k<this.nationalOrderProvince.length;k++){
      //       if(this.nationalOrderProvince[k]==provInLocal[l]){
      //         this.province.push(provInLocal[l])
      //       }
      //     }
          
      //   }
      //   console.log("prov aftr ",this.province)
      // this.district=this.allDistrictList
      // this.allProvinceList=[]
      // this.allDistrictList=[]
      // for(let k=0;k<this.province.length;k++){
      //   if(this.province[k] !=undefined){
      //   this.allProvinceList.push(this.province[k].trim())
      //   }
        
      // }
      // for(let k=0;k<this.district.length;k++){
      //   if(this.district[k] !=undefined){
      //     this.allDistrictList.push(this.district[k].trim())
      //     }
      // }
      // this.district=[]
      // this.district=this.allDistrictList
      // console.log("prov ",this.allProvinceList)
      // this.filterSelectObj.filter((o) => {
      //   o.options = this.getFilterObject(projectDetails, o.columnProp);
      //   if(o.columnProp=='province'){
      //     this.allProvinceList = [...new Set( this.allProvinceList)];
      //     o.options = this.allProvinceList;
      //   }
      //   if(o.columnProp=='district'){
      //   this.allDistrictList = [...new Set( this.allDistrictList)];
      //   o.options = this.allDistrictList;
      //   }
        
      // });
      // this.proviceFinal=this.allProvinceList;
      //   console.log("provfinal ",this.proviceFinal)
      //this.province=[...new Set(this.province)];
      //this.district=[...new Set(this.district)];
      //console.log(projectDetails);
      //console.log("this.district ",this.district);
    //});
    });
  }

  private deleteProjectById(projectId:number[]){
    this.totalRows=0;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalAmntUsd=0;
    this.totalFinaceAmt=0;
    this.getValueByLang();
    this.projectCrudService.deleteProjectByIds(projectId,this.browserLang).subscribe(data=>{
      this.deleteProjectAlert(projectId);
      
      projectDetails=data;
      this.projectDataSource=new MatTableDataSource<ProjectCrud>(projectDetails);
      // Swal.fire('Deleted Successfully!', '', 'success');
      this.totalRows=projectDetails.length;
      for(let i=0;i<projectDetails.length;i++){
        if(projectDetails[i].totalAmountMzn!=null && projectDetails[i].totalAmountMzn!=undefined){
          this.totalAmntMZN=((+this.totalAmntMZN)+(+projectDetails[i].totalAmountMzn));
        }
        else{
          this.totalAmntMZN=this.totalAmntMZN+0;
        }
        if(projectDetails[i].totalAmountUsd!=null && projectDetails[i].totalAmountUsd!=undefined){
          this.totalAmntUsd=((+this.totalAmntUsd)+(+projectDetails[i].totalAmountUsd));
        }
        else{
          this.totalAmntUsd=this.totalAmntUsd+0;
        }
        if(projectDetails[i].financialExecutionAmount!=null && projectDetails[i].financialExecutionAmount!=undefined){
          this.totalFinaceAmt=((+this.totalFinaceAmt)+(+projectDetails[i].financialExecutionAmount));
        }
        else{
          this.totalFinaceAmt=this.totalFinaceAmt+0;
        }
      }
      /* Set Paginator */
      setTimeout(() =>
        this.projectDataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.projectDataSource.sort = this.sort
      );
      // projectId.forEach( id => {
      //   let projectData: ProjectModel = new ProjectModel();
      //   projectData.ID_PROJECT = id;
      //   this.projectCrudService.InactivateToMozgis(projectData).subscribe(retriveData=>{
      //     console.log('InactivateToMozgis retriveData:',retriveData);
      //   });
      // })
    });
  }

  //for notification alert, execute on delete disbursement
  deleteProjectAlert(ids:number[]) {
    let todayTime = new Date();
    // let projectTitle=this.findProjTitelById(id);
    // let referenceId=this.findReferenceById(id);\
    let projectTitleArr:string[] = [];
    let referenceIdArr:string[] = [];

    ids.forEach(id => {
      let projectTitle=this.findProjTitelById(id);
      projectTitleArr.push(projectTitle);
      let referenceId=this.findReferenceById(id);
      referenceIdArr.push(referenceId);
    });
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete project on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Project Reference ID  "'
      +projectTitleArr
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Project Name "'
      +projectTitleArr
      +'" with Reference ID "'
      +referenceIdArr
      +'" respectively has been deleted by user "'+this.userNameForNotification+'" in AIMS on "'
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
  private findProjTitelById(id:number):string{
    let projectTitel:string=null;
    for(let i=0;i<projectDetails.length;i++){
      if(projectDetails[i].projectId==id){
        projectTitel=projectDetails[i].projectTitle;
      }
    }
    return projectTitel;
  }

  //for notification alert
  private findReferenceById(id:number):string{
    let reference:string=null;
    for(let i=0;i<projectDetails.length;i++){
      if(projectDetails[i].projectId==id){
        reference=projectDetails[i].eSnipId;
      }
    }
    return reference;
  }

  moveToSelectedTab(projectId: any) {
    //localStorage.setItem("EditProject", "EditProject");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-project',projectId])
    );
  }
  moveToSelectedTab1(tabName: string) {

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/project']));
    // console.log("after route");
    this.location.back();
  }
  generateExcel(){
    
    let prjId=[];
for(let i=0;i<this.projectDataSource.filteredData.length;i++){
  prjId.push(this.projectDataSource.filteredData[i].projectId)
}
  window.open(environment.downloadProjectDetailsExcel+prjId+'/'+btoa(this.checkedFilterColumn),'_self')
    // console.log("123456");
    // let obj = new ViewProjectComponentComponent(this._document,this.excelService,this.router,this.location,this.dialog,this.projectCrudService);
    // obj.ExportTOExcel();
    // this.ngAfterViewInit();
    // window.open(environment.downloadProjectDetailsExcel, '_self');
  }
  // get totalRows(): number {
  //   return ELEMENT_DATA.length;
  // }
  viewMoreProject(viewProjectId: any) {
    // localStorage.setItem("ViewMoreProject", "ViewMoreProject");
    // console.log("View More inside view--->", localStorage.getItem("ViewMoreProject"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-project',viewProjectId]));

  }

  opensweetalert() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
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
          this.deleteProjectById(this.ids);
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
      })
    }else{
      if(this.browserLang=='en')
      Swal.fire('Select at least one record');
      else
      Swal.fire('Seleccione pelo menos um registo');
    }
    
  }

  minfinancialVal:number=0;
  totalFinancialExeRate:number=0;
  onInputFinancial(event: MatSliderChange) {
    //console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.projectDataSource.data = projectDetails;
    const from = this.minfinancialVal;
    //this.projectDataSource.data = this.projectDataSource.data.filter(e => Number.parseFloat((e.financialExeRate).toString()) >= from && Number.parseFloat((e.financialExeRate).toString()) <= event.value);
    this.totalRows = this.projectDataSource.data.length;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalAmntUsd=0;
    this.totalFinaceAmt=0;
    /* The below loop is for to find all total amount and total usd amount summation */
    for (let i = 0; i < this.projectDataSource.data.length; i++) {
      if(this.projectDataSource.filteredData[i].totalAmountMzn!=null && this.projectDataSource.filteredData[i].totalAmountMzn!=undefined){
        this.totalAmntMZN=((+this.totalAmntMZN)+(+this.projectDataSource.filteredData[i].totalAmountMzn));
      }
      else{
        this.totalAmntMZN=this.totalAmntMZN+0;
      }
      if(this.projectDataSource.filteredData[i].totalAmountUsd!=null && this.projectDataSource.filteredData[i].totalAmountUsd!=undefined){
        this.totalAmntUsd=((+this.totalAmntUsd)+(+this.projectDataSource.filteredData[i].totalAmountUsd));
      }
      else{
        this.totalAmntUsd=this.totalAmntUsd+0;
      }
      if(this.projectDataSource.filteredData[i].financialExecutionAmount!=null && this.projectDataSource.filteredData[i].financialExecutionAmount!=undefined){
        this.totalFinaceAmt=((+this.totalFinaceAmt)+(+this.projectDataSource.filteredData[i].totalAmountUsd));
      }
      else{
        this.totalFinaceAmt=this.totalFinaceAmt+0;
      }
    }
  }

  private findTotalAmount(){
    this.totalAmntUsd=0;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalFinaceAmt=0;
    for(let i=0;i<this.projectDataSource.data.length;i++){
      if(this.projectDataSource.filteredData[i].totalAmountMzn!=null && this.projectDataSource.filteredData[i].totalAmountMzn!=undefined){
        this.totalAmntMZN=((+this.totalAmntMZN)+(+this.projectDataSource.filteredData[i].totalAmountMzn));
      }
      else{
        this.totalAmntMZN=this.totalAmntMZN+0;
      }
      if(this.projectDataSource.filteredData[i].totalAmountUsd!=null && this.projectDataSource.filteredData[i].totalAmountUsd!=undefined){
        this.totalAmntUsd=((+this.totalAmntUsd)+(+this.projectDataSource.filteredData[i].totalAmountUsd));
      }
      else{
        this.totalAmntUsd=this.totalAmntUsd+0;
      }
      if(this.projectDataSource.filteredData[i].financialExecutionAmount!=null && this.projectDataSource.filteredData[i].financialExecutionAmount!=undefined){
        this.totalFinaceAmt=((+this.totalFinaceAmt)+(+this.projectDataSource.filteredData[i].financialExecutionAmount));
      }
      else{
        this.totalFinaceAmt=this.totalFinaceAmt+0;
      }
    }
  }
  openDocumentDialog(projectTitle:string) {
    localStorage.setItem("projectTitle",projectTitle)
    const dialogRef = this.dialog.open(ProjectDocumentViewComponent, {
      disableClose: true,
      // width: '100%',
      // height : '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-project']);
     });
  }

  optionsMT: Options = {
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

  optionsAMZ: Options = {
    floor: 0,
    ceil: 150000,
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
          return 'Filter Allocated Amount (MZN)';
          }else{
            return 'Filtrar Montante alocado (MZN)';
          }
        }
    }
  };

  optionsAUSD: Options = {
    floor: 0,
    ceil: 150000,
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
          return 'Filter Allocated Amount (USD)';
          }else{
            return 'Filtrar Montante alocado (USD)';
          }
        }
    }
  };

  optionsFinAmt: Options = {
    floor: 0,
    ceil: 150000,
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
            return 'Flitrar execução financeira (MZN)';
          }
        }
    }
  };

  getRangeExchangeRate(){
    this.projectDataSource.data = projectDetails;
    const from = this.minExchangeRate;
    const to = this.maxExchangeRate;
    //this.projectDataSource.data = this.projectDataSource.data.filter(e=>e.financialExeRate >= from && e.financialExeRate <= to ) ;
  }

  getAlloAMtMzn(){
    this.projectDataSource.data = projectDetails;
    const from = this.minAlloAmtMzn;
    const to = this.maxAlloAmtMzn;
    //this.projectDataSource.data = this.projectDataSource.data.filter(e=>e.allocatedAmount >= from && e.allocatedAmount <= to ) ;
  }

  getAlloAMtUsd(){
    this.projectDataSource.data = projectDetails;
    const from = this.minAlloAmtUsd;
    const to = this.maxAlloAmtUsd;
    //this.projectDataSource.data = this.projectDataSource.data.filter(e=>e.allocatedAmountUSD >= from && e.allocatedAmountUSD <= to ) ;
  }

  getFinanceAmt(){
    this.projectDataSource.data = projectDetails;
    const from = this.minFinanceAmt;
    const to = this.maxFinanceAmt;
    //this.projectDataSource.data = this.projectDataSource.data.filter(e=>e.financialExeAmt >= from && e.financialExeAmt <= to ) ;
  }

  
  selection = new SelectionModel<ProjectCrud>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: ProjectCrud) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.projectId);
    } else {
      let index = this.ids.indexOf(row.projectId, 0);
      this.ids.splice(index, 1);
    }
  }
  projectDocDetails: ProjectDocumentServiceClass[] = [];
  noDataHdnFlag: any = true;
  openDialog2(projectTitle:string) {
    localStorage.setItem("projectTitle",projectTitle)
     const dialogRef = this.dialog.open(ProjectDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['project']);
        console.log(`Dialog result: ${result}`);
        localStorage.removeItem('prjRefNm');
      });
    
  }
  openDialog(projectTitle: any) {
    localStorage.setItem("projectTitle", projectTitle);
    const dialogRef = this.dialog.open(ProjectDocumentViewComponent, {
      disableClose: true,
    });
     dialogRef.afterClosed().subscribe((result) => {
       this.router.navigate(['view-project']);
       localStorage.removeItem('projectTitle');
      });
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/view-table-modal-Disbursment-Component',disbursement_id]));

  }
}
export class Project {
  projectTitel!: string;
  allocatedAmount!: number;
  projectSituation!: string;
  ResponsibleOrganization!: string;
  projectLink!: string;
  allocatedAmountUSD!:number;
  province!:string;
  district!:string;
  financialExeRate!:number;
  implementingOrganizartion!:string;
  financialExeAmt!:number;

}

let projectDetails:ProjectCrud[]=[];

const ELEMENT_DATA: Project[] = [
  { projectTitel: 'Project 001 - Health', allocatedAmountUSD: 23566.00,allocatedAmount: 23345.00,financialExeAmt:43255.00,  projectSituation: 'Ongoing', ResponsibleOrganization: 'WHO',province:'CABO DELGADO', district:'BALAMA', projectLink: 'https://www.healthline.com',financialExeRate:8.6,implementingOrganizartion:'MEF' },
  { projectTitel: 'Project 002 - Education',allocatedAmountUSD: 29566.00, allocatedAmount: 12789.00,financialExeAmt:72155.00,  projectSituation: 'Finished', ResponsibleOrganization: 'UGC',province:'MAPUTO CIDADE', district:'DISTRITO MUNICIAL KANHLAMANKULO', projectLink: 'https://www.education.com',financialExeRate:9.2,implementingOrganizartion:'Mozambique' },
  { projectTitel: 'Project 003 - Transport', allocatedAmountUSD: 27566.00,allocatedAmount: 78568.00,financialExeAmt:43545.00,  projectSituation: 'Canceled', ResponsibleOrganization: 'CRRI',province:'MAPUTO PROVINCIA', district:'CIDADE DE MATOLA', projectLink: 'http://www.transport.mp.gov.in',financialExeRate:7.3,implementingOrganizartion:'Austria' },
  { projectTitel: 'Project 004 - Communication', allocatedAmountUSD: 23566.00,allocatedAmount: 36543.00,financialExeAmt:13245.00,  projectSituation: 'Ongoing', ResponsibleOrganization: 'UNICEF',province:'MANICA', district:'GURO', projectLink: 'https://www.britannica.com/topic/communication',financialExeRate:6.8,implementingOrganizartion:'Switzerland' },
  { projectTitel: 'Project 005 - Culture',allocatedAmountUSD: 43566.00, allocatedAmount: 90156.00,financialExeAmt:65355.00,  projectSituation: 'Suspended', ResponsibleOrganization: 'World Bank',province:'SOFALA', district:'BUZI', projectLink: 'https://eci.gov.in/voter/voter',financialExeRate:8.3,implementingOrganizartion:'Portugal' },
  { projectTitel: 'Project 006 - Food Deliver', allocatedAmountUSD: 66566.00,allocatedAmount: 44523.00,financialExeAmt:11655.00,  projectSituation: 'Planning', ResponsibleOrganization: 'WFP',province:'NAMPULA', district:'NAMAPA-ERATI', projectLink: 'https://www.foodzo.in',financialExeRate:7.5,implementingOrganizartion:'Italy' },
  { projectTitel: 'Project 007 - Travel Agency', allocatedAmountUSD: 34566.00,allocatedAmount: 37896.00,financialExeAmt:43735.00,  projectSituation: 'Canceled', ResponsibleOrganization: 'World Bank',province:'NIASSA', district:'CUAMBA', projectLink: 'https://www.yatra.com/india-tour-packages',financialExeRate:6.9,implementingOrganizartion:'Norway' },
  { projectTitel: 'Project 008 - Banking', allocatedAmountUSD: 23566.00,allocatedAmount: 29987.00,financialExeAmt:98453.00,  projectSituation: 'Finished', ResponsibleOrganization: 'World Bank',province:'TETE', district:'ANGONIA', projectLink: 'https://www.onlinesbi.com',financialExeRate:8.7,implementingOrganizartion:'Belgium' },


];
export enum SelectType {
  single,
  multiple
}