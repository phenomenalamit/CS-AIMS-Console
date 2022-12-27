import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component,Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';




// const ELEMENT_DATA: Payment[] = [

//   {position: 1, PaymentReference: 'PaymentReference1', financing: 'financing1', project: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',paymentAmount:'1120',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 2,PaymentReference: 'PaymentReference2', financing: 'financing2', project: 'project2',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'2/2/2020',paymentAmount:'1121',exchangeRates:'8.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1460M ALL',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 3, PaymentReference: 'PaymentReference3', financing: 'financing1', project: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',paymentAmount:'1120',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1389M AUD',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 4, PaymentReference: 'PaymentReference4', financing: 'financing2', project: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'20/2/2020',paymentAmount:'1920',exchangeRates:'7.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1356M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 5, PaymentReference: 'PaymentReference5', financing: 'financing1', project: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/3/2020',paymentAmount:'1120',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 6, PaymentReference: 'PaymentReference6', financing: 'financing2', project: 'project2',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'21/2/2021',paymentAmount:'1720',exchangeRates:'8.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 7, PaymentReference: 'PaymentReference7', financing: 'financing1', project: 'project2',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/5/2020',paymentAmount:'1120',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 8, PaymentReference: 'PaymentReference7', financing: 'financing2', project: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'19/2/2020',paymentAmount:'91120',exchangeRates:'7.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 9, PaymentReference: 'PaymentReference8', financing: 'financing1', project: 'project2',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',paymentAmount:'1920',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},
//   {position: 10, PaymentReference: 'PaymentReference8', financing: 'financing2', project: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'15/2/2020',paymentAmount:'1820',exchangeRates:'9.2',exchangeRatesMzn:6.3,exchangeRatesAgreementCurrency :'1300M MZN',paymentAmountinMeticais:'abc',amountofPayment:'xyz',paymentAmountUSD:'abc'},

// ];

// const moment = _moment;
@Component({
  selector: 'app-dialogbox-payment-component',
  templateUrl: './dialogbox-payment-component.component.html',
  styleUrls: ['./dialogbox-payment-component.component.css']
})
export class DialogboxPaymentComponentComponent implements OnInit {
  constructor(
         private router :Router, private currencyPipe: CurrencyPipe,
         @Inject(DOCUMENT) private _document: HTMLDocument) { }




       ngOnInit(): void {}
//   public paymentForm!: FormGroup;
//   payment:Payment=new Payment();
//   displayedColumns: string[] = ['position','PaymentReference', 'financing','project','UGBMEO','MEOResourceSources','paymentDate','paymentAmount','exchangeRates','paymentAmountinMeticais','amountofPayment','paymentAmountUSD','edit'];
//   dataSource = ELEMENT_DATA;
//   elements!: NodeListOf<Element>;
//   usergroup:any;


//   exchangeRateMZN!: number;
//   exchangeRateUSD!: number;
//   exchangeRateAgreementCurr!: number;
//   disbursementAmountMZN!: number;
//   disbursementAmountUSD!: number;
//   disburmentAmountAgreementCurrency!: number;

//   currency1 = new FormControl();
//   parsedJson: any;
//   financingSelected: any;
//   projectSelected: any;
//   UGBMEOSelected: any;
//   MEOResourceSourcesSelected: any;
//   dateSelected = new FormControl();

//   onBlur(value) {

//     this.paymentForm.controls['paymentAmount'].setValue(this.currencyPipe.transform(value, " "));
//     console.log("blur  "+this.currencyPipe.transform(value, " "));
//   }
//   regex_Currency(e) {
//     return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
//    (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
//   }

//   options: string[] = ['Australia Dollar(AUD)', 'Great Britain Pound(GBP)',
//   'Euro(EUR)','Japan Yen(JPY)',
// 'Switzerland Franc(CHF)','USA Dollar(USD)',
// 'Afghanistan Afghani(AFN)','Albania Lek(ALL)',
// 'Algeria Dinar(DZD)','Angola Kwanza(AOA)',
// 'Argentina Peso(ARS)','Armenia Dram(AMD)',
// 'Aruba Florin(AWG)','Australia Dollar(AUD)',
// 'Austria Schilling(ATS EURO)','Belgium Franc(BEF EURO)',
// 'Azerbaijan New Manat(AZN)','Bahamas Dollar(BSD)',
// 'Bahrain Dinar(BHD)','Bangladesh Taka(BDT)',
// 'Barbados Dollar(BBD)','Belarus Ruble(BYR)',
// 'Belize Dollar(BZD)','Bermuda Dollar(BMD)',
// 'Bhutan Ngultrum(BTN)','Bolivia Boliviano(BOB)',
// 'Bosnia Mark	(BAM)','Botswana Pula	(BWP)',
// 'Brazil Real	(BRL)','Great Britain Pound	(GBP)',
// 'Brunei Dollar	(BND)','Bulgaria Lev	(BGN)',
// 'Burundi Franc	(BIF)','CFA Franc BCEAO	(XOF)',
// 'CFA Franc BEAC	(XAF)','CFP Franc	(XPF)',
// 'Cambodia Riel	(KHR)','Canada Dollar	(CAD)',
// 'Cape Verde Escudo	(CVE)','Cayman Islands Dollar	(KYD)',
// 'Chili Peso	CLP)','China Yuan/Renminbi	(CNY)',
// 'Colombia Peso	(COP)','Comoros Franc	(KMF)',
// 'Congo Franc	(CDF)','Costa Rica Colon	(CRC)',
// 'Croatia Kuna	(HRK)','Cuba Convertible Peso	(CUC)',
// 'Cuba Peso	CUP','Cyprus Pound	CYP (EURO)',
// 'Czech Koruna	(CZK)','Denmark Krone	(DKK)',
// 'Djibouti Franc	(DJF)','Dominican Republich Peso	(DOP)',
// 'East Caribbean Dollar	(XCD)','Egypt Pound	(EGP)',
// 'El Salvador Colon	(SVC)','Estonia Kroon	(EEK (EURO))',
// 'Ethiopia Birr	ETB','Euro	(EUR)',
// 'Falkland Islands Pound	(FKP)',
// 'Finland Markka	(FIM (EURO))',
// 'Fiji Dollar	(FJD)','Gambia Dalasi(GMD)',
// 'Georgia Lari	(GEL)','Germany Mark	(DMK (EURO))',
// 'Ghana New Cedi	(GHS)','Gibraltar Pound	(GIP)',
// 'Greece Drachma	(GRD (EURO))','Guatemala Quetzal	(GTQ)',
// 'Guinea Franc	(GNF)','Guyana Dollar	(GYD)',
// 'Haiti Gourde	(HTG)','Honduras Lempira	(HNL)',
// 'Hong Kong Dollar	(HKD)','Hungary Forint	(HUF)',
// 'Iceland Krona	(ISK)','India Rupee	(INR)',
// 'Indonesia Rupiah	(IDR)','Iran Rial	(IRR)',
// 'Iraq Dinar	(IQD)','Ireland Pound	(IED (EURO))',
// 'Israel New Shekel	(ILS)','Italy Lira	(ITL (EURO))',
// 'Jamaica Dollar	(JMD)','Japan Yen	(JPY)',
// 'Jordan Dinar	(JOD)','Kazakhstan Tenge	(KZT)',
// 'Kenya Shilling	(KES)','Kuwait Dinar	(KWD)',
// 'Kyrgyzstan Som	(KGS)','Laos Kip	(LAK)',
// 'Latvia Lats	(LVL EURO)','Lebanon Pound	(LBP)',
// 'Lesotho Loti	(LSL)','Liberia Dollar	(LRD)',
// 'Libya Dinar	(LYD)','Lithuania Litas	(LTL EURO)',
// 'Luxembourg Franc	(LUF EURO)','Macau Pataca	(MOP)',
// 'Macedonia Denar	(MKD','Malagasy Ariary	(MGA)',
// 'Malawi Kwacha	(MWK)','Malaysia Ringgit	(MYR)',
// 'Maldives Rufiyaa	(MVR)','Malta Lira	(MTL (EURO))',
// 'Mauritania Ouguiya	(MRO)','Mauritius Rupee	(MUR)','Mexico Peso	(MXN)',
// 'Moldova Leu	(MDL)','Mongolia Tugrik	(MNT)',
// 'Morocco Dirham	(MAD)','Mozambique New Metical	(MZN)',
// 'Myanmar Kyat	(MMK)','NL Antilles Guilder	(ANG)',
// 'Namibia Dollar	NAD','Nepal Rupee	(NPR)',
// 'Netherlands Guilder	(NLG (EURO))','New Zealand Dollar	(NZD)',
// 'Nicaragua Cordoba Oro	(NIO)','Nigeria Naira	NGN',
// 'North Korea Won	KPW','Norway Kroner	(NOK)','Oman Rial	(OMR)',
// 'Pakistan Rupee	(PKR)',
// 'Panama Balboa	(PAB)','Papua New Guinea Kina	(PGK)',
// 'Paraguay Guarani	(PYG)','Peru Nuevo Sol	(PEN)',
// 'Philippines Peso	(PHP)','Poland Zloty	(PLN)',
// 'Portugal Escudo	(PTE EURO)','Qatar Rial	(QAR)',
// 'Romania New Lei	(RON)','Russia Rouble	(RUB)',
// 'Rwanda Franc	(RWF)','Samoa Tala	(WST)',
// 'Sao Tome/Principe Dobra (STD)','Saudi Arabia Riyal	(SAR)',
// 'Serbia Dinar	(RSD)','Seychelles Rupee	(SCR)',
// 'Sierra Leone Leone	(SLL)','Singapore Dollar	(SGD)',
// 'Slovakia Koruna	(SKK EURO)','Slovenia Tolar	(SIT EURO)',
// 'Solomon Islands (Dollar	SBD)','Somali Shilling	(SOS)',
// 'South Africa Rand	(ZAR)','South Korea Won	(KRW)',
// 'Spain Peseta	(ESP EURO)','Sri Lanka Rupee	(LKR)',
// 'St Helena Pound	(SHP)','Sudan Pound	(SDG)',
// 'Suriname Dollar	(SRD)','Swaziland Lilangeni	(SZL)',
// 'Sweden Krona	(SEK)','Switzerland Franc	(CHF)',
// 'Syria Pound	(SYP)','Taiwan Dollar	(TWD)',
// 'Tanzania Shilling	(TZS)','Thailand Baht	(THB)',
// 'Tonga Paanga	(TOP)','Trinidad/Tobago (Dollar	TTD)',
// 'Tunisia Dinar	(TND)','Turkish New Lira	(TRY)',
// 'Turkmenistan Manat	(TMM)','USA Dollar	(USD)',
// 'Uganda Shilling	(UGX)','Ukraine Hryvnia	(UAH)',
// 'Uruguay Peso	(UYU)',
// 'United Arab Emirates Dirham	(AED)','Vanuatu Vatu	(VUV)',
// 'Venezuela Bolivar	(VEB)','Vietnam Dong	(VND)',
// 'Yemen Rial	(YER)','Zambia Kwacha	(ZMK)',
// 'Zimbabwe Dollar	(ZWD)'];
//   filteredOptionsC: Observable<string[]>;

//   constructor(,
//     private router :Router, private currencyPipe: CurrencyPipe,
//     @Inject(DOCUMENT) private _document: HTMLDocument) { }



//     num:any;
//     tabClick(index: number) {
//       this.num=index;
//     }
//   ngOnInit(): void {

//     this.usergroup=localStorage.getItem('usergroup');
//     this.paymentForm = new FormGroup({
//       PaymentReference: new FormControl('', [Validators.required]),
//       financing: new FormControl('', [Validators.required]),
//       project: new FormControl('', [Validators.required]),
//       paymentAmount: new FormControl('0.00', [Validators.required]),
//       UGBMEO!:new FormControl(''),
//       MEOResourceSources!:new FormControl(''),
//       paymentDate!:new FormControl(''),
//       exchangeRates!:new FormControl({value:'',disabled:true}),
//       exchangeRatesMzn!:new FormControl({value:'',disabled:true}),
//       exchangeRatesAgreementCurrency!: new FormControl({value:'',diabled:true}),
//       paymentAmountinMeticais!:new FormControl({value:'',diabled:true}),
//       amountofPayment!:new FormControl({value:'',diabled:true}),
//       paymentAmountUSD!:new FormControl({value:'',diabled:true}),
//       currency1 : new FormControl(''),
//     });

//     let element:any = localStorage.getItem("EditPaymentElement") || undefined;
//     console.log("element:"+element);
//     if(element!=undefined){
//       this.parsedJson = JSON.parse(element);
//       let obj:Payment = this.parsedJson;
//       this.financingSelected = this.parsedJson.financing;
//       this.projectSelected = this.parsedJson.project;
//       this.UGBMEOSelected = this.parsedJson.UGBMEO;
//       this.MEOResourceSourcesSelected = this.parsedJson.MEOResourceSources;
//       this.dateSelected = new FormControl(moment(this.parsedJson.paymentDate,"DD-MM-YYYY"));
//       this.currency1.setValue('Australia Dollar(AUD)');

//     }

//     this.filteredOptionsC = this.currency1.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filter2(value))
//       );
//   }

//   getCurrency(data){
//     const currencyName = data.option.value;
//     if(currencyName=='Australia Dollar(AUD)'){
//       this.exchangeRateMZN=9.2;
//     this.exchangeRateUSD=8.6;
//     this.exchangeRateAgreementCurr=8.2;
//     this.disbursementAmountMZN=9.2;
//     this.disbursementAmountUSD=9522;
//     this.disburmentAmountAgreementCurrency=9600;
//     }
//     else if(currencyName=='Great Britain Pound(GBP)'){
//       this.exchangeRateMZN=8.2;
//     this.exchangeRateUSD=9.6;
//     this.exchangeRateAgreementCurr=8.2;
//     this.disbursementAmountMZN=11.2;
//     this.disbursementAmountUSD=9522;
//     this.disburmentAmountAgreementCurrency=8600;
//     }

//     }

//     private _filter2(value: string): string[] {
//       const filterValue = value.toLowerCase();

//       return this.options.filter(option => option.toLowerCase().includes(filterValue));
//     }

//   public hasError = (controlName: string, errorName: string) =>{
//     return this.paymentForm.controls[controlName].hasError(errorName);
//   }

//   public createPayment = (paymentFormValue) => {
//     if (this.paymentForm.valid) {
//       this.executePaymentCreation(paymentFormValue);
//     }

//   }


//   private executePaymentCreation = (paymentFormValue) => {
//     let payment: Payment = {
//       PaymentReference: paymentFormValue.PaymentReference,
//       financing: paymentFormValue.financing,
//       project: paymentFormValue.project,
//       UGBMEO: paymentFormValue.UGBMEO,
//       MEOResourceSources:paymentFormValue.MEOResourceSources,
//       paymentDate:paymentFormValue.paymentDate,
//       paymentAmount:paymentFormValue.paymentAmount,
//       exchangeRates:paymentFormValue.exchangeRates,
//       exchangeRatesMzn:paymentFormValue.exchangeRatesMzn,
//       exchangeRatesAgreementCurrency:paymentFormValue.exchangeRatesAgreementCurrency,
//       paymentAmountinMeticais:paymentFormValue.paymentAmountinMeticais,
//       amountofPayment:paymentFormValue.amountofPayment,
//       paymentAmountUSD:paymentFormValue.paymentAmountUSD,
//       position:paymentFormValue.position

//     }
//   }
//   moveToSelectedTab(tabnames: string) {
//     for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
//         if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabnames) {
//           (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
//         }
//       }
//   }

//   opensweetalert2()
//   {
//     Swal.fire({
//       title: 'Do you want to Save as Draft?',
//       showDenyButton: true,
//       // showCancelButton: true,
//       confirmButtonText: `Save`,
//       denyButtonText: `Cancel`,
//     }).then((result) => {
//       localStorage.setItem('EditPaymentElement','');

//       /* Read more about isConfirmed, isDenied below */
//       if (result.isConfirmed) {

//         Swal.fire('Saved as Draft Successfully!', '', 'success')
//         this.moveToSelectedTab;
//       } else if (result.isDenied) {
//         Swal.fire('Cancelled', '', 'info')
//       }
//     })
//   }

//   opensweetalert()
//   {
//     Swal.fire({
//       title: 'Do you want to Submit the changes?',
//        showDenyButton: true,
//       // showCancelButton: true,
//       confirmButtonText: `Submit`,
//       denyButtonText: `Cancel`,
//     }).then((result) => {
//       localStorage.setItem('EditPaymentElement','');

//       /* Read more about isConfirmed, isDenied below */
//       if (result.isConfirmed) {

//         Swal.fire('Submitted!', '', 'success')
//         this.moveToSelectedTab;
//       } else if (result.isDenied) {
//         Swal.fire('Cancelled', '', 'info')
//       }
//     })
//   }

//   clearForm(form: FormGroup) {
//     form.reset();
//     localStorage.setItem('EditPaymentElement','');
//     }

//     closebuttonedit(){
//       //localStorage.setItem('EditInd','');
//       localStorage.setItem('EditPaymentElement','');
//       }

}
