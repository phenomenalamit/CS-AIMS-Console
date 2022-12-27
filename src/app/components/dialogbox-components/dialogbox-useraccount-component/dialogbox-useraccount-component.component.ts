import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/model/user-account';
import Swal from 'sweetalert2';
import { ViewUserAccountComponentComponent } from '../../../components/view-components/view-user-account-component/view-user-account-component.component';

import { ExcelService } from '../../../Service/excel.service';



const ELEMENT_DATA: UserAccount[] = [
  {firstName:'Esperanca',lastName:'Bias',userName:'esperanca',email:'esperanca@gmail.com',typeOfUser:'Donor',userGroup:'Group1',permissions:'CRUD',operations:'Admin',features:'cbc'},
  {firstName:'Joaquim',lastName:'Alberto',userName:'joaquim',email:'joaquim@gmail.com',typeOfUser:'DNPO',userGroup:'Group1',permissions:'RU',operations:'User',features:'cbc'},
  {firstName:'Josina',lastName:'Abiathar',userName:'abiathar',email:'abiathar@gmail.com',typeOfUser:'DNT',userGroup:'Group2',permissions:'R',operations:'Partner',features:'cbc'},
  {firstName:'Francisco',lastName:'Songane',userName:'francisco',email:'francisco@gmail.com',typeOfUser:'UGB',userGroup:'Group1',permissions:'RU',operations:'User',features:'cbc'},
  {firstName:'Eduardo',lastName:'Chivambo',userName:'eduardo',email:'eduardo@gmail.com',typeOfUser:'DNPO',userGroup:'Group3',permissions:'CRUD',operations:'Admin',features:'cbc'},
  {firstName:'Alberto',lastName:'Massavanhane',userName:'alberto',email:'alberto@gmail.com',typeOfUser:'Donor',userGroup:'Group2',permissions:'R',operations:'Partner',features:'cbc'}


  ];

@Component({
  selector: 'app-dialogbox-useraccount-component',
  templateUrl: './dialogbox-useraccount-component.component.html',
  styleUrls: ['./dialogbox-useraccount-component.component.css']
})
export class DialogboxUseraccountComponentComponent implements OnInit {

  public userAccountForm!: FormGroup;
  userAccount:UserAccount=new UserAccount();
  elements!: NodeListOf<Element>;

  displayedColumns: string[] = [ 'firstName','lastName', 'userName','email','typeOfUser','userGroup','permissions','operations','features','edit'];
  dataSource = ELEMENT_DATA;
  editorg: string | undefined;
  element: string | undefined;
  parsedJson: any;
  typeOfUserSelected: any;
  userGroupSelected: any;
  permissionsSelected: any;
  operationsSelected: any;
  featuresSelected: any;
  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private dialog: MatDialog) { }


    num:any;
    tabClick(index: number) {
      this.num=index;
    }
  ngOnInit(): void {
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


   // this.editorg=localStorage.getItem('EditInd') || undefined;

    this.element=localStorage.getItem('EditUserAccountElement') || undefined;
    //console.log("element:"+this.editorg);
    if(this.element !== undefined)
    {
      console.log("element2:"+this.element);
      this.parsedJson = JSON.parse(this.element);

      console.log("jsonObj:"+this.parsedJson);


      let obj:UserAccount=this.parsedJson;
      this.typeOfUserSelected = this.parsedJson.typeOfUser;
      this.userGroupSelected = this.parsedJson.userGroup;
      this.permissionsSelected = this.parsedJson.permissions;
      this.operationsSelected = this.parsedJson.operations;
      this.featuresSelected = this.parsedJson.features;



    }
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


  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
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

      localStorage.setItem('EditUserAccountElement','');
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
    localStorage.setItem('EditUserAccountElement','');
    }

    closebuttonedit(){
      //localStorage.setItem('EditInd','');
      localStorage.setItem('EditUserAccountElement','');
      }

}
