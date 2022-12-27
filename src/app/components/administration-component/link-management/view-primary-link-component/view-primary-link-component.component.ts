/**
 * View PrimaryLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrimaryLink, PrimaryLinkFilterBean } from 'src/app/Service-Class/primary-link';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import Swal from 'sweetalert2';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-primary-link-component',
  templateUrl: './view-primary-link-component.component.html',
  styleUrls: ['./view-primary-link-component.component.css']
})
export class ViewPrimaryLinkComponentComponent implements OnInit {
  browserLang: any;
  primaryLinkList: PrimaryLink[];
  primaryLink: any;
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  primaryLinkNameData:PrimaryLinkFilterBean = null;
  filterSelectObj = [];
  authorised_flag=false;
  displayedColumns: string[] = ['edit','primaryLinkName','globalLinkName','functionName', 'status'];
  primaryLinkdataSource = new MatTableDataSource<PrimaryLink>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  totalRows: any;
  constructor(private primaryLinkService: PrimaryLinkService, private router: Router,
    public translate: TranslateService,private location:Location) {
      
    }

  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
      if(this.browserLang==='en')
      {
        this.filterSelectObj = [
          {
            name: 'Filter Primary Link Name',
            columnProp: 'primaryLinkName',
            options: []
          },
          {
            name: 'Filter Global Link Name',
            columnProp: 'globalLinkName',
            options: []
          },
          {
            name: 'Filter Function Name',
            columnProp: 'functionName',
            options: []
          },
          {
            name: 'Filter Status',
            columnProp: 'status',
            options: []
          }
        ];
      }
      else{
        this.filterSelectObj = [
          {
            name: 'Filtre Nome do Link Primário',
            columnProp: 'primaryLinkName',
            options: []
          },
          {
            name: 'Filtre Nome do link global',
            columnProp: 'globalLinkName',
            options: []
          },
          {
            name: 'Filtre Nome da Função',
            columnProp: 'functionName',
            options: []
          },
          {
            name: 'Filtre Estado',
            columnProp: 'status',
            options: []
          }
        ];
      }
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    this.fetchPrimaryLinkData();
    this.setToUserPermission();
  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  //get globalLink List Details service..

  private getGlobalLinkDetails() {
    this.primaryLinkService.getPrimaryLinkList().subscribe(data => {
      console.log("return data" + data.length);
      this.primaryLinkList = data;
    });
  }
  // get totalRows(): number {
  //   return this.primaryLinkList.length;
  // }
  private fetchPrimaryLinkData(){

    this.primaryLinkService.getPrimaryLinkList().subscribe(data => {
      console.log("return data" + data.length);
      this.primaryLinkList = data;
      console.log("return p link data" +JSON.stringify(this.primaryLinkList) );
      this.totalRows = this.primaryLinkList.length;
      this.primaryLinkdataSource=new MatTableDataSource<PrimaryLink>(this.primaryLinkList);
     console.log("envelopeDetails ",this.primaryLinkdataSource);
      setTimeout(() =>
     this.primaryLinkdataSource.paginator=this.paginator
     );
     setTimeout(() =>
    this.primaryLinkdataSource.sort=this.sort
    );

    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.primaryLinkList, o.columnProp);
    });


   });

     }
  // updatePrimaryLink(id:number){
  //   this.router.navigate(['/admin/update-primaryLink',id]);
  // }
  updatePrimaryLink(id: number){
    localStorage.setItem("editPrimaryLink", "editPrimaryLink");
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/update-primaryLink',id]));


  }
  //get globalLink Object through its Id service..
  private updatePrimaryLinkById(primaryLinkId: number) {
    this.primaryLinkService.getPrimaryLinkById(primaryLinkId)
      .subscribe(
        data => {
          this.primaryLink = data

          console.log("primaryLink class data");
          console.log(this.primaryLink);


        },
        error => console.log(error));
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Primary Link')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Primary Link'){
        this.authorised_flag=true;
      }
    }
  }

  primaryLinkNm:any=[]
  primaryLinkChange(filter, event) {
    this.primaryLinkNm=[]
    this.primaryLinkNm=filter.modelValue;
  }

  globalLinkNm:any=[]
  globalLinkChange(filter, event) {
    this.globalLinkNm=[]
    this.globalLinkNm=filter.modelValue;
  }

  functionName:any=[]
  functionNameChange(filter, event) {
    this.functionName=[]
    this.functionName=filter.modelValue;
  }

  primaryLinkStatus:any=[]
  statusChange(filter, event) {
    this.primaryLinkStatus=[]
    this.primaryLinkStatus=filter.modelValue;
  }

  primaryLinkName:any=[];
  globalLinkName:any=[];
  functionNameFilter:any=[];
  status:any=[];
  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let primaryLinkName=[];
    let globalLinkName=[];
    let functionNameFilter=[];
    let status=[];
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.primaryLinkList.length; i++) {
       
        if (columnName == 'primaryLinkName') {
          if(this.primaryLinkNm.length ==0){
          if (((this.primaryLinkList[i].primaryLinkName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            primaryLinkName.push(this.primaryLinkList[i].primaryLinkName);
          }
        }else if(this.primaryLinkName.length !=0){
          if(this.primaryLinkName[i] !=undefined)  {
          if (((this.primaryLinkName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            primaryLinkName.push(this.primaryLinkName[i]);
          }
        }
        } 
            
      }

      if (columnName == 'globalLinkName') {
        if(this.globalLinkName.length ==0){
        if (((this.primaryLinkList[i].globalLinkName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          globalLinkName.push(this.primaryLinkList[i].globalLinkName);
        }
      }else if(this.globalLinkName.length !=0){
        if(this.globalLinkName[i] !=undefined)  {
        if (((this.globalLinkName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          globalLinkName.push(this.globalLinkName[i]);
        }
      }
      } 
          
    }

    if (columnName == 'functionName') {
      if(this.functionNameFilter.length ==0){
      if (((this.primaryLinkList[i].functionName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
        functionNameFilter.push(this.primaryLinkList[i].functionName);
      }
    }else if(this.functionNameFilter.length !=0){
      if(this.functionNameFilter[i] !=undefined)  {
      if (((this.functionNameFilter[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
        functionNameFilter.push(this.functionNameFilter[i]);
      }
    }
    } 
        
  }
  if (columnName == 'status') {
    if(this.status.length ==0){
    if (((this.primaryLinkList[i].status).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
      status.push(this.primaryLinkList[i].status);
    }
  }else if(this.status.length !=0){
    if(this.status[i] !=undefined)  {
    if (((this.status[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
      status.push(this.status[i]);
    }
  }
  } 
      
  }
    }
  }
  if(columnName == 'primaryLinkName') {
    primaryLinkName = [...new Set(primaryLinkName)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'primaryLinkName') {
        o.options = primaryLinkName, 'primaryLinkName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'primaryLinkName' && this.primaryLinkName.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'primaryLinkName')
      o.options = this.primaryLinkName, 'primaryLinkName';
    });
  }
  if(columnName == 'globalLinkName') {
    globalLinkName = [...new Set(globalLinkName)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'globalLinkName') {
        o.options = globalLinkName, 'globalLinkName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'globalLinkName' && this.primaryLinkName.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'globalLinkName')
      o.options = this.globalLinkName, 'globalLinkName';
    });
  }
  if(columnName == 'functionName') {
    functionNameFilter = [...new Set(functionNameFilter)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'functionName') {
        o.options = functionNameFilter, 'functionName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'functionName' && this.functionNameFilter.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'functionName')
      o.options = this.functionNameFilter, 'functionName';
    });
  }
  if(columnName == 'status') {
    status = [...new Set(status)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'status') {
        o.options = status, 'status';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'status' && this.status.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'status')
      o.options = this.status, 'status';
    });
  }
  }

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
    return uniqChk;
  }

  resetFilters() {
    //   this.selectRef.forEach(function (el) {
    //     el.options.forEach((data: MatOption) => data.deselect());
    // });
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }

  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
  }

  submitData(){
    //  console.log("values ",this.yearData)
    this.primaryLinkNameData = new PrimaryLinkFilterBean();
    if(this.primaryLinkNm.length == 0 || this.primaryLinkNm == null || this.primaryLinkNm == undefined){
      this.primaryLinkList.forEach(data=>{
        this.primaryLinkNameData.primaryLinkNames.push(data.primaryLinkName);
      });
    }
    else{
      this.primaryLinkNameData.primaryLinkNames=this.primaryLinkNm;
    }
    if(this.globalLinkNm.length == 0 || this.globalLinkNm == null || this.globalLinkNm == undefined){
      this.primaryLinkList.forEach(data=>{
        this.primaryLinkNameData.globalLinkNames.push(data.globalLinkName);
      });
    }
    else{
      this.primaryLinkNameData.globalLinkNames=this.globalLinkNm;
    }
    if(this.functionName.length == 0 || this.functionName == null || this.functionName == undefined){
      this.primaryLinkList.forEach(data=>{
        this.primaryLinkNameData.functionMasterNames.push(data.functionName);
      });
    }
    else{
      this.primaryLinkNameData.functionMasterNames=this.functionName;
    }
    if(this.primaryLinkStatus.length == 0 || this.primaryLinkStatus == null || this.primaryLinkStatus == undefined){
      this.primaryLinkList.forEach(data=>{
        this.primaryLinkNameData.status.push(data.status);
      });
    }
    else{
      this.primaryLinkNameData.status=this.primaryLinkStatus;
    }
    if(this.primaryLinkNameData!=null){
      console.log('---->',this.primaryLinkNameData);
     this.primaryLinkService.filterData(this.primaryLinkNameData).subscribe(
       data => {
          console.log("return data" + data.length);
          this.primaryLinkList = data;
          console.log("return p link data" +JSON.stringify(this.primaryLinkList) );
          this.totalRows = this.primaryLinkList.length;
          this.primaryLinkdataSource=new MatTableDataSource<PrimaryLink>(this.primaryLinkList);
        console.log("envelopeDetails ",this.primaryLinkdataSource);
          setTimeout(() =>
          this.primaryLinkdataSource.paginator=this.paginator
          );
        setTimeout(() =>
          this.primaryLinkdataSource.sort=this.sort
        );
        this.filterSelectObj.filter((o) => {
          o.options = this.getFilterObject(this.primaryLinkList, o.columnProp);
        });
       },
       /* If We get Any error then the error will show here
       *  Suppose we give a id that will not present in our db then it will show an error message
       */
       error => {

         console.log("error ", error);
         if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
           Swal.fire(error.error.message, '', 'error');
         } else {
           Swal.fire(error.error, '', 'error');
         }
     });
   }
 }

  moveToSelectedTab1() {
    this.location.back();
  }

  generateExcel() {
    window.open(environment.primaryLinkExcelUrl,'_self');
  }

  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Update?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Update`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("aasuchi ts update true ku ");
        //  this.updateGlobalLink();
        Swal.fire('Updated Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
}
