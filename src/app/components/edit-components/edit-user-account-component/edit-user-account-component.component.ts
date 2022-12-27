
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ViewUserAccountComponentComponent } from '../../../components/view-components/view-user-account-component/view-user-account-component.component';

import { ExcelService } from '../../../Service/excel.service';


import { Location } from '@angular/common';
import { UserAccount } from 'src/app/model/user-account';

const ELEMENT_DATA: UserAccount[] = [
  {firstName:'Karishma',lastName:'Kapoor',userName:'Karisma',email:'karisma@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Lopamudra',lastName:'Panda',userName:'Lopa',email:'karisma@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Prashant',lastName:'Kapoor',userName:'prashant',email:'prashant@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Amit',lastName:'Nayak',userName:'amit',email:'amit@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Raman',lastName:'Nayak',userName:'raman',email:'raman@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Pinaki',lastName:'Sahoo',userName:'pinaki',email:'pinaki@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'}


  ];

  @Component({
    selector: 'app-edit-user-account-component',
    templateUrl: './edit-user-account-component.component.html',
    styleUrls: ['./edit-user-account-component.component.css']
  })
export class EditUserAccountComponentComponent implements OnInit {
  public userAccountForm!: FormGroup;
  userAccount:UserAccount=new UserAccount();
  elements!: NodeListOf<Element>;

  displayedColumns: string[] = [ 'firstName','lastName', 'userName','email','typeOfUser','userGroup','permissions','operations','features','edit'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private excelService: ExcelService,private dialog: MatDialog,private location: Location) { }


    num:any;
    EditUserAcct:any;
    ViewMoreUserAccount:any;
    tabClick(index: number) {
      this.num=index;
    }
  ngOnInit(): void {
    localStorage.setItem("EditUserAcctUrl","EditUserAcctUrl");
    console.log("Inside Useraccountcomp---");
    this.EditUserAcct=localStorage.getItem("EditUserAcct");
    this.ViewMoreUserAccount=localStorage.getItem("ViewMoreUserAccount");



    this.userAccountForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      typeOfUser: new FormControl('', [Validators.required]),
      userGroup: new FormControl('', [Validators.required]),
      permissions:new FormControl('', [Validators.required]),
      operations:new FormControl('', [Validators.required]),
      userName:new FormControl(''),
      features:new FormControl('')
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.userAccountForm.controls[controlName].hasError(errorName);
  }

  public createUserAccount = (userAccountFormValue) => {
    if (this.userAccountForm.valid) {
      this.executeUserAccountCreation(userAccountFormValue);
    }
  }

  private executeUserAccountCreation = (userAccountFormValue) => {
    let userAccount: UserAccount = {
      firstName: userAccountFormValue.firstName,
      lastName: userAccountFormValue.lastName,
      userName: userAccountFormValue.userName,
      email: userAccountFormValue.email,
      typeOfUser: userAccountFormValue.typeOfUser,
      userGroup:userAccountFormValue.userGroup,
      permissions:userAccountFormValue.permissions,
      operations:userAccountFormValue.operations,
      features:userAccountFormValue.features,
      // position:userAccountFormValue.position

    }
  }

  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewUserAccountComponentComponent(this.excelService,this.router);
  //   obj.ExportTOExcel();
  // }
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
  moveToUserAcctTab()
  {
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/userAccount']));
    this.location.back();
  }
  opensweetalert()
  {
    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,

      denyButtonText: `Cancel`,

    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Submitted Successfully', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  opensweetalert2()
  {
    Swal.fire({
      title: 'Do you want to Save as Draft?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved as Draft Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  clearForm(form: FormGroup) {
    form.reset();
    }

}

