import { Component, ElementRef, Inject,OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../view-envelope-component/view-envelope-component.component';
import * as _moment from 'moment';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ExcelService } from '../../../Service/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogboxUseraccountComponentComponent } from '../../dialogbox-components/dialogbox-useraccount-component/dialogbox-useraccount-component.component';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { UserAccount } from 'src/app/model/user-account';
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
  selector: 'app-view-user-account-component',
  templateUrl: './view-user-account-component.component.html',
  styleUrls: ['./view-user-account-component.component.css']
})
export class ViewUserAccountComponentComponent implements OnInit {
  displayedColumns: string[] = ['edit','firstName','lastName', 'userName','email','typeOfUser','userGroup','permissions'];
  dataSource = new MatTableDataSource<UserAccount>(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  myControl = new FormControl();
  chosenYearDate!: Date;

  //
  firstNameOptions: string[] = ['Account 1','Account 2','Account 3','Account 4','Account 5'];
  lastNameOptions: string[] = ['Account 1','Account 2','Account 3','Account 4','Account 5'];
  userNameOptions:string[] = ['User Name  1','User Name  2','User Name  3','User Name  4','User Name  5'];
  emailOptions:string[] = ['Email  1','Email  2','Email  3','Email  4','Email  5'];
  typeOfUserOptions:string[] = ['User 1','User 2','User  3','User 4','User 5'];
  userGroupOptions:string[] = ['UserGroup 1','UserGroup 2','UserGroup  3','UserGroup 4','UserGroup 5'];
  permissionsOptions:string[] = ['permission 1','permission 2','permission  3','permission 4','permission 5'];
  operationsOptions:string[] = ['operations 1','operations 2','operations  3','operations 4','operations 5'];
  featuresOptions:string[] = ['features 1','features 2','features  3','features 4','features 5'];


  firstNamefilter!: Observable<string[]>;
  lastNamefilter!: Observable<string[]>;
  userNamefilter!: Observable<string[]>;
  emailFilter!: Observable<string[]>;
  typeOfUserFilter!: Observable<string[]>;
  userGroupFilter!: Observable<string[]>;
  permissionsFilter!: Observable<string[]>;
  operationsFilters!: Observable<string[]>;
  featuresFilter!: Observable<string[]>;



  constructor(@Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private router:Router,private location: Location) { }
  elements!: NodeListOf<Element>;

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  generateExcel(){
    console.log("123456");
    let obj = new ViewUserAccountComponentComponent(this._document,this.excelService,this.router,this.location);
    obj.ExportTOExcel();
    //this.ngAfterViewInit();
  }

  // editOrg(element: any){
  //   console.log("element:"+element);
  //   localStorage.setItem("EditUserAccountElement",JSON.stringify(element));
  //   const dialogRef = this.dialog.open(DialogboxUseraccountComponentComponent,{disableClose:true});
  // }

  editUserAcct(element: any){
    localStorage.setItem("EditUserAcct", "EditUserAcct");

    console.log("EditUserAcct inside view--->",localStorage.getItem("EditUserAcct"));

    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-user-account']));

    console.log("after route");

  }
  viewMoreUserAccount(element: any){
    localStorage.setItem("ViewMoreUserAccount", "ViewMoreUserAccount");
    console.log("View More inside view--->",localStorage.getItem("ViewMoreUserAccount"));

    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-user-account']));

    console.log("after route");
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
  moveToSelectedTab(tabName: string) {


    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/userAccount']));
    // console.log("after route");
    this.location.back();
  }
  get totalRows(): number {
    return ELEMENT_DATA.length;
  }

  public ExportTOExcel(){
    console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'User Account');
    //this.excelService.exportTableElmToExcel(this.epltable, 'User Account');
  }

  // ngAfterViewInit(){
  //   this.excelService.exportTableElmToExcel(this.epltable, 'Project');
  // }
  opensweetalertDelete() {
    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Delete`,
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


export class userAccount{
  // position!:number;
  firstName!:string;
  lastName!:string;
  userName!:string;
  email!:string;
   typeOfUser!:string;
   userGroup!:string;

   permissions!: string;
   operations!: string;
   features!: string;
}

const ELEMENT_DATA: UserAccount[] = [
  {firstName:'Esperanca',lastName:'Bias',userName:'esperanca',email:'esperanca@gmail.com',typeOfUser:'Donor',userGroup:'Group1',permissions:'Create Read Update Delete',operations:'Admin',features:'cbc'},
  {firstName:'Joaquim',lastName:'Alberto',userName:'joaquim',email:'joaquim@gmail.com',typeOfUser:'DNPO',userGroup:'Group1',permissions:'Read Update',operations:'User',features:'cbc'},
  {firstName:'Josina',lastName:'Abiathar',userName:'abiathar',email:'abiathar@gmail.com',typeOfUser:'DNT',userGroup:'Group2',permissions:'Read',operations:'Partner',features:'cbc'},
  {firstName:'Francisco',lastName:'Songane',userName:'francisco',email:'francisco@gmail.com',typeOfUser:'UGB',userGroup:'Group1',permissions:'Read Update',operations:'User',features:'cbc'},
  {firstName:'Eduardo',lastName:'Chivambo',userName:'eduardo',email:'eduardo@gmail.com',typeOfUser:'DNPO',userGroup:'Group3',permissions:'Create Read Update Delete',operations:'Admin',features:'cbc'},
  {firstName:'Alberto',lastName:'Massavanhane',userName:'alberto',email:'alberto@gmail.com',typeOfUser:'Donor',userGroup:'Group2',permissions:'Read',operations:'Partner',features:'cbc'}
];