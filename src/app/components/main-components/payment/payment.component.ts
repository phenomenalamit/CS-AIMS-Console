/**
 * Payment :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component,Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ViewPaymentComponentComponent } from '../../view-components/view-payment-component/view-payment-component.component';
import { ExcelService } from '../../../Service/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { PaymentDocumentUploadComponent } from '../../document-repository/upload-document/payment-document-upload/payment-document-upload.component';
import { Payment } from 'src/app/model/payment';
const ELEMENT_DATA: Payment[] = [

  {position: 1, paymentReference: 'paymentReference1', fundingDonorTitle: 'financing1', projectTitle: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',amount:'1120',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 2,paymentReference: 'paymentReference2', fundingDonorTitle: 'financing2', projectTitle: 'project2',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'2/2/2020',amount:'1121',exchangeRateUSD:'8.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1460M ALL',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 3, paymentReference: 'paymentReference3', fundingDonorTitle: 'financing1', projectTitle: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',amount:'1120',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1389M AUD',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 4, paymentReference: 'paymentReference4', fundingDonorTitle: 'financing2', projectTitle: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'20/2/2020',amount:'1920',exchangeRateUSD:'7.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1356M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 5, paymentReference: 'paymentReference5', fundingDonorTitle: 'financing1', projectTitle: 'project1',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/3/2020',amount:'1120',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 6, paymentReference: 'paymentReference6', fundingDonorTitle: 'financing2', projectTitle: 'project2',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'21/2/2021',amount:'1720',exchangeRateUSD:'8.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 7, paymentReference: 'paymentReference7', fundingDonorTitle: 'financing1', projectTitle: 'project2',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/5/2020',amount:'1120',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 8, paymentReference: 'paymentReference7', fundingDonorTitle: 'financing2', projectTitle: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'19/2/2020',amount:'91120',exchangeRateUSD:'7.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 9, paymentReference: 'paymentReference8', fundingDonorTitle: 'financing1', projectTitle: 'project2',UGBMEO:'UGBMEO1',MEOResourceSources:'MEOResourceSources1',paymentDate:'21/2/2020',amount:'1920',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},
  {position: 10, paymentReference: 'paymentReference8', fundingDonorTitle: 'financing2', projectTitle: 'project1',UGBMEO:'UGBMEO2',MEOResourceSources:'MEOResourceSources2',paymentDate:'15/2/2020',amount:'1820',exchangeRateUSD:'9.2',exchangeRateMZN:6.3,exchangeRateAgreementCurr :'1300M MZN',paymentAmountMZN:'abc',disbursementAmountUSD:'xyz',paymentAmountUSD:'abc'},

];
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  public paymentForm!: FormGroup;
  payment:Payment=new Payment();
  displayedColumns: string[] = ['position','paymentReference', 'financingAgreement','project','UGBMEO','MEOResourceSources','paymentDate','amount','exchangeRates','paymentAmountinMeticais','amountofPayment','paymentAmountUSD','edit'];
  dataSource = ELEMENT_DATA;
  elements!: NodeListOf<Element>;
  usergroup:any;


  exchangeRateMZN!: number;
  exchangeRateUSD!: number;
  exchangeRateAgreementCurr!: number;
  paymentAmountMZN!: number;
  disbursementAmountUSD!: number;
  paymentAmountUSD!: number;

  currency1 = new FormControl();

  onBlur(value) {

    this.paymentForm.controls['amount'].setValue(this.currencyPipe.transform(value, " "));
    console.log("blur  "+this.currencyPipe.transform(value, " "));
  }
  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
   (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }

  filteredOptionsC: Observable<string[]>;

  constructor(private excelService: ExcelService,
    private router :Router, private currencyPipe: CurrencyPipe,private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: HTMLDocument,public translate: TranslateService,private location:Location) { }

    num:any;
    tabClick(index: number) {
      this.num=index;
    }
    // generateExcel(){
    //   console.log("123456");
    //   let obj = new ViewPaymentComponentComponent(this.excelService,this.router,this.dialog,this.location);
    //   obj.ExportTOExcel();
    // }
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

  }

  getCurrency(data){
    const currencyName = data.option.value;
    if(currencyName=='Australia Dollar(AUD)'){
      this.exchangeRateMZN=9.2;
    this.exchangeRateUSD=8.6;
    this.exchangeRateAgreementCurr=8.2;
    this.paymentAmountMZN=9.2;
    this.disbursementAmountUSD=9522;
    this.paymentAmountUSD=9600;
    }
    else if(currencyName=='Great Britain Pound(GBP)'){
      this.exchangeRateMZN=8.2;
    this.exchangeRateUSD=9.6;
    this.exchangeRateAgreementCurr=8.2;
    this.paymentAmountMZN=11.2;
    this.disbursementAmountUSD=9522;
    this.paymentAmountUSD=8600;
    }

    }

  public hasError = (controlName: string, errorName: string) =>{
    return this.paymentForm.controls[controlName].hasError(errorName);
  }

  public createPayment = (paymentFormValue) => {
    if (this.paymentForm.valid) {
      this.executePaymentCreation(paymentFormValue);
    }

  }


  private executePaymentCreation = (paymentFormValue) => {
    let payment: Payment = {
      paymentReference: paymentFormValue.paymentReference,
      fundingDonorTitle: paymentFormValue.fundingDonorTitle,
      projectTitle: paymentFormValue.projectTitle,
      UGBMEO: paymentFormValue.UGBMEO,
      MEOResourceSources:paymentFormValue.MEOResourceSources,
      paymentDate:paymentFormValue.paymentDate,
      amount:paymentFormValue.amount,
      exchangeRateUSD:paymentFormValue.exchangeRateUSD,
      exchangeRateMZN:paymentFormValue.exchangeRateMZN,
      exchangeRateAgreementCurr:paymentFormValue.exchangeRateAgreementCurr,
      paymentAmountMZN:paymentFormValue.paymentAmountMZN,
      disbursementAmountUSD:paymentFormValue.disbursementAmountUSD,
      paymentAmountUSD:paymentFormValue.paymentAmountUSD,
      position:paymentFormValue.position


    }
  }
  moveToSelectedTab(tabnames: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabnames) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
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

  opensweetalert()
  {
    Swal.fire({
      title: 'Do you want to Submit the changes?',
       showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Submitted!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  clearForm(form: FormGroup) {
    form.reset();
    }


    openDialog2() {
      let refNm=localStorage.getItem("paymentRefNM");
      if(refNm == null || refNm== ''){
        Swal.fire('Please Enter Payment Reference Name.')
      }else{
      const dialogRef = this.dialog.open(PaymentDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['payment']);
        console.log(`Dialog result: ${result}`);
      });
    }
    }
}









