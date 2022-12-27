/**
 * UserMapping services Date :10.06.2021
 * 
 * @author satyabrata swain
 *
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import usermapping from 'src/app/data/userMapping-data.json';
import { UserMappingServiceService } from 'src/app/Service/user-mapping-service.service';
import { Router } from '@angular/router';
import { UserMappingClass } from 'src/app/Service-Class/user-mapping-class';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';

@Component({
  selector: 'app-add-user-mapping-component',
  templateUrl: './add-user-mapping-component.component.html',
  styleUrls: ['./add-user-mapping-component.component.css']
})
export class AddUserMappingComponentComponent implements OnInit {
  displayedColumns: string[] = ['edit', 'user', 'userType'];
  dataSource = new MatTableDataSource<UserTypes>(ELEMENT_DATA);
  public userMappingForm!: FormGroup;
  editusermapping = "false";
  viewusermapping = "false";
  searchuserAccessId = new FormControl();
  searchUserTypeId = new FormControl();
  UserAccessListFilteredOption: Observable<any[]>;
  UserTypeListFilteredOption: Observable<any[]>;
  UserNameList!: UserMappingClass[];
  UserTypeList!: UserMappingClass[];
  UserMappingList!: UserMappingClass[];
  userMappingData: any;
  userMappingIdvalue: number;
  userMappingObject: UserMappingClass;
  totalRows:any;
  UserAccessList!: UserAccessClass[];
  uAccessPermArr:UserAccessPermission[]=[];
  fundingOrganizationList:OrganizationCrudServiceClass[]=[];
  filteredFundingOrg: Observable<any[]>;
  userPermission:number[]=[];
  authorised_flag=false;
  @ViewChild(MatSort) sort: MatSort;


  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  constructor(private userMappingService: UserMappingServiceService,private userAccessService: UserAccessClassService,
     private fb: FormBuilder, private router: Router,private organizationCrudServiceService: OrganizationCrudServiceService) { }
  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getUserAccessDetails();
    this.getUserType();
    this.fetchUserMappingData();
    this.setToUserPermission();
    this.userMappingForm = new FormGroup({
      userMappingId: new FormControl(''),
      language:new FormControl(''),
      userAccessId: new FormControl('', [Validators.required]),
      userTypeId: new FormControl('', [Validators.required]),
      fundingOrganization: new FormControl('')
    });
    this.getFundingOrg();
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Mapping')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Mapping'){
        this.authorised_flag=true;
      }
    }
  }

  private getUserName() {
    this.userMappingService.getUserNameList().subscribe(data => {
      this.UserNameList = data;
      console.log("data:" + this.UserNameList.length);
    });
  }
  private getUserAccessDetails() {
    this.userAccessService.getUserAccessDetails().subscribe(data => {
      this.UserAccessList = data;
      this.UserAccessListFilteredOption = this.searchuserAccessId.valueChanges.pipe(
        startWith(''),
            map(userAccess =>
              userAccess ? this.filterUserAccess(userAccess) : this.UserAccessList.slice())
      );
    });
  }

  
  private filterUserAccess(name: string) {
    return this.UserAccessList.filter(userAccess =>
      userAccess.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(name.toLowerCase()) !== -1 || userAccess.lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1 || userAccess.userName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  private getUserType() {
    this.userMappingService.getUserTypeList().subscribe(data => {
      this.UserTypeList = data;
      this.UserTypeListFilteredOption = this.searchUserTypeId.valueChanges.pipe(
        startWith(''),
            map(userType =>
              userType ? this.filterUserType(userType) : this.UserTypeList.slice())
      );
    });
  }

  private filterUserType(name: string) {
    return this.UserTypeList.filter(userType =>
      userType.userType.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  browserLang:any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  saveUserMapping() {
    this.getValueByLang();
    this.userMappingForm.controls.language.setValue(this.browserLang);
    
    if(this.userMappingForm.controls.fundingOrganization.value === "" ||
    this.userMappingForm.controls.fundingOrganization.value==null || this.userMappingForm.controls.fundingOrganization.value==undefined
      || this.userMappingForm.controls.fundingOrganization.value.length==0)
      {
        this.userMappingForm.controls.fundingOrganization=null;
      }
      console.log("this.userMappingForm.controls.fundingOrganization.value",this.userMappingForm.controls.fundingOrganization);  
    this.userMappingService.saveUserMapping(this.userMappingForm.value).subscribe(data => {
      console.log(data);
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
      this.clearAllWithReload();
      this.saveUserMappingNotificationAlert();
    },
      error => console.log(error));
  }
  
  checkDuplicateUser() {
    this.getValueByLang();
    this.userMappingForm.controls.language.setValue(this.browserLang);
    console.log("val ",this.userMappingForm.value)
    this.userMappingService.checkDuplicateUser(this.userMappingForm.value).subscribe(data => {
      console.log(data);
      if(data===null)
      {
      this.saveUserMapping();   
      }else{ 
        if(this.browserLang=='en'){
          Swal.fire('This User is already mapped.');
        }else{
          Swal.fire('Este utilizador já está mapeado.');
        }
      }
      console.log("aasuchi ts file  ku duplicate check pain"+data);
      //this.fetchUserMappingData();
    },
      error => console.log(error));
  }

  fundingOrgVisibleFlag:boolean = false;
  setFundingVisibility() {
    if(this.userMappingForm.controls['userTypeId'].value != null && this.userMappingForm.controls['userTypeId'].value != undefined) {
      for(let i=0; i<this.UserTypeList.length;i++) {
        if(this.UserTypeList[i].userTypeId == this.userMappingForm.controls['userTypeId'].value) {
          if(this.UserTypeList[i].userType == 'Development Partner Administrator' || this.UserTypeList[i].userType == 'DNGDP Team') {
            this.fundingOrgVisibleFlag = true;
            this.userMappingForm.controls['fundingOrganization'].setValidators([Validators.required]);
            break;
          }
          else{
            this.fundingOrgVisibleFlag = false;
            this.userMappingForm.controls['fundingOrganization'].clearValidators();
          }
        }
      }
      this.userMappingForm.controls['fundingOrganization'].updateValueAndValidity();
    }
  }

  saveUserMappingNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();
    let user:string=this.findUserForAlert(this.userMappingForm.controls['userAccessId'].value);
    let userTypeRefId:string=this.userMappingForm.controls['userAccessId'].value;
    //email subject
    let subjectForEmail:string='User "'
      +user
      +'" mapped to User Type reference ID "'
      +userTypeRefId
    +'" on "'+((todayTime+'').substring(0, 24))+'"';

    let bodyForEmail:string='User "'
      +user
      +'" has been mapped to User Type reference ID "'
      +userTypeRefId
      +'" on "'+((todayTime+'').substring(0, 24))+'"'
      +'<br/>'
    +'Click here : www.aims.mz\\user-mapping\\'+userTypeRefId;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';


    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has create disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    //   this.moveToViewTab();
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToSelectedTab;
  }

  findUserForAlert(uid:number):string{
    let user:string=null;
    for(let i=0;i<this.UserAccessList.length;i++){
      if(this.UserAccessList[i].userAccessId==uid){
        user=this.UserAccessList[i].firstName+' '+this.UserAccessList[i].lastName;
      }
    }
    return user;
  }

  updateUserMapping() {
    if(this.userMappingForm.controls.fundingOrganization.value === '' ||
    this.userMappingForm.controls.fundingOrganization.value==null || this.userMappingForm.controls.fundingOrganization.value==undefined
      || this.userMappingForm.controls.fundingOrganization.value.length==0)
      {
        this.userMappingForm.controls.fundingOrganization=null;
      }
    this.userMappingService.updateUserMapping(this.userMappingForm.value).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Updated successfully', '', 'success');
      }else{
        Swal.fire('Actualizado com sucesso', '', 'success');
      }
      this.clearAllWithReload();
    },
      error => console.log(error)); 
  }
  private getUserMappingDetails() {
    this.userMappingService.getUserMappingDetails().subscribe(data => {
      this.UserMappingList = data;
      console.log("data:" + this.UserMappingList.length);

    });
  }
  userAccessdataSource = new MatTableDataSource<UserMappingClass>(this.UserMappingList);
  private fetchUserMappingData(){
    this.userMappingService.getUserMappingDetails().subscribe(data => {
      this.UserMappingList = data;
      this.totalRows = this.UserMappingList.length;
      this.userAccessdataSource=new MatTableDataSource<UserMappingClass>(this.UserMappingList);
      setTimeout(() =>
        this.userAccessdataSource.paginator=this.paginator
      );
      setTimeout(() =>
        this.userAccessdataSource.sort=this.sort
      );
    });
  }
  private changeUserTypeStatus(id: number) {
    this.getValueByLang()
    this.userMappingForm.reset();
    this.userMappingService.changeUserMappingStatus(id).subscribe(data => {
      this.UserMappingList = data;
      if(this.browserLang=='en'){
        Swal.fire('Deleted successfully', '', 'success')
      }else{
        Swal.fire('Apagado com sucesso', '', 'success')
      }
      this.totalRows = this.UserMappingList.length;
      this.userAccessdataSource=new MatTableDataSource<UserMappingClass>(this.UserMappingList);
      setTimeout(() =>
        this.userAccessdataSource.paginator=this.paginator
      );
      setTimeout(() =>
        this.userAccessdataSource.sort=this.sort
      );
      this.step=0;
    });
  }
  public createUserform = (userTypeFormValue) => {
    if (this.userMappingForm.valid) {
      this.executeUserTypeCreation(userTypeFormValue);
    }
  }
  private executeUserTypeCreation = (userTypeFormValue) => {
    let userTypes: UserTypes = {
      user: userTypeFormValue.user,
      userType: userTypeFormValue.userType,


    }
  }

  private getFundingOrg() {
    this.organizationCrudServiceService.getFundingOrganizationDetails().subscribe(data => {
      this.fundingOrganizationList = data;
      this.filteredFundingOrg = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterdFundOrg(name))
      );
    });
  }

  private _filterdFundOrg(name: string): OrganizationCrudServiceClass[] {
    const filterValue = name;
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.userMappingForm.controls.fundingOrganization.patchValue(this.selectedValues);
    let filteredList = this.fundingOrganizationList.filter(option => 
      option.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || option.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
    return filteredList;
  }

  searchTextboxControl = new FormControl();
  @ViewChild('search') searchTextBox: ElementRef;
  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  selectedFundingOrgName: string[] = [];
  selectedValues = [];
  setSelectedValues() {
    if(this.fundingOrganizationList.length>0){
      if (this.userMappingForm.controls.fundingOrganization.value && this.userMappingForm.controls.fundingOrganization.value.length > 0) {
        this.userMappingForm.controls.fundingOrganization.value.forEach((e) => {
          if (this.selectedValues.indexOf(e) == -1) {
            this.selectedValues.push(e);
            this.selectedFundingOrgName.push(
              this.fundingOrganizationList.find((x) => x.id === e).names
            );
          }
        });
      }
    }
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
      this.selectedFundingOrgName.splice(index, 1);
    }
  }
 
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  clearAllWithReload(){
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/admin/user-mapping']));
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
ji:any=3;
i:any=0
  swal(i)
  {
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Submit?' : 'Deseja Submeter?',
      showDenyButton: true,
      text: "Write something interesting:",
      input: 'text',
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Submit` : 'Submeter',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancel',
    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
    }
if(this.i+1<this.ji)
{
  this.i=this.i+1;
  this.swal(this.i);

}
else{
  this.i=0;
}
    });
  }

  openMandatoryAlert() {
    this.getValueByLang();
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalert() {
    this.getValueByLang();
    Swal.fire({
      title:(this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.checkDuplicateUser();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
  opensweetalertDelete(id: number) {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.changeUserTypeStatus(id);
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
  opensweetalert2() {
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
  opensweetalert3() {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Update?':'Você deseja actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.updateUserMapping();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
  editUserMapping(id: number) {
    // this.userMappingForm.reset();
    // this.userMappingForm.controls.fundingOrganization.reset();
    if (
      this.userMappingForm.controls['fundingOrganization'].value!=null &&
       this.userMappingForm.controls['fundingOrganization'].value!=undefined &&
       this.userMappingForm.controls['fundingOrganization'].value.length>0 ) {
      for (let m = 0; m < this.userMappingForm.controls['fundingOrganization'].value.length; m++){
        if (m != 0)
        this.userMappingForm.controls['fundingOrganization'].value.removeAt(m);
        this.userMappingForm.controls['fundingOrganization'].value.splice(m, 1);
      }
      this.userMappingForm.controls['fundingOrganization'].value.splice(0, 1);
    }
   

    this.userMappingForm.reset();
    this.userMappingService.getUserMappingObjectById(id)
      .subscribe(
        data => {
          this.userMappingData = data
          this.userMappingObject = this.userMappingData;
          this.userMappingForm.controls['userMappingId'].patchValue(this.userMappingObject.userMappingId);
          this.userMappingForm.controls['userTypeId'].patchValue(this.userMappingObject.userTypeId);
          this.userMappingForm.controls['userAccessId'].patchValue(this.userMappingObject.userAccessId);
          let fundArr:number[]=[];
          if(this.userMappingObject.userAccessOrganizations!=null){
            this.userMappingObject.userAccessOrganizations.forEach(dataFund=>{
              fundArr.push(+dataFund.idOrganization);
            });
            this.userMappingForm.controls['fundingOrganization'].patchValue(fundArr);
            this.setSelectedValues();
          }
          this.setFundingVisibility();
          this.editusermapping = "true";
          this.viewusermapping = "false";
          this.userMappingForm.enable();
          this.step = 1;
        },
        error => this.step = 0);
  }
  viewUserMapping(id: number) {
    // this.userMappingForm.reset();
    // this.userMappingForm.controls.fundingOrganization.reset();
    if (
      this.userMappingForm.controls['fundingOrganization'].value!=null &&
       this.userMappingForm.controls['fundingOrganization'].value!=undefined &&
       this.userMappingForm.controls['fundingOrganization'].value.length>0 ) {
      for (let m = 0; m < this.userMappingForm.controls['fundingOrganization'].value.length; m++){
        if (m != 0)
        this.userMappingForm.controls['fundingOrganization'].value.removeAt(m);
        this.userMappingForm.controls['fundingOrganization'].value.splice(m, 1);
      }
      this.userMappingForm.controls['fundingOrganization'].value.splice(0, 1);
    }
   

    this.userMappingForm.reset();
   
    this.userMappingService.getUserMappingObjectById(id)
      .subscribe(
        data => {
          this.userMappingData = data
          this.userMappingObject = this.userMappingData;
          this.userMappingIdvalue= this.userMappingObject.userMappingId;
          this.userMappingForm.controls['userTypeId'].patchValue(this.userMappingObject.userTypeId);
          this.userMappingForm.controls['userAccessId'].patchValue(this.userMappingObject.userAccessId);
          let fundArr:number[]=[];
          if(this.userMappingObject.userAccessOrganizations!=null){
            this.userMappingObject.userAccessOrganizations.forEach(dataFund=>{
              fundArr.push(+dataFund.idOrganization);
            });
            this.userMappingForm.controls['fundingOrganization'].patchValue(fundArr);
            this.setSelectedValues();
          }
          this.setFundingVisibility();
          this.viewusermapping = "true";
          this.editusermapping = "false";
          this.userMappingForm.disable();
          this.step = 1;
        },
        error => this.step = 0);
  }
  moveToViewTab(){
    this.step = 0;
  }

}
export interface UserTypes {
  user: any;
  userType: any;
}


const ELEMENT_DATA: UserTypes[] = [
  { user: 'Charlie Adams', userType: 'dngdpadmin' },
  { user: 'Arlete Bombe', userType: 'dngdpteam' },
  { user: 'Gilberto Mendes', userType: 'partner' },
  { user: 'Lucrecia Paco', userType: 'dntcef' }
];


