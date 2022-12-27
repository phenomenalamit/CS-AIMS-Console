import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
//import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
//import { ViewDisbursementComponentComponent } from '../../../components/view-components/view-disbursement-component/view-disbursement-component.component';
import { Disbursement } from '../../../model/disbursement';

import { ExcelService } from '../../../Service/excel.service';

import * as _moment from 'moment';

const moment = _moment;
@Component({
  selector: 'app-dialogbox-disbursment-component',
  templateUrl: './dialogbox-disbursment-component.component.html',
  styleUrls: ['./dialogbox-disbursment-component.component.css']
})
export class DialogboxDisbursmentComponentComponent implements OnInit {

  exchangeRateMZN!: number;
  exchangeRateUSD!: number;
  exchangeRatesAgreementCurrency!: number;
  disbursementAmountMZN!: number;
  disbursementAmountUSD!: number;
  disburmentAmountAgreementCurrency!: number;

  public disbursementForm!: FormGroup;
  disbursement:Disbursement =new Disbursement();
  displayedColumns: string[] = ['position','disbursementReference','project','fundingTitle',
  'amount','exchangeRates','amountOfdisbursementMeticais',
  'amountOfdisbursementUSD','amountOfdisbursementAgreement','names','date',
  'swiftcode','receivedswiftcode','receivedBankNIB','edit'];
  elements!: NodeListOf<Element>;


  names = new FormControl();
  organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco','Mozambique Government','WHO'];
  filteredOptions: Observable<string[]>;
  usergroup:any;

  currency = new FormControl();
  options: string[] = ['Australia Dollar(AUD)', 'Great Britain Pound(GBP)',
  'Euro(EUR)','Japan Yen(JPY)',
'Switzerland Franc(CHF)','USA Dollar(USD)',
'Afghanistan Afghani(AFN)','Albania Lek(ALL)',
'Algeria Dinar(DZD)','Angola Kwanza(AOA)',
'Argentina Peso(ARS)','Armenia Dram(AMD)',
'Aruba Florin(AWG)','Australia Dollar(AUD)',
'Austria Schilling(ATS EURO)','Belgium Franc(BEF EURO)',
'Azerbaijan New Manat(AZN)','Bahamas Dollar(BSD)',
'Bahrain Dinar(BHD)','Bangladesh Taka(BDT)',
'Barbados Dollar(BBD)','Belarus Ruble(BYR)',
'Belize Dollar(BZD)','Bermuda Dollar(BMD)',
'Bhutan Ngultrum(BTN)','Bolivia Boliviano(BOB)',
'Bosnia Mark	(BAM)','Botswana Pula	(BWP)',
'Brazil Real	(BRL)','Great Britain Pound	(GBP)',
'Brunei Dollar	(BND)','Bulgaria Lev	(BGN)',
'Burundi Franc	(BIF)','CFA Franc BCEAO	(XOF)',
'CFA Franc BEAC	(XAF)','CFP Franc	(XPF)',
'Cambodia Riel	(KHR)','Canada Dollar	(CAD)',
'Cape Verde Escudo	(CVE)','Cayman Islands Dollar	(KYD)',
'Chili Peso	CLP)','China Yuan/Renminbi	(CNY)',
'Colombia Peso	(COP)','Comoros Franc	(KMF)',
'Congo Franc	(CDF)','Costa Rica Colon	(CRC)',
'Croatia Kuna	(HRK)','Cuba Convertible Peso	(CUC)',
'Cuba Peso	CUP','Cyprus Pound	CYP (EURO)',
'Czech Koruna	(CZK)','Denmark Krone	(DKK)',
'Djibouti Franc	(DJF)','Dominican Republich Peso	(DOP)',
'East Caribbean Dollar	(XCD)','Egypt Pound	(EGP)',
'El Salvador Colon	(SVC)','Estonia Kroon	(EEK (EURO))',
'Ethiopia Birr	ETB','Euro	(EUR)',
'Falkland Islands Pound	(FKP)',
'Finland Markka	(FIM (EURO))',
'Fiji Dollar	(FJD)','Gambia Dalasi(GMD)',
'Georgia Lari	(GEL)','Germany Mark	(DMK (EURO))',
'Ghana New Cedi	(GHS)','Gibraltar Pound	(GIP)',
'Greece Drachma	(GRD (EURO))','Guatemala Quetzal	(GTQ)',
'Guinea Franc	(GNF)','Guyana Dollar	(GYD)',
'Haiti Gourde	(HTG)','Honduras Lempira	(HNL)',
'Hong Kong Dollar	(HKD)','Hungary Forint	(HUF)',
'Iceland Krona	(ISK)','India Rupee	(INR)',
'Indonesia Rupiah	(IDR)','Iran Rial	(IRR)',
'Iraq Dinar	(IQD)','Ireland Pound	(IED (EURO))',
'Israel New Shekel	(ILS)','Italy Lira	(ITL (EURO))',
'Jamaica Dollar	(JMD)','Japan Yen	(JPY)',
'Jordan Dinar	(JOD)','Kazakhstan Tenge	(KZT)',
'Kenya Shilling	(KES)','Kuwait Dinar	(KWD)',
'Kyrgyzstan Som	(KGS)','Laos Kip	(LAK)',
'Latvia Lats	(LVL EURO)','Lebanon Pound	(LBP)',
'Lesotho Loti	(LSL)','Liberia Dollar	(LRD)',
'Libya Dinar	(LYD)','Lithuania Litas	(LTL EURO)',
'Luxembourg Franc	(LUF EURO)','Macau Pataca	(MOP)',
'Macedonia Denar	(MKD','Malagasy Ariary	(MGA)',
'Malawi Kwacha	(MWK)','Malaysia Ringgit	(MYR)',
'Maldives Rufiyaa	(MVR)','Malta Lira	(MTL (EURO))',
'Mauritania Ouguiya	(MRO)','Mauritius Rupee	(MUR)','Mexico Peso	(MXN)',
'Moldova Leu	(MDL)','Mongolia Tugrik	(MNT)',
'Morocco Dirham	(MAD)','Mozambique New Metical	(MZN)',
'Myanmar Kyat	(MMK)','NL Antilles Guilder	(ANG)',
'Namibia Dollar	NAD','Nepal Rupee	(NPR)',
'Netherlands Guilder	(NLG (EURO))','New Zealand Dollar	(NZD)',
'Nicaragua Cordoba Oro	(NIO)','Nigeria Naira	NGN',
'North Korea Won	KPW','Norway Kroner	(NOK)','Oman Rial	(OMR)',
'Pakistan Rupee	(PKR)',
'Panama Balboa	(PAB)','Papua New Guinea Kina	(PGK)',
'Paraguay Guarani	(PYG)','Peru Nuevo Sol	(PEN)',
'Philippines Peso	(PHP)','Poland Zloty	(PLN)',
'Portugal Escudo	(PTE EURO)','Qatar Rial	(QAR)',
'Romania New Lei	(RON)','Russia Rouble	(RUB)',
'Rwanda Franc	(RWF)','Samoa Tala	(WST)',
'Sao Tome/Principe Dobra (STD)','Saudi Arabia Riyal	(SAR)',
'Serbia Dinar	(RSD)','Seychelles Rupee	(SCR)',
'Sierra Leone Leone	(SLL)','Singapore Dollar	(SGD)',
'Slovakia Koruna	(SKK EURO)','Slovenia Tolar	(SIT EURO)',
'Solomon Islands (Dollar	SBD)','Somali Shilling	(SOS)',
'South Africa Rand	(ZAR)','South Korea Won	(KRW)',
'Spain Peseta	(ESP EURO)','Sri Lanka Rupee	(LKR)',
'St Helena Pound	(SHP)','Sudan Pound	(SDG)',
'Suriname Dollar	(SRD)','Swaziland Lilangeni	(SZL)',
'Sweden Krona	(SEK)','Switzerland Franc	(CHF)',
'Syria Pound	(SYP)','Taiwan Dollar	(TWD)',
'Tanzania Shilling	(TZS)','Thailand Baht	(THB)',
'Tonga Paanga	(TOP)','Trinidad/Tobago (Dollar	TTD)',
'Tunisia Dinar	(TND)','Turkish New Lira	(TRY)',
'Turkmenistan Manat	(TMM)','USA Dollar	(USD)',
'Uganda Shilling	(UGX)','Ukraine Hryvnia	(UAH)',
'Uruguay Peso	(UYU)',
'United Arab Emirates Dirham	(AED)','Vanuatu Vatu	(VUV)',
'Venezuela Bolivar	(VEB)','Vietnam Dong	(VND)',
'Yemen Rial	(YER)','Zambia Kwacha	(ZMK)',
'Zimbabwe Dollar	(ZWD)'];
  filteredOptionsC: Observable<string[]>;
  editorg: string | undefined;
  element: string | undefined;
  parsedJson: any;
  projectSelected: any;
  fundingTitleSelected: any;
  dateSelected= new FormControl();


  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,public dialog:MatDialog) { }



    num:any;
    tabClick(index: number) {
      this.num=index;
    }
  ngOnInit(): void {

    this.usergroup=localStorage.getItem('usergroup');
    this.disbursementForm = new FormGroup({
      currency : new FormControl('',[Validators.required]),
      disbursementReference: new FormControl('', [Validators.required]),
      project: new FormControl('', [Validators.required]),
      fundingDonorTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      names: new FormControl('', [Validators.required]),
      date:new FormControl('', [Validators.required]),
      exchangeRates:new FormControl({value:'',disabled:true}),
      exchangeRatesMzn:new FormControl({value:'',disabled:true}),
      exchangeRatesAgreementCurrency:new FormControl({value:'',disabled:true}),
      amountOfdisbursementMeticais:new FormControl({value:'',disabled:true}),
      amountOfdisbursementUSD:new FormControl({value:'',disabled:true}),
      amountOfdisbursementAgreement:new FormControl({value:'',disabled:true}),
      swiftcode:new FormControl(''),
      receivedswiftcode:new FormControl(''),
      receivedBankNIB:new FormControl(''),
      // currency : new FormControl('')
    });


    this.editorg=localStorage.getItem('EditDis') || undefined;

    this.element=localStorage.getItem('EditDisElement') || undefined;
    console.log("element:"+this.editorg);

    if(this.element !== undefined)
    {
      console.log("element2:"+this.element);
    this.parsedJson = JSON.parse(this.element);

    console.log("jsonObj:"+this.parsedJson);
    console.log("date:"+this.parsedJson.date);
    console.log("fundingOrgaization:"+this.parsedJson.names);
    let obj:Disbursement=this.parsedJson;
    this.projectSelected = this.parsedJson.project;

    this.fundingTitleSelected = this.parsedJson.fundingDonorTitle;
    this.names.setValue(this.parsedJson.names);
    this.currency.setValue('Australia Dollar(AUD)');

    this.dateSelected = new FormControl(moment(this.parsedJson.date, "DD-MM-YYYY"));

    //setting value for funding title which is dependent on Project selected
    let dropDownData = this.projectList.find((data: any) => data.projectName === this.projectSelected);

    if (dropDownData) {
      this.fundingTitleList = dropDownData.fundingTitleList;
      console.log(this.fundingTitleList);
    } else {
      this.fundingTitleList = [];
    }



    }

    this.filteredOptions = this.names.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredOptionsC = this.currency.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );

  }

  getCurrency(data){
  const currencyName = data.option.value;
  if(currencyName=='Australia Dollar(AUD)'){
    this.exchangeRateMZN=9.2;
  this.exchangeRateUSD=8.6;
  this.exchangeRatesAgreementCurrency=8.2;
  this.disbursementAmountMZN=9.2;
  this.disbursementAmountUSD=9522;
  this.disburmentAmountAgreementCurrency=9600;
  }
  else if(currencyName=='Great Britain Pound(GBP)'){
    this.exchangeRateMZN=8.2;
  this.exchangeRateUSD=9.6;
  this.exchangeRatesAgreementCurrency=8.2;
  this.disbursementAmountMZN=11.2;
  this.disbursementAmountUSD=9522;
  this.disburmentAmountAgreementCurrency=8600;
  }

  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.organizationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.disbursementForm.controls[controlName].hasError(errorName);
  }

  public createDisbursement = (disbursementFormValue) => {
    if (this.disbursementForm.valid) {
      this.executeDisbursementCreation(disbursementFormValue);
    }
  }
  private executeDisbursementCreation = (disbursementFormValue) => {
    let disbursement: Disbursement = {
      disbursementReference: disbursementFormValue.disbursementReference,
      projectTitle: disbursementFormValue.projectTitle,
      fundingDonorTitle: disbursementFormValue.fundingDonorTitle,
      amount: disbursementFormValue.amount,
      exchangeRateUSD: disbursementFormValue.exchangeRateUSD,
      disbursementAmountMZN: disbursementFormValue.disbursementAmountMZN,
      disbursementAmountUSD: disbursementFormValue.disbursementAmountUSD,
      exchangeRatesAgreementCurrency: disbursementFormValue.exchangeRatesAgreementCurrency,
      amountOfdisbursementAgreement: disbursementFormValue.amountOfdisbursementAgreement,
      names: disbursementFormValue.names,
      date: disbursementFormValue.date,
      currency:disbursementFormValue.currency,
      swiftcode: disbursementFormValue.swiftcode,
      amountOfdisbursementUSD:disbursementFormValue.amountOfdisbursementUSD,
      receivedswiftcode: disbursementFormValue.receivedswiftcode,
      receivedBankNIB: disbursementFormValue.receivedBankNIB,
      position: disbursementFormValue.position,
      exchangeRateMZN: disbursementFormValue.exchangeRateMZN

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
      localStorage.setItem('EditDis','');
      localStorage.setItem('EditDisElement','');

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved as Draft Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  project;
  fundingDonorTitle;
  fundingTitleList = [];

  projectList: any = [
    {
      'projectName': 'Mozambique Infrastructure Project',
      fundingTitleList: [
        'Funding For Mozambique Infrastructure Project', 'Funding For Mozambique Infrastructure Project Feb', 'Funding For Mozambique Infrastructure Project Jan',
      ]
    },
    {
      'projectName': 'Beira Express Way',
      fundingTitleList: [
        'Funding For Beira Express Way current', 'Funding For Beira Express Way Feb', 'Funding For Beira Express Way Jan','Funding For Beira Express Way',
      ]
    },
    {
      'projectName': 'Maputo Smart City',
      fundingTitleList: [
        '	Funding For Maputo Smart City Jan', '	Funding For Maputo Smart City Feb', '	Funding For Maputo Smart City Dec','Funding For Port of Pemba','Funding For Maputo Smart City',
      ]
    },
    {
      'projectName':'Bilene International Airport',
      fundingTitleList:[
        'Funding For Bilene International Airport',
      ]
    },
    {
      'projectName':'Pemba Memorial Highway',
      fundingTitleList:[
        'Funding For Pemba Memorial Highway',
      ]
    }
  ];


  // editInfo(educationInfo) {
  //   this.education_level = educationInfo.aa;
  //   this.exam_title = educationInfo.bb;
  //   this.gender = educationInfo.cc;
  //   this.educationLevelChangeAction(this.education_level);
  // }
  projectChangeAction(project) {
    console.log(project);
    // this.fundingDonorTitle="";
    let dropDownData = this.projectList.find((data: any) => data.projectName === project);
    // console.log(dropDownData);
    // console.log(dropDownData.fundingTitleList)
    if (dropDownData) {
      this.fundingTitleList = dropDownData.fundingTitleList;
      console.log(this.fundingTitleList);
    } else {
      this.fundingTitleList = [];
    }
  }

  clearForm(form: FormGroup) {
    localStorage.setItem('EditDis','');
    localStorage.setItem('EditDisElement','');
    form.reset();
    }
    closebuttonedit(){
      localStorage.setItem('EditDis','');
      localStorage.setItem('EditDisElement','');
      }
}
