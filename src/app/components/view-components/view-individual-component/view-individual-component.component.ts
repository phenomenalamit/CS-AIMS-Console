// Author: Lopamudra Panda
// Module:Individual Module
// This is the ts file
// Ts file is having the logic of functionalaties

//import statements starts from here
//when we want to use/access any predefined/user defined class in this class then use use import statement
import {Component, ElementRef, Inject,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import {MatSort} from '@angular/material/sort';
import { ExcelService } from '../../../Service/excel.service';
import { AddIndividualComponentComponent } from '../../add-components/add-individual-component/add-individual-component.component';
import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ViewTableModalIndividualComponent } from '../../view-more-components/view-table-modal-individual/view-table-modal-individual.component';
import  { IndividualCrudServiceService } from 'src/app/Service/individual-crud-service.service';
import { IndividualCrudServiceClass } from 'src/app/Service-Class/individual-crud-service-class';
import { environment } from 'src/environments/environment';
const moment = _moment;
import { Location } from '@angular/common';


import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';
//end of import statement
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
  selector: 'app-view-individual-component',
  templateUrl: './view-individual-component.component.html',
  styleUrls: ['./view-individual-component.component.css']
})
//class starts from here
export class ViewIndividualComponentComponent implements OnInit {
  
  individualdataSource = new MatTableDataSource<IndividualCrudServiceClass>(individualGetDataList);
  // displayedColumns: string[] = ['position', 'names', 'nicknames', 'post','organization','email1',
  // 'email2','phone1','phone2','fax','address','city','country','othercontacts','edit'];
  displayedColumns: string[] = ['select','edit','names', 'nicknames', 'post','organization'];
  displayedColumnsReadOnly: string[] = ['position', 'names', 'nicknames', 'post','organization'];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);



  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  @ViewChild(AddIndividualComponentComponent) child: AddIndividualComponentComponent;
 refreshed = false;

  index: number;
  id: number;
  totalRows:number;
  myControl = new FormControl();
  chosenYearDate: Date;
  currencyOptions: string[] = ['AFA','ALL','AOA','ARS','AMD','AWG','AUD','AZN','BSD','BHD','BDT','BBD','BYR','BEF','BZD','BMD','BTN','BTC','BAM','BWP','BRL','GBP','BND','BGN','BIF',
  'KHR','CAD','CVE','KYD','XOF','XAF','XPF','CLP','CNY','COP','KMF','CDF','CRC','CUC','CZK','DKK','DJF','DOP','XCD','EGP','ERN','EEK','ETB','EUR','FKP','FJD','GMD','GEL','DEM',
  'GHS','GIP','GRD','GTQ','GNF','GYD','HTG','HNL','HKD','HUF','ISK','INR','IDR','IRR','IQD','ILS','ITL','JMD','JPY','JOD','KZT','KES','KWD','KGS','LAK','LVL','LBP','LSL','LRD',
  'LYD','LTL','MOP','MKD','MGA','MWK','MYR','MVR','MRO','MUR','MXN','MDL','MNT','MAD','MZM','MMK','NAD','NPR','ANG','TWD','NZD','NIO','NGN','KPW','NOK','OMR','PKR','PAB','PGK',
  'PYG','PEN','PHP','PLN','QAR','RON','RUB','RWF','SVC','WST','SAR','RSD','SCR','SLL','SGD','SKK','SBD','SOS','ZAR','KRW','XDR','LKR','SHP','SDG','SRD','SZL','SEK','CHF','SYP',
  'STD','TJS','TZS','THB','TOP','TTD','TND','TRY','TMT','UGX','UAH','UYU','USD','UZS','VUV','VEF','VND','YER','ZMK'];

  filterSelectObj = [];
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

  signatureDate = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  usergroup:any;
  userNameForNotificationAlert:string="Charlie Adams"; //This field will be softcoded later.
  userGroupForNotificationAlert:string="DNGDP Admin"; //This field will be softcoded later.
  authorised_flag=false;
  browserLang: any;
  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private router:Router,private dialog: MatDialog,private location:Location,
  private individualCrudServiceService:IndividualCrudServiceService,private notificationService:NotificationService) {
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
    this.filterSelectObj = [
      {
        name: 'Name',
        columnProp: 'names',
        options: []
      }, {
        name: 'Surname',
        columnProp: 'nicknames',
        options: []
      }, {
        name: 'Post',
        columnProp: 'post',
        options: []
      },
      {
        name: 'Organization',
        columnProp: 'organizationName',
        options: []
      }
    ]
  }else{
    this.filterSelectObj = [
      {
        name: 'Nome',
        columnProp: 'names',
        options: []
      }, {
        name: 'Apelido',
        columnProp: 'nicknames',
        options: []
      }, {
        name: 'Posto/cargo',
        columnProp: 'post',
        options: []
      },
      {
        name: 'Organização',
        columnProp: 'organizationName',
        options: []
      }
    ]
  }
  }

  elements!: NodeListOf<Element>;

  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getIndividualDetails();


    this.usergroup=localStorage.getItem('usergroup');
    this.setToUserPermission();
    setTimeout(() =>this.dataSource.paginator=this.paginator);
    // this.dataSource.paginator = this.paginator;
    setTimeout(() =>this.dataSource.sort = this.sort);

    this.currencyfilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.currencyFilter(value))
    );

  }
  filterValues = {};
  checkedFilterColumn:any={};
  filterChange(filter, event) {
    this.filterValues[filter.columnProp] = event.value
    this.individualdataSource.filter = JSON.stringify(this.filterValues)
    this.totalRows=0;
    this.checkedFilterColumn=this.individualdataSource.filter;
    this.totalRows=this.individualdataSource.filteredData.length;
   }
   searchFilter = new FormControl('');
  openOptionSearch() {
    this.searchFilter.patchValue('');
    
  }
  // Get Unique values from columns to build filter
getFilterObject(fullObj, key) {
  const uniqChk = [];
  fullObj.filter((obj) => {
    if (!uniqChk.includes(obj[key])) {
      if (obj[key] != null) {
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
names=[];
nicknames=[];
post=[];
organization=[];
chkValue(filter) {
    
  var searchFilterVal = this.searchFilter.value;
  let columnName = filter.columnProp;
  let names=[];
  let nicknames=[];
  let post=[];
  let organization=[];

  // return nothing if empty value in input
  if (searchFilterVal !== "") {
    for (var i = 0; i < individualGetDataList.length; i++) {
     
      if (columnName == 'names') {
        if(this.names.length ==0){
        if (((individualGetDataList[i].names).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          names.push(individualGetDataList[i].names);
        }
      }else if(this.names.length !=0){
        if(this.names[i] !=undefined)  {
        if (((this.names[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          names.push(this.names[i]);
        }
      }
      } 
          
    }else if (columnName == 'nicknames') {
      if(this.nicknames.length ==0){
        if (((individualGetDataList[i].nicknames).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
         
          nicknames.push(individualGetDataList[i].nicknames);
        }
      }else if(this.nicknames.length !=0){
        if(this.nicknames[i] !=undefined)  {
        if (((this.nicknames[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          nicknames.push(this.nicknames[i]);
        }
      }
    }
      }else if (columnName == 'post') {
        if(this.post.length ==0){
        if (((individualGetDataList[i].post).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          post.push(individualGetDataList[i].post);
        } }
        else if(this.post.length !=0){
          if(this.post[i] !=undefined)  {
          if (((this.post[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            post.push(this.post[i]);
         
        }
      }
      }
      }else if (columnName == 'organizationName') {
        if(this.organization.length ==0){
        if (((individualGetDataList[i].organizationName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          organization.push(individualGetDataList[i].organizationName);
        }
        }
        else if(this.organization.length !=0){
          if(this.organization[i] !=undefined)  {
          if (((this.organization[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            organization.push(this.organization[i]);
         
        }
      }
      }
      }
    }
  }if (columnName == 'names') {
    names = [...new Set(names)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'names') {
        o.options = names, 'names';
       
      }
    });
  } if(columnName == 'nicknames') {
    nicknames = [...new Set(nicknames)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'nicknames') {
        o.options = nicknames, 'nicknames';
      }
    });
  }if(columnName == 'post') {
    post = [...new Set(post)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'post') {
        o.options = post, 'post';
      }
    });
  } if(columnName == 'organizationName') {
    organization = [...new Set(organization)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'organizationName') {
        o.options = organization, 'organizationName';
      }
    });
  }
  // if (searchFilterVal.length == 0) {
  //   this.filterSelectObj.filter((o) => {
  //     o.options = this.getFilterObject(ELEMENT_DATA, o.columnProp);
  //   });
  // }
  if (searchFilterVal.length == 0 && columnName== 'names' && this.names.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'names')
      o.options = this.names, 'names';
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'nicknames' && this.nicknames.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'nicknames')
      o.options = this.nicknames, 'nicknames';
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'post' && this.post.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'post')
      o.options = this.post, 'post';
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'organizationName' && this.organization.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'organizationName')
      o.options = this.organization, 'organizationName';
    });
  }
}
  // ngAfterViewInit() {
  //   if (!this.refreshed)
  //      this.child.refresh()
  //   this.refreshed = true;
  // }

  applyFilter(filterValue: string) {
    this.individualdataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.individualdataSource.paginator) {
      this.individualdataSource.paginator.firstPage();
      this.totalRows=this.individualdataSource.filteredData.length;
    }
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Individual List')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Individual List'){
        this.authorised_flag=true;
      }
    }
  }

 /* Reset table filters */
 resetFilters() {
  let currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);
  //this.fetchMonitoringData();
}

  public ExportTOExcel(){
    // console.log("export");
    // //this.table.nativeElement.style.background =  "red";
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    // /* save  to file */
    // XLSX.writeFile(wb,'SheetJS.xlsx');

    console.log("inside view part");
    //this.excelService.exportTableElmToExcel(this.epltable, 'Individual');
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Individual');


    //this.excelService.exportTableElmToExcel(this.table, 'user_data');

  //   console.log("export");
  //   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  // const wb: XLSX.WorkBook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // /* save to file */
  // XLSX.writeFile(wb, 'SheetIndividual.xlsx');

  }

  private currencyFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencyOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }



  viewMoreIndividual(individualId: string){

    // localStorage.setItem("ViewMoreInd", "ViewMoreInd");
    // console.log("View More inside view--->",localStorage.getItem("ViewMoreInd"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-individual',individualId]));

  }



  //deleteIndividual this method is responsible to InActive a particular record from database
  deleteIndividual(ids:number[]) {
    this.getValueByLang()
      this.individualCrudServiceService.findProjectIndividualOrgByIndividualIds(ids).subscribe(dataFromProj=>{
        if(dataFromProj==null || dataFromProj==undefined){
          this.individualCrudServiceService.deleteByIds(ids,this.browserLang).subscribe(data =>{
            individualGetDataList = data;
            this.totalRows = individualGetDataList.length;
            /* Add data in MatTableDataSource */
            this.individualdataSource = new MatTableDataSource<IndividualCrudServiceClass>(individualGetDataList);

            /* Set Paginator */
            setTimeout(() =>
              this.individualdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.individualdataSource.sort = this.sort
            );
            this.filterSelectObj.filter((o) => {
              o.options = this.getFilterObject(individualGetDataList, o.columnProp);
            });
        
            this.individualdataSource.filterPredicate = this.createFilter();
            if(this.browserLang=='en'){
              Swal.fire('Deleted successfully', '', 'success')
            }else{
              Swal.fire('Apagado com sucesso', '', 'success')
            }
          },
          error => console.log(error));
          this.saveIndividualDeleteAlert(this.ids);
        }
        else if(dataFromProj!=null && dataFromProj!=undefined){
          if(dataFromProj.length>0){ if(this.browserLang=='en'){
            Swal.fire('You Can not Delete This Record As It Is linked To Project');
          }else
          Swal.fire('Não pode apagar este registo pois está associado a um Projecto');
          }
          else{
            this.individualCrudServiceService.deleteByIds(ids,this.browserLang).subscribe(data =>{
              individualGetDataList = data;
              this.totalRows = individualGetDataList.length;
              /* Add data in MatTableDataSource */
              this.individualdataSource = new MatTableDataSource<IndividualCrudServiceClass>(individualGetDataList);

              /* Set Paginator */
              setTimeout(() =>
                this.individualdataSource.paginator = this.paginator
              );
              /* Set sorting */
              setTimeout(() =>
                this.individualdataSource.sort = this.sort
              );
              this.filterSelectObj.filter((o) => {
                o.options = this.getFilterObject(individualGetDataList, o.columnProp);
              });
          
              this.individualdataSource.filterPredicate = this.createFilter();
              if(this.browserLang=='en'){
                Swal.fire('Deleted successfully', '', 'success')
              }else{
                Swal.fire('Apagado com sucesso', '', 'success')
              }
            },
            error => console.log(error));
            this.saveIndividualDeleteAlert(this.ids);
          }
        }
      });
  }
  //moveToViewTab this method will redirect to view individual page
  moveToViewTab(){
   // this.router.navigate(['/admin/view-individual']);
   this.location.back();
  }
  moveToSelectedTab(tabName: string) {
  // console.log("editenv inside view--->",localStorage.getItem("EditInd"));
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/individual']));
    // console.log("after route");
    this.location.back();


  }
  limits:number=0
  loadAllData(){
    this.limits=1;
    this.getIndividualDetails();
      }
  private getIndividualDetails() {
    this.individualCrudServiceService.getIndividualCurd(this.limits).subscribe(data => {
      console.log("return data" + data.length);
      individualGetDataList = data;
      console.log("all data" , individualGetDataList);
      this.totalRows = individualGetDataList.length;
       /* Add data in MatTableDataSource */
       this.individualdataSource = new MatTableDataSource<IndividualCrudServiceClass>(individualGetDataList);

       /* Set Paginator */
       setTimeout(() =>
         this.individualdataSource.paginator = this.paginator
       );
       /* Set sorting */
       setTimeout(() =>
         this.individualdataSource.sort = this.sort
       );
       this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(individualGetDataList, o.columnProp);
      });
  
      this.individualdataSource.filterPredicate = this.createFilter();
    });
  }

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
        o.options = this.getFilterObject(individualGetDataList, o.columnProp);
      });
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
            this.nicknames=[];
            this.post=[];
            this.organization=[];
            this.names=[];
              let spl = word.split(",");
              for(let i=0;i<spl.length;i++)
              {
                 /* adding Running filter start */
  
                for (let j = 0; j < individualGetDataList.length; j++) {
                  if (col == 'names') {
                    if (spl[i].toLowerCase() == (individualGetDataList[j].names).toString().toLowerCase()) {
                      this.nicknames.push(individualGetDataList[j].nicknames);
                      if(individualGetDataList[j].post !=null)
                      this.post.push(individualGetDataList[j].post);
                      this.organization.push(individualGetDataList[j].organizationName);
                    }
                  }else if(col == 'post'){
                    if((individualGetDataList[j].post) == null){
                      (individualGetDataList[j].post)=''
                    }
                    if (spl[i].toLowerCase() == (individualGetDataList[j].post).toString().toLowerCase()) {
                      this.nicknames.push(individualGetDataList[j].nicknames);
                      this.names.push(individualGetDataList[j].names);
                      this.organization.push(individualGetDataList[j].organizationName);
                    }
                  }else if(col == 'nicknames'){
                    if (spl[i].toLowerCase() == (individualGetDataList[j].nicknames).toString().toLowerCase()) {
                      this.post.push(individualGetDataList[j].post);
                      this.names.push(individualGetDataList[j].names);
                      this.organization.push(individualGetDataList[j].organizationName);
                    }
                  }
                  else if(col == 'organizationName'){
                    if (spl[i].toLowerCase() == (individualGetDataList[j].organizationName).toString().toLowerCase()) {
                      this.post.push(individualGetDataList[j].post);
                      this.names.push(individualGetDataList[j].names);
                      this.nicknames.push(individualGetDataList[j].nicknames);
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
        this.nicknames = [...new Set(this.nicknames)];
        this.post = [...new Set(this.post)];
       this.organization = [...new Set(this.organization)];
       this.names=[...new Set(this.names)];
  
       if(this.names.length !=0){
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'names') {
            o.options = this.names, 'names';
           
          }
        });
      }
        if(this.nicknames.length !=0){
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'nicknames') {
                o.options = this.nicknames, 'nicknames';
               
              }
            });
          }
    if(this.post.length !=0){
          this.filterSelectObj.filter((o) => {
            if (o.columnProp == 'post') {
              o.options = this.post, 'post';
            }
          });
        }
        if(this.organization.length !=0){
          this.filterSelectObj.filter((o) => {
            if (o.columnProp == 'organizationName') {
              o.options = this.organization, 'organizationName';
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
  
  // get totalRows(): number {
  //   return ELEMENT_DATA.length;
  //   }
  generateExcel(){
    let id = [];
    for (let i = 0; i < this.individualdataSource.filteredData.length; i++) {
      id.push(this.individualdataSource.filteredData[i].id)
    }
    window.open(environment.individualExcelUrl + id + '/' + btoa(this.checkedFilterColumn), '_self')
    // window.open(environment.individualExcelUrl,'_self')
    // let obj = new ViewIndividualComponentComponent(this._document,this.excelService,this.router,this.dialog,this.location,this.individualCrudServiceService);
    // obj.ExportTOExcel();
  }

  //for notification alert, execute on delete disbursement
  saveIndividualDeleteAlert(ids:number[]){
    let todayTime=new Date();
    let firstNameArr:string[]=[];
    let lastNameArr:string[]=[];
    ids.forEach(id=>{
      let firstName:string=this.findFirstNameById(id);
      firstNameArr.push(firstName);
      let lastName:string=this.findLastNameById(id);
      lastNameArr.push(lastName);
    });
    // let notificationDetails:Notification=new Notification();
    // notificationDetails.notificationGroup=this.userGroupForNotificationAlert;
    // notificationDetails.updatedBy=this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg=this.userNameForNotificationAlert+" has delete individual on "+(todayTime+'').substring(0,24);
    // notificationDetails.updatedOn=todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
    //   console.log(data);
    // });
    //email subject
    let subjectForEmail:string='Individual Reference ID  "'
      +ids
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Individual "'
      +firstNameArr+' '
      +lastNameArr
      +'" with  Reference ID "'
      +ids
      +'" has been deleted by user "'+this.userNameForNotificationAlert+'" in AIMS on "'
    +((todayTime+'').substring(0, 24))+'" ';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToSelectedTab;
  }

  //for notification alert
  private findFirstNameById(id:number):string{
    let firstName:string=null;
    for(let i=0;i<individualGetDataList.length;i++){
      if(individualGetDataList[i].id==id+''){
        firstName=individualGetDataList[i].names;
      }
    }
    return firstName;
  }

  //for notification alert
  private findLastNameById(id:number):string{
    let lastName:string=null;
    for(let i=0;i<individualGetDataList.length;i++){
      if(individualGetDataList[i].id==id+''){
        lastName=individualGetDataList[i].nicknames;
      }
    }
    return lastName;
  }

  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
/* opensweetalertDelete is fire when user will press the delete button.
It will deactivate a data  */
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
  
  
  
        if (result.isConfirmed) {
          this.deleteIndividual(this.ids);
  
        } else if (result.isDenied) {
          // this.moveToViewTab();
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
  //below defined variables declared for presenting data in modal
  email1:any;
  email2:any;
  phoneCode1:any;
  phone2:any;
  phone1:any;
  phoneCode2:any;
  faxCode:any;
  fax:any;
  address:any;
  city:any;
  country:any;
  otherContactDetails:any;
  //end of declaration
  //openDialog () is for presenting  data in modal,this method receives id as agrument
   openDialog(id:any) {

     localStorage.setItem("individualId",id);
     console.log("individual id:",id);
     const dialogRef = this.dialog.open(ViewTableModalIndividualComponent, {
       disableClose: true,
     });


   }
   //end of openDialog() body
  editIndividual(id: string){
    // localStorage.setItem("EditInd", "EditInd");
    // console.log("local storage",localStorage);
    // console.log("EditInd inside view--->",localStorage.getItem("EditInd"));

    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-individual',id]));

    console.log("after route");

  }




  private refreshTable() {

    this.paginator._changePageSize(this.paginator.pageSize);
  }

  selection = new SelectionModel<IndividualCrudServiceClass>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: IndividualCrudServiceClass) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(+row.id);
    } else {
      let index = this.ids.indexOf(+row.id, 0);
      this.ids.splice(index, 1);
    }
  }





}
let individualGetDataList: IndividualCrudServiceClass[];
//end of class
export interface PeriodicElement {
  // position: number;
  names: string;
  nicknames: string;
  post: string;
  organization: string;
  email1:string;
  email2: string;
  phoneCode1:string;
  phoneCode2:string;
  phone1: string;
  phone2: string;
  address: string;
  faxCode:string;
  fax: string;
  city:string;
  country: string;
  otherContactDetails: string;



}




const ELEMENT_DATA: PeriodicElement[] = [
  {names:"Charlie Adams",nicknames:'Charlie', post:'Manager',organization:'WHO',email1:'charlie@gmail.com',email2:'charlie@gmail.com',phoneCode1:'+91', phone1:'413255005',phoneCode2:'+91',phone2:'41827505',faxCode:'+91',fax:'4122714807',address:'World Health Organization Headquarters',city:'Geneva',country:'Switzerland',otherContactDetails:'@who'},
  {names:"Arlete Bombe",nicknames:'Arlete', post:'Editor',organization:'UNICEF',email1:'arlete@gmail.com',email2:'arlete@gmail.com',phoneCode1:'+91', phone1:'15265412',phoneCode2:'+91',phone2:'18945745',faxCode:'+91',fax:'1800698898',address:"United Nations Children's Fund Headquarters",city:'New York',country:'United States',otherContactDetails:'@unicef'},
  {names:"Gilberto Mendes",nicknames:'Gilberto', post:'Director',organization:'UNESCO',email1:'gilberto@gmail.com',email2:'gilberto@gmail.com', phoneCode1:'+91',phone1:'3354168975',phoneCode2:'+91',phone2:'338574259',faxCode:'+91',fax:'331618888',address:"United Nations Educational, Scientific and Cultural Organization Headquarters",city:'Paris',country:'France',otherContactDetails:'@unesco'},
  {names:"Lucrécia Paco",nicknames:'Lucrécia', post:'Director',organization:'WHO',email1:'lucrécia@gmail.com',email2:'lucrécia@gmail.com', phoneCode1:'+91', phone1:'4196425645',phoneCode2:'+91',phone2:'418712245',faxCode:'+91',fax:'41227914807',address:'World Health Organization Headquarters',city:'Geneva',country:' Switzerland',otherContactDetails:'@who'},
  {names:"Samora Machel",nicknames:'Samora', post:'Editor',organization:'UNESCO',email1:'samora@gmail.com',email2:'samora@gmail.com', phoneCode1:'+91', phone1:'3342152354',phoneCode2:'+91',phone2:'335695036',faxCode:'+91',fax:'331619888',address:"United Nations Educational, Scientific and Cultural Organization Headquarters",city:'Paris',country:'France',otherContactDetails:'@unesco'},
  {names:"Joaquim Chissano",nicknames:'Joaquim', post:'Manager',organization:'UNICEF',email1:'joaquim@gmail.com',email2:'joaquim@gmail.com', phoneCode1:'+91',phone1:'12569452',phoneCode2:'+91',phone2:'16154523',faxCode:'+91',fax:'18006898898',address:"United Nations Children's Fund Headquarters",city:'New York',country:'United States',otherContactDetails:'@unicef'}
 ];

 export enum SelectType {
  single,
  multiple
}


