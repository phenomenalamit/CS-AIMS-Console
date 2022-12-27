/**
 * Add Payment :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { CurrencyPipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import paymentdata from '../../../data/payment-data.json';
import Swal from 'sweetalert2';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ProjectService } from 'src/app/Service/project.service';
import { Project } from 'src/app/Service-Class/project';
import { CurrencyService } from 'src/app/Service/currency.service';
import { Currency } from 'src/app/Service-Class/currency';
import { FinancingAgreement } from 'src/app/Service-Class/financing-agreement';
import { FinancingAgreementService } from 'src/app/Service/financing-agreement.service';
import { BankOfMozambique } from 'src/app/Service-Class/bank-of-mozambique';
import { Bomdisbursementresponse } from 'src/app/model/bom-disbursement-response';
import { BankOfMozambiqueService } from 'src/app/Service/bank-of-mozambique.service';
import { Payment } from 'src/app/model/payment';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Notification } from 'src/app/Service-Class/notification';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { DisbursementService } from 'src/app/Service/Disbursment.service';
import { DisbursementClass } from 'src/app/Service-Class/Disbursment';

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
  selector: 'app-add-payment-component',
  templateUrl: './add-payment-component.component.html',
  styleUrls: ['./add-payment-component.component.css']
})
export class AddPaymentComponentComponent implements OnInit, OnDestroy {

  public paymentForm!: FormGroup;
  payment:Payment=new Payment();
  displayedColumns: string[] = ['position','paymentReference', 'fundingDonorTitle','project','UGBMEO','MEOResourceSources','paymentDate','amount','exchangeRateUSD','paymentAmountMZN','disbursementAmountUSD','paymentAmountUSD','edit'];
  dataSource = ELEMENT_DATA;
  elements!: NodeListOf<Element>;
  usergroup:any;
  userId:number;
  maxDate = new Date();
  date_flag=true;
  exchangeRateMZN!: number;
  exchangeRateUSD!: number;
  exchangeRateAgreementCurr!: number;
  paymentAmountMZN!: number;
  disbursementAmountUSD!: number;
  paymentAmountUSD!: number;
  cur_flag=true;
  bomozam:BankOfMozambique=new BankOfMozambique();
  bank:any;
  bmozamresponse:Bomdisbursementresponse=new Bomdisbursementresponse();
  dataCurrency :any;
  payment_id:any;
  paymentDataList:any;
  paymentEdit:PaymentCrudService;
  currency = new FormControl();
  saveAsDraftList:PaymentCrudService[];
  draftData:PaymentCrudService[];
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  auto_save_as_draft_flag=false;
  paymentDraftId: string = "";
  userNameForNotification:string="Charlie Adams"; //letter this field will be softcoded
  userGroupForNotification:string="DNGDP Admin"; //letter this field will be softcoded
  id: any = null;
  viewByTableId: any = null;
  draftedId: any= null;
  paymentdata:PaymentCrudService=new PaymentCrudService();
  amount: any;
  pickerDisable_flag: any = false;
  number = 1.3765273;
  format = '1.0-4';
  result = null;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  onBlur(value) {
this.getValueByLang()
   this.amount=this.paymentForm.controls['amount'].value;
   if (this.amount != null && this.amount != '' && this.amount != undefined) {
     value = value.split(",").join("");
     this.paymentForm.controls['amount'].setValue(this.currencyPipe.transform(value, " "));
   }else{
     Swal.fire({
       title: (this.browserLang=='en')?'Please fill amount':'Por favor, preencha a quantidade',
       confirmButtonText: `OK`,
     })
   }
    }
  regex_Currency(e) {
    return e.charCode === 0 ||((e.charCode >= 48 && e.charCode <= 57) ||(e.charCode == 46 &&
    (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }


  filteredOptionsC: Observable<string[]>;

  constructor(
    private financingAgreementService:FinancingAgreementService,
    private disbursementService: DisbursementService,
    private projectService:ProjectService,
     private currencyService:CurrencyService,
    private router :Router,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    @Inject(DOCUMENT) private _document: HTMLDocument,
     public translate: TranslateService,
     private bankService:BankOfMozambiqueService,
    private paymentCrud:PaymentCrudServiceService,
    private notificationService:NotificationService,
    private readonly route: ActivatedRoute,)
    {
      this.getCurrencyDetails();
      // this.getFinancingAgreementList();
      this.getDraftValue();
    }

    num:any;
    tabClick(index: number) {
      this.num=index;
    }
    // EditPayment: any;
    // ViewMorePayment:any;
    select_options_for_finding_hdn_flag=true;
    typeChangeAction() {
      console.log("chk value")
      let stateBudget = this.paymentForm.controls['stateBudget'].value;
      console.log("chk "+stateBudget)
      if(stateBudget=="onBudget" )
    {
      this.select_options_for_finding_hdn_flag=false;
      this.paymentForm.controls['currency'].disable();
      // this.paymentForm.controls['currency'].disable();
      this.paymentForm.controls['UGBMEO'].disable();
      this.paymentForm.controls['MEOResourceSources'].disable();
      this.paymentForm.controls['paymentDate'].disable();
      this.paymentForm.controls['amount'].disable();
      this.paymentForm.controls.UGBMEO.patchValue('option1');
      this.paymentForm.controls.MEOResourceSources.patchValue('option1');
      this.paymentForm.controls.paymentDate.patchValue(moment("14/04/2023", "DD/MM/YYYY"));
      this.paymentForm.controls.amount.patchValue('100.80');
      this.paymentForm.controls.currency.patchValue('Mozambique New Metical(MZN)');
      this.paymentForm.controls.exchangeRateUSD.patchValue(8.6);
      this.paymentForm.controls.exchangeRateMZN.patchValue(9.2);
      this.paymentForm.controls.exchangeRateAgreementCurr.patchValue(8.2);
      this.paymentForm.controls.paymentAmountMZN.patchValue(9.2);
      this.paymentForm.controls.disbursementAmountUSD.patchValue(9522);
      this.paymentForm.controls.paymentAmountUSD.patchValue(9600);

    }else if(stateBudget=="offBudget" )
    {
      this.select_options_for_finding_hdn_flag=true;
      this.paymentForm.controls['paymentDate'].enable();
      this.paymentForm.controls['amount'].enable();
      this.paymentForm.controls['currency'].enable();
      this.paymentForm.controls.currency.patchValue('');
      this.paymentForm.controls.exchangeRateUSD.patchValue('');
      this.paymentForm.controls.exchangeRateMZN.patchValue('');
      this.paymentForm.controls.exchangeRateAgreementCurr.patchValue('');
      this.paymentForm.controls.paymentAmountMZN.patchValue('');
      this.paymentForm.controls.disbursementAmountUSD.patchValue('');
      this.paymentForm.controls.paymentAmountUSD.patchValue('');
      this.paymentForm.controls.paymentDate.patchValue(moment(''));
      this.paymentForm.controls.amount.patchValue('');
    }
    }
    getCurrency():void{
      this.getValueByLang();
      this.bomozam.amount=this.paymentForm.controls.amount.value;
      this.bomozam.currency=this.paymentForm.controls.currency.value;
      this.bomozam.date=this.paymentForm.controls.paymentDate.value;
      console.log("currency is->>"+this.paymentForm.controls.paymentDate.value);
       this.bankService.getCurrencyJson(JSON.stringify(this.bomozam)).subscribe(data=>{
            console.log("error message:"+data.response);
            if(data.response==="Currency found"){
              this.paymentForm.controls.exchangeRateMZN.patchValue(this.currencyPipe.transform(data.exchange_rate_mzn, " "));
              this.paymentForm.controls.exchangeRateUSD.patchValue(this.currencyPipe.transform(data.exchange_rate_usd, " "));
              this.paymentForm.controls.paymentAmountMZN.patchValue(this.currencyPipe.transform(data.amount_in_mzn, " "));
              this.paymentForm.controls.paymentAmountUSD.patchValue(this.currencyPipe.transform(data.amount_in_usd, " "));
              this.select_options_for_finding_hdn_flag=false;
            }
            if(data.response==="Currency found unit"){
            // alert("in Yen");
              console.log("data.exchange_rate_usd:"+data.exchange_rate_usd);
              // this.disbursementForm.controls.exchangeRateUSD.patchValue(this.decimalPipe.transform(this.number, this.format));//data.exchange_rate_usd);
              // this.disbursementForm.controls.exchangeRateMZN.patchValue(this.currencyPipe.transform(data.exchange_rate_mzn, " "));
              // this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.currencyPipe.transform(data.amount_in_mzn, " "));
              // this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.currencyPipe.transform(data.amount_in_usd, " "));
              this.paymentForm.controls.exchangeRateUSD.patchValue(this.decimalPipe.transform(data.exchange_rate_usd, this.format));
              this.paymentForm.controls.exchangeRateMZN.patchValue(this.decimalPipe.transform(data.exchange_rate_mzn, this.format));
              this.paymentForm.controls.paymentAmountMZN.patchValue(this.decimalPipe.transform(data.amount_in_mzn, this.format));
              this.paymentForm.controls.paymentAmountUSD.patchValue(this.decimalPipe.transform(data.amount_in_usd, this.format));
              this.select_options_for_finding_hdn_flag=false;
            }

             if(data.response==="Currency not found"){
              this.select_options_for_finding_hdn_flag=true;
              Swal.fire({
                title:(this.browserLang=='en') ?'Bank of Mozambique server is down. Please try again later':'O servidor do Banco de Moçambique está indisponível. Por favor, tente novamente mais tarde.',
                // showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: `OK`,
                // denyButtonText: `Cancel`,
              })
            } if(data.response==="Currency not found"){
              this.select_options_for_finding_hdn_flag=true;
              Swal.fire({
                title: (this.browserLang=='en') ?'Currency not found.':'Moeda não encontrada.',
                // showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: `OK`,
                // denyButtonText: `Cancel`,
              })
            }

            if(data.response==="Server Down"){
              Swal.fire({
                title: (this.browserLang=='en') ? 'Bank of Mozambique server is down. Please try again later.':'O servidor do Banco de Moçambique está indisponível. Por favor, tente novamente mais tarde.',
                // showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: `OK`,
                // denyButtonText: `Cancel`,
              })
            }


          });

     }
     getAmountFlag(){
      this.date_flag=false;
       }
       getCurFlag(){
        this.cur_flag=false;
          }
       resetAmount(){
        this.paymentForm.controls['amount'].reset();
        this.paymentForm.controls['currency'].reset();
        this.select_options_for_finding_hdn_flag=true;
        this.paymentForm.controls['exchangeRateUSD'].reset();
        this.paymentForm.controls['exchangeRateMZN'].reset();
        this.paymentForm.controls['paymentAmountMZN'].reset();
        this.paymentForm.controls['paymentAmountUSD'].reset();
       }

       editId: any = null;
  browserLang:any;

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Payment'){
        this.authorised_flag=true;
      }
    }
  }
  searchProjectTitle = new FormControl();
  projectTitleList: PaymentCrudService[];

  ngOnInit(): void {
   this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
   this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
   this.setToAuthFlag();
   this.getProjectList();
  //  this.getProjectTitleDetails();
  //  this.chkDraft();
  // alert(this.paymentDraftId);
  localStorage.setItem("paymentRefNM", null);
  localStorage.removeItem('paymentRefNM');
    /* Below is for At Edit time we have to get the id from url */
    this.id = this.route.snapshot.paramMap.get("id");
 /* Below is for At View more time we have to get the id from url */
 this.viewByTableId = this.route.snapshot.paramMap.get("payment_id");
 this.draftedId = this.route.snapshot.paramMap.get("drafted_payment_id");
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    // this.EditPayment = localStorage.getItem("EditPayment");
    // this.ViewMorePayment = localStorage.getItem("ViewMorePayment");

    this.paymentForm = new FormGroup({
      payment_id: new FormControl(''),
      language:new FormControl(''),
      paymentReference: new FormControl('', [Validators.required]),
      fundingDonorTitle: new FormControl('', [Validators.required]),
      projectTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      UGBMEO!:new FormControl({value:''}),
      MEOResourceSources!:new FormControl({value:''}),
      paymentDate!:new FormControl('', [Validators.required]),
      stateBudget:new FormControl({value:'Off-Budget',disabled:true}),
      exchangeRateUSD!:new FormControl({value:'',disabled:true}),
      exchangeRateMZN!:new FormControl({value:'',disabled:true}),
      exchangeRateAgreementCurr!: new FormControl({value:'',disabled:true}),
      paymentAmountMZN!:new FormControl({value:'',disabled:true}),
      disbursementAmountUSD!:new FormControl({value:'',disabled:true}),
      paymentAmountUSD!:new FormControl({value:'',disabled:true}),
      currency : new FormControl('',[Validators.required]),
      saveAsDraftId: new FormControl('')
    });


  // this.EditPayment = localStorage.getItem("EditPayment");
    // if (this.EditPayment == "EditPayment") {
    //   this.payment_id = localStorage.getItem("payment_id");
    if (this.id != null) {
      this.auto_save_as_draft_flag=false;
      this.id = this.route.snapshot.paramMap.get("id");
      this.paymentCrud.getEditPaymentById(this.id).subscribe(data=>{
      console.log("payment data : ", data);
      this.paymentDataList=data;
      this.paymentEdit = this.paymentDataList;
      // console.log("payment data : ", this.paymentEdit);
      // console.log("paymentForm", this.paymentForm);
      this.paymentForm.controls.payment_id.patchValue(this.paymentEdit[0].payment_id);
      this.editId = this.paymentForm.controls['payment_id'].value;
      this.paymentForm.controls.paymentReference.patchValue(this.paymentEdit[0].paymentReference);
      localStorage.setItem("paymentRefNM", this.paymentEdit[0].paymentReference);
      // this.paymentForm.controls.fundingDonorTitle.patchValue(+this.paymentEdit[0].financialAgreementId);
      // this.paymentForm.controls.projectTitle.patchValue(this.paymentEdit[0].projectTitle);
      let idProject= Number.parseInt(this.paymentEdit[0].idProject);
      this.paymentForm.controls['projectTitle'].patchValue(idProject);
      this.getFinancialDetailsByPrjIdPatch(idProject);
      
      this.paymentForm.controls.UGBMEO.patchValue(this.paymentEdit[0].UGBMEO);
      this.paymentForm.controls.stateBudget.patchValue(this.paymentEdit[0].stateBudget);
      this.paymentForm.controls.MEOResourceSources.patchValue(this.paymentEdit[0].MEOResourceSources);
      this.paymentForm.controls.paymentDate.patchValue(this.paymentEdit[0].paymentDate);
      this.getAmountFlag();
      this.getCurFlag();
      this.paymentForm.controls.amount.patchValue(this.paymentEdit[0].amount);
     this.paymentForm.controls.currency.patchValue(this.paymentEdit[0].currencyId);
     this.select_options_for_finding_hdn_flag=false;
     this.paymentForm.controls.exchangeRateUSD.patchValue(this.paymentEdit[0].exchangeRateUSD);
      this.paymentForm.controls.exchangeRateMZN.patchValue(this.paymentEdit[0].exchangeRateMZN);
      this.paymentForm.controls.paymentAmountUSD.patchValue(this.paymentEdit[0].paymentAmountUSD);
      this.paymentForm.controls.paymentAmountMZN.patchValue(this.paymentEdit[0].paymentAmountMZN);
    //  localStorage.setItem("EditPayment", "reset-edit-payment");

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

  //  this.ViewMorePayment=localStorage.getItem("ViewMorePayment")
  //   if (this.ViewMorePayment == "ViewMorePayment") {
    if (this.viewByTableId != null)  {
      this.auto_save_as_draft_flag=false;
      this.paymentForm.disable();
      // this.payment_id = localStorage.getItem("payment_id");

      this.paymentCrud.getEditPaymentById(this.viewByTableId).subscribe(data=>{
      console.log("payment data : ", data);
      this.paymentDataList=data;
      this.paymentEdit = this.paymentDataList;
      console.log("paymentForm", this.paymentForm);
      this.paymentForm.controls.payment_id.patchValue(this.paymentEdit[0].payment_id);
      this.paymentForm.controls.paymentReference.patchValue(this.paymentEdit[0].paymentReference);
      // this.paymentForm.controls.projectTitle.patchValue(this.paymentEdit[0].projectId);
      // this.paymentForm.controls.fundingDonorTitle.patchValue(+this.paymentEdit[0].financialAgreementId);
      // this.paymentForm.controls.projectTitle.patchValue(this.paymentEdit[0].projectTitle);
      let idProject= Number.parseInt(this.paymentEdit[0].idProject);
      this.paymentForm.controls['projectTitle'].patchValue(idProject);
      this.getFinancialDetailsByPrjIdPatch(idProject);
        
      this.paymentForm.controls.UGBMEO.patchValue(this.paymentEdit[0].UGBMEO);
      this.paymentForm.controls.stateBudget.patchValue(this.paymentEdit[0].stateBudget);
      this.paymentForm.controls.MEOResourceSources.patchValue(this.paymentEdit[0].MEOResourceSources);
      // this.paymentForm.controls.paymentDate.patchValue(moment(this.paymentEdit[0].paymentDate).format("DD/MM/YYYY"));
      this.paymentForm.controls.paymentDate.patchValue(this.paymentEdit[0].paymentDate);
      this.paymentForm.controls['paymentDate'].disable();
      this.pickerDisable_flag = true;
      this.getAmountFlag();
      this.getCurFlag();
      this.paymentForm.controls.amount.patchValue(this.paymentEdit[0].amount);
     this.paymentForm.controls.currency.patchValue(this.paymentEdit[0].currencyId);
     this.select_options_for_finding_hdn_flag=false;
      this.paymentForm.controls.exchangeRateUSD.patchValue(this.paymentEdit[0].exchangeRateUSD);
      this.paymentForm.controls.exchangeRateMZN.patchValue(this.paymentEdit[0].exchangeRateMZN);
      this.paymentForm.controls.paymentAmountUSD.patchValue(this.paymentEdit[0].paymentAmountUSD);
      this.paymentForm.controls.paymentAmountMZN.patchValue(this.paymentEdit[0].paymentAmountMZN);

    //  localStorage.setItem("ViewMorePayment", "reset-view-payment");

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

    if (this.draftedId != null)  {
      this.auto_save_as_draft_flag=false;
      this.paymentForm.disable();
      // this.payment_id = localStorage.getItem("payment_id");

      this.paymentCrud.getEditPaymentById(this.draftedId).subscribe(data=>{
      console.log("payment data : ", data);
      this.paymentDataList=data;
      this.paymentEdit = this.paymentDataList;
      console.log("paymentForm", this.paymentForm);
      this.paymentForm.controls.payment_id.patchValue(this.paymentEdit[0].payment_id);
      this.paymentForm.controls.paymentReference.patchValue(this.paymentEdit[0].paymentReference);
      // this.paymentForm.controls.projectTitle.patchValue(this.paymentEdit[0].projectId);
      this.paymentForm.controls.fundingDonorTitle.patchValue(+this.paymentEdit[0].financialAgreementId);
      // this.paymentForm.controls.fundingDonorTitle.patchValue(+this.paymentEdit[0].financialAgreementId);
      // this.paymentForm.controls.projectTitle.patchValue(this.paymentEdit[0].projectTitle);
      let idProject= Number.parseInt(this.paymentEdit[0].idProject);
        this.paymentForm.controls['projectTitle'].patchValue(idProject);
      this.paymentForm.controls.UGBMEO.patchValue(this.paymentEdit[0].UGBMEO);
      this.paymentForm.controls.stateBudget.patchValue(this.paymentEdit[0].stateBudget);
      this.paymentForm.controls.MEOResourceSources.patchValue(this.paymentEdit[0].MEOResourceSources);
      // this.paymentForm.controls.paymentDate.patchValue(moment(this.paymentEdit[0].paymentDate).format("DD/MM/YYYY"));
      this.paymentForm.controls.paymentDate.patchValue(this.paymentEdit[0].paymentDate);
      this.paymentForm.controls['paymentDate'].disable();
      this.pickerDisable_flag = true;
      this.getAmountFlag();
      this.getCurFlag();
      this.paymentForm.controls.amount.patchValue(this.paymentEdit[0].amount);
     this.paymentForm.controls.currency.patchValue(this.paymentEdit[0].currencyId);
     this.select_options_for_finding_hdn_flag=false;
      this.paymentForm.controls.exchangeRateUSD.patchValue(this.paymentEdit[0].exchangeRateUSD);
      this.paymentForm.controls.exchangeRateMZN.patchValue(this.paymentEdit[0].exchangeRateMZN);
      this.paymentForm.controls.paymentAmountUSD.patchValue(this.paymentEdit[0].paymentAmountUSD);
      this.paymentForm.controls.paymentAmountMZN.patchValue(this.paymentEdit[0].paymentAmountMZN);

    //  localStorage.setItem("ViewMorePayment", "reset-view-payment");

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

  }
  ngOnDestroy(){
    if(this.auto_save_as_draft_flag==true){
      this.autoSaveAsDraftDetails();
    }
  }

  autoSaveAsDraft(){
    this.auto_save_as_draft_flag=true;
  }




  public hasError = (controlName: string, errorName: string) =>{
    return this.paymentForm.controls[controlName].hasError(errorName);
  }

  public createPayment = (paymentFormValue) => {
    console.log(paymentFormValue)
    if (this.paymentForm.valid) {

      this.executePaymentCreation(paymentFormValue);
    }

  }

   //for notification alert execute on save disbursement
   savePaymentInsertAlert(){
    let notificationDetails:Notification=new Notification();
    let todayTime=new Date();

    //email subject
    let subjectForEmail:string='Payment Reference ID "'
      +this.paymentForm.controls['paymentReference'].value
      +'" for Project "'
      +this.findProjectNameById(this.paymentForm.controls['projectTitle'].value)
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Payment Reference ID "'
      +this.paymentForm.controls['paymentReference'].value
      +'" for Project "'
      +this.findProjectNameById(this.paymentForm.controls['projectTitle'].value)
      +'" has been created by user "'+this.userNameForNotification
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-payment\\';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup=this.userGroupForNotification;
    notificationDetails.updatedBy=this.userNameForNotification;
    notificationDetails.notificationMsg=this.userNameForNotification+" has created payment on "+(todayTime+'').substring(0,24);
    notificationDetails.updatedOn=todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.moveToViewTab();
    });
  }

  //for notification alert, execute on update disbursement
  paymentUpdateAlert(){
    let todayTime=new Date();

    //email subject
    let subjectForEmail:string='Payment Reference ID "'
      +this.paymentForm.controls['paymentReference'].value
      +'" for Project "'
      +this.findProjectNameById(this.paymentForm.controls['projectTitle'].value)
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Payment Reference ID "'
      +this.paymentForm.controls['paymentReference'].value
      +'" for Project "'
      +this.findProjectNameById(this.paymentForm.controls['projectTitle'].value)
      +'" has been edited by user "'+this.userNameForNotification
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-payment\\'+this.id;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';

    // let notificationDetails:Notification=new Notification();
    // notificationDetails.notificationGroup=this.userGroupForNotification;
    // notificationDetails.updatedBy=this.userNameForNotification;
    // notificationDetails.notificationMsg=this.userNameForNotification+" has update payment on "+(todayTime+'').substring(0,24);
    // notificationDetails.updatedOn=todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data =>{
    //   console.log(data);
    // });

    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToViewTab();
  }

  projectTitlefilteredOption: Observable<any[]>;
  // private getProjectTitleDetails() {
  //   this.paymentCrud.get.subscribe(data => {
  //     this.projectTitleList = data;
  //     console.log("projectTitleList is:", this.projectTitleList);
  //     console.log("projectTitleListData is:", data);
  //     this.projectTitlefilteredOption = this.searchProjectTitle.valueChanges
  //       .pipe(
  //         startWith(''),
  //         map(projectTitleDAta => projectTitleDAta ? this.filterProjectTitle(projectTitleDAta) : this.projectTitleList.slice())
  //       );
  //   });
  // }

  private filterProjectTitle(name: string) {
    return this.projectList.filter(projectTitleDAta =>
      projectTitleDAta.projectTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);

  }
  //for notification alert
  private findProjectNameById(id:number):string{
    let projectName:string=null;
    for(let i=0;i<this.projectList.length;i++){
      if(this.projectList[i].idProject==id){
        projectName=this.projectList[i].projectTitle;
      }
    }
    return projectName;
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
  moveToSelectedTab() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/payment']));
  }
  moveToPaymentTab(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-payment']));
  }
  moveToSelectedTabEdit(tabName: string) {
    // localStorage.setItem("EditPayment", "EditPayment");
    if (this.id != null) {
    // console.log("editenv inside view--->",localStorage.getItem("EditPayment"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-payment']));
    console.log("after route");
    }
}
  savePayment(){
    this.getValueByLang()
    this.paymentForm.controls.language.setValue(this.browserLang);
    let notifiList:Notification=new Notification();
    let fundingId:number=this.paymentForm.controls['fundingDonorTitle'].value;
    let currPmtAmt:string=this.paymentForm.controls['amount'].value;
    
  // the below code to replace all comma
  currPmtAmt = currPmtAmt.replace(/,/g, '');

    console.log("chk amnt ",currPmtAmt);
    this.notificationService.findRestDisbursedAmountAfterPayment(fundingId,currPmtAmt).subscribe(retData=>{
      notifiList=retData;
      if(notifiList.notificationMsg==null){
       
        this.paymentCrud.savePayment(this.paymentForm.getRawValue()).subscribe(data => {
          console.log(data);
          this.auto_save_as_draft_flag=false;
          if(this.browserLang=='en')
          Swal.fire('Submitted successfully', '', 'success')
          else
          Swal.fire('Submetido com sucesso', '', 'success')
          this.savePaymentInsertAlert();
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
      else{
        Swal.fire(notifiList.notificationMsg,'','error');
      }
    });
  }
  opensweetalert2()
  {
    this.getValueByLang()
    if((this.paymentForm.controls['projectTitle'].value) == null){
      this.paymentForm.controls['projectTitle'].setValue('');
    }
    if((this.paymentForm.controls['fundingDonorTitle'].value) == null){
      this.paymentForm.controls['fundingDonorTitle'].setValue('');
    }
    if((this.paymentForm.controls['amount'].value) == null){
      this.paymentForm.controls['amount'].setValue('');
    }
    if((this.paymentForm.controls['currency'].value) == null){
      this.paymentForm.controls['currency'].setValue('');
    }

    console.log("save as draft value ",this.paymentForm.getRawValue())

    Swal.fire({
      title:(this.browserLang=='en') ?'Do you want to save as Draft?':'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en') ?`Save`:'Salve',
      denyButtonText: (this.browserLang=='en') ?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.savePaymentDraft();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  autoSaveAsDraftDetails()
  {
    if((this.paymentForm.controls['projectTitle'].value) == null){
      this.paymentForm.controls['projectTitle'].setValue('');
    }
    if((this.paymentForm.controls['fundingDonorTitle'].value) == null){
      this.paymentForm.controls['fundingDonorTitle'].setValue('');
    }
    if((this.paymentForm.controls['amount'].value) == null){
      this.paymentForm.controls['amount'].setValue('');
    }
    if((this.paymentForm.controls['currency'].value) == null){
      this.paymentForm.controls['currency'].setValue('');
    }
    this.autoSavePaymentDraft();
  }
  openMandatoryAlert(){
    this.getValueByLang()
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalert()
  {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Submit ?':'Deseja Submeter?',
       showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Enviar',
      denyButtonText:(this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {

      if (result.isConfirmed) {
        this.paymentdata.payment_id = this.paymentDraftId;
        this.paymentDraftId = "";
        this.savePayment();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  clearPmtDate(event) {
    event.stopPropagation();
    this.paymentForm.controls['paymentDate'].reset();
  }

  clearForm(form: FormGroup) {
     // form.reset();
      //alert(this.paymentDraftId);
      console.log("draft id in reset is",this.paymentForm.get("saveAsDraftId").value);
      console.log("draft id in value is",this.paymentDraftId);
    this.paymentForm.get("fundingDonorTitle").reset();
    this.paymentForm.get("projectTitle").reset();
    this.paymentForm.get("paymentDate").reset();
    this.paymentForm.get("amount").reset();
    this.paymentForm.get("currency").reset();
    this.paymentForm.get("exchangeRateUSD").reset();
    this.paymentForm.get("exchangeRateMZN").reset();
    this.paymentForm.get("paymentAmountMZN").reset();
    this.paymentForm.get("paymentAmountUSD").reset();
    this.paymentForm.get("saveAsDraftId").setValue(" ");
    this.paymentForm.get("paymentReference").reset();
    this.select_options_for_finding_title_hdn_flag = true;
    this.select_options_for_finding_hdn_flag = true;
    this.date_flag= true;
    this.cur_flag=true;
    }
    public projectList:Project[];
    private getProjectList(){
      if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
        this.projectService. getPmtProjectTitleDetailsByUserAccessId(this.userId).subscribe(data=>{
          this.projectList=data;
          this.projectTitlefilteredOption = this.searchProjectTitle.valueChanges
          .pipe(
            startWith(''),
            map(projectTitleDAta => projectTitleDAta ? this.filterProjectTitle(projectTitleDAta) : this.projectList.slice())
          );
        });
      }
      else {
        this.projectService. getProjectList().subscribe(data=>{
          this.projectList=data;
  
          this.projectTitlefilteredOption = this.searchProjectTitle.valueChanges
          .pipe(
            startWith(''),
            map(projectTitleDAta => projectTitleDAta ? this.filterProjectTitle(projectTitleDAta) : this.projectList.slice())
          );
        });
      }
    }
    currenyList:Currency[];
    currencyfilteredOption:Observable<any[]>;
    today:any;
    select_options_for_finding_title_hdn_flag = true;
    getFinancialDetailsByPrjId(){
      let projectTitle = this.paymentForm.controls.projectTitle.value;

      if (projectTitle != '' && projectTitle != null) {
        this.select_options_for_finding_title_hdn_flag = false;
        this.getFinancingAgreementList();
      } else {
        this.select_options_for_finding_title_hdn_flag = true;
      }
    }
    getFinancialDetailsByPrjIdPatch(projectTitle:any){
      if (projectTitle != '' && projectTitle != null) {
        this.select_options_for_finding_title_hdn_flag = false;
        this.getFinancingAgreementListPatch();
      } else {
        this.select_options_for_finding_title_hdn_flag = true;
      }
    }
    private getCurrencyDetails(){
      this.currencyService. getCurrencyDetails().subscribe(data=>{
        this.currenyList=data;
        for (let i = 0; i < this.currenyList.length; i++) {
          let crtDt=this.currenyList[i].createdOn;
          let updateDt=this.currenyList[i].updatedOn;
           this.today=new Date();
           crtDt=new Date(crtDt);
          //calculate time difference
         var time_difference = this.today.getTime() - crtDt.getTime();
         //calculate days difference by dividing total milliseconds in a day
         var days_difference = time_difference / (1000 * 60 * 60 * 24);
         this.currenyList[i].updateDifference=15
         if(updateDt !=null){
          updateDt=new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.currenyList[i].updateDifference=days_differenceForUpdate;
         }
          (this.currenyList[i].difference)=days_difference;
        }
       //console.log("data is "+ this.currenyList)

       this.currencyfilteredOption = this.searchCurrency.valueChanges
          .pipe(
            startWith(''),
            map(currencyDAta => currencyDAta ? this.filterCurrency(currencyDAta) : this.currenyList.slice())
          );
      });
    }
    private filterCurrency(name: string) {

      return this.currenyList.filter(currencyData =>
        currencyData.currency_fullname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 || currencyData.currency_shortname.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }

    public financingAgreementList:DisbursementClass[];
    private getFinancingAgreementList(){
      var projectId=this.paymentForm.controls['projectTitle'].value;
      // this.financingAgreementService. getFinancingAgreementList().subscribe(data=>{
        this.disbursementService.getFundingTitleListByPrjId(projectId).subscribe(data => {
        this.financingAgreementList=data;
       });
    }
    private getFinancingAgreementListPatch(){
      var projectId=this.paymentForm.controls['projectTitle'].value;
      // this.financingAgreementService. getFinancingAgreementList().subscribe(data=>{
        this.disbursementService.getFundingTitleListByPrjId(projectId).subscribe(data => {
        this.financingAgreementList=data;
        console.log("this.financingAgreementList: ",this.financingAgreementList);
        
        if(this.id!=null || this.viewByTableId!=null || this.draftedId!=null)
        console.log(true);
        this.paymentForm.controls.fundingDonorTitle.patchValue(this.paymentEdit[0].financialAgreementId);
       });
    }
    searchCurrency= new FormControl();

    moveToViewTab(){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/admin/view-payment']));
    }
    updatePayment(){
      this.getValueByLang()
      this.paymentForm.controls.language.setValue(this.browserLang);
      let notifiList:Notification=new Notification();
      let fundingId:number=this.paymentForm.controls['fundingDonorTitle'].value;
      let currPmtAmt:string=this.paymentForm.controls['amount'].value;
      currPmtAmt = currPmtAmt.replace(/,/g, '');
      this.notificationService.findRestDisbursedAmountAfterPayment(fundingId,currPmtAmt).subscribe(retData=>{
        notifiList=retData;
        if(notifiList.notificationMsg==null){
          console.log(this.paymentForm.value);
          this.paymentCrud.editPayment(this.paymentForm.getRawValue()).subscribe(data => {
            console.log("Updated Data is:",data);
            this.auto_save_as_draft_flag=false;
            if(this.browserLang=='en')
            Swal.fire('Updated successfully', '', 'success');
            else
            Swal.fire('Actualizado com sucesso', '', 'success');
            this.paymentUpdateAlert();
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
        else{
          Swal.fire(notifiList.notificationMsg,'','error');
        }
      });
   }
   

   openSweetalertUpdate() {
     this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Update?':'Deseja Actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        // console.log("in update alert ");
        this.paymentForm.controls.payment_id.patchValue(this.editId);
        this.updatePayment();

       // this.moveToSelectedTab;
       // this.moveToViewTab();
      } else if(result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  savePaymentDraft(){
    console.log(this.paymentForm.value)
    this.getValueByLang()
    if (this.paymentForm.controls['saveAsDraftId'].value != null) {
      console.log("this.paymentForm.controls['saveAsDraftId'].value:" + this.paymentForm.controls['saveAsDraftId'].value);
      this.paymentForm.controls['payment_id'].patchValue(this.paymentForm.controls['saveAsDraftId'].value);
    }
    this.paymentCrud.savePaymentDraft(this.paymentForm.getRawValue()).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Payment data saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados do pagamento salvos como Rascunho com sucesso', '', 'success');
      this.moveToSelectedTab();
      this.chkDraft();

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

  autoSavePaymentDraft(){
    this.getValueByLang()
    console.log(this.paymentForm.value)
    if (this.paymentForm.controls['saveAsDraftId'].value != null) {
      console.log("this.paymentForm.controls['saveAsDraftId'].value:" + this.paymentForm.controls['saveAsDraftId'].value);
      this.paymentForm.controls['payment_id'].patchValue(this.paymentForm.controls['saveAsDraftId'].value);
    }
    this.paymentCrud.savePaymentDraft(this.paymentForm.getRawValue()).subscribe(data => {
      console.log(data);
      this.auto_save_as_draft_flag=false;
      if(this.browserLang=='en')
      Swal.fire('Payment data saved as Draft successfully', '', 'success');
      else
      Swal.fire('Dados do pagamento salvos como Rascunho com sucesso', '', 'success');
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

    viewMorePayment(){
      let payment_id:any=this.paymentForm.controls.payment_id.value;
      // localStorage.setItem("payment_id", payment_id);
      // localStorage.setItem("EditPayment", "EditPayment");
      // console.log("View More inside view--->",localStorage.getItem("EditPayment"));
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/admin/edit-payment',payment_id]));
    }

    chkDraft() {
      this.getValueByLang()
      this.paymentCrud.getPaymentDraftViewList().subscribe(data => {
         /* Below condition is for to check data present or not in db */
         if (data.length == 0) {
           if(this.browserLang=='en')
           Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
           else
           Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error')
         }else{
           this.saveAsDraftList = data;
         }
       });
     }

     draftValue(){

      console.log("Inside Draft");
    let payment_id = this.paymentForm.controls['saveAsDraftId'].value;
    console.log("draft Id:",this.payment_id);
    this.auto_save_as_draft_flag=false;
    this.paymentCrud.patchPaymentDraftValue(payment_id).subscribe(data => {
      this.draftData = data;
      //alert("Draft Data is:"+JSON.stringify(this.draftData) );
      console.log("draftdata Patch:",this.draftData);
      for (let i = 0; i < this.draftData.length; i++) {
        this.paymentDraftId=this.draftData[0].payment_id;
        this.paymentForm.controls.payment_id.patchValue(this.draftData[0].payment_id);
        this.paymentForm.controls.paymentReference.patchValue(this.draftData[0].paymentReference);

        if (this.draftData[0].projectTitle == null) {
          this.paymentForm.controls.projectTitle.patchValue('');
        } else {
          this.paymentForm.controls.projectTitle.patchValue(this.draftData[0].projectTitle.idProject);
        }


        //alert("Draft Data is:"+JSON.stringify(this.draftData[0]));
        if (this.draftData[0].fundingDonorTitle == null) {
          this.paymentForm.controls.fundingDonorTitle.patchValue('');
        } else {
           this.paymentForm.controls.fundingDonorTitle.patchValue(this.draftData[0].fundingDonorTitle.financialAgreementId);
        }


        // this.paymentForm.controls.UGBMEO.patchValue(this.draftData[0].UGBMEO);
        this.paymentForm.controls.stateBudget.patchValue(this.draftData[0].stateBudget);
        // this.paymentForm.controls.MEOResourceSources.patchValue(this.draftData[0].MEOResourceSources);
        this.paymentForm.controls.paymentDate.patchValue(this.draftData[0].paymentDate);
        this.getAmountFlag();
        this.getCurFlag();
        this.paymentForm.controls.amount.patchValue(this.draftData[0].amount);
        if(this.draftData[0].currency==null){
          this.paymentForm.controls.currency.patchValue('');
        }else{
          this.paymentForm.controls.currency.patchValue(this.draftData[0].currency.currency_id);
        }
        this.select_options_for_finding_hdn_flag=false;
        this.paymentForm.controls.exchangeRateUSD.patchValue(this.draftData[0].exchangeRateUSD);
        this.paymentForm.controls.exchangeRateMZN.patchValue(this.draftData[0].exchangeRateMZN);
        this.paymentForm.controls.paymentAmountUSD.patchValue(this.draftData[0].paymentAmountUSD);
        this.paymentForm.controls.paymentAmountMZN.patchValue(this.draftData[0].paymentAmountMZN);
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
  searchDraft= new FormControl('');
  draftfilteredOption: Observable<any[]>;
  getDraftValue(){
    this.paymentCrud.getPaymentDraftViewList().subscribe(data => {
      /* Below condition is for to check data present or not in db */
      this.saveAsDraftList = data;
      for(let k=0;k<this.saveAsDraftList.length;k++){
        if(this.saveAsDraftList[k].paymentReference==null){
          this.saveAsDraftList[k].paymentReference=""
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
      (data.paymentReference==null)?'':data.paymentReference.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  checkDuplicatePaymentRef(){
    this.getValueByLang();
    let reference:string=this.paymentForm.controls['paymentReference'].value;
    let fundingId:any=this.paymentForm.controls['fundingDonorTitle'].value;
    if((reference!=null && reference!='' && reference!=undefined) && (fundingId!=null && fundingId!=undefined && fundingId!='')){
      this.paymentCrud.checkDuplicatePaymentReference(reference,fundingId).subscribe(data=>{
        var val = JSON.parse(JSON.stringify(data));
        if(val.isDuplicateReference==true){
          Swal.fire({
            title: (this.browserLang=='en')?'This name already exists, try something else.':'Este nome já existe, tente outro.',
            confirmButtonText: `OK`,
          });
          this.paymentForm.controls['paymentReference'].reset();
          this.paymentForm.controls['fundingDonorTitle'].reset();
        }
      });
    }
  }

  publish() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to Publish?':'Deseja Publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')? `Publish`:'Publicar',
      denyButtonText: (this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id:number[] = [this.draftedId];
        if (id.length > 0) {
          this.paymentCrud.publishById(id).subscribe(data => {
            (this.browserLang=='en')?Swal.fire('Published successfully', '', 'success'):Swal.fire('Publicado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-payment']);
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
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id:number[] = [this.draftedId];
        if (id.length > 0) {
          this.paymentCrud.discardById(id).subscribe(data => {
            (this.browserLang=='en')?Swal.fire('Discarded successfully. ', '', 'success'):Swal.fire('Descartado com sucesso', '', 'success').then((result) => {
              if(result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-payment']);
            });
          },
            error => console.log(error));
        }
      }
    });
  }

  goBack(){
    this.router.navigate(['/admin/view-drafted-payment']);
  }

  editAmount(value) {
    this.paymentForm.controls.amount.setValue(
      value.replace(/[^0-9.]+/g, '')
    );
  }
  viewAmount(value) {
    this.paymentForm.controls.amount.setValue(
      this.currencyPipe.transform(value, ' ')
    );
  }
  enableUploadBtn(){
    let refNm=this.paymentForm.controls.paymentReference.value;
    if(refNm != null || refNm!='')
    localStorage.setItem("paymentRefNM", refNm);
    else
    localStorage.setItem("paymentRefNM", null);
  }
}
