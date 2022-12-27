import { DOCUMENT } from '@angular/common';
// import { Component, Inject, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Component, Inject, OnDestroy, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';


import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExcelService } from '../../../Service/excel.service';
import individualdata from '../../../data/individual-data.json';
import { TranslateService } from '@ngx-translate/core';
import { Organization } from 'src/app/Service-Class/organization';
import { OrganizationService } from 'src/app/Service/organization.service';
import { Country } from 'src/app/Service-Class/country';
import { CountryService } from 'src/app/Service/country.service';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import  { OrganizationServiceService } from 'src/app/Service/organization-service.service';
import { OrganizationServiceClass } from 'src/app/Service-Class/organization-service-class';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import  { IndividualCrudServiceService } from 'src/app/Service/individual-crud-service.service';
import { IndividualCrudServiceClass } from 'src/app/Service-Class/individual-crud-service-class';
import { Individual } from 'src/app/model/individual';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';


const ELEMENT_DATA: Individual[] = [
  {position: 1,names:"World Health Organization",nicknames:'WHO', post:'Developer',organization:'organization1',email1:'karisma@gmail.com',email2:'k2@gmail.com', phone1:'8327755005',phone2:'8427755005',fax:'xyz',address:'bbsr',city:'bbsr',country:'india',othercontacts:'skype'},
  {position: 2,names:"United Nations Children's Fund",nicknames:'Unicef', post:'Developer',organization:'organization1',email1:'lopa@gmail.com',email2:'l22@gmail.com', phone1:'4512625412',phone2:'6589457845',fax:'pqr',address:'bhadrak',city:'bbsr',country:'india',othercontacts:'linkedIn'},
  {position: 3,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Pr. Analyst',organization:'organization1',email1:'prasant@gmail.com',email2:'pr@gmail.com', phone1:'4541268975',phone2:'9865741259',fax:'bhg',address:'ctc',city:'ctc',country:'india',othercontacts:'skype'},
  {position: 4,names:"World Health Organization",nicknames:'WHO', post:'TechLead',organization:'organization1',email1:'amit@gmail.com',email2:'a@gmail.com', phone1:'9564256845',phone2:'9587412245',fax:'akn',address:'bbsr',city:'bbsr',country:'india',othercontacts:'skype'},
  {position:5,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Developer',organization:'organization1',email1:'raman@gmail.com',email2:'r2@gmail.com', phone1:'5421562354',phone2:'8565695036',fax:'pqr',address:'bhadrak',city:'nepal',country:'india',othercontacts:'skype'},
  {position: 6,names:"United Nations Children's Fund",nicknames:'Unicef', post:'Developer',organization:'organization1',email1:'pinaki@gmail.com',email2:'pinaki@gmail.com', phone1:'72056894523',phone2:'7601548523',fax:'pqr',address:'bhadrak',city:'bbsr',country:'india',othercontacts:'linkedIn'}
  ];

@Component({
  selector: 'app-add-individual-component',
  templateUrl: './add-individual-component.component.html',
  styleUrls: ['./add-individual-component.component.css']
})
export class AddIndividualComponentComponent implements OnInit, OnDestroy {
  // export class AddDisbursementComponent implements OnInit, OnDestroy
  id: string;
  viewByTableId: any = null;
  individualdata:any;
  updateIndividual="false";
  usergroup: any;
  code1Validate: string;
  code2Validate:string;
  faxValidate:string;
//   refresh() {
//     console.log("inside----------");
//     this.ngOnInit()
//  }
  check_email_flag1=true;
  check_email_flag2=true;

  check_email2_flag1=true;
  check_email2_flag2=true;

  check_phone_flag=true;
  check_phone1_flag=true;

  check_phone_flag2=true;
  check_phone1_flag2=true;

  check_name_flag=true;
  public individualForm!: FormGroup;
  // organizationCityfilteredOption:Observable<any[]>;
  organizationCityList:OrganizationServiceClass[];
  saveAsDraftList:IndividualCrudServiceClass[];
  // individual:Individual=new Individual();
  individual:IndividualCrudServiceClass;
  displayedColumns: string[] = ['position', 'names', 'nicknames', 'post','organization','email1','email2','phone1','phone2','fax','address','city','country','othercontacts','edit'];
  dataSource = ELEMENT_DATA;
  elements!: NodeListOf<Element>;
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  auto_save_as_draft_flag=false;


 //Auto complete code
 organization = new FormControl('', [Validators.required]);
//  country = new FormControl();

 flag :any;
 names:any;





 organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
 public organizationOptionList!: OrganizationCrudServiceClass[];
 countryoptions: string[] = ['India', 'Austrelia', 'U.S','South - Africa'];

public countryList:Country[];
 //filteredOptions: Observable<string[]>;
 countryfilteredOptions: Observable<string[]>;
 filteredOptions: Observable<any[]>;
 countryfilteredOption: Observable<any[]>;
 countryDialingCodeList: CountryDialingCode[]=[];
 countryDialingCodeFilteredOption:Observable<any[]>;
 countryDialingCodeList2: CountryDialingCode[];
 countryDialingCodeList3: CountryDialingCode[];
 countryDialingCodeFilteredOption2:Observable<any[]>;
 countryDialingCodeFilteredOption3:Observable<any[]>;
  editData: IndividualCrudServiceClass[];
  userNameForNotificationAlert:string="Charlie Adams"; //letter this field will be softcoded
  userGroupForNotificationAlert:string="DNGDP Admin"; //letter this field will be softcoded
today:any;
  userName:string="Charlie Adams"; //letter this field will be softcoded
  userGroup:string="DNGDP Admin"; //letter this field will be softcoded
  getOrganizationDetails(){
    this.organizationService. getOrganizationList().subscribe(data=>{
      this.organizationOptionList=data;
      // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
      //   debugger;
      //   this.individualForm.controls.organization.patchValue(this.individual.organization);
      //   console.log("organization : ",this.individual.organization);
      // }
     // this.filteredOptions = this.organization.valueChanges
     console.log("org list ",this.organizationOptionList)
     this.filteredOptions = this.searchOrganization.valueChanges
        .pipe(
          startWith(''),
          map(organizationDAta => organizationDAta ? this.filterOrganization(organizationDAta) : this.organizationOptionList.slice())
        );
     });
  }
  constructor(
    private router :Router,public translate: TranslateService,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,
    private organizationService: OrganizationService,private countryService: CountryService,
    private dialog: MatDialog,
    private organizationServiceService:OrganizationServiceService,
    private countryDialingCodeService:CountryDialingCodeService,
    private individualCrudServiceService:IndividualCrudServiceService,
    private route: ActivatedRoute,
    private notificationService:NotificationService
    ) {
      this.getValueByLang();
      //data for organization
     this.getOrganizationDetails()
//get draft value
this.getDraftValue();
       //Data for country

       this.countryService. getCountry().subscribe(data=>{
        this.countryList=data;
        for (let i = 0; i < this.countryList.length; i++) {
          let crtDt=this.countryList[i].createdOn;
          let updateDt=this.countryList[i].updatedOn;
           this.today=new Date();
           crtDt=new Date(crtDt);
          //calculate time difference
         var time_difference = this.today.getTime() - crtDt.getTime();
         //calculate days difference by dividing total milliseconds in a day
         var days_difference = time_difference / (1000 * 60 * 60 * 24);
         this.countryList[i].updateDifference=15
         if(updateDt !=null){
          updateDt=new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.countryList[i].updateDifference=days_differenceForUpdate;
         }
          (this.countryList[i].difference)=days_difference;
        }
        //below condition is for patch the value which will show at the edit page for country
        // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
        //   this.individualForm.controls.country.patchValue(this.individual.country);
        //   console.log("country value",this.individual.country);
        // }

        //The below line of code is responsible to sort countryList in alphabetic order
        this.countryList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

      //  this.countryfilteredOption = this.individualForm.controls['country'].valueChanges
       this.countryfilteredOption = this.searchCountry.valueChanges
          .pipe(
            startWith(''),
            map(countryDAta => countryDAta ? this.filterCountry(countryDAta) : this.countryList.slice())
          );
       });

     }
     getValueByLang(){
      this.browserLang = localStorage.getItem("browserLang");
    }
    private filterOrganization(name: string) {
      return this.organizationOptionList.filter(organization =>
        organization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(name.toLowerCase()) !== -1 || organization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1);
    }
    private filterCountry(name: string) {
      return this.countryList.filter(country =>
        country.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }
    // private getCityOrganization(){
    //   this.organizationServiceService.getOrganizationCityList().subscribe(data=>{

    //     this.organizationCityList=data;

    //    this.organizationCityfilteredOption = this.individualForm.controls['city'].valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(organizationCity => organizationCity ? this.filterCityOrganization(organizationCity) : this.organizationCityList.slice())
    //         );
    //       });
    // }
    // private filterCityOrganization(name: string) {

    //   return this.organizationCityList.filter(organizationCity =>

    //     organizationCity.cityName.toLowerCase().indexOf(name.toLowerCase()) === 0);

    // }
    num:any;
    EditInd:any;
    ViewMoreInd:any;
    draftedId:any = null;
    fn: any;
    tabClick(index: number) {
      this.num=index;
    }

    browserLang:any;
    editId:any=null;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    //this.chkDraft();
    // this.getOrganization();
    this.getCountryDialingCodesInitial();
    this.getCountryDialingCodes();
    this.getCountryDialingCodes2();
    this.getCountryDialingCodes3();

    // this.getCityOrganization();
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang",this.browserLang);
    console.log("Inside add individual");
    // edit individual coding part starts
    // this.EditInd=localStorage.getItem("EditInd");
    // this.ViewMoreInd=localStorage.getItem("ViewMoreInd");
    this.id = this.route.snapshot.paramMap.get("id");
    this.viewByTableId = this.route.snapshot.paramMap.get("individualId");
    this.draftedId = this.route.snapshot.paramMap.get("draftedId");
    this.usergroup = localStorage.getItem('usergroup');

    this.individualForm = new FormGroup({
      id: new FormControl(''),
      language:new FormControl(''),
      names: new FormControl('', [Validators.required]),
      nicknames: new FormControl('', [Validators.required]),
      email1: new FormControl('', [Validators.required]),
      // email1: new FormControl(''),
      organization: new FormControl('', [Validators.required]),
      email2: new FormControl(''),
      // phone1: new FormControl('', [Validators.required]),
      phone1: new FormControl(''),

      phone2: new FormControl({ value: '', disabled: true }),
      //code1:new FormControl('', [Validators.required]),
      code1:new FormControl(''),

      code2:new FormControl(''),
      code3:new FormControl(''),
      address: new FormControl(''),
      fax: new FormControl({ value: '', disabled: true }),
      post: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      othercontacts: new FormControl(''),
      viewSaveAsDraft:new FormControl('')
    });
    this.individualForm.controls.phone1.disable();
    //edit starts
    //this.EditInd = localStorage.getItem("EditInd");
    //if(this.EditInd=="EditInd")
  if(this.id != null)
  {
  this.auto_save_as_draft_flag=false;
  console.log("Ind class id"+this.id);
  this.individualCrudServiceService.editById(this.id)
  .subscribe(
    data => {
      console.log("individual data : ", data);
      // this.individualdata = data
      var editData:IndividualEdit;
      editData = data;
      console.log("editData : ",editData);
      // console.log("individual class data");
      // console.log(this.individualdata);
      // this.individual = this.individualdata;

      this.individualForm.controls['id'].patchValue(editData.id);
      this.editId=this.individualForm.controls['id'].value;
      this.individualForm.controls['names'].patchValue(editData.names);
      this.individualForm.controls['nicknames'].patchValue(editData.nicknames);
      this.individualForm.controls['post'].patchValue(editData.post);
      this.individualForm.controls['email1'].patchValue(editData.email1);
      this.individualForm.controls['email2'].patchValue(editData.email2);
      this.individualForm.controls['phone1'].patchValue(editData.phone1);
      this.individualForm.controls['phone2'].patchValue(editData.phone2);
      // debugger

      this.individualForm.controls['address'].setValue(editData.address);
      this.individualForm.controls['city'].setValue(editData.city);
      this.individualForm.controls['othercontacts'].setValue(editData.othercontacts);
      // this.individualForm.controls['organization'].setValue(editData.organization.organizationId);
      // this.individualForm.controls['country'].setValue(editData.country.countryId);
      // this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
      // this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
      // this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);

if(editData.organization!=null){
      this.individualForm.controls['organization'].setValue(editData.organization.id);
    }
    if(editData.country!=null){
      this.individualForm.controls['country'].setValue(editData.country.countryId);
    }
    if(editData.code1!=null){
      this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
      this.enablephone1();
    }
    if(editData.code2!=null){
      this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
      this.enablephone2();
    }
    if(editData.code3!=null){
      this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);
      this.enablefax();
    }
    if(this.individualForm.controls['phone1'].value !=null){
      this.phoneChk=false;
    }
    if(this.individualForm.controls['phone2'].value !=null){
      this.phone2Chk=false;
    }
    this.individualForm.controls['fax'].setValue(editData.fax);
    if(this.individualForm.controls['fax'].value != null){
      this.faxChk=false;
    }
      this.updateIndividual = "true";
      // localStorage.setItem('editPrimaryLink', 'reset-edit-PrimaryLink');
//      localStorage.setItem("EditInd","reset-edit-ind");
    },
    error => console.log(error));


}


//view individual
//this.ViewMoreInd = localStorage.getItem("ViewMoreInd");

//if(this.ViewMoreInd=="ViewMoreInd"){
if(this.viewByTableId != null){
  this.auto_save_as_draft_flag=false;
  this.individualForm.disable();
  //  this.id = this.route.snapshot.params['id'];
  console.log("Ind class id"+this.viewByTableId);
  this.individualCrudServiceService.editById(this.viewByTableId)
  .subscribe(
    data => {
      console.log("individual data : ", data);
      // this.individualdata = data
      var editData:IndividualEdit;
      editData = data;
      console.log("editData : ",editData);
      // console.log("individual class data");
      // console.log(this.individualdata);
      // this.individual = this.individualdata;
      this.individualForm.controls['names'].patchValue(editData.names);
      this.individualForm.controls['nicknames'].patchValue(editData.nicknames);
      this.individualForm.controls['post'].patchValue(editData.post);
      this.individualForm.controls['email1'].patchValue(editData.email1);
      this.individualForm.controls['email2'].patchValue(editData.email2);
      this.individualForm.controls['phone1'].patchValue(editData.phone1);
      this.individualForm.controls['phone2'].patchValue(editData.phone2);
      this.individualForm.controls['fax'].setValue(editData.fax);
      this.individualForm.controls['address'].setValue(editData.address);
      this.individualForm.controls['city'].setValue(editData.city);
      this.individualForm.controls['othercontacts'].setValue(editData.othercontacts);
      // this.individualForm.controls['organization'].setValue(editData.organization.organizationId);
      // this.individualForm.controls['country'].setValue(editData.country.countryId);
      // this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
      // this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
      // this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);

      if(editData.organization!=null){
        this.individualForm.controls['organization'].setValue(editData.organization.id);
      }
      if(editData.country!=null){
        this.individualForm.controls['country'].setValue(editData.country.countryId);
      }
      if(editData.code1!=null){
        this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
      }
      if(editData.code2!=null){
        this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
      }
      if(editData.code3!=null){
        this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);
      }


      // this.updateIndividual = "true";
      // localStorage.setItem('editPrimaryLink', 'reset-edit-PrimaryLink');
//      localStorage.setItem("EditInd","reset-edit-ind");
    },
    error => console.log(error));



  //localStorage.setItem("ViewMoreInd","reset-view-more-ind");
  }

  if(this.draftedId != null){
    this.auto_save_as_draft_flag=false;
    this.individualForm.disable();
    this.individualCrudServiceService.editById(this.draftedId)
    .subscribe(
      data => {
        console.log("individual data : ", data);
        var editData:IndividualEdit;
        editData = data;
        console.log("editData : ",editData);
        this.individualForm.controls['names'].patchValue(editData.names);
        this.individualForm.controls['nicknames'].patchValue(editData.nicknames);
        this.individualForm.controls['post'].patchValue(editData.post);
        this.individualForm.controls['email1'].patchValue(editData.email1);
        this.individualForm.controls['email2'].patchValue(editData.email2);
        this.individualForm.controls['phone1'].patchValue(editData.phone1);
        this.individualForm.controls['phone2'].patchValue(editData.phone2);
        this.individualForm.controls['fax'].setValue(editData.fax);
        this.individualForm.controls['address'].setValue(editData.address);
        this.individualForm.controls['city'].setValue(editData.city);
        this.individualForm.controls['othercontacts'].setValue(editData.othercontacts);
        if(editData.organization!=null){
          this.individualForm.controls['organization'].setValue(editData.organization.id);
        }
        if(editData.country!=null){
          this.individualForm.controls['country'].setValue(editData.country.countryId);
        }
        if(editData.code1!=null){
          this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
        }
        if(editData.code2!=null){
          this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
        }
        if(editData.code3!=null){
          this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);
        }
      },
      error => console.log(error));
    }

      console.log("names:"+this.individualForm.get('names')?.value);
    this.filteredOptions = this.individualForm.controls['organization'].valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.countryfilteredOptions = this.individualForm.controls['country'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCountry(value))
      );

  }
  private getCountryDialingCodesInitial() {
    this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
      this.countryDialingCodeList=data;
      this.getCountryDialingCodes();
      this.getCountryDialingCodes2();
      this.getCountryDialingCodes3();
      console.log("code data ",this.countryDialingCodeList)
      // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
      //   this.organizationForm.controls.code1.patchValue(organizationdata.code1);
      // }
      this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

      this.countryDialingCodeFilteredOption=this.searchCode1.valueChanges
      .pipe(
          startWith(''),
          map(code=>
            code ? this.filterCode(code) : this.countryDialingCodeList.slice())
      );
  });
  }
  ngOnDestroy() {
    if(this.auto_save_as_draft_flag==true){
      this.autoSaveIndividualDraft();
    }
    document.removeEventListener('keydown', this.fn);
  }
  check(){
    console.log("flag:"+localStorage.getItem("editFlag"));
    if(this.flag){

    this.names = localStorage.getItem('names');

      }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Individual'){
        this.authorised_flag=true;
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.organizationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countryoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.individualForm.controls[controlName].hasError(errorName);
  }

  private getOrganization(){
    this.organizationService.getOrganizationList().subscribe(data=>{
      // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
      //   this.individualForm.controls.organization.patchValue(individualdata.organization);
      // }
        this.organizationOptionList=data;
    });
  }

  private getCountryDialingCodes(){
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    //     this.countryDialingCodeList=data;
        //below condition is for patch the value which will show at the edit page for code1
        // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
        //   this.individualForm.controls.code1.patchValue(individualdata.code1);
        // }
        if(this.countryDialingCodeList.length>0){
        this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
        this.countryDialingCodeFilteredOption=this.searchCode1.valueChanges
        .pipe(
            startWith(''),
            map(code=>
              code ? this.filterCode(code) : this.countryDialingCodeList.slice())
        );
      }
    // });
  }

  private filterCode(name:string){
    return this.countryDialingCodeList.filter(code=>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(name.toLowerCase())!==-1 || code.dialingCode.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1);
  }

  private getCountryDialingCodes2(){
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    //     this.countryDialingCodeList2=data;
        //below condition is for patch the value which will show at the edit page for code2
        // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
        //   this.individualForm.controls.code2.patchValue(individualdata.code2);
        // }
        if(this.countryDialingCodeList.length>0){
        // this.countryDialingCodeList2.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
        this.countryDialingCodeFilteredOption2=this.searchCode2.valueChanges
        .pipe(
            startWith(''),
            map(code=>
              code ? this.filterCode2(code) : this.countryDialingCodeList.slice())
        );
      }
    // });
  }

  private filterCode2(name:string){
    return this.countryDialingCodeList.filter(code=>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(name.toLowerCase())!==-1 || code.dialingCode.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1);
  }
  private getCountryDialingCodes3(){
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    //     this.countryDialingCodeList3=data;
        //below condition is for patch the value which will show at the edit page for code3
        // if(this.EditInd=="EditInd" || this.ViewMoreInd=="ViewMoreInd"){
        //   this.individualForm.controls.code3.patchValue(individualdata.code3);
        // }
        if(this.countryDialingCodeList.length>0){
          // this.countryDialingCodeList3.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
          this.countryDialingCodeFilteredOption3=this.searchCode3.valueChanges
          .pipe(
              startWith(''),
              map(code=>
                code ? this.filterCode3(code) : this.countryDialingCodeList.slice())
          );
        }
    // });
  }
  private filterCode3(name:string){
    return this.countryDialingCodeList.filter(code=>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(name.toLowerCase())!==-1 || code.dialingCode.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase())!==-1);
  }
  getCountryName(){

    var countryName= this.countryDialingCodeList.find(x => x.dialingCodeid == this.individualForm.controls.code1.value).countryName;
    var telephhoneCountry = this.individualForm.controls.code1;
    // this.individualForm.controls.code3.patchValue(telephhoneCountry.value);
    this.individualForm.controls.country.setValue(this.countryList.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).countryId);


    console.log(this.individualForm.value);
    // this.individualForm.controls['country'].patchValue(event.option.id);
    // this.individualForm.controls['code3'].patchValue(this.individualForm.controls['code1'].value);
  }

  public createIndividual = (individualFormValue) => {
    this.auto_save_as_draft_flag=true;
    console.log(individualFormValue)
    if (this.individualForm.valid) {
      this.executeIndividualCreation(individualFormValue);
    }
  }

  private executeIndividualCreation = (individualFormValue) => {
    let individual: Individual = {
      names: individualFormValue.name,
      nicknames: individualFormValue.nickname,
      post: individualFormValue.post,
      organization: individualFormValue.organization,
      email1:individualFormValue.email1,
      email2:individualFormValue.email2,
      phone1:individualFormValue.phone1,
      phone2:individualFormValue.phone2,
      address:individualFormValue.address,
      fax:individualFormValue.fax,
      city:individualFormValue.city,
      country:individualFormValue.country,
      othercontacts:individualFormValue.othercontacts,
      position:individualFormValue.position

    }
  }

  //for notification alert execute on save Individdual
  saveIndividualInsertAlert(){
    let notificationDetails:Notification=new Notification();
    let todayTime=new Date();

    //email subject
    let subjectForEmail:string='Individual Reference ID "'
      +'XXXXX'
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Individual "'
      +this.individualForm.controls['names'].value+' '
      +this.individualForm.controls['nicknames'].value
      +'" with Reference ID "XXXXX" '
      +'has been created by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-individual\\';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup=this.userGroupForNotificationAlert;
    notificationDetails.updatedBy=this.userNameForNotificationAlert;
    notificationDetails.notificationMsg=this.userNameForNotificationAlert+" has created individual on "+(todayTime+'').substring(0,24);
    notificationDetails.updatedOn=todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.moveToViewTab();
    });
  }








  //for notification alert, execute on update individual
  individualUpdateAlert(){
    let todayTime=new Date();

    //email subject
    let subjectForEmail:string='Individual Reference ID "'
      +'XXXXX'
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Individual "'
      +this.individualForm.controls['names'].value+' '
      +this.individualForm.controls['nicknames'].value
      +'" with Reference ID "XXXXX" '
      +'has been edited by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-individual\\'+this.id;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';

    // let notificationDetails:Notification=new Notification();
    // notificationDetails.notificationGroup=this.userGroupForNotificationAlert;
    // notificationDetails.updatedBy=this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg=this.userNameForNotificationAlert+" has update individual on "+(todayTime+'').substring(0,24);
    // notificationDetails.updatedOn=todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
    //   console.log(data);
    //   this.moveToViewTab();
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToViewTab();
  }

  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

  moveToIndividualTab(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-individual']));
  }

  saveDisbursementDraft(){
    console.log(this.individualForm.value)
    this.individualCrudServiceService.saveIndividualDraft(this.individualForm.getRawValue()).subscribe(data => {
      console.log(data);
      console.log("inside saveDisbursementDraft",);
      this.chkDraft();

    },
      error => console.log(error));
  }
  draftfilteredOption: Observable<any[]>;
  searchDraft= new FormControl('');
 private getDraftValue(){
    this.individualCrudServiceService.getIndividualDraftViewList().subscribe(data => {

        this.saveAsDraftList = data;
        for(let k=0;k<this.saveAsDraftList.length;k++){
          if(this.saveAsDraftList[k].names==null){
            this.saveAsDraftList[k].names=""
          }
        }
        console.log("this.saveAsDraftList ",this.saveAsDraftList)
        this.draftfilteredOption = this.searchDraft.valueChanges
            .pipe(
              startWith(''),
              map(data => data ? this.filterDraftData(data) : this.saveAsDraftList.slice())
            );
    });
  }
  private filterDraftData(name: string) {
    return this.saveAsDraftList.filter(data =>
      (data.names==null)?'':data.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  chkDraft() {
    this.getValueByLang()
    this.individualCrudServiceService.getIndividualDraftViewList().subscribe(data => {
       /* Below condition is for to check data present or not in db */
       if (data.length == 0) {
         if(this.browserLang==='en')
         Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
         else
         Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error')
       }else{
         this.saveAsDraftList = data;
       }
     });
   }
  // openMandatoryAlert(){
  //   Swal.fire('Please Fill All Mandatory Fields.')
  // }
  openMandatoryAlert(){
    console.log("this.editId:"+this.EditInd);
this.getValueByLang()
  //  alert("this.check_phone_flag:"+this.check_phone_flag+"---this.check_phone_flag2:"+this.check_phone_flag2+"---this.check_fax_flag:"+this.check_fax_flag+"---this.check_email_flag1:"+this.check_email_flag1+"---this.check_email2_flag1"+this.check_email2_flag1);
  if(this.nameWhiteSpace==true){
    if(this.browserLang=='en')
    Swal.fire('White spaces are not allowed for a Name')
    else
    Swal.fire('Não são permitidos espaços em branco para um Nome')
  }
  if(this.surNameWhiteSpace==true){
    if(this.browserLang=='en')
    Swal.fire('White spaces not allowed for Surnames')
    else
    Swal.fire('Não são permitidos espaços em branco para um Apelido')
  }
  if(this.postWhiteSpace== true){
    if(this.browserLang=='en')
    Swal.fire('White space not allow for post')
    else
    Swal.fire('Não é permitido espaço em branco para cargos/postos')
  }
  if(this.adrsWhiteSpace== true){
    if(this.browserLang=='en')
    Swal.fire('White spaces are not allowed for an Address')
    else
    Swal.fire('Não são permitidos espaços em branco para um Endereço')
  }
  if(this.cityWhiteSpace== true){
    if(this.browserLang=='en')
    Swal.fire('White space not allow for city')
    else
    Swal.fire('Não é permitido espaço em branco para cidade')
  }
  if(this.otherContactWhiteSpace==true){
    if(this.browserLang=='en')
    Swal.fire('White space not allow for other contact details')
    else
    Swal.fire('Não é permitido espaço em branco para outros detalhes de contacto')
  }
  if(this.nameSpecialChar == true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for a Name')
    else
    Swal.fire('Não são permitidos caracteres especiais para um Nome')
  }
  if(this.surSpecialChar == true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for Surnames')
    else
    Swal.fire('Não são permitidos caracteres especiais para um Apelido')
  }
  if(this.postSpecialChar==true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for a Post')
    else
    Swal.fire('Não são permitidos caracteres especiais para um Posto/Cargo')
  }
  if(this.adrsSpecialChar == true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for an Address')
    else
    Swal.fire('Não são permitidos caracteres especiais para um Endereço')
  }
  if(this.citySpecialChar == true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for a City')
    else
    Swal.fire('Não são permitidos caracteres especiais para uma Cidade')
  }
  if(this.otherContactSpecialChar==true){
    if(this.browserLang=='en')
    Swal.fire('Special characters are not allowed for Other contact details')
    else
    Swal.fire('Não são permitidos caracteres especiais para Outros Detalhes de Contacto')
  }
    if(this.check_phone_flag==false){
      if(this.browserLang=='en')
      Swal.fire('Invalid Phone format. Please enter a valid Phone format.')
      else
      Swal.fire('Formato de telefone inválido. Por favor, introduza um formato de telefone válido.')
    }
     else if(this.check_phone_flag2==false){
      if(this.browserLang=='en')
      Swal.fire('Invalid Phone format. Please enter a valid Phone format.')
      else
      Swal.fire('Formato de telefone inválido. Por favor, introduza um formato de telefone válido.')
    }
    else if(this.check_fax_flag==false){
      if(this.browserLang=='en')
      Swal.fire('Invalid Fax format. Please enter a valid Fax format.')
      else
      Swal.fire('Formato de fax inválido. Por favor, introduza um formato de fax válido.')
    }

    else if( this.check_email_flag1==false ){
      if(this.browserLang=='en')
      Swal.fire('Invalid Email format. Please enter a valid Email format.')
      else
      Swal.fire('Formato de e-mail inválido. Por favor, introduza um formato de e-mail válido.')
    }else if(this.check_email2_flag1==false ){
      if(this.browserLang=='en')
      Swal.fire('Invalid Email format. Please enter a valid Email format.')
      else
      Swal.fire('Formato de e-mail inválido. Por favor, introduza um formato de e-mail válido.')
    }
   else if(this.individualForm.invalid)
   {
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
   }
   else if(this.phoneChk == true){
    if(this.browserLang=='en')
    Swal.fire("Please provide phone number.")
    else
    Swal.fire("Por favor preencha o número de telefone.")
}
else if(this.faxChk == true){
  if(this.browserLang=='en')
  Swal.fire("Please provide fax.")
  else
  Swal.fire("Por favor preencha o número de fax.")
}else if(this.phone2Chk == true){
  if(this.browserLang=='en')
  Swal.fire("Please provide second phone number.")
  else
  Swal.fire("Por favor preencha o segundo número de telefone.")
}
  }


  //below method is for save Individual data in data base
  saveIndividual() {
    this.getValueByLang()
    console.log(this.individualForm.value)
    this.individualForm.controls.language.setValue(this.browserLang);
    this.individualCrudServiceService.saveIndividualCurd(this.individualForm.value).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      console.log("inside individual save method ");
      if(this.browserLang=='en')
      Swal.fire('Submitted successfully', '', 'success');
      else
      Swal.fire('Submetido com sucesso', '', 'success');
      this.saveIndividualInsertAlert();
    },
    error => {
      if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
        Swal.fire(error.error.message, '', 'error');
      } else {
        Swal.fire(error.error, '', 'error');
      }
    }
    );
  }




  saveIndividualDraft(){
    console.log("inside save individual draft");
    this.getValueByLang()
    // console.log("this.individualForm.value:"+this.individualForm.value);
    // console.log("raw value:"+this.individualForm.getRawValue())
    if(this.individualForm.controls['viewSaveAsDraft'].value!=null){
      console.log("this.individualForm.controls['viewSaveAsDraft'].value:"+this.individualForm.controls['viewSaveAsDraft'].value);
      this.individualForm.controls['id'].patchValue(this.individualForm.controls['viewSaveAsDraft'].value);
    }else{
      this.individualForm.controls['id'].patchValue(0)
    }

    this.individualCrudServiceService.saveIndividualDraft(this.individualForm.getRawValue()).subscribe(data => {
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Individual data saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados do Indivíduo salvos como Rascunho com sucesso', '', 'success');
      this.moveToAddTab();
    },
      error => console.log(error));
  }

  autoSaveIndividualDraft(){
    console.log("inside save individual draft");
    // console.log("this.individualForm.value:"+this.individualForm.value);
    // console.log("raw value:"+this.individualForm.getRawValue())
    this.getValueByLang()
    if(this.individualForm.controls['viewSaveAsDraft'].value!=null){
      console.log("this.individualForm.controls['viewSaveAsDraft'].value:"+this.individualForm.controls['viewSaveAsDraft'].value);
      this.individualForm.controls['id'].patchValue(this.individualForm.controls['viewSaveAsDraft'].value);
    }else{
      this.individualForm.controls['id'].patchValue(0)
    }

    this.individualCrudServiceService.saveIndividualDraft(this.individualForm.getRawValue()).subscribe(data => {
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Individual Data Saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados individuais salvos como rascunho com sucesso', '', 'success');
    },
      error => console.log(error));
  }


  draftValue(e){
    this.auto_save_as_draft_flag=false;
    console.log("Inside DraftValue:"+e.value);
  let id = e.value;//this.assignGroupForm.controls.DefaultPermission.patchValue(e.value);//this.individualForm.controls['viewSaveAsDraft'].value;
  console.log("draft Id:",id);
  //this.individualCrudServiceService.editById(id).subscribe(data => {
  this.individualCrudServiceService.getIndividualById(id).subscribe(data => {

    //this.draftData = data;
    //console.log("draftdata Patch:",this.draftData);
    var editData: IndividualEdit;
    console.log("data:",data);
    for(let i=0;i<data.length;i++){
      console.log(data[i].names);
    }
   editData = data;
      console.log("editDraftData : ",editData);
    this.individualForm.controls['names'].patchValue(editData.names);
    this.individualForm.controls['nicknames'].patchValue(editData.nicknames);
    this.individualForm.controls['post'].patchValue(editData.post);
    if(editData.organization!=null){
      this.individualForm.controls['organization'].setValue(editData.organization.id);
    }
    this.individualForm.controls['email1'].patchValue(editData.email1);
    this.validateEmail1();
    this.individualForm.controls['email2'].patchValue(editData.email2);
    this.validateEmail2();
    if(editData.code1!=null){
      this.individualForm.controls['code1'].setValue(editData.code1.dialingCodeid);
      this.enablephone1();
    }

    this.individualForm.controls['phone1'].patchValue(editData.phone1);

    this.validatePhone();

    if(this.individualForm.controls['phone1'].value == null){
      this.phoneChk=false;
    }
    if(editData.code2!=null){
      this.individualForm.controls['code2'].setValue(editData.code2.dialingCodeid);
      this.enablephone2();
    }
    this.individualForm.controls['phone2'].patchValue(editData.phone2);
    this.validatePhone2();
    if(this.individualForm.controls['phone2'].value == null){
      this.phone2Chk=false;
    }
    if(editData.code3!=null){
      this.individualForm.controls['code3'].setValue(editData.code3.dialingCodeid);
      this.enablefax();
    }
    this.individualForm.controls['fax'].setValue(editData.fax);
    this.validateFax();
    if(this.individualForm.controls['fax'].value == null){
      this.faxChk=false
    }
    this.individualForm.controls['address'].setValue(editData.address);
    this.individualForm.controls['city'].setValue(editData.city);
    if(editData.country!=null){
      this.individualForm.controls['country'].setValue(editData.country.countryId);
    }
    this.individualForm.controls['othercontacts'].setValue(editData.othercontacts);




  },
  error => console.log(error));
}


  //update method for individual data update
  updateIndividualDetails() {
     console.log("inside individual update  method");
     this.getValueByLang()
     this.individualForm.controls.language.setValue(this.browserLang);
    this.individualCrudServiceService.updateIndividualDetails(this.individualForm.value).subscribe(data => {
    // this.individualCrudServiceService.saveIndividualCurd(this.individualForm.value).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      console.log("inside individual update subscribe  method");
      if(this.browserLang=='en'){
        Swal.fire('Updated successfully', '', 'success');
      }else{
        Swal.fire('Actualizado com sucesso', '', 'success');
      }
      this.individualUpdateAlert();
      //this.moveToViewTab();
    },
    error => {
      if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
        Swal.fire(error.error.message, '', 'error');
      } else {
        Swal.fire(error.error, '', 'error');
      }
    }
    );
  }




  // individualUpdateAlert(){
  //   let notificationDetails:Notification=new Notification();
  //   let todayTime=new Date();
  //   notificationDetails.notificationGroup=this.usergroup;
  //   notificationDetails.updatedBy=this.userName;
  //   notificationDetails.notificationMsg=this.userName+" has update disbursement on "+(todayTime+'').substring(0,24);
  //   notificationDetails.updatedOn=todayTime;
  //   this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
  //     console.log(data);
  //   });
  // }



  //end of save Individual merthod
  //after save the data the below method will load..responsibility of below method is move to view individual page
  moveToViewTab(){
    this.router.navigate(['/admin/view-individual']);
  }

moveToAddTab(){
  //this.router.navigate(['/admin/add-individual']);
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/individual']));
}



  //end of moveToViewTab()
  opensweetalert() {
this.getValueByLang()
      Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
   /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        this.individualCrudServiceService.checkDuplicateIndividual(this.individualForm.controls.names.value,
          this.individualForm.controls.nicknames.value).
          subscribe(data=>{
            var val = JSON.parse(JSON.stringify(data));
            if(val.isDuplicateIndividual==true){
              (this.browserLang=='en')? Swal.fire("An Individual with this Name already exists."):
              Swal.fire("Já existe um indivíduo com este nome.");
            }
            else{
              this.individualCrudServiceService.checkDuplicateMailInIndividual(this.individualForm.controls.email1.value).
                subscribe(data=>{
                  var mail = JSON.parse(JSON.stringify(data));
            if(mail.isDuplicateIndividual==true){
              (this.browserLang=='en')? Swal.fire("This mail id already exist."):
              Swal.fire("Este ID de e-mail já existe.");
                }
                else{
                  this.saveIndividual();
                }
              })
            }
          });

        // this.moveToSelectedTab;
      } else if(result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })

  }
  opensweetalert2() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to save as Draft?':'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Save`:'Salve',
      denyButtonText:(this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
       // this.individualForm.controls.id.patchValue(0);
        this.saveIndividualDraft();
      } else if(result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  opensweetalertUpdate() {
    if(this.browserLang=='en')
    Swal.fire({
      title:(this.browserLang=='en')?'Do you want to Update?':'Deseja Actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("aasuchi ts update individual ku ");
        this.individualForm.controls.id.patchValue(this.editId);
        this.updateIndividualDetails();

      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  fundingOrganization = false;
  newFundingOrg = '';
  newFundingOrgId: any;
  openDialog() {
    // const dialogRef = this.dialog.open(DialogBoxComponent, {
    //   disableClose: true,
    // });
    // localStorage.setItem("dataKey","AddOrganization");
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.router.navigate(['organization']);
    //   console.log(`Dialog result: ${result}`);
    // });
    if (this.individualForm.controls.organization.value == 'optionAddFundingOrg') {
      this.fundingOrganization = true;

    }
    const dialogRef = this.dialog.open(DialogBoxComponent);
    localStorage.setItem("dataKey", "Donor");
    localStorage.setItem("checkModule", "Individual");
    dialogRef.afterClosed().subscribe((result) => {
      this.newFundingOrg = localStorage.getItem("fundingOrgNm");
      this.newFundingOrgId = localStorage.getItem("fundingOrgNmId");
       this.getOrganizationDetails();
      this.individualForm.controls.organization.patchValue(Number.parseInt(this.newFundingOrgId));
    });
  }

  enablephone1(){
    this.code1Validate=this.individualForm.controls['code1'].value
    if(this.code1Validate!=null && this.code1Validate!='' && this.code1Validate!=undefined){
      this.individualForm.controls['phone1'].enable();
      // this.individualForm.controls['fax'].enable();
      if(this.check_phone1_flag)
        this.phoneChk=true;
      // this.faxChk=true;
      }
    //   else{
    //   Swal.fire({
    //     title: 'Kindly Select Phone Code',
    //   confirmButtonText: `OK`,
    //     })
    // }
  }

  enablephone2(){
    this.code2Validate=this.individualForm.controls['code2'].value
    if(this.code2Validate!=null && this.code2Validate!='' && this.code2Validate!=undefined){
      this.individualForm.controls['phone2'].enable();
      if(this.check_phone1_flag2)
        this.phone2Chk=true;
      }
    //   else{
    //   Swal.fire({
    //     title: 'Kindly Select Phone Code',
    //   confirmButtonText: `OK`,
    //     })
    // }
  }
  enablefax(){
    this.faxValidate=this.individualForm.controls['code3'].value
    if(this.faxValidate!=null && this.faxValidate!='' && this.faxValidate!=undefined){
      this.individualForm.controls['fax'].enable();
      if(this.check_fax1_flag)
        this.faxChk=true;
      }
    //   else{
    //   Swal.fire({
    //     title: 'Kindly Select Phone Code',
    //   confirmButtonText: `OK`,
    //     })
    // }
  }

  check_fax_flag=true;
  check_fax1_flag=true;
  faxMessage:any;

  validateFax(){
    var fax=this.individualForm.controls['fax'].value;

    if(fax == '')
    {
      this.check_fax_flag=true;
      this.faxMessage=' '
      this.faxChk=true;
    }
    else
    {

  var expr = /^\s*\d{8,9}\s*$/;
  if (!expr.test(fax)) {
    console.log( "Invalid FAX ......");
    this.check_fax_flag=false;//for invalid phone
    this.check_fax1_flag=true;//for valid
  }
  else{
    console.log( "valid.....");
    this.check_fax_flag=true;//for invalid phone
    this.check_fax1_flag=false;//for valid
    this.faxMessage='not show';
    this.faxChk=false;
  }
}
if(fax == null){

  this.check_fax_flag=true;
  this.check_fax1_flag=true;
  this.phoneMessage='blank';
  this.faxChk=true;
}
  }
  validateEmail1(){
    var email = this.individualForm.controls['email1'].value;
if(email !=null){
 var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if(email.trim().length == 0 )
    {
      this.check_email_flag1=true;//for invalid email
      this.check_email_flag2=false;//for valid
      this.chkEmail1=false;
    }
    else{
    if (!expr.test(email)) {
      //console.log( "Invalid email address.");
      this.check_email_flag1=false;//for invalid email
      this.check_email_flag2=true;//for valid
      this.chkEmail1=true;
    }
    else{
      // console.log( "valid.");
      this.check_email_flag1=true;//for invalid email
      this.check_email_flag2=false;//for valid
      this.chkEmail1=true;
    }}
  }else{
    this.check_email_flag1=true;
    this. check_email_flag2=true;
  }
  }
  nameWhiteSpace:any=false;
  nameSpecialChar:any=false;
  nmValidation:any;
  nmValidation1:any;
  chkNameFormat(){
    var name = this.individualForm.controls['names'].value;
    var newname=''
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      newname=name.toString().trim()
      // this.individualForm.controls['names'].patchValue(newname)
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.nameWhiteSpace=true;
        this.nmValidation='White Space Not Allow Initial Place For Name';
      }else if(!regexp.test(lastChar)) {
        this.nameWhiteSpace=true;
        this.nmValidation='White Space Not Allow Last Place For Name'
      }
      else{
        this.nameWhiteSpace=false
      }
      //  var specialCharRegx=/^[^* | \  : < > [ ] { } ` \ ( )  ; @ & $]+$/;
      var specialCharRegx= /^[a-zA-ZÀàÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÇçÜü»«₠€$\s]*$/;
    if(!specialCharRegx.test(name)){
      this.nameSpecialChar=true;
      this.nmValidation='Special Character Not Allow For Name'
    }else{
      this.nameSpecialChar=false;
    }
    }

  }
  surNameWhiteSpace:any=false
  surSpecialChar:any=false
  surNmValidation:any;
  chkSurNameFormat(){
    var name = this.individualForm.controls['nicknames'].value;
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.surNameWhiteSpace=true;
        this.surNmValidation='White Space Not Allow Initial Place For Surnames';
      }else if(!regexp.test(lastChar)) {
        this.surNameWhiteSpace=true;
        this.surNmValidation='White Space Not Allow Last Place For Surnames'
      }
      else{
        this.surNameWhiteSpace=false
      }
      var specialCharRegx= /^[a-zA-ZÀàÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÇçÜü»«₠€$\s]*$/;
    if(!specialCharRegx.test(name)){
      this.surSpecialChar=true;
      this.surNmValidation='Special Character Not Allow For Surnames'
    }else{
      this.surSpecialChar=false;
    }
    }
  }
  postWhiteSpace:any=false;
  postSpecialChar:any=false
  postValidation:any;
  chkPostFormat(){
    var name = this.individualForm.controls['post'].value;
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.postWhiteSpace=true;
        this.postValidation='White Space Not Allow Initial Place For Post';
      }else if(!regexp.test(lastChar)) {
        this.postWhiteSpace=true;
        this.postValidation='White Space Not Allow Last Place For Post'
      }
      else{
        this.postWhiteSpace=false
      }
      // var specialCharRegx= /^[a-zA-Z\s]*$/;
      // if(!specialCharRegx.test(name)){
      //   this.postSpecialChar=true;
      //   // this.postValidation='Special Character Not Allow For Post'
      // }else{
      //   this.postSpecialChar=false;
      // }
    }
  }
  adrsWhiteSpace:any=false
  adrsSpecialChar:any=false;
  adrsValidation:any
  chkAdrs(){
    var name = this.individualForm.controls['address'].value;
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.adrsWhiteSpace=true;
        this.adrsValidation='White Space Not Allow Initial Place For Address';
      }else if(!regexp.test(lastChar)) {
        this.adrsWhiteSpace=true;
        this.adrsValidation='White Space Not Allow Last Place For Address'
      }
      else{
        this.adrsWhiteSpace=false
      }
      var specialCharRegx= /^[a-zA-Z0-9ÀàÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÇçÜü»«₠€$\s]*$/;
      if(!specialCharRegx.test(name)){
        this.adrsSpecialChar=true;
        this.adrsValidation='Special Character Not Allow For Address'
      }else{
        this.adrsSpecialChar=false;
      }
    }
  }
  cityWhiteSpace:any=false
  citySpecialChar:any=false
  cityValidation:any
  chkCity(){
    var name = this.individualForm.controls['city'].value;
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.cityWhiteSpace=true;
        this.cityValidation='White Space Not Allow Initial Place For City';
      }else if(!regexp.test(lastChar)) {
        this.cityWhiteSpace=true;
        this.cityValidation='White Space Not Allow Last Place For City'
      }
      else{
        this.cityWhiteSpace=false
      }
      var specialCharRegx= /^[a-zA-ZÀàÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÇçÜü»«₠€$\s]*$/;
      if(!specialCharRegx.test(name)){
        this.citySpecialChar=true;
        this.cityValidation='Special Character Not Allow For City'
      }else{
        this.citySpecialChar=false;
      }
    }
  }
  otherContactWhiteSpace:any=false
  otherContactSpecialChar:any=false
  otherContactValidation:any
  chkOtherContactDtls(){
    var name = this.individualForm.controls['othercontacts'].value;
    var firstChar='';
      var lastChar='';
      var lastLength=0;
    if(name.length >0){
      lastLength=name.length-1;
      firstChar=name[0];
      lastChar=name[lastLength];
      var regexp = /^\S*$/; // a string consisting only of non-whitespaces
      if(!regexp.test(firstChar)){
        this.otherContactWhiteSpace=true;
        this.otherContactValidation='White Space Not Allow Initial Place For Other Contact Details';
      }else if(!regexp.test(lastChar)) {
        this.otherContactWhiteSpace=true;
        this.otherContactValidation='White Space Not Allow Last Place For Other Contact Details'
      }
      else{
        this.otherContactWhiteSpace=false
      }
      var specialCharRegx= /^[a-zA-Z0-9ÀàÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÇçÜü»«₠€$\s]*$/;
      if(!specialCharRegx.test(name)){
        this.otherContactSpecialChar=true;
        this.otherContactValidation='Special Character Not Allow For Other Contact Details'
      }else{
        this.otherContactSpecialChar=false;
      }
    }
  }
  validateName(e){
   var name = this.individualForm.controls['names'].value;
  //  if(name.endsWith(' ')){
  //   name=name.split(' ');
  // console.log("nm ",name)
  //  }

   if(name=='')
   this.check_name_flag=true;
   else{
    this.check_name_flag=false;
   }
  }
  phoneMessage='';
  phoneChk=false;
  faxChk=false;
  phone2Chk=false;
  validatePhone(){

    var phone = this.individualForm.controls['phone1'].value;


    if(phone=='')
      {
        this.check_phone_flag=true;
        this.phoneMessage=' '
        this.phoneChk=true;
      }
      else
      {

    var expr = /^\s*\d{8,9}\s*$/;
    if (!expr.test(phone)) {
      console.log( "Invalid phone ......");
      this.check_phone_flag=false;//for invalid phone
      this.check_phone1_flag=true;//for valid
    }
    else{
      console.log( "valid.....");
      this.check_phone_flag=true;//for invalid phone
      this.check_phone1_flag=false;//for valid
      this.phoneMessage='not show';
      this.phoneChk=false
    }
  }
  if(phone == null){

    this.check_phone_flag=true;
    this.check_phone1_flag=true;
    this.phoneMessage='blank'
    this.phoneChk=true;
  }
  }
  phoneMessage2='';
  validatePhone2(){
    var phone = this.individualForm.controls['phone2'].value;
    //alert(phone);
    if(phone == '')
      {
        this.check_phone_flag2=true;
        this.phoneMessage=' '
        this.phone2Chk=true;
      }
      else
      {

    var expr = /^\s*\d{8,9}\s*$/;
    if (!expr.test(phone)) {
      console.log( "Invalid phone ......");
      this.check_phone_flag2=false;//for invalid phone
      this.check_phone1_flag2=true;//for valid
    }
    else{
      console.log( "valid.....");
      this.check_phone_flag2=true;//for invalid phone
      this.check_phone1_flag2=false;//for valid
      this.phoneMessage='not show';
      this.phone2Chk=false;
    }
  }
  if(phone == null){

    this.check_phone_flag2=true;
    this.check_phone1_flag2=true;
    this.phoneMessage='blank'
    this.phone2Chk=true;
  }
  }
  moveToSelectedTabEdit(){
    let id=this.route.snapshot.paramMap.get("individualId");
    // alert(this.individualForm.controls.id.value);
    // localStorage.setItem("id", id);
    // localStorage.setItem("EditInd", "EditInd");
    // console.log("View More inside view--->",localStorage.getItem("EditIndividual"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-individual',id]));

    console.log("after route");

  }





  chkEmail1=false;
  chkEmail2=false;
  validateEmail2(){
    var email = this.individualForm.controls['email2'].value;
    if(email != null){

    if(email.trim().length == 0)
    {
      this.check_email2_flag1=true;//for invalid email
      this.check_email2_flag2=false;//for valid
      this.chkEmail2=false;

    }
    else{
    var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
    if (!expr.test(email)) {
      //console.log( "Invalid email address.");
      this.check_email2_flag1=false;//for invalid email
      this.check_email2_flag2=true;//for valid
      this.chkEmail2=true;
    }
    else{
      // console.log( "valid.");
      this.check_email2_flag1=true;//for invalid email
      this.check_email2_flag2=false;//for valid
      this.chkEmail2=true;
    }
  }
}else{
  this.check_email2_flag1=true;
  this.check_email2_flag2=true;
}
  }
  clearForm(form: FormGroup) {
    form.reset();
    this.individualForm.controls['phone1'].disable();
    this.individualForm.controls.fax.disable();
    this.individualForm.controls['phone2'].disable();
    this.check_phone_flag=true;
    this.check_phone1_flag=true;
    this.phoneMessage='blank'

    this.check_phone_flag2=true;
    this.check_phone1_flag2=true;
    this.phoneMessage='blank'

    this.check_fax_flag=true;
  this.check_fax1_flag=true;

  //email1 validation
  this.check_email_flag1=true;
      this.check_email_flag2=false;
      this.chkEmail1=false;
//validate email 2
this.check_email2_flag1=true;
      this.check_email2_flag2=false;
      this.chkEmail2=false;

  }
  searchCode1 = new FormControl();
  searchCode2 = new FormControl();
  searchCode3 = new FormControl();
  searchCountry = new FormControl();
  searchOrganization = new FormControl();

  publish() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en') ?'Do you want to Publish?':'Deseja Publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en') ?`Publish`:'Publicar',
      denyButtonText:(this.browserLang=='en') ? `Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let id:string[]=[this.draftedId];
        if (id.length > 0) {
          this.individualCrudServiceService.publishById(id).subscribe(data => {
            (this.browserLang=='en') ?Swal.fire('Published successfully', '', 'success'):
            Swal.fire('Publicado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-individual']);
            });
          },
            error => console.log(error));
        }
      }
    })
  }
  discard() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en') ?'Do you want to Discard?':'Deseja Descartar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en') ? `Discard`:'Descartar',
      denyButtonText:(this.browserLang=='en') ? `Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let id:string[]=[this.draftedId];
        if (id.length > 0) {
          this.individualCrudServiceService.discardById(id).subscribe(data => {
            (this.browserLang=='en') ?  Swal.fire('Discarded successfully', '', 'success'):
            Swal.fire('Descartado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-individual']);
            });
          },
            error => console.log(error));
        }
      }
    })
  }
  clearPhone1(event){
  this.individualForm.controls.code1.reset();
  this.individualForm.controls.phone1.reset();

  this.individualForm.controls['phone1'].disable();
  
  
  this.check_phone_flag=true;
  this.check_phone1_flag=true;
  this.phoneChk=false;
  this.phoneMessage='blank'
    event.stopPropagation();
  }
  clearPhone2(event){
    this.individualForm.controls.code2.reset();
    this.individualForm.controls.phone2.reset();

    this.individualForm.controls['phone2'].disable();

    this.check_phone_flag2=true;
    this.check_phone1_flag2=true;
    this.phoneMessage='blank'
    this.phone2Chk=false
    event.stopPropagation();
  }
  clearFax(event){
    this.individualForm.controls.code3.reset();
    this.individualForm.controls.fax.reset();
    this.individualForm.controls.fax.disable();

    this.check_fax_flag=true;
    this.check_fax1_flag=true;
    this.faxChk=false;
    event.stopPropagation();
  }
  goBack(){
    this.router.navigate(['/admin/view-drafted-individual']);
  }

}

export interface IndividualEdit {
  id: number;
  names: string;
  nicknames: string;
  post: string;
  organization: OrganizationEdit;
  email1: string;
  email2: string;
  code1: Code1OrCode2OrCode3;
  code2: Code1OrCode2OrCode3;
  phone1: string;
  phone2: string;
  code3: Code1OrCode2OrCode3;
  fax: string;
  address: string;
  city: string;
 country:  CountryEdit;
  othercontacts: string;
  status: string;
  creadtedOn: string;
  timeStramp:string;
}

export interface OrganizationEdit {
  id: string;
  names: string;
  status: string;
}
export interface Code1OrCode2OrCode3 {
  dialingCodeid: number;
  countryName: string;
  dialingCode: string;
  status: string;
}
export interface CountryEdit {
  countryId: string;
  countryName: string;
  status: string;
}
