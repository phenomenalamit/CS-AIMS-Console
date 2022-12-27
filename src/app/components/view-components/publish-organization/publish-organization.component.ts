import { Component,ElementRef,Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/Service/excel.service';
import { DialogBoxComponent } from 'src/app/dialog-box/dialog-box.component';
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

@Component({
  selector: 'app-publish-organization',
  templateUrl: './publish-organization.component.html',
  styleUrls: ['./publish-organization.component.css']
})
export class PublishOrganizationComponent implements OnInit {
  orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>(organizationGetDataList);

  organizationGetDataList: OrganizationCrudServiceClass[];
  displayedColumns: string[] = ['select','edit','names','acronym','category','parentCountry',];
    displayedColumnsReadOnly: string[] = ['position','names','acronym','category','parentCountry',];
    uAccessPermArr:UserAccessPermission[]=[];
    userPermission:number[]=[];
    authorised_flag=false;




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

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private router:Router,
  private dialog: MatDialog,
  private organizationCrudServiceService:OrganizationCrudServiceService,
  private location: Location) {
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
        name: 'Country / Parent Organization',
        columnProp: 'country',
        options: []
      },
      {
        name: 'Funding Organization',
        columnProp: 'fundingOrganization',
        options: []
      }
    ]
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
    window.open(environment.organizationExcelUrl,'_self')
    // let obj = new ViewIndividualComponentComponent(this._document,this.excelService,this.router,this.dialog,this.location,this.individualCrudServiceService);
    // obj.ExportTOExcel();
  }
  //end of generateExcel()



  moveToViewTab(){
    this.router.navigate(['/admin/view-organization']);
  }

  private getOrganizationDetails() {
    this.organizationCrudServiceService.getDraftedOrganizationCurd().subscribe(data => {
      // console.log("return data" + data.length);
      organizationGetDataList = data;
      // console.log("all data" , this.organizationGetDataList);
      this.totalRows=organizationGetDataList.length;
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
      this.category.push(organizationGetDataList[j].category);
      if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
      this.parentCountry.push(organizationGetDataList[j].country);
      if(organizationGetDataList[j].fundingOrganization !=null)
      this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
    }
    this.category = [...new Set(this.category)];
    this.parentCountry = [...new Set(this.parentCountry)];
    this.fundingOrg = [...new Set(this.fundingOrg)];
    this.names = [...new Set(this.names)];
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


  openDialog(id:any) {

    localStorage.setItem("organizationId",id)
    console.log("individual id:",this.id);
    const dialogRef = this.dialog.open(ViewTableModalOrganizationComponent, {
      disableClose: true,
    });
  }


  displayType = SelectType.multiple;
  ids: number[] = [];
  selection = new SelectionModel<OrganizationCrudServiceClass>(true, []);

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
    console.log("this.ids: ",this.ids);
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
          this.organizationCrudServiceService.publishOrganizationById(this.ids).subscribe(data => {
            organizationGetDataList = data;
            /* Add data in MatTableDataSource */
            this.orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>(organizationGetDataList);

            /* Set Paginator */
            setTimeout(() =>
              this.orgdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.orgdataSource.sort = this.sort
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
          this.organizationCrudServiceService.discardOrganizationById(this.ids).subscribe(data => {
            organizationGetDataList = data;
            /* Add data in MatTableDataSource */
            this.orgdataSource = new MatTableDataSource<OrganizationCrudServiceClass>(organizationGetDataList);

            /* Set Paginator */
            setTimeout(() =>
              this.orgdataSource.paginator = this.paginator
            );
            /* Set sorting */
            setTimeout(() =>
              this.orgdataSource.sort = this.sort
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

  filterSelectObj = [];
  searchFilter = new FormControl('');
  names=[];
  category=[];
  parentCountry=[];
  fundingOrg=[];
  filterFundingOrgFlag:boolean=false;
  filterValues = {};

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
          this.fundingAgency = []
          for(let j=0;j<organizationGetDataList.length;j++){
            this.names.push(organizationGetDataList[j].names);
            this.category.push(organizationGetDataList[j].category);
            if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
            this.parentCountry.push(organizationGetDataList[j].country);
            if(organizationGetDataList[j].fundingOrganization !=null)
            this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
          }
          this.category = [...new Set(this.category)];
          this.parentCountry = [...new Set(this.parentCountry)];
          this.fundingOrg = [...new Set(this.fundingOrg)];
          this.names = [...new Set(this.names)];
        if(col == 'category'){
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
            this.category = [];
            this.parentCountry = [];
            this.fundingOrg = [];
            this.names = [];
            this.fundingAgency=[]

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

                if (col == 'category') {
                  if (spl[i].toLowerCase() == ('donor').toString().toLowerCase()) {
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
                    this.category.push(organizationGetDataList[j].category);
                    if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null)
                    this.parentCountry.push(organizationGetDataList[j].country);
                    if(organizationGetDataList[j].fundingOrganization !=null)
                    this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
                  }
                }
                else if(col=='category'){
                  if (spl[i].toLowerCase() == (organizationGetDataList[j].category).toString().toLowerCase()) {
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
                    this.category.push(organizationGetDataList[j].category);
                    if (organizationGetDataList[j].fundingOrganization != null)
                      this.fundingOrg.push(organizationGetDataList[j].fundingOrganization)
                  }
                }
                else if (col == 'fundingOrganization') {
                  console.log("funding org ",organizationGetDataList[j].fundingOrganization)
                  if(organizationGetDataList[j].fundingOrganization != null){
                   if (spl[i].toLowerCase() == (organizationGetDataList[j].fundingOrganization).toString().toLowerCase()) {
                      this.names.push(organizationGetDataList[j].names);
                      this.category.push(organizationGetDataList[j].category);
                      if(organizationGetDataList[j].country !="" || organizationGetDataList[j].country !=null){
                        this.parentCountry.push(organizationGetDataList[j].country);
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
          this.parentCountry = [...new Set(this.parentCountry)];
          this.fundingOrg = [...new Set(this.fundingOrg)];
          this.names = [...new Set(this.names)];

          if(this.names.length !=0){
            this.filterSelectObj.filter((o) => {
              if (o.columnProp == 'names') {
                o.options = this.names, 'names';

              }
            });
          }
            if(this.category.length !=0){
                this.filterSelectObj.filter((o) => {
                  if (o.columnProp == 'category') {
                    o.options = this.category, 'category';

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

  filterChange(filter, event) {

    console.log("event:"+event.value);
    console.log("filter: "+filter.columnProp);
    this.filterValues[filter.columnProp] = event.value
    this.orgdataSource.filter = JSON.stringify(this.filterValues)
    console.log("filter values ",this.orgdataSource.filteredData)
    this.totalRows=0;
    this.totalRows=this.orgdataSource.filteredData.length;
   }
   openOptionSearch(e) {
    this.searchFilter.patchValue('');
  }
  chkValue(filter) {

    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let names=[];
    let category=[];
    let parentCountry=[];
    let fundingAgency=[];

    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < organizationGetDataList.length; i++) {

        if (columnName == 'names') {
          if(this.names.length ==0){
          if (((organizationGetDataList[i].names).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            names.push(organizationGetDataList[i].names);
          }
        }else if(this.names.length !=0){
          if(this.names[i] !=undefined)  {
          if (((this.names[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            names.push(this.names[i]);
          }
        }
        }

      }else if (columnName == 'category') {
        if(this.category.length ==0){
          if (((organizationGetDataList[i].category).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            category.push(organizationGetDataList[i].category);
          }
        }else if(this.category.length !=0){
          if(this.category[i] !=undefined)  {
          if (((this.category[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            category.push(this.category[i]);
          }
        }
      }
        }else if (columnName == 'country') {
          if(this.parentCountry.length ==0){
          if (((organizationGetDataList[i].country).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            parentCountry.push(organizationGetDataList[i].country);
          } }
          else if(this.parentCountry.length !=0){
            if(this.parentCountry[i] !=undefined)  {
            if (((this.parentCountry[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              parentCountry.push(this.parentCountry[i]);

          }
        }
        }
        }else if (columnName == 'fundingOrganization') {
          if(this.fundingOrg.length ==0){
           if(organizationGetDataList[i].fundingOrganization != null){
          if (((organizationGetDataList[i].fundingOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            fundingAgency.push(organizationGetDataList[i].fundingOrganization);
          }
        }
          }
          else if(this.fundingOrg.length !=0){
            if(this.fundingOrg[i] !=undefined)  {
            if (((this.fundingOrg[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              fundingAgency.push(this.fundingOrg[i]);

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
    } if(columnName == 'category') {
      category = [...new Set(category)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'category') {
          o.options = category, 'category';
        }
      });
    }if(columnName == 'country') {
      parentCountry = [...new Set(parentCountry)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'country') {
          o.options = parentCountry, 'country';
        }
      });
    } if(columnName == 'fundingOrganization') {
      fundingAgency = [...new Set(fundingAgency)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrganization') {
          o.options = fundingAgency, 'fundingOrganization';
        }
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'names' && this.names.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'names')
        o.options = this.names, 'names';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'category' && this.category.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'category')
        o.options = this.category, 'category';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'country' && this.parentCountry.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'country')
        o.options = this.parentCountry, 'country';
      });
    }
    if (searchFilterVal.length == 0 && columnName== 'fundingOrganization' && this.fundingOrg.length!=0) {
      this.filterSelectObj.filter((o) => {
        if(o.columnProp== 'fundingOrganization')
        o.options = this.fundingOrg, 'fundingOrganization';
      });
    }
  }

}
//end of class
let organizationGetDataList: OrganizationCrudServiceClass[];
export enum SelectType {
  single,
  multiple
}
