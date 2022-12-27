import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

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
  selector: 'app-view-manage-user-component',
  templateUrl: './view-manage-user-component.component.html',
  styleUrls: ['./view-manage-user-component.component.css']
})

export class ViewManageUserComponentComponent implements OnInit {
  displayedColumns: string[] = ['edit', 'partner','purdaccrs', 'year',
  'envagrcurr', 'exchangerateUsd'];
  displayedColumnsReadOnly: string[] = ['viewmore','partner','purdaccrs', 'year',
  'envagrcurr', 'exchangerateUsd', 'exchangerateMzn','amtannenvmeti'];

  displayedColumnsReadUpdate: string[] = ['position', 'partner','purdaccrs', 'year',
  'envagrcurr', 'exchangerateUsd', 'exchangerateMzn','amtannenvmeti','comments','edit','viewmore'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;


  myControl = new FormControl();
  chosenYearDate!: Date;
  currencyOptions: string[] = ['AFA','ALL','AOA','ARS','AMD','AWG','AUD','AZN','BSD','BHD','BDT','BBD','BYR','BEF','BZD','BMD','BTN','BTC','BAM','BWP','BRL','GBP','BND','BGN','BIF',
  'KHR','CAD','CVE','KYD','XOF','XAF','XPF','CLP','CNY','COP','KMF','CDF','CRC','CUC','CZK','DKK','DJF','DOP','XCD','EGP','ERN','EEK','ETB','EUR','FKP','FJD','GMD','GEL','DEM',
  'GHS','GIP','GRD','GTQ','GNF','GYD','HTG','HNL','HKD','HUF','ISK','INR','IDR','IRR','IQD','ILS','ITL','JMD','JPY','JOD','KZT','KES','KWD','KGS','LAK','LVL','LBP','LSL','LRD',
  'LYD','LTL','MOP','MKD','MGA','MWK','MYR','MVR','MRO','MUR','MXN','MDL','MNT','MAD','MZM','MMK','NAD','NPR','ANG','TWD','NZD','NIO','NGN','KPW','NOK','OMR','PKR','PAB','PGK',
  'PYG','PEN','PHP','PLN','QAR','RON','RUB','RWF','SVC','WST','SAR','RSD','SCR','SLL','SGD','SKK','SBD','SOS','ZAR','KRW','XDR','LKR','SHP','SDG','SRD','SZL','SEK','CHF','SYP',
  'STD','TJS','TZS','THB','TOP','TTD','TND','TRY','TMT','UGX','UAH','UYU','USD','UZS','VUV','VEF','VND','YER','ZMK'];

  donorOptions: string[] = ['Organization 1','Organization 2','Organization 3','Organization 4','Organization 5'];
  fundingOrganizationOptions : string[] = ['Organization 6','Organization 7','Organization 8','Organization 9','Organization 10'];
  responsibleOrganizationOptions: string[] = ['Organization 11','Organization 12','Organization 13','Organization 14','Organization 15'];
  typesOfAidDacCrs: string[] = [ 'General Budget Support', 'Sectorial Budget Support','Base funding to NGOs/Universities', 'Common Funds', 'Project', 'Grants and Training', 'Debt Relief'];
  typeOfFinanceOptions: string[] = ['Type of finance 1','Type of finance 2'];
  meoResourceSourceOptions: string[] = ['Option 1','Option 2', 'Option 3'];
  pillarPqgMeoOptions: string[] = ['Option 1','Option 2', 'Option 3'];
  strategicObjectivePqgMeoOptions: string[] = ['Option 1','Option 2', 'Option 3'];

  currencyfilter!: Observable<string[]>;
  donorfilter!: Observable<string[]>;
  fundingorganizationFilter!: Observable<string[]>;
  responsibleorganizationFilter!: Observable<string[]>;
  financingsituationFilter!: Observable<string[]>;
  typesOfAidDacCrsFilter!: Observable<string[]>;
  autoComeInLikeFilters!: Observable<string[]>;
  typeOfFinanceFilter!: Observable<string[]>;
  meoResourceSourceFilter!: Observable<string[]>;
  pillarPqgMeoFilter!: Observable<string[]>;
  strategicObjectivePqgMeoFilter!: Observable<string[]>;

  signatureDate = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  usergroup:any;

  elements!: NodeListOf<Element>;


  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private router:Router) { }






  ngOnInit(): void {

    console.log("Inside View envelope");
    this.usergroup=localStorage.getItem('usergroup');
    // this.dataSource.paginator = this.paginator;
    setTimeout(() => this.dataSource.paginator = this.paginator);
    // this.dataSource.paginator = this.paginator1;
    setTimeout(() =>  this.dataSource.sort = this.sort);

    this.currencyfilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.currencyFilter(value))
    );
    this.donorfilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.donorFilter(value))
    );
    this.fundingorganizationFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.fundingOrganizationFilter(value))
    );
    this.responsibleorganizationFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.responsibleOrganizationFilter(value))
    );
    this.typesOfAidDacCrsFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.typesOfAidDacCrsFilterMethod(value))
    );
    this.typeOfFinanceFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.typeOfFinanceFilterMethod(value))
    );
    this.meoResourceSourceFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.meoResourceSourceFilterMethod(value))
    );
    this.pillarPqgMeoFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.pillarPqgMeoMethod(value))
    );
    this.strategicObjectivePqgMeoFilter = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.strategicObjectivePqgMeoFilterMethod(value))
    );
  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEnv(element){
    console.log("edit env-->");
    this.router.navigate(["/organization"]);
  }

  public ExportTOExcel(){
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'Manage User Account');
    //this.excelService.exportTableElmToExcel(this.epltable, 'User Account');
    //this.ngAfterViewInit();
  }

  // ngAfterViewInit() {
  //   //console.log(this.epltable.nativeElement); // I am a child component!
  //   this.excelService.exportTableElmToExcel(this.epltable, 'Individual');
  // }
  private currencyFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencyOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
  private donorFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.donorOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
  }
 private fundingOrganizationFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fundingOrganizationOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
 }
 private responsibleOrganizationFilter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.responsibleOrganizationOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
 }
private typesOfAidDacCrsFilterMethod(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.typesOfAidDacCrs.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
}
private typeOfFinanceFilterMethod(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.typeOfFinanceOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
}
private strategicObjectivePqgMeoFilterMethod(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.strategicObjectivePqgMeoOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
}
private pillarPqgMeoMethod(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.pillarPqgMeoOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
}
private meoResourceSourceFilterMethod(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.meoResourceSourceOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort();
}

  step = 0;

  setStep(index: number) {
this.step = index;
  }

  nextStep() {
this.step++;
  }

  prevStep() {
this.step--;
  }

  viewMoreEnvelope(){

    localStorage.setItem("ViewMoreEnv", "ViewMoreEnv");
    console.log("View More inside view--->",localStorage.getItem("ViewMoreEnv"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-envelope']));

  }

  moveToSelectedTab1(tabName: string) {

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/envelope']));
  }
  moveToSelectedTab(tabName: string) {
    // console.log(JSON.stringify(element.donor));

    localStorage.setItem("EditEnv", "EditEnv");

    console.log("editenv inside view--->",localStorage.getItem("EditEnv"));

    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-envelope']));

    console.log("after route");
    // this.envelopeComponent.refresh();
// for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
// if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
//   (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
// }
//   }
  }


  opensweetalertDelete() {
    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Deleted Successfully!', '', 'success')
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

editEnvelope(element : any){
  console.log('element----->',JSON.stringify(element));
  localStorage.setItem('EditEnvelope',"EditEnvelope");
  localStorage.setItem('EditEnvelopeElement',JSON.stringify(element));
  this.router.navigate(['edit-envelope']);
  // const dialogRef = this.dialog.open(DialogboxIndividualComponentsComponent, { disableClose: true });
    }

  opensweetalert()
  {
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
}
export interface PeriodicElement {
  // position: number;
  userType: string;
  fullName: string;
  userName: string;
  email: string;
  dateOfJoin: string;
}



const ELEMENT_DATA: PeriodicElement[] = [
  {userType:'dngdpadmin',fullName: 'Charlie Adams',userName:'charlie',email:'charlie.adams12@email.com',dateOfJoin:'11-07-2019'},
  {userType:'dngdpteam',fullName: 'Arlete Bombe',userName:'arlete',email:'arlete.bombe@email.com',dateOfJoin:'23-02-2017'},
  {userType:'partner',fullName: 'Gilberto Mendes',userName:'mendes',email:'gilberto.mendes42@email.com',dateOfJoin:'31-12-2018'},
  {userType:'dntcef',fullName: 'Lucrecia Paco',userName:'paco',email:'lucrecia.paco@email.com',dateOfJoin:'01-02-2020'}
];


