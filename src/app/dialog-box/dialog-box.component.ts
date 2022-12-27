

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Organization } from '../model/organization';




const ELEMENT_DATA: Organization[] = [
  {id:"",position: 1,names:'Karishma',acronym:'Karisma',category:'Donor',fundingAgency:'Donor Agency1',email:'karisma@gmail.com',telephone:'8327755005',fax:'xyz',direction:'bbsr',city:'bbsr',country:'ap bp',multilateralBilateral:'multilateral',emergingNonemerging:'emerging'},
  {id:"",position: 2,names:'Lopamudra',acronym:'Lopa',category:'Implementation agency',fundingAgency:'Donor Agency1', email:'lopa@gmail.com', telephone:'4512625412',fax:'pqr',direction:'bhadrak',city:'bbsr',country:'lp cp',multilateralBilateral:'Bilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 3,names:'Prashant',acronym:'prashant', category:'NGO',fundingAgency:'Donor Agency3',email:'prasant@gmail.com', telephone:'4541268975',fax:'bhg',direction:'ctc',city:'ctc',country:'abcd',multilateralBilateral:'multilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 4,names:'Amit',acronym:'Amit',category:'NGO',fundingAgency:'Donor Agency1',email:'amit@gmail.com', telephone:'9564256845',fax:'akn',direction:'bbsr',city:'bbsr',country:'mnop',multilateralBilateral:'Bilateral',emergingNonemerging:'emerging'},
  {id:"",position:5,names:'Raman',acronym:'Raman',category:'Company',fundingAgency:'Donor Agency2',email:'raman@gmail.com', telephone:'5421562354',fax:'pqr',direction:'bhadrak',city:'nepal',country:'lp cp',multilateralBilateral:'multilateral',emergingNonemerging:'non-emerging'},
  {id:"",position: 6,names:'Pinaki',acronym:'pinaki',category:'Company',fundingAgency:'Donor Agency2',email:'pinaki@gmail.com', telephone:'72056894523',fax:'pqr',direction:'bhadrak',city:'bbsr',country:'gfrt',multilateralBilateral:'Bilateral',emergingNonemerging:'emerging'}


  ];

  interface category {
    value: string;
    viewValue: string;
  }

  @Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.css']
  })
export class DialogBoxComponent implements OnInit {
  public organizationForm!: FormGroup;
  organization:Organization=new Organization();
  elements!: NodeListOf<Element>;

  fundingAgency=new FormControl();
  fundingAgencyOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
  filteredOptions: Observable<string[]>;


  country = new FormControl();
  countryoptions: string[] = ['India', 'Austrelia', 'U.S','South-Africa'];
  countryfilteredOptions: Observable<string[]>;


  //categoryOptions: string[] = ['Donor','Implementation agency','NGO','Company'];
  categoryOptions: category[] = [
    { value: 'Donor', viewValue: 'Donor' },
    { value: 'Implementation agency', viewValue: 'Implementation agency' },
    { value: 'NGO', viewValue: 'NGO' },
    { value: 'Company', viewValue: 'Company' }
  ];

  displayedColumns: string[] = ['position', 'names', 'acronym','category','fundingAgency','email','telephone','fax','direction','city','country','multilateralBilateral','emergingNonemerging','edit'];
  dataSource = ELEMENT_DATA;
    parsedJson: any;
    direction: any;
    categorySelected:any;
    multilateralBilateralSelected:any;
    emerging_non_EmergingSelected: any;
    citySelected: any;
    organizationSelected: any;
    countrySelected: any;

  constructor(
    private router :Router,private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: HTMLDocument) {

    }



    num:any;
    editorg:any;
    element:any;

    tabClick(index: number) {
      this.num=index;
    }

  ngOnInit(): void {

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


    this.editorg=localStorage.getItem('EditOrg') || undefined;

this.element=localStorage.getItem('EditOrgElement') || undefined;
console.log("element:"+this.editorg);
if(this.element !== undefined)
{
  console.log("element2:"+this.element);
this.parsedJson = JSON.parse(this.element);

console.log("jsonObj:"+this.parsedJson);


let obj:Organization=this.parsedJson;//<Organization>jsonObj;
console.log('names123',this.parsedJson.names);
console.log('names',obj.names);
this.direction = this.parsedJson.direction;
this.categorySelected = this.parsedJson.category;
this.multilateralBilateralSelected = this.parsedJson.Multilateral_or_bilateral;
this.emerging_non_EmergingSelected = this.parsedJson.Emerging_non_Emerging;
this.citySelected = this.parsedJson.city;
this.organizationSelected = this.parsedJson.fundingAgency;
this.countrySelected = this.parsedJson.parentCountry;
console.log('names123',this.organizationSelected);

this.fundingAgency.setValue(this.organizationSelected);
this.country.setValue(this.countrySelected);

}



    //  this.organizationForm.setValue({fundingAgency:this.organizationSelected});


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
  // position!:number;
  //   names!:string;
  //   acronym!:string;
  //   category!:string;
  //   fundingAgency!:string;
  //   email!:string;
  //   telephone!: string;
  //   fax!: string;
  //   direction!: string;
  //   city!:string;
  //   country!: string;
  //   multilateralBilateral!:string;
  //   emergingNonemerging!: string;

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
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      localStorage.setItem('EditOrg','');
      localStorage.setItem('EditOrgElement','');

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  clearForm(form: FormGroup) {

    // localStorage.removeItem('EditOrg');
    // localStorage.removeItem('EditOrgElement');
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
    form.reset();
    }
    closebuttonedit(){
      localStorage.setItem('EditOrg','');
      localStorage.setItem('EditOrgElement','');
    }

    closeDialoge(){
      const dialogRef = this.dialog.closeAll(
        );
    }
}
