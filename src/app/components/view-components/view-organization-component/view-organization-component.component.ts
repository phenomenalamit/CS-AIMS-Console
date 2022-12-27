// Author: Lopamudra Panda
// Module:View Organization List
// This is the ts file
// Ts file is having the logic of functionalaties

//import statements starts from here
//when we want to use/access any predefined/user defined class in this class then use use import statement

import { Component,ElementRef,Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { DateAdapter, MatOption, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/Service/excel.service';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { ViewTableModalOrganizationComponent } from '../../view-more-components/view-table-modal-organization/view-table-modal-organization.component';
import { Location } from '@angular/common';
import  { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { environment } from 'src/environments/environment';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelect } from '@angular/material/select';
//end of import statement
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
  selector: 'app-view-organization-component',
  templateUrl: './view-organization-component.component.html',
  styleUrls: ['./view-organization-component.component.css']
})
//class starts from here
export class ViewOrganizationComponentComponent implements OnInit {
  orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>(organizationGetDataList);

  organizationGetDataList: OrganizationCrudServiceClass[];
  displayedColumns: string[] = ['select','edit','names','acronym','category','parentCountry',];
    displayedColumnsReadOnly: string[] = ['position','names','acronym','category','parentCountry',];
    uAccessPermArr:UserAccessPermission[]=[];
    userPermission:number[]=[];
    authorised_flag=false;


    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  totalRows:number;
  index: number;
  id: number;
  myControl = new FormControl();
  chosenYearDate: Date;
  currencyOptions: string[] = ['AFA', 'ALL', 'AOA', 'ARS', 'AMD', 'AWG', 'AUD', 'AZN', 'BSD', 'BHD', 'BDT', 'BBD', 'BYR', 'BEF', 'BZD', 'BMD', 'BTN', 'BTC', 'BAM', 'BWP', 'BRL', 'GBP', 'BND', 'BGN', 'BIF',
    'KHR', 'CAD', 'CVE', 'KYD', 'XOF', 'XAF', 'XPF', 'CLP', 'CNY', 'COP', 'KMF', 'CDF', 'CRC', 'CUC', 'CZK', 'DKK', 'DJF', 'DOP', 'XCD', 'EGP', 'ERN', 'EEK', 'ETB', 'EUR', 'FKP', 'FJD', 'GMD', 'GEL', 'DEM',
    'GHS', 'GIP', 'GRD', 'GTQ', 'GNF', 'GYD', 'HTG', 'HNL', 'HKD', 'HUF', 'ISK', 'INR', 'IDR', 'IRR', 'IQD', 'ILS', 'ITL', 'JMD', 'JPY', 'JOD', 'KZT', 'KES', 'KWD', 'KGS', 'LAK', 'LVL', 'LBP', 'LSL', 'LRD',
    'LYD', 'LTL', 'MOP', 'MKD', 'MGA', 'MWK', 'MYR', 'MVR', 'MRO', 'MUR', 'MXN', 'MDL', 'MNT', 'MAD', 'MZM', 'MMK', 'NAD', 'NPR', 'ANG', 'TWD', 'NZD', 'NIO', 'NGN', 'KPW', 'NOK', 'OMR', 'PKR', 'PAB', 'PGK',
    'PYG', 'PEN', 'PHP', 'PLN', 'QAR', 'RON', 'RUB', 'RWF', 'SVC', 'WST', 'SAR', 'RSD', 'SCR', 'SLL', 'SGD', 'SKK', 'SBD', 'SOS', 'ZAR', 'KRW', 'XDR', 'LKR', 'SHP', 'SDG', 'SRD', 'SZL', 'SEK', 'CHF', 'SYP',
    'STD', 'TJS', 'TZS', 'THB', 'TOP', 'TTD', 'TND', 'TRY', 'TMT', 'UGX', 'UAH', 'UYU', 'USD', 'UZS', 'VUV', 'VEF', 'VND', 'YER', 'ZMK'];

  donorOptions: string[] = ['Organization 1', 'Organization 2', 'Organization 3', 'Organization 4', 'Organization 5'];
  fundingOrganizationOptions: string[] = ['Organization 6', 'Organization 7', 'Organization 8', 'Organization 9', 'Organization 10'];
  responsibleOrganizationOptions: string[] = ['Organization 11', 'Organization 12', 'Organization 13', 'Organization 14', 'Organization 15'];
  typesOfAidDacCrs: string[] = ['General Budget Support', 'Sectorial Budget Support', 'Base funding to NGOs/Universities', 'Common Funds', 'Project', 'Grants and Training', 'Debt Relief'];
  typeOfFinanceOptions: string[] = ['Type of finance 1', 'Type of finance 2'];
  meoResourceSourceOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  pillarPqgMeoOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  strategicObjectivePqgMeoOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];

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
  usergroup: any;
  elements!: NodeListOf<Element>;
  filterSelectObj = [];
  userNameForNotification:string='Charlie Adams';
  userGroupForNotification:string='DNGDP Data Administrator';
  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private router:Router,
  private dialog: MatDialog,
  private organizationCrudServiceService:OrganizationCrudServiceService,

  private location: Location) { 
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
      this.filterSelectObj = [
        {
          name: 'Name',
          columnProp: 'names',
          options: []
        }, {
          name: 'Category',
          columnProp: 'category',
          options: []
        },
        {
          name: 'Country / Umbrella organization',
          columnProp: 'country',
          options: []
        },
        {
          name: 'Funding Organization',
          columnProp: 'fundingOrganization',
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
          name: 'Categoria',
          columnProp: 'categoryPt',
          options: []
        },
        {
          name: 'País / Organização central',
          columnProp: 'country',
          options: []
        },
        {
          name: 'Organização financiadora',
          columnProp: 'fundingOrganization',
          options: []
        } 
      ]
    }
    
  }
  private getLabelData(id: number) {
  }
  //ngOnInit() will load at the page loading time
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    //getOrganizationDetails will show Organization Data at the view list page
    this.getOrganizationDetails();
    this.usergroup=localStorage.getItem('usergroup');
    this.setToUserPermission();
    setTimeout(() =>this.orgdataSource.paginator=this.paginator);
    // this.dataSource.paginator = this.paginator;
    setTimeout(() =>this.orgdataSource.sort = this.sort);
    this.currencyfilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.currencyFilter(value))
    );

  }
  // editOrg(element: any) {
  //   console.log('element----->', JSON.stringify(element));
  //   localStorage.setItem('EditOrg', "EditOrg");
  //   localStorage.setItem('EditOrgElement', JSON.stringify(element));
  //   const dialogRef = this.dialog.open(DialogBoxComponent, { disableClose: true });
  // }
  moveToSelectedTab(tabName: string) {
    localStorage.setItem("EditOrganization", "EditOrganization");

    console.log("editenv inside view--->", localStorage.getItem("EditOrganization"));


    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-organization']));

    console.log("after route");

  }
  editOrganization(orgId: number){
    // localStorage.setItem("EditOrganization", "EditOrganization");
    console.log("local storage",localStorage);
    console.log("EditOrg inside view--->",localStorage.getItem("EditOrg"));
    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-organization',orgId]));

    console.log("after route");

  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Organization List')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Organization List'){
        this.authorised_flag=true;
      }
    }
  }




  moveToSelectedTab1(tabName: string) {
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/organization']));

    // console.log("after route");
    this.location.back();

  }


  viewMoreOrganization(viewId: number){

    localStorage.setItem("ViewMoreOrganization", "ViewMoreOrganization");
    console.log("View More inside view--->",localStorage.getItem("ViewMoreOrganization"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-organization',viewId]));

  }

  applyFilter(filterValue: string) {
    this.orgdataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.orgdataSource.paginator) {
      this.orgdataSource.paginator.firstPage();
      this.totalRows=this.orgdataSource.filteredData.length;
    }
  }

  public ExportTOExcel() {
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Organization');
    //this.excelService.exportTableElmToExcel(this.epltable, 'Organization');
  }

  private currencyFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencyOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }


  // get totalRows(): number {
  //   return ELEMENT_DATA.length;
  // }
  //generateExcel() is responsibel to generate a excel sheet which contains data
  generateExcel(){
    let id=[];
for(let i=0;i<this.orgdataSource.filteredData.length;i++){
  id.push(this.orgdataSource.filteredData[i].id)
}
  window.open(environment.organizationExcelUrl+id+'/'+btoa(this.checkedFilterColumn),'_self')
    // window.open(environment.organizationExcelUrl,'_self')
    // let obj = new ViewIndividualComponentComponent(this._document,this.excelService,this.router,this.dialog,this.location,this.individualCrudServiceService);
    // obj.ExportTOExcel();
  }
  //end of generateExcel()
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  //opensweetalertDelete() will delete a particular entry from a set of data.
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

        this.organizationCrudServiceService.deleteById(this.ids,this.browserLang).subscribe(data =>{
          this.organizationGetDataList = data;
          console.log("data:",data);
          console.log("orgResponse:",this.organizationGetDataList);
          // let orgid = this.organizationGetDataList.find(x=>x.id==this.ids);
          // console.log("id :",orgid);
          // if(orgid == undefined){
            if(this.browserLang=='en'){
              Swal.fire('Deleted successfully', '', 'success')
            }else{
              Swal.fire('Apagado com sucesso', '', 'success')
            }
            this.getOrganizationDetails();
            this.deleteOrganizationNotificationAlert(this.ids);
          //   this.orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>( this.organizationGetDataList);
          // /* Set Paginator */
          // setTimeout(() =>
          //   this.orgdataSource.paginator = this.paginator
          // );
          // /* Set sorting */
          // setTimeout(() =>
          // this.orgdataSource.sort = this.sort
          // );
          // this.totalRows=this.orgdataSource.filteredData.length;
          // }else{
          //   Swal.fire('Something went wrong!', '', 'error');
          // }
        });
        
        // this.moveToViewTab;
      } else if (result.isDenied) {
        this.moveToViewTab;
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

  deleteOrganization(id: number) {
  }

  deleteOrganizationNotificationAlert(id:number[]){
    let todayTime = new Date();
    let orgName:string[] = [];
    id.forEach(id => {
      let orgNm=this.findOrgNameById(id);
      orgName.push(orgNm);
    });
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Organization Reference ID "'
      +orgName
    +'" deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Organization "'
      +orgName
      +'" with Reference ID "'
      +id
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

  private findOrgNameById(id:number){
    let orgName:string=null;
    for(let i=0;i<organizationGetDataList.length;i++){
      if(organizationGetDataList[i].id==id){
        orgName=organizationGetDataList[i].names;
      }
    }
    return orgName;
  }

  moveToViewTab(){
    this.router.navigate(['/admin/view-organization']);
  }
  browserLang: any;
  limits:number=0
  loadAllData(){
    this.limits=1;
    this.getOrganizationDetails();
      }
  private getOrganizationDetails() {
    this.organizationCrudServiceService.getOrganizationCurd(this.limits).subscribe(data => {
      // console.log("return data" + data.length);
      organizationGetDataList = data;
      console.log("all data" , organizationGetDataList);
      this.totalRows=organizationGetDataList.length;
      this.browserLang = localStorage.getItem("browserLang");
      this.orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>(organizationGetDataList);
      /* Set Paginator */
      setTimeout(() =>
      this.orgdataSource.paginator = this.paginator
      );
      /* Set sorting */
      setTimeout(() =>
      this.orgdataSource.sort = this.sort
    );
    this.category = [];
    this.parentCountry = [];
    this.fundingOrg = [];
    this.names = [];
    this.fundingAgency=[]
    for(let j=0;j<organizationGetDataList.length;j++){
      this.names.push(organizationGetDataList[j].names);
      if(this.browserLang=='en')
      this.category.push(organizationGetDataList[j].category);
      else
      this.category.push(organizationGetDataList[j].categoryPt);
      if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
      this.parentCountry.push(organizationGetDataList[j].country);
      if(organizationGetDataList[j].fundingOrganization !=null)
      this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
    }
    this.category = [...new Set(this.category)];
    this.parentCountry = [...new Set(this.parentCountry)];
    this.fundingOrg = [...new Set(this.fundingOrg)];
    this.names = [...new Set(this.names)];
    this.names_pub=this.names;
    this.category_pub=this.category
    this.fundingOrg_pub=this.fundingOrg
    this.parentCountry_pub=this.parentCountry

    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(organizationGetDataList, o.columnProp);
    });

    this.orgdataSource.filterPredicate = this.createFilter();
    });
  }






  Multilateral_or_bilateral:any;
  Emerging_non_Emerging:any;
  email:any;
  telephone:any;
  telephoneCode:any;
  faxCode:any;
  city:any;
  address:any;
  fundingAgency:any;


  openDialog(id:any,category:any) {
    localStorage.setItem("organizationId",id)
    localStorage.setItem("category",category)
    console.log("individual id:",this.id);
    const dialogRef = this.dialog.open(ViewTableModalOrganizationComponent, {
      disableClose: true,
    });
  }

  @ViewChildren('select') selectRef:QueryList<MatSelect>;
  /* Reset table filters */
  resetFilters() {
    this.selectRef.forEach(function (el) {
      el.options.forEach((data: MatOption) => data.deselect());
  });
  
  }


  //  openDialog(i) {

  //   localStorage.setItem("Multilateral_or_bilateral",ELEMENT_DATA[i].Multilateral_or_bilateral);
  //   localStorage.setItem("Emerging_non_Emerging",ELEMENT_DATA[i].Emerging_non_Emerging);
  //   localStorage.setItem("email",ELEMENT_DATA[i].email);
  //   localStorage.setItem("telephone",ELEMENT_DATA[i].telephone);
  //   localStorage.setItem("telephoneCode",ELEMENT_DATA[i].telephoneCode);
  //   localStorage.setItem("faxCode",ELEMENT_DATA[i].faxCode);
  //   localStorage.setItem("city",ELEMENT_DATA[i].city);
  //   localStorage.setItem("address",ELEMENT_DATA[i].address);
  //   localStorage.setItem("fundingAgency",ELEMENT_DATA[i].fundingAgency);

  //    const dialogRef = this.dialog.open(ViewTableModalOrganizationComponent, {
  //      disableClose: true,
  //    });
  //   //  dialogRef.afterClosed().subscribe((result) => {
  //   //    this.router.navigate(['organization']);
  //   //   });

  //  }



  private refreshTable() {

    this.paginator._changePageSize(this.paginator.pageSize);
  }

// Get Uniqu values from columns to build filter
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
category=[];
parentCountry=[];
fundingOrg=[];
names_pub=[];
category_pub=[];
parentCountry_pub=[];
fundingOrg_pub=[];
filterFundingOrgFlag:boolean=false;
checkedValue=0;
nameFinalSelected=[];
catagoryFinalSelected=[]
parentCountryFinalSelected=[];
fundingOrgFinalSelected=[];

nameTempSelect=[];
categoryTempSelect=[];
parentCntryTempSelect=[];
fundingOrgTempSelect=[];
createFilter() {

  let filterFunction =  (data: any, filter: string): boolean => {
  
  let searchTerms = JSON.parse(filter);
  let isFilterSet = false;
  for (const col in searchTerms) {
      if (searchTerms[col].toString() !== '') {
      isFilterSet = true;
      } else {
      delete searchTerms[col];
        this.category = [];
        this.parentCountry = [];
        this.fundingOrg = [];
        this.names = [];
        this.fundingAgency = [];
        this.nameTempSelect = [];
        this.categoryTempSelect = [];
        this.parentCntryTempSelect = [];
        this.fundingOrgTempSelect = [];
        this.checkedValue=0;
        for(let j=0;j<organizationGetDataList.length;j++){
          this.names.push(organizationGetDataList[j].names);
          if(this.browserLang=='en'){
            this.category.push(organizationGetDataList[j].category);
          }else{
            this.category.push(organizationGetDataList[j].categoryPt);
          }
          
          if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
          this.parentCountry.push(organizationGetDataList[j].country);
          if(organizationGetDataList[j].fundingOrganization !=null)
          this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
        }
        this.category = [...new Set(this.category)];
        this.parentCountry = [...new Set(this.parentCountry)];
        this.fundingOrg = [...new Set(this.fundingOrg)];
        this.names = [...new Set(this.names)];

        this.category_pub=this.category;
        this.parentCountry_pub=this.parentCountry
        this.fundingOrg_pub=this.fundingOrg;
        this.names_pub=this.names

      if(col == 'category' || col== 'categoriaPt'){
        if (data[col].toLowerCase() == ('donor').toString().toLowerCase()) {
         this.filterFundingOrgFlag=false;
        }
      }
      this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(organizationGetDataList, o.columnProp);
    });
      }
  }
  this.filterFundingOrgFlag=false;
  let nameSearch = () => {
      let found = false;
      let checkIn = 0;
        let total = 0;
      if (isFilterSet) {
      for (const col in searchTerms) {
        total++;
        ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
        
          if(this.checkedValue==0){
            this.catagoryFinalSelected=this.category;
            this.nameFinalSelected=this.names;
            this.parentCountryFinalSelected=this.parentCountry;
            this.fundingOrgFinalSelected=this.fundingOrg
          }
          this.category = [];
          this.parentCountry = [];
          this.fundingOrg = [];
          this.names = [];
          this.fundingAgency=[]

          this.nameTempSelect = [];
          this.categoryTempSelect = [];
          this.parentCntryTempSelect = [];
          this.fundingOrgTempSelect = [];
          let spl:any;
          // if(col != 'fundingOrganization'){
          //    spl = word.split(",");
          // }else{
          //    spl = word.split(", ");
          // }
           spl = word.split(",");
           
            for(let i=0;i<spl.length;i++)
            {
                /* adding Running filter start */
                this.checkedValue=1;
              if (col == 'category' || col=='categoryPt') {
                if ((spl[i].toLowerCase() == ('donor').toString().toLowerCase()) ||(spl[i].toLowerCase() == ('Doador').toString().toLowerCase())) {
                  this.filterFundingOrgFlag = true;
                  for (let j = 0; j < organizationGetDataList.length; j++) {
                    this.fundingAgency.push(organizationGetDataList[j].names);
                  }
                } 
                // else {
                //   this.filterFundingOrgFlag = false;
                // }
              }
              if (col == 'names' && this.fundingAgency.length != 0) {
                this.filterFundingOrgFlag = true;
              }
              for (let j = 0; j < organizationGetDataList.length; j++) {
              if(col=='names'){
                if (spl[i].toLowerCase() == (organizationGetDataList[j].names).toString().toLowerCase()) {
                  this.nameTempSelect.push(organizationGetDataList[j].names)
                  if(this.browserLang=='en'){
                    this.category.push(organizationGetDataList[j].category);
                  }else{
                    this.category.push(organizationGetDataList[j].categoryPt);
                  }  
                  if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
                  this.parentCountry.push(organizationGetDataList[j].country);
                  if(organizationGetDataList[j].fundingOrganization !=null)
                  this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
                }
              }
              else if(col=='category' || col=='Categoria'){
                if (spl[i].toLowerCase() == (organizationGetDataList[j].category).toString().toLowerCase()) {
                 if(this.browserLang=='en'){
                  this.categoryTempSelect.push(organizationGetDataList[j].category)
                 }else{
                  this.categoryTempSelect.push(organizationGetDataList[j].categoryPt)
                 }
                  this.names.push(organizationGetDataList[j].names);
                  if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null){
                    this.parentCountry.push(organizationGetDataList[j].country); 
                  }
                  if(organizationGetDataList[j].fundingOrganization !=null)
                  this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
                }
              }
              else if (col == 'country') {
                if (spl[i].toLowerCase() == (organizationGetDataList[j].country).toString().toLowerCase()) {
                  this.names.push(organizationGetDataList[j].names);
                  this.parentCntryTempSelect.push(organizationGetDataList[j].country)
                  if(this.browserLang=='en'){
                    this.category.push(organizationGetDataList[j].category);
                  }else{
                    this.category.push(organizationGetDataList[j].categoryPt);
                  }
                  if (organizationGetDataList[j].fundingOrganization != null)
                    this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
                }
              }
              else if (col == 'fundingOrganization') {
                console.log("funding org ",organizationGetDataList[j].fundingOrganization)
                if(organizationGetDataList[j].fundingOrganization != null){
                 if (spl[i].toLowerCase() == (organizationGetDataList[j].fundingOrganization).toString().toLowerCase()) {
                  this.fundingOrgTempSelect.push(organizationGetDataList[j].fundingOrganization)  
                  this.names.push(organizationGetDataList[j].names);
                    if(this.browserLang=='en'){
                      this.category.push(organizationGetDataList[j].category);
                    }else{
                      this.category.push(organizationGetDataList[j].categoryPt);
                    }
                    if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null){
                      this.parentCountry.push(organizationGetDataList[j].country); 
                    }
                  }
                }
               
              }
            }
               /* adding Running filter end */

               if(data[col] !=null){
                if ( data[col].toString().toLowerCase() == spl[i].toLowerCase()  && isFilterSet) {
                  found = true;
                  checkIn++;
              }
            }
          }
          });
        }
  
  if( this.filterFundingOrgFlag==false){
    this.filterSelectObj.filter((o) => {
      if(o.columnProp=='names'){
     for (let j = 0; j < organizationGetDataList.length; j++) {
     this.fundingAgency.push(organizationGetDataList[j].names);
     }
     this.fundingAgency=[...new Set(this.fundingAgency)];
     
   }
  
  });
  }
 
        this.category = [...new Set(this.category)];
        if(this.category.length !=0)
        this.category_pub=this.category
        else{
          this.category_pub=this.catagoryFinalSelected;
          // this.filterSelectObj.filter((o) => {
          //   if(this.browserLang=='en'){
          //     if (o.columnProp == 'category') {
          //       this.category_pub=o.options;
          //     }
          //   }else{
          //     if (o.columnProp == 'categoryPt') {
          //       this.category_pub=o.options;
          //     }
          //   }
            
          // });
        }
        

        this.parentCountry = [...new Set(this.parentCountry)];
        if(this.parentCountry.length !=0)
        this.parentCountry_pub=this.parentCountry
        else{
          this.parentCountry_pub=this.parentCountryFinalSelected
          // this.filterSelectObj.filter((o) => {
          //   if (o.columnProp == 'country') {
          //     this.parentCountry_pub=o.options;
          //   }
          // });
        }
        

        this.fundingOrg = [...new Set(this.fundingOrg)];
        if(this.fundingOrg.length !=0)
        this.fundingOrg_pub=this.fundingOrg
        else
        {
          this.fundingOrg_pub=this.fundingOrgFinalSelected
          // this.filterSelectObj.filter((o) => {
          //   if (o.columnProp == 'fundingOrganization') {
          //     this.fundingOrg_pub=o.options;
          //   }
          // });
        }

        this.names = [...new Set(this.names)];
        if(this.names.length !=0)
        this.names_pub=this.names;
        else
        {
          this.names_pub=this.nameFinalSelected;
          // this.filterSelectObj.filter((o) => {
          //   if (o.columnProp == 'names') {
          //     this.names_pub=o.options ;
             
          //   }
          // });
        }

        if(this.names.length !=0){
          this.filterSelectObj.filter((o) => {
            if (o.columnProp == 'names') {
              o.options = this.names, 'names';
             
            }
          });
        }
          if(this.category.length !=0){
              this.filterSelectObj.filter((o) => {
                if(this.browserLang=='en'){
                  if (o.columnProp == 'category') {
                    o.options = this.category, 'category';
                  }
                }else{
                  if (o.columnProp == 'categoryPt') {
                    o.options = this.category, 'categoryPt';
                  }
                }
                
              });
            }
      if(this.parentCountry.length !=0){
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'country') {
                o.options = this.parentCountry, 'country';
              }
            });
          }
          if(this.fundingOrg.length !=0){
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'fundingOrganization') {
                o.options = this.fundingOrg, 'fundingOrganization';
              }
            });
          }
          // alert("checkIn "+checkIn)
          // alert("total "+total)
    return (checkIn == total);
      } else {
      return true;
      }
  }
  return nameSearch()
  }
  return filterFunction
}
filterValues = {};
checkedFilterColumn:any={};
filterChange(filter, event) {
  
 console.log("event:"+event.value);
 console.log("filter: "+filter.columnProp);
 this.filterValues[filter.columnProp] = event.value
 this.orgdataSource.filter = JSON.stringify(this.filterValues)
 console.log("filter values ",this.orgdataSource.filteredData)
 this.totalRows=0;
 this.checkedFilterColumn=this.orgdataSource.filter;
 this.totalRows=this.orgdataSource.filteredData.length;
}
noResult=true
searchFilter = new FormControl('');
  openOptionSearch(filter,e) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    // debugger
    console.log("searchFilterVal ",searchFilterVal)
    if(searchFilterVal!= undefined && searchFilterVal!= null){
    if (columnName== 'names' ) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'names')
        o.options = this.names_pub, 'names';
      });
    }
    if (( columnName== 'category') || ( columnName== 'categoryPt' )) {
      this.filterSelectObj.filter((o) => {
        if(this.browserLang =='en'){
          if(o.columnProp== 'category')
          o.options = this.category_pub, 'category';
        }else{
          if(o.columnProp== 'categoryPt')
        o.options = this.category_pub, 'categoryPt';
        }
        
      });
    }
    if ( columnName== 'country') {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'country')
        o.options = this.parentCountry_pub, 'country';
      });
    }
    if ( columnName== 'fundingOrganization') {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'fundingOrganization')
        o.options = this.fundingOrg_pub, 'fundingOrganization';
      });
    }
    
  
  }
  this.searchFilter.patchValue('');
  }
  chkValue(filter) {
   
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let names_Local=[];
    let category_Local=[];
    let parentCountry_Local=[];
    let fundingAgency_Local=[];

    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < organizationGetDataList.length; i++) {
       
        if (columnName == 'names') {
          if(this.names.length ==0){
          if (((organizationGetDataList[i].names).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            names_Local.push(organizationGetDataList[i].names);
          }
        }else if(this.names.length !=0){
          if(this.names[i] !=undefined)  {
          if (((this.names[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            names_Local.push(this.names[i]);
          }
        }
        } 
            
      }else if (columnName == 'category' || columnName== 'categoryPt') {
        if(this.category.length ==0){
          if (((organizationGetDataList[i].category).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
           if(this.browserLang =='en'){
            category_Local.push(organizationGetDataList[i].category);
           }else{
            category_Local.push(organizationGetDataList[i].categoryPt);
           }
            
          }
        }else if(this.category.length !=0){
          if(this.category[i] !=undefined)  {
          if (((this.category[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            category_Local.push(this.category[i]);
          }
        }
      }
        }else if (columnName == 'country') {
          if(this.parentCountry.length ==0){
          if (((organizationGetDataList[i].country).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            parentCountry_Local.push(organizationGetDataList[i].country);
          } }
          else if(this.parentCountry.length !=0){
            if(this.parentCountry[i] !=undefined)  {
            if (((this.parentCountry[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              parentCountry_Local.push(this.parentCountry[i]);
           
          }
        }
        }
        }else if (columnName == 'fundingOrganization') {
          if(this.fundingOrg.length ==0){
           if(organizationGetDataList[i].fundingOrganization != null){
          if (((organizationGetDataList[i].fundingOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            fundingAgency_Local.push(organizationGetDataList[i].fundingOrganization);
          }
        }
          }
          else if(this.fundingOrg.length !=0){
            if(this.fundingOrg[i] !=undefined)  {
            if (((this.fundingOrg[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              fundingAgency_Local.push(this.fundingOrg[i]);
           
          }
        }
        }
        }
      }
    }
    if (columnName == 'names') {
      if(this.nameTempSelect.length!=0){
        for(let k=0;k<this.nameTempSelect.length;k++)
        names_Local.push(this.nameTempSelect[k])
      }
      names_Local = [...new Set(names_Local)];
      
      // this.names_pub=names_Local;
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'names') {
          o.options = names_Local, 'names';
        }
      });
    } if(columnName == 'category' || columnName=='categoryPt') {
      
      if(this.categoryTempSelect.length!=0){
        for(let k=0;k<this.categoryTempSelect.length;k++)
        category_Local.push(this.categoryTempSelect[k])
      }
      category_Local = [...new Set(category_Local)];
      // this.category_pub=category_Local
      this.filterSelectObj.filter((o) => {
        if(this.browserLang== 'en'){
          if (o.columnProp == 'category') {
            o.options = category_Local, 'category';
          }
        }else{
          if (o.columnProp == 'categoryPt') {
            o.options = category_Local, 'categoryPt';
          }
        }
        
      });
    }if(columnName == 'country') {
      if(this.parentCntryTempSelect.length!=0){
        for(let k=0;k<this.parentCntryTempSelect.length;k++)
        parentCountry_Local.push(this.parentCntryTempSelect[k])
      }
      parentCountry_Local = [...new Set(parentCountry_Local)];
      // this.parentCountry_pub=parentCountry_Local
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'country') {
          o.options = parentCountry_Local, 'country';
        }
      });
    } if(columnName == 'fundingOrganization') {
      if(this.fundingOrgTempSelect.length!=0){
        for(let k=0;k<this.fundingOrgTempSelect.length;k++)
        fundingAgency_Local.push(this.fundingOrgTempSelect[k])
      }
      fundingAgency_Local = [...new Set(fundingAgency_Local)];
      // this.fundingOrg_pub=fundingAgency_Local
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrganization') {
          o.options = fundingAgency_Local, 'fundingOrganization';
        }
      });
    }
    // if (searchFilterVal.length == 0) {
    //   this.filterSelectObj.filter((o) => {
    //     o.options = this.getFilterObject(ELEMENT_DATA, o.columnProp);
    //   });
    // }
    if (searchFilterVal.length == 0 && columnName== 'names' && this.names_pub.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'names')
        o.options = this.names_pub, 'names';
      });
    }
    if ((searchFilterVal.length == 0 && columnName== 'category' && this.category_pub.length!=0) || (searchFilterVal.length == 0 && columnName== 'categoryPt' && this.category_pub.length!=0)) {
      this.filterSelectObj.filter((o) => {
        if(this.browserLang =='en'){
          if(o.columnProp== 'category')
          o.options = this.category_pub, 'category';
        }else{
          if(o.columnProp== 'categoryPt')
        o.options = this.category_pub, 'categoryPt';
        }
        
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'country' && this.parentCountry_pub.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'country')
        o.options = this.parentCountry_pub, 'country';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'fundingOrganization' && this.fundingOrg_pub.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'fundingOrganization')
        o.options = this.fundingOrg_pub, 'fundingOrganization';
      });
    }
  }
  selection = new SelectionModel<OrganizationCrudServiceClass>(true, []);

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: OrganizationCrudServiceClass) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.id);
    } else {
      let index = this.ids.indexOf(row.id, 0);
      this.ids.splice(index, 1);
    }
  }
  nameOption: Observable<any[]>;
}
//end of class
let organizationGetDataList: OrganizationCrudServiceClass[];

export interface PeriodicElement {
  // position: number;
  names: string;
  acronym: string;
  category: string;
  parentCountry: string;

  Multilateral_or_bilateral: string;
  Emerging_non_Emerging: string;

  email: string;
  telephone: string;
  telephoneCode:string;
  faxCode:string;
  fax: string;
  address: string;
  city: string;
  fundingAgency: string;
}
export enum SelectType {
  single,
  multiple
}
const ELEMENT_DATA: PeriodicElement[] = [
  {names:'World Bank',acronym:'acronym - 01',category:'Donor',fundingAgency:'World Bank',Multilateral_or_bilateral:'Multilateral',Emerging_non_Emerging:'Emerging',email:'contact@wb.com',telephone:'4654652152',telephoneCode:'+91',fax:'456789',faxCode:'+91',city:'Maputo',address:'near Maputo HQ',parentCountry:'Afghanistan'},
  {names:'UNICEF',acronym:'acronym - 02',category:'Implementation agency',fundingAgency:'World Bank',Multilateral_or_bilateral:'Bilateral',Emerging_non_Emerging:'Emerging', email:'contact@UNICEF.com', telephone:'451262541',telephoneCode:'+91',fax:'4512625412',faxCode:'+91',city:'Beira',address:'near Beira HQ',parentCountry:'Algeria'},
  {names:'WHO',acronym:'acronym - 03', category:'NGO',fundingAgency:'World Bank',Multilateral_or_bilateral:'Multilateral',Emerging_non_Emerging:'Non Emerging',email:'contact@who.com', telephone:'4541268975',telephoneCode:'+91',fax:'4654652152',faxCode:'+91',city:'Maputo',address:'near Maputo HQ',parentCountry:'Afghanistan'},
  {names:'WHO',acronym:'acronym - 04',category:'NGO',fundingAgency:'WHO',Multilateral_or_bilateral:'Bilateral',Emerging_non_Emerging:'Emerging',email:'contact@who.com', telephone:'9564256845',telephoneCode:'+91',fax:'4512625412',faxCode:'+91',city:'Pemba',address:'near Pemba HQ',parentCountry:'Algeria'},
  {names:'World Bank',acronym:'acronym - 05',category:'Company',fundingAgency:'World Bank',Multilateral_or_bilateral:'Multilateral',Emerging_non_Emerging:'Non Emerging',email:'contact@wb.com', telephone:'5421562354',telephoneCode:'+91',fax:'4654652152',faxCode:'+91',city:'Maputo',address:'near Maputo HQ',parentCountry:'Algeria'},
  {names:'UNICEF',acronym:'acronym - 06',category:'Company',fundingAgency:'UNICEF',Multilateral_or_bilateral:'Bilateral',Emerging_non_Emerging:'Emerging',email:'contact@UNICEF.com', telephone:'4653565466',telephoneCode:'+91',fax:'4512625412',faxCode:'+91',city:'Pemba',address:'near Pemba HQ',parentCountry:'Afghanistan'}


];











