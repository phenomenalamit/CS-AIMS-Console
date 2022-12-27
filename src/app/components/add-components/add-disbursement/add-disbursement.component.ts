/**
 * Add Disbursement :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { CurrencyPipe, DecimalPipe, DOCUMENT, Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Disbursement } from 'src/app/model/disbursement';
import { ExcelService } from 'src/app/Service/excel.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { BankOfMozambiqueService } from 'src/app/Service/bank-of-mozambique.service';
import { BankOfMozambique } from 'src/app/Service-Class/bank-of-mozambique';
import { Bomdisbursementresponse } from 'src/app/model/bom-disbursement-response';
import { DisbursementService } from 'src/app/Service/Disbursment.service';
import { DisbursementClass } from 'src/app/Service-Class/Disbursment';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { CurrencyService } from 'src/app/Service/currency.service';
import { Currency } from 'src/app/Service-Class/currency';
import { DialogBoxComponent } from 'src/app/dialog-box/dialog-box.component';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Notification } from 'src/app/Service-Class/notification';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

@Component({
  selector: 'app-add-disbursement',
  templateUrl: './add-disbursement.component.html',
  styleUrls: ['./add-disbursement.component.css']
})

export class AddDisbursementComponent implements OnInit, OnDestroy {
  select_options_for_finding_title_hdn_flag = true;
  swiftCodePattern = "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$";
  uAccessPermArr: UserAccessPermission[] = [];
  authorised_flag = false;
  auto_save_as_draft_flag = false;

  public disbursementForm!: FormGroup;
  disbursement: Disbursement = new Disbursement();
  displayedColumns: string[] = ['position', 'disbursementReference', 'projectTitle', 'fundingTitle',
    'amount', 'exchangeRates', 'amountOfdisbursementMeticais',
    'amountOfdisbursementUSD', 'amountOfdisbursementAgreement', 'names', 'date',
    'swiftcode', 'receivedswiftcode', 'receivedBankNIB', 'edit'];

  elements!: NodeListOf<Element>;

  organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco', 'Mozambique Government', 'WHO'];

  projectNameLists: string[] = ['Mozambique Infrastructure Project', 'Beira Express Way', 'Maputo Smart City'
    , 'Bilene International Airport', 'Pemba Memorial Highway'];
  filteredOptions: Observable<string[]>;
  projectListOptions: Observable<string[]>;
  usergroup: any;
  userId:number;
  pickerDisable_flag: any = false;
  select_options_for_finding_hdn_flag = true;
  check_swift_flag = true;
  check_swift1_flag = true;
  check_swiftrecv_flag = true;
  check_swiftrecv1_flag = true;
  check_Nib1_flag = true;
  check_Nib_flag = true;
  date_flag = true;
  disableTextbox = false;
  duplicate_flag = true;
  maxDate = new Date();
  currency = new FormControl();
  cur_flag = true;
  disbursement_id: any;
  disbursementDataList: any;
  saveAsDraftList: DisbursementCrudService[];
  draftData: DisbursementCrudService[];
  disbursementEdit: DisbursementCrudService;
  disbursementDraftId: string = "";
  options: string[] = ['AUD', 'EUR', 'ZAR', 'AED', 'BRL', 'BUA', 'CAD', 'CHF', 'CNH']
  disbursementdraftData: DisbursementCrudService = new DisbursementCrudService();
  filteredOptionsC: Observable<string[]>;
  ViewMoreDisbursementFromProject: any;
  index: any;

  userNameForNotificationAlert: string = "Charlie Adams"; //letter this field will be softcoded
  userGroupForNotificationAlert: string = "DNGDP Admin"; //letter this field will be softcoded
  swiftMessage = '';
  id: any = null;
  viewByTableId: any = null;
  disbursementdata: DisbursementCrudService = new DisbursementCrudService();

  constructor(private currencyPipe: CurrencyPipe, private currencyService: CurrencyService,
    private fundingOrganizationService: FundingOrganizationService, private disbursementService: DisbursementService,
    private router: Router, public translate: TranslateService,
    @Inject(DOCUMENT) private _document: HTMLDocument, private excelService: ExcelService, public dialog: MatDialog,
    private bankService: BankOfMozambiqueService, private disbursementCrud: DisbursementCrudServiceService, private route: ActivatedRoute,
    private notificationService: NotificationService, private decimalPipe: DecimalPipe, private _location: Location) {

    this.getDraftValue();
    this.getValueByLang()
  }

  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }

  num: any;
  datu: any;

  tabClick(index: number) {
    this.num = index;
  }
  // EditDisbursement: any;
  // ViewMoreDisbursement: any;
  currenyList: BankOfMozambique[];
  bomozam: BankOfMozambique = new BankOfMozambique();
  bank: any;
  bmozamresponse: Bomdisbursementresponse = new Bomdisbursementresponse();
  dataCurrency: any;
  fn: any;
  editId: any = null;
  number = 1.3765273;
  format = '1.0-4';
  result = null;

  browserLang: any;

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Create Disbursement') {
        this.authorised_flag = true;
      }
    }
  }
  viewDraftedId: any = null;
  enableUploadBtn() {
    let refNm = this.disbursementForm.controls.disbursementReference.value;
    if (refNm != null || refNm != '')
      localStorage.setItem("disbRefNM", refNm);
    else
      localStorage.setItem("disbRefNM", null);
  }
  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.setToAuthFlag();
    //this.getFundingOrganization();
    this.getCurrencyDetails();
    this.getProjectTitleDetails();
    // this.chkDraft();
    localStorage.setItem("disbRefNM", null);
    localStorage.removeItem('disbRefNM');
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    // console.log("this.browserLang",this.browserLang);
    console.log("Inside add disbursement");

    // edit code starts here
    // this.EditDisbursement = localStorage.getItem("EditDisbursement");
    // this.ViewMoreDisbursement = localStorage.getItem("ViewMoreDisbursement");
    /* Below is for At Edit time we have to get the id from url */
    this.id = this.route.snapshot.paramMap.get("id");
    /* Below is for At View more time we have to get the id from url */
    this.viewByTableId = this.route.snapshot.paramMap.get("disbursement_id");
    this.viewDraftedId = this.route.snapshot.paramMap.get("drafted_disbursement_id");
    console.log("id:", this.id);
    console.log("viewDraftedId id:", this.viewDraftedId);
    this.ViewMoreDisbursementFromProject = localStorage.getItem("ViewMoreDisbursementFromProject");
    this.index = localStorage.getItem("Index");

    this.disbursementForm = new FormGroup({

      disbursement_id: new FormControl(''),
      language: new FormControl(''),
      disbursementReference: new FormControl('', [Validators.required]),
      projectTitle: new FormControl('', [Validators.required]),
      fundingDonorTitle: new FormControl('', [Validators.required]),
      names: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      swiftcode: new FormControl(''),
      receivedswiftcode: new FormControl(''),
      receivedBankNIB: new FormControl('', [Validators.maxLength(21)]),
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      exchangeRateUSD: new FormControl({ value: '', disabled: true }),
      exchangeRateMZN: new FormControl({ value: '', disabled: true }),
      exchangeRatesAgreementCurrency: new FormControl({ value: '', disabled: true }),
      disbursementAmountMZN: new FormControl({ value: '', disabled: true }),
      disbursementAmountUSD: new FormControl({ value: '', disabled: true }),
      amountOfdisbursementUSD: new FormControl({ value: '', disabled: true }),
      amountOfdisbursementAgreement: new FormControl({ value: '', disabled: true }),
      saveAsDraftId: new FormControl('')

    });
    if (this.id != null) {
      this.id = this.route.snapshot.paramMap.get("id");
      this.auto_save_as_draft_flag = false;
      this.disbursementCrud.getEditDisbursementById(this.id).subscribe(data => {
        console.log("disbursement data : ", data);
        this.disbursementDataList = data;
        this.disbursementEdit = this.disbursementDataList;
        // alert("data is:"+JSON.stringify(this.disbursementEdit) );
        this.disbursementForm.controls.disbursement_id.patchValue(this.disbursementEdit[0].disbursement_id);
        this.editId = this.disbursementForm.controls['disbursement_id'].value;
        this.disbursementForm.controls.disbursementReference.patchValue(this.disbursementEdit[0].disbursementReference);
        localStorage.setItem("disbRefNM", this.disbursementEdit[0].disbursementReference);
        let idProject = Number.parseInt(this.disbursementEdit[0].idProject);
        this.disbursementForm.controls['projectTitle'].patchValue(idProject);
        this.getFundingOrganizationEdit(idProject);
        this.projectChangeAction();
        this.select_options_for_finding_title_hdn_flag == false;
        this.disbursementForm.controls.fundingDonorTitle.patchValue(+this.disbursementEdit[0].financialAgreementId);
        console.log("fundingDonorTitle data : ", this.disbursementEdit[0].fundingDonorTitle);
        let id = Number.parseInt(this.disbursementEdit[0].id);
        this.disbursementForm.controls['names'].patchValue(id);
        console.log("responsibleOrg data : ", this.disbursementEdit[0].id);
        this.disbursementForm.controls.date.patchValue(this.disbursementEdit[0].date);
        this.getAmountFlag();
        this.getCurFlag();
        this.disbursementForm.controls.swiftcode.patchValue(this.disbursementEdit[0].swiftcode);
        this.validateSwiftCode();
        if (this.disbursementForm.controls['swiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedswiftcode.patchValue(this.disbursementEdit[0].receivedswiftcode);
        this.validateRecvSwiftCode();
        if (this.disbursementForm.controls['receivedswiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedBankNIB.patchValue(this.disbursementEdit[0].receivedBankNIB);
        this.validateBankNib();
        if (this.disbursementForm.controls['receivedBankNIB'].value == null) {
          this.nibChk = false;
        }
        this.disbursementForm.controls.amount.patchValue(this.disbursementEdit[0].amount);
        this.disbursementForm.controls.currency.patchValue(this.disbursementEdit[0].currencyId);
        this.select_options_for_finding_hdn_flag = false;
        this.disbursementForm.controls.exchangeRateUSD.patchValue(this.disbursementEdit[0].exchangeRateUSD);
        this.disbursementForm.controls.exchangeRateMZN.patchValue(this.disbursementEdit[0].exchangeRateMZN);
        this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.disbursementEdit[0].disbursementAmountUSD);
        this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.disbursementEdit[0].disbursementAmountMZN);

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

    if (this.viewByTableId != null) {
      this.disbursementForm.disable();
      this.auto_save_as_draft_flag = false;
      // this.disbursement_id = localStorage.getItem("disbursementId_view");
      this.disbursementCrud.getEditDisbursementById(this.viewByTableId).subscribe(data => {
        console.log("disbursement data : ", data);
        this.disbursementDataList = data;
        this.disbursementEdit = this.disbursementDataList;
        this.disbursementForm.controls.disbursement_id.patchValue(this.disbursementEdit[0].disbursement_id);
        this.disbursementForm.controls.disbursementReference.patchValue(this.disbursementEdit[0].disbursementReference);
        // let idProject= Number.parseInt(this.disbursementEdit[0].idProject);
        // this.disbursementForm.controls['projectTitle'].patchValue(this.projectTitleList.find(x => x.idProject == idProject).idProject);
        let idProject = Number.parseInt(this.disbursementEdit[0].idProject);
        this.getFundingOrganizationEdit(idProject);
        this.disbursementForm.controls['projectTitle'].patchValue(idProject);
        this.projectChangeAction();
        this.select_options_for_finding_title_hdn_flag == false;
        this.disbursementForm.controls.fundingDonorTitle.patchValue(+this.disbursementEdit[0].financialAgreementId);
        let id = Number.parseInt(this.disbursementEdit[0].id);
        this.disbursementForm.controls['names'].patchValue(id);
        this.disbursementForm.controls.date.patchValue(this.disbursementEdit[0].date);
        this.disbursementForm.controls['date'].disable();
        this.pickerDisable_flag = true;
        this.getAmountFlag();
        this.getCurFlag();
        this.disbursementForm.controls.swiftcode.patchValue(this.disbursementEdit[0].swiftcode);
        this.validateSwiftCode();
        if (this.disbursementForm.controls['swiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedswiftcode.patchValue(this.disbursementEdit[0].receivedswiftcode);
        this.validateRecvSwiftCode();
        if (this.disbursementForm.controls['receivedswiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedBankNIB.patchValue(this.disbursementEdit[0].receivedBankNIB);
        this.validateBankNib();
        if (this.disbursementForm.controls['receivedBankNIB'].value == null) {
          this.nibChk = false;
        }
        this.disbursementForm.controls.amount.patchValue(this.disbursementEdit[0].amount);
        this.disbursementForm.controls.currency.patchValue(this.disbursementEdit[0].currencyId);
        this.select_options_for_finding_hdn_flag = false;
        this.disbursementForm.controls.exchangeRateUSD.patchValue(this.disbursementEdit[0].exchangeRateUSD);
        this.disbursementForm.controls.exchangeRateMZN.patchValue(this.disbursementEdit[0].exchangeRateMZN);
        this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.disbursementEdit[0].disbursementAmountUSD);
        this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.disbursementEdit[0].disbursementAmountMZN);



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

    if (this.viewDraftedId != null) {
      this.disbursementForm.disable();
      this.auto_save_as_draft_flag = false;
      // this.disbursement_id = localStorage.getItem("disbursementId_view");
      this.disbursementCrud.getEditDisbursementById(this.viewDraftedId).subscribe(data => {
        console.log("disbursement data : ", data);
        this.disbursementDataList = data;
        this.disbursementEdit = this.disbursementDataList;
        this.disbursementForm.controls.disbursement_id.patchValue(this.disbursementEdit[0].disbursement_id);
        this.disbursementForm.controls.disbursementReference.patchValue(this.disbursementEdit[0].disbursementReference);
        // let idProject= Number.parseInt(this.disbursementEdit[0].idProject);
        // this.disbursementForm.controls['projectTitle'].patchValue(this.projectTitleList.find(x => x.idProject == idProject).idProject);
        let idProject = Number.parseInt(this.disbursementEdit[0].idProject);
        this.disbursementForm.controls['projectTitle'].patchValue(idProject);
        this.projectChangeAction();
        this.select_options_for_finding_title_hdn_flag == false;
        this.disbursementForm.controls.fundingDonorTitle.patchValue(+this.disbursementEdit[0].financialAgreementId);
        let id = Number.parseInt(this.disbursementEdit[0].id);
        this.disbursementForm.controls['names'].patchValue(id);
        this.disbursementForm.controls.date.patchValue(this.disbursementEdit[0].date);
        this.disbursementForm.controls['date'].disable();
        this.pickerDisable_flag = true;
        this.getAmountFlag();
        this.getCurFlag();
        this.disbursementForm.controls.swiftcode.patchValue(this.disbursementEdit[0].swiftcode);
        this.validateSwiftCode();
        if (this.disbursementForm.controls['swiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedswiftcode.patchValue(this.disbursementEdit[0].receivedswiftcode);
        this.validateRecvSwiftCode();
        if (this.disbursementForm.controls['receivedswiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedBankNIB.patchValue(this.disbursementEdit[0].receivedBankNIB);
        this.validateBankNib();
        if (this.disbursementForm.controls['receivedBankNIB'].value == null) {
          this.nibChk = false;
        }
        this.disbursementForm.controls.amount.patchValue(this.disbursementEdit[0].amount);
        this.disbursementForm.controls.currency.patchValue(this.disbursementEdit[0].currencyId);
        this.select_options_for_finding_hdn_flag = false;
        this.disbursementForm.controls.exchangeRateUSD.patchValue(this.disbursementEdit[0].exchangeRateUSD);
        this.disbursementForm.controls.exchangeRateMZN.patchValue(this.disbursementEdit[0].exchangeRateMZN);
        this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.disbursementEdit[0].disbursementAmountUSD);
        this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.disbursementEdit[0].disbursementAmountMZN);



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


    this.filteredOptions = this.disbursementForm.controls.names.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.projectListOptions = this.disbursementForm.controls.projectTitle.valueChanges
      .pipe(
        startWith(''),
        map(value => this._listFilter(value))
      );

    this.filteredOptionsC = this.disbursementForm.controls['currency'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );

  }
  ngOnDestroy() {
    if (this.auto_save_as_draft_flag == true) {
      this.autoSaveAsDraft();
    }
    document.removeEventListener('keydown', this.fn);
  }
  onBlur(value) {
    this.disbursementForm.controls['amount'].setValue(this.currencyPipe.transform(value, " "));

  }
  /* This Method is used to prevent Duplicate entries of Disbursement Reference  */
  validateDuplicateRef() {
    this.getValueByLang();
    let reference:string=this.disbursementForm.controls['disbursementReference'].value;
    let fundingId:any=this.disbursementForm.controls['fundingDonorTitle'].value;
    if((reference!=null && reference!='' && reference!=undefined) && (fundingId!=null && fundingId!=undefined && fundingId!='')){
      this.disbursementCrud.getDuplicateReference(reference,fundingId).subscribe(data=>{
        var val = JSON.parse(JSON.stringify(data));
        if(val.isDuplicateReference==true){
          Swal.fire({
            title: (this.browserLang=='en')?'This Disbursement Reference already exists.':'Esta Referência do Desembolso já existe.',
            confirmButtonText: `OK`,
          });
          this.disbursementForm.controls['disbursementReference'].reset();
          this.disbursementForm.controls['fundingDonorTitle'].reset();
        }
      });
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);
    localStorage.setItem("dataKey", "Donor");
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
      console.log(`Dialog result: ${result}`);
    });
  }

  getCurrency(): void {
    this.getValueByLang()
    this.bomozam.amount = this.disbursementForm.controls.amount.value;
    this.bomozam.currency = this.disbursementForm.controls.currency.value;
    console.log("currency is->>" + this.disbursementForm.controls.currency.value);
    this.bomozam.date = this.disbursementForm.controls.date.value;
    console.log("date is->>", this.disbursementForm.controls.date.value);
    console.log("currency is->>", this.bomozam.currency);
    console.log("amount is->>", this.bomozam.amount);
    if ((this.bomozam.amount != null && this.bomozam.amount != 0 && this.bomozam.amount != undefined) &&
      (this.bomozam.currency != null && this.bomozam.currency != "" && this.bomozam.currency != undefined)) {
      this.bankService.getCurrencyJson(JSON.stringify(this.bomozam)).subscribe(data => {
        console.log("error message:" + data.response);
        if (data.response === "Currency found") {
          this.disbursementForm.controls.exchangeRateUSD.patchValue(this.currencyPipe.transform(data.exchange_rate_usd, " "));
          this.disbursementForm.controls.exchangeRateMZN.patchValue(this.currencyPipe.transform(data.exchange_rate_mzn, " "));
          this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.currencyPipe.transform(data.amount_in_mzn, " "));
          this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.currencyPipe.transform(data.amount_in_usd, " "));
          this.select_options_for_finding_hdn_flag = false;
        }
        if (data.response === "Currency found unit") {
          // alert("in Yen");
          console.log("data.exchange_rate_usd:" + data.exchange_rate_usd);
          // this.disbursementForm.controls.exchangeRateUSD.patchValue(this.decimalPipe.transform(this.number, this.format));//data.exchange_rate_usd);
          // this.disbursementForm.controls.exchangeRateMZN.patchValue(this.currencyPipe.transform(data.exchange_rate_mzn, " "));
          // this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.currencyPipe.transform(data.amount_in_mzn, " "));
          // this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.currencyPipe.transform(data.amount_in_usd, " "));
          this.disbursementForm.controls.exchangeRateUSD.patchValue(this.decimalPipe.transform(data.exchange_rate_usd, this.format));
          this.disbursementForm.controls.exchangeRateMZN.patchValue(this.decimalPipe.transform(data.exchange_rate_mzn, this.format));
          this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.decimalPipe.transform(data.amount_in_mzn, this.format));
          this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.decimalPipe.transform(data.amount_in_usd, this.format));
          this.select_options_for_finding_hdn_flag = false;
        }


        if (data.response === "Currency not found") {
          this.select_options_for_finding_hdn_flag = true;
          Swal.fire({
            title: (this.browserLang == 'en') ? 'Bank of Mozambique server is down. Please try again later' : 'O servidor do Banco de Moçambique está indisponível. Por favor, tente novamente mais tarde.',
            confirmButtonText: `OK`,

          })
        } if (data.response === "Currency not found") {
          this.select_options_for_finding_hdn_flag = true;
          Swal.fire({
            title: (this.browserLang == 'en') ? 'Currency not found.' : 'Moeda não encontrada.',
            confirmButtonText: `OK`,
          })
        }

        if (data.response === "Server Down") {
          Swal.fire({
            title: (this.browserLang == 'en') ? 'Bank of Mozambique server is down. Please try again later.' : 'O servidor do Banco de Moçambique está indisponível. Por favor, tente novamente mais tarde.',
            confirmButtonText: `OK`,
          })
        }


      });
    }

    // setTimeout(()=>this.select_options_for_finding_hdn_flag=false, 5000);
  }

  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }

  //for notification alert execute on save disbursement
  saveDisbursementNotificationAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Disbursement Reference ID "'
      + this.disbursementForm.controls['disbursementReference'].value
      + '" created on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Disbursement Reference ID "'
      + this.disbursementForm.controls['disbursementReference'].value
      + '" for Project "'
      + this.findProjectNameById(this.disbursementForm.controls['projectTitle'].value)
      + '" has been created by user "' + this.userNameForNotificationAlert
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-disbursement\\';

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';


    notificationDetails.notificationGroup = this.usergroup;
    notificationDetails.updatedBy = this.userNameForNotificationAlert;
    notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has created disbursement on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.moveToViewTab();
    });
  }

  //for notification alert execute on edit disbursement
  editDisbursementNotificationAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Disbursement Reference ID "'
      + this.disbursementForm.controls['disbursementReference'].value
      + '" edited on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Disbursement Reference ID "'
      + this.disbursementForm.controls['disbursementReference'].value
      + '" for Project "'
      + this.findProjectNameById(this.disbursementForm.controls['projectTitle'].value)
      + '" has been edited by user "' + this.userNameForNotificationAlert
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-disbursement\\' + this.id;

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';


    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has create disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    //   Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    //   this.moveToViewTab();
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToViewTab();
  }

  //for notification alert
  private findProjectNameById(id: number): string {
    let projectName: string = null;
    for (let i = 0; i < this.projectTitleList.length; i++) {
      if (this.projectTitleList[i].idProject == id) {
        projectName = this.projectTitleList[i].projectTitle;
      }
    }
    return projectName;
  }

  saveDisbursementFinancingSituationNotificationAlert() {
    let notifiList: Notification = new Notification();
    this.notificationService.checkDisbursementFinancingSituation(this.disbursementForm.controls['fundingDonorTitle'].value).subscribe(data => {
      notifiList = data;
      if (notifiList.notificationMsg == null) {
        this.saveDisbursement();
      }
      else {
        Swal.fire(notifiList.notificationMsg, '', 'error');
      }
    });
  }
  checkLength1(e, input) {

    const keyValue = +e.key;
    const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
    let current: string = input.value;
    const position = e.target.selectionStart;
    const next: string = [current.slice(0, position), e.key == 'Decimal' ? '.' : e.key, current.slice(position)].join('');
    // if (next && !String(next).match(this.regex)) {

    //  e.preventDefault();
    // }
    if (+newValue > 21) {

      e.preventDefault();
    }

  }

  viewMoreDisbursement() {
    let disbursement_id: any = this.disbursementForm.controls.disbursement_id.value;
    // localStorage.setItem("disbursement_id", disbursement_id);
    // localStorage.setItem("EditDisbursement", "EditDisbursement");

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-disbursement', disbursement_id]));
  }

  swiftChk = false;
  nibChk = false;
  validateSwiftCode() {
    var swiftcode = this.disbursementForm.controls['swiftcode'].value;

    if (swiftcode == '') {
      this.check_swift_flag = true;
      this.swiftMessage = ' '
      this.swiftChk = true;
    } else {
      var expr = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      if (!expr.test(swiftcode)) {
        //console.log( "Invalid swiftcode address.");
        this.check_swift_flag = false;//for invalid swiftcode
        this.check_swift1_flag = true;//for valid

      }
      else {
        // console.log( "valid.");
        this.check_swift_flag = true;//for invalid swiftcode
        this.check_swift1_flag = false;//for valid
        this.swiftMessage = 'blank'
        this.swiftChk = false;
      }
    }
    if (swiftcode == null || swiftcode == '') {
      this.swiftMessage = 'blank'
      this.check_swift_flag = true;
      this.check_swift1_flag = true;

      this.swiftChk = true;
    }
  }

  validateRecvSwiftCode() {
    var receivedswiftcode = this.disbursementForm.controls['receivedswiftcode'].value;

    if (receivedswiftcode == '') {
      this.check_swiftrecv_flag = true;
      this.swiftMessage = ' '
      this.swiftChk = true;
    } else {
      var expr = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      if (!expr.test(receivedswiftcode)) {

        this.check_swiftrecv_flag = false;//for invalid receivedswiftcode
        this.check_swiftrecv1_flag = true;//for valid

      }
      else {
        // console.log( "valid.");
        this.check_swiftrecv_flag = true;//for invalid receivedswiftcode
        this.check_swiftrecv1_flag = false;//for valid
        this.swiftMessage = 'blank'
        this.swiftChk = false;
      }
    }
    if (receivedswiftcode == null || receivedswiftcode == '') {
      this.swiftMessage = 'blank'
      this.check_swiftrecv_flag = true;
      this.check_swiftrecv1_flag = true;

      this.swiftChk = true;
    }

  }

  clearDisbDate(event) {
    event.stopPropagation();
    this.disbursementForm.controls['date'].reset();
  }

  validateBankNib() {
    var receivedBankNIB = this.disbursementForm.controls['receivedBankNIB'].value;
    // var expr=/^-?(0|[1-9]\d*)?$/;


    if (receivedBankNIB == '') {
      this.check_Nib_flag = true;
      this.swiftMessage = ' ';
      this.nibChk = true;
    } else {
      var expr = /^[0-9]{21,21}$/;
      if (expr.test(receivedBankNIB)) {

        this.check_Nib_flag = false;//for invalid receivedBankNIB
        this.check_Nib1_flag = true;//for valid

      }
      else {
        // console.log( "valid.");
        this.check_Nib_flag = true;//for invalid receivedBankNIB
        this.check_Nib1_flag = false;//for valid
        this.swiftMessage = 'blank';
        this.nibChk = false;
      }
    }
    if (receivedBankNIB == null) {
      this.swiftMessage = 'blank';
      this.check_Nib1_flag = true;
      this.nibChk = true;
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
  private _listFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.projectNameLists.filter(option => option.toLowerCase().includes(filterValue));
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.disbursementForm.controls[controlName].hasError(errorName);
  }

  public createDisbursement = (disbursementFormValue) => {
    this.auto_save_as_draft_flag = true;
    console.log(disbursementFormValue)
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
      currency: disbursementFormValue.currency,
      swiftcode: disbursementFormValue.swiftcode,
      amountOfdisbursementUSD: disbursementFormValue.amountOfdisbursementUSD,
      receivedswiftcode: disbursementFormValue.receivedswiftcode,
      receivedBankNIB: disbursementFormValue.receivedBankNIB,
      position: disbursementFormValue.position,
      exchangeRateMZN: disbursementFormValue.exchangeRateMZN
    }
  }


  moveToSelectedTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/disbursement']));
  }
  moveToDisbursementTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-disbursement']));
  }
  openMandatoryAlert() {
    this.getValueByLang()
    if (this.check_swift_flag == false || this.check_swiftrecv_flag == false) {
      if (this.browserLang == 'en')
        Swal.fire('Invalid Bank NIB format. Please enter valid format.')
      else
        Swal.fire('Formato do NIB do Banco inválido. Por favor, introduza num formato válido.')
    }
    else if (this.check_Nib1_flag == false) {
      if (this.browserLang == 'en')
        Swal.fire('Invalid Bank NIB format. Please enter valid format.')
      else
        Swal.fire('Formato do NIB do Banco inválido. Por favor, introduza num formato válido.')
    }
    else if (this.disbursementForm.invalid) {
      if (this.browserLang == 'en')
        Swal.fire('Please fill all mandatory fields.')
      else
        Swal.fire('Por favor preencha todos os campos obrigatórios.')
    }
    if (this.id == null) {
      if (this.duplicate_flag == false) {
        if (this.browserLang == 'en')
          Swal.fire('This Disbursement Reference already exists.')
        else
          Swal.fire('Esta Referência do Desembolso já existe.')
      }
    } else {
      this.duplicate_flag == true;
    }

  }

  saveDisbursement() {
    this.getValueByLang()
    this.disbursementForm.controls.language.setValue(this.browserLang);
    let notifiList: Notification = new Notification();
    let fundingId: number = this.disbursementForm.controls['fundingDonorTitle'].value;
    let currDisbAmt: string = this.disbursementForm.controls['disbursementAmountMZN'].value;
    this.notificationService.findRestFundingAmountAfterDisbursed(fundingId, currDisbAmt).subscribe(data => {
      notifiList = data;
      if (notifiList.notificationMsg == null) {
        console.log("all disbursment value that go to backend is ", this.disbursementForm.getRawValue());
        this.disbursementCrud.saveDisbursement(this.disbursementForm.getRawValue()).subscribe(data => {
          console.log(data);
          this.auto_save_as_draft_flag = false;
          this.saveDisbursementNotificationAlert();
          if (this.browserLang == 'en')
            Swal.fire('Submitted successfully', '', 'success');
          else
            Swal.fire('Submetido com sucesso', '', 'success');
          // console.log("aasuchi ts file  ku");
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
      else {
        Swal.fire(notifiList.notificationMsg, '', 'error');
      }
    });
  }

  updateDisbursement() {
    this.getValueByLang()
    this.disbursementForm.controls.language.setValue(this.browserLang);
    let notifiList: Notification = new Notification();
    let fundingId: number = this.disbursementForm.controls['fundingDonorTitle'].value;
    let currDisbAmt: string = this.disbursementForm.controls['disbursementAmountMZN'].value;
    this.notificationService.findRestFundingAmountAfterDisbursed(fundingId, currDisbAmt).subscribe(data => {
      notifiList = data;
      if (notifiList.notificationMsg == null) {
        console.log(this.disbursementForm.value);
        this.disbursementCrud.editDisbursement(this.disbursementForm.getRawValue()).subscribe(data => {
          console.log("Updated Data is:", data);
          this.auto_save_as_draft_flag = false;
          if (this.browserLang == 'en') {
            Swal.fire('Updated successfully', '', 'success');
          } else {
            Swal.fire('Actualizado com sucesso', '', 'success');
          }
          this.editDisbursementNotificationAlert();
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
      else {
        Swal.fire(notifiList.notificationMsg, '', 'error');
      }
    });
  }

  moveToViewTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-disbursement']));
  }


  saveDisbursementDraft() {
    console.log(this.disbursementForm.value)
    this.getValueByLang()
    if (this.disbursementForm.controls['saveAsDraftId'].value != null) {
      console.log("this.disbursementForm.controls['saveAsDraftId'].value:" + this.disbursementForm.controls['saveAsDraftId'].value);
      this.disbursementForm.controls['disbursement_id'].patchValue(this.disbursementForm.controls['saveAsDraftId'].value);
    }
    this.disbursementCrud.saveDisbursementDraft(this.disbursementForm.getRawValue()).subscribe(data => {
      console.log("Draft data is:", data);
      // console.log("aasuchi ts file  ku",);
      this.auto_save_as_draft_flag = false;
      if (this.browserLang = 'en')
        Swal.fire('Submitted successfully', '', 'success');
      else
        Swal.fire('Submetido com sucesso', '', 'success');
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

  autoSaveDisbursementDraft() {
    console.log(this.disbursementForm.value)
    this.getValueByLang()
    if (this.disbursementForm.controls['saveAsDraftId'].value != null) {
      console.log("this.disbursementForm.controls['saveAsDraftId'].value:" + this.disbursementForm.controls['saveAsDraftId'].value);
      this.disbursementForm.controls['disbursement_id'].patchValue(this.disbursementForm.controls['saveAsDraftId'].value);
    }
    this.disbursementCrud.saveDisbursementDraft(this.disbursementForm.getRawValue()).subscribe(data => {
      console.log("Draft data is:", data);
      // console.log("aasuchi ts file  ku",);
      this.auto_save_as_draft_flag = false;
      if (this.browserLang == 'en')
        Swal.fire('Disbursement data saved as Draft successfully', '', 'success');
      else
        Swal.fire('Dados do Desembolso salvos como Rascunho com sucesso', '', 'success');
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

  opensweetalert() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Submit?' : 'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Submit` : 'Submeter',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("in confirm", this.disbursementDraftId);
        this.saveDisbursementFinancingSituationNotificationAlert();
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  openSweetalertUpdate() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Update?' : 'Deseja Actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Update` : 'Actualizar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // console.log("in update alert ");
        this.disbursementForm.controls.disbursement_id.patchValue(this.editId);
        this.updateDisbursement();
        // this.moveToSelectedTab;
        //this.moveToViewTab();
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  opensweetalert2() {
    this.getValueByLang()
    if ((this.disbursementForm.controls['projectTitle'].value) == null) {
      this.disbursementForm.controls['projectTitle'].setValue('');
    }
    if ((this.disbursementForm.controls['fundingDonorTitle'].value) == null) {
      this.disbursementForm.controls['fundingDonorTitle'].setValue('');
    }
    if ((this.disbursementForm.controls['names'].value) == null) {
      this.disbursementForm.controls['names'].setValue('');
    }
    if ((this.disbursementForm.controls['amount'].value) == null) {
      this.disbursementForm.controls['amount'].setValue('');
    }
    if ((this.disbursementForm.controls['currency'].value) == null) {
      this.disbursementForm.controls['currency'].setValue('');
    }
    if ((this.disbursementForm.controls['exchangeRateUSD'].value) == null) {
      this.disbursementForm.controls['exchangeRateUSD'].setValue('');
    }
    if ((this.disbursementForm.controls['exchangeRateMZN'].value) == null) {
      this.disbursementForm.controls['exchangeRateMZN'].setValue('');
    }
    if ((this.disbursementForm.controls['disbursementAmountUSD'].value) == null) {
      this.disbursementForm.controls['disbursementAmountUSD'].setValue('');
    }
    if ((this.disbursementForm.controls['disbursementAmountMZN'].value) == null) {
      this.disbursementForm.controls['disbursementAmountMZN'].setValue('');
    }

    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to save as Draft?' : 'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Save` : 'Salve',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.disbursementdata.disbursement_id = this.disbursementDraftId;
        this.disbursementDraftId = "";
        this.saveDisbursementDraft();
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  autoSaveAsDraft() {
    if ((this.disbursementForm.controls['projectTitle'].value) == null) {
      this.disbursementForm.controls['projectTitle'].setValue('');
    }
    if ((this.disbursementForm.controls['fundingDonorTitle'].value) == null) {
      this.disbursementForm.controls['fundingDonorTitle'].setValue('');
    }
    if ((this.disbursementForm.controls['names'].value) == null) {
      this.disbursementForm.controls['names'].setValue('');
    }
    if ((this.disbursementForm.controls['amount'].value) == null) {
      this.disbursementForm.controls['amount'].setValue('');
    }
    if ((this.disbursementForm.controls['currency'].value) == null) {
      this.disbursementForm.controls['currency'].setValue('');
    }
    if ((this.disbursementForm.controls['exchangeRateUSD'].value) == null) {
      this.disbursementForm.controls['exchangeRateUSD'].setValue('');
    }
    if ((this.disbursementForm.controls['exchangeRateMZN'].value) == null) {
      this.disbursementForm.controls['exchangeRateMZN'].setValue('');
    }
    if ((this.disbursementForm.controls['disbursementAmountUSD'].value) == null) {
      this.disbursementForm.controls['disbursementAmountUSD'].setValue('');
    }
    if ((this.disbursementForm.controls['disbursementAmountMZN'].value) == null) {
      this.disbursementForm.controls['disbursementAmountMZN'].setValue('');
    }
    this.disbursementdata.disbursement_id = this.disbursementDraftId;
    this.disbursementDraftId = "";
    this.autoSaveDisbursementDraft();
  }

  projectTitle;
  // fundingDonorTitle;
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
        'Funding For Beira Express Way current', 'Funding For Beira Express Way Feb', 'Funding For Beira Express Way Jan', 'Funding For Beira Express Way',
      ]
    },
    {
      'projectName': 'Maputo Smart City',
      fundingTitleList: [
        '	Funding For Maputo Smart City Jan', '	Funding For Maputo Smart City Feb', '	Funding For Maputo Smart City Dec', 'Funding For Port of Pemba', 'Funding For Maputo Smart City',
      ]
    },
    {
      'projectName': 'Bilene International Airport',
      fundingTitleList: [
        'Funding For Bilene International Airport',
      ]
    },
    {
      'projectName': 'Pemba Memorial Highway',
      fundingTitleList: [
        'Funding For Pemba Memorial Highway',
      ]
    }
  ];

  getAmountFlag() {
    this.date_flag = false;
  }
  getCurFlag() {
    this.cur_flag = false;
  }
  resetAmount() {
    this.disbursementForm.controls['amount'].reset();
    this.disbursementForm.controls['currency'].reset();
    this.select_options_for_finding_hdn_flag = true;
    this.disbursementForm.controls['exchangeRateUSD'].reset();
    this.disbursementForm.controls['exchangeRateMZN'].reset();
    this.disbursementForm.controls['disbursementAmountUSD'].reset();
    this.disbursementForm.controls['disbursementAmountMZN'].reset();
  }

  projectChangeAction() {

    let projectTitle = this.disbursementForm.controls.projectTitle.value;

    if (projectTitle != '' && projectTitle != null) {
      this.select_options_for_finding_title_hdn_flag = false;
      this.getFundingTitle();
    } else {
      this.select_options_for_finding_title_hdn_flag = true;
    }
    let dropDownData = this.projectList.find((data: any) => data.projectName === projectTitle);
    if (dropDownData) {
      this.fundingTitleListData = dropDownData.fundingTitleListData;
      console.log(this.fundingTitleListData);
    } else {
      this.fundingTitleListData = [];
    }
    // if(this.EditDisbursement == "EditDisbursement") {
    //   this.disbursementForm.controls.fundingDonorTitle.patchValue(disbursementdata.fundingDonorTitle);
    // }
  }

  projectActionForView(projectTitle: any) {

    let dropDownData = this.projectList.find((data: any) => data.projectName === projectTitle);
    if (dropDownData) {
      this.fundingTitleList = dropDownData.fundingTitleList;
      console.log(this.fundingTitleList);
    } else {
      this.fundingTitleList = [];
    }

    // if(this.ViewMoreDisbursement == "ViewMoreDisbursement"){
    //   this.disbursementForm.controls.fundingDonorTitle.patchValue(disbursementdata.fundingDonorTitle);
    // }
    // else if(this.ViewMoreDisbursementFromProject == "ViewMoreDisbursementFromProject"){
    //   this.disbursementForm.controls.fundingDonorTitle.patchValue(disbursementdata.fundingDonorTitle);
    // }
  }
  findOrganization() {
    // let fundingDonorTitle = this.disbursementForm.controls['fundingDonorTitle'].value;
    // let projectTitle = this.disbursementForm.controls['projectTitle'].value;
    // if (projectTitle == '1' && fundingDonorTitle == '1') {
    //   console.log("in 1st if --->", this.fundingOrganizationList.values[1]);
    //   this.disbursementForm.controls.names.patchValue(this.fundingOrganizationList.values[1]);
    // } else if (projectTitle == '2' && fundingDonorTitle == '2') {
    //   console.log("in 1st if --->", this.fundingOrganizationList.values[2]);
    //   this.disbursementForm.controls.names.patchValue(this.fundingOrganizationList[2]);
    // } else {
    //   console.log("in 1st if --->", this.fundingOrganizationList.values[3]);
    //   this.disbursementForm.controls.names.patchValue(this.fundingOrganizationList.values[3]);
    // }
    this.getFundingOrganization();
  }
  clearForm(form: FormGroup) {
    this.select_options_for_finding_title_hdn_flag = true;
    this.select_options_for_finding_hdn_flag = true;
    this.cur_flag = true;
    this.date_flag = true;

    this.check_swift_flag = true;
    this.check_swift1_flag = true;
    this.swiftMessage = 'blank';

    this.check_swiftrecv_flag = true;
    this.check_swiftrecv1_flag = true;
    this.swiftMessage = 'blank';

    this.check_Nib1_flag = true;
    this.check_Nib_flag = true
    this.swiftMessage = 'blank';
    form.reset();
  }
  moveToSelectedTabEdit(tabName: string) {
    localStorage.setItem("EditDisbursement", "EditDisbursement");

    console.log("editenv inside view--->", localStorage.getItem("EditDisbursement"));


    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-disbursement']));

    console.log("after route");

  }

  projectTitleList: DisbursementClass[];
  projectTitlefilteredOption: Observable<any[]>;
  private getProjectTitleDetails() {
    if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
      this.disbursementService.getProjectTitleDetailsByUserAccessId(this.userId).subscribe(data => {
        this.projectTitleList = data;
        console.log("projectTitleList is by user access:", this.projectTitleList);
        console.log("projectTitleListData is user access:", data);
        this.projectTitlefilteredOption = this.searchProjectTitle.valueChanges
          .pipe(
            startWith(''),
            map(projectTitleDAta => projectTitleDAta ? this.filterProjectTitle(projectTitleDAta) : this.projectTitleList.slice())
          );
      });
    }
    else {
      this.disbursementService.getProjectTitleList().subscribe(data => {
        this.projectTitleList = data;
        console.log("projectTitleList is:", this.projectTitleList);
        console.log("projectTitleListData is:", data);
        this.projectTitlefilteredOption = this.searchProjectTitle.valueChanges
          .pipe(
            startWith(''),
            map(projectTitleDAta => projectTitleDAta ? this.filterProjectTitle(projectTitleDAta) : this.projectTitleList.slice())
          );
      });
    }
  }
  private filterProjectTitle(name: string) {
    return this.projectTitleList.filter(projectTitleDAta =>
      projectTitleDAta.projectTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);

  }
  fundingTitleListData: DisbursementClass[];
  private getFundingTitle() {
    var projectId = this.disbursementForm.controls['projectTitle'].value;
    // var projectTitleNameEN = this.disbursementForm.controls['projectTitle'].value;
    // this.disbursementService.getFundingTitleList().subscribe(data => {
    this.disbursementService.getFundingTitleListByPrjId(projectId).subscribe(data => {
      this.fundingTitleListData = data;
      console.log("Data is:", this.fundingTitleListData)
    });
  }
  fundingOrganizationList: FundingOrganization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  private getFundingOrganization() {
    var projectId = this.disbursementForm.controls['projectTitle'].value;
    this.disbursementService.fundingOrganizationByProjectIdURL(projectId).subscribe(data => {
      this.fundingOrganizationList = data;
      this.fundingOrganizationfilteredOption = this.searchFundingOrganization.valueChanges
        .pipe(
          startWith(''),
          map(names => names ? this.filterfundingOrganization(names) : this.fundingOrganizationList.slice())
        );
    });
  }

  getFundingOrganizationEdit(projectId:any) {
    
    this.disbursementService.fundingOrganizationByProjectIdURL(projectId).subscribe(data => {
      this.fundingOrganizationList = data;
      this.fundingOrganizationfilteredOption = this.searchFundingOrganization.valueChanges
        .pipe(
          startWith(''),
          map(names => names ? this.filterfundingOrganization(names) : this.fundingOrganizationList.slice())
        );
    });
  }

  private filterfundingOrganization(name: string) {
    return this.fundingOrganizationList.filter(names =>
      names.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(name.toLowerCase()) !== -1 || names.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  listOfCurrency: Currency[];
  currencyfilteredOption: Observable<any[]>;
  today: any;
  private getCurrencyDetails() {
    this.currencyService.getCurrencyDetails().subscribe(data => {
      this.listOfCurrency = data;
      for (let i = 0; i < this.listOfCurrency.length; i++) {
        let crtDt = this.listOfCurrency[i].createdOn;
        let updateDt = this.listOfCurrency[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.listOfCurrency[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.listOfCurrency[i].updateDifference = days_differenceForUpdate;
        }
        (this.listOfCurrency[i].difference) = days_difference;
      }
      this.currencyfilteredOption = this.searchCurrency.valueChanges
        .pipe(
          startWith(''),
          map(currencyDAta => currencyDAta ? this.filterCurrency(currencyDAta) : this.listOfCurrency.slice())
        );
    });
  }
  private filterCurrency(name: string) {

    return this.listOfCurrency.filter(currencyData =>
      currencyData.currency_fullname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(name.toLowerCase()) !== -1 || currencyData.currency_shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  displayProject(id) {
    if (!id) return '';
    return this.projectTitleList.find(x => x.projectTitleId == id).projectTitleNameEn;
  }
  displayfundTitle(id) {
    if (!id) return '';
    return this.fundingTitleListData.find(x => x.fundingTitelId == id).fundingTitelNameEn;
  }
  displayfund(id) {
    if (!id) return '';
    return this.fundingOrganizationList.find(x => x.fundingOrganizationId == id).fundingOrganizationName;
  }
  searchProjectTitle = new FormControl();
  searchFundingOrganization = new FormControl();
  searchCurrency = new FormControl();

  /* Here we call service to get all save as draft values that will be present in db */
  chkDraft() {
    this.getValueByLang()
    this.disbursementCrud.getDisbursementDraftViewList().subscribe(data => {
      /* Below condition is for to check data present or not in db */
      if (data.length == 0) {
        if (this.browserLang == 'en')
          Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
        else
          Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error')
      } else {
        this.saveAsDraftList = data;
      }
    });
  }

  minDate:any;
  dibursementDatechange() {
    console.log("dibursementDatechange");
    let localStartDate:any=this.disbursementForm.controls['date'].value;
    let fundingId:number=this.disbursementForm.controls['fundingDonorTitle'].value;
    localStartDate = new Date(localStartDate);
    // if(localStartDate!=null && localStartDate!=undefined && localStartDate !=''){
      if(fundingId!=null && fundingId!=undefined && this.fundingTitleListData!=null){
        for(let i=0; i<this.fundingTitleListData.length;i++){
          if(this.fundingTitleListData[i].financialAgreementId == fundingId){
            if(this.fundingTitleListData[i].dateOfSignature != null && this.fundingTitleListData[i].dateOfSignature != undefined){
              this.minDate=new Date(this.fundingTitleListData[i].dateOfSignature);
              // if(localStartDate.getTime()<new Date(this.fundingTitleListData[i].dateOfSignature).getTime()){
              //   // Swal.fire('Disbursement date must not be earlier than financial agreement date of signature.','','error');
              //   this.disbursementForm.controls['date'].reset();
              // }
            }
          }
        }
      }
      
      console.log("dibursementDatechange",this.minDate);

    // }
  }

  draftValue() {

    console.log("Inside Draft");
    this.auto_save_as_draft_flag = false;
    let disbursement_id = this.disbursementForm.controls['saveAsDraftId'].value;
    console.log("draft Id:", this.disbursement_id);
    this.disbursementCrud.patchDisbursemntDraftValue(disbursement_id).subscribe(data => {
      this.draftData = data;
      console.log("draftdata Patch:", this.draftData);
      for (let i = 0; i < this.draftData.length; i++) {
        // alert("Data is:"+JSON.stringify(this.draftData[0]));
        this.disbursementDraftId = this.draftData[0].disbursement_id;
        console.log("draft Id2:", this.disbursementDraftId);
        this.disbursementForm.controls.disbursement_id.patchValue(this.draftData[0].disbursement_id);
        this.disbursementForm.controls.disbursementReference.patchValue(this.draftData[0].disbursementReference);
        if (this.draftData[0].projectTitle == null) {
          this.disbursementForm.controls.projectTitle.patchValue('');
        } else {
          this.disbursementForm.controls.projectTitle.patchValue(this.draftData[0].projectTitle.idProject);
        }

        this.projectChangeAction();
        if (this.draftData[0].fundingDonorTitle == null) {
          this.disbursementForm.controls.fundingDonorTitle.patchValue('');
        } else {
          this.disbursementForm.controls.fundingDonorTitle.patchValue(this.draftData[0].fundingDonorTitle.financialAgreementId);
        }

        this.findOrganization();
        if (this.draftData[0].names == null) {
          this.disbursementForm.controls.names.patchValue('');
        } else {
          this.disbursementForm.controls.names.patchValue(this.draftData[0].names.id);
        }

        this.disbursementForm.controls.date.patchValue(this.draftData[0].date);
        this.getAmountFlag();
        this.getCurFlag();
        this.disbursementForm.controls.swiftcode.patchValue(this.draftData[0].swiftcode);
        this.validateSwiftCode();
        if (this.disbursementForm.controls['swiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedswiftcode.patchValue(this.draftData[0].receivedswiftcode);
        this.validateRecvSwiftCode();
        if (this.disbursementForm.controls['receivedswiftcode'].value == null) {
          this.swiftChk = false;
        }
        this.disbursementForm.controls.receivedBankNIB.patchValue(this.draftData[0].receivedBankNIB);
        this.validateBankNib();
        if (this.disbursementForm.controls['receivedBankNIB'].value == null) {
          this.nibChk = false;
        }

        this.disbursementForm.controls.amount.patchValue(this.draftData[0].amount);
        if (this.draftData[0].currency == null) {
          this.disbursementForm.controls.currency.patchValue('');
        } else {
          this.disbursementForm.controls.currency.patchValue(this.draftData[0].currency.currency_id);
        }

        this.select_options_for_finding_hdn_flag = false;
        this.disbursementForm.controls.exchangeRateUSD.patchValue(this.draftData[0].exchangeRateUSD);
        this.disbursementForm.controls.exchangeRateMZN.patchValue(this.draftData[0].exchangeRateMZN);
        this.disbursementForm.controls.disbursementAmountUSD.patchValue(this.draftData[0].disbursementAmountUSD);
        this.disbursementForm.controls.disbursementAmountMZN.patchValue(this.draftData[0].disbursementAmountMZN);



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
  getDraftValue() {
    this.disbursementCrud.getDisbursementDraftViewList().subscribe(data => {
      /* Below condition is for to check data present or not in db */
      this.saveAsDraftList = data;
      for(let k=0;k<this.saveAsDraftList.length;k++){
        if(this.saveAsDraftList[k].disbursementReference==null){
          this.saveAsDraftList[k].disbursementReference=""
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
      data.disbursementReference.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  publish() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to Publish?':'Deseja Publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Publish`:'Publicar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id: number[] = [this.viewDraftedId];
        if (id.length > 0) {
          this.getValueByLang()
          this.disbursementCrud.publishById(id).subscribe(data => {
            (this.browserLang=='en')?Swal.fire('Published successfully.', '', 'success'):Swal.fire('Publicado com sucesso.', '', 'success')
            .then((result) => {
              if (result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-disbursement']);
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
      title:(this.browserLang=='en')? 'Do you want to Discard?':'Deseja Descartar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Discard`:'Descartar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id: number[] = [this.viewDraftedId];
        if (id.length > 0) {
          this.disbursementCrud.discardById(id).subscribe(data => {
            (this.browserLang=='en')? Swal.fire('Discarded successfully.', '', 'success'):Swal.fire('Descartado com sucesso', '', 'success').then((result) => {
              if (result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-disbursement']);
            });
          },
            error => console.log(error));
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/view-drafted-disbursement']);
  }

  editAmount(value) {
    this.disbursementForm.controls.amount.setValue(
      value.replace(/[^0-9.]+/g, '')
    );
  }
  viewAmount(value) {
    this.disbursementForm.controls.amount.setValue(
      this.currencyPipe.transform(value, ' ')
    );
  }
  preventE(event) {
    if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57) {
      event.preventDefault();
      // 0 for null values
      // 8 for backspace 
      // 48-57 for 0-9 numbers
    }
  }
}




