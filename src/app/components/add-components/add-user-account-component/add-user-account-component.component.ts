// BUsiness Logic TS file for Add/Edit User Account

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ViewUserAccountComponentComponent } from '../../../components/view-components/view-user-account-component/view-user-account-component.component';
import { ExcelService } from '../../../Service/excel.service';


import userAcctData from '../../../data/useraccount-data.json';
import { UserAccountClass } from 'src/app/Service-Class/user-account-class';

import {  UserAccountService } from 'src/app/Service/user-account.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { map, startWith } from 'rxjs/operators';
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
    selector: 'app-add-user-account-component',
    templateUrl: './add-user-account-component.component.html',
    styleUrls: ['./add-user-account-component.component.css']
  })
export class AddUserAccountComponentComponent implements OnInit {
  public userAccountForm!: FormGroup;
  userAccount:UserAccount=new UserAccount();
  elements!: NodeListOf<Element>;
  checkEmail_flag=true;
checkEmail1_flag=true;
TypeOfUserList!:UserAccountClass[];
UserGroupDetailsList!:UserAccountClass[];
PermissionsList!:UserAccountClass[];
OperationsList!:UserAccountClass[];
FeaturesList!:UserAccountClass[];
countryDialingCodeList: CountryDialingCode[];
countryDialingCodeFilteredOption:Observable<any[]>;
  displayedColumns: string[] = [ 'firstName','lastName', 'userName','email','typeOfUser','userGroup','permissions','operations','features','edit'];
  dataSource = ELEMENT_DATA;
  constructor(public translate: TranslateService,
    private UserAccountService:UserAccountService,private fb: FormBuilder,
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private countryDialingCodeService: CountryDialingCodeService,
    private excelService: ExcelService,private dialog: MatDialog) { }


    num:any;
    EditUserAcct:any;
    ViewMoreUserAccount:any;
    tabClick(index: number) {
      this.num=index;
    }
    browserLang:any;
  ngOnInit(): void {

this.getTypeOfUser();
this.getUserGroupDetails();
this.getPermissions();
this.getOperations();
this.getFeatures();
this.getCountryDialingCodes();
this.browserLang=localStorage.getItem("browserLang");
if(this.browserLang===undefined || this.browserLang===null)
this.browserLang='en';
this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang",this.browserLang);

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
      userName:new FormControl('',[Validators.required]),
      code1:new FormControl(''),
      telephone: new FormControl(''),
      featuresdata: this.fb.array([
        this.fb.group({
          features: [''],

        })
      ]),
      features:new FormControl('')
    });
    console.log("Inside add User Account");

    // edit code starts here
this.EditUserAcct=localStorage.getItem("EditUserAcct");
this.ViewMoreUserAccount=localStorage.getItem("ViewMoreUserAccount");
if(this.EditUserAcct=="EditUserAcct"){
  this.userAccountForm.controls.firstName.setValue(userAcctData.firstName);
  this.userAccountForm.controls.lastName.setValue(userAcctData.lastName);
  this.userAccountForm.controls.email.setValue(userAcctData.email);
  this.userAccountForm.controls.typeOfUser.setValue(userAcctData.typeOfUser);
  this.userAccountForm.controls.userGroup.setValue(userAcctData.userGroup);
  this.userAccountForm.controls.permissions.setValue(userAcctData.permissions);
  this.userAccountForm.controls.operations.patchValue(userAcctData.operations);
  this.userAccountForm.controls.userName.setValue(userAcctData.userName);
  this.userAccountForm.controls.code1.setValue(userAcctData.code1);
  this.userAccountForm.controls.telephone.setValue(userAcctData.telephone);
  this.userAccountForm.controls.features.patchValue(userAcctData.features);
  //this.userAccountForm.controls['features'].setValue(userAcctData.features);
  // console.log("this is return values of features",((this.userAccountForm.get('featuresdata') as FormArray).at(0) as FormGroup).get('features').patchValue(userAcctData.featuresdata[0].features));
  console.log("this is return values of features",userAcctData.featuresdata);
  //((this.userAccountForm.get('featuresdata') as FormArray).at(0) as FormGroup).get('features').patchValue(userAcctData.featuresdata[0].features);
  // this.userAccountForm.controls['features'].setValue(['name']);
  localStorage.setItem("EditUserAcct","reset-edit-user-account");

}
if(this.ViewMoreUserAccount=="ViewMoreUserAccount"){
  this.userAccountForm.controls.firstName.setValue(userAcctData.firstName);
  this.userAccountForm.controls.lastName.setValue(userAcctData.lastName);
  this.userAccountForm.controls.email.setValue(userAcctData.email);
  this.userAccountForm.controls.typeOfUser.setValue(userAcctData.typeOfUser);
  this.userAccountForm.controls.userGroup.setValue(userAcctData.userGroup);
  this.userAccountForm.controls.permissions.setValue(userAcctData.permissions);
  this.userAccountForm.controls.operations.patchValue(userAcctData.operations);
  this.userAccountForm.controls.userName.setValue(userAcctData.userName);
  this.userAccountForm.controls.code1.setValue(userAcctData.code1);
  this.userAccountForm.controls.telephone.setValue(userAcctData.telephone);
  this.userAccountForm.controls.features.patchValue(userAcctData.features);
  this.userAccountForm.disable();
  localStorage.setItem("ViewMoreUserAccount","reset-view-more-user-account");
  }
  }


  private getTypeOfUser(){
    this.UserAccountService.getTypeOfUserList().subscribe(data=>{
      this.TypeOfUserList=data;
      console.log("data:"+this.TypeOfUserList.length);
    });
  }

  private getUserGroupDetails(){
    this.UserAccountService.getUserGroupDetailsList().subscribe(data=>{
      this.UserGroupDetailsList=data;
      console.log("data for user group:"+this.UserGroupDetailsList.length);
    });
  }


  check_phone_flag=true;
  check_phone1_flag=true;
  phoneMessage:any;
  validatePhone(){
    var phone = this.userAccountForm.controls['telephone'].value;
    // alert(phone);
    if(phone.trim().length == 0)
      {
        this.check_phone_flag=true;
        this.phoneMessage=' '
      }
      else
      {
    // var expr = /^(?:[0-9] ?){6,10}[0-9]$/;
    // var expr = /^[0-9]{2}[0-9]{8}$/;
    var expr = /^\s*\d{9,10}\s*$/;
    if (!expr.test(phone)) {
      console.log( "Invalid phone ......");
      this.check_phone_flag=false;//for invalid phone
      this.check_phone1_flag=true;//for valid
    }
    else{
      console.log( "valid.....");
      this.check_phone_flag=true;//for invalid phone
      this.check_phone1_flag=false;//for valid
      this.phoneMessage='not show'
    }
  }
  }


  private getCountryDialingCodes(){
    this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
        this.countryDialingCodeList=data;
        this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
        this.countryDialingCodeFilteredOption=this.userAccountForm.controls['code1'].valueChanges
        .pipe(
            startWith(''),
            map(code=>
              code ? this.filterCode(code) : this.countryDialingCodeList.slice())
        );
    });
  }

  private filterCode(name:string){
    return this.countryDialingCodeList.filter(code=>
      code.countryName.toLowerCase().indexOf(name.toLowerCase())===0);
  }

  private getPermissions(){
    this.UserAccountService.getPermissionsDetailsList().subscribe(data=>{
      this.PermissionsList=data;
      console.log("data for user group:"+this.PermissionsList.length);
    });
  }

  private getOperations(){
    this.UserAccountService.getOperationsetailsList().subscribe(data=>{
      this.OperationsList=data;
      console.log("data for user group:"+this.OperationsList.length);
    });
  }

  private getFeatures(){
    this.UserAccountService.getFeaturesList().subscribe(data=>{
      this.FeaturesList=data;
      console.log("data for user group:"+this.FeaturesList.length);
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

  moveToUserAccountTab(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-user-account']));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  openMandatoryAlert(){
    this.getValueByLang();
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalert()
  {
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')?`Submit`:'Submeter',

      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',

    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        if(this.browserLang=='en'){
          Swal.fire('Submitted successfully', '', 'success');
        }else{
          Swal.fire('Submetido com sucesso', '', 'success');
        }
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
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

  moveToSelectedTabEdit(element: any){
    localStorage.setItem("EditUserAcct", "EditUserAcct");

    console.log("EditUserAcct inside view--->",localStorage.getItem("EditUserAcct"));

    // this.router.navigate(['/admin/edit-envelope']);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-user-account']));

    console.log("after route");

  }

    validEmail(){
     var email = this.userAccountForm.controls['email'].value;
      var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
      if (!expr.test(email)) {
      //  console.log( "Invalid email address.");
       this.checkEmail_flag=false;//for invalid email
       this.checkEmail1_flag=true;//for valid
    }else{
      // console.log( "valid.");
      this.checkEmail_flag=true;//for invalid email
      this.checkEmail1_flag=false;//for valid
   }
    }




   }

