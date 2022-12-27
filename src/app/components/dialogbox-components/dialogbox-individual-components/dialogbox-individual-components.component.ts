import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExcelService } from '../../../Service/excel.service';
import { AddIndividualComponentComponent } from '../../add-components/add-individual-component/add-individual-component.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Individual } from 'src/app/model/individual';




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
  selector: 'app-dialogbox-individual-components',
  templateUrl: './dialogbox-individual-components.component.html',
  styleUrls: ['./dialogbox-individual-components.component.css']
})
export class DialogboxIndividualComponentsComponent implements OnInit {

  displayedColumns: string[] = ['position', 'names', 'nicknames', 'post','organization','email1','email2',
  'phone1','phone2','fax','address','city','country','otherContactDetails','edit'];
  displayedColumnsReadOnly: string[] = ['position', 'names', 'nicknames', 'post','organization','email1','email2',
  'phone1','phone2','fax','address','city','country','otherContactDetails'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(AddIndividualComponentComponent) child: AddIndividualComponentComponent;
 refreshed = false;

  index: number;
  id: number;

  myControl = new FormControl();
  chosenYearDate: Date;
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

  organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
 countryoptions: string[] = ['India', 'Austrelia', 'U.S','South-Africa'];


 filteredOptions: Observable<string[]>;
 countryfilteredOptions: Observable<string[]>;


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
  usergroup:any;
  individualForm: FormGroup;

  organization = new FormControl();
  country = new FormControl();
  editorg: string | undefined;
  element: string | undefined;
  parsedJson: any;



  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService) { }

  ngOnInit(): void {
    this.usergroup=localStorage.getItem('usergroup');
    console
    this.individualForm = new FormGroup({
      names: new FormControl('', [Validators.required]),
      nicknames: new FormControl('', [Validators.required]),
      email1: new FormControl('', [Validators.required]),
      organization: new FormControl('', [Validators.required]),
      email2: new FormControl(''),
      phone1: new FormControl(''),
      phone2: new FormControl(''),
      address: new FormControl(''),
      fax: new FormControl(''),
      post: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      othercontacts: new FormControl(''),
    });

    this.editorg=localStorage.getItem('EditInd') || undefined;

this.element=localStorage.getItem('EditIndElement') || undefined;
console.log("element:"+this.editorg);
if(this.element !== undefined)
{
  console.log("element2:"+this.element);
this.parsedJson = JSON.parse(this.element);

console.log("jsonObj:"+this.parsedJson);


let obj:Individual=this.parsedJson;//<Organization>jsonObj;
this.country.setValue(this.parsedJson.country);
this.organization.setValue(this.parsedJson.organization);
}
    this.filteredOptions = this.organization.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.countryfilteredOptions = this.country.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCountry(value))
      );
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

  public createIndividual = (individualFormValue) => {
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

      localStorage.setItem('EditInd','');
      localStorage.setItem('EditIndElement','');
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
    localStorage.setItem('EditInd','');
    localStorage.setItem('EditIndElement','');
    form.reset();
    }

    closebuttonedit(){
    localStorage.setItem('EditInd','');
    localStorage.setItem('EditIndElement','');
    }
}
export interface PeriodicElement {
  position: number;
  names: string;
  nicknames: string;
  post: string;
  organization: string;
  email1:string;
  email2: string;
  phone1: string;
  phone2: string;
  address: string;
  fax: string;
  city:string;
  country: string;
  otherContactDetails: string;



}




const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1,names:"World Health Organization",nicknames:'WHO', post:'Health',organization:'WHO',email1:'who@gmail.com',email2:'contactwho@gmail.com', phone1:'+41327755005',phone2:'+41827755005',fax:'+41 22 791 4807',address:'World Health Organization Headquarters',city:'Geneva',country:' Switzerland',otherContactDetails:'@who'},
  {position: 2,names:"United Nations Children's Fund",nicknames:'UNICEF', post:'Banking',organization:'UNICEF',email1:'unicef@gmail.com',email2:'contactunicef@gmail.com', phone1:'+152625412',phone2:'+189457845',fax:'+1 800-689-8898',address:"United Nations Children's Fund Headquarters",city:'New York',country:'United States',otherContactDetails:'@unicef'},
  {position: 3,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Education',organization:'UNESCO',email1:'unesco@gmail.com',email2:'contactunesco@gmail.com', phone1:'+33541268975',phone2:'+33865741259',fax:'+33 161 999 8888',address:"United Nations Educational, Scientific and Cultural Organization Headquarters",city:'Paris',country:'France',otherContactDetails:'@unesco'},
  {position: 4,names:"World Health Organization",nicknames:'WHO', post:'Health',organization:'WHO',email1:'who@gmail.com',email2:'contactwho@gmail.com', phone1:'+41964256845',phone2:'+41987412245',fax:'+41 22 791 4807',address:'World Health Organization Headquarters',city:'Geneva',country:' Switzerland',otherContactDetails:'@who'},
  {position:5,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Education',organization:'UNESCO',email1:'unesco@gmail.com',email2:'contactunesco@gmail.com', phone1:'+33421562354',phone2:'+33565695036',fax:'+33 161 999 8888',address:"United Nations Educational, Scientific and Cultural Organization Headquarters",city:'Paris',country:'France',otherContactDetails:'@unesco'},
  {position: 6,names:"United Nations Children's Fund",nicknames:'UNICEF', post:'Health',organization:'UNICEF',email1:'unicef@gmail.com',email2:'contactunicef@gmail.com', phone1:'+125689452',phone2:'+161548523',fax:'+1 800-689-8898',address:"United Nations Children's Fund Headquarters",city:'New York',country:'United States',otherContactDetails:'@unicef'}
 ];