/**
 * View GlobalLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import { GlobalLink, GlobalLinkFilterBean } from 'src/app/model/global-link';
import Swal from 'sweetalert2';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-view-global-link-component',
  templateUrl: './view-global-link-component.component.html',
  styleUrls: ['./view-global-link-component.component.css']
})
export class ViewGlobalLinkComponentComponent implements OnInit {
  browserLang: any;
  public globalLinkForm!: FormGroup;
  globalLinkList: GlobalLink[] = [];
  uAccessPermArr:UserAccessPermission[]=[];
  filterSelectObj = [];
  globalLinkNameData:GlobalLinkFilterBean = null;
  allGlobalLinkNames:any=[];
  userPermission:number[]=[];
  authorised_flag=false;
  globalLinklist: any;
  globalLink: any;
  dataSource:any;
  totalRows:any;
  selected = 'globalLink.status';
  globalLinkdataSource = new MatTableDataSource<GlobalLink>();
  constructor(private globalLinlService: GlobalLinkServiceService,
    private router: Router,public translate: TranslateService,private location: Location) { 
    }   
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  displayedColumns: string[] = ['edit','globalLinkName', 'icon','status'];
  ngOnInit(): void {
   
  
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    if(this.browserLang==='en')
    {
      this.filterSelectObj = [
        {
          name: 'Global Link Name',
          columnProp: 'globalLinkName',
          options: []
        },
        {
          name: 'Status',
          columnProp: 'status',
          options: []
        }
      ];
    }
    else
    {
      this.filterSelectObj = [
        {
          name: 'Filtre Nome do link global',
          columnProp: 'globalLinkName',
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
    this.fetchGlibalLinkData();
    this.setToUserPermission();
   this.dataSource = new MatTableDataSource<GlobalLink>(this.globalLinkList);
   console.log("data Sourse Object"+this.dataSource.globalLinkName);


  }

  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
    // this.filterSelectObj.filter((o) => {
    //   if (o.columnProp == 'globalLinkName') {
    //     o.options = this.allGlobalLinkNames, 'globalLinkName';
    //   }
    // });
  }

  filterChange(filter, event) {
    console.log("fiter ",filter)
    console.log("event ",event)

    // this.globalLinkNameData = new GlobalLinkFilterBean();
    // if(filter.columnProp = 'status'){
    //   this.globalLinkNameData.status=event.value;
    // }
    // else if(filter.columnProp = 'globalLinkName'){
    //   this.globalLinkNameData.globalLinkNames=event.value;
    // }
    let json : any = {};
    // let 
  }
  globalLinkNm:any=[]
  globalLinkStatus:any=[];
  globalLinkChange(filter, event) {
this.globalLinkNm=[]
this.globalLinkNm=filter.modelValue;
console.log("nm ",this.globalLinkNm)
  }
  statusChange(filter, event) {
    this.globalLinkStatus=[]
    this.globalLinkStatus=filter.modelValue;
    console.log("globalLinkStatus ",this.globalLinkStatus)

  }
  submitData(){
     //  console.log("values ",this.yearData)
     this.globalLinkNameData = new GlobalLinkFilterBean();
     this.globalLinkNameData.globalLinkNames=this.globalLinkNm
     this.globalLinkNameData.status=this.globalLinkStatus;
     if(this.globalLinkNameData!=null){
       console.log('---->',this.globalLinkNameData);
      this.globalLinlService.filterData(this.globalLinkNameData).subscribe(
        data => {
          this.globalLinkList = data;
          this.totalRows = this.globalLinkList.length;
          this.globalLinkdataSource=new MatTableDataSource<GlobalLink>(this.globalLinkList);
          setTimeout(() =>
            this.globalLinkdataSource.paginator=this.paginator
          );
          setTimeout(() =>
            this.globalLinkdataSource.sort=this.sort
          );
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

  //@ViewChildren('select') selectRef:QueryList<MatSelect>;
  /* Reset table filters */
  resetFilters() {
  //   this.selectRef.forEach(function (el) {
  //     el.options.forEach((data: MatOption) => data.deselect());
  // });
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  globalLinkName:any=[];
  status:any=[];
  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let globalLinkName=[];
    let status=[];
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.globalLinkList.length; i++) {
       
        if (columnName == 'globalLinkName') {
          if(this.globalLinkName.length ==0){
          if (((this.globalLinkList[i].globalLinkName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            globalLinkName.push(this.globalLinkList[i].globalLinkName);
          }
        }else if(this.globalLinkName.length !=0){
          if(this.globalLinkName[i] !=undefined)  {
          if (((this.globalLinkName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            globalLinkName.push(this.globalLinkName[i]);
          }
        }
        } 
            
      }
      if (columnName == 'status') {
        if(this.status.length ==0){
        if (((this.globalLinkList[i].status).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          status.push(this.globalLinkList[i].status);
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
  if(columnName == 'globalLinkName') {
    globalLinkName = [...new Set(globalLinkName)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'globalLinkName') {
        o.options = globalLinkName, 'globalLinkName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'globalLinkName' && this.globalLinkName.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'globalLinkName')
      o.options = this.globalLinkName, 'globalLinkName';
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

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Global Link')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Global Link'){
        this.authorised_flag=true;
      }
    }
  }

  updateGlobalLink(id: number){
    localStorage.setItem("editGlobalLink", "editGlobalLink");
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/update-globalLink',id]));


  }
  viewGlobalLink(id: number){
    localStorage.setItem("editGlobalLink", "editGlobalLink");
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/update-globalLink',id]));


  }
  private updateGlobalLinkById(globalLinkId: number) {
    this.globalLinlService.getGlobalLinkById(globalLinkId)
      .subscribe(
        data => {
          this.globalLink = data

          console.log("globalLink class data");
          console.log(this.globalLink);


        },
        error => console.log(error));
  }



  private getGlobalLinkDetails() {
    this.globalLinlService.getGlobalLinkList().subscribe(data => {
      console.log("return data" + data.length);
      this.globalLinkList = data;
    });
  }

  moveToSelectedTab1() {
    this.location.back();
  }
  generateExcel(filename: string) {
   // window.open(environment.globalLinkExcelUrl,'_self');
   this.globalLinlService
   .generateExcel(filename)
   .subscribe(blob => FileSaver(blob, filename));
  }
  // get totalRows(): number {
  //   return this.globalLinkList.length;
  // }
  private fetchGlibalLinkData(){

    this.globalLinlService.getGlobalLinkList().subscribe(data => {
      console.log("return data" + data.length);
      this.globalLinkList = data;
      this.totalRows = this.globalLinkList.length;
      this.globalLinkdataSource=new MatTableDataSource<GlobalLink>(this.globalLinkList);
     console.log("envelopeDetails ",this.globalLinkdataSource);
      setTimeout(() =>
     this.globalLinkdataSource.paginator=this.paginator
     );
     setTimeout(() =>
    this.globalLinkdataSource.sort=this.sort
    );
    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.globalLinkList, o.columnProp);
    });

   });

     }
}
