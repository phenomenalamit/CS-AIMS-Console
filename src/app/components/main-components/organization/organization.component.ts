// Business Logic TS component of Organization
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ExcelService } from '../../../Service/excel.service';


import { ViewOrganizationComponentComponent } from '../../view-components/view-organization-component/view-organization-component.component';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Organization } from 'src/app/model/organization';



const ELEMENT_DATA: Organization[] = [
  {id:"",position: 1,names:'Karishma',acronym:'Karisma',category:'Donor',fundingAgency:'Donor Agency1',email:'karisma@gmail.com',telephone:'8327755005',fax:'xyz',direction:'bbsr',city:'bbsr',country:'ap bp',multilateralBilateral:'multilateral',emergingNonemerging:'emerging'},
  {id:"",position: 2,names:'Lopamudra',acronym:'Lopa',category:'Implementation agency',fundingAgency:'Donor Agency1', email:'lopa@gmail.com', telephone:'4512625412',fax:'pqr',direction:'bhadrak',city:'bbsr',country:'lp cp',multilateralBilateral:'Bilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 3,names:'Prashant',acronym:'prashant', category:'NGO',fundingAgency:'Donor Agency3',email:'prasant@gmail.com', telephone:'4541268975',fax:'bhg',direction:'ctc',city:'ctc',country:'abcd',multilateralBilateral:'multilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 4,names:'Amit',acronym:'Amit',category:'NGO',fundingAgency:'Donor Agency1',email:'amit@gmail.com', telephone:'9564256845',fax:'akn',direction:'bbsr',city:'bbsr',country:'mnop',multilateralBilateral:'Bilateral',emergingNonemerging:'emerging'},
  {id:"",position:5,names:'Raman',acronym:'Raman',category:'Company',fundingAgency:'Donor Agency2',email:'raman@gmail.com', telephone:'5421562354',fax:'pqr',direction:'bhadrak',city:'nepal',country:'lp cp',multilateralBilateral:'multilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 6,names:'Pinaki',acronym:'pinaki',category:'Company',fundingAgency:'Donor Agency2',email:'pinaki@gmail.com', telephone:'72056894523',fax:'pqr',direction:'bhadrak',city:'bbsr',country:'gfrt',multilateralBilateral:'Bilateral',emergingNonemerging:'emerging'}


  ];
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  public organizationForm!: FormGroup;
  organization:Organization=new Organization();
  elements!: NodeListOf<Element>;

  fundingAgency=new FormControl();
  fundingAgencyOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
  filteredOptions: Observable<string[]>;
  usergroup:any;

  country = new FormControl();
  countryoptions: string[] = ['India', 'Austrelia', 'U.S','South-Africa'];
  countryfilteredOptions: Observable<string[]>;

  displayedColumns: string[] = ['position', 'names', 'acronym','category','fundingAgency','email','telephone','fax','direction','city','country','multilateralBilateral','emergingNonemerging','edit'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,public translate: TranslateService) { }



    num:any;
    tabClick(index: number) {
      this.num=index;
    }
    browserLang:any;
  ngOnInit(): void {
    localStorage.setItem("EditEnvUrl","Reset-EditEnvUrl");
localStorage.setItem("EditDisbUrl","Reset-EditDisbUrl");
localStorage.setItem("EditFundUrl","Reset-EditFundUrl");
localStorage.setItem("EditIndUrl","Reset-EditIndUrl");
localStorage.setItem("EditMonitoringUrl","Reset-EditMonitoringUrl");
localStorage.setItem("EditOrgUrl","Reset-EditOrgUrl");
localStorage.setItem("EditPaymentUrl","Reset-EditPaymentUrl");
localStorage.setItem("EditProjectUrl","Reset-EditProjectUrl");
localStorage.setItem("EditUserAcctUrl","Reset-EditUserAcctUrl");
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang",this.browserLang);
    this.usergroup=localStorage.getItem('usergroup');
      // if(this.usergroup===undefined || this.usergroup===null)
      // this.router.navigate(['/login']);

    this.organizationForm = new FormGroup({
      names: new FormControl('', [Validators.required]),
      acronym: new FormControl('', [Validators.required]),
      category: new FormControl(''),
      fundingAgency: new FormControl(''),
      email: new FormControl(''),
      telephone: new FormControl(''),
      fax: new FormControl(''),
      direction: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      multilateralBilateral!: new FormControl(''),
      emergingNonemerging!: new FormControl(''),
    });
    this.filteredOptions = this.fundingAgency.valueChanges
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

  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewOrganizationComponentComponent(this.excelService,this.router);
  //   obj.ExportTOExcel();
  // }

  private _filteragency(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.fundingAgencyOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countryoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.organizationForm.controls[controlName].hasError(errorName);
  }

  public createOrganization = (organizationFormValue) => {
    if (this.organizationForm.valid) {
      this.executeOrganizationCreation(organizationFormValue);
    }
  }

  private executeOrganizationCreation = (organizationFormValue) => {
    let organization: Organization = {
      id:"",
      names: organizationFormValue.name,
      acronym: organizationFormValue.nickname,
      category: organizationFormValue.post,
      fundingAgency: organizationFormValue.fundingAgency,
      email:organizationFormValue.email,
      telephone:organizationFormValue.telephone,
      fax:organizationFormValue.fax,
      direction:organizationFormValue.address,
      city:organizationFormValue.city,
      country:organizationFormValue.country,
      multilateralBilateral:organizationFormValue.multilateralBilateral,
      emergingNonemerging:organizationFormValue.emergingNonemerging,
      position:organizationFormValue.position

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
