//Author Lopamudra Panda
//This page is for adding Organization Purpose
//This page is belongs to Organization Module
//Here starts the import statements
import { DOCUMENT } from '@angular/common';
// import { Component, Inject, OnInit, Output } from '@angular/core';
import { Component, Inject, Output, OnDestroy, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';


import { Organization } from '../../../model/organization';
import organizationdata from '../../../data/organization-data.json';
import { TranslateService } from '@ngx-translate/core';

import { OrganizationServiceService } from 'src/app/Service/organization-service.service';
import { OrganizationServiceClass } from 'src/app/Service-Class/organization-service-class';
import { CountryService } from 'src/app/Service/country.service';
import { Country } from 'src/app/Service-Class/country';

// import { CityServiceClass } from 'src/app/Service-Class/city-service-class';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationEdit } from '../add-individual-component/add-individual-component.component';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';

import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

// import { FundingServiceClass } from 'src/app/Service-Class/fundingServiceClass-class'
//End of import statements


const ELEMENT_DATA: Organization[] = [
  {id:"", position: 1, names: 'Karishma', acronym: 'Karisma', category: 'Donor', fundingAgency: 'Donor Agency1', email: 'karisma@gmail.com', telephone: '8327755005', fax: 'xyz', direction: 'bbsr', city: 'bbsr', country: 'ap bp', multilateralBilateral: 'multilateral', emergingNonemerging: 'emerging' },
  {id:"", position: 2, names: 'Lopamudra', acronym: 'Lopa', category: 'Implementation agency', fundingAgency: 'Donor Agency1', email: 'lopa@gmail.com', telephone: '4512625412', fax: 'pqr', direction: 'bhadrak', city: 'bbsr', country: 'lp cp', multilateralBilateral: 'Bilateral', emergingNonemerging: 'non-emerging' },
  { id:"",position: 3, names: 'Prashant', acronym: 'prashant', category: 'NGO', fundingAgency: 'Donor Agency3', email: 'prasant@gmail.com', telephone: '4541268975', fax: 'bhg', direction: 'ctc', city: 'ctc', country: 'abcd', multilateralBilateral: 'multilateral', emergingNonemerging: 'non-emerging' },
  { id:"",position: 4, names: 'Amit', acronym: 'Amit', category: 'NGO', fundingAgency: 'Donor Agency1', email: 'amit@gmail.com', telephone: '9564256845', fax: 'akn', direction: 'bbsr', city: 'bbsr', country: 'mnop', multilateralBilateral: 'Bilateral', emergingNonemerging: 'emerging' },
  { id:"",position: 5, names: 'Raman', acronym: 'Raman', category: 'Company', fundingAgency: 'Donor Agency2', email: 'raman@gmail.com', telephone: '5421562354', fax: 'pqr', direction: 'bhadrak', city: 'nepal', country: 'lp cp', multilateralBilateral: 'multilateral', emergingNonemerging: 'non-emerging' },
  { id:"",position: 6, names: 'Pinaki', acronym: 'pinaki', category: 'Company', fundingAgency: 'Donor Agency2', email: 'pinaki@gmail.com', telephone: '72056894523', fax: 'pqr', direction: 'bhadrak', city: 'bbsr', country: 'gfrt', multilateralBilateral: 'Bilateral', emergingNonemerging: 'emerging' }


];
@Component({
  selector: 'app-add-organization-component',
  templateUrl: './add-organization-component.component.html',
  styleUrls: ['./add-organization-component.component.css']
})
export class AddOrganizationComponentComponent implements OnInit, OnDestroy {



  countryDialingCodeFilteredOption2: Observable<any[]>;
  countryDialingCodeFilteredOption3: Observable<any[]>;
  countryDialingCodeFilteredOption4: Observable<any[]>;
  countryDialingCodeList2: CountryDialingCode[];
  countryDialingCodeList3: CountryDialingCode[];
  countryDialingCodeList4: CountryDialingCode[];
  countryfilteredOption!: Observable<any[]>;

  countryfilteredOption2!: Observable<any[]>;
  cityfilteredOption!: Observable<any[]>;
  fundingOrganizationList!: FundingOrganization[];
  organizationCityList: OrganizationServiceClass[];
  fundingOrganizationfilteredOption: Observable<any[]>;


  // organizationCityfilteredOption:Observable<any[]>;
  check_email_flag = true;
  check_email1_flag = true;
  // check_table_email1_flag=true;

  check_phone_flag = true;
  check_phone1_flag = true;
  hideCodeToAddressFlag = true;

  public organizationForm!: FormGroup;
  organization: Organization = new Organization();
  elements!: NodeListOf<Element>;

  categoryList!: OrganizationServiceClass[];

  fundingAgency = new FormControl();
  fundingAgencyOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
  filteredOptions: Observable<string[]>;
  usergroup: any;
  select_options_for_finding_hdn_flag: any;
  country_of_parent_organization_hdn_flag: any;
  funding_organization_hdn_flag: any;
  select_options_for__country_finding_hdn_flag: any;
  donor_and_funding_organization_mandatory_flag = true;
  country = new FormControl();
  country2 = new FormControl();
  countryoptions: string[] = ['India', 'Austrelia', 'U.S', 'South-Africa'];
  countryfilteredOptions: Observable<string[]>;
  saveAsDraftList: OrganizationCrudServiceClass[] = [];
  countryfilteredOptions2: Observable<string[]>;
  countryList!: OrganizationCrudServiceClass[];

  countryList2!: Country[];
  // cityList!:CityServiceClass[];
  countryDialingCodeList: CountryDialingCode[] = [];
  countryDialingCodeFilteredOption: Observable<any[]>;
  editData: OrganizationCrudServiceClass[];
  displayedColumns: string[] = ['position', 'names', 'acronym', 'category', 'fundingAgency', 'email', 'telephone', 'code2', 'fax', 'direction', 'city', 'country', 'multilateralBilateral', 'emergingNonemerging', 'edit'];
  dataSource = ELEMENT_DATA;
  userNameForNotificationAlert: string = "Charlie Adams"; //letter this field will be softcoded
  userGroupForNotificationAlert: string = "DNGDP Admin"; //letter this field will be softcoded
  id: any = null;
  viewByTableId: any = null;
  // organizationdata:any;
  organizationdata: OrganizationCrudServiceClass = new OrganizationCrudServiceClass();
  organizationDraftId: any = "";
  updateOrganization = "false";
  code1Validate: string;
  code2Validate: string;
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  auto_save_as_draft_flag=false;

  draftedId:any = null;

  constructor(
    private router: Router,
    private fundingOrganizationService: FundingOrganizationService,
    private countryService: CountryService,
    private fb: FormBuilder, private dialog: MatDialog,
    private organizationServiceService: OrganizationServiceService,
    private organizationCrudServiceService: OrganizationCrudServiceService,
    private route: ActivatedRoute,
    private notificationService:NotificationService,
    @Inject(DOCUMENT) private _document: HTMLDocument,public translate: TranslateService,
    private countryDialingCodeService: CountryDialingCodeService) {
      this.getValueByLang()
     }


  EditOrganization: any;
  ViewMoreOrganization: any;
  num: any;
  modalopen = false;
  tabClick(index: number) {
    this.num = index;
  }
  today:any;
  private getCategory() {
    this.organizationServiceService.getOrganizationCategoryList().subscribe(data => {
      this.categoryList = data;
      for (let i = 0; i < this.categoryList.length; i++) {
        let crtDt=this.categoryList[i].createdOn;
        let updateDt=this.categoryList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.categoryList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.categoryList[i].updateDifference=days_differenceForUpdate;
       }
        (this.categoryList[i].difference)=days_difference;
      }
      console.log("data:" + this.categoryList.length);
    });
  }
  private getParentCountry() {
    this.organizationCrudServiceService.getCountryOrParentOrganization().subscribe(data => {

      this.countryList = data;
      this.countryList = data;
      // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
      //   this.organizationForm.controls.country.patchValue(organizationdata.country);
      // }
      this.countryfilteredOption = this.searchCountry1.valueChanges
        .pipe(
          startWith(''),
          map(countryDAta => countryDAta ? this.filterCountry(countryDAta) : this.countryList.slice())
        );
    }
    );
  }
  private filterCountry(name: string) {
    return this.countryList.filter(country =>
      country.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  private getCountry() {
    this.countryService.getCountry().subscribe(data => {
      this.countryList2 = data;

      for (let i = 0; i < this.countryList2.length; i++) {
        let crtDt=this.countryList2[i].createdOn;
        let updateDt=this.countryList2[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.countryList2[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.countryList2[i].updateDifference=days_differenceForUpdate;
       }
        (this.countryList2[i].difference)=days_difference;
      }
      // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
      //   this.organizationForm.controls.country2.patchValue(organizationdata.country2);
      // }
      this.countryfilteredOption2 = this.searchCountry2.valueChanges
        .pipe(
          startWith(''),
          map(countryDAta => countryDAta ? this.countryfilter(countryDAta) : this.countryList2.slice())
        );
    });
  }
  private countryfilter(name: string) {
    return this.countryList2.filter(country =>
      country.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  countryName: any;
  getCountryNamefromFundingOrg(event) {
    console.log("Event inside Org", event);
    // var countryName;
    this.fundingOrganizationService.getDonorListbyFundingOrg(event.option.value).subscribe(data => {

      console.log("Data Event inside Org", data[0].donor_name_en);
      this.organizationForm.controls.country.patchValue(data[0].donor_name_en);
      this.countryName = data[0].donor_name_en;
      this.countryDialingCodeService.getCountryCodeByCountryName(this.countryName).subscribe(data => {

        console.log("Data Event inside Org dialingcode", data[0].dialingCode);
        this.organizationForm.controls.code1.patchValue(data[0].dialingCode);
        this.organizationForm.controls.code2.patchValue(data[0].dialingCode);

      });

    });

    // console.log("countryname",this.countryName,this.organizationForm.controls.country.value);

  }

  getFundingOrgFromCountry(event) {

    this.organizationForm.controls.fundingAgency.patchValue("");

  }

  // checkDuplicateOrganization(){
  //   this.getValueByLang();
  //   for(let i=0;i<this.categoryList.length;i++){
  //     if(this.categoryList[i].categoryId==this.organizationForm.controls['category'].value){
  //       if(this.categoryList[i].categoryNameEn==='Implementing Organization'){
  //         let organizationName:string=this.organizationForm.controls['names'].value;
  //         if(organizationName!='' && organizationName!=undefined && organizationName!=null){
  //           this.organizationCrudServiceService.checkDuplicateOrganization(organizationName).subscribe(data=>{
  //             var val = JSON.parse(JSON.stringify(data));
  //             if(val.isDuplicateOrganization==true){
  //               Swal.fire((this.browserLang=='en')?'Organization Already Exists.':'Organização Já Existe.').then(dummy=>{
  //                 this.organizationForm.controls['names'].reset();
  //               });
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  // }

  checkDuplicateOrganization(){
    this.getValueByLang();
    let organizationName:string=this.organizationForm.controls['names'].value;
    if(organizationName!='' && organizationName!=undefined && organizationName!=null){
      this.organizationCrudServiceService.checkDuplicateOrganization(organizationName).subscribe(data=>{
        var val = JSON.parse(JSON.stringify(data));
        if(val.isDuplicateOrganization==true){
            Swal.fire((this.browserLang=='en')?'Organization already exists.':'A Organização já existe.').then(dummy=>{
              this.organizationForm.controls['names'].reset();
            });
        }
      });
    }
  }


  getCountryPhoneCodeByParentCountryName(event) {
    console.log(this.countryDialingCodeList)
    var countryId = this.organizationForm.controls.country.value;
    console.log(countryId);
    var countryName = this.countryList.find(x => x.id == countryId).country;
    //need to change if not work upper line country phone code by country name
    console.log(countryName);
    var countryDialCodeId = this.countryDialingCodeList.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).dialingCodeid;
    console.log('countryDialCodeId1---', +countryDialCodeId);
    var countryDialCodeId2 = this.countryDialingCodeList2.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).dialingCodeid;
    console.log('countryDialCodeId2---', +countryDialCodeId2);
    this.organizationForm.controls['code1'].patchValue(countryDialCodeId);
    this.organizationForm.controls['code2'].patchValue(countryDialCodeId2);

  }

  getCountryPhoneCodeByCountryName(event) {
    console.log(this.countryDialingCodeList)
    var countryId = this.organizationForm.controls.country2.value;
    console.log(countryId);
    var countryName = this.countryList2.find(x => x.countryId == countryId).countryName;
    console.log(countryName);
    var countryDialCodeId = this.countryDialingCodeList.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).dialingCodeid;
    console.log('countryDialCodeId1---', +countryDialCodeId);
    var countryDialCodeId2 = this.countryDialingCodeList2.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).dialingCodeid;
    console.log('countryDialCodeId2---', +countryDialCodeId2);
    this.organizationForm.controls['code1'].patchValue(countryDialCodeId);
    this.organizationForm.controls['code2'].patchValue(countryDialCodeId2);

  }
  private getFundingOrganization() {
    this.fundingOrganizationService.getFundingOrganizationList().subscribe(data => {

      this.fundingOrganizationList = data;
      //below loop is responsible for patch the data in edit page
      // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
      //   this.organizationForm.controls.fundingAgency.patchValue(organizationdata.fundingAgency);
      // }
      this.fundingOrganizationfilteredOption = this.searchFundingAgency.valueChanges

        .pipe(

          startWith(''),

          map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())

        );

    });
  }
  private filterfundingOrganization(name: string) {

    return this.fundingOrganizationList.filter(fundingOrganization =>

      fundingOrganization.fundingOrganizationName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);

  }


  private getCountryDialingCodes() {
    this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data => {
      this.countryDialingCodeList = data;
      this.getCountryDialingCodes2();
      this.getCountryDialingCodes3();
      this.getCountryDialingCodes4();

      // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
      //   this.organizationForm.controls.code1.patchValue(organizationdata.code1);
      // }
      this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
     
      this.countryDialingCodeFilteredOption = this.searchCode1.valueChanges
        .pipe(
          startWith(''),
          map(code =>
            code ? this.filterCode(code) : this.countryDialingCodeList.slice())
        );
    });
  }

  private filterCode(name: string) {
    return this.countryDialingCodeList.filter(code =>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1
      || (code.dialingCode+'').normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(name.toLowerCase()) !== -1);
  }

  private getCountryDialingCodes2() {
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    // this.countryDialingCodeList2=data;
    //below condition is for patch the value which will show at the edit page for code2
    // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
    //   this.organizationForm.controls.code2.patchValue(organizationdata.code2);
    // }
    //the below line for sorting the list accourding to alphabatic order of country name
    // this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
    if (this.countryDialingCodeList.length > 0) {
      this.countryDialingCodeFilteredOption2 = this.searchCode2.valueChanges
        .pipe(
          startWith(''),
          map(code =>
            code ? this.filterCode2(code) : this.countryDialingCodeList.slice())
        );
    }

    // });
  }
  private filterCode2(name: string) {
    return this.countryDialingCodeList.filter(code =>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1
      || (code.dialingCode+'').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  private getCountryDialingCodes3() {
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    // this.countryDialingCodeList3=data;
    // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
    //   this.organizationForm.controls.tablecode1.patchValue(organizationdata.tablecode1);
    // }
    // this.countryDialingCodeList3.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
    if (this.countryDialingCodeList.length > 0) {
      this.countryDialingCodeFilteredOption3 = this.tableSearchCode1.valueChanges
        .pipe(
          startWith(''),
          map(code =>
            code ? this.filterCode3(code) : this.countryDialingCodeList.slice())
        );
    }
    // });
  }

  private filterCode3(name: string) {
    console.log("name:", name)
    return this.countryDialingCodeList.filter(code =>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1 || (code.dialingCode+'').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  private getCountryDialingCodes4() {
    // this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
    // this.countryDialingCodeList4=data;
    // if(this.EditOrganization=="EditOrganization" || this.ViewMoreOrganization=="ViewMoreOrganization"){
    //   this.organizationForm.controls.tablecode2.patchValue(organizationdata.tablecode2);
    // }
    // this.countryDialingCodeList4.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
    if (this.countryDialingCodeList.length > 0) {
      this.countryDialingCodeFilteredOption4 = this.tableSearchCode2.valueChanges
        .pipe(
          startWith(''),
          map(code =>
            code ? this.filterCode4(code) : this.countryDialingCodeList.slice())
        );
    }

    // });
  }

  private filterCode4(name: string) {
    console.log("name:", name)
    return this.countryDialingCodeList.filter(code =>
      code.countryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  getCountryName() {

    var countryName = this.countryDialingCodeList.find(x => x.dialingCodeid == this.organizationForm.controls.code1.value).countryName;
    var telephhoneCountry = this.organizationForm.controls.code1;
    this.organizationForm.controls.code2.patchValue(telephhoneCountry.value);
    this.enablefax();
    this.organizationForm.controls.country.setValue(this.countryList.find(x => x.country.toLowerCase() == countryName.toLowerCase()).id);
    //if not work change upper line


    // var telephhoneCountry = this.organizationForm.controls.code1;
    // this.organizationForm.controls.code2.patchValue(telephhoneCountry.value);
    // this.organizationForm.controls.country.setValue(this.countryList.find(x => x.countryName.toLowerCase() == event.option.id.toLowerCase()).countryId);
    // console.log(this.organizationForm.value);


  }

  getCountry2Name() {

    var countryName = this.countryDialingCodeList.find(x => x.dialingCodeid == this.organizationForm.controls.code1.value).countryName;
    var telephhoneCountry = this.organizationForm.controls.code1;
    this.organizationForm.controls.code2.patchValue(telephhoneCountry.value);
    this.organizationForm.controls.country2.setValue(this.countryList2.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).countryId);

    // var telephhoneCountry = this.organizationForm.controls.code1;
    // this.organizationForm.controls.code2.patchValue(telephhoneCountry.value);
    // this.organizationForm.controls.country2.setValue(this.countryList2.find(x => x.countryName.toLowerCase() == event.option.id.toLowerCase()).countryId);
    // console.log(this.organizationForm.value);
  }
  getTableCode2() {

    // var countryName= this.countryDialingCodeList3.find(x => x.dialingCodeid == this.organizationForm.controls.tablecode1.value).countryName;
    var tablecode1 = this.organizationForm.controls.tablecode1;
    this.organizationForm.controls.tablecode2.patchValue(tablecode1.value);
    // this.organizationForm.controls.country.setValue(this.countryList.find(x => x.countryName.toLowerCase() == countryName.toLowerCase()).countryId);
  }


  // EditOrganization:any;
  // ViewMoreOrg:any;

  fn: any;
  browserLang: any;
  flag_delete: boolean;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    // console.log("localStorage : ",localStorage.setItem("EditOrganization","reset-EditOrganization"))
    this.flag_delete = true;
    this.getCountryDialingCodes2();
    this.getCountryDialingCodes3();
    this.getCountryDialingCodes4();
    this.getCategory();
    this.getParentCountry();
    this.getCountry();
    this.getFundingOrganization();
    // this.getCityOrganization();
    this.getCountryDialingCodes();
    this.getSaveAsDraftList();


    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    this.EditOrganization = localStorage.getItem("EditOrganization");
    this.ViewMoreOrganization = localStorage.getItem("ViewMoreOrganization");
    console.log("ViewMoreOrganization:" + this.ViewMoreOrganization);
    this.id = this.route.snapshot.paramMap.get("orgId");//
    /* Below is for At View more time we have to get the id from url */
    this.viewByTableId = this.route.snapshot.paramMap.get("viewId");
    this.draftedId = this.route.snapshot.paramMap.get("draftedId");
    this.usergroup = localStorage.getItem('usergroup');
    this.select_options_for_finding_hdn_flag = "true";
    this.select_options_for__country_finding_hdn_flag = "true";
    console.log(" this.select_options_for_finding_hdn_flag---", this.select_options_for_finding_hdn_flag);
    //this.organizationForm = new FormGroup({
    //table formcontrol name
    this.organizationForm = this.fb.group({
      tableData: this.fb.array([
        // this.fb.group({
        //   tableChildOrganization: [''],
        //   tablecode1: [''],
        //   tableTelephone: [''],
        //   tablecode2: [''],
        //   tablefax: [''],
        //   tableEmail: [''],
        //   tablecity: [''],
        //   tableDirection: [''],
        // }),
      ]),


      id: new FormControl(),
      language:new FormControl(''),
      names: new FormControl('', [Validators.required]),
      acronym: new FormControl(),
      category: new FormControl('', [Validators.required]),
      fundingAgency: new FormControl(),
      email: new FormControl(),
      telephone: new FormControl({ value: '', disabled: true }),

      fax: new FormControl({ value: '', disabled: true }),
      direction: new FormControl(),
      code1: new FormControl(''),
      code2: new FormControl(''),
      city: new FormControl(),
      country: new FormControl(),
      country2: new FormControl(),
      multilateralBilateral: new FormControl(''),
      emergingNonemerging: new FormControl(''),
      viewSaveAsDraft: new FormControl(''),
      childOrganizationCheckBox: new FormControl(false),
      //saveAsDraftId: new FormControl('')
    });
    //for envelope n financial agreement organization modal
    if (localStorage.getItem("dataKey") === "Donor") {
      console.log("this.organizationForm--->", this.organizationForm);
      let moduleNm=localStorage.getItem("checkModule");
      if(moduleNm=='Envelope'){
      this.organizationForm.controls['category'].patchValue("5");
      this.organizationForm.controls.category.disable();
    }
      this.modalopen = true;
      this.CategoryChangeAction()
      localStorage.setItem("dataKey", "dataKey-reset");
      this.CategoryChangeAction();
    }

    if(localStorage.getItem("dataKey")==="AddOrganization")
    {
      console.log("this.organizationForm--->",this.organizationForm);
      // this.organizationForm.controls['category'].patchValue("5");
      // this.organizationForm.controls.category.disable();
      this.CategoryChangeAction()
      localStorage.setItem("dataKey","dataKey-reset");
      this.CategoryChangeAction();
    }

    if (localStorage.getItem("dataKey") === "ImplOrg") {
      this.organizationForm.controls['category'].patchValue("2");
      this.organizationForm.controls.category.disable();
      this.modalopen = true;
      this.CategoryChangeAction()
      localStorage.setItem("dataKey", "dataKey-reset");
      this.CategoryChangeAction();
    }




    //edit method starts from here
    // this.EditOrganization = localStorage.getItem("EditOrganization");
    if (this.id != null) {
      this.auto_save_as_draft_flag=false;
      this.id = this.route.snapshot.paramMap.get("orgId");
      console.log("Org Class id" + this.id);
      this.organizationCrudServiceService.editById(this.id)
        .subscribe(
          data => {
            console.log("Organization data : ", data);
            var editData: OrganizationCrudEdit;
            editData = data;
            console.log("editData :", data);
            this.organizationForm.controls.id.patchValue(editData.id);
            this.organizationForm.controls.names.patchValue(editData.names);
            this.organizationForm.controls.acronym.patchValue(editData.acronym);
            if (editData.category != null) {
              this.organizationForm.controls.category.patchValue(editData.category.categoryId);
              this.CategoryChangeAction();
            }

            this.organizationForm.controls.email.patchValue(editData.email);
            this.validateEmail();
            if (editData.code1 != null) {
              this.organizationForm.controls.code1.patchValue(editData.code1.dialingCodeid);
              this.enablephone1();
            }
            if (editData.code2 != null) {
              this.organizationForm.controls.code2.patchValue(editData.code2.dialingCodeid);
              this.enablefax();
            }

            this.organizationForm.controls.telephone.patchValue(editData.telephone);
            this.validatePhone();
            this.organizationForm.controls['fax'].setValue(editData.fax);
            this.validateFax();
            if (editData.category.categoryId == '5') {
              //this.organizationForm.controls.country.patchValue(editData.id);
              this.organizationForm.controls.country.patchValue(Number(editData.country));
            }

            this.organizationForm.controls.direction.patchValue(editData.direction);
            this.organizationForm.controls.city.patchValue(editData.city);

            if (editData.category.categoryId == '1') {
              this.organizationForm.controls.multilateralBilateral.patchValue(editData.multilateralBilateral);
              this.organizationForm.controls.emergingNonemerging.patchValue(editData.emergingNonemerging);
            }
            if (editData.country2 != null) {
              this.organizationForm.controls.country2.patchValue(editData.country2.countryId);
            }



            // this.updateOrganization = "true";
            // this.organizationForm.tableChildOrganization.city.patchValue(editData.city);

            // this.CategoryChangeAction();
            // localStorage.setItem("EditOrganization", "reset-edit-organization");

          },
          error => {
            if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
              Swal.fire(error.error.message, '', 'error');
            }
            else {
              Swal.fire(error.error, '', 'error');
            }
          }
        );

    }


    if (this.viewByTableId != null) {
      this.auto_save_as_draft_flag=false;
      // if (this.ViewMoreOrganization == "ViewMoreOrganization") {
      this.flag_delete = false;
      this.organizationCrudServiceService.editById(this.viewByTableId).subscribe(data => {
        console.log("editById data:", data);
        // console.log("organizationForm", this.organizationForm);
        var editData: OrganizationCrudEdit;
        editData = data;
        this.organizationForm.disable();

        // this.organizationForm.controls.names.patchValue(organizationdata.names);
        // this.organizationForm.controls.acronym.patchValue(organizationdata.acronym);
        // this.organizationForm.controls.category.patchValue(organizationdata.category);
        // // this.organizationForm.controls.fundingAgency.patchValue(organizationdata.fundingAgency);
        // this.organizationForm.controls.multilateralBilateral.patchValue(organizationdata.multilateralBilateral);
        // this.organizationForm.controls.emergingNonemerging.patchValue(organizationdata.emergingNonemerging);
        // this.organizationForm.controls.email.patchValue(organizationdata.email);
        // this.organizationForm.controls.telephone.patchValue(organizationdata.telephone);
        // this.organizationForm.controls.fax.patchValue(organizationdata.fax);
        // this.organizationForm.controls.direction.patchValue(organizationdata.direction);
        // this.organizationForm.controls.city.patchValue(organizationdata.city);
        // this.organizationForm.controls.country.patchValue(organizationdata.country);

        this.organizationForm.controls.id.patchValue(editData.id);
        this.organizationForm.controls.names.patchValue(editData.names);
        this.organizationForm.controls.acronym.patchValue(editData.acronym);
        if (editData.category != null) {
          this.organizationForm.controls.category.patchValue(editData.category.categoryId);
          this.CategoryChangeAction();
        }

        this.organizationForm.controls.email.patchValue(editData.email);
        this.validateEmail();
        if (editData.code1 != null) {
          this.organizationForm.controls.code1.patchValue(editData.code1.dialingCodeid);
          // this.enablephone1();
        }
        if (editData.code2 != null) {
          this.organizationForm.controls.code2.patchValue(editData.code2.dialingCodeid);
          // this.enablefax();
        }
        // this.organizationForm.controls.category.patchValue(editData.category.categoryId);
        // this.CategoryChangeAction();
        // this.organizationForm.controls.email.patchValue(editData.email);
        // if (editData.code1 != null) {
        //   this.organizationForm.controls.code1.patchValue(editData.code1.dialingCodeid);
        // }
        // if (editData.code2 != null) {
        //   this.organizationForm.controls.code2.patchValue(editData.code2.dialingCodeid);
        //   this.organizationForm.controls['fax'].setValue(editData.fax);
        // }

        this.organizationForm.controls.telephone.patchValue(editData.telephone);

        if (editData.category.categoryId == '5') {
          this.organizationForm.controls.country.patchValue(Number(editData.country));
        }

        this.organizationForm.controls.direction.patchValue(editData.direction);
        this.organizationForm.controls.city.patchValue(editData.city);
        if (editData.category.categoryId == '1') {
          this.organizationForm.controls.multilateralBilateral.patchValue(editData.multilateralBilateral);
          this.organizationForm.controls.emergingNonemerging.patchValue(editData.emergingNonemerging);
        }

        if (editData.country2 != null) {
          this.organizationForm.controls.country2.patchValue(editData.country2.countryId);
        }



        // this.CategoryChangeAction();



        // localStorage.setItem("ViewMoreOrganization", "reset-view-organization");

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


    if (this.draftedId != null) {
      this.auto_save_as_draft_flag=false;
      // if (this.ViewMoreOrganization == "ViewMoreOrganization") {
      this.flag_delete = false;
      this.organizationCrudServiceService.editById(this.draftedId).subscribe(data => {
        console.log("editById data:", data);
        // console.log("organizationForm", this.organizationForm);
        var editData: OrganizationCrudEdit;
        editData = data;
        this.organizationForm.disable();
        this.organizationForm.controls.id.patchValue(editData.id);
        this.organizationForm.controls.names.patchValue(editData.names);
        this.organizationForm.controls.acronym.patchValue(editData.acronym);
        if (editData.category != null) {
          this.organizationForm.controls.category.patchValue(editData.category.categoryId);
          this.CategoryChangeAction();
        }

        this.organizationForm.controls.email.patchValue(editData.email);
        this.validateEmail();
        if (editData.code1 != null) {
          this.organizationForm.controls.code1.patchValue(editData.code1.dialingCodeid);
          // this.enablephone1();
        }
        if (editData.code2 != null) {
          this.organizationForm.controls.code2.patchValue(editData.code2.dialingCodeid);
        }
        this.organizationForm.controls.telephone.patchValue(editData.telephone);

        if (editData.category.categoryId == '5') {
          this.organizationForm.controls.country.patchValue(Number(editData.country));
        }

        this.organizationForm.controls.direction.patchValue(editData.direction);
        this.organizationForm.controls.city.patchValue(editData.city);
        if (editData.category.categoryId == '1') {
          this.organizationForm.controls.multilateralBilateral.patchValue(editData.multilateralBilateral);
          this.organizationForm.controls.emergingNonemerging.patchValue(editData.emergingNonemerging);
        }

        if (editData.country2 != null) {
          this.organizationForm.controls.country2.patchValue(editData.country2.countryId);
        }
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

    this.filteredOptions = this.organizationForm.controls['fundingAgency'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filteragency(value))
      );

    this.countryfilteredOptions = this.country.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCountry(value))
      );
  }
  ngOnDestroy() {
    if(this.auto_save_as_draft_flag==true){
      this.autoSaveOrganizationDraft();
    }
    document.removeEventListener('keydown', this.fn);
  }
  private _filteragency(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.fundingAgencyOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countryoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.organizationForm.controls[controlName].hasError(errorName);
  }

  public createOrganization = (organizationFormValue) => {
    if (this.organizationForm.valid) {
      this.executeOrganizationCreation(organizationFormValue);
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Organization'){
        this.authorised_flag=true;
      }
    }
  }

  private executeOrganizationCreation = (organizationFormValue) => {
    let organization: Organization = {
      id:"",
      names: organizationFormValue.name,
      acronym: organizationFormValue.nickname,
      category: organizationFormValue.post,
      fundingAgency: organizationFormValue.fundingAgency,
      email: organizationFormValue.email,
      telephone: organizationFormValue.telephone,
      // code2: organizationFormValue.code2,
      fax: organizationFormValue.fax,
      direction: organizationFormValue.address,
      city: organizationFormValue.city,
      country: organizationFormValue.country,
      multilateralBilateral: organizationFormValue.multilateralBilateral,
      emergingNonemerging: organizationFormValue.emergingNonemerging,
      position: organizationFormValue.position

    }
  }
  orgList = ['Child organization', 'Code', 'Telephone', 'Code2', 'Fax', 'email', 'City', 'Address']
  tableHdnFlag = false;
  CategoryChangeAction() {
    let category = this.organizationForm.controls['category'].value;
    console.log("Category:", category)
    if (category == 1) {
      this.organizationForm.controls.country2.reset();
      //  this.organizationForm.controls.tableChildOrganization.reset();
      //  this.organizationForm.controls.tablecode1.reset();
      //  this.organizationForm.controls.tableTelephone.reset();
      //  this.organizationForm.controls.tablecode2.reset();
      //  this.organizationForm.controls.tablefax.reset();
      //  this.organizationForm.controls.tableEmail.reset();
      //  this.organizationForm.controls.tablecity.reset();
      //  this.organizationForm.controls.tableDirection.reset();



      // this.organizationForm.controls['acronym'].reset();
      // this.organizationForm.controls['multilateralBilateral'].reset();
      // this.organizationForm.controls['emergingNonemerging'].reset();
      // this.organizationForm.controls['code1'].reset();
      // this.organizationForm.controls['telephone'].reset();
      // this.organizationForm.controls['code2'].reset();
      // this.organizationForm.controls['fax'].reset();
      // this.organizationForm.controls['email'].reset();
      // this.organizationForm.controls['city'].reset();
      // this.organizationForm.controls['direction'].reset();


      this.organizationForm.controls['fundingAgency'].reset();
      this.tableHdnFlag = false;
      this.funding_organization_hdn_flag = "true";
      this.hideCodeToAddressFlag = true;
      this.country_of_parent_organization_hdn_flag = "true";
      this.select_options_for_finding_hdn_flag = "false";
      this.select_options_for__country_finding_hdn_flag = "true";
      this.donor_and_funding_organization_mandatory_flag = false;
      // this.organizationForm.controls['fundingAgency'].setValidators([Validators.required]);
      this.organizationForm.controls['names'].setValidators([Validators.required]);
      this.organizationForm.controls['multilateralBilateral'].setValidators([Validators.required]);
      this.organizationForm.controls['emergingNonemerging'].setValidators([Validators.required]);

    }
    if (category == 2 || category == 3 || category == 4) {

      this.organizationForm.controls.multilateralBilateral.reset();
      this.organizationForm.controls.emergingNonemerging.reset();

      // // this.organizationForm.controls.country2.reset();

      this.organizationForm.controls.country.reset();
      this.organizationForm.controls.code1.reset();
      this.organizationForm.controls.code2.reset();
      // this.organizationForm.controls.tableChildOrganization.reset();
      // this.organizationForm.controls.tablecode1.reset();
      // this.organizationForm.controls.tableTelephone.reset();
      // this.organizationForm.controls.tablecode2.reset();
      // this.organizationForm.controls.tablefax.reset();
      // this.organizationForm.controls.tableEmail.reset();
      // this.organizationForm.controls.tablecity.reset();
      // this.organizationForm.controls.tableDirection.reset();




      // this.organizationForm.controls['country2'].reset();
      this.tableHdnFlag = false;
      this.funding_organization_hdn_flag = "true";
      this.hideCodeToAddressFlag = true;
      this.country_of_parent_organization_hdn_flag = "true";
      this.select_options_for_finding_hdn_flag = "true";
      this.select_options_for__country_finding_hdn_flag = "false";
      this.donor_and_funding_organization_mandatory_flag = true;
      // this.organizationForm.controls['fundingAgency'].clearValidators();
      // this.organizationForm.controls['fundingAgency'].setErrors({'required':false});
      // this.organizationForm.controls['fundingAgency'].updateValueAndValidity();

      this.organizationForm.controls['multilateralBilateral'].clearValidators();
      this.organizationForm.controls['multilateralBilateral'].setErrors({ 'required': false })
      this.organizationForm.controls['multilateralBilateral'].updateValueAndValidity();

      this.organizationForm.controls['emergingNonemerging'].clearValidators();
      this.organizationForm.controls['emergingNonemerging'].setErrors({ 'required': false })
      this.organizationForm.controls['emergingNonemerging'].updateValueAndValidity();
    }
    if (category == 5) {
      this.organizationForm.controls.country2.reset();
      this.organizationForm.controls.code1.reset();
      this.organizationForm.controls.code2.reset();
      this.organizationForm.controls.multilateralBilateral.reset();
      this.organizationForm.controls.emergingNonemerging.reset();

      //  this.organizationForm.controls.country2.reset();
      // //  this.organizationForm.controls.country.reset();
      //  this.organizationForm.controls.tableChildOrganization.reset();
      //  this.organizationForm.controls.tablecode1.reset();
      //  this.organizationForm.controls.tableTelephone.reset();
      //  this.organizationForm.controls.tablecode2.reset();
      //  this.organizationForm.controls.tablefax.reset();
      // this.organizationForm.controls.tableEmail.reset();
      // this.organizationForm.controls.tablecity.reset();
      // this.organizationForm.controls.tableDirection.reset();




      this.organizationForm.controls['fundingAgency'].reset();
      this.tableHdnFlag = false;
      this.funding_organization_hdn_flag = "true";
      this.hideCodeToAddressFlag = true;
      this.country_of_parent_organization_hdn_flag = "false";
      this.select_options_for_finding_hdn_flag = "true";
      this.select_options_for__country_finding_hdn_flag = "true";
      this.donor_and_funding_organization_mandatory_flag = true;
      this.donor_and_funding_organization_mandatory_flag = true;
      this.donor_and_funding_organization_mandatory_flag = false;
      // this.organizationForm.controls['fundingAgency'].setValidators([Validators.required]);

      this.organizationForm.controls['multilateralBilateral'].clearValidators();
      this.organizationForm.controls['multilateralBilateral'].setErrors({ 'required': false })
      this.organizationForm.controls['multilateralBilateral'].updateValueAndValidity();

      this.organizationForm.controls['emergingNonemerging'].clearValidators();
      this.organizationForm.controls['emergingNonemerging'].setErrors({ 'required': false })
      this.organizationForm.controls['emergingNonemerging'].updateValueAndValidity();
    }
    if (category == 6) {

      // this.organizationForm.controls.names.reset();
      // this.organizationForm.controls.acronym.reset();
      this.organizationForm.controls.multilateralBilateral.reset();
      this.organizationForm.controls.emergingNonemerging.reset();
      // this.organizationForm.controls.code1.reset();
      // this.organizationForm.controls.telephone.reset();
      // this.organizationForm.controls.code2.reset();
      // this.organizationForm.controls.fax.reset();
      // this.organizationForm.controls.email.reset();
      // this.organizationForm.controls.city.reset();
      // this.organizationForm.controls.direction.reset();
      // this.organizationForm.controls.country2.reset();
      this.organizationForm.controls.country.reset();




      // this.tableHdnFlag=true;
      // this.getCountryDialingCodes();
      this.funding_organization_hdn_flag = "true";
      this.hideCodeToAddressFlag = true;
      this.country_of_parent_organization_hdn_flag = "true";
      this.select_options_for_finding_hdn_flag = "true";
      this.select_options_for__country_finding_hdn_flag = "true";
      this.donor_and_funding_organization_mandatory_flag = true;

      this.donor_and_funding_organization_mandatory_flag = true;
      // this.organizationForm.controls['fundingAgency'].clearValidators();
      // this.organizationForm.controls['fundingAgency'].setErrors({'required':false});
      // this.organizationForm.controls['fundingAgency'].updateValueAndValidity();

      this.organizationForm.controls['multilateralBilateral'].clearValidators();
      this.organizationForm.controls['multilateralBilateral'].setErrors({ 'required': false })
      this.organizationForm.controls['multilateralBilateral'].updateValueAndValidity();

      this.organizationForm.controls['emergingNonemerging'].clearValidators();
      this.organizationForm.controls['emergingNonemerging'].setErrors({ 'required': false })
      this.organizationForm.controls['emergingNonemerging'].updateValueAndValidity();
    }
    // else  {

    //   this.select_options_for_finding_hdn_flag = "true";
    //   this.select_options_for__country_finding_hdn_flag = "false";
    //   this.donor_and_funding_organization_mandatory_flag = true;

    // }

  }

  autoSadEnable(){
    this.auto_save_as_draft_flag=true;
  }
  showHideTable(ob: MatCheckboxChange) {
    if (ob.checked) {
      this.addRow();
      this.tableHdnFlag = true;
    }
    else {
      (this.organizationForm.get('tableData') as FormArray).clear();
      this.tableHdnFlag = false;
    }
  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  saveOrganization() {
    this.getValueByLang()
    let fundingOrgNm = this.organizationForm.controls.names.value;
    console.log("nmm ", fundingOrgNm)
    localStorage.setItem("fundingOrgNm", fundingOrgNm);
    localStorage.setItem("implOrgNm", fundingOrgNm);
   this.organizationForm.controls.language.setValue(this.browserLang)
    console.log("all data ",JSON.stringify(this.organizationForm.getRawValue()))
    this.organizationCrudServiceService.saveOrganizationCurd(this.organizationForm.getRawValue()).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      localStorage.setItem("fundingOrgNmId", data.toString());
      localStorage.setItem("implOrgId", data.toString());
      if(this.browserLang=='en')
      Swal.fire('Submitted successfully', '', 'success');
      else
      Swal.fire('Submetido com sucesso', '', 'success');
      this.organizationSaveAlert();
      if (this.modalopen == true) {
        const dialogRef = this.dialog.closeAll(
        );
        console.log("getNmId ", localStorage.getItem("fundingOrgNmId"));
        let moduleNm= localStorage.getItem("checkModule");
        if(moduleNm =='Envelope'){
          this.router.navigate(['/admin/envelope']);
        }else if(moduleNm=='Individual'){
          this.router.navigate(['/admin/individual']);
        }else if(moduleNm=='Project'){
          this.router.navigate(['/admin/project']);
        }
        
        
      } else {
        this.moveToViewOrganizationTab();
      }
    },
      error => console.log(error));
  }
  // moveToViewTab(){
  //   this.router.navigate(['/admin/view-individual']);
  // }
  moveToViewOrganizationTab() {

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-organization']));


  }
  //provide exact alert msg for which field is invalid format
  openMandatoryAlert() {
    this.getValueByLang()
    console.log(this.organizationForm.getRawValue());
    if (this.check_phone_flag == false) {
    if(this.browserLang=='en')
      Swal.fire('Phone number is invalid.')
      else
      Swal.fire('O número de telefone é inválido.')
    }
    else if (this.check_fax_flag == false) {
      if(this.browserLang=='en')
      Swal.fire('Fax number is invalid.')
      else
      Swal.fire('O número de fax é inválido.')
    }
    else if (this.check_email_flag == false) {
      if(this.browserLang=='en')
      Swal.fire('Email is in invalid format.')
      else
      Swal.fire('O e-mail está num formato inválido.')
    }
    else {
      if(this.browserLang=='en')
      Swal.fire('Please fill all mandatory fields.')
      else
      Swal.fire('Por favor preencha todos os campos obrigatórios.')
    }

  }

  changeOrganization(){
    this.auto_save_as_draft_flag=true;
  }

  //for notification alert, execute on update individual
  organizationSaveAlert() {
    let todayTime = new Date();
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.userGroupForNotificationAlert;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has update individual on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Organization Reference ID "'
      +this.organizationForm.controls['names'].value
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Organization Reference ID "'
      +this.organizationForm.controls['names'].value
      +'" has been created by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-organization\\';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
  }

  //for notification alert, execute on update individual
  organizationUpdateAlert() {
    let todayTime = new Date();
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.userGroupForNotificationAlert;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has update individual on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Organization Reference ID "'
      +this.organizationForm.controls['names'].value
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Organization Name "'
      +this.organizationForm.controls['names'].value
      +'" with Reference ID "'
      +this.organizationForm.controls['acronym'].value
      +'" has been edited by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-organization\\'+this.id;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToViewTab();
  }
  moveToViewTab() {
    this.router.navigate(['/admin/view-organization']);
  }
  moveToOrganizationTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-organization']));
  }
  //update method for organization data update
  updateOrganizationDetails() {
    console.log("inside Organization update  method");
    this.getValueByLang()
    this.organizationCrudServiceService.updateOrganizationDetails(this.organizationForm.value).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      console.log("inside Organization update subscribe  method");
      if(this.browserLang=='en')
      Swal.fire('Updated successfully', '', 'success');
      else
      Swal.fire('Actualizado com sucesso', '', 'success');
      this.organizationUpdateAlert();
    },
      error => console.log(error));
  }
  draftfilteredOption: Observable<any[]>;
  searchDraft= new FormControl('');
  /* Here we call service to get all save as draft values that will be present in db */
  getSaveAsDraftList() {
    this.organizationCrudServiceService.getOrganizationDraftList().subscribe(data => {
      console.log("data.length:" + data.length);
      /* Below condition is for to check data present or not in db */
      if (data.length > 0) {
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
      }
    });
  }
  private filterDraftData(name: string) {
    return this.saveAsDraftList.filter(data =>
      data.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  checkDraft() {
    // console.log("saveAsDraftList : ",this.saveAsDraftList.length)
    this.getValueByLang()
    if (this.saveAsDraftList.length == 0) {
      if(this.browserLang=='en')
      Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
      else
      Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error')
    }
  }


  draftValue(e) {
    this.auto_save_as_draft_flag=false;
    this.getValueByLang()
    console.log("Inside DraftValue()" + e.value);
    this.organizationCrudServiceService.getOrganizationDraftList().subscribe(data => {
      /* Below condition is for to check data present or not in db */
      if (data.length == 0) {
        if(this.browserLang=='en')
        Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
        else
        Swal.fire('Nenhum dado presente dentro da vista Salvar como rascunho', '', 'error')

      } else {
        this.saveAsDraftList = data;
      }
    });
    // let id = this.organizationForm.controls['saveAsDraftId'].value;
    let id = e.value;
    console.log("draft Id:", id);
    this.organizationCrudServiceService.patchOrganizationDraftValue(id).subscribe(data => {
      // this.draftData = data;
      // console.log("draftdata Patch:",this.draftData);
      var editData: OrganizationCrudEdit;
      console.log("data:" + data);
      editData = data[0];
      console.log("editData :", data[0]);
      console.log("editData.id:" + editData.id);
      this.organizationForm.controls['id'].patchValue(editData.id);
      //this.organizationForm.controls.id.patchValue(editData.id);
      this.organizationForm.controls['names'].patchValue(editData.names);

      //this.organizationForm.controls.names.patchValue(editData.names);
      this.organizationForm.controls['acronym'].patchValue(editData.acronym);
      //this.organizationForm.controls.acronym.patchValue(editData.acronym);
      if (editData.category != null) {
        this.organizationForm.controls['category'].patchValue(editData.category.categoryId);
        this.CategoryChangeAction();
      }

      this.organizationForm.controls['email'].patchValue(editData.email);
      this.validateEmail();
      if (editData.code1 != null) {
        this.organizationForm.controls['code1'].patchValue(editData.code1.dialingCodeid);
        this.enablephone1();
      }

      if (editData.code2 != null) {
        this.organizationForm.controls['code2'].patchValue(editData.code2.dialingCodeid);
        this.enablefax();
      }

      if (editData.country2 != null) {
        this.organizationForm.controls['country2'].patchValue(editData.country2.countryId);
      }
      this.organizationForm.controls['telephone'].patchValue(editData.telephone);
      this.validatePhone();
      this.organizationForm.controls['fax'].setValue(editData.fax);
      this.validateFax();
      if (editData.category.categoryId == '5') {
        this.organizationForm.controls['country'].patchValue(Number(editData.country));
      }

      this.organizationForm.controls['direction'].patchValue(editData.direction);
      this.organizationForm.controls['city'].patchValue(editData.city);

      // if(editData.category.categoryId == '1'){
      // if(this.organizationForm.controls.multilateralBilateral!=null){
      if (editData.multilateralBilateral != null && editData.multilateralBilateral != '') {
        this.organizationForm.controls['multilateralBilateral'].patchValue(editData.multilateralBilateral);
      }
      if (editData.emergingNonemerging != null && editData.emergingNonemerging != '') {
        this.organizationForm.controls['emergingNonemerging'].patchValue(editData.emergingNonemerging);
      }

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


  saveOrganizationDraft() {
    console.log(this.organizationForm.value)
    this.getValueByLang()
    if (this.organizationForm.controls['viewSaveAsDraft'].value != null) {
      console.log("this.organizationForm.controls['viewSaveAsDraft'].value:" + this.organizationForm.controls['viewSaveAsDraft'].value);
      this.organizationForm.controls['id'].patchValue(this.organizationForm.controls['viewSaveAsDraft'].value);
    }
    this.organizationCrudServiceService.saveOrganizationDraft(this.organizationForm.getRawValue()).subscribe(data => {
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Organization data saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados da Organização salvos como Rascunho com sucesso', '', 'success');
      this.moveToSelectTab();
      // this.chkDraft();

    },
      // error => {
      //   if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
      //     Swal.fire(error.error.message, '', 'error');
      //   } else {
      //     Swal.fire(error.error, '', 'error');
      //   }
      // });
      error => console.log(error));
  }
  autoSaveOrganizationDraft() {
    console.log(this.organizationForm.value)
    this.getValueByLang()
    if (this.organizationForm.controls['viewSaveAsDraft'].value != null) {
      console.log("this.organizationForm.controls['viewSaveAsDraft'].value:" + this.organizationForm.controls['viewSaveAsDraft'].value);
      this.organizationForm.controls['id'].patchValue(this.organizationForm.controls['viewSaveAsDraft'].value);
    }
    this.organizationCrudServiceService.saveOrganizationDraft(this.organizationForm.getRawValue()).subscribe(data => {
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Organization data saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados da Organização salvos como Rascunho com sucesso', '', 'success');
      // this.chkDraft();

    },
      // error => {
      //   if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
      //     Swal.fire(error.error.message, '', 'error');
      //   } else {
      //     Swal.fire(error.error, '', 'error');
      //   }
      // });
      error => console.log(error));
  }
  moveToSelectTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/organization']));
  }
  opensweetalert() {
    console.log(this.organizationForm.getRawValue());
    this.getValueByLang()
    let telephone_code: string = this.organizationForm.controls.code1.value;
    let telephone_number: string = this.organizationForm.controls.telephone.value;
    let fax_code: string = this.organizationForm.controls.code2.value;
    let fax_number: string = this.organizationForm.controls.fax.value;
    if ((telephone_code != null && telephone_code != "") && (telephone_number == null || telephone_number == "")) {
     if(this.browserLang=='en')
      Swal.fire('Please provide Telephone number', '', 'info');
      else
      Swal.fire('Por favor preencha o número de telefone', '', 'info');
    } else if ((fax_code != null && fax_code != "") && (fax_number == null || fax_number == "")) {
      if(this.browserLang=='en')
      Swal.fire('Please provide Fax number', '', 'info');
      else
      Swal.fire('Por favor preencha o número de fax', '', 'info');
    } else{
      
    // else if((this.organizationForm.controls.childOrganizationCheckBox.value && this.validateTableData()) || !this.organizationForm.controls.childOrganizationCheckBox.value){
      console.log("JSON DATA ON SUBMIT", this.organizationForm.getRawValue())
      Swal.fire({
        title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
        denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
      }).then((result) => {


        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          console.log(" inside sweetalert organization ts submit  ");
          this.saveOrganization();


        } else if (result.isDenied) {
          if(this.browserLang=='en')
          Swal.fire('Cancelled', '', 'info')
          else
          Swal.fire('Cancelado', '', 'info')
        }
      }) 
    }
    // }
  }

  //method to validate child org tabledata
  validateTableData():boolean{
    let result:boolean = false; // if validation passes the returns true otherwise false
      let tableLength = (this.organizationForm.controls.tableData as FormArray).length;
      this.getValueByLang()
      //ittirate all row and check data valid or not in each row
      for(let i = 0; i < tableLength; i++)
      {
        // ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tableTelephone.value;
        let eachRowData: FormGroup = ((this.organizationForm.controls.tableData as FormArray).at(i) as FormGroup);
        // console.log(eachRowData);
        let currentRowTelCode:string = eachRowData.controls.tablecode1.value;
        let currentRowTelNo:string = eachRowData.controls.tableTelephone.value;
        let currentRowFaxcode: string = eachRowData.controls.tablecode2.value;
        let currentRowfaxNo: string = eachRowData.controls.tablefax.value;
        //check validation and if fail then show message in pop up
        if( (currentRowTelCode != null && currentRowTelCode != "") && (currentRowTelNo == null || currentRowTelNo == "")){
         if(this.browserLang=='en')
          Swal.fire('Please provide Telephone number', '', 'info');
          else
          Swal.fire('Por favor, forneça o número de telefone', '', 'info');
          result = false;
          break;
        }else if(this.table_phone_valid[i]==false && this.tablePhoneMessageBlank[i]==false){
          if(this.browserLang=='en')
          Swal.fire('Phone number is invalid.', '', 'error');
          else
          Swal.fire('O número de telefone é inválido.', '', 'error');
          result = false;
          break;
        }else if( (currentRowFaxcode != null && currentRowFaxcode != "") && (currentRowfaxNo == null || currentRowfaxNo == "")){
          if(this.browserLang=='en')
          Swal.fire('Please provide Fax number.', '', 'info');
          else
          Swal.fire('Forneça o número do fax.', '', 'info');
          result = false;
          break;
        }else if(this.table_fax_valid[i]==false && this.tableFaxMessageBlank[i]==false){
          if(this.browserLang=='en')
          Swal.fire('Fax number is invalid.', '', 'error');
          else
          Swal.fire('O número de fax é inválido.', '', 'error');
          result = false;
          break;
        }else if(this.table_email_valid[i]==false && this.tableEmailMessageBlank[i]==false){
          if(this.browserLang=='en')
          Swal.fire('Email is in invalid format.', '', 'error');
          else
          Swal.fire('O e-mail está num formato inválido.', '', 'error');
          result = false;
          break;
        }else{
          result = true;
        }
      }
    return result;
  }


  opensweetalert2() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to save as Draft?':'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')?  `Save`:'Salve',
      denyButtonText: (this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //this.organizationdata.id = this.organizationDraftId;
        //this.organizationDraftId = "";
        this.saveOrganizationDraft();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }



  opensweetalertUpdate() {
    this.getValueByLang()
    let telephone_code: string = this.organizationForm.controls.code1.value;
    let telephone_number: string = this.organizationForm.controls.telephone.value;
    let fax_code: string = this.organizationForm.controls.code2.value;
    let fax_number: string = this.organizationForm.controls.fax.value;
    if ((telephone_code != null && telephone_code != "") && (telephone_number == null || telephone_number == "")) {
     if(this.browserLang=='en')
      Swal.fire('Please provide Telephone number', '', 'info');
      else
      Swal.fire('Por favor, forneça o número de telefone', '', 'info');
    } else if ((fax_code != null && fax_code != "") && (fax_number == null || fax_number == "")) {
      if(this.browserLang=='en')
      Swal.fire('Please provide Fax number', '', 'info');
      else
      Swal.fire('Forneça o número do fax', '', 'info');
    } else{
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to Update?':'Deseja Actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("inside update organization  ");
        this.updateOrganizationDetails();
        // Swal.fire('Updated Successfully!', '', 'success')
        // this.moveToViewTab();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  }


  enablephone1() {

    this.code1Validate = this.organizationForm.controls['code1'].value
    if (this.code1Validate != null && this.code1Validate != '' && this.code1Validate != undefined) {
      this.organizationForm.controls['telephone'].enable();


    }
    //   else{
    //   Swal.fire({
    //     title: 'Kindly Select Phone Code',
    //   confirmButtonText: `OK`,
    //     })
    // }
  }
  enablefax() {
    this.auto_save_as_draft_flag=true;
    this.code2Validate = this.organizationForm.controls['code2'].value
    if (this.code2Validate != null && this.code2Validate != '' && this.code2Validate != undefined) {
      this.organizationForm.controls['fax'].enable();


    }
    //   else{
    //   Swal.fire({
    //     title: 'Kindly Select Phone Code',
    //   confirmButtonText: `OK`,
    //     })
    // }
  }

  emailMessage = '';
  validateEmail() {
    var email = this.organizationForm.controls['email'].value;

    if (email != null) {
      if (email.trim().length == 0) {
        this.check_email_flag = true;
        this.emailMessage = ' '
      } else {
        var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
        if (!expr.test(email)) {
          //console.log( "Invalid email address.");
          this.check_email_flag = false;//for invalid email
          this.check_email1_flag = true;//for valid
        }
        else {
          // console.log( "valid.");
          this.check_email_flag = true;//for invalid email
          this.check_email1_flag = false;//for valid
          this.emailMessage = 'not show'
        }
      }
    }

  }

  validateTableEmail(index: number) {
    var email = ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tableEmail.value;
    if (email == null || email == "") {
      this.table_email_valid[index] = false;
      this.tableEmailMessageBlank[index] = true;
    }
    else {
      this.tableEmailMessageBlank[index] = false;
      var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
      if (!expr.test(email)) {
        console.log("Invalid Email ......");
        this.table_email_valid[index] = false;
      }
      else {
        console.log("Valid Email ......");
        this.table_email_valid[index] = true;
      }
    }
  }
  check_fax_flag = true;
  check_fax1_flag = true;
  faxMessageBlank: boolean = true;
  validateFax() {
    var fax: string = this.organizationForm.controls['fax'].value;

    if (fax == null || fax == "") {
      this.check_fax_flag = true;
      this.faxMessageBlank = true;
    }
    else {

      var expr = /^\s*\d{8,9}\s*$/;
      if (!expr.test(fax)) {
        console.log("Invalid FAX ......");
        this.check_fax_flag = false;//for invalid phone
        // this.check_fax1_flag=true;//for valid
        this.faxMessageBlank = false;
      }
      else {
        console.log("valid.....");
        this.check_fax_flag = true;//for invalid phone
        // this.check_fax1_flag=false;//for valid
        this.faxMessageBlank = false;
      }
    }

  }

  faxTableMessage: any;
  validateTableFax(index: number) {
    var fax: string = ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tablefax.value;

    if (fax == null || fax == "") {
      this.table_fax_valid[index] = false;
      this.tableFaxMessageBlank[index] = true;
    }
    else {
      this.tableFaxMessageBlank[index] = false;
      var expr = /^\s*\d{9,10}\s*$/;
      if (!expr.test(fax)) {
        console.log("Invalid FAX ......");
        this.table_fax_valid[index] = false;
      }
      else {
        console.log("valid.....");
        this.table_fax_valid[index] = true;
      }
    }

  }


  phoneMessageBlank: boolean = true;
  validatePhone() {
    let phone: string = this.organizationForm.controls.telephone.value;
    console.log("phone :", phone);
    if (phone == null || phone == "") {
      this.check_phone_flag = true;
      this.phoneMessageBlank = true;
    }
    else {

      var expr = /^\s*\d{8,9}\s*$/;
      if (!expr.test(phone)) {
        console.log("Invalid phone ......");
        this.check_phone_flag = false;//for invalid phone
        // this.check_phone1_flag=true;//for valid
        this.phoneMessageBlank = false;
      }
      else {
        console.log("valid.....");
        this.check_phone_flag = true;//for invalid phone
        // this.check_phone1_flag=false;//for valid
        this.phoneMessageBlank = false;
      }
    }

  }
  //phone no validation for table phone no
  phoneTableMessage = '';
  validateTablePhone(index: number) {
    let phone: string = ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tableTelephone.value;
    console.log("phone :", phone);
    if (phone == null || phone == "") {
      // this.check_phone_flag=true;
      // this.phoneMessageBlank=true;
      this.table_phone_valid[index] = false;
      this.tablePhoneMessageBlank[index] = true;
    }
    else {
      this.tablePhoneMessageBlank[index] = false;
      var expr = /^\s*\d{9,10}\s*$/;
      if (!expr.test(phone)) {
        console.log("Invalid phone ......");
        this.table_phone_valid[index] = false;
      }
      else {
        console.log("valid.....");
        this.table_phone_valid[index] = true;
      }
    }
  }

  //to reset the entered data
  clearForm(form: FormGroup) {
    if(this.modalopen== true){
      this.validatePhone();
      this.validateFax();
      this.validateEmail();
     
      this.organizationForm.controls.names.reset();
      this.organizationForm.controls.acronym.reset();
      this.organizationForm.controls.telephone.reset();
      
      this.organizationForm.controls.fax.reset();
      this.organizationForm.controls.city.reset();
      this.organizationForm.controls.country.reset();
      this.organizationForm.controls.code1.reset();
      this.organizationForm.controls['telephone'].disable();
      this.organizationForm.controls.code2.reset();
      this.organizationForm.controls.fax.disable();
      this.organizationForm.controls.email.reset();
      this.organizationForm.controls.direction.reset();

    }
    else {
      form.reset();
      this.organizationForm.controls.telephone.disable();
      this.organizationForm.controls.fax.disable();
    }
  }

  moveToSelectedTabEdit() {
    let id: any = this.organizationForm.controls.id.value;
    // localStorage.setItem("EditOrganization", "EditOrganization");

    // console.log("editenv inside view--->", localStorage.getItem("EditOrganization"));


    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-organization', id]));

    console.log("after route");

  }






  get dateFormArray(): FormArray {
    return this.organizationForm.get('tableData') as FormArray;
  }
  public addRow(): void {

    const row = this.fb.group({

      tableChildOrganization: ['', Validators.required],
      tablecode1: [''],
      tableTelephone: [{value:'',disabled:true}],
      tablecode2: [''],
      tablefax: [{value:'',disabled:true}],
      tableEmail: [''],
      tablecity: [''],
      tableDirection: [''],


    });
    this.dateFormArray.push(row);
    this.table_phone_valid.push(false);
    this.tablePhoneMessageBlank.push(true);
    this.table_fax_valid.push(false);
    this.tableFaxMessageBlank.push(true);
    this.table_email_valid.push(false);
    this.tableEmailMessageBlank.push(true);
  }
  deleteRow(index: number) {
    this.dateFormArray.removeAt(index);
    this.table_phone_valid.splice(index, 1);
    this.tablePhoneMessageBlank.splice(index, 1);
    this.table_fax_valid.splice(index, 1);
    this.tableFaxMessageBlank.splice(index, 1);
    this.table_email_valid.splice(index, 1);
    this.tableEmailMessageBlank.splice(index, 1);
  }
  searchCode1 = new FormControl();
  searchCode2 = new FormControl();
  searchCountry2 = new FormControl();
  searchCountry1 = new FormControl();
  searchFundingAgency = new FormControl();
  tableSearchCode1 = new FormControl();
  tableSearchCode2 = new FormControl();

  table_fax_valid: boolean[] = [];
  tableFaxMessageBlank: boolean[] = [];
  table_phone_valid: boolean[] = [];
  tablePhoneMessageBlank: boolean[] = [];
  table_email_valid: boolean[] = [];
  tableEmailMessageBlank: boolean[] = [];

  selectTableFax(index:number){
    let selectedCountryDailCode = ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tablecode1.value;
    ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tablecode2.patchValue(selectedCountryDailCode);
    this.enableTableFax(index);
  }
  enableTableTelephone(index:number){
    ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tableTelephone.enable();    
  }
  enableTableFax(index:number){
    ((this.organizationForm.controls.tableData as FormArray).at(index) as FormGroup).controls.tablefax.enable();
  }
  allowNumbersOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getCategoryByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }

  publish() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Publish?':'Deseja Publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Publish`:'Publicar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id:number[] = [this.draftedId];
        if (id.length > 0) {
          this.organizationCrudServiceService.publishOrganizationById(id).subscribe(data => {
            (this.browserLang=='en')?
             Swal.fire('Published successfully', '', 'success'): Swal.fire('Publicado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-organization']);
            });
          },
            error => console.log(error));
        }
      } 
    });
  }
  discard() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Discard?':'Deseja Descartar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')? `Discard`:'Descartar',
      denyButtonText:(this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id:number[] = [this.draftedId];
        if (id.length > 0) {
          this.organizationCrudServiceService.discardOrganizationById(id).subscribe(data => {
            (this.browserLang=='en')?Swal.fire('Discarded successfully', '', 'success'):
            Swal.fire('Descartado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-organization']);
            });
          },
            error => console.log(error));
        }
      } 
    });
  }
  clearPhone(){
this.organizationForm.controls.telephone.setValue('');
this.organizationForm.controls.code1.setValue('');
this.phoneMessageBlank=true;
this.organizationForm.controls.telephone.disable();
  }
  clearFax(){
this.organizationForm.controls.fax.setValue('');
this.organizationForm.controls.code2.setValue('');
this.faxMessageBlank=true;
this.organizationForm.controls.fax.disable();
  }
  goBack(){
    this.router.navigate(['/admin/view-drafted-organization']);
  }
}


export interface OrganizationCrudEdit {
  id: number;
  names: string;
  acronym: string;
  category: Category;
  telephone: string;
  direction: string;
  email: string;
  fax: string;
  city: string;
  multilateralBilateral: string;
  emergingNonemerging: string;
  country: number;

  code1: Code1OrCode2OrCode3;
  code2: Code1OrCode2OrCode3;


  country2: CountryEdit;


  childOrganization: string;
  tableEmail: string;
  tablecode1: string;
  tableTelephone: string;
  tablecode2: string;
  tablefax: string;
  tablecity: string;
  tableDirection: string;





  status: string;
  creadtedOn: string;
  timeStramp: string;
}

export interface Category {
  categoryId: string;
  categoryNameEn: string;
  categoryNamePt: string;
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






