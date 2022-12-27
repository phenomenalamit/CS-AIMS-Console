// Business Logic TS for individual.component.html
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExcelService } from '../../../Service/excel.service';
import { ViewIndividualComponentComponent } from '../../view-components/view-individual-component/view-individual-component.component';
import {MatDialog} from '@angular/material/dialog';
import { AddIndividualComponentComponent } from '../../add-components/add-individual-component/add-individual-component.component';
import { TranslateService } from '@ngx-translate/core';
import { Individual } from 'src/app/model/individual';


const ELEMENT_DATA: Individual[] = [
  {position: 1,names:"World Health Organization",nicknames:'WHO', post:'Developer',organization:'organization1',email1:'karisma@gmail.com',email2:'k2@gmail.com', phone1:'8327755005',phone2:'8427755005',fax:'xyz',address:'bbsr',city:'bbsr',country:'india',othercontacts:'skype'},
  {position: 2,names:"United Nations Children's Fund",nicknames:'Unicef', post:'Developer',organization:'organization1',email1:'lopa@gmail.com',email2:'l22@gmail.com', phone1:'4512625412',phone2:'6589457845',fax:'pqr',address:'bhadrak',city:'bbsr',country:'india',othercontacts:'linkedIn'},
  {position: 3,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Pr. Analyst',organization:'organization1',email1:'prasant@gmail.com',email2:'pr@gmail.com', phone1:'4541268975',phone2:'9865741259',fax:'bhg',address:'ctc',city:'ctc',country:'india',othercontacts:'skype'},
  {position: 4,names:"World Health Organization",nicknames:'WHO', post:'TechLead',organization:'organization1',email1:'amit@gmail.com',email2:'a@gmail.com', phone1:'9564256845',phone2:'9587412245',fax:'akn',address:'bbsr',city:'bbsr',country:'india',othercontacts:'skype'},
  {position:5,names:"United Nations Educational, Scientific and Cultural Organization",nicknames:'UNESCO', post:'Developer',organization:'organization1',email1:'raman@gmail.com',email2:'r2@gmail.com', phone1:'5421562354',phone2:'8565695036',fax:'pqr',address:'bhadrak',city:'nepal',country:'india',othercontacts:'skype'},
  {position: 6,names:"United Nations Children's Fund",nicknames:'Unicef', post:'Developer',organization:'organization1',email1:'pinaki@gmail.com',email2:'pinaki@gmail.com', phone1:'72056894523',phone2:'7601548523',fax:'pqr',address:'bhadrak',city:'bbsr',country:'india',othercontacts:'linkedIn'}
  ];
  @Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {
  public individualForm!: FormGroup;

  individual:Individual=new Individual();
  displayedColumns: string[] = ['position', 'names', 'nicknames', 'post','organization','email1','email2','phone1','phone2','fax','address','city','country','othercontacts','edit'];
  dataSource = ELEMENT_DATA;
  elements!: NodeListOf<Element>;


 //Auto complete code
 organization = new FormControl();
 country = new FormControl();

 usergroup:any;


 organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco'];
 countryoptions: string[] = ['India', 'Austrelia', 'U.S','South-Africa'];


 filteredOptions: Observable<string[]>;
 countryfilteredOptions: Observable<string[]>;



 @ViewChild(AddIndividualComponentComponent) child: AddIndividualComponentComponent;
 refreshed = false;



  constructor(
    private router :Router,public translate: TranslateService,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService) { }


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


  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewIndividualComponentComponent(this.excelService,this.router);
  //   obj.ExportTOExcel();
  // }

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
