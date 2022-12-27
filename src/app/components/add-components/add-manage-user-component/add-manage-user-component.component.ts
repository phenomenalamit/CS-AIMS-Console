/**
 * Add User Access Management services Date :10.06.2021
 * 
 * @author satyabrata swain
 *
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import manageuser from 'src/app/data/manageUser.json';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { map, startWith } from 'rxjs/operators';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';

@Component({
  selector: 'app-add-manage-user-component',
  templateUrl: './add-manage-user-component.component.html',
  styleUrls: ['./add-manage-user-component.component.css']
})
export class AddManageUserComponentComponent implements OnInit {
  displayedColumns: string[] = ['edit', 'partner','purdaccrs', 'year',
  'envagrcurr', 'telephone'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  public userForm!: FormGroup;
  editManage: any;
  checkEmail_flag=true;
  checkEmail1_flag=true;
  editmanageuser = "false";
  viewmanageuser = "false";
  UserTypeList!: UserAccessClass[];
  UserAccessList!: UserAccessClass[];
  uAccessPermArr:UserAccessPermission[]=[];
  fundingOrganizationList:OrganizationCrudServiceClass[]=[];
  unamePattern = "^[A-Za-z0-9]+$";
  userPermission:number[]=[];
  filteredFundingOrg: Observable<any[]>;
  authorised_flag=false;
  userNameForNotificationAlert:string="Charlie Adams";
  userGroupForNotificationAlert:string="DNGDP Data Administration";
  userAccessData: any;
  totalRows:any;
  maxDate= new Date();
  userAccessIdValue: number;
  userAccessObject: UserAccessClass;
  countryDialingCodeList: CountryDialingCode[];
  countryDialingCodeFilteredOption:Observable<any[]>;
  searchCode = new FormControl();
  dateClearFlag:boolean=false;
  @ViewChild(MatSort) sort: MatSort;


  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  constructor(private userAccessService: UserAccessClassService, private countryDialingCodeService: CountryDialingCodeService,
     private fb: FormBuilder,private router:Router,private organizationCrudServiceService: OrganizationCrudServiceService) { }
  step=0;
  setStep(index: number) {
    this.step = index;
  }


  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    // this.getUserType();
    this.fetchUserAccessData();
    this.getCountryDialingCodes();
    this.userForm = new FormGroup({
      userAccessId: new FormControl(''),
      language:new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required,Validators.pattern(this.unamePattern)]),
      email: new FormControl('', [Validators.required]),
      dateOfJoining: new FormControl('', [Validators.required]),
      countryCode:new FormControl('', [Validators.required]),
      telephone: new FormControl('', [Validators.required]),
      city: new FormControl(''),
      address: new FormControl(''),
      // fundingOrganization: new FormControl('',[Validators.required])
    });
    this.setToUserPermission();
    // this.getFundingOrg();
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Account')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Account'){
        this.authorised_flag=true;
      }
    }
  }

  clearJoinDate(event) {
    event.stopPropagation();
    this.userForm.controls['dateOfJoining'].reset();
  }

  private getUserType() {
    this.userAccessService.getUserTypeList().subscribe(data => {
      this.UserTypeList = data;
    
    });
  }
  checkDuplicateUserNameAndEmail() {
    this.userAccessService.checkDuplicateUserName(this.userForm.value).subscribe(data => {
      console.log(data);
      if(data===null)
      {
        this.userAccessService.checkDuplicateEmail(this.userForm.value).subscribe(data => {
          console.log(data);
          if(data===null)
          {
          this.saveUserAccess();   
          }else{ 
            Swal.fire('This Email already exist. Please try another Email')
          }
         
        }
        ,
        error => console.log(error));
      }else{ 
        Swal.fire('This UserName already exist. Please try another UserName')
      }
     
    },
      error => console.log(error));
  }
  browserLang:any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  saveUserAccess() {
    this.getValueByLang()
    this.userForm.controls.language.setValue(this.browserLang);
    this.userAccessService.saveUserAccess(this.userForm.value).subscribe(data => {
      console.log(data);
      this.userAccessData = data
      this.userAccessObject = this.userAccessData;
      // console.log("aasuchi ts file  ku",this.userAccessObject);
      if(this.userAccessObject==null)
      {
        Swal.fire('User Registration fail !. Please try again')
      }else{
        this.saveUserAccountNotificationAlert();
        if (this.browserLang == 'en') {
          // Swal.fire('Submitted Successfully!',' UserName ='+ this.userAccessObject.userName+' And password ='+this.userAccessObject.password+'');
          Swal.fire('Submitted successfully', '', 'success');
        } else {
          Swal.fire('Submetido com sucesso', '', 'success');
        }
        this.clearUserForm();
      }
    },
      error => console.log(error));
  }

  saveUserAccountNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='User Account Reference ID "'
      +"XXXXXX"
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    let bodyForEmail:string='User Account "'
      +this.userForm.controls['firstName'].value
      +'" with Reference ID "'
      +"XXXXXX"
      +'" has been created by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\manage-user\\';

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

  firstTimeLoginNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='First time login default password';

    let bodyForEmail:string='Hi "'
      +
      +'" your account with username "'
      +
      +'" is created. Your default password is "'
      +
      +'" Please click on the below link to login. Please change the password after first time login. <br/>'
    +'Click here : www.aims.mz\\login\\';

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
    this.userForm.controls.fundingOrganization.patchValue(this.selectedValues);
    let filteredList = this.fundingOrganizationList.filter(option => 
      option.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || option.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
    return filteredList;
  }

  updateUserAccess() {
    this.getValueByLang()
    this.userForm.controls.language.setValue(this.browserLang);
    this.userAccessService.updateUserAccess(this.userForm.value).subscribe(data => {
      console.log(data);
      if(this.browserLang=='en'){
        Swal.fire('Updated successfully', '', 'success').then(res=>{
          this.updateUserAccountNotificationAlert();
          this.clearUserForm();
        });
      }else{
        Swal.fire('Actualizado com sucesso', '', 'success').then(res=>{
          this.updateUserAccountNotificationAlert();
          this.clearUserForm();
        });
      }
    },
      error => console.log(error));
  }

  checkSubmitCondition(){
    if(this.userForm.invalid==false){
      if(this.check_email_flag==true){
        if(this.check_phone_flag==true){
          this.opensweetalert();
        }
        else{
          Swal.fire('Please Enter Valid Telephone Number.');
        }
      }
      else{
        Swal.fire('Please Enter Valid Email.');
      }
    }
    else{
      this.openMandatoryAlert();
    }
  }

  checkSubmitConditionForEdit(){
    this.validateEmail();
    this.validatePhone();
    if(this.userForm.invalid==false){
      if(this.check_email_flag==true){
        if(this.check_phone_flag==true){
          this.opensweetalert3();
        }
        else{
          Swal.fire('Please Enter Valid Telephone Number.');
        }
      }
      else{
        Swal.fire('Please Enter Valid Email.');
      }
    }
    else{
      this.openMandatoryAlert();
    }
  }

  clearUserForm(){
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/admin/user-account']));
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
      if (this.userForm.controls.fundingOrganization.value && this.userForm.controls.fundingOrganization.value.length > 0) {
        this.userForm.controls.fundingOrganization.value.forEach((e) => {
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

  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
      this.selectedFundingOrgName.splice(index, 1);
    }
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  updateUserAccountNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='User Account Reference ID "'
      +"XXXXXX"
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    let bodyForEmail:string='User Account "'
      +this.userForm.controls['firstName'].value
      +'" with Reference ID "'
      +this.userForm.controls['userAccessId'].value
      +'" has been edited by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\manage-user\\'+this.userForm.controls['userAccessId'].value;

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

  private getUserAccessDetails() {
    this.userAccessService.getUserAccessDetails().subscribe(data => {
      this.UserAccessList = data;
      console.log("data:" + this.UserAccessList.length);
    });
  }
  private changeUserAccessStatus(id: number) {
    this.clearForm(this.userForm);
    this.userForm.reset();
    this.getValueByLang()
    this.userAccessService.changeUserAccessStatus(id,this.browserLang).subscribe(data => {
      this.UserAccessList = data;
      if (this.browserLang == 'en') {
        Swal.fire('Deleted successfully', '', 'success');
      } else {
        Swal.fire('Apagado com sucesso', '', 'success');
      }
      this.totalRows = this.UserAccessList.length;
      this.userAccessdataSource=new MatTableDataSource<UserAccessClass>(this.UserAccessList);
      setTimeout(() =>
        this.userAccessdataSource.paginator=this.paginator
      );
      setTimeout(() =>
        this.userAccessdataSource.sort=this.sort
      );
      this.step=0;
    });
    this.userAccountDeleteAlert(id);
  }

  //for notification alert, execute on delete userAccount
  userAccountDeleteAlert(uid:number) {
    let todayTime = new Date();
    let userAccount=this.findUserAccount(uid);
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete User-Account on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='User Account Reference ID  "'
      +uid
    +'" deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='User Account "'
      +userAccount
      +'" with Reference ID "'
      +uid
      +'" has been deleted by user "'+this.userNameForNotificationAlert
      +'" in AIMS on "'
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
  private findUserAccount(id:number):string{
    let userAccount:string=null;
    for(let i=0;i<this.UserAccessList.length;i++){
      if(this.UserAccessList[i].userAccessId==id){
        userAccount=this.UserAccessList[i].firstName;
      }
    }
    return userAccount;
  }

  check_phone_flag=true;
  check_phone1_flag=true;
  phoneMessage:any;
  validatePhone(){
    var phone = this.userForm.controls['telephone'].value;
    // alert(phone);
    if(phone == '')
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
        this.countryDialingCodeFilteredOption=this.searchCode.valueChanges
        .pipe(
            startWith(''),
            map(code=>
              code ? this.filterCode(code) : this.countryDialingCodeList.slice())
        );
    });
  }

  private filterCode(name:string){
    return this.countryDialingCodeList.filter(code=>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1
        || (code.dialingCode+'').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1);
  }
  userAccessdataSource = new MatTableDataSource<UserAccessClass>(this.UserAccessList);
  private fetchUserAccessData(){
    this.userAccessService.getUserAccessDetails().subscribe(data => {
      this.UserAccessList = data;
      this.totalRows = this.UserAccessList.length;
      this.userAccessdataSource=new MatTableDataSource<UserAccessClass>(this.UserAccessList);
      setTimeout(() =>
        this.userAccessdataSource.paginator=this.paginator
      );
      setTimeout(() =>
        this.userAccessdataSource.sort=this.sort
      ); 
    });
  }
  public createUserform = (userTypeFormValue) => {
    if (this.userForm.valid) {
      this.executeUserTypeCreation(userTypeFormValue);
    }
  }
  moveToViewTable(){
    this.router.navigate(['/admin/manage-user']);
  }
  check_email_flag:any;
  check_email1_flag:any;
  validateEmail(){
    var email = this.userForm.controls['email'].value;
    var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if (!expr.test(email)) {
      //console.log( "Invalid email address.");
      this.check_email_flag=false;//for invalid email
      this.check_email1_flag=true;//for valid
    }
    else{
      // console.log( "valid.");
      this.check_email_flag=true;//for invalid email
      this.check_email1_flag=false;//for valid
    }
  }
  private executeUserTypeCreation = (userTypeFormValue) => {
    let userTypes: UserType = {
      userType:userTypeFormValue.userType,
      fullName:userTypeFormValue.fullName,
      username:userTypeFormValue.username,
      email:userTypeFormValue.email,
      date:userTypeFormValue.date

    }
  }
 
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
  clearForm(form: FormGroup) {
    // if (form.controls['fundingOrganization'].value!=null && form.controls['fundingOrganization'].value!=undefined) {
    //   for (let m = 0; m < form.controls['fundingOrganization'].value.length; m++){
    //     form.controls['fundingOrganization'].value.splice(m, 1);
    //   }
    //   form.controls['fundingOrganization'].value.splice(0, 1);
    // }
    form.reset();
  }
  openMandatoryAlert(){
    Swal.fire('Please Fill All Mandatory Fields.');
  }
  opensweetalert() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        this.checkDuplicateUserNameAndEmail();
       // Swal.fire('Submitted Successfully!', '', 'success')
      } else if(result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  opensweetalert3() {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Update?':'Você deseja atualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        this.updateUserAccess();
      } else if(result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info');
        else
          Swal.fire('Cancelado', '', 'info');
      }
    })
  }
  opensweetalert2() {
    Swal.fire({
      title: 'Do you want to Save as Draft?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
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
  opensweetalertDelete(id: number) {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        this.changeUserAccessStatus(id);
      } else if(result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info');
        else
          Swal.fire('Cancelado', '', 'info');
      }
    })
  }
  editManageUser(id: number) {
    this.clearForm(this.userForm);
    this.dateClearFlag=false;
    this.userAccessService.getUserAccessObjectById(id)
      .subscribe(
        data => {
          this.userAccessData = data

          console.log("UserAccount class data");
          console.log(this.userAccessData);
          this.userAccessObject = this.userAccessData;
          this.userForm.controls['firstName'].patchValue(this.userAccessObject.firstName);
          this.userForm.controls['lastName'].patchValue(this.userAccessObject.lastName);
          this.userForm.controls['userName'].patchValue(this.userAccessObject.userName);
          this.userForm.controls['email'].patchValue(this.userAccessObject.email);
          this.userForm.controls['dateOfJoining'].patchValue(this.userAccessObject.dateOfJoining);
          this.userForm.controls['userAccessId'].patchValue(this.userAccessObject.userAccessId);
          this.userForm.controls['countryCode'].patchValue(+this.userAccessObject.countryCode);
          this.userForm.controls['telephone'].patchValue(this.userAccessObject.telephone);
          this.userForm.controls['city'].patchValue(this.userAccessObject.city);
          this.userForm.controls['address'].patchValue(this.userAccessObject.address);
          // let fundArr:number[]=[];
          // if(this.userAccessObject.userAccessOrganizations!=null){
          //   this.userAccessObject.userAccessOrganizations.forEach(dataFund=>{
          //     fundArr.push(+dataFund.idOrganization);
          //   });
          //   this.userForm.controls['fundingOrganization'].patchValue(fundArr);
          //   this.setSelectedValues();
          // }
          this.editmanageuser = "true";
          this.viewmanageuser = "false";
          this.userForm.enable();
          this.step = 1;
        },
        error => console.log(error))
       
   
  }
  viewManageUser(id: number) {
    this.clearForm(this.userForm);
    this.dateClearFlag=true;
    this.userAccessService.getUserAccessObjectById(id)
      .subscribe(
        data => {
          this.userAccessData = data

          console.log("UserAccount class data");
          console.log(this.userAccessData);
          this.userAccessObject = this.userAccessData;
          this.userAccessIdValue=this.userAccessObject.userAccessId;
          this.userForm.controls['firstName'].patchValue(this.userAccessObject.firstName);
          this.userForm.controls['lastName'].patchValue(this.userAccessObject.lastName);
          this.userForm.controls['userName'].patchValue(this.userAccessObject.userName);
          this.userForm.controls['email'].patchValue(this.userAccessObject.email);
          this.userForm.controls['dateOfJoining'].patchValue(this.userAccessObject.dateOfJoining);
          this.userForm.controls['userAccessId'].patchValue(this.userAccessObject.userAccessId);
          this.userForm.controls['countryCode'].patchValue(+this.userAccessObject.countryCode);
          this.userForm.controls['telephone'].patchValue(this.userAccessObject.telephone);
         
          this.userForm.controls['city'].patchValue(this.userAccessObject.city);
         
          this.userForm.controls['address'].patchValue(this.userAccessObject.address);
          // let fundArr:number[]=[];
          // if(this.userAccessObject.userAccessOrganizations!=null){
          //   this.userAccessObject.userAccessOrganizations.forEach(dataFund=>{
          //     fundArr.push(+dataFund.idOrganization);
          //   });
          //   this.userForm.controls['fundingOrganization'].patchValue(fundArr);
          //   this.setSelectedValues();
          // }
          this.viewmanageuser = "true";
          this.editmanageuser = "false";
          this.userForm.disable();
          this.step = 1;
      
        },
        error => console.log(error));
   

  }
  moveToViewTab(){
    this.step = 0;
  }
}
export interface UserType {
  // position: number;
  userType: any;
  fullName:any;
  username:any;
  email:any;
  date:any;
}
export interface PeriodicElement {
  userType: string;
  fullName: string;
  userName: string;
  email: string;
  dateOfJoin: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {userType:'dngdpadmin',fullName: 'Charlie Adams',userName:'charlie',email:'charlie.adams12@email.com',dateOfJoin:'11/07/2019'},
  {userType:'dngdpteam',fullName: 'Arlete Bombe',userName:'arlete',email:'arlete.bombe@email.com',dateOfJoin:'23/02/2017'},
  {userType:'partner',fullName: 'Gilberto Mendes',userName:'mendes',email:'gilberto.mendes42@email.com',dateOfJoin:'31/12/2018'},
  {userType:'dntcef',fullName: 'Lucrecia Paco',userName:'paco',email:'lucrecia.paco@email.com',dateOfJoin:'01/02/2020'}
];
