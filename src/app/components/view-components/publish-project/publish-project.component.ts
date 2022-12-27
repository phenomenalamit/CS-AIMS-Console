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

@Component({
  selector: 'app-publish-project',
  templateUrl: './publish-project.component.html',
  styleUrls: ['./publish-project.component.css']
})
export class PublishProjectComponent implements OnInit {

  displayedColumns: string[] = ['select','edit',  'projectTitle', 'projectSituation', 'ResponsibleOrganization', 'allocatedAmount','allocatedAmountUSD','financialExeAmt','financialExeRate'];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  displayedColumnsReadOnly: string[] = [ 'projectTitle', 'projectSituation', 'ResponsibleOrganization', 'projectOverview'];

  projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);
  projectTitelArr:string[]=[];
  projectSituationArr:string[]=[];
  responsibleOrgArr:string[]=[];

  authorised_flag=false;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  myControl = new FormControl();
  searchFilter = new FormControl('');
  chosenYearDate!: Date;
  usergroup: any;
  browserLang: any;
  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,
    private excelService: ExcelService,private router:Router,
    private location: Location,private dialog: MatDialog,
    private projectCrudService:ProjectCrudService
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
        }
        // , {
        //   name: 'Implementing Organization',
        //   columnProp: 'implementingOrganizartion',
        //   options: []
        // }
        // , {
        //   name: 'Province',
        //   columnProp: 'province',
        //   options: []
        // }, {
        //   name: 'District',
        //   columnProp: 'district',
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
  totalAmntMZN:any;
  totalAmntUsd:any;
  totalFinaceAmt:any;
  totalRows:number=0;
  userNameForNotification:string="Charlie Adams";
  userGroupForNotification:string="DNGDP Data Administrator";

  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getProjectViewDetails();
    this.findTotalAmount();
    this.usergroup = localStorage.getItem('usergroup');
    this.setToUserPermission();
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
      // this.totalAmntMZN=this.totalAmntMZN+this.projectDataSource.filteredData[i].allocatedAmount;
      // this.totalAmntUsd=this.totalAmntUsd+this.projectDataSource.filteredData[i].allocatedAmountUSD;
      // this.totalFinancialExeRate=this.totalFinancialExeRate+ this.projectDataSource.filteredData[i].financialExeRate;
      // this.totalFinaceAmt=this.totalFinaceAmt+this.projectDataSource.filteredData[i].financialExeAmt;
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
        this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(projectDetails, o.columnProp);
      });
      for(let i=0;i<projectDetails.length;i++){
        this.projectTitelArr.push(projectDetails[i].projectTitle);
        if(this.browserLang == 'en'){
        this.projectSituationArr.push(projectDetails[i].projectSituation);
        }else{
          this.projectSituationArr.push(projectDetails[i].projectSituationPt);
        }
        this.responsibleOrgArr.push(projectDetails[i].responsibleOrganization);
      }
      this.projectTitelArr = [...new Set(this.projectTitelArr)];
      this.projectSituationArr = [...new Set(this.projectSituationArr)];
      this.responsibleOrgArr = [...new Set(this.responsibleOrgArr)];
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
                      }
                    }

                  }else if(col == 'projectSituation' || col== 'projectSituationPt'){
                    if(projectDetails[j].projectSituation !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].projectSituation).toString().toLowerCase()) {
                        if(projectDetails[j].projectTitle !=""){
                          this.projectTitelArr.push(projectDetails[j].projectTitle);
                        }
                        this.responsibleOrgArr.push(projectDetails[j].responsibleOrganization);
                      }
                    }

                  }else if(col == 'responsibleOrganization'){

                    if(projectDetails[j].responsibleOrganization !=null){
                      if (spl[i].toLowerCase() == (projectDetails[j].responsibleOrganization).toString().toLowerCase()) {
                        this.projectTitelArr.push(projectDetails[j].projectTitle);
                        if(this.browserLang == 'en'){
                          this.projectSituationArr.push(projectDetails[j].projectSituation);
                          }else{
                            this.projectSituationArr.push(projectDetails[j].projectSituationPt);
                          }
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
       if(this.projectTitelArr.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'projectTitle') {
            o.options = this.projectTitelArr, 'projectTitle';
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
  filterChange(filter, event) {
    //this.amnt_flag=true;
    this.filterValues[filter.columnProp] = event.value
    this.projectDataSource.filter = JSON.stringify(this.filterValues)
    this.totalAmnt=0;
    this.totalAmntUsd=0;
    this.totalFinaceAmt=0;
    for(let i=0;i<this.projectDataSource.filteredData.length;i++){
      // this.totalAmnt=this.totalAmnt+this.projectDataSource.filteredData[i].allocatedAmount;
      // this.totalAmntUsd=this.totalAmntUsd+this.projectDataSource.filteredData[i].allocatedAmountUSD;
      // this.totalFinaceAmt=this.totalFinaceAmt+this.projectDataSource.filteredData[i].financialExeAmt;
    }
    this.totalRows=this.projectDataSource.filteredData.length;
  }

  private getProjectViewDetails(){
    this.projectCrudService.getDraftedProjectViewDetails().subscribe(data=>{
      projectDetails=data;
      console.log('All Project datas are--->',projectDetails);
      this.projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);
      this.totalRows=0;
      this.totalRows=projectDetails.length;
      /* Set Paginator */
      setTimeout(() =>
        this.projectDataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.projectDataSource.sort = this.sort
      );
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(projectDetails, o.columnProp);
      });
      this.projectDataSource.filterPredicate = this.createFilter();
      for(let i=0;i<projectDetails.length;i++){
        this.projectTitelArr.push(projectDetails[i].projectTitle);
        if(this.browserLang == 'en'){
          this.projectSituationArr.push(projectDetails[i].projectSituation);
        }else{
          this.projectSituationArr.push(projectDetails[i].projectSituationPt);
        }

        this.responsibleOrgArr.push(projectDetails[i].responsibleOrganization);
      }
      this.projectTitelArr = [...new Set(this.projectTitelArr)];
      this.projectSituationArr = [...new Set(this.projectSituationArr)];
      this.responsibleOrgArr = [...new Set(this.responsibleOrgArr)];
      console.log(projectDetails);
    });
  }

  private deleteProjectById(projectId:number){
    this.deleteProjectAlert(projectId);
    this.projectCrudService.deleteProjectById(projectId).subscribe(data=>{
      projectDetails=data;
      this.projectDataSource=new MatTableDataSource<ProjectCrud>(projectDetails);
      Swal.fire('Deleted Successfully!', '', 'success');
      this.totalRows=0;
      this.totalRows=projectDetails.length;
      /* Set Paginator */
      setTimeout(() =>
        this.projectDataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
        this.projectDataSource.sort = this.sort
      );
    });
  }

  //for notification alert, execute on delete disbursement
  deleteProjectAlert(id:number) {
    let todayTime = new Date();
    let projectTitle=this.findProjTitelById(id);
    let referenceId=this.findReferenceById(id);
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
      +projectTitle
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Project Name "'
      +projectTitle
      +'" with Reference ID "'
      +referenceId
      +'" has been deleted by user "'+this.userNameForNotification+'" in AIMS on "'
    +((todayTime+'').substring(0, 24))+'" ';

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
    // console.log("123456");
    // let obj = new ViewProjectComponentComponent(this._document,this.excelService,this.router,this.location,this.dialog,this.projectCrudService);
    // obj.ExportTOExcel();
    // this.ngAfterViewInit();
    window.open(environment.disbursemntExcelUrl, '_self');
  }
  // get totalRows(): number {
  //   return ELEMENT_DATA.length;
  // }
  viewMoreProject(viewProjectId: any) {
    // localStorage.setItem("ViewMoreProject", "ViewMoreProject");
    // console.log("View More inside view--->", localStorage.getItem("ViewMoreProject"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-drafted-project',viewProjectId]));

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

  opensweetalertDelete(projectId:number) {
    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Delete`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteProjectById(projectId);
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
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
      // this.totalAmntMZN = this.totalAmntMZN + this.projectDataSource.data[i].allocatedAmount;
      // this.totalAmntUsd = this.totalAmntUsd + this.projectDataSource.data[i].allocatedAmountUSD;
      // this.totalFinancialExeRate=this.totalFinancialExeRate+this.projectDataSource.data[i].financialExeRate;
      // this.totalFinaceAmt=this.totalFinaceAmt+this.projectDataSource.data[i].financialExeAmt;
    }
  }

  private findTotalAmount(){
    this.totalAmntUsd=0;
    this.totalAmntMZN=0;
    this.totalFinancialExeRate=0;
    this.totalFinaceAmt=0;

  }
  openDocumentDialog() {
    const dialogRef = this.dialog.open(ProjectDocumentViewComponent, {
      disableClose: true,
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
              return '<b>Taxa máxima :</b>' + value;
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

  displayType = SelectType.multiple;
  ids: number[] = [];
  selection = new SelectionModel<ProjectCrud>(true, []);

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
          this.projectCrudService.publishProject(this.ids).subscribe(data => {
            projectDetails = data;
            /* Add data in MatTableDataSource */
            this.projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);

            /* Set Paginator */
            setTimeout(() =>
              this.projectDataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.projectDataSource.sort = this.sort
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
          this.projectCrudService.discardProject(this.ids).subscribe(data => {
            projectDetails = data;
            /* Add data in MatTableDataSource */
            this.projectDataSource = new MatTableDataSource<ProjectCrud>(projectDetails);

            /* Set Paginator */
            setTimeout(() =>
              this.projectDataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.projectDataSource.sort = this.sort
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

let projectDetails:ProjectCrud[]=[];

export enum SelectType {
  single,
  multiple
}
