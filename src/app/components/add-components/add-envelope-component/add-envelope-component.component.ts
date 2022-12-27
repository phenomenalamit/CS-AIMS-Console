// Business Logic TS file for add-envelope-component.component.html

import { CurrencyPipe, DatePipe, DOCUMENT } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { DOWN_ARROW, S, UP_ARROW } from '@angular/cdk/keycodes'

import { Input, Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, QueryList, Inject, } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap, map, startWith, first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import envelopedata from '../../../data/envelope-data.json';
// import Swal, * as swal from 'sweetalert2';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import Swal from 'sweetalert2';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { Envelope } from '../../../model/envelope';
import { forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { truncate } from 'fs';
import { PurposeDACCRS } from 'src/app/Service-Class/purpose-dac-crs';
import { PurposeDACCRSService } from 'src/app/Service/purpose-dac-crs.service';
import { Currency } from 'src/app/Service-Class/currency';
import { CurrencyService } from 'src/app/Service/currency.service';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';

import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { EnvelopeTableData } from 'src/app/Service-Class/envelope-table-data';
import { BankOfMozambique } from 'src/app/Service-Class/bank-of-mozambique';
import { BankOfMozambiqueService } from 'src/app/Service/bank-of-mozambique.service';
import { LeftsidemenuComponent } from '../../UI-components/leftsidemenu/leftsidemenu.component';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { ExchangeRateServiceService } from 'src/app/Service/exchange-rate-service.service';
import { ExchangeRate } from 'src/app/Service-Class/exchange-rate';
import { Notification } from 'src/app/Service-Class/notification';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { data } from 'jquery';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { LoginService } from 'src/app/Service/login.service';
import { UserTypeServiceService } from 'src/app/Service/user-type-service.service';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import { Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ExchangeRateAdministrationComponent } from '../../administration-component/exchange-rate-administration/exchange-rate-administration.component';
// import { UserAccessClass } from 'src/app/Service-Class/user-access-class.service';

/*
* Author Sunita Parida
* This page is belongs to Envelope module
*/
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-add-envelope-component',
  templateUrl: './add-envelope-component.component.html',
  styleUrls: ['./add-envelope-component.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEnvelopeComponentComponent),
      multi: true,
    },
  ],
})
export class AddEnvelopeComponentComponent
  implements OnInit, OnDestroy {
  /* All variable declartion start here */
  envelopeData: EnvelopeServiceClass = new EnvelopeServiceClass();
  public envelopeForm!: FormGroup;
  envelope: Envelope = new Envelope();
  elements!: NodeListOf<Element>;
  newDynamic: any = {};
  purposeDACCRS!: PurposeDACCRS[];
  currenyList: Currency[];
  fundingOrganizationList: OrganizationCrudServiceClass[];
  purdaccrs = new FormControl();
  filteredOptions: Observable<string[]>;
  enevelopeJsa: any = new Array();
  enevelopeTD: EnvelopeTableData = new EnvelopeTableData();
  currency1 = new FormControl('', Validators.required);
  filteredOptionsC: Observable<string[]>;
  flag_delete: boolean;
  fundingOrganizationfilteredOption: Observable<any[]>;
  draftfilteredOption: Observable<any[]>;
  currencyfilteredOption: Observable<Currency[]>[] = [];;
  currencyfilteredOptionArray: any;
  purposeDACCRSfilteredOption: Observable<any[]>[] = [];
  yearfilteredOption: Observable<any[]>[] = [];
  donor = new FormControl('', Validators.required);
  searchDraft= new FormControl('');
  num: any;
  currency: any
  EditEnv: any;
  viewMoreEnv: any;
  browserLang: any;
  fn: any;
  value: any;
  leftSideMenu: any;
  id: any = null;
  chkUnPrgValueAtEdit: any = 0;
  viewByTableId: any = null;
  usergroup: any;
  userId:number;
  envId: any = null;
  englishList = ['Year', 'Dac Crs', 'Amount', 'Currency']
  currentYear: number = new Date().getFullYear();
  nodisplay: any = true;
  amount: any;
  year = '';
  yearBlank = [];
  updateEnvelope: EnvelopeServiceClass[];
  viewEnvelope: EnvelopeServiceClass[];
  enevelopIdUpdate: string = "";
  fundingOrg: string;
  saveAsDraftList: EnvelopeServiceClass[];
  totalAmnt: any = 0;
  totalUnProgram: any = 0;
  totalUnProgramMZN: any = 0;
  totalUnProgramUSD: any = 0;
  totalAmntMzn: any = 0
  totalAmntUsd: any = 0
  inputAmount: number;
  exchangeRateList!: ExchangeRate[];
  financialList: FinancialAgreement[];
  fundingOrganization = false;
  newFundingOrg = '';
  newFundingOrgId: any;
  currenyListAll: Currency[];
  currencyfilteredOptionData: Observable<any[]>;
  currency2 = new FormControl('', Validators.required);
  mznValue: number = 0;
  usdVAlue: number = 0;
  userNameForNotification: string = "Charlie Adams"; //letter this field will be softcoded
  userGroupName: string = "DNGDP Admin"; //letter this field will be softcoded
  uAccessPermArr: UserAccessPermission[] = [];
  authorised_flag = false;
  auto_save_as_draft_flag = false;
  chkallocatedAmnt = false;
  /* All variable declartion end here */

  constructor(
    private userAccessService: UserAccessClassService,
    private envelopeServiceData: EnvelopeServiceService,
    private currencyPipe: CurrencyPipe,
    public translate: TranslateService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private notificationService: NotificationService,
    private idle: Idle,
    private keepalive: Keepalive,
    private loginService: LoginService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private purposeDACCRSService: PurposeDACCRSService,
    private currencyService: CurrencyService,
    private fundingOrganizationService: FundingOrganizationService,
    private organizationCrudServiceService: OrganizationCrudServiceService,
    private bankService: BankOfMozambiqueService,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private exchangeRateService: ExchangeRateServiceService,
    private primaryLinkService: PrimaryLinkService,
    public datepipe: DatePipe,
    private envelopeService: EnvelopeServiceService
  ) {



    // this.fundingOrganizationService.getFundingOrganizationList().subscribe(data => {
    //   this.fundingOrganizationList = data;
    //   this.fundingOrganizationfilteredOption = this.donor.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())

    //     );
    // });
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    /* Call curreny list */
    this.getCurrencyDetails();

    /* Call funding organization list */
    this.getFundingOrg();

    this.envelopeForm = this.fb.group({
      tableData: this.fb.array([
        this.fb.group({

          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),

        this.fb.group({
          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),
        this.fb.group({
          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),
      ]),
      viewSaveAsDraft: new FormControl(''),
      donor: new FormControl('', [Validators.required]),
      envelopeReference: new FormControl('', [Validators.required]),
      currency2: new FormControl('', Validators.required),
      purdaccrs: new FormControl(''),
      comments: new FormControl('', [Validators.maxLength(1000)]),
    });

    /* call save as draft for get all save as draft values from db */
    this.getSaveAsDrfat();
  }
  /* filter funding organization */
  private filterfundingOrganization(name: string) {
    return this.fundingOrganizationList.filter(fundingOrganization =>
      fundingOrganization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 || fundingOrganization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  /* After choose year and currency here we get the mzn nd usd value */

  getMznUsd(event, j) {
    this.nodisplay = false;

    this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
    ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').enable();

  }

  /* If we change year value then amount,currency,mzn nd usd value should be reset of that pertcular row */
  resetAmount(event, j) {
    ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
    //((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').reset();
    ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
    ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();

  }

  /* This method will call at view more time to go to edit page */
  moveToSelectedTabEdit(envId: number) {

    localStorage.setItem("EditEnv", "EditEnv");
   
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-envelope', envId]));

  }

  get dateFormArray(): FormArray {
    return this.envelopeForm.get('tableData') as FormArray;
  }

  /* This is for to add more row in the table */
  public addYears(): void {

    this.fundingOrg = this.envelopeForm.controls['donor'].value;
    let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
    this.currency = ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('currency1').value;

    if (this.currency == null || this.currency == '' || this.currency == undefined) {
      const row = this.fb.group({

        envagrcurr: [{ value: '', disabled: true }, Validators.required],
        currency1: [{ value: '', disabled: true }, Validators.required],
        exchangerateusd: [''],
        exchangeratemzn: [''],
        amtannenvmeti: [{ value: '', disabled: true }],
        annenvamtusd: [{ value: '', disabled: true }],
        year: [{ value: '', disabled: true }, Validators.required],
        endYear: [{ value: '', disabled: true }],
        searchCurrency: [''],
        purdaccrs: [{ value: '', disabled: true }],
        purdaccrsSearch: [''],
        yearSearch: [''],

      });
      this.dateFormArray.push(row);
    }
    else {
      let lastIndex = this.dateFormArray.length - 1;
      let lastIndexAmount = ((this.envelopeForm.get('tableData') as FormArray).at(lastIndex) as FormGroup).get('envagrcurr').value;

      if (lastIndexAmount == null || lastIndexAmount == '' || lastIndexAmount == undefined) {

        const row = this.fb.group({

          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        });
        this.dateFormArray.push(row);

      } else {
        const row = this.fb.group({

          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          year: ['', Validators.required],
          endYear: [{ value: '', disabled: false }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        });
        this.dateFormArray.push(row);
      }
      if (this.currency != null && this.currency != '' && this.currency != undefined) {
        let lastIndex = this.dateFormArray.length - 1;
        ((this.envelopeForm.get('tableData') as FormArray).at(lastIndex) as FormGroup).get('currency1').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(lastIndex) as FormGroup).get('currency1').setValue(currencyId);
      }
    }

    /* Here we call this method to get all currency list after add a row */
    this.getCurrencyDetails();
    /* Here we call this method to get all purpose dac crs list after add a row */
    // this.browserLang = localStorage.getItem("browserLang");
    this.getPurposeDACCRS();
    /* Here we call this method to get all year list after add a row */
    // this.getExchangeRate();
  }

  /* To delete a perticular row we call this method */
  deleteRowYears(index: number) {
    this.getValueByLang();
    Swal.fire({
      /* Whenever we click on delete button then it will give two more button i.e. delete and cancel */
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* If we click on delete button then by given id that record will deleted*/
      if (result.isConfirmed) {
        /* Here we call service to delete data from db by given id */
        this.getCurrencyDetails();
        /* Here we call this method to get all purpose dac crs value */
        this.getPurposeDACCRS();
        /* Here we call this method to get all year list after add a row */
        // this.getExchangeRate();
        // this.inputAmount = Number.parseFloat(((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('envagrcurr').value);
        // this.amount = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('envagrcurr').value;
        // if (this.amount != null && this.amount != '' && this.amount != undefined) {
        //   if (this.dateFormArray.length != 1) {
        //     this.totalAmnt = this.totalAmnt - this.inputAmount;
        //   }
        // }
        this.fundingOrg = this.envelopeForm.controls['donor'].value;

        if (this.dateFormArray.length == 1) {
          if (this.browserLang == 'en') {
            Swal.fire({
              title: 'At least one row must be present.',
              confirmButtonText: `OK`,
            })
          } else {
            Swal.fire({
              title: 'Deve haver pelo menos um registo.',
              confirmButtonText: `OK`,
            })
          }

        } else {
          if (this.id == null) {
            this.dateFormArray.removeAt(index);
            this.getValueByLang()
            if (this.browserLang == 'en') {
              Swal.fire('Deleted successfully', '', 'success')
            } else {
              Swal.fire('Apagado com sucesso', '', 'success')
            }
          }

          else {
            let totalAmountGrtr = false;
            if (this.id != null) {
              this.totalAmnt = 0;
              this.totalAmntMzn = 0
              this.totalAmntUsd = 0;
              for (let i = 0; i < this.tableData1.length; i++) {

                let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
                if (dat != undefined && dat != null && dat.trim() != '') {
                  dat = dat.split(",").join("");
                  this.totalAmnt += Number.parseFloat(dat);
                }

                let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
                if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
                  mznAmount = mznAmount.split(",").join("");
                  this.totalAmntMzn += Number.parseFloat(mznAmount);
                }

                let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
                if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                  usdAmount = usdAmount.split(",").join("");
                  this.totalAmntUsd += Number.parseFloat(usdAmount);
                }
              }
              let dat = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('envagrcurr').value;
              if (dat != undefined && dat != null && dat.trim() != '') {
                dat = dat.split(",").join("");
                this.totalAmnt = this.totalAmnt - Number.parseFloat(dat);
              }
              this.getValueByLang();
              if (this.totalAmnt <= this.chkUnPrgValueAtEdit) {
                // this.totalAmnt=this.totalAmnt+ Number.parseFloat(this.chkCrntAmnt);
                totalAmountGrtr = true;
                ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('envagrcurr').setValue(this.currencyPipe.transform(Number.parseFloat(this.chkCrntAmnt), ' '))
                if (this.browserLang == 'en')
                  Swal.fire('Total amount should be greater than Un-programmed amount.Row can not be deleted.')
                else {
                  Swal.fire('O montante total deve ser superior ao montante não-programado. A linha não pode ser eliminada.')
                }
              } else {
                this.dateFormArray.removeAt(index);
                this.getValueByLang()
                if (this.browserLang == 'en') {
                  Swal.fire('Deleted successfully', '', 'success')
                } else {
                  Swal.fire('Apagado com sucesso', '', 'success')
                }
              }

            }

            if (totalAmountGrtr == true) {
              this.totalAmnt = 0;
              this.totalAmntMzn = 0
              this.totalAmntUsd = 0;
              let value = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('envagrcurr').value;
              if (this.chkCrntAmnt != null && this.chkCrntAmnt != '' && this.chkCrntAmnt != undefined) {
                value = value.split(",").join("");
                let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
                this.mznValue = 0;
                this.usdVAlue = 0;
                this.year = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').value;
                this.year = this.datepipe.transform(this.year, 'yyyy');
                for (let i = 0; i < this.exchangeRateList.length; i++) {
                  if (this.year == (this.exchangeRateList[i].year).toString()) {
                    // if (this.year == (this.exchangeRateList[i].exchangeRateId).toString()) {
                    if (this.exchangeRateList[i].currency == currencyId.toString()) {
                      this.mznValue = this.exchangeRateList[i].mznAmount;
                      this.usdVAlue = this.exchangeRateList[i].usdAmount;
                    }
                  }
                }
                // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').setValue(this.currencyPipe.transform(value, " "));
                let mzn = this.mznValue * Number.parseFloat(this.chkCrntAmnt);
                let usd = this.usdVAlue * Number.parseFloat(this.chkCrntAmnt);
                ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('amtannenvmeti').setValue(this.currencyPipe.transform(mzn, " "));
                ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('annenvamtusd').setValue(this.currencyPipe.transform(usd, " "));

              }
              for (let i = 0; i < this.tableData1.length; i++) {

                let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
                if (dat != undefined && dat != null && dat.trim() != '') {
                  dat = dat.split(",").join("");
                  this.totalAmnt += Number.parseFloat(dat);
                }

                let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
                if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
                  mznAmount = mznAmount.split(",").join("");
                  this.totalAmntMzn += Number.parseFloat(mznAmount);
                }

                let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
                if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                  usdAmount = usdAmount.split(",").join("");
                  this.totalAmntUsd += Number.parseFloat(usdAmount);
                }
              }

            }
          }
        }
        if (this.fundingOrg == null || this.fundingOrg == '' || this.fundingOrg == undefined) {
          for (let i = 0; i < this.dateFormArray.length; i++) {
            ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').disable();
          }

        } else {

          ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('year').enable();
          if (this.dateFormArray.length != 1) {
            if (index != 0) {
              let amnt = ((this.envelopeForm.get('tableData') as FormArray).at(index - 1) as FormGroup).get('envagrcurr').value;
              if (amnt == null || amnt == '' || amnt == undefined) {
                ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').disable();
              } else {
                ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').enable();
              }
            }

          }
        }

        this.totalAmnt = 0;
        this.totalAmntMzn = 0
        this.totalAmntUsd = 0;
        for (let i = 0; i < this.tableData1.length; i++) {

          let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
          if (dat != undefined && dat != null && dat.trim() != '') {
            dat = dat.split(",").join("");
            this.totalAmnt += Number.parseFloat(dat);
          }

          let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
          if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
            mznAmount = mznAmount.split(",").join("");
            this.totalAmntMzn += Number.parseFloat(mznAmount);
          }

          let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
          if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
            usdAmount = usdAmount.split(",").join("");
            this.totalAmntUsd += Number.parseFloat(usdAmount);
          }

        }

        let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
        this.totalUnProgram = 0;
        this.totalUnProgramMZN = 0;
        this.totalUnProgramUSD = 0
        let allocatedAmount = 0
        let allocatedAmountMZn = 0;
        let allocatedAmntUsd = 0;
        this.getFinancialDetails();
        this.totalAmnt = 0;
        this.totalAmntMzn = 0
        this.totalAmntUsd = 0;
        for (let i = 0; i < this.tableData1.length; i++) {

          let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
          if (dat != undefined && dat != null && dat.trim() != '') {
            dat = dat.split(",").join("");
            this.totalAmnt += Number.parseFloat(dat);
          }

          let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
          if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
            mznAmount = mznAmount.split(",").join("");
            this.totalAmntMzn += Number.parseFloat(mznAmount);
          }

          let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
          if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
            usdAmount = usdAmount.split(",").join("");
            this.totalAmntUsd += Number.parseFloat(usdAmount);
          }
        }
        let envRef = this.envelopeForm.controls['envelopeReference'].value;
        this.totalUnProgram = 0;
        this.totalUnProgramMZN = 0;
        this.totalUnProgramUSD = 0
        for (let k = 0; k < this.financialList.length; k++) {
          // if(currencyId == this.financialList[k].financialAgreementCurrency){
          if (envRef == this.financialList[k].envelopeReference) {
            allocatedAmount += this.financialList[k].allocatedAmount;
            allocatedAmountMZn += this.financialList[k].amountAllocatedInFaMzn
            allocatedAmntUsd += this.financialList[k].amountAllocatedInFaUsd

          }
        }
        if (this.chkallocatedAmnt == false) {
          if (this.totalAmnt != 0) {
            this.totalUnProgram = this.totalAmnt;
            this.totalUnProgramMZN = this.totalAmntMzn;
            this.totalUnProgramUSD = this.totalAmntUsd;
          } else {
            this.totalUnProgram = 0;
            this.totalUnProgramMZN = 0;
            this.totalUnProgramUSD = 0;
          }
        } else {
          if (this.totalAmnt != 0) {
            this.totalUnProgram = this.totalAmnt - allocatedAmount;
            this.totalUnProgramMZN = this.totalAmntMzn - allocatedAmountMZn;
            this.totalUnProgramUSD = this.totalAmntUsd - allocatedAmntUsd;
          } else {
            this.totalUnProgram = 0;
            this.totalUnProgramMZN = 0;
            this.totalUnProgramUSD = 0;
          }
        }
        // if(allocatedAmount ==0){
        //   this.totalUnProgram =this.totalAmnt
        // }
        // if(allocatedAmountMZn == 0){
        //   this.totalUnProgramMZN=this.totalAmntMzn
        // }
        // if(allocatedAmntUsd ==0){
        //   this.totalUnProgramUSD=this.totalAmntUsd
        // }

      }
      /* If we click on Cancel button then no record will be deleted */
      else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else {
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }


  get tableData1(): FormArray {
    return this.envelopeForm.get('tableData') as FormArray;
  }


  ngOnInit(): void {

    this.getFinancialDetails();
    this.fetchEnvelopeData();
    localStorage.setItem("refNM", null);
    localStorage.removeItem('refNM');
    // this.getAllDNGDPADMINEmail();
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));

    /* Here we get which user is login */
    this.usergroup = localStorage.getItem('usergroup');

    this.setToAuthFlag();

    /* Here we can get the current selected language */
    this.browserLang = localStorage.getItem("browserLang");

    /* If we did not get any selected language value then the by default language is english*/
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');


    this.leftSideMenu = new LeftsidemenuComponent(this.router, this.dialog, this.translate, this.primaryLinkService, this.notificationService, this.loginService, this.idle, this.keepalive);

    /* Here we call this method to get all purpose dac crs value */
    this.getPurposeDACCRS();
    /* Here we call this method to get all exchange rate values */
    // this.getExchangeRate()

    this.getCurrencyData();
    this.flag_delete = true;

    /* Below is for At Edit time we have to get the id from url */
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id == null) {
      this.envelopeForm.controls['currency2'].disable();
    } else {
      this.envelopeForm.controls['currency2'].enable();
    }
    /* Below is for At View more time we have to get the id from url */
    this.viewByTableId = this.route.snapshot.paramMap.get("tabId");

    /* This condition is checked that the viewByTableId is null or not
    *  If  null then it doesn't patch any value
    *  If not null then it patch value (At view more time)
    */
    if (this.viewByTableId != null) {
      this.auto_save_as_draft_flag = false;
      /* At view more time all the should be disable mode we can not do any operation at that time */
      this.envelopeForm.disable();
      this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
      /* Here we call service to get perticular values by given id  */
      // this.envelopeServiceData.viewMoreEnvelope(this.viewByTableId).pipe(first()).subscribe(
      this.envelopeServiceData.updateEnvelope(this.viewByTableId).pipe(first()).subscribe(
        data => {

          this.viewEnvelope = data;
          this.flag_delete = false;
          
          this.nodisplay = false;
          this.envelopeForm = this.fb.group({
            tableData: this.fb.array([
              this.fb.group({
                envagrcurr: ['', Validators.required],
                currency1: [''],
                year: ['', Validators.required],
                endYear: [{ value: '', disabled: false }],
                exchangerateusd: [''],
                exchangeratemzn: [''],
                amtannenvmeti: [{ value: '', disabled: true }],
                annenvamtusd: [{ value: '', disabled: true }],
                searchCurrency: [''],
                purdaccrs: [''],
                purdaccrsSearch: [''],
                yearSearch: [''],
              }),
            ]),
            viewSaveAsDraft: new FormControl(''),
            donor: new FormControl({ value: '', disabled: true }, [Validators.required]),
            envelopeReference: new FormControl('', [Validators.required]),
            currency2: new FormControl({ value: '', disabled: true }, Validators.required),
            purdaccrs: new FormControl({ value: '', disabled: true }),
            comments: new FormControl('', [Validators.maxLength(1000)]),
          });
          /* Patch values  */
          for (let i = 0; i < this.viewEnvelope.length; i++) {
            this.enevelopIdUpdate = this.viewEnvelope[i].envelopeId;
            this.envId = this.viewEnvelope[i].envelopeId;
            this.envelopeForm.controls['currency2'].disable();
            this.envelopeForm.controls.envelopeReference.setValue(this.viewEnvelope[i].envelopeReference);
            localStorage.setItem("refNM", this.viewEnvelope[i].envelopeReference);
            localStorage.setItem('envelopeReference', this.viewEnvelope[i].envelopeReference);
            this.envelopeForm.controls.donor.setValue(Number.parseInt(this.viewEnvelope[i].fundingOrganization));
            this.envelopeForm.controls.comments.setValue(this.viewEnvelope[i].comments);
            let currencyId = this.viewEnvelope[i].currencyMaster;
            this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
            this.envelopeForm.disable();
            /* Here we call addYears method for add rows  */
            for (let j = 1; j < this.viewEnvelope[i].envelopeAllTableData.length; j++) {
              this.addYears();
            }
            try {
              for (let k = 0; k < this.viewEnvelope[i].envelopeAllTableData.length; k++) {
                this.envelopeForm.disable();
                //Disable Table field

                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').disable();
                /* Disable Currency MZN USD field */
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').disable();

                //set table values
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').patchValue(this.viewEnvelope[i].envelopeAllTableData[k].startYear);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').patchValue(this.viewEnvelope[i].envelopeAllTableData[k].endYear);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').patchValue(this.currencyPipe.transform(this.viewEnvelope[i].envelopeAllTableData[k].amount, " "));
                if ((this.viewEnvelope[i].envelopeAllTableData[k].purposeDacCrs) != null) {
                  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').patchValue((this.viewEnvelope[i].envelopeAllTableData[k].purposeDacCrs));
                }
                // let currencyId = Number.parseInt(this.viewEnvelope[i].envelopeAllTableData[k].currency);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
                // this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);

                this.mznValue = 0;
                this.usdVAlue = 0;
                this.totalAmntMzn = 0
                this.totalAmntUsd = 0;
                let year = this.datepipe.transform(this.viewEnvelope[i].envelopeAllTableData[k].startYear, 'yyyy');
                this.exchangeRateService.getExchangeRate().toPromise().then(data => {
                  this.exchangeRateList=data;
                  for (let j = 0; j < this.exchangeRateList.length; j++) {
                    if ((year).toString() == ((this.exchangeRateList[j].year).toString())) {
                      this.mznValue = this.exchangeRateList[j].mznAmount;
                      this.usdVAlue = this.exchangeRateList[j].usdAmount;

                      this.mznValue = this.mznValue * Number.parseFloat(this.viewEnvelope[i].envelopeAllTableData[k].amount);
                      this.usdVAlue = this.usdVAlue * Number.parseFloat(this.viewEnvelope[i].envelopeAllTableData[k].amount);
                      ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').patchValue((this.currencyPipe.transform(this.mznValue, " ")));
                      ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').patchValue((this.currencyPipe.transform(this.usdVAlue, " ")));
                    
                      let mznAmount1 =  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').value;
                    
                      if (mznAmount1 != undefined && mznAmount1 != null && mznAmount1.trim() != '') {
                        mznAmount1 = mznAmount1.split(",").join("");
                        this.totalAmntMzn += Number.parseFloat(mznAmount1);
                      }
                
                      let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').value;
                      if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                        usdAmount = usdAmount.split(",").join("");
                        this.totalAmntUsd += Number.parseFloat(usdAmount);
                      }
                    }
                  }
                });

                /* Get amount and convert it into float */
                this.inputAmount = Number.parseFloat(this.viewEnvelope[i].envelopeAllTableData[k].amount);
                /* calculate total amount */
                // this.totalAmnt = this.totalAmnt + this.inputAmount;
              
              }
              this.totalUnProgram = 0;
              this.totalUnProgramMZN = 0;
              this.totalUnProgramUSD = 0
              

              // this.totalAmntMzn = 0
              // this.totalAmntUsd = 0;
              this.totalAmnt = 0;
              for (let k = 0; k < this.tableData1.length; k++) {

               

                let dat = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').value;
            
                if (dat != undefined && dat != null && dat.trim() != '') {
                  dat = dat.split(",").join("");
                  this.totalAmnt += Number.parseFloat(dat);
                }
                
                // console.log("amtann------>",(this.envelopeForm.get('tableData')));
                // let mznAmount1 =  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').value;
                // console.log("mznAmount1------>",mznAmount1);
                // if (mznAmount1 != undefined && mznAmount1 != null && mznAmount1.trim() != '') {
                //   mznAmount1 = mznAmount1.split(",").join("");
                //   this.totalAmntMzn += Number.parseFloat(mznAmount1);
                // }
          
                // let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').value;
                // if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                //   usdAmount = usdAmount.split(",").join("");
                //   this.totalAmntUsd += Number.parseFloat(usdAmount);
                // }
              }
            
            let envRef = this.envelopeForm.controls['envelopeReference'].value;
            let allocatedAmount = 0
              let allocatedAmountMZn = 0;
              let allocatedAmntUsd = 0;
              this.envelopeServiceData.getFinancialDetails().toPromise().then(data => {
                this.financialList = data;
               
                for (let k = 0; k < this.financialList.length; k++) {
                  if (envRef == this.financialList[k].envelopeReference) {
                    allocatedAmount += this.financialList[k].allocatedAmount;
                    allocatedAmountMZn += this.financialList[k].amountAllocatedInFaMzn
                    allocatedAmntUsd += this.financialList[k].amountAllocatedInFaUsd
                    this.chkallocatedAmnt = true;
                  }
                }


                if (allocatedAmount != 0) {
                  this.totalUnProgram = this.totalAmnt - allocatedAmount;
                  this.totalUnProgramMZN = this.totalAmntMzn - allocatedAmountMZn;
                  this.totalUnProgramUSD = this.totalAmntUsd - allocatedAmntUsd;
                } else {
                  this.totalUnProgram = this.totalAmnt;
                  this.totalUnProgramMZN = this.totalAmntMzn;
                  this.totalUnProgramUSD = this.totalAmntUsd;
                }
                this.chkUnPrgValueAtEdit = allocatedAmount;
              });
            }
            catch (e) {
              console.log(e);
            }
          }
          // /* Set all value */
          // for (let i = 0; i < this.viewEnvelope.length; i++) {
          //   this.envelopeForm.disable();
          //   this.envId = this.viewEnvelope[i].envelopeId;
          //   this.envelopeForm.controls.donor.setValue(Number.parseInt(this.viewEnvelope[i].fundingOrganization));
          //   this.envelopeForm.controls.envelopeReference.setValue(this.viewEnvelope[i].envelopeReference)
          //   this.envelopeForm.controls.comments.setValue(
          //     this.viewEnvelope[i].comments
          //   );
          //   ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('purdaccrs').patchValue(this.viewEnvelope[i].purposeDacCrs);
          //   ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup)
          //     .get('year')
          //     .patchValue(this.viewEnvelope[i].year);

          //   ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup)
          //     .get('envagrcurr')
          //     .patchValue(this.currencyPipe.transform(this.viewEnvelope[i].amount," "));
          //     if((this.viewEnvelope[i].purposeDacCrs) !=null){
          //       ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('purdaccrs').patchValue(Number.parseInt(this.viewEnvelope[i].purposeDacCrs));
          //     }
          //   let currencyId = Number.parseInt(this.viewEnvelope[i].currency);
          //   this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
          //   ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('currency1').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
          //   let year=this.datepipe.transform(this.viewEnvelope[i].year, 'yyyy');
          //   for (let j = 0; j < this.exchangeRateList.length; j++) {
          //     if ((year).toString() == ((this.exchangeRateList[j].year).toString())) {
          //       this.mznValue = this.exchangeRateList[j].mznAmount;
          //       this.usdVAlue = this.exchangeRateList[j].usdAmount;

          //       this.mznValue = this.mznValue *  Number.parseFloat(this.viewEnvelope[i].amount);
          //       this.usdVAlue = this.usdVAlue *  Number.parseFloat(this.viewEnvelope[i].amount);
          //       ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('amtannenvmeti').patchValue((this.currencyPipe.transform(this.mznValue, " ")));
          //       ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('annenvamtusd').patchValue((this.currencyPipe.transform(this.usdVAlue, " ")));
          //        /* Get amount and convert it into float */
          //        this.totalAmnt=0
          //        this.inputAmount = Number.parseFloat(this.viewEnvelope[i].amount);
          //        /* calculate total amount */
          //        this.totalAmnt = this.totalAmnt + this.inputAmount;
          //        this.totalAmntMzn = 0
          //        this.totalAmntUsd = 0;

          //        this.totalAmntMzn = this.mznValue;
          //        this.totalAmntUsd =  this.usdVAlue ;
          //      }
          //   }
          //   console.log("end yr ",this.viewEnvelope[i].endYear)
          //   if(this.viewEnvelope[i].endYear !=null)
          //   ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('endYear').patchValue(this.viewEnvelope[i].endYear);
          //   let envRef = this.envelopeForm.controls['envelopeReference'].value;
          //   this.totalUnProgram=0;
          //   this.totalUnProgramMZN=0;
          //   this.totalUnProgramUSD=0
          //   let allocatedAmount=0
          //   let allocatedAmountMZn=0;
          //   let allocatedAmntUsd=0;
          //   for(let k=0;k<this.financialList.length;k++){
          //     if(envRef == this.financialList[k].envelopeReference){
          //       allocatedAmount+=this.financialList[k].allocatedAmount;
          //       allocatedAmountMZn +=this.financialList[k].amountAllocatedInFaMzn
          //       allocatedAmntUsd +=this.financialList[k].amountAllocatedInFaUsd
          //       this.chkallocatedAmnt=true;
          //     }
          //   }
          //   if(allocatedAmount != 0){
          //   this.totalUnProgram =this.totalAmnt-allocatedAmount;
          //   this.totalUnProgramMZN=this.totalAmntMzn-allocatedAmountMZn;
          //   this.totalUnProgramUSD =this.totalAmntUsd-allocatedAmntUsd;
          // }else{
          //   this.totalUnProgram=this.totalAmnt;
          //   this.totalUnProgramMZN=this.totalAmntMzn;
          //   this.totalUnProgramUSD =this.totalAmntUsd;
          // }
          // }
        },
        /* If We get Any error then the error will show here
        *  Suppose we give a id that will not present in our db then it will show an error message
        */
        error => {

          console.log("error ", error);
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }

        });
    }

    /* This condition is checked that the id is null or not
     *  If  null then it doesn't patch any value
     *  If not null then it patch value (At Edit time)
     */
    if (this.id != null) {
      this.auto_save_as_draft_flag = false;
      this.id = this.route.snapshot.paramMap.get("id");
      this.totalAmnt = 0;
      /* Here we call service to get perticular values by given id  */
      this.envelopeServiceData.updateEnvelope(this.id).pipe(first()).subscribe(
        data => {
          this.updateEnvelope = data;
          
          this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
          this.getCurrencyDetails();
          this.getFinancialDetails();
          /* Here we call this method to get all purpose dac crs value */
          this.getPurposeDACCRS();
          /* Here we call this method to get all year list after add a row */
          // this.getExchangeRate();
          this.nodisplay = false;
          this.envelopeForm = this.fb.group({
            tableData: this.fb.array([
              this.fb.group({
                envagrcurr: ['', Validators.required],
                currency1: [{ value: '', disabled: true }],
                year: ['', Validators.required],
                endYear: [{ value: '', disabled: false }],
                exchangerateusd: [''],
                exchangeratemzn: [''],
                amtannenvmeti: [{ value: '', disabled: true }],
                annenvamtusd: [{ value: '', disabled: true }],
                searchCurrency: [''],
                purdaccrs: [''],
                purdaccrsSearch: [''],
                yearSearch: [''],
              }),
            ]),
            viewSaveAsDraft: new FormControl(''),
            donor: new FormControl('', [Validators.required]),
            envelopeReference: new FormControl('', [Validators.required]),
            currency2: new FormControl('', [Validators.required]),
            purdaccrs: new FormControl(''),
            comments: new FormControl('', [Validators.maxLength(1000)]),
          });

          /* Patch values  */
          for (let i = 0; i < this.updateEnvelope.length; i++) {
            this.enevelopIdUpdate = this.updateEnvelope[i].envelopeId;
            this.envelopeForm.controls['currency2'].enable();
            this.envelopeForm.controls.envelopeReference.setValue(this.updateEnvelope[i].envelopeReference);
            localStorage.setItem("refNM", this.updateEnvelope[i].envelopeReference);
            localStorage.setItem('envelopeReference', this.updateEnvelope[i].envelopeReference);
            this.envelopeForm.controls.donor.setValue(Number.parseInt(this.updateEnvelope[i].fundingOrganization));
            this.envelopeForm.controls.comments.setValue(this.updateEnvelope[i].comments);
            let currencyId = this.updateEnvelope[i].currencyMaster;
            this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);

            /* Here we call addYears method for add rows  */
            for (let j = 1; j < this.updateEnvelope[i].envelopeAllTableData.length; j++) {
              this.addYears();
            }

            try {



              for (let k = 0; k < this.updateEnvelope[i].envelopeAllTableData.length; k++) {
                //enable Table field

                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').enable();
                /* Disable Currency MZN USD field */
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').disable();

                //set table values
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').patchValue(this.updateEnvelope[i].envelopeAllTableData[k].startYear);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').patchValue(this.updateEnvelope[i].envelopeAllTableData[k].endYear);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').patchValue(this.currencyPipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].amount, " "));
                if ((this.updateEnvelope[i].envelopeAllTableData[k].purposeDacCrs) != null) {
                  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').patchValue((this.updateEnvelope[i].envelopeAllTableData[k].purposeDacCrs));
                }
                // let currencyId = Number.parseInt(this.updateEnvelope[i].envelopeAllTableData[k].currency);
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
                // this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);

                this.mznValue = 0;
                this.usdVAlue = 0;
                this.totalAmntMzn = 0
                this.totalAmntUsd = 0;
                let year = this.datepipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].startYear, 'yyyy');
                // for (let j = 0; j < this.exchangeRateList.length; j++) {
                //   if ((year).toString() == ((this.exchangeRateList[j].year).toString())) {
                //     this.mznValue = this.exchangeRateList[j].mznAmount;
                //     this.usdVAlue = this.exchangeRateList[j].usdAmount;

                //     this.mznValue = this.mznValue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                //     this.usdVAlue = this.usdVAlue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                //     ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').patchValue((this.currencyPipe.transform(this.mznValue, " ")));
                //     ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').patchValue((this.currencyPipe.transform(this.usdVAlue, " ")));
                //   }

                // }
                this.exchangeRateService.getExchangeRate().toPromise().then(data => {
                  console.log("data----->",data);
                  this.exchangeRateList=data;
                  for (let j = 0; j < this.exchangeRateList.length; j++) {
                    if ((year).toString() == ((this.exchangeRateList[j].year).toString())) {
                      this.mznValue = this.exchangeRateList[j].mznAmount;
                      this.usdVAlue = this.exchangeRateList[j].usdAmount;

                      this.mznValue = this.mznValue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                      this.usdVAlue = this.usdVAlue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                      ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').patchValue((this.currencyPipe.transform(this.mznValue, " ")));
                      ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').patchValue((this.currencyPipe.transform(this.usdVAlue, " ")));
                    
                      let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').value;
                      if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
                        mznAmount = mznAmount.split(",").join("");
                        this.totalAmntMzn += Number.parseFloat(mznAmount);
                      }
    
                      let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').value;
                      if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                        usdAmount = usdAmount.split(",").join("");
                        this.totalAmntUsd += Number.parseFloat(usdAmount);
                      }
                    }
                  }
                });


                // ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').patchValue(this.currencyPipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].amountMzn, " "));
                // ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').patchValue(this.currencyPipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].usdAmount, " "));

                /* Get amount and convert it into float */
                this.inputAmount = Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                /* calculate total amount */
                // this.totalAmnt = this.totalAmnt + this.inputAmount;
              
                this.totalAmnt = 0;
                for (let k = 0; k < this.tableData1.length; k++) {

                  let dat = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').value;
                  if (dat != undefined && dat != null && dat.trim() != '') {
                    dat = dat.split(",").join("");
                    this.totalAmnt += Number.parseFloat(dat);
                  }

                  let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').value;
                  if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
                    mznAmount = mznAmount.split(",").join("");
                    this.totalAmntMzn += Number.parseFloat(mznAmount);
                  }

                  let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').value;
                  if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
                    usdAmount = usdAmount.split(",").join("");
                    this.totalAmntUsd += Number.parseFloat(usdAmount);
                  }
                }
                // let crncyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);

              }

              let envRef = this.envelopeForm.controls['envelopeReference'].value;
              this.totalUnProgram = 0;
              this.totalUnProgramMZN = 0;
              this.totalUnProgramUSD = 0
              let allocatedAmount = 0
              let allocatedAmountMZn = 0;
              let allocatedAmntUsd = 0;
              //  debugger
              //  this.getFinancialDetails().toPromise().then(data=>{
              //   for(let k=0;k<this.financialList.length;k++){
              //     if(envRef == this.financialList[k].envelopeReference){
              //       allocatedAmount+=this.financialList[k].allocatedAmount;
              //       allocatedAmountMZn +=this.financialList[k].amountAllocatedInFaMzn
              //       allocatedAmntUsd +=this.financialList[k].amountAllocatedInFaUsd
              //       this.chkallocatedAmnt=true;
              //     }
              //   }


              this.envelopeServiceData.getFinancialDetails().toPromise().then(data => {
                this.financialList = data;
                
                for (let k = 0; k < this.financialList.length; k++) {
                  if (envRef == this.financialList[k].envelopeReference) {
                    allocatedAmount += this.financialList[k].allocatedAmount;
                    allocatedAmountMZn += this.financialList[k].amountAllocatedInFaMzn
                    allocatedAmntUsd += this.financialList[k].amountAllocatedInFaUsd
                    this.chkallocatedAmnt = true;
                  }
                }


                if (allocatedAmount != 0) {
                  this.totalUnProgram = this.totalAmnt - allocatedAmount;
                  this.totalUnProgramMZN = this.totalAmntMzn - allocatedAmountMZn;
                  this.totalUnProgramUSD = this.totalAmntUsd - allocatedAmntUsd;
                } else {
                  this.totalUnProgram = this.totalAmnt;
                  this.totalUnProgramMZN = this.totalAmntMzn;
                  this.totalUnProgramUSD = this.totalAmntUsd;
                }
                this.chkUnPrgValueAtEdit = allocatedAmount;
              });


            }
            catch (e) {
              console.log(e);
            }
          }
          console.log("myArray  ", data)
        },
        /* If We get Any error then the error will show here
         *  Suppose we give a id that will not present in our db then it will show an error message
         */
        error => {

          console.log("error ", error);
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      );
      // this.envelopeForm.controls['currency2'].enable();
    }

    this.fn = (evt: KeyboardEvent) => {
      if (evt.keyCode === DOWN_ARROW || evt.keyCode === UP_ARROW) {
        if (this.value.length === 1 && this.value[0] === 'No data') {
          evt.stopPropagation();
        }
      }
    }
    document.addEventListener('keydown', this.fn, true);

  }


  public hasError = (controlName: string, errorName: string) => {
    return this.envelopeForm.controls[controlName].hasError(errorName);
  };

  ngOnDestroy() {
    if (this.auto_save_as_draft_flag == true) {
      this.autoSaveAsDraftDetails();
    }
    document.removeEventListener('keydown', this.fn);
  }
  autoSaveAsDraft() {
    this.auto_save_as_draft_flag = true
  }
  UserAccessList!: UserAccessClass[];
  // private getAllDNGDPADMINEmail() {
  //   this.userAccessService.getUserAccessDetailsEmail().subscribe(data => {
  //     this.UserAccessList = data;
  //     console.log("this.UserAccessList ",this.UserAccessList)
  //   });
  // }


  /* After save data successfully then it will redirect to view page */
  moveToEnvelopeTab() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/admin/view-envelope']));
  }

  //for notification alert execute on save disbursement Author: Sourav Kumar Nayak
  saveEnvelopeInsertAlert() {
    console.log("funding org email ", this.fundingOrgEmail)
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Envelope Reference ID "'
      + this.envelopeForm.controls['envelopeReference'].value
      + '" for Funding Organization "'
      + this.findFundingNameById(this.envelopeForm.controls['donor'].value)
      + '" created in the AIMS on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Envelope Reference ID "'
      + this.envelopeForm.controls['envelopeReference'].value
      + '" for Funding Organization "'
      + this.findFundingNameById(this.envelopeForm.controls['donor'].value)
      + '" created in the AIMS by user "' + this.userNameForNotification + '" on "'
      + ((todayTime + '').substring(0, 24)) + '" '
      + 'Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-envelope\\';

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';


    notificationDetails.notificationGroup = this.usergroup;
    notificationDetails.updatedBy = this.userNameForNotification;
    notificationDetails.notificationMsg = this.userNameForNotification + " has created envelope on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.goToViewEnvelope();
    });
  }

  //for notification alert
  private findFundingNameById(id: number): string {
    let fundingName: string = null;
    for (let i = 0; i < this.fundingOrganizationList.length; i++) {
      if (this.fundingOrganizationList[i].id == id) {
        fundingName = this.fundingOrganizationList[i].names;
      }
    }
    return fundingName;
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Create Envelope') {
        this.authorised_flag = true;
      }
    }
  }

  //for notification alert execute on update disbursement
  envelopeUpdateAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();
    //email subject
    let subjectForEmail: string = 'Envelope Reference ID "'
      + this.envelopeForm.controls['envelopeReference'].value
      + '" for Funding Organization "'
      + this.findFundingNameById(this.envelopeForm.controls['donor'].value)
      + '" modified on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Envelope Reference ID "'
      + this.envelopeForm.controls['envelopeReference'].value
      + '" for Funding Organization "'
      + this.findFundingNameById(this.envelopeForm.controls['donor'].value)
      + '" has been edited by user "' + this.userNameForNotification + '" in AIMS on "'
      + ((todayTime + '').substring(0, 24)) + '" '
      + 'Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-envelope\\' + this.id;

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotification;
    // notificationDetails.notificationMsg = this.userNameForNotification + " has update envelope on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.goToViewEnvelope();
  }
  updateEnv() {
    this.getValueByLang()
    this.envelopeServiceData.saveEnvelope(this.envelopeData).pipe(first()).subscribe(
      {
        next: () => {
          this.auto_save_as_draft_flag = false;
          if (this.id == null) {
            if (this.browserLang == 'en') {
              Swal.fire('Submitted successfully', '', 'success');
            } else {
              Swal.fire('Submetido com sucesso', '', 'success');
            }
          } else {
            if (this.browserLang == 'en') {
              Swal.fire('Updated successfully', '', 'success');
            } else {
              Swal.fire('Actualizado com sucesso', '', 'success');
            }
          }


          /* If data will store successfully then we call this method to go to view page */
          if (this.id == null) {
            this.saveEnvelopeInsertAlert();
          }
          else {
            this.envelopeUpdateAlert();
          }
        },
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      }
    );
  }
  /* Here we take data from front end and Go to backend to save data in db   */
  saveEnvelope() {
    this.getValueByLang()
    this.envelopeServiceData.saveEnvelope(this.envelopeData).pipe(first()).subscribe(
      {
        next: () => {
          this.auto_save_as_draft_flag = false;
          if (this.id == null) {
            if (this.browserLang == 'en') {
              Swal.fire('Submitted successfully', '', 'success');
            } else {
              Swal.fire('Submetido com sucesso', '', 'success');
            }
          } else {
            if (this.browserLang == 'en') {
              Swal.fire('Updated successfully', '', 'success');
            } else {
              Swal.fire('Actualizado com sucesso', '', 'success');
            }
          }


          /* If data will store successfully then we call this method to go to view page */
          if (this.id == null) {
            this.saveEnvelopeInsertAlert();
          }
          else {
            this.envelopeUpdateAlert();
          }
        },
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      }
    );
  }

  /* If data save successfully in db then it will redirect to view page */
  goToViewEnvelope() {
    this.router.navigate(['/admin/view-envelope']);
    this.getSaveAsDrfat();
  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* Whenever we click on submit button then it will show an alert */
  opensweetalert() {
    this.getValueByLang();
    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: (this.id == null) ? ((this.browserLang == 'en') ? 'Do you want to Submit?' : 'Deseja Submeter?') : ((this.browserLang == 'en') ? 'Do you want to Update?' : 'Você deseja atualizar?'),
      // title: (this.id==null) ?  'Do you want to Submit?':'Do you want to Update?',
      showDenyButton: true,
      // confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
      confirmButtonText: (this.id == null) ? ((this.browserLang == 'en') ? `Submit` : 'Submeter') : ((this.browserLang == 'en') ? `Update` : 'Actualizar'),
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* If we click on submit button then we can save data */
      if (result.isConfirmed) {
        this.envelopeData.envelopeId = this.id;
        if (this.enveolopeSaveAsDraftId != null || this.enveolopeSaveAsDraftId != '' || this.enveolopeSaveAsDraftId != undefined) {
          this.envelopeData.saveAsDraftId = this.enveolopeSaveAsDraftId;
        }

        this.envelopeData.fundingOrganization = this.envelopeForm.controls['donor'].value;
        this.envelopeData.envelopeReference = this.envelopeForm.controls['envelopeReference'].value;
        this.envelopeData.currencyMaster = (this.envelopeForm.controls['currency2'].value)
        this.envelopeData.language = localStorage.getItem("browserLang");
        this.envelopeData.comments = this.envelopeForm.controls['comments'].value;
        var jsa = new Array();

        /* Here we get all table data and store in an array */
        for (let i = 0; i < this.tableData1.length; i++) {
          var json: any = {};
          let yearr = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
          if (yearr != "" && yearr != null) {
            var startYear = this.datepipe.transform(yearr, 'yyyy');
            var startmonth = this.datepipe.transform(yearr, 'MMM');
            var startdate = this.datepipe.transform(yearr, 'dd');
            yearr = startdate + '-' + startmonth + '-' + startYear;

          }

          if (yearr == null) {
            yearr = '';
          }
          var year = (yearr).toString();

          let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').value;
          if (endYear != "" && endYear != null) {
            var endyear = this.datepipe.transform(endYear, 'yyyy');
            var endmonth = this.datepipe.transform(endYear, 'MMM');
            var enddate = this.datepipe.transform(endYear, 'dd');
            endYear = enddate + '-' + endmonth + '-' + endyear;
          }

          if (endYear == null) {
            endYear = '';
          }
          var endYearr = (endYear).toString();

          let amnt = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
          if (amnt == null) {
            amnt = '';
          }
          var amount = (amnt).toString();
          // let crncy = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').value;
          // if (crncy == null) {
          //   crncy = ''
          // }
          // var cur = (crncy).toString();
          let puposeDacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').value;
          if (puposeDacCrs == null) {
            puposeDacCrs = '';
          }
          var dacCrs = (puposeDacCrs).toString();
          json.year = year;
          json.amount = amount;
          json.dacCrs = dacCrs;
          json.endYearr = endYearr;
          // json.cur = cur;
          jsa.push(json);

        };

        this.enevelopeJsa = new Array();
        for (let i = 0; i < jsa.length; i++) {
          var json = jsa[i];
          this.enevelopeTD = new EnvelopeTableData();
          this.enevelopeTD.startYear = json.year;
          this.enevelopeTD.endYear = json.endYearr;
          this.enevelopeTD.amount = json.amount;
          this.enevelopeTD.purposeDacCrs = json.dacCrs;
          // this.enevelopeTD.currency = json.cur;

          this.enevelopeJsa.push(this.enevelopeTD);
        }

        this.envelopeData.envelopTableData = JSON.stringify(this.enevelopeJsa);
        console.log("envelope values ", JSON.stringify(this.envelopeData));
        this.saveEnvelope();
      }
      /* If we click on cancel button then we can not store data in db */
      else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info');
        else {
          Swal.fire('Cancelado', '', 'info');
        }
      }
    });
  }
  opensweetalertUpdate() {
    this.getValueByLang();
    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: ((this.browserLang == 'en') ? 'Do you want to Update?' : 'Você deseja atualizar?'),
      showDenyButton: true,
      confirmButtonText: (this.id == null) ? ((this.browserLang == 'en') ? `Submit` : 'Submeter') : ((this.browserLang == 'en') ? `Update` : 'Actualizar'),
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* If we click on submit button then we can save data */
      if (result.isConfirmed) {
        this.envelopeData.envelopeId = this.id;
        if (this.enveolopeSaveAsDraftId != null || this.enveolopeSaveAsDraftId != '' || this.enveolopeSaveAsDraftId != undefined) {
          this.envelopeData.saveAsDraftId = this.enveolopeSaveAsDraftId;
        }

        this.envelopeData.fundingOrganization = this.envelopeForm.controls['donor'].value;
        this.envelopeData.envelopeReference = this.envelopeForm.controls['envelopeReference'].value;
        this.envelopeData.currencyMaster = (this.envelopeForm.controls['currency2'].value)
        this.envelopeData.language = localStorage.getItem("browserLang");
        this.envelopeData.comments = this.envelopeForm.controls['comments'].value;
        var jsa = new Array();

        /* Here we get all table data and store in an array */
        for (let i = 0; i < this.tableData1.length; i++) {
          var json: any = {};
          let yearr = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
          if (yearr != "" && yearr != null) {
            var startYear = this.datepipe.transform(yearr, 'yyyy');
            var startmonth = this.datepipe.transform(yearr, 'MMM');
            var startdate = this.datepipe.transform(yearr, 'dd');
            yearr = startdate + '-' + startmonth + '-' + startYear;

          }

          if (yearr == null) {
            yearr = '';
          }
          var year = (yearr).toString();

          let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').value;
          if (endYear != "" && endYear != null) {
            var endyear = this.datepipe.transform(endYear, 'yyyy');
            var endmonth = this.datepipe.transform(endYear, 'MMM');
            var enddate = this.datepipe.transform(endYear, 'dd');
            endYear = enddate + '-' + endmonth + '-' + endyear;
          }

          if (endYear == null) {
            endYear = '';
          }
          var endYearr = (endYear).toString();

          let amnt = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
          if (amnt == null) {
            amnt = '';
          }
          var amount = (amnt).toString();
          // let crncy = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').value;
          // if (crncy == null) {
          //   crncy = ''
          // }
          // var cur = (crncy).toString();
          let puposeDacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').value;
          if (puposeDacCrs == null) {
            puposeDacCrs = '';
          }
          var dacCrs = (puposeDacCrs).toString();
          json.year = year;
          json.amount = amount;
          json.dacCrs = dacCrs;
          json.endYearr = endYearr;
          // json.cur = cur;
          jsa.push(json);

        };

        this.enevelopeJsa = new Array();
        for (let i = 0; i < jsa.length; i++) {
          var json = jsa[i];
          this.enevelopeTD = new EnvelopeTableData();
          this.enevelopeTD.startYear = json.year;
          this.enevelopeTD.endYear = json.endYearr;
          this.enevelopeTD.amount = json.amount;
          this.enevelopeTD.purposeDacCrs = json.dacCrs;
          // this.enevelopeTD.currency = json.cur;

          this.enevelopeJsa.push(this.enevelopeTD);
        }

        this.envelopeData.envelopTableData = JSON.stringify(this.enevelopeJsa);
        console.log("envelope values ", JSON.stringify(this.envelopeData));
        this.updateEnv();
      }
      /* If we click on cancel button then we can not store data in db */
      else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info');
        else {
          Swal.fire('Cancelado', '', 'info');
        }
      }
    });
  }
  /* If you are not fill all mandatory fields then it will give an alert */
  openMandatoryAlert() {
    this.getValueByLang();
    if (this.browserLang == 'en')
      Swal.fire('Please fill all mandatory fields.')
    else
      Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  /* Here we take data from front end and Go to backend to save data in db as save as draft  */
  saveAsDraftEnvelope() {
    this.envelopeServiceData.saveAsDraftEnvelope(this.envelopeData).pipe(first()).subscribe(
      {
        next: () => {
          /* If data will save successfully then we have to stay in the same page */
          this.auto_save_as_draft_flag = false;
          this.goToCreateEnvelope();
        },
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      }
    );
  }
  saveAsDraftEnvelopeForAutoSAD() {
    this.getValueByLang();
    this.envelopeServiceData.saveAsDraftEnvelope(this.envelopeData).pipe(first()).subscribe(
      {
        next: () => {
          /* If data will save successfully then we have to stay in the same page */
          this.auto_save_as_draft_flag = false;
          if (this.browserLang == 'en')
            Swal.fire('Envelope data saved as Draft succesfully', '', 'success');
          else
            Swal.fire('Dados do Envelope salvos como Rascunho com sucesso', '', 'success');
        },
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      }
    );
  }
  /* If save as drfat data will save successfully then it will call this method */
  goToCreateEnvelope() {

    this.totalAmnt = 0;
    this.envelopeForm.reset();
    this.envelopeForm = this.fb.group({
      tableData: this.fb.array([
        this.fb.group({

          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),

        this.fb.group({
          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),
        this.fb.group({
          envagrcurr: [{ value: '', disabled: true }, Validators.required],
          currency1: [{ value: '', disabled: true }, Validators.required],
          year: [{ value: '', disabled: true }, Validators.required],
          endYear: [{ value: '', disabled: true }],
          exchangerateusd: [''],
          exchangeratemzn: [''],
          amtannenvmeti: [{ value: '', disabled: true }],
          annenvamtusd: [{ value: '', disabled: true }],
          searchCurrency: [''],
          purdaccrs: [{ value: '', disabled: true }],
          purdaccrsSearch: [''],
          yearSearch: [''],
        }),
      ]),
      viewSaveAsDraft: new FormControl(''),
      donor: new FormControl('', [Validators.required]),
      envelopeReference: new FormControl('', [Validators.required]),
      purdaccrs: new FormControl(''),
      comments: new FormControl('', [Validators.maxLength(1000)]),
      currency2: new FormControl('', Validators.required),
    });
    this.getValueByLang()
    this.router.navigate(['/admin/envelope']);
    if (this.browserLang == 'en')
      Swal.fire('Submitted successfully', '', 'success');
    else
      Swal.fire('Submetido com sucesso', '', 'success');
    this.getSaveAsDrfat();
  }
  enveolopeSaveAsDraftId: string = "";
  /* Whenever we click on save as draft button then it will show an alert */
  opensweetalert2() {
    this.getValueByLang()
    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: (this.browserLang == 'en') ? 'Do you want to Save as Draft?' : 'Quer salvar como rascunho?',
      showDenyButton: true,

      confirmButtonText: (this.browserLang == 'en') ? `Submit` : 'Enviar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {

      /* If we click on submit button then we can save data in db*/
      if (result.isConfirmed) {
        /* code for save as draft start */
        this.envelopeData.envelopeId = this.enveolopeSaveAsDraftId;
        this.enveolopeSaveAsDraftId = "";
        this.envelopeData.fundingOrganization = this.envelopeForm.controls['donor'].value;
        this.envelopeData.envelopeReference = this.envelopeForm.controls['envelopeReference'].value;
        this.envelopeData.currencyMaster = (this.envelopeForm.controls['currency2'].value)
        this.envelopeData.purposeDacCrs = this.envelopeForm.controls['purdaccrs'].value;
        this.envelopeData.comments = this.envelopeForm.controls['comments'].value;
        this.envelopeData.usergroup = this.usergroup;
        var jsa = new Array();
        /* Here we take all table data and store in an array */
        for (let i = 0; i < this.tableData1.length; i++) {
          var json: any = {};
          let yearr = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
          if (yearr != "" && yearr != null) {
            var startYear = this.datepipe.transform(yearr, 'yyyy');
            var startmonth = this.datepipe.transform(yearr, 'MMM');
            var startdate = this.datepipe.transform(yearr, 'dd');
            yearr = startdate + '-' + startmonth + '-' + startYear;

          }
          if (yearr == null) {
            yearr = '';
          }
          var year = (yearr).toString();
          let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').value;
          if (endYear != "" && endYear != null) {
            var endyear = this.datepipe.transform(endYear, 'yyyy');
            var endmonth = this.datepipe.transform(endYear, 'MMM');
            var enddate = this.datepipe.transform(endYear, 'dd');
            endYear = enddate + '-' + endmonth + '-' + endyear;
          }

          if (endYear == null) {
            endYear = '';
          }
          var endYearr = (endYear).toString();
          let amnt = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
          if (amnt == null) {
            amnt = '';
          }
          var amount = (amnt).toString();
          // let crncy = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').value;
          // if (crncy == null) {
          //   crncy = ''
          // }
          // var cur = (crncy).toString();
          let puposeDacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').value;
          if (puposeDacCrs == null) {
            puposeDacCrs = '';
          }
          var dacCrs = (puposeDacCrs).toString();
          json.year = year;
          json.endYearr = endYearr;
          json.amount = amount;
          // json.cur = cur;
          json.dacCrs = dacCrs;
          jsa.push(json);

        };

        this.enevelopeJsa = new Array();
        for (let i = 0; i < jsa.length; i++) {
          var json = jsa[i];
          this.enevelopeTD = new EnvelopeTableData();
          this.enevelopeTD.startYear = json.year;
          this.enevelopeTD.endYear = json.endYearr;
          this.enevelopeTD.amount = json.amount;
          this.enevelopeTD.purposeDacCrs = json.dacCrs;
          // this.enevelopeTD.currency = json.cur;
          this.enevelopeJsa.push(this.enevelopeTD);
        }
        this.envelopeData.envelopTableData = JSON.stringify(this.enevelopeJsa);
        console.log("envelope SD values ", JSON.stringify(this.envelopeData));
        this.saveAsDraftEnvelope();
        /* code for save as draft end */

      }
      /* If we click on cancel button then we can not save data */
      else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info');
        else
          Swal.fire('Cancelado', '', 'info');
      }
    });
  }

  autoSaveAsDraftDetails() {
    this.envelopeData.envelopeId = this.enveolopeSaveAsDraftId;
    this.enveolopeSaveAsDraftId = "";
    this.envelopeData.fundingOrganization = this.envelopeForm.controls['donor'].value;
    this.envelopeData.envelopeReference = this.envelopeForm.controls['envelopeReference'].value;
    this.envelopeData.currencyMaster = (this.envelopeForm.controls['currency2'].value)
    this.envelopeData.purposeDacCrs = this.envelopeForm.controls['purdaccrs'].value;
    this.envelopeData.comments = this.envelopeForm.controls['comments'].value;
    this.envelopeData.usergroup = this.usergroup;
    var jsa = new Array();
    /* Here we take all table data and store in an array */
    for (let i = 0; i < this.tableData1.length; i++) {
      var json: any = {};
      let yearr = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
      if (yearr != "" && yearr != null) {
        var startYear = this.datepipe.transform(yearr, 'yyyy');
        var startmonth = this.datepipe.transform(yearr, 'MMM');
        var startdate = this.datepipe.transform(yearr, 'dd');
        yearr = startdate + '-' + startmonth + '-' + startYear;

      }
      if (yearr == null) {
        yearr = '';
      }
      var year = (yearr).toString();
      let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').value;
      if (endYear != "" && endYear != null) {
        var endyear = this.datepipe.transform(endYear, 'yyyy');
        var endmonth = this.datepipe.transform(endYear, 'MMM');
        var enddate = this.datepipe.transform(endYear, 'dd');
        endYear = enddate + '-' + endmonth + '-' + endyear;
      }

      if (endYear == null) {
        endYear = '';
      }
      var endYearr = (endYear).toString();
      let amnt = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
      if (amnt == null) {
        amnt = '';
      }
      var amount = (amnt).toString();
      // let crncy = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').value;
      // if (crncy == null) {
      //   crncy = ''
      // }
      // var cur = (crncy).toString();
      let puposeDacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').value;
      if (puposeDacCrs == null) {
        puposeDacCrs = '';
      }
      var dacCrs = (puposeDacCrs).toString();
      json.year = year;
      json.endYearr = endYearr;
      json.amount = amount;
      // json.cur = cur;
      json.dacCrs = dacCrs;
      jsa.push(json);

    };

    this.enevelopeJsa = new Array();
    for (let i = 0; i < jsa.length; i++) {
      var json = jsa[i];
      this.enevelopeTD = new EnvelopeTableData();
      this.enevelopeTD.startYear = json.year;
      this.enevelopeTD.endYear = json.endYearr;
      this.enevelopeTD.amount = json.amount;
      this.enevelopeTD.purposeDacCrs = json.dacCrs;
      // this.enevelopeTD.currency = json.cur;
      this.enevelopeJsa.push(this.enevelopeTD);
    }
    this.envelopeData.envelopTableData = JSON.stringify(this.enevelopeJsa);
    console.log("envelope SD values ", JSON.stringify(this.envelopeData));
    this.saveAsDraftEnvelopeForAutoSAD();
  }

  /* If we select add new donor in funding organization then it will redirect to DialogBoxComponent */
  openDialog() {

    if (this.envelopeForm.controls.donor.value == 'optionAddFundingOrg') {
      this.fundingOrganization = true;

    }
    const dialogRef = this.dialog.open(DialogBoxComponent);
    localStorage.setItem("dataKey", "Donor");
    localStorage.setItem("checkModule", "Envelope");
    dialogRef.afterClosed().subscribe((result) => {
      this.newFundingOrg = localStorage.getItem("fundingOrgNm");
      this.newFundingOrgId = localStorage.getItem("fundingOrgNmId");
      this.getFundingOrg();
      this.envelopeForm.controls.donor.patchValue(Number.parseInt(this.newFundingOrgId));
    });
  }

  clearStartDate(event, index: number) {
    event.stopPropagation();
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').reset();
  }
  clearEndDate(event, index: number) {
    event.stopPropagation();
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('endYear').reset();
  }

  /* If you click on reset button then it will clear all field that you written or selected */
  clearForm(form: FormGroup) {
    form.reset();
    this.envelopeForm.controls['currency2'].disable();
    for (let i = 0; i < this.tableData1.length; i++) {
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').disable();
    }
    this.totalAmnt = 0;
    this.totalAmntMzn = 0;
    this.totalAmntUsd = 0;
    this.totalUnProgramMZN = 0;
    this.totalUnProgramUSD = 0;
    this.totalUnProgram = 0;
    this.enveolopeSaveAsDraftId = "";
  }
  /* Service Call for get FundingOrganization List */
  private getFundingOrg() {
    if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
      this.organizationCrudServiceService.getFundingOrgDetailsByUserAccessId(this.userId).subscribe(data => {
        this.fundingOrganizationList = data;
        console.log("this.fundingOrganizationList by user access : ", this.fundingOrganizationList)
        this.fundingOrganizationfilteredOption = this.donor.valueChanges
          .pipe(
            startWith(''),
            map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())
          );
      });
    }
    else {
      this.organizationCrudServiceService.getFundingOrganizationDetails().subscribe(data => {
        this.fundingOrganizationList = data;
        console.log("this.fundingOrganizationList ", this.fundingOrganizationList)
        this.fundingOrganizationfilteredOption = this.donor.valueChanges
          .pipe(
            startWith(''),
            map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())
          );
      });
    }
  }
  createDt: any;
  today: any;
  dacCrsCrtDt: any = [];
  /* Here we call service to get all purpose dac crs code that will present in db */
  private getPurposeDACCRS() {
    this.purposeDACCRSService.getPurposeCodesThreeDetails().subscribe(data => {
      this.purposeDACCRS = data;
      for (let i = 0; i < this.purposeDACCRS.length; i++) {
        let crtDt = this.purposeDACCRS[i].createdOn;
        let updateDt = this.purposeDACCRS[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.purposeDACCRS[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.purposeDACCRS[i].updateDifference = days_differenceForUpdate;
        }
        (this.purposeDACCRS[i].difference) = days_difference;
      }
      for (let i = 0; i < (this.envelopeForm.get('tableData') as FormArray).length; i++) {

        this.purposeDACCRSfilteredOption[i] = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('purdaccrsSearch').valueChanges
          .pipe(
            startWith(''),
            map(name => name ? this.filterpurposeDACCRS(name) : this.purposeDACCRS.slice())
          );

      }
    });
  }

  /* Here we call service to get all currency list that will present in db */
  private getCurrencyDetails() {
    this.currencyService.getCurrencyDetails().subscribe(data => {
      this.currenyList = data;
      for (let i = 0; i < this.currenyList.length; i++) {
        let crtDt = this.currenyList[i].createdOn;
        let updateDt = this.currenyList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.currenyList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.currenyList[i].updateDifference = days_differenceForUpdate;
        }
        (this.currenyList[i].difference) = days_difference;
      }
      console.log("this.currenyList ", this.currenyList)
      for (let i = 0; i < (this.envelopeForm.get('tableData') as FormArray).length; i++) {
        this.currencyfilteredOption[i] = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('searchCurrency').valueChanges

          .pipe(
            startWith(''),
            map(name => name ? this.filterCurrency(name) : this.currenyList.slice())
          );
      }
    });
  }

  /* Here purpose dac crs is filtered*/
  private filterpurposeDACCRS(name: string) {
    if (this.browserLang == 'en') {
      return this.purposeDACCRS.filter(purposeDACCRSData =>
        purposeDACCRSData.name_EN.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase().indexOf(name.toLowerCase()) !== -1 || (purposeDACCRSData.dac_code + '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    } else {
      return this.purposeDACCRS.filter(purposeDACCRSData =>
        purposeDACCRSData.name_PT.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase().indexOf(name.toLowerCase()) !== -1 || (purposeDACCRSData.dac_code + '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }


  }

  /* Here currency is filtered */
  private filterCurrency(name: string) {
    return this.currenyList.filter(currencyData =>
      currencyData.currency_fullname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 || currencyData.currency_shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  private getCurrencyData() {
    this.currencyService.getCurrencyDetails().subscribe(data => {
      this.currenyListAll = data;
      for (let i = 0; i < this.currenyListAll.length; i++) {
        let crtDt = this.currenyListAll[i].createdOn;
        let updateDt = this.currenyListAll[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.currenyListAll[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.currenyListAll[i].updateDifference = days_differenceForUpdate;
        }
        (this.currenyListAll[i].difference) = days_difference;
      }
      console.log("this.currency", data)
      this.currencyfilteredOptionData = this.currency2.valueChanges
        .pipe(
          startWith(''),
          map(currency => currency ? this.filterCurrency2(currency) : this.currenyListAll.slice())

        );


    });
  }
  private filterCurrency2(name: string) {
    return this.currenyListAll.filter(currency =>
      currency.currency_fullname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 || currency.currency_shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  /* It will take only number didn't accept any character */
  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }
  chkCrntAmnt: any = 0;
  chkCurrentAmount(j) {
    this.chkCrntAmnt = 0;
    this.chkCrntAmnt = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').value;
    if (this.chkCrntAmnt != undefined && this.chkCrntAmnt != null && this.chkCrntAmnt.trim() != '') {
      this.chkCrntAmnt = this.chkCrntAmnt.split(",").join("");
    }
  }
  /* It will format the given amount and calculate mzn usd value */
  onBlur(value, j) {
    this.getValueByLang()
    this.amount = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').value;
    /* This will check that amount is null or not
    *  If amount is not null then it will format that input value and find mzn usd value
    *  Otherwise it give an alert to fill the amount first
    */

    this.dacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').value;
    if (this.amount != null && this.amount != '' && this.amount != undefined) {
      value = value.split(",").join("");
      let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
      // this.mznValue = 0;
      // this.usdVAlue = 0;
      this.year = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').value;
      this.year = this.datepipe.transform(this.year, 'yyyy');
      //   for (let i = 0; i < this.exchangeRateList.length; i++) {
      //     if (this.year == (this.exchangeRateList[i].year).toString()) {
      //      // if (this.year == (this.exchangeRateList[i].exchangeRateId).toString()) {
      //      if (this.exchangeRateList[i].currency == currencyId.toString()) {
      //        this.mznValue = this.exchangeRateList[i].mznAmount;
      //        this.usdVAlue = this.exchangeRateList[i].usdAmount;
      //       }
      //    }
      //  }
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').setValue(this.currencyPipe.transform(value, " "));
      let mzn = this.mznValue * Number.parseFloat(this.amount);
      let usd = this.usdVAlue * Number.parseFloat(this.amount);
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').setValue(this.currencyPipe.transform(mzn, " "));
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').setValue(this.currencyPipe.transform(usd, " "));
      let lastIndex = this.tableData1.length;
      if (lastIndex - 1 != j) {
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').enable();
      }
      //this.totalAmnt=this.totalAmnt+this.inputAmount;
    } else {
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').disable();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
      let lastIndex = this.tableData1.length;
      if (lastIndex - 1 != j) {

        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').reset();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('purdaccrs').reset();
        //((this.envelopeForm.get('tableData') as FormArray).at(j+1) as FormGroup).get('currency1').reset();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('envagrcurr').reset();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('amtannenvmeti').reset();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('annenvamtusd').reset();

        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('purdaccrs').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('currency1').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('envagrcurr').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('amtannenvmeti').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('annenvamtusd').disable();
      }

      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      if (this.browserLang == 'en') {
        Swal.fire({
          title: 'Kindly fill amount',
          confirmButtonText: `OK`,
        })
      } else {
        Swal.fire({
          title: 'Preencha o valor',
          confirmButtonText: `OK`,
        })
      }

    }
    this.totalAmnt = 0;
    this.totalAmntMzn = 0
    this.totalAmntUsd = 0;
    for (let i = 0; i < this.tableData1.length; i++) {

      let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
      if (dat != undefined && dat != null && dat.trim() != '') {
        dat = dat.split(",").join("");
        this.totalAmnt += Number.parseFloat(dat);
      }

      let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
      if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
        mznAmount = mznAmount.split(",").join("");
        this.totalAmntMzn += Number.parseFloat(mznAmount);
      }

      let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
      if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
        usdAmount = usdAmount.split(",").join("");
        this.totalAmntUsd += Number.parseFloat(usdAmount);
      }
    }
    let totalAmountGrtr = false;
    if (this.id != null) {
      if (this.totalAmnt <= this.chkUnPrgValueAtEdit) {
        // this.totalAmnt=this.totalAmnt+ Number.parseFloat(this.chkCrntAmnt);
        totalAmountGrtr = true;
        this.getValueByLang();
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').setValue(this.currencyPipe.transform(Number.parseFloat(this.chkCrntAmnt), ' '))
        if (this.browserLang == 'en')
          Swal.fire('Total amount should be greater than from Un-programmed amount.')
        else
          Swal.fire('O valor total deve ser maior do que o valor não programado.')
      }
    }
    if (totalAmountGrtr == true) {
      this.totalAmnt = 0;
      this.totalAmntMzn = 0
      this.totalAmntUsd = 0;
      if (this.chkCrntAmnt != null && this.chkCrntAmnt != '' && this.chkCrntAmnt != undefined) {
        value = value.split(",").join("");
        let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
        this.mznValue = 0;
        this.usdVAlue = 0;
        this.year = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').value;
        this.year = this.datepipe.transform(this.year, 'yyyy');
        for (let i = 0; i < this.exchangeRateList.length; i++) {
          if (this.year == (this.exchangeRateList[i].year).toString()) {
            // if (this.year == (this.exchangeRateList[i].exchangeRateId).toString()) {
            if (this.exchangeRateList[i].currency == currencyId.toString()) {
              this.mznValue = this.exchangeRateList[i].mznAmount;
              this.usdVAlue = this.exchangeRateList[i].usdAmount;
            }
          }
        }
        // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').setValue(this.currencyPipe.transform(value, " "));
        let mzn = this.mznValue * Number.parseFloat(this.chkCrntAmnt);
        let usd = this.usdVAlue * Number.parseFloat(this.chkCrntAmnt);
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').setValue(this.currencyPipe.transform(mzn, " "));
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').setValue(this.currencyPipe.transform(usd, " "));

      }
      for (let i = 0; i < this.tableData1.length; i++) {

        let dat = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('envagrcurr').value;
        if (dat != undefined && dat != null && dat.trim() != '') {
          dat = dat.split(",").join("");
          this.totalAmnt += Number.parseFloat(dat);
        }

        let mznAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('amtannenvmeti').value;
        if (mznAmount != undefined && mznAmount != null && mznAmount.trim() != '') {
          mznAmount = mznAmount.split(",").join("");
          this.totalAmntMzn += Number.parseFloat(mznAmount);
        }

        let usdAmount = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('annenvamtusd').value;
        if (usdAmount != undefined && usdAmount != null && usdAmount.trim() != '') {
          usdAmount = usdAmount.split(",").join("");
          this.totalAmntUsd += Number.parseFloat(usdAmount);
        }
      }

    }
    let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);
    let envRef = this.envelopeForm.controls['envelopeReference'].value;
    this.totalUnProgram = 0;
    this.totalUnProgramMZN = 0;
    this.totalUnProgramUSD = 0
    let allocatedAmount = 0
    let allocatedAmountMZn = 0;
    let allocatedAmntUsd = 0;
    for (let k = 0; k < this.financialList.length; k++) {
      // if(currencyId == this.financialList[k].financialAgreementCurrency){
      if (envRef == this.financialList[k].envelopeReference) {
        allocatedAmount += this.financialList[k].allocatedAmount;
        allocatedAmountMZn += this.financialList[k].amountAllocatedInFaMzn
        allocatedAmntUsd += this.financialList[k].amountAllocatedInFaUsd

      }
    }
    if (this.chkallocatedAmnt == false) {
      if (this.totalAmnt != 0) {
        this.totalUnProgram = this.totalAmnt;
        this.totalUnProgramMZN = this.totalAmntMzn;
        this.totalUnProgramUSD = this.totalAmntUsd;
      } else {
        this.totalUnProgram = 0;
        this.totalUnProgramMZN = 0;
        this.totalUnProgramUSD = 0;
      }
    } else {
      if (this.totalAmnt != 0) {
        this.totalUnProgram = this.totalAmnt - allocatedAmount;
        this.totalUnProgramMZN = this.totalAmntMzn - allocatedAmountMZn;
        this.totalUnProgramUSD = this.totalAmntUsd - allocatedAmntUsd;
      } else {
        this.totalUnProgram = 0;
        this.totalUnProgramMZN = 0;
        this.totalUnProgramUSD = 0;
      }
    }

    // if(allocatedAmount ==0){
    //   this.totalUnProgram =this.totalAmnt
    // }
    // if(allocatedAmountMZn == 0){
    //   this.totalUnProgramMZN=this.totalAmntMzn
    // }
    // if(allocatedAmntUsd ==0){
    //   this.totalUnProgramUSD=this.totalAmntUsd
    // }
  }


  chkFundingOrg() {
    this.getValueByLang()
    this.fundingOrg = this.envelopeForm.controls['donor'].value;
    if (this.fundingOrg == null || this.fundingOrg == '' || this.fundingOrg == undefined) {
      this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency'];
      for (let j = 0; j < this.tableData1.length; j++) {

        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
        ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
        if (this.EditEnv != 'EditEnv') {
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
          // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
          //  this. resetAmount(event,j);
        } else if (this.EditEnv == 'EditEnv') {
          this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
        }
      }
      Swal.fire({
        title: (this.browserLang == 'en') ? 'Kindly Select Funding Organization' : 'Gentilmente selecione a organização de financiamento',
        confirmButtonText: `OK`,
      })
    }
  }

  /* This will enable year if funding organization is selected  */
  enableYear() {
    this.getValueByLang()
    this.currency = this.envelopeForm.controls['currency2'].value
    let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);

    if (this.currency != null && this.currency != '' && this.currency != undefined) {
      ((this.envelopeForm.get('tableData') as FormArray).at(0) as FormGroup).get('year').enable();
      for (let i = 0; i < this.tableData1.length; i++) {
        ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').disable();
        console.log("Data ", currencyId);
        ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
      }
    } else {
      Swal.fire({
        title: (this.browserLang == 'en') ? 'Kindly Select Currency' : 'Gentilmente selecione a moeda',
        confirmButtonText: `OK`,
      })
    }

  }
  dacCrs: any;
  /* This will enable amount if there is some value in year  */
  enableAmount(j) {
    this.getValueByLang()
    this.year = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').value;
    this.year = this.datepipe.transform(this.year, 'yyyy');
    // this.dacCrs=((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').value;

    let currencyId = Number.parseInt(this.envelopeForm.controls['currency2'].value);

    if (this.year == null || this.year == '' || this.year == undefined) {
      Swal.fire({
        title: (this.browserLang == 'en') ? 'Kindly Fill Year' : 'Preencha o ano gentilmente',
        confirmButtonText: `OK`,
      })
    }
    else {
      this.getValueByLang();
      this.nodisplay = false;
      this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
      this.mznValue = 0;
      this.usdVAlue = 0;
      let chkFoundYear = 0;
      // for (let i = 0; i < this.exchangeRateList.length; i++) {

      //  if (this.year == (this.exchangeRateList[i].year).toString()) {
      // if (this.year == (this.exchangeRateList[i].exchangeRateId).toString()) {
      // if (this.exchangeRateList[i].currency == currencyId.toString()) {

      let commitmentBomozom: BankOfMozambique = new BankOfMozambique();
      commitmentBomozom.year = this.year;
      commitmentBomozom.currency_id = currencyId.toString();
      this.envelopeService.getExchangeRateEnvelope(commitmentBomozom).subscribe(data => {
        console.log("data :", data);

        if (data.response === 'Currency found') {
          this.mznValue = data.exchange_rate_mzn;
          this.usdVAlue = data.exchange_rate_usd;

          /* reset filed */
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').enable();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').enable();
          ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').enable();
          // break;
          chkFoundYear = 1;
        } else {
          if (chkFoundYear == 0) {
            /* reset filed */
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
            let lastIndex = this.tableData1.length;
            if (lastIndex - 1 != j) {

              ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').reset();
              ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').disable();

            }


            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
            // if(this.browserLang=='en')
            // Swal.fire('The Currency for that year was not found in Exchange Administration page.');
            // else
            // Swal.fire('A Moeda para o ano seleccionado não foi encontrada na página de Administração de Câmbios.');
            if (this.browserLang == 'en') {
              Swal.fire({
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Add Exchange Rate',
                showCancelButton: true,
                title: 'The Currency for that year was not found in the Currency Exchange Administration page',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.openExchangeRateAdministration()
                } else if (result.isDenied) {
                  // Swal.fire('Cancelled', '', 'info');
                }
              });
            } else {
              Swal.fire({
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Adicionar taxa de câmbio',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                title: 'A Moeda para o ano seleccionado não foi encontrada na página de Administração de Taxas de Câmbio',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.openExchangeRateAdministration()
                } else if (result.isDenied) {
                  // Swal.fire('Cancelled', '', 'info');
                }
              });
            }
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();

            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').disable();

          }
        }
      });
      // this.mznValue = this.exchangeRateList[i].mznAmount;
      // this.usdVAlue = this.exchangeRateList[i].usdAmount;

      // /* reset filed */
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').enable();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').enable();
      // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').enable();
      // // break;
      // chkFoundYear=1;
      //  }
      // else{
      //   /* reset filed */
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
      //   let lastIndex=this.tableData1.length;
      //   if(lastIndex-1 != j){

      //     ((this.envelopeForm.get('tableData') as FormArray).at(j+1) as FormGroup).get('year').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j+1) as FormGroup).get('year').disable();

      //   }


      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      //   Swal.fire('Currency not Found in Exchange Administration Page for Given Year.');
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();

      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').disable();
      // }

      // }
      // }
      // if(chkFoundYear==0){
      //   /* reset filed */
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
      //   let lastIndex=this.tableData1.length;
      //   if(lastIndex-1 != j){

      //     ((this.envelopeForm.get('tableData') as FormArray).at(j+1) as FormGroup).get('year').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j+1) as FormGroup).get('year').disable();

      //   }


      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      //   // if(this.browserLang=='en')
      //   // Swal.fire('The Currency for that year was not found in Exchange Administration page.');
      //   // else
      //   // Swal.fire('A Moeda para o ano seleccionado não foi encontrada na página de Administração de Câmbios.');
      //   if(this.browserLang=='en'){
      //     Swal.fire({
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'Add Exchange Rate',
      //       showCancelButton: true,
      //       title: 'Currency not Found in Exchange Administration Page for Given Year.',
      //     }).then((result) => {
      //       /* Read more about isConfirmed, isDenied below */
      //       if (result.isConfirmed) {
      //         this.openExchangeRateAdministration()
      //       } else if (result.isDenied) {
      //         // Swal.fire('Cancelled', '', 'info');
      //       }
      //     });
      //   }else{
      //     Swal.fire({
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'Adicionar taxa de câmbio',
      //       showCancelButton: true,
      //       title: 'Moeda não encontrada na página de administração do Exchange para determinado ano.',
      //     }).then((result) => {
      //       /* Read more about isConfirmed, isDenied below */
      //       if (result.isConfirmed) {
      //         this.openExchangeRateAdministration()
      //       } else if (result.isDenied) {
      //         // Swal.fire('Cancelled', '', 'info');
      //       }
      //     });
      //   }
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();

      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').reset();
      //   ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
      //     ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').disable();

      // }
      // for (let i = 0; i < this.tableData1.length; i++) {
      //   if (j != i) {
      //     /* If same year choose again then it show an alert message */
      //     let crntChooseYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
      //     crntChooseYear = this.datepipe.transform(crntChooseYear, 'yyyy');
      //     if (this.year == crntChooseYear) {
      //       if(this.browserLang=='en')
      //       Swal.fire('This year has been already selected.', '', 'error');
      //       else
      //       Swal.fire('Este ano já foi selecionado.', '', 'error');
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();

      //       /* disbale all field */
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
      //       ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').disable();

      //     }
      //   }
      // }
    }
  }
  /* This will check currency is selected or not.
   * If currency is selected then it will enable next row year field
   * Otherwise it is disabled
   */
  chkCurrency(event, j) {
    this.getValueByLang()
    if (event.keyCode == 8) {
      this.filterCurrency(((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').value);
    }
    this.filterCurrency(((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').value);
    this.currency = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').value;
    if (this.currency == null || this.currency == '' || this.currency == undefined) {
      this.getCurrencyDetails();
      /* Here we call this method to get all purpose dac crs value */
      this.getPurposeDACCRS();
      /* Here we call this method to get all year list after add a row */
      // this.getExchangeRate();
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
      ((this.envelopeForm.get('tableData') as FormArray).at(j + 1) as FormGroup).get('year').disable();

      Swal.fire({
        title: (this.browserLang == 'en') ? 'Kindly Select Currency' : 'Gentilmente selecione a moeda',
        confirmButtonText: `OK`,
      })
    }
  }

  /* Here we call service to get all save as draft values that will be present in db */
  chkDraft() {
    this.getValueByLang()
    this.usergroup = localStorage.getItem('usergroup');
    this.envelopeServiceData.getSaveAsDraftEnvelope(this.usergroup).subscribe(data => {
      /* Below condition is for to check data present or not in db */
      if (data.length == 0) {
        if (this.browserLang == 'en')
          Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
        else
          Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error')
      }
    });
  }

  /* Here we call service to get all save as draft values that is present in db */
  private getSaveAsDrfat() {
    this.usergroup = localStorage.getItem('usergroup');
    this.envelopeServiceData.getSaveAsDraftEnvelope(this.usergroup).subscribe(data => {
      this.saveAsDraftList = data;
      for(let k=0;k<this.saveAsDraftList.length;k++){
        if(this.saveAsDraftList[k].envelopeReference==null){
          this.saveAsDraftList[k].envelopeReference=""
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
      data.envelopeReference.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  /* If we select any value from view save as draft then that id basis we call service nd get values then patch */
  draftValue() {
    this.totalAmnt = 0;
    this.mznValue = 0;
    this.usdVAlue = 0;
    let id = this.envelopeForm.controls['viewSaveAsDraft'].value;
    this.nodisplay = false;
    this.auto_save_as_draft_flag = false;
    for (let i = this.tableData1.length; i >= 1; i--) {

      this.dateFormArray.removeAt(i);
    }
    this.envelopeServiceData.patchSaveAsDraftEnvelope(id).subscribe(data => {
      this.updateEnvelope = data;
      this.englishList = ['Year', 'Dac Crs', 'Amount', 'Currency', 'Amount (MZN)', 'Amount (USD)'];
      /* Here we call currency to get currency list */
      this.getCurrencyDetails();
      this.getCurrencyData();
      /* Here we call this method to get all purpose dac crs value */
      this.getPurposeDACCRS();
      /* Here we call this method to get all year list after add a row */
      // this.getExchangeRate();
      if (this.id == null) {
        this.enevelopIdUpdate = '';
      }

      for (let i = 0; i < this.updateEnvelope.length; i++) {
        this.enveolopeSaveAsDraftId = this.updateEnvelope[i].envelopeId;

        this.envelopeForm.controls['donor'].patchValue(Number.parseInt(this.updateEnvelope[i].fundingOrganization));
        this.envelopeForm.controls['envelopeReference'].patchValue(this.updateEnvelope[i].envelopeReference)
        this.envelopeForm.controls.comments.setValue(this.updateEnvelope[i].comments);
        let currencyId = this.updateEnvelope[i].currencyMaster;
        this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
        console.log("chk table data", this.updateEnvelope[i].currencyMaster);
        if (this.updateEnvelope[i].fundingOrganization == null) {
          this.envelopeForm.controls['currency2'].reset();
          this.envelopeForm.controls['currency2'].disable();
        } else {
          this.envelopeForm.controls['currency2'].reset();
          this.envelopeForm.controls['currency2'].enable();
        }
        $("#mainTable tr:gt(1)").find('td:eq(0)').each(function (index) {
          $(this).find('a').click();
        });


        for (let j = 1; j < this.updateEnvelope[i].envelopeAllTableData.length; j++) {
          this.addYears();
        }
        try {

          for (let k = 0; k <= this.updateEnvelope[i].envelopeAllTableData.length; k++) {
            /* Enable all table field */
            if (k == 0) {
              if (this.updateEnvelope[i].currencyMaster != null) {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').enable();
              } else {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').disable();
              }
            } else {
              if (this.updateEnvelope[i].envelopeAllTableData[k - 1].amount != null) {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').enable();
              } else {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').disable();
              }
              if (this.updateEnvelope[i].envelopeAllTableData[k].startYear != null) {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').enable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').enable();
              } else {
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').disable();
                ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').disable();
              }
            }

            /*Disable field */
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').disable();
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').disable();

            /* Patch value in the table */
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('year').patchValue(this.updateEnvelope[i].envelopeAllTableData[k].startYear);
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('endYear').patchValue(this.updateEnvelope[i].envelopeAllTableData[k].endYear);
            ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('envagrcurr').patchValue(this.currencyPipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].amount, " "));
            if (this.updateEnvelope[i].envelopeAllTableData[k].purposeDacCrs != null) {
              ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('purdaccrs').patchValue(this.updateEnvelope[i].envelopeAllTableData[k].purposeDacCrs);
            }

            if (this.updateEnvelope[i].currencyMaster != null) {
              // let currencyId = Number.parseInt(this.updateEnvelope[i].envelopeAllTableData[k].currency);
              ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('currency1').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
              this.envelopeForm.controls['currency2'].patchValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);

            }
            this.mznValue = 0;
            this.usdVAlue = 0;
            if (this.updateEnvelope[i].envelopeAllTableData[k].startYear != null) {
              let year = this.datepipe.transform(this.updateEnvelope[i].envelopeAllTableData[k].startYear, 'yyyy');
              for (let j = 0; j < this.exchangeRateList.length; j++) {

                if ((year).toString() == ((this.exchangeRateList[j].year).toString())) {
                  this.mznValue = this.exchangeRateList[j].mznAmount;
                  this.usdVAlue = this.exchangeRateList[j].usdAmount;

                  this.mznValue = this.mznValue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                  this.usdVAlue = this.usdVAlue * Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
                  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('amtannenvmeti').patchValue((this.currencyPipe.transform(this.mznValue, " ")));
                  ((this.envelopeForm.get('tableData') as FormArray).at(k) as FormGroup).get('annenvamtusd').patchValue((this.currencyPipe.transform(this.usdVAlue, " ")));
                }

              }
            }


            /* Get amount and convert it into float */
            this.inputAmount = Number.parseFloat(this.updateEnvelope[i].envelopeAllTableData[k].amount);
            /* calculate total amount */
            this.totalAmnt = this.totalAmnt + this.inputAmount;


          }
        }
        catch (e) {
          console.log(e);
        }
      }

    },
      /* If we get any error then here we handel that error */
      error => {
        console.log("error ", error);
        if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
          Swal.fire(error.error.message, '', 'error');
        } else {
          Swal.fire(error.error, '', 'error');
        }
      }
    );
  }

  /* This is for open currency */
  openCurrencySearch(e, index) {
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('searchCurrency').patchValue('');
  }
  /* This is for clear currency that you will search*/
  clearCurrencySearch(e, index) {
    event.stopPropagation();
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('searchCurrency').patchValue('');
  }

  /* This is for open Dac crs */
  openDAcCrsSearch(e, index) {

    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('purdaccrsSearch').patchValue('');
  }
  /* This is for clear dac crs that you will search */
  clearDaccrsSearch(e, index) {
    event.stopPropagation();
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('purdaccrsSearch').patchValue('');
  }

  private getFinancialDetails() {
    this.envelopeServiceData.getFinancialDetails().subscribe(data => {
      this.financialList = data;
      console.log("Financial details ", this.financialList)
    })
  }
  /* get all exchange Active exchange rate values */
  private getExchangeRate() {
    this.exchangeRateService.getExchangeRate().subscribe(data => {
      this.exchangeRateList = data;
      console.log("exchangrate data ", this.exchangeRateList)
      for (let i = 0; i < (this.envelopeForm.get('tableData') as FormArray).length; i++) {
        this.yearfilteredOption[i] = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('yearSearch').valueChanges
          .pipe(
            startWith(''),
            map(name => name ? this.filterYear(name) : this.exchangeRateList.slice())
          );
      }
    });
  }
  /* Here year is filtered*/
  private filterYear(name: string) {
    return this.exchangeRateList.filter(exchangeRateData =>
      exchangeRateData.year.toString().toLowerCase().indexOf(name.toLowerCase()) === 0);

  }
  /* This is for open year list */
  openYear(e, index) {
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('yearSearch').patchValue('');
  }
  /* This method is for clear whatever you serch in year */
  clearyear(e, index) {
    event.stopPropagation();
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('yearSearch').patchValue('');

  }
  fundingOrgEmail: string = '';
  /* Enable currency */
  enableCurrency() {
    this.getValueByLang()
    this.fundingOrg = this.envelopeForm.controls['donor'].value
    this.fundingOrgEmail = '';
    for (let i = 0; i < this.fundingOrganizationList.length; i++) {
      if (Number.parseInt(this.fundingOrg) == this.fundingOrganizationList[i].id) {
        if (this.fundingOrganizationList[i].email != null) {
          this.fundingOrgEmail = this.fundingOrganizationList[i].email
          break;
        }
        else
          this.fundingOrgEmail = ''
      }
    }
    if (this.fundingOrg != null && this.fundingOrg != '' && this.fundingOrg != undefined) {
      this.envelopeForm.controls['currency2'].enable();

    } else {
      Swal.fire({
        title: (this.browserLang == 'en') ? 'Kindly Select Funding Organization' : 'Gentilmente selecione a organização de financiamento',
        confirmButtonText: `OK`,
      })
    }
  }

  /** Component label */
  @Input() label = '';

  _max: Moment;
  @Input() get max(): number | Date {
    return this._max ? this._max.year() : undefined;
  }
  set max(max: number | Date) {
    if (max) {
      const momentDate = typeof max === 'number' ? moment([max, 0, 1]) : moment(max);
      this._max = momentDate.isValid() ? momentDate : undefined;
    }
  }

  _min: Moment;
  @Input() get min(): number | Date {
    return this._min ? this._min.year() : undefined;
  }
  set min(min: number | Date) {
    if (min) {
      const momentDate = typeof min === 'number' ? moment([min, 0, 1]) : moment(min);
      this._min = momentDate.isValid() ? momentDate : undefined;
    }
  }

  @Input() touchUi = false;

  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;


  // Function to call when the date changes.
  onChange = (year: Date) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>, index) {
    // as I'm using the focus event to open the calendar, this is necessary
    // so the calendar isn't opened again after a selection.
    debugger
    datepicker.disabled = true;
    if (!this._isYearEnabled(chosenDate.year())) {
      datepicker.close();
      // wait for some time before enabling the calendar again
      setTimeout(() => datepicker.disabled = false, 600);
      return;
    }

    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').setValue(chosenDate, { emitEvent: false });
    this.enableAmount(index);
    this.onChange(chosenDate.toDate());
    this.chkDAcCrsDuplicate(index);
    this.onTouched();
    datepicker.close();
    // wait for some time before enabling the calendar again
    setTimeout(() => datepicker.disabled = false, 600);
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }
  _openDatepickerOnFocus(datepicker: MatDatepicker<Moment>) {
    setTimeout(() => {
      if (!datepicker.opened) {
        datepicker.open();
      }
    });
  }

  @Input() touchUi2 = false;

  @ViewChild(MatDatepicker) _picker2: MatDatepicker<Moment>;


  // Function to call when the date changes.
  onChange2 = (year: Date) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched2 = () => { };


  registerOnChange2(fn: any): void {
    this.onChange2 = fn;
  }
  registerOnTouched2(fn: any): void {
    this.onTouched2 = fn;
  }
  _yearSelectedHandler2(chosenDate: Moment, datepicker: MatDatepicker<Moment>, index) {
    // as I'm using the focus event to open the calendar, this is necessary
    // so the calendar isn't opened again after a selection.
    datepicker.disabled = true;
    if (!this._isYearEnabled2(chosenDate.year())) {
      datepicker.close();
      // wait for some time before enabling the calendar again
      setTimeout(() => datepicker.disabled = false, 600);
      return;
    }

    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('endYear').setValue(chosenDate, { emitEvent: false });

    this.onChange2(chosenDate.toDate());
    this.onTouched2();
    datepicker.close();
    // wait for some time before enabling the calendar again
    setTimeout(() => datepicker.disabled = false, 600);
  }

  _openDatepickerOnClick2(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

  _openDatepickerOnFocus2(datepicker: MatDatepicker<Moment>) {
    setTimeout(() => {
      if (!datepicker.opened) {
        datepicker.open();
      }
    });
  }
  _clearInput($evt: MouseEvent, index) {
    ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').setValue(null);
    $evt.stopPropagation();
  }

  /** Whether the given year is enabled. */
  private _isYearEnabled(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this._max && year > this._max.year()) ||
      (this._min && year < this._min.year())) {
      return false;
    }

    return true;
  }
  /** Whether the given year is enabled. */
  private _isYearEnabled2(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this._max && year > this._max.year()) ||
      (this._min && year < this._min.year())) {
      return false;
    }

    return true;
  }
  getPurpose() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  /* Here we can fetch all envelope data by calling servie */
  private fetchEnvelopeData() {
    this.envelopeService.getAllEnvelope().subscribe(data => {
      envelopeDetails = data;
    });
  }
  checkDuplicate() {
    this.getValueByLang()
    let envRef = this.envelopeForm.controls['envelopeReference'].value;
    console.log("envelopeDetails ", envelopeDetails)
    for (let i = 0; i < envelopeDetails.length; i++) {
      if (envRef == envelopeDetails[i].envelopeReference) {
        this.envelopeForm.controls['envelopeReference'].reset();
        if (this.browserLang == 'en')
          Swal.fire('This name already exists, try something else.')
        else
          Swal.fire('Este nome já existe, tente outro.')
        break;
      }
    }
  }
  endYrChk(index) {
    this.getValueByLang()
    let stratYr = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('year').value;
    stratYr = this.datepipe.transform(stratYr, 'yyyy');
    let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('endYear').value;
    endYear = this.datepipe.transform(endYear, 'yyyy');
    if (stratYr >= endYear) {
      ((this.envelopeForm.get('tableData') as FormArray).at(index) as FormGroup).get('endYear').reset();
      if (this.browserLang == 'en')
        Swal.fire('End year should be greated than Start year.')
      else
        Swal.fire('O Ano de Fim deve ser maior do que o Ano de Início.')
    }
  }
  endYear: any
  chkDAcCrsDuplicate(j: any) {
    this.dacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').value;
    this.year = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').value;
    this.year = this.datepipe.transform(this.year, 'yyyy');
    this.endYear = ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').value;
    if (this.endYear != '') {
      this.endYear = this.datepipe.transform(this.endYear, 'yyyy');
    }
    for (let i = 0; i < this.tableData1.length; i++) {
      if (j != i) {
        /* If same year choose again then it show an alert message */
        let startYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('year').value;
        startYear = this.datepipe.transform(startYear, 'yyyy');

        let endYear = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('endYear').value;
        if (endYear != null || endYear != '') {
          endYear = this.datepipe.transform(endYear, 'yyyy');
        }

        let dacCrs = ((this.envelopeForm.get('tableData') as FormArray).at(i) as FormGroup).get('purdaccrs').value;
        // if(dacCrs!=""){
        if (dacCrs == '') {
          dacCrs = 'noData';
        }
        if (this.year == startYear) {
          if (this.dacCrs == dacCrs) {
            if (this.browserLang == 'en')
              Swal.fire('This DAC-CRS Sector and this time period have already been selected.', '', 'error');
            else
              Swal.fire('Este Sector DAC-CRS e este período de tempo já foram seleccionados. ', '', 'error');
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').reset();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').reset();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('year').reset();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').reset();
            ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').reset();

            /* disbale all field */
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('envagrcurr').disable();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').disable();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('purdaccrs').disable();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('amtannenvmeti').disable();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('annenvamtusd').disable();
            // ((this.envelopeForm.get('tableData') as FormArray).at(j) as FormGroup).get('endYear').disable();

          }
        }
        // }
      }
    }
  }
  enableUploadBtn() {
    let refNm = this.envelopeForm.controls.envelopeReference.value;
    if (refNm != null || refNm != '')
      localStorage.setItem("refNM", refNm);
    else
      localStorage.setItem("refNM", null);
  }

  openExchangeRateAdministration() {
    let dialogRef = this.dialog.open(ExchangeRateAdministrationComponent);
    localStorage.setItem("FAExchangeRatePopUp", "Yes");
  }


}
let envelopeDetails: EnvelopeServiceClass[] = [];