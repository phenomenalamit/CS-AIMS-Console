// Business Logic TS file of add-funding.component.html
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Inject,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { DialogBoxComponent } from 'src/app/dialog-box/dialog-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as fundingData from 'src/app/data/funding-data.json';
import * as fundingProjectData from 'src/app/data/project_funding.json';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { ResponsibleOrganizationService } from 'src/app/Service/responsible-organization.service';
import { ResponsibleOrganization } from 'src/app/Service-Class/responsible-organization';
import { IatiLocation } from 'src/app/Service-Class/iati-location';
import { IatiLocationService } from 'src/app/Service/iati-location.service';
import { DonorService } from 'src/app/Service/donor.service';
// import { FundingService } from 'src/app/Service/fundingService.service';

import { FundingServiceClass } from 'src/app/Service-Class/fundingServiceClass-class';
import { FundingServiceService } from 'src/app/Service/fundingService.service';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FinancingClass } from 'src/app/Service-Class/financing-class';
import { Currency } from 'src/app/Service-Class/currency';
import { CurrencyService } from 'src/app/Service/currency.service';
import { ProvincesService } from 'src/app/Service/provinces.service';
import { Provinces } from 'src/app/Service-Class/provinces';
import { DistrictsService } from 'src/app/Service/districts.service';
import { Districts } from 'src/app/Service-Class/districts';
import { BankOfMozambique } from 'src/app/Service-Class/bank-of-mozambique';
import { BankOfMozambiqueService } from 'src/app/Service/bank-of-mozambique.service';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { Commitment } from 'src/app/model/commitment';
import moment from 'moment';
import $, { data } from 'jquery';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { Organization } from 'src/app/model/organization';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { ViewTableModalDisbursmentComponent } from '../../view-more-components/view-table-modal-disbursment/view-table-modal-disbursment.component';
import { ViewTableModalPaymentComponent } from '../../view-more-components/view-table-modal-payment/view-table-modal-payment.component';
import { FinancingAgreement } from 'src/app/Service-Class/financing-agreement';
import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { OrganizationService } from 'src/app/Service/organization.service';
import { E, J } from '@angular/cdk/keycodes';
import { EnvelopeTableData } from 'src/app/Service-Class/envelope-table-data';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ExchangeRateAdministrationComponent } from '../../administration-component/exchange-rate-administration/exchange-rate-administration.component';

interface iati_accuracy {
  value: string;
  viewValue: string;
}

export interface DisbursementData {
  disbursementReference: string;
  disbursementDate: string;
  disbursementAmountinDisbursementCurrency: string;
  disbursementCurrency: string;
  disbursementAmountinMeticais: number;
  disbursementAmountinUSD: number;
}

export interface PaymentData {
  paymentReference: string;
  paymentDate: string;
  amountOfPaymentInDisbursementCurrency: number;
  paymentAmountInMeticais: number;
  paymentAmountInUSD: number;
  paymentCurrency: string;
}



interface PriorityPillarPQG {
  disabled?: boolean;
  name: string;
  options: Option[];
}

// class for financing stituation option
export class FinancingSituationOption {
  optionId: string;
  optionName: string;
}
interface Option {
  value: string;
  viewValue: string;
  viewValuePt: string;
  childOptions: ChildOptions[];

}
interface ChildOptions {
  value: string;
  viewValue: string;
  viewValuePt: string;
}
@Component({
  selector: 'app-add-funding',
  templateUrl: './add-funding.component.html',
  styleUrls: ['./add-funding.component.css']
})

export class AddFundingComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog,
    public translate: TranslateService,
    private router: Router,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private districtsService: DistrictsService,
    private financingService: FinancingServiceService,
    private currencyService: CurrencyService,
    private provincesService: ProvincesService,
    private fundingOrganizationService: FundingOrganizationService,
    private responsibleOrganizationService: ResponsibleOrganizationService,
    private fundingService: FundingServiceService,
    private iatiLocationService: IatiLocationService,
    private bankService: BankOfMozambiqueService,
    private donorService: DonorService,
    private el: ElementRef,
    private decimalPipe: DecimalPipe,
    private route: ActivatedRoute,
    private disbursementCrud: DisbursementCrudServiceService,
    private paymentCrud: PaymentCrudServiceService,
    private notificationService: NotificationService,
    private organizationService: OrganizationService

  ) {
    // this.dataSource3;
  }
  ngAfterViewInit() {
    // this.dataSource3.paginator = this.paginator.toArray()[2];
    // this.dataSource3.sort = this.sort.toArray()[2];
    this.disbursementdataSource.sort = this.disbursementSort
    this.disbursementdataSource.paginator = this.disbursementPaginator
  }

  auto_save_as_draft_flag = false;
  ngOnDestroy() {
    if (this.viewMoreId == null) {
      if (this.auto_save_as_draft_flag == true) {
        this.autoSaveAsDraft();
      }
    }
  }

  disList: string[] = [
    'Matutuíne ',
    'Magude ',
    'Manhiça ',
    'Namaacha ',
    'Moamba ',
    'Marracuene ',
  ];

  iati_accuracyOptions: iati_accuracy[] = [
    { value: 'option1', viewValue: 'accurate' },
    { value: 'option2', viewValue: 'approximate' },
  ];
  SaveAsDraft = new FormControl('');
  general_information_form = new FormGroup({
    financialAgreementId: new FormControl(0),
    donor_funding_reference: new FormControl('', [Validators.required]),
    funding_donor_title: new FormControl('', [Validators.required]),
    donor: new FormControl('', [Validators.required]),
    // snip_marker: new FormControl(''),
    funding_organization: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    budgetSupportOptions: new FormControl(),
    responsible_organization: new FormControl({ value: '', disabled: false }),
    emergingPartner: new FormControl(''),
    date_of_signature: new FormControl(''),
    start_date: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    end_date: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    financing_situatuion: new FormControl('', [Validators.required]),
    type_of_aid: new FormControl('', [Validators.required]),
    come_in_like: new FormControl(''),
    type_of_implementation: new FormControl(''),
    state_budget: new FormControl('', [Validators.required]),
    treasury_single_account: new FormControl({ value: '', disabled: true }),
    direct_implementation: new FormControl({ value: '', disabled: true }),
    // iati_location: new FormControl(''),
    resourceSourceId: new FormControl(0),
    pillar_pqg_meo: new FormControl(),
    strategic_objective_pqg_meo: new FormControl({ value: '', disabled: true }),
    reference_for_financing_donor: new FormControl(''),
    tableFundingComments: this.fb.array([
      // this.fb.group({
      //   comments: [''],
      // }),
    ]),
  });
  allocation_form = new FormGroup({
    envelopeReference: new FormControl(null),
    envelopeAmountMzn: new FormControl({ value: null, disabled: true }),
    envelopeAmountUsd: new FormControl({ value: null, disabled: true }),
    amount_allocated_in_financing_agreement: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
    currency_of_the_financing_agreement: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
    exchange_rates_in_usd: new FormControl({ value: null, disabled: true }),
    exchange_rates_in_mzn: new FormControl({ value: null, disabled: true }),
    amount_allocated_from_the_financing_agreement_in_meticais: new FormControl({
      value: null,
      disabled: true,
    }),
    amount_allocated_from_financing_agreement_in_usd: new FormControl({
      value: null,
      disabled: true,
    }),
    type_of_finance: new FormControl(null, [Validators.required]),
    grantEquivalentMzn: new FormControl(null),
    grantEquivalentUsd: new FormControl(null),
  });
  commitment_form = this.fb.group({
    meo_resource_source: new FormControl({ value: null, disabled: true }),
    // totalCommitmentAmountMzn: new FormControl({value:null,disabled:true}),
    // totalCommitmentAmountUsd: new FormControl({value:null,disabled:true}),
    // financial_execution_rate: new FormControl(''),
    tableData: this.fb.array([

    ]),
  });

  disbursement_form = new FormGroup({
    total_amount_disbursed_in_meticais: new FormControl({
      value: null,
      disabled: true,
    }),
    total_amount_disbursed_in_usd: new FormControl({
      value: null,
      disabled: true,
    }),
    disbursement_fee: new FormControl({ value: '', disabled: true }),
  });

  payment_form = new FormGroup({
    amount_paid_in_meticais: new FormControl({
      value: null,
      disabled: true,
    }),
    amount_paid_in_usd: new FormControl({
      value: null,
      disabled: true,
    }),
    financial_execution_rate: new FormControl({
      value: null,
      disabled: true,
    }),
  });

  locationForm = new FormGroup({
    provinces: new FormControl([]),
    districts: new FormControl(null),
  });

  priority_pillar_list: PriorityPillarPQG[] = [
    {
      name: 'Priority',
      options: []
    }, {
      name: 'Pillar',
      options: []
    }
  ];
  
  strategic_objective_options: any;
  

  displayedColumnsDisbursement: string[] = [
    'edit',
    'disbursementReference',
    'disbursementDate',
    'disbursementAmountinDisbursementCurrency',
    'disbursementCurrency',
    'disbursementAmountinMeticais',
    'disbursementAmountinUSD',
  ];
  displayedColumnsForPayment: string[] = [
    'edit',
    'paymentReference',
    'paymentDate',
    'amountOfPaymentInDisbursementCurrency',
    'paymentCurrency',
    'paymentAmountInMeticais',
    'paymentAmountInUSD',
  ];
  displayedColumnsForLocation: string[] = [
    'georef',
    'iatiLocation',
    'iatiAccuracy',
    'coordinates',
    'geoComments',
  ];
  dataSource3 = null;
  @ViewChild('disbursementPaginator') disbursementPaginator: MatPaginator;
  @ViewChild('paymentPaginator') paymentPaginator: MatPaginator;
  @ViewChild('locationPaginator') locationPaginator: MatPaginator;
  @ViewChild('disbursementSort') disbursementSort: MatSort;
  @ViewChild('paymentSort') paymentSort: MatSort;
  @ViewChild('locationSort') locationSort: MatSort;

  chosenYearDate!: Date;

  iatiLocationList!: IatiLocation[];
  stateBudgetList!: FundingServiceClass[];
  responsibleOrganizationOptions: ResponsibleOrganization[];
  fundingOrganizationOptions!: FundingOrganization[];

  currencyfilter!: Observable<string[]>;
  donorfilter!: Observable<string[]>;
  fundingorganizationFilter!: Observable<string[]>;
  responsibleorganizationFilter!: Observable<string[]>;
  financingsituationFilter!: Observable<string[]>;
  typesOfAidDacCrsFilter!: Observable<string[]>;
  autoComeInLikeFilters!: Observable<string[]>;
  typeOfFinanceFilter!: Observable<string[]>;
  meoResourceSourceFilter!: Observable<string[]>;
  pillarPqgMeoFilter!: Observable<string[]>;
  strategicObjectivePqgMeoFilter!: Observable<string[]>;
  yearFilter: Observable<string[]>;
  uAccessPermArr: UserAccessPermission[] = [];
  userDisbursementPermission: number[] = [];
  userPaymentPermission: number[] = [];

  //expansion flags
  allocation_flag = false;
  commitments_flag = false;
  disbursement_flag = false;
  payments_flag = false;
  location_flag = false;
  pickerDisable_flag_date_of_signature: any = false;
  pickerDisable_flag: any = false;
  //mandatory flags
  start_and_end_date_mandatory_flag = true;
  donor_and_funding_organization_mandatory_flag = true;
  get_location_fields_hidden_flag = true;
  responsible_organization_mandatory_flag = false;
  date_of_signature_mandatory_flag = false;
  treasury_single_account_mandatory_flag = false;
  direct_implementation_mandatory_flag = false;
  amount_allocated_in_financing_agreement_mandatory_flag = true;
  pillar_pqg_meo_mandatory_flag = false;
  strategic_objective_pqg_meo_mandatory_flag = false;
  authorised_flag = false;
  usergroup: any;
  userId:number;
  nodisplay: any = true;
  onBudget: any = false;
  number = 1.3765273;
  format = '1.0-4';
  result = null;
  browserLang: any;
  bomozam: BankOfMozambique = new BankOfMozambique();
  // private getFundingOrganization(){
  //     this.fundingOrganizationService.getFundingOrganizationList().subscribe(data=>{
  //         this.fundingOrganizationOptions=data;
  //     });
  // }

  private getResponsibleOrganization() {
    this.responsibleOrganizationService
      .getResponsibleOrganizationList()
      .subscribe((data) => {
        this.responsibleOrganizationOptions = data;

      });
  }


  private getIatiLocation() {
    this.iatiLocationService.getIatiLocationList().subscribe((data) => {
      this.iatiLocationList = data;
    });
  }
  
  private getStateBudget() {
    this.fundingService.getStateBudgetList().subscribe((data) => {
      this.stateBudgetList = data;
      for (let i = 0; i < this.stateBudgetList.length; i++) {
        let crtDt = this.stateBudgetList[i].createdOn;
        let updateDt = this.stateBudgetList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.stateBudgetList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.stateBudgetList[i].updateDifference = days_differenceForUpdate;
        }
        (this.stateBudgetList[i].difference) = days_difference;
      }
    });
  }

  EditId: any = null;
  viewMoreId: any = null;
  editResponse: any = null;
  viewDraftedFaId: any = null;
  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.setToAuthFlag();
    this.EditId = this.route.snapshot.paramMap.get("editFaId");
    localStorage.removeItem('fundingRefNM');
    /* Below is for At View more time we have to get the id from url */
    this.viewMoreId = this.route.snapshot.paramMap.get("viewMoreFaId");
    this.viewDraftedFaId = this.route.snapshot.paramMap.get("viewMoreDraftdFaId");

    this.disbursementdataSource = new MatTableDataSource();
    this.paymentdataSource = new MatTableDataSource();
    this.dataSource3 = new MatTableDataSource();


    this.getFinancingSituation();
    this.getAidDACCRS();
    this.getDonorDetails();
    this.getOrganization();
    this.getTypeOfImplementation();
    this.getResponsibleOrganization();
    this.getIatiLocation();
    this.getStateBudget();
    this.getPillarPqgMeo();
    this.getCurrencyDetails();
    this.getTypeOfFinanceDetails();
    this.getMeoResourceSourceDetails();
    this.getProvinces();
    this.setToUserPermission();
    this.getSaveAsDraftList();
    if (this.EditId == null || this.viewMoreId != null)
      this.locationForm.controls.districts.disable();
    this.flag_delete = true;
    this.nodisplay = false;
    if (this.EditId == null || this.viewMoreId != null)
      this.general_information_form.controls['date_of_signature'].disable();
    this.pickerDisable_flag_date_of_signature = true;
    this.browserLang = localStorage.getItem('browserLang');
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(
      this.browserLang.match(/en|pt/) ? this.browserLang : 'en'
    );

    if (this.usergroup == 'dngdpteam' || this.usergroup == 'dnpo') {
      this.general_information_form.controls['pillar_pqg_meo'].disable();
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].disable();
    } else {
      this.general_information_form.controls['pillar_pqg_meo'].enable();
      // this.general_information_form.controls['strategic_objective_pqg_meo'].enable();
    }

    // edit code starts here


    if (this.EditId != null) {
      this.financialAgreementId = this.EditId;
      this.auto_save_as_draft_flag = false;
      this.getDisbursementDetails(this.EditId);
      this.getPaymentDetails(this.EditId);
      this.financingService.getFinancialAgreementForEditById(this.EditId).subscribe(res => {
        this.editResponse = res;
        localStorage.setItem("fundingRefNM", this.editResponse.financial_agreement.donor_funding_title);
        this.setValuesToFormField();
      });
      // this.EditId=null;
    }
    if (this.viewMoreId != null) {
      this.financialAgreementId = this.viewMoreId;
      this.auto_save_as_draft_flag = false;
      this.getDisbursementDetails(this.viewMoreId);
      this.getPaymentDetails(this.viewMoreId);
      this.financingService.getFinancialAgreementForEditById(this.viewMoreId).subscribe(res => {
        this.editResponse = res;
        this.setValuesToFormField();
        this.general_information_form.disable();
        this.allocation_form.disable();
        this.commitment_form.disable();
        this.locationForm.disable();
      });
    }
    if (this.viewDraftedFaId != null) {
      this.financialAgreementId = this.viewDraftedFaId;
      this.auto_save_as_draft_flag = false;
      this.getDisbursementDetails(this.financialAgreementId);
      this.getPaymentDetails(this.financialAgreementId);
      this.financingService.getFinancialAgreementForEditById(this.viewDraftedFaId).subscribe(res => {
        this.editResponse = res;
        this.setValuesToFormField();
        this.general_information_form.disable();
        this.allocation_form.disable();
        this.commitment_form.disable();
        this.locationForm.disable();
      });
    }
    if (this.ViewMoreFundingFromProject == 'ViewMoreFundingFromProject') {
      localStorage.setItem(
        'ViewMoreFundingFromProject',
        'reset-view-funding-from-project'
      );
      this.getIatiLocation();

      this.flag_delete = false;
      this.nodisplay = false;

      this.general_information_form.controls.donor.patchValue(
        fundingData.donor
      );
      this.general_information_form.controls.reference_for_financing_donor.patchValue(
        fundingData.donor_funding_reference
      );
      this.general_information_form.controls.funding_donor_title.patchValue(
        fundingData.funding_donor_title
      );
      this.getFundingOrganizationDetails();
      this.general_information_form.controls.funding_organization.patchValue(
        fundingData.funding_organization
      );
      // this.general_information_form.controls.financing_situatuion.patchValue(fundingData.financing_situatuion);
      // this.general_information_form.controls.responsible_organization.patchValue(fundingData.responsible_organization);
      this.general_information_form.controls.date_of_signature.patchValue(
        fundingData.date_of_signature
      );
      this.pickerDisable_flag = true;
      this.general_information_form.controls.start_date.patchValue(
        fundingData.start_date
      );
      this.general_information_form.controls.end_date.patchValue(
        fundingData.end_date
      );

      // this.general_information_form.controls.type_of_aid.patchValue(fundingData.type_of_aid);
      this.general_information_form.controls.state_budget.patchValue(
        fundingData.state_budget
      );
      this.general_information_form.controls.treasury_single_account.patchValue(
        fundingData.treasury_single_account
      );
      // this.general_information_form.controls.snip_marker.patchValue(fundingData.snip_marker);
      this.getIatiLocation();
      this.locationForm.controls.iati_location.patchValue(
        fundingData.iati_location
      );
      this.locationForm.controls.provinces.patchValue(fundingData.provinces);
      this.selectProvience();
      this.locationForm.controls.districts.patchValue(fundingData.districts);

      this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(
        fundingData.amount_allocated_in_financing_agreement
      );
      this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(
        fundingData.currency_of_the_financing_agreement
      );
      this.getCurrency();
      this.allocation_form.controls.type_of_finance.patchValue(
        fundingData.type_of_finance
      );

      this.general_information_form.controls.pillar_pqg_meo.patchValue(
        fundingData.pillar_pqg_meo[0]
      );
      // this.getStrategicPQG();
      this.general_information_form.controls.strategic_objective_pqg_meo.patchValue(
        fundingData.strategic_objective_pqg_meo[0]
      );
      this.populateYear();
      this.disbursement_form.controls.disbursement_fee.patchValue(
        this.decimalPipe.transform(fundingData.disbursement_fee) + ' %'
      );
      fundingData.tableDataOffBudget.forEach(() => {
        this.addCommitmentTableRow();
      });
      for (let i = 0; i < fundingData.tableDataOffBudget.length; i++) {
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('year')
          .patchValue(fundingData.tableDataOffBudget[i].year);
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amounts_of_annual_commitments_agreement_currency')
          .patchValue(
            fundingData.tableDataOffBudget[i]
              .amounts_of_annual_commitments_agreement_currency
          );
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('currencyName')
          .patchValue(fundingData.tableDataOffBudget[i].currencyName);
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amounts_of_annual_commitments_in_meticais')
          .patchValue(
            fundingData.tableDataOffBudget[i]
              .amounts_of_annual_commitments_in_meticais
          );
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amounts_of_annual_commitments_in_usd')
          .patchValue(
            fundingData.tableDataOffBudget[i]
              .amounts_of_annual_commitments_in_usd
          );
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amount_committed_in_nationalBudget_mzn')
          .patchValue(
            fundingData.tableDataOffBudget[i]
              .amount_committed_in_nationalBudget_mzn
          );
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amount_committed_in_nationalBudget_usd')
          .patchValue(
            fundingData.tableDataOffBudget[i]
              .amount_committed_in_nationalBudget_usd
          );
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('year')
          .disable();
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amounts_of_annual_commitments_in_meticais')
          .disable();
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amounts_of_annual_commitments_in_usd')
          .disable();
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amount_committed_in_nationalBudget_mzn')
          .disable();
        (
          (this.commitment_form.controls.tableData as FormArray).at(
            i
          ) as FormGroup
        )
          .get('amount_committed_in_nationalBudget_usd')
          .disable();
      }
      var e: any;
      this.allocation_flag = true;
      this.location_flag = true;
      this.commitments_flag = true;
      this.disbursement_flag = true;
      this.payments_flag = true;
      this.location_flag = true;
    }
  }
  // faId:any=null;
  setValuesToFormField() {
    //set start year and end year
console.log("edit Res ",this.editResponse)
    if (this.editResponse.financial_agreement.start_date != null)
      this.general_information_form.controls.start_date.patchValue(moment(this.editResponse.financial_agreement.start_date, "YYYY-MM-DD"));
    console.log("this.editResponse.financial_agreement.direct_implementation:"+this.editResponse.financial_agreement.direct_implementation);
      if(this.editResponse.financial_agreement.direct_implementation != null)
       this.general_information_form.controls.direct_implementation.patchValue(this.editResponse.financial_agreement.direct_implementation);

    if (this.editResponse.financial_agreement.end_date != null)
      this.general_information_form.controls.end_date.patchValue(moment(this.editResponse.financial_agreement.end_date, "YYYY-MM-DD"));
    this.populateYear();

    //set commmitment data
    if ((this.editResponse.commitment as Array<JSON>).length > 0) {
      (this.editResponse.commitment as Array<JSON>).forEach(element => {
        this.checkCommitment();
      });
      debugger
      for (let i = 0; i < (this.commitment_form.controls.tableData as FormArray).length; i++) {
        let element: any[] = this.editResponse.commitment as Array<any>;
        if (element[i].year != null)
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('year').patchValue(+element[i].year);
        if (element[i].amounts_of_annual_commitments_agreement_currency != null)
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('amounts_of_annual_commitments_agreement_currency').patchValue(this.currencyPipe.transform(element[i].amounts_of_annual_commitments_agreement_currency, ' '));
        if (element[i].currencyName != null)
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('currencyName').patchValue(element[i].currencyName);

        if (element[i].amounts_of_annual_commitments_in_meticais != null && element[i].amounts_of_annual_commitments_in_meticais != "null")
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('amounts_of_annual_commitments_in_meticais').patchValue(this.currencyPipe.transform(element[i].amounts_of_annual_commitments_in_meticais, ' '));
        if (element[i].amounts_of_annual_commitments_in_usd != null && element[i].amounts_of_annual_commitments_in_usd != 'null')
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('amounts_of_annual_commitments_in_usd').patchValue(this.currencyPipe.transform(element[i].amounts_of_annual_commitments_in_usd, ' '));
        // if(element[i].amount_committed_in_nationalBudget_mzn!=null)
        //   ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
        //   .get('amount_committed_in_nationalBudget_mzn').patchValue(this.currencyPipe.transform(element[i].amount_committed_in_nationalBudget_mzn, ' '));
        //   else
        ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
          .get('amount_committed_in_nationalBudget_mzn').patchValue('N/A');
        // if(element[i].amount_committed_in_nationalBudget_usd!=null)
        //   ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
        //   .get('amount_committed_in_nationalBudget_usd').patchValue(this.currencyPipe.transform(element[i].amount_committed_in_nationalBudget_usd, ' '));
        //   else
        ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
          .get('amount_committed_in_nationalBudget_usd').patchValue('N/A');
      }
      this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
      this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
      let commitmentAmt = this.getSumOfCommitmentAmount();
      if (commitmentAmt != -1)
        this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
      else
        this.sumOfCommitmentAmount = "-";
      // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
      // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
    }

    // this.financingService.getFinancialAgreementForEditById(this.faId).subscribe(res => {
    this.general_information_form.controls.financialAgreementId.patchValue(this.editResponse.financial_agreement.funding_id);
    this.general_information_form.controls.funding_donor_title.patchValue(this.editResponse.financial_agreement.donor_funding_title);
    this.general_information_form.controls.donor_funding_reference.patchValue(this.editResponse.financial_agreement.reference_for_financing_donor);
    this.general_information_form.controls.donor.patchValue(+this.editResponse.financial_agreement.donor);
    this.general_information_form.controls.financing_situatuion.patchValue(this.editResponse.financial_agreement.financing_situation);
    // this.general_information_form.controls.donor.patchValue(this.editResponse.financial_agreement.donor,{emitEvent:true});
    this.getFundingOrganizationDetails();
    // this.getResponsibleOrganizationDetails();
    // this.general_information_form.controls.responsible_organization.patchValue(+res.financial_agreement.responsibleOrganization);
    this.general_information_form.controls.responsible_organization.patchValue(+this.editResponse.financial_agreement.responsibleOrganization);

    this.general_information_form.controls.date_of_signature.patchValue(moment(this.editResponse.financial_agreement.signature_date, "YYYY-MM-DD"));
    this.general_information_form.controls.type_of_aid.patchValue(this.editResponse.financial_agreement.type_of_aid);
    this.typeOfAidDacCrsBusinessRule();
    this.general_information_form.controls.budgetSupportOptions.patchValue(this.editResponse.financial_agreement.budgetId);

    this.general_information_form.controls.come_in_like.patchValue(this.editResponse.financial_agreement.enter_as);
    this.general_information_form.controls.type_of_implementation.patchValue(this.editResponse.financial_agreement.implementation_type);
    this.general_information_form.controls.state_budget.patchValue(this.editResponse.financial_agreement.state_budget);
    this.stateBudgetBusinessRule();
    this.general_information_form.controls.treasury_single_account.patchValue(this.editResponse.financial_agreement.single_treasury_account);
    this.general_information_form.controls.direct_implementation.patchValue(this.editResponse.financial_agreement.direct_implementation);
debugger
let sdgsArr: string[] = [];
    if (this.editResponse.faResourceSource != null && this.editResponse.faResourceSource.pillarPqgMasterId != null && this.editResponse.faResourceSource.pillarPqgMasterId != '') {
      {
        sdgsArr.push(this.editResponse.faResourceSource.pillarPqgMasterId + '');
      // this.general_information_form.controls.pillar_pqg_meo.patchValue("['"+this.editResponse.faResourceSource.pillarPqgMasterId + "']");
      this.general_information_form.controls.pillar_pqg_meo.patchValue(sdgsArr);
      }
      this.getStrategicPqgMeo();
      if (this.editResponse.faResourceSource != null) {
        if (this.editResponse.faResourceSource.mpoResourceCode != null)
          this.commitment_form.controls.meo_resource_source.patchValue(this.editResponse.faResourceSource.mpoResourceCode);
      }
    }
    this.general_information_form.controls.pillar_pqg_meo.patchValue(this.editResponse.financial_agreement.pqg_meo_pillar);

    if (this.editResponse.faComments != null) {

      (this.general_information_form.controls.tableFundingComments as FormArray).clear();


      let responseCommentsLength = this.editResponse.faComments.length;
      // if(length>0){
      //   tableData = ((this.general_information_form.controls.tableFundingComments as FormArray).at(length-1) as FormControl).value;
      //   }

      for (let i = 0; i < responseCommentsLength; i++) {
        this.generateCommentsDataEdit(i);
        // ((this.general_information_form.controls.tableFundingComments as FormArray).at(i) as FormControl).patchValue(this.editResponse.faComments[i]);
      }
      this.addCommentRowEdit(responseCommentsLength);
    }

    // if(this.editResponse)
    this.validateOnChange();
    this.allocation_flag = true;
    this.commitments_flag = true;
    this.disbursement_flag = true;
    this.payments_flag = true;
    this.location_flag = true;
    if (this.editResponse.financial_agreement.envelopeReference == null
      || this.editResponse.financial_agreement.envelopeReference == "null"
      || this.editResponse.financial_agreement.envelopeReference == undefined
      || this.editResponse.financial_agreement.envelopeReference == 'Select') {
      // this.allocation_form.controls.envelopeReference.patchValue( this.editResponse.financial_agreement.envelopeReference);
      if (this.editResponse.financial_agreement.amt_local_currency_agreement != null && this.editResponse.financial_agreement.amt_local_currency_agreement != "null")
        this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(this.editResponse.financial_agreement.amt_local_currency_agreement, ' '));
      if (this.editResponse.financial_agreement.financing_agreement_currency != null)
        this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(this.currenyList.find(x => x.currency_id == this.editResponse.financial_agreement.financing_agreement_currency).currency_shortname.toString());
      console.log("this.allocation_form.controls.currency_of_the_financing_agreement-->",this.allocation_form.controls.currency_of_the_financing_agreement);
        this.getCurrency();
    }
    // if(this.editResponse.financial_agreement.amt_local_currency_agreement!=null && this.editResponse.financial_agreement.amt_local_currency_agreement!="null")
    //   this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(this.editResponse.financial_agreement.amt_local_currency_agreement, ' '));
    // if(this.editResponse.financial_agreement.financing_agreement_currency!=null)
    //   this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(this.currenyList.find(x=>x.currency_id==this.editResponse.financial_agreement.financing_agreement_currency).currency_shortname );
    // this.getCurrency();
    if (this.editResponse.financial_agreement.type_of_financing_daccrs != null)
      this.allocation_form.controls.type_of_finance.patchValue(this.editResponse.financial_agreement.type_of_financing_daccrs);

    if (this.editResponse.financial_agreement.amt_grant_equivalent_mzn != null) {
      let amt_grant_equivalent_mzn: number = this.editResponse.financial_agreement.amt_grant_equivalent_mzn;
      this.allocation_form.controls.grantEquivalentMzn.patchValue(this.currencyPipe.transform(amt_grant_equivalent_mzn, ' '));
    }
    if (this.editResponse.financial_agreement.amt_grant_equivalent_usd != null) {
      let amt_grant_equivalent_usd: number = this.editResponse.financial_agreement.amt_grant_equivalent_usd;
      this.allocation_form.controls.grantEquivalentUsd.patchValue(this.currencyPipe.transform(amt_grant_equivalent_usd, ' '));

    }
    // this.addCommitmentTableRow();


    if (this.editResponse.faProvinces.length > 0) {
      let provinces: number[] = [];
      this.editResponse.faProvinces.forEach(data => {
        provinces.push(data.provinceMasterId);
      });
      this.locationForm.controls.provinces.patchValue(provinces);
      this.locationForm.controls.districts.enable();
      this.getDistricts();
    }
    if (this.editResponse.faDistricts.length > 0) {
      let districts: number[] = [];
      this.editResponse.faDistricts.forEach(data => {
        districts.push(data.districtMasterId);
      });
    
      this.locationForm.controls.districts.patchValue(districts);
      this.editResponse.faDistricts = null;
    }
    this.getLocationEdit();

    // this.validateGeneralInformation();


    // })
  }
  addCommentRowEdit(responseCommentsLength) {

    for (let i = 0; i < responseCommentsLength; i++) {
      if (this.commentsData[i].commentedBy != this.loggedInUserfullName) {
        this.permissionDeleteComment[i] = false;
      } else {
        this.permissionDeleteComment[i] = true;
      }
      let row = null;
      if (this.permissionDeleteComment[i]) {
        row = this.fb.group({
          comments: [''],
        });
      } else if (!this.permissionDeleteComment[i]) {
        row = this.fb.group({
          comments: [{ value: '', disabled: true }],
        });
      }

      (
        this.general_information_form.get('tableFundingComments') as FormArray
      ).push(row);
      ((
        this.general_information_form.controls.tableFundingComments as FormArray
      ).at(i) as FormGroup).controls.comments.patchValue(this.commentsData[i].comment);

    }
  }
  userAccessObject = JSON.parse(localStorage.getItem("userAccessAllDetails"));
  loggedInUserfullName = this.userAccessObject.firstName + " " + this.userAccessObject.lastName;
  commentsData: Comment[] = [];
  permissionDeleteComment = [];

  generateCommentsData(index: number) {
    let comment = '';
    if ((this.general_information_form.controls.tableFundingComments as FormArray).length > 0) {
      comment = ((this.general_information_form.controls.tableFundingComments as FormArray).at(index) as FormControl).get('comments').value;

    }
    let date = String(new Date()).substring(0, 24);
    this.commentsData[index] = {
      comment: comment,
      commentedBy: this.loggedInUserfullName,
      commentedOn: date
    }
  }
  generateCommentsDataEdit(index: number) {
    let comment = this.editResponse.faComments[index].comment;
    let commentedBy = this.editResponse.faComments[index].commentedBy;
    let responseDate: string = this.editResponse.faComments[index].commentDate;
    let date = String(new Date(responseDate)).substring(0, 24);
    this.commentsData[index] = {
      comment: comment,
      commentedBy: commentedBy,
      commentedOn: date
    }

    if (this.loggedInUserfullName == commentedBy)
      this.permissionDeleteComment[index] = true
    else
      this.permissionDeleteComment[index] = false

  }


  saveAsDraftList: FinancialAgreement[] = [];
  searchDraft= new FormControl('');
  draftfilteredOption: Observable<any[]>;
  getSaveAsDraftList() {
    this.financingService.getFASaveAsDraftList().subscribe((data) => {
      this.saveAsDraftList = data;
      for(let k=0;k<this.saveAsDraftList.length;k++){
        if(this.saveAsDraftList[k].donor_funding_title==null){
          this.saveAsDraftList[k].donor_funding_title=""
        }
      }
      // console.log("this.saveAsDraftList ",this.saveAsDraftList)
      this.draftfilteredOption = this.searchDraft.valueChanges
          .pipe(
            startWith(''),
            map(data => data ? this.filterDraftData(data) : this.saveAsDraftList.slice())
          );
    })
  }
  private filterDraftData(name: string) {
    return this.saveAsDraftList.filter(data =>
      data.donor_funding_title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  get_mozgis_iframe_hidden_flag = true;
  getLocationEdit() {
    this.get_location_fields_hidden_flag = false;
    if ((this.EditId != null || this.viewMoreId != null || this.financialAgreementId != null || this.viewDraftedFaId != null) && this.editResponse != null) {
      if (this.editResponse.faLocation.length > 0) {
        this.editResponse.faLocation.forEach(element => {
          // let latitude = element.latitude;
          // let longitude = element.longitude;
          let georef = element.geographicalReference;
          let iatiLocation = element.iatiLocation;
          let iatiAccuracy = element.iatiAccuracy;
          let locationObj: LocationData = {
            iatiLocation: iatiLocation,
            iatiAccuracy: iatiAccuracy,
            coordinates: element.coordinates,
            geolocationComments: element.geolocationComments,
            geographicalReference: georef,
          };
          this.locationTD.push(locationObj);
        });
      }
    }
    this.dataSource3.data = this.locationTD;
  }
  getLocation() {
    this.getValueByLang();
    this.getIframeDtls();
    var province = this.locationForm.controls.provinces.value;
    var district = this.locationForm.controls.districts.value;
    if (province == '' || province == undefined || province == null) {
      this.get_location_fields_hidden_flag = true;
      this.get_mozgis_iframe_hidden_flag = true;
      // this.locationForm.controls['longitude'].reset();
      // this.locationForm.controls['latitude'].reset();
      // this.locationForm.controls['geolocation_comments'].reset();
      // this.locationForm.controls['iati_accuracy'].reset();
      $('#province').trigger('focus');
      if (this.browserLang == 'en')
        Swal.fire('Province must be selected');
      else
        Swal.fire('Deve selecciona uma Província');
    } else {
      this.get_location_fields_hidden_flag = false;
      this.get_mozgis_iframe_hidden_flag = false;
      this.refreshLocationTable();
    }
  }
  locationTD: LocationData[] = [];
  refreshLocationTable() {
 

    this.locationTD = [];
    // for (let i = 0; i < sumOfProvinceDistrict; i++) {
    // let latitude = Math.random() * 360 - 180;
    // let longitude = Math.random() * 360 - 180;
    var latLong = "MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 20)))";
    let randomNoBtw1_4 = Math.floor(Math.random() * 3) + 1;
    let randomNoBtw1_2 = Math.round(Math.random());
    let randomString = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for (let j = 0; j < 4; j++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    let georef = randomString + Math.round(Math.random() * 1000000);
    let iatiLocation = IATILocation[randomNoBtw1_4];
    let iatiAccuracy = IATIAccuracy[randomNoBtw1_2];
    let locationObj: LocationData = {
      iatiLocation: iatiLocation,
      iatiAccuracy: iatiAccuracy,
      coordinates: latLong,
      geolocationComments: 'This a geo comment.',
      geographicalReference: georef,
    };
    this.locationTD.push(locationObj);
    // }
    this.dataSource3.data = this.locationTD;

  }
  public hasError = (controlName: string, errorName: string) => {
    return this.general_information_form.controls[controlName].hasError(
      errorName
    );
  };
  public hasError2 = (controlName: string, errorName: string) => {
    return this.allocation_form.controls[controlName].hasError(errorName);
  };
  public hasError3 = (controlName: string, errorName: string) => {
    return this.commitment_form.controls[controlName].hasError(errorName);
  };
  editAllocatedAmount(value) {
    this.allocation_form.controls.amount_allocated_in_financing_agreement.setValue(
      value.replace(/[^0-9.]+/g, '')
    );
  }
  viewAllocatedAmount(value) {
    this.allocation_form.controls.amount_allocated_in_financing_agreement.setValue(
      this.currencyPipe.transform(value, ' ')
    );
  }
  editAnnualAmount(amount, index) {
    // on focus remove currency formatting
    (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    )
      .get('amounts_of_annual_commitments_agreement_currency')
      .patchValue(amount.replace(/[^0-9.]+/g, ''));
  }
  viewAnnualAmount(amount, index) {
    // on blur, add currency formatting
    (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    )
      .get('amounts_of_annual_commitments_agreement_currency')
      .patchValue(this.currencyPipe.transform(amount, ' '));
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  clearSignatureDate(event) {
    event.stopPropagation();
    this.general_information_form.controls['date_of_signature'].reset();
  }
  clearStartDate(event) {
    event.stopPropagation();
    this.general_information_form.controls['start_date'].reset();
    this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
    this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
    // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
    let commitmentAmt = this.getSumOfCommitmentAmount();
    if (commitmentAmt != -1)
      this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
    else
      this.sumOfCommitmentAmount = "-";
  }
  clearEndDate(event) {
    event.stopPropagation();
    this.general_information_form.controls['end_date'].reset();
    this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
    this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
    // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
    let commitmentAmt = this.getSumOfCommitmentAmount();
    if (commitmentAmt != -1)
      this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
    else
      this.sumOfCommitmentAmount = "-";

  }
  selectProvience() {
    this.locationForm.controls.districts.enable();
    this.getDistricts();
  }
  typeOfAidDacCrsBusinessRule() {
    let cooperationModalities = this.general_information_form.controls.type_of_aid;
    if (cooperationModalities.value == '1') {
      this.general_information_form.controls.state_budget.patchValue('1');

      // this.general_information_form.controls.responsible_organization.disable();
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.state_budget.disable();
      this.getBudgetSupport();
    } else {
      this.general_information_form.controls.budgetSupportOptions.reset();
      // this.general_information_form.controls.responsible_organization.enable();
      this.general_information_form.controls.state_budget.enable();
      // this.general_information_form.controls.state_budget.patchValue('2');
      // this.general_information_form.controls.
      // this.general_information_form.controls.responsible_organization.reset();
      // if (this.general_information_form.controls.state_budget.value != '2') {
      // this.general_information_form.controls.state_budget.reset();
      // }
    }
    this.stateBudgetBusinessRule();
  }
  stateBudgetBusinessRule() {
    //calling this method to add commitment data according to statebudget selected
    // this.addCommitmentData();
    if (this.general_information_form.controls.state_budget.value == '1') {
      this.onBudget = true;
      this.treasury_single_account_mandatory_flag = true;
      this.direct_implementation_mandatory_flag = false;
      this.general_information_form.controls[
        'treasury_single_account'
      ].enable();
      if (this.general_information_form.controls.type_of_aid.value == '1') {
        this.general_information_form.controls.treasury_single_account.patchValue('1');
        if (this.EditId == null || this.viewMoreId != null)
          this.general_information_form.controls.treasury_single_account.disable();
      } else if (this.general_information_form.controls.type_of_aid.value != '1') {
        this.general_information_form.controls.treasury_single_account.enable();
      }
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls['direct_implementation'].disable();
      this.general_information_form.controls[
        'treasury_single_account'
      ].setValidators([Validators.required]); //setting validation
      this.general_information_form.controls[
        'treasury_single_account'
      ].setErrors({ required: true }); //error message
      this.general_information_form.controls[
        'treasury_single_account'
      ].updateValueAndValidity(); //update validation
      this.general_information_form.controls[
        'direct_implementation'
      ].reset();
      this.general_information_form.controls[
        'direct_implementation'
      ].clearValidators(); //setting validation
      this.general_information_form.controls['direct_implementation'].setErrors(
        { required: false }
      ); //error message
      this.general_information_form.controls[
        'direct_implementation'
      ].updateValueAndValidity(); //update validation
      this.pillar_pqg_meo_mandatory_flag = true;
      this.strategic_objective_pqg_meo_mandatory_flag = true;
      this.general_information_form.controls.pillar_pqg_meo.setValidators([Validators.required]); //setting validation
      this.general_information_form.controls.pillar_pqg_meo.setErrors({ required: true }); //error message
      this.general_information_form.controls.pillar_pqg_meo.updateValueAndValidity();
      this.general_information_form.controls.strategic_objective_pqg_meo.setValidators([Validators.required]); //setting validation
      this.general_information_form.controls.strategic_objective_pqg_meo.setErrors({ required: true }); //error message
      this.general_information_form.controls.strategic_objective_pqg_meo.updateValueAndValidity();
      // this.general_information_form.controls.pillar_pqg_meo.patchValue(this.pillar_and_strategic_group1[0].findingsName);
      // this.general_information_form.controls.strategic_objective_pqg_meo.patchValue(this.pillar_and_strategic_group1[0].findingOptions[0]);
      // this.general_information_form.controls.pillar_pqg_meo.patchValue(
      //   this.priority_pillar_list[0].options[0].value
      // );
      // this.getStrategicPQG();
      // this.general_information_form.controls.strategic_objective_pqg_meo.patchValue(
      //   this.priority_pillar_list[0].options[0].childOptions[0].value
      // );
      // this.general_information_form.controls.pillar_pqg_meo.disable();
      // this.general_information_form.controls.strategic_objective_pqg_meo.disable();

      // this.commitment_form.controls.meo_resource_source.patchValue('2');
      // this.commitment_form.controls.meo_resource_source.disable();
    }
    if (this.general_information_form.controls.state_budget.value == '2') {
      this.onBudget = false;
      this.treasury_single_account_mandatory_flag = false;
      this.direct_implementation_mandatory_flag = true;
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.treasury_single_account.disable();
      this.general_information_form.controls['direct_implementation'].enable();
      this.general_information_form.controls[
        'treasury_single_account'
      ].reset();
      this.general_information_form.controls[
        'treasury_single_account'
      ].clearValidators(); //clear validation
      this.general_information_form.controls[
        'treasury_single_account'
      ].setErrors({ required: true }); //error message
      this.general_information_form.controls[
        'treasury_single_account'
      ].updateValueAndValidity(); //update validation
      this.general_information_form.controls[
        'direct_implementation'
      ].setValidators([Validators.required]); //clear validation
      this.general_information_form.controls['direct_implementation'].setErrors(
        { required: true }
      ); //error message
      this.general_information_form.controls[
        'direct_implementation'
      ].updateValueAndValidity(); //update validation
      this.pillar_pqg_meo_mandatory_flag = false;
      this.strategic_objective_pqg_meo_mandatory_flag = false;
      this.general_information_form.controls[
        'pillar_pqg_meo'
      ].clearValidators(); //setting validation
      this.general_information_form.controls['pillar_pqg_meo'].setErrors({
        required: false,
      }); //error message
      this.general_information_form.controls[
        'pillar_pqg_meo'
      ].updateValueAndValidity(); //update validation
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].clearValidators(); //setting validation
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].setErrors({ required: false }); //error message
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].updateValueAndValidity(); //update validation

      this.general_information_form.controls.pillar_pqg_meo.enable();
      if (this.general_information_form.controls['pillar_pqg_meo'].value != '')
        this.general_information_form.controls[
          'strategic_objective_pqg_meo'
        ].enable();
      this.commitment_form.controls.meo_resource_source.reset();
      if (this.EditId == null || this.viewMoreId != null)
        this.commitment_form.controls.meo_resource_source.disable();

      // var tableDataLength = (this.commitment_form.get('tableData') as FormArray).length;
    }
    if (
      this.general_information_form.controls.state_budget.value == '' ||
      this.general_information_form.controls.state_budget.value == null ||
      this.general_information_form.controls.state_budget.value == undefined
    ) {
      this.onBudget = false;
      this.treasury_single_account_mandatory_flag = false;
      this.direct_implementation_mandatory_flag = false;
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.direct_implementation.disable();
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.treasury_single_account.disable();
      this.general_information_form.controls[
        'direct_implementation'
      ].clearValidators(); //clear validation
      this.general_information_form.controls['direct_implementation'].setErrors(
        { required: true }
      ); //error message
      this.general_information_form.controls[
        'direct_implementation'
      ].updateValueAndValidity(); //update validation
      this.general_information_form.controls[
        'treasury_single_account'
      ].clearValidators(); //clear validation
      this.general_information_form.controls[
        'treasury_single_account'
      ].setErrors({ required: true }); //error message
      this.general_information_form.controls[
        'treasury_single_account'
      ].updateValueAndValidity(); //update validation
      this.pillar_pqg_meo_mandatory_flag = false;
      this.strategic_objective_pqg_meo_mandatory_flag = false;
      this.general_information_form.controls[
        'pillar_pqg_meo'
      ].clearValidators(); //setting validation
      this.general_information_form.controls['pillar_pqg_meo'].setErrors({
        required: true,
      }); //error message
      this.general_information_form.controls[
        'pillar_pqg_meo'
      ].updateValueAndValidity(); //update validation
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].clearValidators(); //setting validation
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].setErrors({ required: true }); //error message
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].updateValueAndValidity(); //update validation

      this.general_information_form.controls.pillar_pqg_meo.enable();
      if (this.general_information_form.controls['pillar_pqg_meo'].value != '')
        this.general_information_form.controls[
          'strategic_objective_pqg_meo'
        ].enable();
      this.commitment_form.controls.meo_resource_source.reset();
      if (this.EditId == null || this.viewMoreId != null)
        this.commitment_form.controls.meo_resource_source.disable();
    }
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray);
    if (commitmentDataArr.length > 0) {
      for (let i = 0; i < commitmentDataArr.length; i++) {
        this.addAmountInNationalBudget(i);
      }
    }
  }
  fundingOrgNm:string;
  getFundingOrgNm(event: MatSelectChange){
    this.fundingOrgNm=event.source.triggerValue;
    console.log("this.fundingOrgNm ",this.fundingOrgNm);
  }
  validateOnChange() {
    
    this.auto_save_as_draft_flag = true;
    if (this.general_information_form.value.financing_situatuion == 1) {
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls['date_of_signature'].disable();
      this.pickerDisable_flag_date_of_signature = true;
      this.responsible_organization_mandatory_flag = false;
      this.general_information_form.controls.responsible_organization.clearValidators();
      this.general_information_form.controls.responsible_organization.updateValueAndValidity(); //update validation
    } else {
      this.general_information_form.controls['date_of_signature'].enable();
      this.pickerDisable_flag_date_of_signature = false;
      this.responsible_organization_mandatory_flag = true;
      this.general_information_form.controls.responsible_organization.setValidators(Validators.required);
      this.general_information_form.controls.responsible_organization.setErrors({
        required: true
      });
      this.general_information_form.controls.responsible_organization.updateValueAndValidity(); //update validation
      this.general_information_form.controls.direct_implementation.updateValueAndValidity();//update validation for direct implementation
    }

    if ((this.EditId == null && this.viewMoreId == null && this.viewDraftedFaId == null) && this.general_information_form.value.donor != '') {
      this.general_information_form.controls.responsible_organization.enable();
      this.general_information_form.controls['funding_organization'].enable();

    }
    else {
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.funding_organization.disable();
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.responsible_organization.disable();
    }

    if (
      this.general_information_form.value.financing_situatuion != '' &&
      this.general_information_form.value.financing_situatuion != undefined
    ) {
      if (
        this.general_information_form.value.financing_situatuion == 3 ||
        this.general_information_form.value.financing_situatuion == 5 ||
        this.general_information_form.value.financing_situatuion == 6 ||
        this.general_information_form.value.financing_situatuion == 7
      ) {
        this.start_and_end_date_mandatory_flag = true;

        this.general_information_form.controls['start_date'].enable();
        this.general_information_form.controls['end_date'].enable();
        this.general_information_form.controls['start_date'].setValidators([
          Validators.required,
        ]); //setting validation
        this.general_information_form.controls['start_date'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'start_date'
        ].updateValueAndValidity(); //update validation
        this.general_information_form.controls['end_date'].setValidators([
          Validators.required,
        ]); //setting validation
        this.general_information_form.controls['end_date'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'end_date'
        ].updateValueAndValidity(); //update validation
      } else {
        this.start_and_end_date_mandatory_flag = false;
        this.general_information_form.controls['end_date'].clearValidators();//clear validation
        this.general_information_form.controls['end_date'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'end_date'
        ].updateValueAndValidity(); //update validation
        this.general_information_form.controls['start_date'].clearValidators();//clear validation
        this.general_information_form.controls['start_date'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'start_date'
        ].updateValueAndValidity(); //update validation
      }
      if (this.EditId != null) {
        if (this.general_information_form.value.financing_situatuion == 3) {
          // this.start_and_end_date_mandatory_flag = true;
          this.donor_and_funding_organization_mandatory_flag = false;

          this.general_information_form.controls['donor'].clearValidators();//clear validation
          this.general_information_form.controls['donor'].setErrors({
            required: true,
          }); //error message
          this.general_information_form.controls[
            'donor'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls['funding_organization'].clearValidators();//clear validation
          this.general_information_form.controls[
            'funding_organization'
          ].setErrors({ required: true }); //error message
          this.general_information_form.controls[
            'funding_organization'
          ].updateValueAndValidity(); //update validation
          // this.general_information_form.controls.type_of_implementation.disable();
          if (this.EditId == null || this.viewMoreId != null)
            this.general_information_form.controls.donor.disable();
          if (this.EditId == null || this.viewMoreId != null)
            this.general_information_form.controls.funding_organization.disable();
          this.pickerDisable_flag = false;
        } else {
          this.donor_and_funding_organization_mandatory_flag = true;
          this.pickerDisable_flag = false;
          this.general_information_form.controls['donor'].setValidators([
            Validators.required,
          ]); //setting validation
          this.general_information_form.controls['donor'].setErrors({
            required: true,
          }); //error message
          this.general_information_form.controls[
            'donor'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls[
            'funding_organization'
          ].setValidators([Validators.required]); //setting validation
          this.general_information_form.controls[
            'funding_organization'
          ].setErrors({ required: true }); //error message
          this.general_information_form.controls[
            'funding_organization'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls['donor'].enable();
          this.general_information_form.controls['funding_organization'].enable();
        }
      } else if (this.EditId == null) {
        if (this.general_information_form.value.financing_situatuion == 3) {
          // this.start_and_end_date_mandatory_flag = true;
          this.donor_and_funding_organization_mandatory_flag = false;

          this.general_information_form.controls['donor'].clearValidators();//clear validation
          this.general_information_form.controls['donor'].setErrors({
            required: true,
          }); //error message
          this.general_information_form.controls[
            'donor'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls['funding_organization'].clearValidators();//clear validation
          this.general_information_form.controls[
            'funding_organization'
          ].setErrors({ required: true }); //error message
          this.general_information_form.controls[
            'funding_organization'
          ].updateValueAndValidity(); //update validation
          // this.general_information_form.controls.type_of_implementation.disable();
          this.general_information_form.controls['donor'].enable();
          this.general_information_form.controls['funding_organization'].enable();
          this.pickerDisable_flag = false;
        } else {
          this.donor_and_funding_organization_mandatory_flag = true;
          this.pickerDisable_flag = false;
          this.general_information_form.controls['donor'].setValidators([
            Validators.required,
          ]); //setting validation
          this.general_information_form.controls['donor'].setErrors({
            required: true,
          }); //error message
          this.general_information_form.controls[
            'donor'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls[
            'funding_organization'
          ].setValidators([Validators.required]); //setting validation
          this.general_information_form.controls[
            'funding_organization'
          ].setErrors({ required: true }); //error message
          this.general_information_form.controls[
            'funding_organization'
          ].updateValueAndValidity(); //update validation
          this.general_information_form.controls['donor'].enable();
          this.general_information_form.controls['funding_organization'].enable();
        }
      }

      if (
        this.general_information_form.value.financing_situatuion == 2 ||
        this.general_information_form.value.financing_situatuion == 3 ||
        this.general_information_form.value.financing_situatuion == 4 ||
        this.general_information_form.value.financing_situatuion == 5 ||
        this.general_information_form.value.financing_situatuion == 6 ||
        this.general_information_form.value.financing_situatuion == 7
      ) {

        this.date_of_signature_mandatory_flag = true;
        this.general_information_form.controls[
          'date_of_signature'
        ].setValidators([Validators.required]); //setting validation
        this.general_information_form.controls['date_of_signature'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'date_of_signature'
        ].updateValueAndValidity(); //update validation
      } else {
        this.date_of_signature_mandatory_flag = false;
        this.general_information_form.controls[
          'date_of_signature'
        ].clearValidators(); //clear validation
        this.general_information_form.controls['date_of_signature'].setErrors({
          required: true,
        }); //error message
        this.general_information_form.controls[
          'date_of_signature'
        ].updateValueAndValidity(); //update validation
      }
    }

    if (
      this.general_information_form.value.financing_situatuion == 2 ||
      this.general_information_form.value.financing_situatuion == 3
    ) {
      this.amount_allocated_in_financing_agreement_mandatory_flag = true;
    } else {
      this.amount_allocated_in_financing_agreement_mandatory_flag = true;
      this.allocation_form.controls[
        'amount_allocated_in_financing_agreement'
      ].enable();
      this.allocation_form.controls[
        'amount_allocated_in_financing_agreement'
      ].setValidators([Validators.required, Validators.min(0)]); //setting validation
      this.allocation_form.controls[
        'amount_allocated_in_financing_agreement'
      ].setErrors({ required: true }); //error message
      this.allocation_form.controls[
        'amount_allocated_in_financing_agreement'
      ].updateValueAndValidity(); //update validation
    }

    this.typeOfAidDacCrsBusinessRule();

    var date_of_signature =
      this.general_information_form.controls.date_of_signature;
    var start_date = this.general_information_form.controls.start_date;
    var end_date = this.general_information_form.controls.end_date;
    this.getValueByLang();
    if ((date_of_signature.value != '' && date_of_signature.value != null) && (start_date.value != '' && start_date.value != null)) {
      if (date_of_signature.value > start_date.value) {
        if (this.browserLang == 'en') {
          Swal.fire(
            'Date of Signature should not be greater than Start Date',
            '',
            'error'
          );
        } else {
          Swal.fire(
            'A Data de Assinatura não deve ser maior do que a Data de Início',
            '',
            'error'
          );
        }

        date_of_signature.patchValue('');
      }
    }
    if ((start_date.value != '' && start_date.value != null) && (end_date.value != '' && end_date.value != null)) {
      if (start_date.value > end_date.value) {
        if (this.browserLang == 'en') {
          Swal.fire(
            'Start Date should not be greater than End Date',
            '',
            'error'
          );
        } else {
          Swal.fire(
            'A data de início não deve ser posterior à data de término',
            '',
            'error'
          );
        }

        start_date.patchValue('');
      }
    }
    if ((date_of_signature.value != '' && date_of_signature.value != null) && (end_date.value != '' && end_date.value != null)) {
      if (date_of_signature.value > end_date.value) {
        if (this.browserLang == 'en') {
          Swal.fire(
            'Date of Signature should not be greater than End Date',
            '',
            'error'
          );
        } else {
          Swal.fire(
            'A data de assinatura não deve ser posterior à data de término',
            '',
            'error'
          );
        }
        date_of_signature.patchValue('');
      }
    }

    if (this.general_information_form.controls['pillar_pqg_meo'].value == "") {
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls['strategic_objective_pqg_meo'].disable();
    } else {
      this.general_information_form.controls['strategic_objective_pqg_meo'].enable();
    }
    if (
      this.general_information_form.valid ||
      this.general_information_form.status == 'DISABLED'
    ) {
      this.allocation_flag = true;
    } else {
      this.allocation_flag = false;
      this.location_flag = false;
      this.commitments_flag = false;
      this.disbursement_flag = false;
      this.payments_flag = false;
    }

    if (this.allocation_flag === true) {
      let alocatedAmount = this.allocation_form.controls.amount_allocated_in_financing_agreement.value;
      let currency = this.allocation_form.controls.currency_of_the_financing_agreement.value;
      let exchangeRateMzn = this.allocation_form.controls.exchange_rates_in_usd.value;
      let exchangeRateUsd = this.allocation_form.controls.exchange_rates_in_mzn.value;
      let alocatedAmountMzn = this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value;
      let alocatedAmountUsd = this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.value;
      let typeOfFinance = this.allocation_form.controls.type_of_finance.value;


      if ((alocatedAmount != null && alocatedAmount != undefined && alocatedAmount != '')
        && (currency != null && currency != undefined && currency != '')
        && (exchangeRateMzn != null && exchangeRateMzn != undefined && exchangeRateMzn != '')
        && (exchangeRateUsd != null && exchangeRateUsd != undefined && exchangeRateUsd != '')
        && (alocatedAmountMzn != null && alocatedAmountMzn != undefined && alocatedAmountMzn != '')
        && (alocatedAmountUsd != null && alocatedAmountUsd != undefined && alocatedAmountUsd != '')
        && (typeOfFinance != null && typeOfFinance != undefined && typeOfFinance != '')
      ) {
        this.commitments_flag = true;
      }
      // if (
      //   this.validateAllocation() ||
      //   this.allocation_form.status == 'DISABLED'
      // ) {
      //   this.commitments_flag = true;
      // }
      else {
        this.location_flag = false;
        this.commitments_flag = false;
        this.disbursement_flag = false;
        this.payments_flag = false;
      }
    }
    // if(this.location_flag == true )
    // {
    //   if(this.locationForm.valid || this.locationForm.status=="DISABLED")
    //   {
    //     this.commitments_flag = true;
    //   }else
    //   {
    //     this.commitments_flag = false;
    //     this.disbursement_flag = false;
    //     this.payments_flag = false;
    //   }
    // }
    // if (this.commitments_flag === true) {
    //   if (
    //     this.commitment_form.valid ||
    //     this.commitment_form.status == 'DISABLED'
    //   ) {
    //     this.disbursement_flag = true;
    //     this.payments_flag = true;
    //     this.location_flag = true;
    //   } else {
    //     this.disbursement_flag = false;
    //     this.payments_flag = false;
    //     this.location_flag = false;
    //   }
    // }
  }

  resetPillars() {
    if (this.general_information_form.controls['state_budget'].value == '2') {
      this.general_information_form.controls['pillar_pqg_meo'].patchValue('');
      this.general_information_form.controls[
        'strategic_objective_pqg_meo'
      ].patchValue('');
      this.general_information_form.controls.pillar_pqg_meo.enable();
      if (this.EditId == null || this.viewMoreId != null)
        this.general_information_form.controls.strategic_objective_pqg_meo.disable();
      if (this.general_information_form.controls['pillar_pqg_meo'].value !== '')
        this.general_information_form.controls[
          'strategic_objective_pqg_meo'
        ].enable();
    }
  }

  validateGeneralInformation() {
    // this.nextStep();
    // this.location_flag=true;
    if (
      this.general_information_form.valid ||
      this.general_information_form.status == 'DISABLED'
    ) {
      this.allocation_flag = true;
      this.nextStep();
    } else {
      this.allocation_flag = false;
      this.location_flag = false;
      this.commitments_flag = false;
      this.disbursement_flag = false;
      this.payments_flag = false;
    }
  }
  validateAllocation(): boolean {
    // this.nextStep();
    this.getValueByLang()
    // this.commitments_flag=true;
    let alocatedAmount = this.allocation_form.controls.amount_allocated_in_financing_agreement.value;
    let currency = this.allocation_form.controls.currency_of_the_financing_agreement.value;
    let exchangeRateMzn = this.allocation_form.controls.exchange_rates_in_usd.value;
    let exchangeRateUsd = this.allocation_form.controls.exchange_rates_in_mzn.value;
    let alocatedAmountMzn = this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value;
    let alocatedAmountUsd = this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.value;
    let typeOfFinance = this.allocation_form.controls.type_of_finance.value;
    // if (
    //   this.allocation_form.valid ||
    //   this.allocation_form.status == 'DISABLED'
    // ) {
    //   this.commitments_flag = true;
    //   // this.disbursement_flag = true;
    //   // this.payments_flag = true;
    //   // this.location_flag = true;
    //   this.nextStep();
    // }

    if ((alocatedAmount != null && alocatedAmount != undefined && alocatedAmount != '')
      && (currency != null && currency != undefined && currency != '')
      && (exchangeRateMzn != null && exchangeRateMzn != undefined && exchangeRateMzn != '')
      && (exchangeRateUsd != null && exchangeRateUsd != undefined && exchangeRateUsd != '')
      && (alocatedAmountMzn != null && alocatedAmountMzn != undefined && alocatedAmountMzn != '')
      && (alocatedAmountUsd != null && alocatedAmountUsd != undefined && alocatedAmountUsd != '')
      && (typeOfFinance != null && typeOfFinance != undefined && typeOfFinance != '')
    ) {
      this.commitments_flag = true;
      this.nextStep();
    }
    else {
      if (this.browserLang == 'en')
        Swal.fire('Incomplete Data', 'Please select a currency with exchange rate and fill all mandatory fileds', 'info')
      else
        Swal.fire('Dados Incompletos', 'Por favor seleccione uma moeda com taxa de câmbio e preencha todos os campos obrigatórios', 'info')
      this.commitments_flag = false;
      this.disbursement_flag = false;
      this.payments_flag = false;
      this.location_flag = false;
    }
    return this.commitments_flag;
  }
  validateCommitment() {
    // this.nextStep();
    // this.disbursement_flag = true;
    if (this.financialAgreementId == null) {
      this.addFinancialAgreement();
    }
    else if (this.financialAgreementId != null && this.financialAgreementId > 0) {
      this.updateFinancialAgreement();
    }
  }
  validateCommitmentForViewMore() {
    if (
      this.commitment_form.valid ||
      this.commitment_form.status == 'DISABLED'
    ) {
      this.disbursement_flag = true;
      this.payments_flag = true;
      this.location_flag = true;
      this.nextStep();
    } else {
      this.disbursement_flag = false;
      this.payments_flag = false;
      this.location_flag = false;
    }
  }
  validateDisbursement() {
    // if (
    //   this.disbursement_form.valid ||
    //   this.disbursement_form.status == 'DISABLED'
    // ) {
    this.payments_flag = true;
    this.nextStep();
    // } else {
    //   this.payments_flag = false;
    //   this.location_flag = false;
    // }
    // this.payments_flag = true;
    // this.nextStep();
  }
  validatePayment() {
    // if (this.payment_form.valid || this.payment_form.status == 'DISABLED') {
    this.location_flag = true;
    this.nextStep();
    // } else {
    //   this.location_flag = false;
    // }
  }
  validateLocation() {
    this.nextStep();
    // this.nextStep();
    // this.allocation_flag = true;
    // if(this.locationForm.valid || this.locationForm.status=="DISABLED")
    // {
    //   this.commitments_flag=true;
    //   this.nextStep();
    // }
    // else {
    //   this.commitments_flag = false;
    //   this.disbursement_flag = false;
    //   this.payments_flag = false;
    // }
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Create Financial Agreement') {
        this.authorised_flag = true;
      }
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);
    localStorage.setItem('dataKey', 'Donor');
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['organization']);
    });
  }
  moveToSelectedTab(tabName: string) {
    for (
      var i = 0;
      i < document.querySelectorAll('.mat-tab-label-content').length;
      i++
    ) {
      if (
        (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
          .innerText == tabName
      ) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  viewMoreDisbursement(disbursement_id: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-disbursement', disbursement_id]));
  }
  openDialogDisbursement(disbursement_id: any) {
    localStorage.setItem("disbursementId_vm", disbursement_id);
    const dialogRef = this.dialog.open(ViewTableModalDisbursmentComponent, {
      disableClose: true,
    });
  }
  opensweetalertDeleteDisbursement(disbursement_id: any) {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.disbursementCrud.deleteById(disbursement_id).subscribe(data => {
          this.disbursementDetails = data;
          this.findTotalAmountDisburse();
          /* Add data in MatTableDataSource */
          this.disbursementdataSource.data = this.disbursementDetails;
          this.totalDisbursementRows = this.disbursementDetails.length;
          this.totalDisbursementAmntUsd = 0;
          this.totalDisbursementAmntMzn = 0;
          this.totalDisbursementAmnt = 0;
          /* The below loop is for to find all total amount summation */
          /*Hi*/
          for (let i = 0; i < this.disbursementdataSource.filteredData.length; i++) {
            if (this.disbursementdataSource.filteredData[i].disbursementAmountMZN != null) {
              this.disbursementAmountValueMZN = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountMZN.replaceAll(",", ""));
              this.totalDisbursementAmntMzn = this.totalDisbursementAmntMzn + this.disbursementAmountValueMZN;
            } else {
              this.totalDisbursementAmntMzn = this.totalDisbursementAmntMzn + 0;


            }
            if (this.disbursementdataSource.filteredData[i].disbursementAmountUSD != null) {
              this.disbursementAmountValueUSD = Number.parseFloat(this.disbursementdataSource.filteredData[i].disbursementAmountUSD.replaceAll(",", ""));
              this.totalDisbursementAmntUsd = this.totalDisbursementAmntUsd + this.disbursementAmountValueUSD;
            }
            else {
              this.totalDisbursementAmntUsd = this.totalDisbursementAmntUsd + 0;
            }
            if (this.disbursementdataSource.filteredData[i].amount != null) {
              this.disbursementAmountValue = Number.parseFloat(this.disbursementdataSource.filteredData[i].amount.replaceAll(",", ""));
              this.totalDisbursementAmnt = this.totalDisbursementAmnt + this.disbursementAmountValue;
            }
            else {
              this.totalDisbursementAmnt = this.totalDisbursementAmnt + 0;
            }
          }

        },
          error => console.log(error));
        // this.deleteDisbursement(disbursement_id);
        this.saveDisbursementDeleteAlert();
        if (this.browserLang == 'en')
          Swal.fire('Deleted successfully', '', 'success')
        else
          Swal.fire('Apagado com sucesso', '', 'success')

      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  saveDisbursementDeleteAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();
    notificationDetails.notificationGroup = this.usergroup;
    notificationDetails.updatedBy = this.userName;
    notificationDetails.notificationMsg = this.userName + " has delete disbursement on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    });
  }
  moveToEdit() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-funding', this.viewMoreId]));
  }

  moveToFundingTab() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        if (this.viewDraftedFaId != null)
          this.router.navigate(['/admin/view-drafted-financialAgreement']);
        else
          this.router.navigate(['/admin/view-funding']);
      });
  }
  openMandatoryAlert() {
    this.getValueByLang()
    $(".checkValidation").trigger("click");
    if (this.browserLang == 'en')
      Swal.fire('Please fill all mandatory fields.');
    else
      Swal.fire('Por favor preencha todos os campos obrigatórios.');
  }
  opensweetalert() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Submit?' : 'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Submit` : 'Submeter',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancel',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.addFinancialAgreementLocation()
      } else if (result.isDenied) {
        // Swal.fire('Cancelled', '', 'info');
      }
    });
  }
  opensweetalertUpdate() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Update?' : 'Você deseja atualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Update` : 'Actualizar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancel',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.addFinancialAgreementLocation();
      }
    });
  }

  updateFinancialAgreement() {
    this.getValueByLang();
    let general_information_form = this.general_information_form.getRawValue();
    let allocation_form = this.allocation_form.getRawValue();
    let commitment_form = this.commitment_form.getRawValue();
    let location_form = this.locationForm.getRawValue();

    let general_information_form_data: FinancialAgreement =
      new FinancialAgreement();
    general_information_form_data.language = this.browserLang;
    let commitment_form_data_arr: any[] = commitment_form.tableData;
    let finaljson = {};
    general_information_form_data.financialAgreementId = this.financialAgreementId;
    general_information_form_data.donor_funding_title =
      general_information_form.funding_donor_title;
    general_information_form_data.reference_for_financing_donor =
      general_information_form.donor_funding_reference;
    general_information_form_data.financing_situation =
      general_information_form.financing_situatuion;
    general_information_form_data.budgetId = general_information_form.budgetSupportOptions;
    general_information_form_data.donor = general_information_form.donor;
    general_information_form_data.fundingOrganization = general_information_form.funding_organization;
    general_information_form_data.type_of_aid =
      general_information_form.type_of_aid;
    general_information_form_data.responsibleOrganization = general_information_form.responsible_organization;
    general_information_form_data.signature_date =
      general_information_form.date_of_signature;
    general_information_form_data.start_date =
      general_information_form.start_date;
    general_information_form_data.end_date = general_information_form.end_date;
    general_information_form_data.enter_as =
      general_information_form.come_in_like;
    // general_information_form_data.implementation_type =
    //   general_information_form.type_of_implementation;
    general_information_form_data.implementation_type =
      general_information_form.type_of_implementation;
      (general_information_form_data.implementation_type=="")?general_information_form_data.implementation_type=null:general_information_form_data.implementation_type=general_information_form_data.implementation_type;
    general_information_form_data.state_budget =
      general_information_form.state_budget;
    general_information_form_data.single_treasury_account =
      general_information_form.treasury_single_account;
    general_information_form_data.direct_implementation =
      general_information_form.direct_implementation;
    general_information_form_data.pqg_meo_pillar =
      general_information_form.pillar_pqg_meo;
    general_information_form_data.pqg_meo_strategic_objective =
      general_information_form.strategic_objective_pqg_meo;

    if (this.commentsData.length > 0) {
      this.commentsData.forEach(comment => {
        general_information_form_data.comments.push(comment)
      });
    }
    // general_information_form_data.snip_marker = general_information_form.snip_marker;
    if (allocation_form.amount_allocated_in_financing_agreement != null && allocation_form.amount_allocated_in_financing_agreement != '') {
      general_information_form_data.amt_local_currency_agreement = (
        allocation_form.amount_allocated_in_financing_agreement as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (this.currenyList.length > 0) {
      if (allocation_form.currency_of_the_financing_agreement != null && allocation_form.currency_of_the_financing_agreement != undefined
        && allocation_form.currency_of_the_financing_agreement != '') {
        general_information_form_data.allocatedCurrencyName = allocation_form.currency_of_the_financing_agreement;
        general_information_form_data.financing_agreement_currency =
          this.currenyList.find(x => allocation_form.currency_of_the_financing_agreement == x.currency_shortname).currency_id;
      }
    }
    general_information_form_data.type_of_financing_daccrs =
      allocation_form.type_of_finance;
    general_information_form_data.meo_resource_source =
      commitment_form.meo_resource_source;
    if (allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != null && allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != '') {
      general_information_form_data.amt_mzn = (
        allocation_form.amount_allocated_from_the_financing_agreement_in_meticais as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (allocation_form.amount_allocated_from_financing_agreement_in_usd != null && allocation_form.amount_allocated_from_financing_agreement_in_usd != '') {
      general_information_form_data.amt_usd = (
        allocation_form.amount_allocated_from_financing_agreement_in_usd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentMzn != null && allocation_form.grantEquivalentMzn != '') {
      general_information_form_data.amt_grant_equivalent_mzn = (
        allocation_form.grantEquivalentMzn as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentUsd != null && allocation_form.grantEquivalentUsd != '') {
      general_information_form_data.amt_grant_equivalent_usd = (
        allocation_form.grantEquivalentUsd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.envelopeReference != null && allocation_form.envelopeReference != "") {
      general_information_form_data.envelopeReference = allocation_form.envelopeReference;
    }
    if (commitment_form_data_arr.length > 0) {
      commitment_form_data_arr.forEach((element) => {
        if (element.amounts_of_annual_commitments_agreement_currency != null && element.amounts_of_annual_commitments_agreement_currency != "") {
          element.amounts_of_annual_commitments_agreement_currency = (
            element.amounts_of_annual_commitments_agreement_currency as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_meticais != null && element.amounts_of_annual_commitments_in_meticais != "") {
          element.amounts_of_annual_commitments_in_meticais = (
            element.amounts_of_annual_commitments_in_meticais as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_usd != null && element.amounts_of_annual_commitments_in_usd != "") {
          element.amounts_of_annual_commitments_in_usd = (
            element.amounts_of_annual_commitments_in_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_mzn != null && element.amount_committed_in_nationalBudget_mzn != "N/A") {
          element.amount_committed_in_nationalBudget_mzn = (
            element.amount_committed_in_nationalBudget_mzn as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_usd != null && element.amount_committed_in_nationalBudget_usd != "N/A") {
          element.amount_committed_in_nationalBudget_usd = (
            element.amount_committed_in_nationalBudget_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
      });
    }

    let faResourceSource = {
      pillarPqgMasterId: general_information_form.pillar_pqg_meo,
      strategicObjectivePqgMasterId: general_information_form.strategic_objective_pqg_meo,
      mpoResourceCode: commitment_form.meo_resource_source,
    };
    //   let geoArr = [];
    // let provinces = [];
    // let districts = [];
    // this.locationTD.forEach(element => {
    //   let geoObj:LocationData = {
    //     geographicalReference:element.geographicalReference,
    //     iatiLocation:element.iatiLocation,
    //     iatiAccuracy:element.iatiAccuracy,
    //     coordinates:element.coordinates,
    //     geolocationComments: element.geolocationComments
    //   }
    //   geoArr.push(geoObj);
    // })
    // location_form.provinces.forEach(province => {
    //   let obj = {
    //     provinceMasterId:province
    //   }
    //   provinces.push(obj);
    // })
    // if(location_form.districts!=""){
    //   location_form.districts.forEach(district => {
    //     let obj = {
    //       districtMasterId:district
    //     }
    //     districts.push(obj);
    //   })
    // }

    this.addKeyValue(
      finaljson,
      'financial_agreement',
      general_information_form_data
    );

    this.addKeyValue(finaljson, 'commitment', commitment_form_data_arr);
    this.addKeyValue(
      finaljson,
      'faResourceSource',
      faResourceSource
    );

    //   this.addKeyValue(
    //   finaljson,
    //   'faLocation',
    //   geoArr
    // );
    // this.addKeyValue(
    //   finaljson,
    //   'faProvinces',
    //   provinces
    // );
    // this.addKeyValue(
    //   finaljson,
    //   'faDistricts',
    //   districts
    // );

    let response: any;
    this.getValueByLang()
    this.addKeyValue(
      finaljson,
      'language',
      this.browserLang
    );
      this.financingService.updateFinancialAgreement(finaljson).subscribe(data => {
        response = JSON.parse(data);
        this.auto_save_as_draft_flag=false;

      if (response.status == 200) {
        this.financialAgreementId = response.financialAgreementId;
        this.disbursement_flag = true;
        this.payments_flag = true;
        this.location_flag = true;
        this.nextStep();
        //add save funding notification service
        // if(this.EditId!=null){
        //   this.updateFundingAlert(response.responseMessage);
        // }
      } else if (response.status != 200) {
        if (this.browserLang == 'en')
          Swal.fire(response.responseMessage)
        else
          Swal.fire(response.responseMessagePt)
      }
    });

  }

  date = new Date() + '';
  todayDateTime = this.date.substring(0, 24);
  userName = this.loggedInUserfullName;
  commentHeaders = ['Comments'];
  // addCommentRowEdit(){
  //   if(this.EditId!=null || this.viewMoreId!=null || this.viewDraftedFaId!=null) {
  //     (this.general_information_form.controls.tableFundingComments as FormArray).clear();
  //     let length = this.editResponse.faComments.length;
  //     if(length>0){
  //       for(let i=0;i<length;i++){
  //         let row1 = this.fb.group({
  //           comments: [this.editResponse.faComments[i].comment],
  //         });
  //         (
  //           this.general_information_form.get('tableFundingComments') as FormArray
  //         ).push(row1);
  //       }
  //     }else{
  //       this.addCommentRow()
  //     }
  //   }
  // }

  addCommentRow() {
    this.getValueByLang()
    let length: number = (this.general_information_form.controls.tableFundingComments as FormArray).length;

    let tableData = null;
    if (length > 0) {
      tableData = ((this.general_information_form.controls.tableFundingComments as FormArray).at(length - 1) as FormControl).value;

      if (tableData.comments.trim() == "") {
        if (this.browserLang == 'en')
          Swal.fire("Enter a Comment before adding another one", "", "info");
        else
          Swal.fire("Insira um Comentário antes de adicionar outro", "", "info");
        return;
      }
      const row = this.fb.group({
        comments: [''],
      });
      (
        this.general_information_form.get('tableFundingComments') as FormArray
      ).push(row);
    } else if (length == 0) {
      const row = this.fb.group({
        comments: [''],
      });
      (
        this.general_information_form.get('tableFundingComments') as FormArray
      ).push(row);
    }
    length = (this.general_information_form.controls.tableFundingComments as FormArray).length;
    if (length > 0)
      this.generateCommentsData(length - 1);

    this.permissionDeleteComment[length - 1] = true;
  }
  deleteCommentsRow(j) {
    this.getValueByLang()
    let length = ((this.general_information_form.controls.tableFundingComments as FormArray).length);
    if (length == 1) {
      if (this.browserLang == 'en')
        Swal.fire("Cannot delete this field", "", "info");
      else
        Swal.fire("Não é possível apagar este campo", "", "info");
      return;
    }
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        (
          this.general_information_form.get('tableFundingComments') as FormArray
        ).removeAt(j);
        this.commentsData.splice(j, 1);
        this.permissionDeleteComment.splice(j, 1);
      } else if (result.isDenied) {
      }
    });
  }
  financialAgreementId: number = null;
  private addFinancialAgreementLocation() {
    // let location_form = this.locationForm.getRawValue();

    // let general_information_form_data: FinancialAgreement =
    //   new FinancialAgreement();
    // let finaljson = {};
    // general_information_form_data.financialAgreementId = this.financialAgreementId;

    let general_information_form = this.general_information_form.getRawValue();
    let allocation_form = this.allocation_form.getRawValue();
    let commitment_form = this.commitment_form.getRawValue();
    let location_form = this.locationForm.getRawValue();

    let general_information_form_data: FinancialAgreement =
      new FinancialAgreement();
    let commitment_form_data_arr: any[] = commitment_form.tableData;
    let finaljson = {};
    general_information_form_data.financialAgreementId = general_information_form.financialAgreementId;
    general_information_form_data.donor_funding_title =
      general_information_form.funding_donor_title;
    general_information_form_data.reference_for_financing_donor =
      general_information_form.donor_funding_reference;
    general_information_form_data.financing_situation =
      general_information_form.financing_situatuion;
    general_information_form_data.budgetId = general_information_form.budgetSupportOptions;
    general_information_form_data.donor = general_information_form.donor;
    general_information_form_data.fundingOrganization = general_information_form.funding_organization;
    general_information_form_data.type_of_aid =
      general_information_form.type_of_aid;
    general_information_form_data.responsibleOrganization = general_information_form.responsible_organization;
    general_information_form_data.signature_date =
      general_information_form.date_of_signature;
    general_information_form_data.start_date =
      general_information_form.start_date;
    general_information_form_data.end_date = general_information_form.end_date;
    general_information_form_data.enter_as =
      general_information_form.come_in_like;
    general_information_form_data.implementation_type =
      general_information_form.type_of_implementation;
      (general_information_form_data.implementation_type=="")?general_information_form_data.implementation_type=null:general_information_form_data.implementation_type=general_information_form_data.implementation_type;
    general_information_form_data.state_budget =
      general_information_form.state_budget;
    general_information_form_data.single_treasury_account =
      general_information_form.treasury_single_account;
    general_information_form_data.direct_implementation =
      general_information_form.direct_implementation;
    general_information_form_data.pqg_meo_pillar =
      general_information_form.pillar_pqg_meo;
    general_information_form_data.pqg_meo_strategic_objective =
      general_information_form.strategic_objective_pqg_meo;
    // general_information_form_data.snip_marker = general_information_form.snip_marker;
    // general_information_form.tableFundingComments.forEach(element => {
    //   general_information_form_data.comments.push(element.comments);
    // });
    if (this.commentsData.length > 0) {
      this.commentsData.forEach(comment => {
        general_information_form_data.comments.push(comment)
      });
    }
    if (allocation_form.amount_allocated_in_financing_agreement != null) {
      general_information_form_data.amt_local_currency_agreement = (
        allocation_form.amount_allocated_in_financing_agreement as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (this.currenyList.length > 0) {
      if (allocation_form.currency_of_the_financing_agreement != null && allocation_form.currency_of_the_financing_agreement != undefined
        && allocation_form.currency_of_the_financing_agreement != '') {
        general_information_form_data.allocatedCurrencyName = allocation_form.currency_of_the_financing_agreement;
        general_information_form_data.financing_agreement_currency =
          this.currenyList.find(x => allocation_form.currency_of_the_financing_agreement == x.currency_shortname).currency_id;
      }
    }
    general_information_form_data.type_of_financing_daccrs =
      allocation_form.type_of_finance;
    general_information_form_data.meo_resource_source =
      commitment_form.meo_resource_source;
    if (allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != null && allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != '') {
      general_information_form_data.amt_mzn = (
        allocation_form.amount_allocated_from_the_financing_agreement_in_meticais as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (allocation_form.amount_allocated_from_financing_agreement_in_usd != null && allocation_form.amount_allocated_from_financing_agreement_in_usd != '') {
      general_information_form_data.amt_usd = (
        allocation_form.amount_allocated_from_financing_agreement_in_usd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentMzn != null && allocation_form.grantEquivalentMzn != '') {
      general_information_form_data.amt_grant_equivalent_mzn = (
        allocation_form.grantEquivalentMzn as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentUsd != null && allocation_form.grantEquivalentUsd != '') {
      general_information_form_data.amt_grant_equivalent_usd = (
        allocation_form.grantEquivalentUsd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.envelopeReference != null && allocation_form.envelopeReference != "") {
      general_information_form_data.envelopeReference = allocation_form.envelopeReference;
    }

    if (commitment_form_data_arr.length > 0) {
      commitment_form_data_arr.forEach((element) => {
        if (element.amounts_of_annual_commitments_agreement_currency != null && element.amounts_of_annual_commitments_agreement_currency != "") {
          element.amounts_of_annual_commitments_agreement_currency = (
            element.amounts_of_annual_commitments_agreement_currency as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_meticais != null && element.amounts_of_annual_commitments_in_meticais != "") {
          element.amounts_of_annual_commitments_in_meticais = (
            element.amounts_of_annual_commitments_in_meticais as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_usd != null && element.amounts_of_annual_commitments_in_usd != "") {
          element.amounts_of_annual_commitments_in_usd = (
            element.amounts_of_annual_commitments_in_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_mzn != null && element.amount_committed_in_nationalBudget_mzn != "N/A") {
          element.amount_committed_in_nationalBudget_mzn = (
            element.amount_committed_in_nationalBudget_mzn as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_usd != null && element.amount_committed_in_nationalBudget_usd != "N/A") {
          element.amount_committed_in_nationalBudget_usd = (
            element.amount_committed_in_nationalBudget_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
      });
    }
    general_information_form_data.mpoProgrammaticCode =
    this.mpoProgrammaticCode;
    let faResourceSource = {
      // pillarPqgMasterId: general_information_form.pillar_pqg_meo,
      pillarPqgMasterId:null,
      strategicObjectivePqgMasterId: general_information_form.strategic_objective_pqg_meo,
      mpoResourceCode: commitment_form.meo_resource_source,
    };

    let geoArr = [];
    let provinces = [];
    let districts = [];
    if (this.locationTD.length > 0) {
      this.locationTD.forEach(element => {
        let geoObj: LocationData = {
          geographicalReference: element.geographicalReference,
          iatiLocation: element.iatiLocation,
          iatiAccuracy: element.iatiAccuracy,
          coordinates: element.coordinates,
          geolocationComments: element.geolocationComments
        }
        geoArr.push(geoObj);
      })
    }
    if (location_form.provinces.length > 0) {
      location_form.provinces.forEach(province => {
        let obj = {
          provinceMasterId: province
        }
        provinces.push(obj);
      })
    }

  if(location_form.districts!=null && location_form.districts!=""){
    location_form.districts.forEach(district => {
      let obj = {
        districtMasterId:district
      }
      districts.push(obj);
    })
  }
  this.getValueByLang();
  general_information_form_data.language=this.browserLang;
  this.addKeyValue(
    finaljson,
    'financial_agreement',
    general_information_form_data
  );
  this.addKeyValue(finaljson, 'commitment', commitment_form_data_arr);
  this.addKeyValue(
    finaljson,
    'faResourceSource',
    faResourceSource
  );
  this.addKeyValue(
    finaljson,
    'faLocation',
    geoArr
  );
  this.addKeyValue(
    finaljson,
    'faProvinces',
    provinces
  );
  this.addKeyValue(
    finaljson,
    'faDistricts',
    districts
  );
  this.addKeyValue(
    finaljson,
    'language',
    this.browserLang
  );
  let response: any;
  console.log("finalJson ",JSON.stringify(finaljson))
    this.financingService.createFinancialAgreementLocation(finaljson).subscribe(data => {
      response = JSON.parse(data);
      this.auto_save_as_draft_flag = false;
      if (response.status == 200) {
        this.financialAgreementId = response.financialAgreementId;
        //add save funding notification service
        // if(this.EditId!=null){
        //   this.updateFundingAlert(response.responseMessage);
        // }
        // else{
        this.saveFundingInsertAlert(response.responseMessage);
        this.saveFundingAsOnBudgetAlert();
        this.saveFundingAsOnCutOffCutAlert();
        // }
        // Swal.fire(response.responseMessage, '', 'success').then(() => {
        //   this.router.navigate(['/admin/view-funding']);
        // });
      } else if (response.status != 200) {
        if (this.browserLang == 'en')
          Swal.fire(response.responseMessage)
        else
          Swal.fire(response.responseMessagePt)
      }
    });



  }
  private addFinancialAgreement() {
    this.getValueByLang();
    let general_information_form = this.general_information_form.getRawValue();
    let allocation_form = this.allocation_form.getRawValue();
    let commitment_form = this.commitment_form.getRawValue();
    let location_form = this.locationForm.getRawValue();

    let general_information_form_data: FinancialAgreement =
      new FinancialAgreement();
    general_information_form_data.language = this.browserLang;
    let commitment_form_data_arr = commitment_form.tableData;
    let finaljson = {};
    general_information_form_data.financialAgreementId = general_information_form.financialAgreementId;
    general_information_form_data.donor_funding_title =
      general_information_form.funding_donor_title;
    general_information_form_data.reference_for_financing_donor =
      general_information_form.donor_funding_reference;
    general_information_form_data.financing_situation =
      general_information_form.financing_situatuion;
    general_information_form_data.budgetId = general_information_form.budgetSupportOptions;
    general_information_form_data.donor = general_information_form.donor;
    general_information_form_data.fundingOrganization = general_information_form.funding_organization;
    general_information_form_data.type_of_aid =
      general_information_form.type_of_aid;
    general_information_form_data.responsibleOrganization = general_information_form.responsible_organization;
    general_information_form_data.signature_date =
      general_information_form.date_of_signature;
    general_information_form_data.start_date =
      general_information_form.start_date;
    general_information_form_data.end_date = general_information_form.end_date;
    general_information_form_data.enter_as =
      general_information_form.come_in_like;
      
    // general_information_form_data.implementation_type =
    //   general_information_form.type_of_implementation;

    general_information_form_data.implementation_type =
      general_information_form.type_of_implementation;
      (general_information_form_data.implementation_type=="")?general_information_form_data.implementation_type=null:general_information_form_data.implementation_type=general_information_form_data.implementation_type;
    general_information_form_data.state_budget =
      general_information_form.state_budget;
    general_information_form_data.single_treasury_account =
      general_information_form.treasury_single_account;
    general_information_form_data.direct_implementation =
      general_information_form.direct_implementation;

    general_information_form_data.pqg_meo_pillar =
      general_information_form.pillar_pqg_meo;
    general_information_form_data.pqg_meo_strategic_objective =
      general_information_form.strategic_objective_pqg_meo;
    // general_information_form_data.snip_marker = general_information_form.snip_marker;
    if (allocation_form.amount_allocated_in_financing_agreement != null && allocation_form.amount_allocated_in_financing_agreement != '') {
      general_information_form_data.amt_local_currency_agreement = (
        allocation_form.amount_allocated_in_financing_agreement as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (this.currenyList.length > 0) {
      if (allocation_form.currency_of_the_financing_agreement != null && allocation_form.currency_of_the_financing_agreement != undefined
        && allocation_form.currency_of_the_financing_agreement != '') {
        general_information_form_data.allocatedCurrencyName = allocation_form.currency_of_the_financing_agreement;
        general_information_form_data.financing_agreement_currency =
          this.currenyList.find(x => allocation_form.currency_of_the_financing_agreement == x.currency_shortname).currency_id;
      }
    }
    general_information_form_data.type_of_financing_daccrs =
      allocation_form.type_of_finance;
    general_information_form_data.meo_resource_source =
      commitment_form.meo_resource_source;
      general_information_form_data.mpoProgrammaticCode =
      this.mpoProgrammaticCode;
    if (allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != null && allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != '') {
      general_information_form_data.amt_mzn = (
        allocation_form.amount_allocated_from_the_financing_agreement_in_meticais as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }

    if (allocation_form.amount_allocated_from_financing_agreement_in_usd != null && allocation_form.amount_allocated_from_financing_agreement_in_usd != '') {
      general_information_form_data.amt_usd = (
        allocation_form.amount_allocated_from_financing_agreement_in_usd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentMzn != null && allocation_form.grantEquivalentMzn != '') {
      general_information_form_data.amt_grant_equivalent_mzn = (
        allocation_form.grantEquivalentMzn as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentUsd != null && allocation_form.grantEquivalentUsd != '') {
      general_information_form_data.amt_grant_equivalent_usd = (
        allocation_form.grantEquivalentUsd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.envelopeReference != null && allocation_form.envelopeReference != "") {
      general_information_form_data.envelopeReference = allocation_form.envelopeReference;
    }

    if (commitment_form_data_arr.length > 0) {
      commitment_form_data_arr.forEach((element) => {
        if (element.amounts_of_annual_commitments_agreement_currency != null && element.amounts_of_annual_commitments_agreement_currency != "") {
          element.amounts_of_annual_commitments_agreement_currency = (
            element.amounts_of_annual_commitments_agreement_currency as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_meticais != null && element.amounts_of_annual_commitments_in_meticais != "") {
          element.amounts_of_annual_commitments_in_meticais = (
            element.amounts_of_annual_commitments_in_meticais as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amounts_of_annual_commitments_in_usd != null && element.amounts_of_annual_commitments_in_usd != "") {
          element.amounts_of_annual_commitments_in_usd = (
            element.amounts_of_annual_commitments_in_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_mzn != null && element.amount_committed_in_nationalBudget_mzn != "N/A") {
          element.amount_committed_in_nationalBudget_mzn = (
            element.amount_committed_in_nationalBudget_mzn as string
          ).replace(/[^0-9.]+/g, '');
        }
        if (element.amount_committed_in_nationalBudget_usd != null && element.amount_committed_in_nationalBudget_usd != "N/A") {
          element.amount_committed_in_nationalBudget_usd = (
            element.amount_committed_in_nationalBudget_usd as string
          ).replace(/[^0-9.]+/g, '');
        }
      });
    }
    // let geoArr = [];
    // let provinces = [];
    // let districts = [];
   

    let faResourceSource = {
      // pillarPqgMasterId: general_information_form.pillar_pqg_meo,
      pillarPqgMasterId:null,
      strategicObjectivePqgMasterId: general_information_form.strategic_objective_pqg_meo,
      mpoResourceCode: commitment_form.meo_resource_source,
    };

    // this.locationTD.forEach(element => {
    //   let geoObj = {
    //     geographicalReference:element.georef,
    //     iatiLocation:element.iatiLocation,
    //     iatiAccuracy:element.iatiAccuracy,
    //     latitude: element.latitude,
    //     longitude:element.longitude,
    //     geolocationComments: element.geoComments
    //   }
    //   geoArr.push(geoObj);
    // })
    // location_form.provinces.forEach(province => {
    //   let obj = {
    //     provinceMasterId:province
    //   }
    //   provinces.push(obj);
    // })
    // if(location_form.districts!=""){
    //   location_form.districts.forEach(district => {
    //     let obj = {
    //       districtMasterId:district
    //     }
    //     districts.push(obj);
    //   })
    // }

    this.addKeyValue(
      finaljson,
      'financial_agreement',
      general_information_form_data
    );

    this.addKeyValue(finaljson, 'commitment', commitment_form_data_arr);
    this.addKeyValue(
      finaljson,
      'faResourceSource',
      faResourceSource
    );
    // this.addKeyValue(
    //   finaljson,
    //   'faLocation',
    //   geoArr
    // );
    // this.addKeyValue(
    //   finaljson,
    //   'faProvinces',
    //   provinces
    // );
    // this.addKeyValue(
    //   finaljson,
    //   'faDistricts',
    //   districts
    // );
    this.getValueByLang()
    this.addKeyValue(
      finaljson,
      'language',
      this.browserLang
    );
    let response: any;
    console.log("finalJSON ",finaljson)
    this.financingService.createFinancialAgreement(finaljson).subscribe(data => {
      response = JSON.parse(data);
      this.auto_save_as_draft_flag = false;
      if (response.status == 200) {
        this.financialAgreementId = response.financialAgreementId;
        this.general_information_form.controls.financialAgreementId.patchValue(this.financialAgreementId);
        //add save funding notification service
        // if(this.EditId!=null){
        //   this.updateFundingAlert(response.responseMessage);
        // }
        // else{
        // this.saveFundingInsertAlert(response.responseMessage);
        this.saveFundingAsOnBudgetAlert();
        this.saveFundingAsOnCutOffCutAlert();
        // }
        if (this.financialAgreementId != 0 &&
          (this.commitment_form.valid ||
            this.commitment_form.status == 'DISABLED')
        ) {
          this.disbursement_flag = true;
          this.payments_flag = true;
          this.location_flag = true;
          this.nextStep();
          this.nextStep();
          this.nextStep();
        } else {
          this.disbursement_flag = false;
          this.payments_flag = false;
          this.location_flag = false;
        }
        // Swal.fire(response.responseMessage, '', 'success').then(() => {
        //   this.router.navigate(['/admin/view-funding']);
        // });
      } else if (response.status != 200) {
        if (this.browserLang == 'en')
          Swal.fire(response.responseMessage)
        else
          Swal.fire(response.responseMessagePt)
      }
    });



  }
  validateFinancialAgreementForms() {
    this.getValueByLang()
    if (this.general_information_form.invalid ||
      this.allocation_form.invalid ||
      this.locationForm.invalid ||
      this.commitment_form.invalid ||
      this.disbursement_form.invalid ||
      this.payment_form.invalid) {
      this.openMandatoryAlert()
    }
    //  else if(this.financialAgreementId==null ||  this.financialAgreementId==undefined || this.financialAgreementId==0){
    //   if(this.browserLang=='en')
    //   Swal.fire("Financial Agreement not created", 'Create Financial Agreement first by clicking "Next" button in Commitment ', 'error')
    //   else
    //   Swal.fire("Acordo financeiro não criado", 'Crie um acordo financeiro primeiro clicando no botão "Avançar" em Compromisso ', 'error')
    // }
    else {
      this.opensweetalert()
    }
  }
  private saveAsDraftFinancialAgreement() {
    let general_information_form = this.general_information_form.getRawValue();
    let allocation_form = this.allocation_form.getRawValue();
    let commitment_form = this.commitment_form.getRawValue();
    let location_form = this.locationForm.getRawValue();

    let general_information_form_data: FinancialAgreement =
      new FinancialAgreement();
    let commitment_form_data_arr = commitment_form.tableData;
    let finaljson = {};
    general_information_form_data.financialAgreementId = general_information_form.financialAgreementId;
    general_information_form_data.donor_funding_title =
      general_information_form.funding_donor_title;
    general_information_form_data.reference_for_financing_donor =
      general_information_form.donor_funding_reference;
    general_information_form_data.financing_situation =
      general_information_form.financing_situatuion;
    general_information_form_data.donor = general_information_form.donor;
    general_information_form_data.fundingOrganization = general_information_form.funding_organization;
    general_information_form_data.type_of_aid =
      general_information_form.type_of_aid;
    general_information_form_data.budgetId = general_information_form.budgetSupportOptions;
    general_information_form_data.responsibleOrganization = general_information_form.responsible_organization;
    general_information_form_data.signature_date =
      general_information_form.date_of_signature;
    general_information_form_data.start_date =
      general_information_form.start_date;
    general_information_form_data.end_date = general_information_form.end_date;
    general_information_form_data.enter_as =
      general_information_form.come_in_like;
    // general_information_form_data.implementation_type =
    //   general_information_form.type_of_implementation;
    general_information_form_data.implementation_type =
      general_information_form.type_of_implementation;
      (general_information_form_data.implementation_type=="")?general_information_form_data.implementation_type=null:general_information_form_data.implementation_type=general_information_form_data.implementation_type;
    general_information_form_data.state_budget =
      general_information_form.state_budget;
    general_information_form_data.single_treasury_account =
      general_information_form.treasury_single_account;
    general_information_form_data.direct_implementation =
      general_information_form.direct_implementation;
    general_information_form_data.pqg_meo_pillar =
      general_information_form.pillar_pqg_meo;
    general_information_form_data.pqg_meo_strategic_objective =
      general_information_form.strategic_objective_pqg_meo;
    // general_information_form_data.snip_marker = general_information_form.snip_marker;
    // general_information_form.tableFundingComments.forEach(element => {
    //   general_information_form_data.comments.push(element.comments);
    // });
    if (this.commentsData.length > 0) {
      this.commentsData.forEach(comment => {
        general_information_form_data.comments.push(comment)
      });
    }

    if (allocation_form.amount_allocated_in_financing_agreement != null && allocation_form.amount_allocated_in_financing_agreement != '') {
      general_information_form_data.amt_local_currency_agreement = (
        allocation_form.amount_allocated_in_financing_agreement as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (this.currenyList.length > 0) {
      if (allocation_form.currency_of_the_financing_agreement != null && allocation_form.currency_of_the_financing_agreement != undefined
        && allocation_form.currency_of_the_financing_agreement != '') {
        general_information_form_data.financing_agreement_currency =
          this.currenyList.find(x => allocation_form.currency_of_the_financing_agreement == x.currency_shortname).currency_id;
      }
    }
    general_information_form_data.type_of_financing_daccrs =
      allocation_form.type_of_finance;
    general_information_form_data.meo_resource_source =
      commitment_form.meo_resource_source;
    if (allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != null && allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != '') {
      general_information_form_data.amt_mzn = (
        allocation_form.amount_allocated_from_the_financing_agreement_in_meticais as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.amount_allocated_from_financing_agreement_in_usd != null && allocation_form.amount_allocated_from_financing_agreement_in_usd != '') {
      general_information_form_data.amt_usd = (
        allocation_form.amount_allocated_from_financing_agreement_in_usd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentMzn != null && allocation_form.grantEquivalentMzn != '') {
      general_information_form_data.amt_grant_equivalent_mzn = (
        allocation_form.grantEquivalentMzn as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentUsd != null && allocation_form.grantEquivalentUsd != '') {
      general_information_form_data.amt_grant_equivalent_usd = (
        allocation_form.grantEquivalentUsd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.envelopeReference != null && allocation_form.envelopeReference != "") {
      general_information_form_data.envelopeReference = allocation_form.envelopeReference;
    }

    commitment_form_data_arr.forEach((element) => {
      if (element.amounts_of_annual_commitments_agreement_currency != null && element.amounts_of_annual_commitments_agreement_currency != "") {
        element.amounts_of_annual_commitments_agreement_currency = (
          element.amounts_of_annual_commitments_agreement_currency as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amounts_of_annual_commitments_in_meticais != null && element.amounts_of_annual_commitments_in_meticais != "") {
        element.amounts_of_annual_commitments_in_meticais = (
          element.amounts_of_annual_commitments_in_meticais as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amounts_of_annual_commitments_in_usd != null && element.amounts_of_annual_commitments_in_usd != "") {
        element.amounts_of_annual_commitments_in_usd = (
          element.amounts_of_annual_commitments_in_usd as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amount_committed_in_nationalBudget_mzn != null && element.amount_committed_in_nationalBudget_mzn != "N/A") {
        element.amount_committed_in_nationalBudget_mzn = (
          element.amount_committed_in_nationalBudget_mzn as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amount_committed_in_nationalBudget_usd != null && element.amount_committed_in_nationalBudget_usd != "N/A") {
        element.amount_committed_in_nationalBudget_usd = (
          element.amount_committed_in_nationalBudget_usd as string
        ).replace(/[^0-9.]+/g, '');
      }
    });
    let geoArr = [];
    let provinces = [];
    let districts = [];
    let faResourceSource = {
      pillarPqgMasterId: general_information_form.pillar_pqg_meo,
      strategicObjectivePqgMasterId: general_information_form.strategic_objective_pqg_meo,
      mpoResourceCode: commitment_form.meo_resource_source,
    };
    this.locationTD.forEach(element => {
      let geoObj: LocationData = {
        geographicalReference: element.geographicalReference,
        iatiLocation: element.iatiLocation,
        iatiAccuracy: element.iatiAccuracy,
        coordinates: element.coordinates,
        geolocationComments: element.geolocationComments
      }
      geoArr.push(geoObj);
    })
    location_form.provinces.forEach(province => {
      let obj = {
        provinceMasterId: province
      }
      provinces.push(obj);
    })
    if (location_form.districts != null && location_form.districts != "") {
      location_form.districts.forEach(district => {
        let obj = {
          districtMasterId: district
        }
        districts.push(obj);
      })
    }

    this.addKeyValue(
      finaljson,
      'financial_agreement',
      general_information_form_data
    );

    this.addKeyValue(finaljson, 'commitment', commitment_form_data_arr);
    this.addKeyValue(
      finaljson,
      'faResourceSource',
      faResourceSource
    );
    this.addKeyValue(
      finaljson,
      'faLocation',
      geoArr
    );
    this.addKeyValue(
      finaljson,
      'faProvinces',
      provinces
    );
    this.addKeyValue(
      finaljson,
      'faDistricts',
      districts
    );
    let response: any;

    this.financingService.SDFinancialAgreement(finaljson).subscribe(data => {
      response = JSON.parse(data);
      if (response.status == 200) {
        Swal.fire(response.responseMessage, '', 'success').then(() => {
          this.auto_save_as_draft_flag = false;
          this.router.navigate(['/admin/view-funding']);
        });
      } else if (response.status != 200) {
        if (this.browserLang == 'en')
          Swal.fire(response.responseMessage)
        else
          Swal.fire(response.responseMessagePt)
      }
    });
  }
  private autoSaveAsDraftFinancialAgreement() {
    let general_information_form = this.general_information_form.getRawValue();
    let allocation_form = this.allocation_form.getRawValue();
    let commitment_form = this.commitment_form.getRawValue();
    let location_form = this.locationForm.getRawValue();

    let general_information_form_data: FinancialAgreement =
      new FinancialAgreement();
    let commitment_form_data_arr = commitment_form.tableData;
    let finaljson = {};
    general_information_form_data.financialAgreementId = general_information_form.financialAgreementId;
    general_information_form_data.donor_funding_title =
      general_information_form.funding_donor_title;
    general_information_form_data.reference_for_financing_donor =
      general_information_form.donor_funding_reference;
    general_information_form_data.financing_situation =
      general_information_form.financing_situatuion;
    general_information_form_data.donor = general_information_form.donor;
    general_information_form_data.fundingOrganization = general_information_form.funding_organization;
    general_information_form_data.type_of_aid =
      general_information_form.type_of_aid;
    general_information_form_data.budgetId = general_information_form.budgetSupportOptions;
    general_information_form_data.responsibleOrganization = general_information_form.responsible_organization;
    general_information_form_data.signature_date =
      general_information_form.date_of_signature;
    general_information_form_data.start_date =
      general_information_form.start_date;
    general_information_form_data.end_date = general_information_form.end_date;
    general_information_form_data.enter_as =
      general_information_form.come_in_like;
    // general_information_form_data.implementation_type =
    //   general_information_form.type_of_implementation;
    general_information_form_data.implementation_type =
      general_information_form.type_of_implementation;
      (general_information_form_data.implementation_type=="")?general_information_form_data.implementation_type=null:general_information_form_data.implementation_type=general_information_form_data.implementation_type;
    general_information_form_data.state_budget =
      general_information_form.state_budget;
    general_information_form_data.single_treasury_account =
      general_information_form.treasury_single_account;
    general_information_form_data.direct_implementation =
      general_information_form.direct_implementation;
    general_information_form_data.pqg_meo_pillar =
      general_information_form.pillar_pqg_meo;
    general_information_form_data.pqg_meo_strategic_objective =
      general_information_form.strategic_objective_pqg_meo;
    // general_information_form_data.snip_marker = general_information_form.snip_marker;
    // general_information_form.tableFundingComments.forEach(element => {
    //   general_information_form_data.comments.push(element.comments);
    // });
    if (this.commentsData.length > 0) {
      this.commentsData.forEach(comment => {
        general_information_form_data.comments.push(comment)
      });
    }
    if (allocation_form.amount_allocated_in_financing_agreement != null && allocation_form.amount_allocated_in_financing_agreement != '') {
      general_information_form_data.amt_local_currency_agreement = (
        allocation_form.amount_allocated_in_financing_agreement as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }


    if (this.currenyList.length > 0) {
      if (allocation_form.currency_of_the_financing_agreement != null && allocation_form.currency_of_the_financing_agreement != undefined
        && allocation_form.currency_of_the_financing_agreement != '') {
        general_information_form_data.financing_agreement_currency =
          this.currenyList.find(x => allocation_form.currency_of_the_financing_agreement == x.currency_shortname).currency_id;
      }
    }
    general_information_form_data.type_of_financing_daccrs =
      allocation_form.type_of_finance;
    general_information_form_data.meo_resource_source =
      commitment_form.meo_resource_source;
    if (allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != null && allocation_form.amount_allocated_from_the_financing_agreement_in_meticais != '') {
      general_information_form_data.amt_mzn = (
        allocation_form.amount_allocated_from_the_financing_agreement_in_meticais as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.amount_allocated_from_financing_agreement_in_usd != null && allocation_form.amount_allocated_from_financing_agreement_in_usd != '') {
      general_information_form_data.amt_usd = (
        allocation_form.amount_allocated_from_financing_agreement_in_usd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentMzn != null && allocation_form.grantEquivalentMzn != '') {
      general_information_form_data.amt_grant_equivalent_mzn = (
        allocation_form.grantEquivalentMzn as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.grantEquivalentUsd != null && allocation_form.grantEquivalentUsd != '') {
      general_information_form_data.amt_grant_equivalent_usd = (
        allocation_form.grantEquivalentUsd as string
      ).replace(/[^0-9.]+/g, '') as unknown as number;
    }
    if (allocation_form.envelopeReference != null && allocation_form.envelopeReference != "") {
      general_information_form_data.envelopeReference = allocation_form.envelopeReference;
    }

    commitment_form_data_arr.forEach((element) => {
      if (element.amounts_of_annual_commitments_agreement_currency != null && element.amounts_of_annual_commitments_agreement_currency != "") {
        element.amounts_of_annual_commitments_agreement_currency = (
          element.amounts_of_annual_commitments_agreement_currency as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amounts_of_annual_commitments_in_meticais != null && element.amounts_of_annual_commitments_in_meticais != "") {
        element.amounts_of_annual_commitments_in_meticais = (
          element.amounts_of_annual_commitments_in_meticais as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amounts_of_annual_commitments_in_usd != null && element.amounts_of_annual_commitments_in_usd != "") {
        element.amounts_of_annual_commitments_in_usd = (
          element.amounts_of_annual_commitments_in_usd as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amount_committed_in_nationalBudget_mzn != null && element.amount_committed_in_nationalBudget_mzn != "N/A") {
        element.amount_committed_in_nationalBudget_mzn = (
          element.amount_committed_in_nationalBudget_mzn as string
        ).replace(/[^0-9.]+/g, '');
      }
      if (element.amount_committed_in_nationalBudget_usd != null && element.amount_committed_in_nationalBudget_usd != "N/A") {
        element.amount_committed_in_nationalBudget_usd = (
          element.amount_committed_in_nationalBudget_usd as string
        ).replace(/[^0-9.]+/g, '');
      }
    });
    let geoArr = [];
    let provinces = [];
    let districts = [];
    let faResourceSource = {
      pillarPqgMasterId: general_information_form.pillar_pqg_meo,
      strategicObjectivePqgMasterId: general_information_form.strategic_objective_pqg_meo,
      mpoResourceCode: commitment_form.meo_resource_source,
    };
    this.locationTD.forEach(element => {
      let geoObj: LocationData = {
        geographicalReference: element.geographicalReference,
        iatiLocation: element.iatiLocation,
        iatiAccuracy: element.iatiAccuracy,
        coordinates: element.coordinates,
        geolocationComments: element.geolocationComments
      }
      geoArr.push(geoObj);
    })
    location_form.provinces.forEach(province => {
      let obj = {
        provinceMasterId: province
      }
      provinces.push(obj);
    })
    if (location_form.districts != null && location_form.districts != "") {
      location_form.districts.forEach(district => {
        let obj = {
          districtMasterId: district
        }
        districts.push(obj);
      })
    }

    this.addKeyValue(
      finaljson,
      'financial_agreement',
      general_information_form_data
    );

    this.addKeyValue(finaljson, 'commitment', commitment_form_data_arr);
    this.addKeyValue(
      finaljson,
      'faResourceSource',
      faResourceSource
    );
    this.addKeyValue(
      finaljson,
      'faLocation',
      geoArr
    );
    this.addKeyValue(
      finaljson,
      'faProvinces',
      provinces
    );
    this.addKeyValue(
      finaljson,
      'faDistricts',
      districts
    );
    let response: any;
    this.getValueByLang()
    this.financingService.SDFinancialAgreement(finaljson).subscribe(data => {
      response = JSON.parse(data);
      if (response.status == 200) {
        if (this.browserLang == 'en') {
          Swal.fire('Funding data saved as Draft successfully', '', 'success').then(() => {
            this.auto_save_as_draft_flag = false;
          });
        } else {
          Swal.fire('Dados do financiamento guardados como Rascunho com sucesso', '', 'success').then(() => {
            this.auto_save_as_draft_flag = false;
          });
        }

      } else if (response.status != 200) {
        if (this.browserLang == 'en')
          Swal.fire(response.responseMessage)
        else
          Swal.fire(response.responseMessagePt)
      }
    });
  }
  private addKeyValue(obj, key, data) {
    return (obj[key] = data);
  }
  saveAsDraft() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to save as Draft?' : 'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Save` : 'Salve',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // this.faId=this.EditId;
        // this.EditId=null;
        this.saveAsDraftFinancialAgreement();
        // Swal.fire('Saved as Draft Successfully!', '', 'success');
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        if (this.browserLang == 'en') {
          Swal.fire('Cancelled', '', 'info');
        } else {
          Swal.fire('Cancelado', '', 'info');
        }

      }
    });
  }
  saveAsDraftFromEdit() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to save as Draft?' : 'Deseja salvar como Rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Save` : 'Salve',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.financialAgreementId = this.EditId;
        this.EditId = null;
        this.general_information_form.controls.financialAgreementId.patchValue(0);
        this.saveAsDraftFinancialAgreement();
        // Swal.fire('Saved as Draft Successfully!', '', 'success');
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        if (this.browserLang == 'en') {
          Swal.fire('Cancelled', '', 'info');
        } else {
          Swal.fire('Cancelado', '', 'info');
        }
      }
    });
  }

  autoSaveAsDraft() {
    if (this.EditId != null || this.viewMoreId != null || this.viewDraftedFaId != null) {
      this.financialAgreementId = this.EditId;
      this.EditId = null;
      this.general_information_form.controls.financialAgreementId.patchValue(0);
      this.autoSaveAsDraftFinancialAgreement();
    }
    else {
      this.autoSaveAsDraftFinancialAgreement();
    }
  }

  clearForm1(form: FormGroup) {
    for (let i = 0; i < (this.general_information_form.controls.tableFundingComments as FormArray).length; i++) {
      if (i != 0)
        (this.general_information_form.controls.tableFundingComments as FormArray).removeAt(i);
    }
    (this.general_information_form.controls.tableFundingComments as FormArray).removeAt(0);



    form.reset();
  }

  clearForm2(form: FormGroup) {
    form.reset();
  }

  clearForm3(form: FormGroup) {
    for (let j = 0; j < (this.commitment_form.get('tableData') as FormArray).length; j++) {
      (this.commitment_form.get('tableData') as FormArray).removeAt(j);
    }
    (this.commitment_form.get('tableData') as FormArray).removeAt(0);

    this.sumOfCommitmentAmountMzn = '0.00';
    this.sumOfCommitmentAmountUsd = '0.00';

    form.reset();
  }
  clearForm4(form: FormGroup) {
    form.reset();
  }
  clearForm5(form: FormGroup) {
    form.reset();
  }
  clearForm() {
    for (let i = 0; i < (this.general_information_form.controls.tableFundingComments as FormArray).length; i++) {
      if (i != 0)
        (this.general_information_form.controls.tableFundingComments as FormArray).removeAt(i);
    }
    (this.general_information_form.controls.tableFundingComments as FormArray).removeAt(0);

    for (let j = 0; j < (this.commitment_form.get('tableData') as FormArray).length; j++) {
      (this.commitment_form.get('tableData') as FormArray).removeAt(j);
    }
    (this.commitment_form.get('tableData') as FormArray).removeAt(0);

    this.sumOfCommitmentAmountMzn = '0.00';
    this.sumOfCommitmentAmountUsd = '0.00';


    this.general_information_form.reset();
    this.allocation_form.reset();
    // this.locationForm.reset();
    this.resetLocation();
    this.commitment_form.reset();
    this.disbursement_form.reset();
    this.payment_form.reset();
  }
  // total_amount_disbursed_in_meticais:new FormControl({value:'4,140,951,300.44', disabled: true}),

  bomozomResponse: BankOfMozambique = new BankOfMozambique();

  allocatedAmountMzn: number = 0;
  allocationExchangeResponse: BankOfMozambique = new BankOfMozambique();
  getCurrency(): void {
    debugger
    this.getValueByLang()
    this.bomozam.amount =
      this.allocation_form.controls.amount_allocated_in_financing_agreement.value;
    // this.bomozam.currency_id =
    //   this.allocation_form.controls.currency_of_the_financing_agreement.value;
    if(this.EditId!=null || this.viewMoreId !=null)
    {
    // if( this.editResponse.financial_agreement.financing_agreement_currency!=null && 
    //   this.editResponse.financial_agreement.financing_agreement_currency!=undefined
    //   && this.editResponse.financial_agreement.financing_agreement_currency!='')
    this.bomozam.currency_id =
    this.editResponse.financial_agreement.financing_agreement_currency;
    }
    else{
    this.bomozam.currency =
     this.allocation_form.controls.currency_of_the_financing_agreement.value;
     this.bomozam.currency_id=this.currenyList.find(x => x.currency_shortname == this.bomozam.currency).currency_id.toString();
    }
  

    // this.bomozam.currency_id = this.bomozam.currency != null && this.bomozam.currency != "" && this.bomozam.currency != undefined ? this.currenyList.find(x => x.currency_shortname == this.bomozam.currency).currency_id.toString() : null;
    let allocatedAmount: number = 0;
    if (this.allocation_form.controls.amount_allocated_in_financing_agreement.value != null && this.allocation_form.controls.amount_allocated_in_financing_agreement.value != '') {
      allocatedAmount = Number(String(this.allocation_form.controls.amount_allocated_in_financing_agreement.value).replace(/[^0-9.]+/g, ''));
    }

    let envelopeReference: string = this.allocation_form.controls.envelopeReference.value;

    if (envelopeReference != null && envelopeReference != undefined && envelopeReference != 'Select' && envelopeReference != '') {
      if (this.bomozam.currency == this.envRefCurrency) {
        this.compareCurrencyFlag = true;
        //if true, compare amount
      } else {
        // if false, compare amountMzn
        this.compareCurrencyFlag = false;
      }
      //  if( bomAmount>this.sumOfEnvelopeAmountMzn){
      // this.bomozam.amount = this.sumOfEnvelopeAmountMzn;
      // this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' '));

      if ((this.bomozam.amount != undefined && this.bomozam.amount != null)
        && (this.bomozam.currency != undefined && this.bomozam.currency != null && this.bomozam.currency != "")) {
        this.financingService
          .getExchangeRateFinancialAgreement(this.bomozam)
          .subscribe((data) => {

            this.allocationExchangeResponse = data;

            if (data.response === 'Currency found') {
              if (this.compareCurrencyFlag) {
                if (allocatedAmount > this.totalUnprogrammedFunds) {
                  if (this.browserLang == 'en')
                    Swal.fire('The maximum allocation amount for this envelope is ' + this.currencyPipe.transform(this.totalUnprogrammedFunds, ' '), '', 'error')
                  else
                    Swal.fire('O valor máximo de alocação para este envelope é ' + this.currencyPipe.transform(this.totalUnprogrammedFunds, ' '), '', 'error')

                  this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(0, ' '));
                  this.allocation_form.controls.exchange_rates_in_usd.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_usd, ' ')
                  );
                  this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                } else {
                  this.allocation_form.controls.exchange_rates_in_usd.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_usd, ' ')
                  );
                  this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_mzn, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
                    this.currencyPipe.transform(data.amount_in_mzn, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
                    this.currencyPipe.transform(data.amount_in_usd, ' ')
                  );
                }
              } else if (!this.compareCurrencyFlag) {
                if (data.amount_in_mzn > this.sumOfEnvelopeAmountMzn) {
                  if (this.browserLang == 'en')
                    Swal.fire('The maximum allocation amount for this envelope is ' + this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' ') + ' MZN', '', 'error')
                  else
                    Swal.fire('O valor máximo de alocação para este envelope é ' + this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' ') + ' MZN', '', 'error')

                  this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(0, ' '));
                  this.allocation_form.controls.exchange_rates_in_usd.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_usd, ' ')
                  );
                  this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
                    this.currencyPipe.transform(0, ' ')
                  );
                } else {
                  this.allocation_form.controls.exchange_rates_in_usd.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_usd, ' ')
                  );
                  this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
                    this.currencyPipe.transform(data.exchange_rate_mzn, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
                    this.currencyPipe.transform(data.amount_in_mzn, ' ')
                  );
                  this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
                    this.currencyPipe.transform(data.amount_in_usd, ' ')
                  );
                }
              }
              this.allocatedAmountMzn = data.amount_in_mzn;
              this.showGrantEquivalentFields();
              this.findTotalAmountDisburse();
              this.findTotalAmountPayment();
            }
            else {
              this.allocation_form.controls.exchange_rates_in_usd.patchValue('');
              this.allocation_form.controls.exchange_rates_in_mzn.patchValue('');
              this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue('');
              this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue('');
              if (this.browserLang == 'en') {
                Swal.fire({
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Add Exchange Rate',
                  showCancelButton: true,
                  title: 'The Currency for that year was not found in the Currency Exchange Administration page.',
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

            }
          });
        // }
      }
      // else{
      //   if((this.bomozam.amount!=undefined && this.bomozam.amount!=null && this.bomozam.amount!=0)
      //   && (this.bomozam.currency!=undefined && this.bomozam.currency!=null && this.bomozam.currency!="")){
      //     this.financingService
      //     .getExchangeRateFinancialAgreement(this.bomozam)
      //     .subscribe((data) => {
      //       this.allocationExchangeResponse=data;
      //       if (data.response === 'Currency found') {
      //         this.allocation_form.controls.exchange_rates_in_usd.patchValue(
      //           this.currencyPipe.transform(data.exchange_rate_usd, ' ')
      //         );
      //         this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
      //           this.currencyPipe.transform(data.exchange_rate_mzn, ' ')
      //         );
      //         this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
      //           this.currencyPipe.transform(data.amount_in_mzn, ' ')
      //         );
      //         this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
      //           this.currencyPipe.transform(data.amount_in_usd, ' ')
      //         );
      //         this.allocatedAmountMzn = data.amount_in_mzn;
      //         this.showGrantEquivalentFields();
      //         this.findTotalAmountDisburse();
      //         this.findTotalAmountPayment();
      //       }
      //       if (data.response === 'Currency not found') {
      //         this.allocation_form.controls.exchange_rates_in_usd.patchValue('');
      //         this.allocation_form.controls.exchange_rates_in_mzn.patchValue('');
      //         this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue('');
      //         this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue('');
      //         if(this.browserLang=='en'){
      //           Swal.fire({
      //             title: 'Currency not Found in Exchange Administration Page for Given Year.',
      //             confirmButtonText: `OK`,
      //           });
      //         }else{
      //           Swal.fire({
      //             title: 'Moeda não encontrada na página de administração do Exchange para determinado ano.',
      //             confirmButtonText: `OK`,
      //           });
      //         }

      //       }
      //     });
      //   }
      // }
    } else {
      if ((this.bomozam.amount != undefined && this.bomozam.amount != null && this.bomozam.amount != 0)
        && ((this.bomozam.currency != undefined && this.bomozam.currency != null && this.bomozam.currency != "")
        || (this.bomozam.currency_id != undefined && this.bomozam.currency_id != null && this.bomozam.currency_id != "")
        ))
         {
        this.financingService
          .getExchangeRateFinancialAgreement(this.bomozam)
          .subscribe((data) => {

            this.allocationExchangeResponse = data;
            if (data.response === 'Currency found') {
              this.allocation_form.controls.exchange_rates_in_usd.patchValue(
                this.currencyPipe.transform(data.exchange_rate_usd, ' ')
              );
              this.allocation_form.controls.exchange_rates_in_mzn.patchValue(
                this.currencyPipe.transform(data.exchange_rate_mzn, ' ')
              );
              this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue(
                this.currencyPipe.transform(data.amount_in_mzn, ' ')
              );
              this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue(
                this.currencyPipe.transform(data.amount_in_usd, ' ')
              );
              this.allocatedAmountMzn = data.amount_in_mzn;
              this.showGrantEquivalentFields();
              this.findTotalAmountDisburse();
              this.findTotalAmountPayment();
            }
            else {
              this.allocation_form.controls.exchange_rates_in_usd.patchValue('');
              this.allocation_form.controls.exchange_rates_in_mzn.patchValue('');
              this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.patchValue('');
              this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.patchValue('');
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
                  title: 'A Moeda para o ano seleccionado não foi encontrada na página de Administração de Taxas de Câmbio'
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.openExchangeRateAdministration()
                  } else if (result.isDenied) {
                    // Swal.fire('Cancelled', '', 'info');
                  }
                });
              }
            }
          });
      }
    }


  }
  //method to add data in the commitment accordian
  addCommitmentData() {
    if ((this.EditId != null || this.viewMoreId != null || this.financialAgreementId != null || this.viewDraftedFaId != null)
      && this.editResponse.commitment != null) {
      if (this.editResponse.commitment.length > 0) {
        (this.commitment_form.get('tableData') as FormArray).clear();
        for (let index = 0; index < this.editResponse.commitment.length; index++) {
          //create new rows
          this.checkCommitment();
          //patch year in year dropdown and currency dropdown
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('year')
            .patchValue(+this.editResponse.commitment[index].year);
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('amounts_of_annual_commitments_agreement_currency')
            .patchValue(this.currencyPipe.transform(this.editResponse.commitment[index].amounts_of_annual_commitments_agreement_currency, ' '));
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('currencyName')
            .patchValue(this.editResponse.commitment[index].currencyName);
          //disable some fields

          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('year')
            .disable();
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('amounts_of_annual_commitments_in_meticais')
            .disable();
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('amounts_of_annual_commitments_in_usd')
            .disable();
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('amount_committed_in_nationalBudget_mzn')
            .disable();
          (
            (this.commitment_form.get('tableData') as FormArray).at(
              index
            ) as FormGroup
          )
            .get('amount_committed_in_nationalBudget_usd')
            .disable();
          if (this.editResponse.commitment[index].amount_committed_in_nationalBudget_mzn != null) {
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_mzn')
              .patchValue(
                this.currencyPipe.transform(this.editResponse.commitment[index].amount_committed_in_nationalBudget_mzn, ' ')
              );
          } else {
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_mzn')
              .patchValue(
                'N/A');
          }
          if (this.editResponse.commitment[index].amount_committed_in_nationalBudget_usd != null) {
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_usd')
              .patchValue(
                this.currencyPipe.transform(this.editResponse.commitment[index].amount_committed_in_nationalBudget_usd, ' ')
              );
          } else {
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_usd')
              .patchValue('N/A');
          }

          this.getCurrencyCommitment(index);
        }
        this.editResponse.commitment = null;
      }
    } else {
      // this.populateYear();
      //clear tableData
      (this.commitment_form.get('tableData') as FormArray).clear();
      // variable to store allocation currency value
      let allocationCurrencyName: string =
        this.allocation_form.controls.currency_of_the_financing_agreement.value;
      // variable to store state budget value
      let stateBudgetValue: number = Number(
        this.general_information_form.controls.state_budget.value
      );
      let startDate = this.general_information_form.controls.start_date.value;
      let endDate = this.general_information_form.controls.end_date.value;
      //condition when year and allocation currency length is not 0 then commitment data will be added
      if (
        startDate != null &&
        startDate != undefined &&
        startDate != '' &&
        endDate != null &&
        endDate != undefined &&
        endDate != ''
      ) {
        // if (this.yearList.length > 0 && allocationCurrencyName.length > 0) {
        if (this.yearList.length > 0) {
          //ittirate yearlist
          for (let index = 0; index < this.yearList.length; index++) {
            //create new rows
            this.checkCommitment();
            //patch year in year dropdown and currency dropdown
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('year')
              .patchValue(this.yearList[index]);
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('currencyName')
              .patchValue(allocationCurrencyName);
            //disable some fields
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('year')
              .disable();
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amounts_of_annual_commitments_in_meticais')
              .disable();
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amounts_of_annual_commitments_in_usd')
              .disable();
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_mzn')
              .disable();
            (
              (this.commitment_form.get('tableData') as FormArray).at(
                index
              ) as FormGroup
            )
              .get('amount_committed_in_nationalBudget_usd')
              .disable();

            // if (stateBudgetValue == 1) {
            //   (
            //     (this.commitment_form.get('tableData') as FormArray).at(
            //       index
            //     ) as FormGroup
            //   )
            //     .get('amount_committed_in_nationalBudget_mzn')
            //     .patchValue(
            //       this.currencyPipe.transform(Math.random() * 10000000, ' ')
            //     );
            //   (
            //     (this.commitment_form.get('tableData') as FormArray).at(
            //       index
            //     ) as FormGroup
            //   )
            //     .get('amount_committed_in_nationalBudget_usd')
            //     .patchValue(
            //       this.currencyPipe.transform(Math.random() * 10000000, ' ')
            //     );
            // }
            // if (stateBudgetValue == 2) {
            //   (
            //     (this.commitment_form.get('tableData') as FormArray).at(
            //       index
            //     ) as FormGroup
            //   )
            //     .get('amount_committed_in_nationalBudget_mzn')
            //     .patchValue('N/A');
            //   (
            //     (this.commitment_form.get('tableData') as FormArray).at(
            //       index
            //     ) as FormGroup
            //   )
            //     .get('amount_committed_in_nationalBudget_usd')
            //     .patchValue('N/A');
            // }
          }
        }
      }
    }
  }
  clearCommitmentFormArray() {
    (this.commitment_form.get('tableData') as FormArray).clear();
    this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
    this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
    // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
    let commitmentAmt = this.getSumOfCommitmentAmount();
    if (commitmentAmt != -1)
      this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
    else
      this.sumOfCommitmentAmount = "-";
  }
  commitmentAmtMznArr: number[] = [];
  commitmentAmtUsdArr: number[] = [];
  sumOfCommitmentAmountMzn: string = this.currencyPipe.transform(0, ' ');
  sumOfCommitmentAmountUsd: string = this.currencyPipe.transform(0, ' ');
  sumOfCommitmentAmount: string = this.currencyPipe.transform(0, ' ');
  currentYear: number = new Date().getFullYear();
  getCurrencyCommitment(index: number): void {
    {//update sum of commitment amount
      let commitmentAmt = this.getSumOfCommitmentAmount();
      if (commitmentAmt != -1)
        this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
      else
        this.sumOfCommitmentAmount = "-";
      // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
    }
    this.getValueByLang()
    this.nodisplay = false;
    let commitmentBomozom: BankOfMozambique = new BankOfMozambique();
    commitmentBomozom.year = (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    ).get('year').value;
    commitmentBomozom.amount = (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    ).get('amounts_of_annual_commitments_agreement_currency').value;
    commitmentBomozom.currency = (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    ).get('currencyName').value;
    commitmentBomozom.currency_id = (commitmentBomozom.currency != null && commitmentBomozom.currency != undefined && commitmentBomozom.currency != "") ? this.currenyList.find(x => x.currency_shortname == commitmentBomozom.currency).currency_id.toString() : null;

    if ((commitmentBomozom.year !== null && commitmentBomozom.year !== undefined && commitmentBomozom.year !== "")
      && (commitmentBomozom.amount !== null && commitmentBomozom.amount !== undefined)
      && (commitmentBomozom.currency !== null && commitmentBomozom.currency !== undefined && commitmentBomozom.currency !== "")) {

      // this.bankService
      // .getFinanceAllocation(JSON.stringify(commitmentBomozom))
      // .subscribe((data) => {
      this.financingService.getExchangeRateFinancialAgreement(commitmentBomozom).subscribe(data => {

        if (data.response === 'Currency found') {
          this.bomozomResponse = data;
          this.commitmentAmtMznArr[index] = this.bomozomResponse.amount_in_mzn;
          this.commitmentAmtUsdArr[index] = this.bomozomResponse.amount_in_usd;
          let allocatedAmountMzn: number = 0;
          if (this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value != null && this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value != '') {
            allocatedAmountMzn = Number((this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value as string).replace(/[^0-9.]+/g, ''));

          }
          // let allocatedAmountUsd:number = Number((this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.value as string).replace(/[^0-9.]+/g, ''));
          let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray);
          // this.sumOfCommitmentAmountMzn = 0;
          if (commitmentDataArr.length > 0) {
            // this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.commitmentAmtMznArr.reduce((partial_sum, a) => partial_sum + a, 0),' ');
            // this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.commitmentAmtUsdArr.reduce((partial_sum, a) => partial_sum + a, 0),' ');4

            // this.commitment_form.controls.totalCommitmentAmountMzn.patchValue(this.currencyPipe.transform(this.sumOfCommitmentAmountMzn,' '));
            // this.commitment_form.controls.totalCommitmentAmountUsd.patchValue(this.currencyPipe.transform(this.sumOfCommitmentAmountMzn,' '));

            // if((this.sumOfCommitmentAmountMzn>allocatedAmountMzn) 
            // || (this.sumOfCommitmentAmountUsd>allocatedAmountUsd)
            // ){
            // (commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_agreement_currency').reset;
            //   Swal.fire('Total commitment amount cannot be greater than Allocated amount', '', 'error');
            //   ((this.commitment_form.get('tableData') as FormArray).at(
            //     index) as FormGroup)
            //   .get('amounts_of_annual_commitments_agreement_currency')
            //   .patchValue('');
            //   ((this.commitment_form.get('tableData') as FormArray).at(
            //     index) as FormGroup)
            //   .get('amounts_of_annual_commitments_in_meticais')
            //   .patchValue('');
            // ((this.commitment_form.get('tableData') as FormArray).at(
            //     index) as FormGroup)
            //   .get('amounts_of_annual_commitments_in_usd')
            //   .patchValue('');
            //   this.commitmentAmtMznArr.splice(index, 1);
            //   this.commitmentAmtUsdArr.splice(index, 1);
            // }else{
            ((this.commitment_form.get('tableData') as FormArray).at(
              index) as FormGroup)
              .get('amounts_of_annual_commitments_in_meticais')
              .patchValue(this.currencyPipe.transform(data.amount_in_mzn, ' '));
            ((this.commitment_form.get('tableData') as FormArray).at(
              index) as FormGroup)
              .get('amounts_of_annual_commitments_in_usd')
              .patchValue(this.currencyPipe.transform(data.amount_in_usd, ' '));

            this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
            this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
            // this.sumOfCommitmentAmount = this.currencyPipe.transform(this.getSumOfCommitmentAmount(), ' ');
            // }
          }
        } else {
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
          ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
            .get('amounts_of_annual_commitments_in_meticais').patchValue('');
          ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
            .get('amounts_of_annual_commitments_in_usd').patchValue('');
        }
      });
    }
  }

  getSumOfCommitmentNationalAmountMzn():number{
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray)
    let sumOfMzn = 0;
    let amountMzn = 0;
    for (let i = 0; i < commitmentDataArr.length; i++) {
      if ((commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_mzn').value != null && (commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_mzn').value != '') {
        amountMzn = Number(((commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_mzn').value as string).replace(/[^0-9.]+/g, ''));
        sumOfMzn = sumOfMzn + amountMzn;
      }
    }
    return sumOfMzn;

  }


  getSumOfCommitmentNationalAmountUsd():number{
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray)
    let sumOfUsd = 0;
    let amountUsd = 0;
    for (let i = 0; i < commitmentDataArr.length; i++) {
      if ((commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_usd').value != null && (commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_usd').value != '') {
        amountUsd = Number(((commitmentDataArr.at(i) as FormGroup).get('amount_committed_in_nationalBudget_usd').value as string).replace(/[^0-9.]+/g, ''));
        sumOfUsd = sumOfUsd + amountUsd;
      }
    }
    return sumOfUsd;

  }
  getSumOfCommitmentAmountMzn(): number {
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray)
    let sumOfMzn = 0;
    let amountMzn = 0;
    for (let i = 0; i < commitmentDataArr.length; i++) {
      if ((commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_meticais').value != null && (commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_usd').value != '') {
        amountMzn = Number(((commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_meticais').value as string).replace(/[^0-9.]+/g, ''));
        sumOfMzn = sumOfMzn + amountMzn;
      }
    }
    return sumOfMzn;
  }
  getSumOfCommitmentAmountUsd(): number {
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray)
    let sumOfUsd = 0;
    let amountUsd = 0;
    for (let i = 0; i < commitmentDataArr.length; i++) {
      if ((commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_usd').value != null && (commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_usd').value != '') {
        amountUsd = Number(((commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_in_usd').value as string).replace(/[^0-9.]+/g, ''));
        sumOfUsd = sumOfUsd + amountUsd;
      }
    }
    return sumOfUsd;
  }
  getSumOfCommitmentAmount(): number {
    let commitmentDataArr = (this.commitment_form.get('tableData') as FormArray)
    let sumOfCommitmentAmount = 0;
    let CommitmentAmount = 0;
    let currency = (commitmentDataArr.at(0) as FormGroup).get('currencyName').value;
    if (commitmentDataArr.length > 0) {
      for (let i = 0; i < commitmentDataArr.length; i++) {
        if (currency == (commitmentDataArr.at(i) as FormGroup).get('currencyName').value && (commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_agreement_currency').value != null && (commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_agreement_currency').value != '') {
          CommitmentAmount = Number(((commitmentDataArr.at(i) as FormGroup).get('amounts_of_annual_commitments_agreement_currency').value as string).replace(/[^0-9.]+/g, ''));
          sumOfCommitmentAmount = sumOfCommitmentAmount + CommitmentAmount;
        }
        else {
          sumOfCommitmentAmount = -1;
          break;
        }
      }
    }

    return sumOfCommitmentAmount;
  }
  regex_Currency(e) {
    return (
      e.charCode === 0 ||
      (e.charCode >= 48 && e.charCode <= 57) ||
      (e.charCode == 46 &&
        (<HTMLInputElement>(
          document.getElementById('contractValue')
        )).value.indexOf('.') < 0)
    );
  }
  onBlur(value, j) {
    ((this.commitment_form.get('tableData') as FormArray).at(j) as FormGroup)
      .get('amounts_of_annual_commitments_agreement_currency')
      .setValue(this.currencyPipe.transform(value, ' '));
  }

  // yearHeaders = ['Year'];



  // amountHeaders = ['Amounts Of Annual Commitments (Agreement Currency)'];

  // amountRow = [
  //   {
  //     amount: '',
  //   },
  // ];
  // public addAmount(): void {
  //   this.amountRow.push({
  //     amount: '',
  //   });
  // }
  // deleteAmountRow(index: number) {
  //   this.amountRow.splice(index, 1);
  // }
  regex_amount(e) {
    return (
      e.charCode === 0 ||
      (e.charCode >= 48 && e.charCode <= 57) ||
      (e.charCode == 46 &&
        (<HTMLInputElement>(
          document.getElementById(
            'amounts_of_annual_commitments_in_agreement_currency'
          )
        )).value.indexOf('.') < 0)
    );
  }

  checkIfGreaterThanEnvelopeAmount(amount: string) {
    this.getValueByLang()
    let amount2: number = 0;
    if (amount != null && amount != '') {
      amount2 = Number(amount.replace(/[^0-9.]+/g, ''));
    }

    let envelopeReference: string = this.allocation_form.controls.envelopeReference.value;
    if (envelopeReference != '' && envelopeReference != null && envelopeReference != undefined && envelopeReference != 'Select') {
      if (amount2 > this.sumOfEnvelopeAmountMzn) {
        // this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn));
        this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(0, ' '));
        if (this.browserLang == 'en')
          Swal.fire('The maximum allocation amount for this envelope is ' + this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' ') + ' MZN', '', 'error')
        else
          Swal.fire('O valor máximo de alocação para este envelope é ' + this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' ') + ' MZN', '', 'error')

      }
    }
  }

  listofCommitmentColumns = [
    'Year',
    'Amount',
    'Currency',
    'Amount (MZN)',
    'Amount (USD)',
    'Amount committed in the National Budget (MZN)',
    'Amount committed in the National Budget (USD)',
  ];

  //method to apply serach filter for commitment curreny dropdown
  manageNameControl(index: number) {
    // this.currencyService.getCurrencyDetails().subscribe(data => {
    // this.currenyList = data;
    var arrayControl = this.commitment_form.get('tableData') as FormArray;
    if (arrayControl.length > 0) {
      this.currencyfilteredOptionCommitment[index] = arrayControl
        .at(index)
        .get('searchCommitmentCurrency')
        .valueChanges // this.currencyfilteredOptionCommitment[index] = this.searchCommitmentCurrency[index].valueChanges
        .pipe(
          startWith(''),
          map((currencyDAta) =>
            currencyDAta
              ? this.filterCurrency(currencyDAta)
              : this.currenyList.slice()
          )
        );
    }
    // })
  }

  public addCommitmentTableRow(): void {



    const controls = <FormArray>this.commitment_form.controls['tableData'];
    const row = this.fb.group({
      amounts_of_annual_commitments_agreement_currency: [null],
      year: [null],
      currencyName: [null],
      amounts_of_annual_commitments_in_meticais: [{ value: null, disabled: true }],
      amounts_of_annual_commitments_in_usd: [{ value: null, disabled: true }],
      searchCommitmentCurrency: [''],
      amount_committed_in_nationalBudget_mzn: [{ value: null, disabled: true }],
      amount_committed_in_nationalBudget_usd: [{ value: null, disabled: true }],
    });
    this.populateYear();
    (this.commitment_form.get('tableData') as FormArray).push(row);

    this.manageNameControl(controls.length - 1);
    let allocationCurrencyName = this.allocation_form.controls.currency_of_the_financing_agreement.value;
    let commitmentLength = (this.commitment_form.controls.tableData as FormArray).length;
    //patch allocation currency to new row.
    if (allocationCurrencyName != null) {
      // for (let i = 0; i < commitmentLength; i++) {
      ((this.commitment_form.controls.tableData as FormArray).at(commitmentLength - 1) as FormGroup)
        .get('currencyName')
        .patchValue(allocationCurrencyName);
      // }
    }
    // this.customizeCommitmentTableRow();
    let commitmentAmt = this.getSumOfCommitmentAmount();
    if (commitmentAmt != -1)
      this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
    else
      this.sumOfCommitmentAmount = "-";
  }
  yearArr = [];
  public addYear(index, value): void {
    this.yearArr[index] = value;
  
    // ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup).get('amounts_of_annual_commitments_in_meticais').patchValue(this.mpoResposeArray[index]);
  }
  deleteYear(index) {
    // const index = this.yearArr.indexOf(d);
    this.yearArr.splice(index, 1);
  }

  checkCommitment() {
    let noOfCommitmentRows: number = (this.commitment_form.get('tableData') as FormArray).length;
    let startDate = this.general_information_form.controls.start_date.value;
    let endDate = this.general_information_form.controls.end_date.value;
    let years: number[] = this.populateYear();

    if (noOfCommitmentRows == 0) {
      this.addYear(0, years);
    }
    else if (noOfCommitmentRows > 0) {
      let selectedYears: number[] = [];
      for (let i = 0; i < noOfCommitmentRows; i++) {

        let commitmentYear: number = ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
          .get('year').value;
        if (commitmentYear != null && commitmentYear > 0) {
          selectedYears.push(commitmentYear);


          // this.addYear(i+1,yearss);
        }
        // counts[i] = commitmentYear;
      }
      let yearss: number[] = Array.from(years); //New Year List
      for (let i = 0; i < selectedYears.length; i++) {
        if (years.includes(selectedYears[i])) {

          let index = yearss.indexOf(selectedYears[i]);
          yearss.splice(index, 1);
        }
      }
      this.addYear(noOfCommitmentRows, yearss);

    }

    // if((startDate == null ||
    //   startDate == undefined ||
    //   startDate == '') ||
    //   (endDate == null ||
    //   endDate == undefined ||
    //   endDate == '')){
    // this.populateYear();
    //   }
    let noOfYears: number = this.yearList.length;
    if ((noOfCommitmentRows >= noOfYears)) {
      // Swal.fire('Info','You cannot add rows more than the number of years','info')
      this.addButtonDisable = true;
    } else if (noOfCommitmentRows < noOfYears) {
      this.addButtonDisable = false;
      this.addCommitmentTableRow();
    }

    // this.addCommitmentTableRow();
  }
  addButtonDisable: boolean = false;
  yearForComparision: number[] = [];

  checkCommitmentYear(index: number) {
    //a method called when year is choosen. It will not allow duplicate year selection in commitment.

    let commitmentYear: number = ((this.commitment_form.controls.tableData as FormArray).at(index) as FormGroup)
      .get('year').value;
    //   let counts = {};

    // for (let control of (this.commitment_form.controls.tableData as FormArray).getRawValue() ) {
    //   counts[control.year] = counts[control.year] ? counts[control.year] + 1 : 1;
    // }
    //   if( this.yearList.find(x => x==commitmentYear) && counts[commitmentYear]>1 ){
    //     Swal.fire('Info',commitmentYear+' is already selected. Please select different year','info');
    //     ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
    //     .get('year').reset();
    //   }

    //New code New Objective to eliminate the choosen year from array
    for (let i = 0; i < this.yearArr.length; i++) {
      if (i != index) {
        let yearIndex = this.yearArr[i].indexOf(commitmentYear, 0);
        this.yearArr[i].splice(yearIndex, 1);
      }
    }
  }

 sumofNationalAmountMzn:any;
 sumofNationalAmountUsd:any;
  addAmountInNationalBudget(index: number) {

    let stateBudgetValue = this.general_information_form.controls.state_budget.value;
    let year: number = ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
      .get('year').value;
    let amount: number = ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
      .get('amounts_of_annual_commitments_agreement_currency').value;
    let currency = ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
      .get('currencyName').value;
    if ((year != null && year != undefined && year > 0) && (amount != null && amount != undefined && amount > 0) && (currency != null && currency != undefined && currency != '') && stateBudgetValue == 1) {
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_mzn')
        .patchValue('N/A'
          // this.currencyPipe.transform(Math.random() * 10000000, ' ')
        );
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_usd')
        .patchValue('N/A'
          // this.currencyPipe.transform(Math.random() * 10000000, ' ')
        );
    } else if ((year == null || year == undefined) || (amount == null || amount == 0) || (currency == null || currency == undefined || currency == '') && stateBudgetValue == 1) {
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_mzn')
        .patchValue(this.currencyPipe.transform(this.mpoResposeArray[index], " "));
        this.sumofNationalAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentNationalAmountMzn(), ' ');
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_usd')
        // .patchValue('N/A');
        .patchValue(this.currencyPipe.transform(this.mpoResposeArray[index]*0.016, " "));
        this.sumofNationalAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentNationalAmountUsd(), ' ');
       
        
    }
    if ((year != null && year > 0) && (amount != null && amount > 0) && (currency != null && currency != '') && stateBudgetValue == 2) {
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_mzn')
        .patchValue('N/A');
        
      (
        (this.commitment_form.get('tableData') as FormArray).at(
          index
        ) as FormGroup
      )
        .get('amount_committed_in_nationalBudget_usd')
        .patchValue('N/A');
    }

  }

  // get dateFormArray(): FormArray {
  //   return this.commitment_form.get('tableData') as FormArray;
  // }
  deleteRowYears(index: number) {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let year: number = ((this.commitment_form.get('tableData') as FormArray).at(index) as FormGroup)
          .get('year').value;
        (this.commitment_form.get('tableData') as FormArray).removeAt(index);
        let noOfYears: number = this.yearList.length;
        let noOfCommitmentRows: number = (this.commitment_form.get('tableData') as FormArray).length;
        if ((noOfCommitmentRows >= noOfYears)) {
          // Swal.fire('Info','You cannot add rows more than the number of years','info')
          this.addButtonDisable = true;
        } else if (noOfCommitmentRows < noOfYears) {
          this.addButtonDisable = false;
        }
        this.yearArr.splice(index, 1);
        this.currencyfilteredOptionCommitment.splice(index, 1);
        for (let i = 0; i < this.yearArr.length; i++) {
          (this.yearArr[i] as Array<number>).push(year);
          (this.yearArr[i] as Array<number>).sort();
        }
        this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
        this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
        let commitmentAmt = this.getSumOfCommitmentAmount();
        if (commitmentAmt != -1)
          this.sumOfCommitmentAmount = this.currencyPipe.transform(commitmentAmt, ' ');
        else
          this.sumOfCommitmentAmount = "-";
      }
    });
  }


  ViewMoreFundingFromProject: any;
  financingSituationList: FinancingClass[];
  financingSituationfilteredOption: Observable<any[]>;
  today: any;
  private getFinancingSituation() {
    this.financingService.getFinancingSituationDetails().subscribe((data) => {
      this.financingSituationList = data;
      for (let i = 0; i < this.financingSituationList.length; i++) {
        let crtDt = this.financingSituationList[i].createdOn;
        let updateDt = this.financingSituationList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.financingSituationList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.financingSituationList[i].updateDifference = days_differenceForUpdate;
        }
        (this.financingSituationList[i].difference) = days_difference;
      }
      this.financingSituationfilteredOption =
        this.searchFinancingSituaion.valueChanges.pipe(
          startWith(''),
          map((financingSituation) =>
            financingSituation
              ? this.filterfinancingSituation(financingSituation)
              : this.financingSituationList.slice()
          )
        );
    });
  }
  private filterfinancingSituation(name: string) {
    if (this.browserLang == 'en') {
      return this.financingSituationList.filter(
        (financingSituation) =>
          financingSituation.financingSituationNameEn.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .indexOf(name.toLowerCase()) !== -1
      );
    } else {
      return this.financingSituationList.filter(
        (financingSituation) =>
          financingSituation.financingSituationNamePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .indexOf(name.toLowerCase()) !== -1
      );
    }

  }

  aidDACCRSList: FinancingClass[];
  aidDACCRSfilteredOption: Observable<any[]>;
  private getAidDACCRS() {
    this.financingService.getAidDacCrsDetails().subscribe((data) => {
      this.aidDACCRSList = data;

      for (let i = 0; i < this.aidDACCRSList.length; i++) {
        let crtDt = this.aidDACCRSList[i].createdOn;
        let updateDt = this.aidDACCRSList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.aidDACCRSList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.aidDACCRSList[i].updateDifference = days_differenceForUpdate;
        }
        (this.aidDACCRSList[i].difference) = days_difference;
      }
      // if (
      //   this.EditId !=null ||
      //   this.viewMoreId != null
      // ) {
      //   this.general_information_form.controls.type_of_aid.patchValue(
      //     this.editResponse.financial_agreement.type_of_aid
      //   );
      // }
      this.aidDACCRSfilteredOption = this.searchTypeOfAid.valueChanges.pipe(
        startWith(''),
        map((aidDACCRS) =>
          aidDACCRS
            ? this.filteraidDACCRS(aidDACCRS)
            : this.aidDACCRSList.slice()
        )
      );
    });
  }
  private filteraidDACCRS(name: string) {
    if (this.browserLang == 'en') {
      return this.aidDACCRSList.filter(
        (aidDACCRS) =>
          aidDACCRS.dacCrsNameEn.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    } else {
      return this.aidDACCRSList.filter(
        (aidDACCRS) =>
          aidDACCRS.dacCrsNamePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    }

  }
  displayDacCrs(id) {
    if (!id) return '';
    return this.aidDACCRSList.find((x) => x.dacCrsId == id).dacCrsNameEn;
  }

  donorList: Organization[] = [];
  donorfilteredOption: Observable<any[]>;
  private getDonorDetails() {
    if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
      this.donorService.getDonorListByUserAccess(this.userId).subscribe((data) => {
        this.donorList = data;
        this.donorfilteredOption = this.searchDonor.valueChanges.pipe(
          startWith(''),
          map((donor) =>
            donor ? this.filterDonor(donor) : this.donorList.slice()
          )
        );
      });
    }
    else {
      this.donorService.getDonorListFunding().subscribe((data) => {
        this.donorList = data;
        this.donorfilteredOption = this.searchDonor.valueChanges.pipe(
          startWith(''),
          map((donor) =>
            donor ? this.filterDonor(donor) : this.donorList.slice()
          )
        );
      });
    }
  }
  private filterDonor(name: string) {
    return this.donorList.filter(
      (donor) =>
        donor.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
          toLowerCase().indexOf(name.toLowerCase()) !== -1 || donor.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  selectedDonor: string;
  fundingOrganizationList: Organization[];
  fundingOrganizationfilteredOption: Observable<any[]>;
  getFundingOrganizationDetails() {

    // if (
    //   this.selectedDonor != this.general_information_form.controls.donor.value
    // ) {
    //   this.general_information_form.controls.funding_organization.patchValue(
    //     ''
    //   );
    // }

    this.selectedDonor = this.general_information_form.controls.donor.value;
    if (this.selectedDonor != '') {
      this.fundingOrganizationService
        .getFundingOrganizationListByDonorId(this.selectedDonor)
        .subscribe((data) => {
          this.fundingOrganizationList = [];
          this.fundingOrganizationList = data;
          if ((this.EditId != null || this.viewMoreId != null || this.viewDraftedFaId != null) && this.editResponse.financial_agreement.fundingOrganization != null) {

            // let fundingOrg:number = this.editResponse.financial_agreement.fundingOrganization;
            this.general_information_form.controls.funding_organization.patchValue(+this.editResponse.financial_agreement.fundingOrganization);
            this.getEnvelopeReference(this.general_information_form.controls.funding_organization.value, this.general_information_form.controls.donor.value);
            this.editResponse.financial_agreement.fundingOrganization = null;
          }
          this.fundingOrganizationfilteredOption = null;
          this.fundingOrganizationfilteredOption =
            this.searchFundingOrganization.valueChanges.pipe(
              startWith(''),
              map((fundingOrganization) =>
                fundingOrganization
                  ? this.filterfundingOrganization(fundingOrganization)
                  : this.fundingOrganizationList.slice()
              )
            );
        });
    } else {
      this.fundingOrganizationList = [];
    }
    // this.fundingOrganizationService. getFundingOrganizationList().subscribe(data=>{
    //   this.fundingOrganizationList=data;
    //  this.fundingOrganizationfilteredOption = this.general_information_form.controls['funding_organization'].valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(fundingOrganization => fundingOrganization ? this.filterfundingOrganization(fundingOrganization) : this.fundingOrganizationList.slice())
    //     );
    //  });
  }
  private filterfundingOrganization(name: string) {
    return this.fundingOrganizationList.filter(
      (fundingOrganization) =>
        fundingOrganization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 || fundingOrganization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  responsibleOrganizationList: OrganizationCrudServiceClass[] = [];
  responsibleOrganizationfilteredOption: Observable<any[]>;
  private getResponsibleOrganizationDetails(list: OrganizationCrudServiceClass[]) {
    list.forEach(data => {
      if (data.category.categoryNameEn == 'Funding Organization') {
        this.responsibleOrganizationList.push(data);
      }
    });
    this.responsibleOrganizationList = this.responsibleOrganizationList.sort((obj1, obj2) => {
      const name1 = obj1.names.toLowerCase();
      const name2 = obj2.names.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    });
    this.responsibleOrganizationfilteredOption = this.searchResponsibleOrganization.valueChanges
      .pipe(
        startWith(''),
        map(responsibleOrganization =>
          responsibleOrganization ? this.filterResponsibleOrganization(responsibleOrganization) : this.responsibleOrganizationList.slice())
      );
  }
  // this.responsibleOrganizationService
  //   .getResponsibleOrganizationList()
  //   .subscribe((data) => {
  //     this.responsibleOrganizationList = data;
  // if((this.EditId!=null || this.viewMoreId!=null|| this.faId!=null) && this.editResponse!=null){
  //   this.general_information_form.controls.responsible_organization.patchValue(this.editResponse.financial_agreement.responsibleOrganization);
  // }
  //     this.responsibleOrganizationfilteredOption =
  //       this.searchResponsibleOrganization.valueChanges.pipe(
  //         startWith(''),
  //         map((responsibleOrganization) =>
  //           responsibleOrganization
  //             ? this.filterResponsibleOrganization(responsibleOrganization)
  //             : this.responsibleOrganizationList.slice()
  //         )
  //       );
  //   });
  // }
  private filterResponsibleOrganization(name: string) {
    return this.responsibleOrganizationList.filter(
      (responsibleOrganization) =>
        responsibleOrganization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 || responsibleOrganization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  typeOfImplementationList: FinancingClass[];
  private getTypeOfImplementation() {
    this.financingService.getTypeOfImplementation().subscribe((data) => {
      this.typeOfImplementationList = data;
      for (let i = 0; i < this.typeOfImplementationList.length; i++) {
        let crtDt = this.typeOfImplementationList[i].createdOn;
        let updateDt = this.typeOfImplementationList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.typeOfImplementationList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.typeOfImplementationList[i].updateDifference = days_differenceForUpdate;
        }
        (this.typeOfImplementationList[i].difference) = days_difference;
      }
    });
  }

  currenyList: Currency[] = [];

  currencyfilteredOption: Observable<any[]>;
  currencyfilteredOptionCommitment: Observable<any[]>[] = [];
  flag_delete: boolean;
  private getCurrencyDetails() {
    // this.currencyService.getCurrencyDetails().subscribe(data => {
    // this.currenyList = data;

    // this.currencyfilteredOption =
    //   this.searchAllocationCurrency.valueChanges.pipe(
    //     startWith(''),
    //     map((currencyDAta) =>
    //       currencyDAta
    //         ? this.filterCurrency(currencyDAta)
    //         : this.currenyList.slice()
    //     )
    //   );
    // });

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
      this.currencyfilteredOption = this.searchAllocationCurrency.valueChanges
        .pipe(
          startWith(''),
          map(currency => currency ? this.filterCurrency(currency) : this.currenyList.slice())

        );


    });
  }
  private filterCurrency(name: string) {
    return this.currenyList.filter(
      (currencyData) =>
        currencyData.currency_fullname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
          .indexOf(name.toLowerCase()) !== -1 || currencyData.currency_shortname.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  currenyList2: Currency[];
  currencyfilteredOption2: Observable<any[]>;

  typeOfFinanceList: FinancingClass[];
  typeOfFinancefilteredOption: Observable<any[]>;
  private getTypeOfFinanceDetails() {
    this.financingService.getTypeOfFinance().subscribe((data) => {
      this.typeOfFinanceList = data;

      for (let i = 0; i < this.typeOfFinanceList.length; i++) {
        let crtDt = this.typeOfFinanceList[i].createdOn;
        let updateDt = this.typeOfFinanceList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.typeOfFinanceList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.typeOfFinanceList[i].updateDifference = days_differenceForUpdate;
        }
        (this.typeOfFinanceList[i].difference) = days_difference;
      }
      this.typeOfFinancefilteredOption =
        this.searchTypeOfFinance.valueChanges.pipe(
          startWith(''),
          map((typeOfFinanceDAta) =>
            typeOfFinanceDAta
              ? this.filterTypeOfFinance(typeOfFinanceDAta)
              : this.typeOfFinanceList.slice()
          )
        );
    });
  }
  private filterTypeOfFinance(name: string) {
    if (this.browserLang == 'en') {
      return this.typeOfFinanceList.filter(
        (typeOfFinanceData) =>
          typeOfFinanceData.typeOfFinanceName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .indexOf(name.toLowerCase()) !== -1
      );
    } else {
      return this.typeOfFinanceList.filter(
        (typeOfFinanceData) =>
          typeOfFinanceData.typeOfFinanceNamePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .indexOf(name.toLowerCase()) !== -1
      );
    }
  }

  meoResourceSourceList: FinancingClass[];
  meoResourceSourcefilteredOption: Observable<any[]>;
  private getMeoResourceSourceDetails() {
    this.financingService.getMeoResourceSource().subscribe((data) => {
      this.meoResourceSourceList = data;
      this.meoResourceSourcefilteredOption = this.commitment_form.controls[
        'meo_resource_source'
      ].valueChanges.pipe(
        startWith(''),
        map((meoResourceSourceDAta) =>
          meoResourceSourceDAta
            ? this.filterMeoResourceSource(meoResourceSourceDAta)
            : this.meoResourceSourceList.slice()
        )
      );
    });
  }
  private filterMeoResourceSource(name: string) {
    return this.meoResourceSourceList.filter(
      (meoResourceSourceData) =>
        meoResourceSourceData.meoResourceSourceName
          .toLowerCase()
          .indexOf(name.toLowerCase()) === 0
    );
  }
  displayMeoResource(id) {
    if (!id) return '';
    return this.meoResourceSourceList.find((x) => x.meoResourceSourceId == id)
      .meoResourceSourceName;
  }

  pillarPqgMeoList: FinancingClass[];
  private getPillarPqgMeo() {
    this.financingService.getPillarPqgMeo().subscribe((data) => {
      this.pillarPqgMeoList = data;
      if (this.pillarPqgMeoList.length > 0) {
        for (let obj of this.pillarPqgMeoList) {

          let pqgObj: Option = {
            value: obj.pillarPqgMeoId,
            viewValue: obj.pillarPqgMeoName,
            viewValuePt: obj.pillarPqgMeoNamePt,
            childOptions: []
          };

          if (obj.pillarPqgMeoId == '4' || obj.pillarPqgMeoId == '5' || obj.pillarPqgMeoId == '6') {
            this.priority_pillar_list[0].options.push(pqgObj);
          } else {
            this.priority_pillar_list[1].options.push(pqgObj);
          }
        }
      }
    });
  }
  filteredOptionProvinces: Observable<any[]>;
  provinceList1: Provinces[] = [];
  private getProvinces() {
    this.provincesService.getProvincesList().subscribe((data) => {
      this.provinceList1 = data;
      for (let i = 0; i < this.provinceList1.length; i++) {
        let crtDt = this.provinceList1[i].createdOn;
        let updateDt = this.provinceList1[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.provinceList1[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.provinceList1[i].updateDifference = days_differenceForUpdate;
        }
        (this.provinceList1[i].difference) = days_difference;
      }
      this.filteredOptionProvinces =
        this.searchTextBoxProvinces.valueChanges.pipe(
          startWith<string>(''),
          map((name) => this._filterdProvinces(name).sort())
        );
    });
  }
  private _filterdProvinces(name: string): Provinces[] {
    const filterValueProvinces = name;
    // Set selected values to retain the selected checkbox state
    this.setSelectedValuesProvinces();
    this.locationForm.controls.provinces.patchValue(
      this.selectedValuesProvinces
    );
    let filteredListProvinces = this.provinceList1.filter(
      (option) =>
        option.provinces_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(filterValueProvinces.toLowerCase()) !== -1
    );
    // return filteredListProvinces.sort((a, b) =>
    //   a.provinces_name > b.provinces_name
    //     ? 1
    //     : b.provinces_name > a.provinces_name
    //     ? -1
    //     : 0
    // );
    return filteredListProvinces;
  }
  setSelectedValuesProvinces() {
    if (
      this.locationForm.controls.provinces.value &&
      this.locationForm.controls.provinces.value.length > 0
    ) {
      this.locationForm.controls.provinces.value.forEach((e) => {
        if (this.selectedValuesProvinces.indexOf(e) == -1) {
          this.selectedValuesProvinces.push(e);
          this.selectedprovincename.push(
            this.provinceList1.find((x) => x.provinces_id === e).provinces_name
          );
        }
      });
    }
  }
  /**
   * Remove from selected values based on uncheck
   */
  selectionChangeProvince(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValuesProvinces.indexOf(event.source.value);
      this.selectedValuesProvinces.splice(index, 1);
      this.selectedprovincename.splice(index, 1);
    }
  }
  openProvinces(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextBoxProvinces.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchElementProvinces.nativeElement.focus();
    }
  }
  district!: Districts[];
  private getDistricts() {
    var provincesId = this.locationForm.controls['provinces'].value;

    this.districtsService
      .getDistrictByProvinceId(provincesId)
      .subscribe((data) => {
        this.district = data;
        if (this.browserLang == 'en') {
          this.district = this.district.sort((a, b) => (a.districts_name.toLowerCase() > b.districts_name.toLowerCase()) ? 1 : ((b.districts_name.toLowerCase() > a.districts_name.toLowerCase()) ? -1 : 0));
        }
        else {
          this.district = this.district.sort((a, b) => (a.districts_name.toLowerCase() > b.districts_name.toLowerCase()) ? 1 : ((b.districts_name.toLowerCase() > a.districts_name.toLowerCase()) ? -1 : 0));
        }
        for (let i = 0; i < this.district.length; i++) {

          let crtDt = this.district[i].createdOn;
          let updateDt = this.district[i].updatedOn;
          this.today = new Date();
          crtDt = new Date(crtDt);
          //calculate time difference
          var time_difference = this.today.getTime() - crtDt.getTime();
          //calculate days difference by dividing total milliseconds in a day
          var days_difference = time_difference / (1000 * 60 * 60 * 24);
          this.district[i].updateDifference = 15
          if (updateDt != null) {
            updateDt = new Date(updateDt);
            var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
            var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
            this.district[i].updateDifference = days_differenceForUpdate;
          }
          (this.district[i].difference) = days_difference;
        }
      });
  }

  strategicPqgMeo: FinancingClass[] = [];
  getStrategicPqgMeo() {
    let pillarPqgMeoId: number[] =
      this.general_information_form.controls['pillar_pqg_meo'].value;
      console.log("pillarPqgMeoId ",pillarPqgMeoId)
    if (pillarPqgMeoId != null && pillarPqgMeoId != undefined) {
      this.financingService
        .getStrategicPqgMeo(pillarPqgMeoId)
        .subscribe((data) => {
          this.strategicPqgMeo = data;
          if (this.editResponse != null) {
            if (this.editResponse.faResourceSource != null && this.editResponse.faResourceSource.strategicObjectivePqgMasterId != null && this.editResponse.faResourceSource.strategicObjectivePqgMasterId != "") {
              this.general_information_form.controls.strategic_objective_pqg_meo.patchValue(this.editResponse.faResourceSource.strategicObjectivePqgMasterId + '');
            }
          }
        });
    }
  }

  filteredEnvelopeReferenceOptions: Observable<string[]>;
  envelopeReferenceList: string[] = [];
  getEnvelopeReference(fundingOrgId: number, donorId: number) {

    this.financingService.getEnvelopeReferenceList(donorId, fundingOrgId).subscribe((data) => {
      this.allocation_form.controls.envelopeReference.patchValue(null);
      this.allocation_form.controls.envelopeAmountMzn.patchValue(null);
      this.allocation_form.controls.envelopeAmountUsd.patchValue(null);

      let select: string = "Select";
      this.envelopeReferenceList = data;
      this.envelopeReferenceList.splice(0, 0, select);
      if ((this.EditId != null || this.viewMoreId != null || this.financialAgreementId != null || this.viewDraftedFaId != null) && this.editResponse.financial_agreement.envelopeReference != null) {
        // this.general_information_form.controls.funding_organization.patchValue(+this.editResponse.financial_agreement.fundingOrganization);
        this.allocation_form.controls.envelopeReference.patchValue(this.editResponse.financial_agreement.envelopeReference);
        this.setValuesAccordingToEnvelope(this.allocation_form.controls.envelopeReference.value);
        this.editResponse.financial_agreement.envelopeReference = null;
      }

      this.filteredEnvelopeReferenceOptions =
        this.searchEnvelopeRefrence.valueChanges.pipe(
          startWith<string>(''),
          map((name) => this._filterdEnvelopeReference(name))
        );
    });
  }
  private _filterdEnvelopeReference(name: string) {
    return this.envelopeReferenceList.filter(
      (data) =>
        data.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  yearList: number[] = [];
  populateYear() {
    this.yearList = []; // to store list of years
    let startDate = this.general_information_form.controls.start_date.value;
    let endDate = this.general_information_form.controls.end_date.value;

    let startYear: number = 0;
    let endYear: number = 0;

    if (
      startDate != null &&
      startDate != undefined &&
      startDate != '' &&
      endDate != null &&
      endDate != undefined &&
      endDate != ''
    ) {
      //calculate no. of years
      startYear = Number(startDate.format("YYYY"));
      endYear = Number(endDate.format("YYYY"));
      //make the commitment tabledata empty
      // (this.commitment_form.controls.tableData as FormArray).clear();

      for (let year: number = startYear; year <= endYear; year++) {
        //push the year in yearList to show in year dropdown
        this.yearList.push(year);
      }

      // this.yearList.forEach(element => {
      //   this.addCommitmentTableRow();
      // });
    } else if ((startDate == null ||
      startDate == undefined ||
      startDate == '') ||
      (endDate == null ||
        endDate == undefined ||
        endDate == '')) {

      endYear = new Date().getFullYear() + 100;
      startYear = endYear - 200;
      //make the commitment tabledata empty
      // (this.commitment_form.controls.tableData as FormArray).clear();

      for (let year = startYear; year <= endYear; year++) {
        //push the year in yearList to show in year dropdown
        this.yearList.push(year);
      }
      this.yearList.sort((a, b) => b - a);
    }
    return this.yearList;
  }





  // **// Receive user input and send to search method**
  onKey(value) {
    // this.selectedCurrency = this.search(value);
  }

  // **// Filter the states list and send back to populate the selectedStates**
  search(value: string) {
    let filter = value.toLowerCase();

    // return this.cur.filter((option) =>
    //   option.currency_fullname.toLowerCase().startsWith(filter)
    // );
  }

  displayFn(id) {
    if (!id) return '';
    return this.financingSituationList.find((x) => x.financingSituationId == id)
      .financingSituationNameEn;
  }
  searchFinancingSituaion = new FormControl();
  searchTypeOfAid = new FormControl();
  searchDonor = new FormControl();
  searchFundingOrganization = new FormControl();
  searchResponsibleOrganization = new FormControl();
  searchAllocationCurrency = new FormControl();
  searchEnvelopeRefrence = new FormControl();
  searchTypeOfFinance = new FormControl();
  @ViewChild('searchprovinces') searchElementProvinces: ElementRef;
  searchTextBoxProvinces = new FormControl();
  searchBudgetSupport = new FormControl();

  budgetSupportList: BudgetSupport[];
  budgetSupportfilteredOption: Observable<any[]>;
  budgetSupportRule() {
    // if(this.general_information_form.controls.budgetSupportOptions.value==1){
    //   this.general_information_form.controls.responsible_organization.patchValue('6');
    // }else{
    //   this.general_information_form.controls.responsible_organization.reset();
    // }
  }
  getBudgetSupport() {
    this.financingService.getBudgetSupport().subscribe((data) => {
      this.budgetSupportList = data;
      this.budgetSupportfilteredOption = this.searchBudgetSupport.valueChanges.pipe(
        startWith(''),
        map((bs) =>
          bs ? this.filterBudgetSupport(bs) : this.budgetSupportList.slice()
        )
      );
    });
  }
  private filterBudgetSupport(name: string) {
    if (this.browserLang == 'en') {
      return this.budgetSupportList.filter(
        (bs) =>
          bs.nameEn.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    } else {
      return this.budgetSupportList.filter(
        (bs) =>
          bs.namePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    }
  }

  openCurrencySearch(index) {
    // Set search textbox value as empty while opening selectbox
    (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    )
      .get('searchCommitmentCurrency')
      .patchValue('');
  }
  clearCurrencySearch(e, index) {
    e.stopPropagation();
    (
      (this.commitment_form.get('tableData') as FormArray).at(
        index
      ) as FormGroup
    )
      .get('searchCommitmentCurrency')
      .patchValue('');
  }
  selectedValuesProvinces = [];
  selectedprovincename: String[] = [];

  pushDataInsideCommitment() {
    let startDateYear: number = 0;
    let endDateYear: number = 0;
    let differenceInYears: number = 0;
  }

  editGrantAmountMzn(value: string) {
    this.allocation_form.controls.grantEquivalentMzn.setValue(
      value.replace(/[^0-9.]+/g, '')
    );
  }
  editGrantAmountUsd(value: string) {
    this.allocation_form.controls.grantEquivalentUsd.setValue(
      value.replace(/[^0-9.]+/g, '')
    );
  }
  viewGrantAmountMzn(value) {
    this.allocation_form.controls.grantEquivalentMzn.setValue(
      this.currencyPipe.transform(value, ' ')
    );
  }
  viewGrantAmountUsd(value) {
    this.allocation_form.controls.grantEquivalentUsd.setValue(
      this.currencyPipe.transform(value, ' ')
    );
  }
  regex_amount_(e, id: string) {
    return (
      e.charCode === 0 ||
      (e.charCode >= 48 && e.charCode <= 57) ||
      (e.charCode == 46 &&
        (<HTMLInputElement>document.getElementById(id)).value.indexOf('.') < 0)
    );
  }

  convertUsdMzn(id: string): void {
    this.getValueByLang()
    if (id == 'grantEquivalentMzn') {
      this.bomozam.currency = 'USD';
      this.bomozam.amount =
        this.allocation_form.controls.grantEquivalentMzn.value;
    } else if (id == 'grantEquivalentUsd') {
      this.bomozam.currency = 'USD';
      this.bomozam.amount =
        this.allocation_form.controls.grantEquivalentUsd.value;
    }

    if (this.allocationExchangeResponse.response === 'Currency found') {
      if (id == 'grantEquivalentMzn') {
        let exchangeRateMznToUsd: number =
          1 / (this.allocationExchangeResponse.exchange_rate_mzn as number);
        this.allocation_form.controls.grantEquivalentUsd.patchValue(
          this.currencyPipe.transform(
            exchangeRateMznToUsd * this.bomozam.amount,
            ' '
          )
        );
      } else if (id == 'grantEquivalentUsd')
        this.allocation_form.controls.grantEquivalentMzn.patchValue(
          this.currencyPipe.transform(this.allocationExchangeResponse.amount_in_mzn, ' ')
        );
    }


    if (this.allocationExchangeResponse.response === 'Currency not found') {
      if (this.browserLang == 'en') {
        Swal.fire({
          title: 'The Currency for that year was not found in the Currency Exchange Administration page',
          confirmButtonText: `OK`,
        });
      } else {
        Swal.fire({
          title: 'A Moeda para o ano seleccionado não foi encontrada na página de Administração de Taxas de Câmbio',
          confirmButtonText: `OK`,
        });
      }

    }
  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }

  grantEquivalentFieldsVisible: boolean = false;
  showGrantEquivalentFields() {
    let currency: string =
      this.allocation_form.controls.currency_of_the_financing_agreement.value;
    let amount: string =
      this.allocation_form.controls.amount_allocated_in_financing_agreement
        .value;
    let typeOfFinance: string =
      this.allocation_form.controls.type_of_finance.value;
    let amountUsd: string =
      this.allocation_form.controls
        .amount_allocated_from_financing_agreement_in_usd.value;
    let amountMzn: string =
      this.allocation_form.controls
        .amount_allocated_from_the_financing_agreement_in_meticais.value;

    if (amount != null && amount != '') amount.trim();
    if (currency != null && currency != '') currency.trim();
    if (typeOfFinance != null && typeOfFinance != '') typeOfFinance.trim();

    if (
      amount != '' &&
      amount != undefined &&
      currency != '' &&
      currency != undefined &&
      typeOfFinance != '' &&
      typeOfFinance != undefined
    ) {
      this.grantEquivalentFieldsVisible = true;
      if (typeOfFinance == '41') {

        if (amountMzn != null && amountMzn != '') {
          this.allocation_form.controls.grantEquivalentMzn.patchValue(
            amountMzn
          );
          this.allocation_form.controls.grantEquivalentMzn.disable();
        }
        if (amountUsd != null && amountUsd != '') {
          this.allocation_form.controls.grantEquivalentUsd.patchValue(
            amountUsd
          );
          this.allocation_form.controls.grantEquivalentUsd.disable();
        }
        if (this.EditId != null && this.editResponse.financial_agreement != null) {
          if (this.editResponse.financial_agreement.amt_grant_equivalent_mzn != null && this.editResponse.financial_agreement.amt_grant_equivalent_usd != null) {
            let amt_grant_equivalent_mzn = this.editResponse.financial_agreement.amt_grant_equivalent_mzn;
            this.allocation_form.controls.grantEquivalentMzn.patchValue(this.currencyPipe.transform(amt_grant_equivalent_mzn, ' '));
            this.allocation_form.controls.grantEquivalentUsd.patchValue(this.currencyPipe.transform(this.editResponse.financial_agreement.amt_grant_equivalent_usd, ' '));
            this.editResponse.financial_agreement.amt_grant_equivalent_mzn = null;
            this.editResponse.financial_agreement.amt_grant_equivalent_usd = null;
          }
        }
      }
      else if (typeOfFinance != '41') {

        this.allocation_form.controls.grantEquivalentMzn.patchValue('');
        this.allocation_form.controls.grantEquivalentMzn.enable();
        this.allocation_form.controls.grantEquivalentUsd.patchValue('');
        this.allocation_form.controls.grantEquivalentUsd.enable();
        if (this.EditId != null && this.editResponse.financial_agreement != null) {
          if (this.editResponse.financial_agreement.amt_grant_equivalent_mzn != null && this.editResponse.financial_agreement.amt_grant_equivalent_usd != null) {
            this.allocation_form.controls.grantEquivalentMzn.patchValue(this.currencyPipe.transform(this.editResponse.financial_agreement.amt_grant_equivalent_mzn, ' '));
            this.allocation_form.controls.grantEquivalentUsd.patchValue(this.currencyPipe.transform(this.editResponse.financial_agreement.amt_grant_equivalent_usd, ' '));
            this.editResponse.financial_agreement.amt_grant_equivalent_mzn = null;
            this.editResponse.financial_agreement.amt_grant_equivalent_usd = null;
          }
        }
      }
    } else {
      this.grantEquivalentFieldsVisible = false;
    }
  }
  provName: string = "";
  provname(provId: number): string {
    if (this.provinceList1.length > 0) {
      this.provName = this.provinceList1.find(x => x.provinces_id == provId).provinces_name;
    }
    return this.provName;
  }
  compareCurrencyFlag: boolean = true;
  userPermission: number[] = [];
  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Disbursement List')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }
  disbursementDisplayedColumns: string[] = ['edit', 'disbursementReference', 'projectTitle', 'amount', 'currency', 'disbursementAmountMZN', 'disbursementAmountUSD'];

  disbursementDetails: DisbursementCrudService[] = [];
  disbursementdataSource = new MatTableDataSource<DisbursementCrudService>(this.disbursementDetails);
  totalDisbursementRows: number = 0;
  totalDisbursementAmntMzn: number = 0;
  totalDisbursementAmntUsd: number = 0;
  totalDisbursementAmnt: number = 0;
  disbursementAmountValueMZN: number = 0;
  disbursementAmountValueUSD: number = 0;
  disbursementAmountValue: number = 0;

  private getDisbursementDetails(financialAgreementId: number) {

    this.financingService.getDisbursementDetailsByFaId(financialAgreementId).subscribe(data => {
      this.disbursementDetails = data;
      this.totalDisbursementRows = this.disbursementDetails.length;
      this.totalDisbursementAmntUsd = 0;
      this.totalDisbursementAmntMzn = 0;
      this.totalDisbursementAmnt = 0;


      /* The below loop is for to find all total amount summation */
      for (let i = 0; i < this.disbursementDetails.length; i++) {
        if (this.disbursementDetails[i].disbursementAmountMZN != null) {
          this.disbursementAmountValueMZN = Number.parseFloat(this.disbursementDetails[i].disbursementAmountMZN.replaceAll(",", ""));
          this.totalDisbursementAmntMzn = this.totalDisbursementAmntMzn + this.disbursementAmountValueMZN;
        } else {
          this.totalDisbursementAmntMzn = this.totalDisbursementAmntMzn + 0;


        }
        if (this.disbursementDetails[i].disbursementAmountUSD != null) {
          this.disbursementAmountValueUSD = Number.parseFloat(this.disbursementDetails[i].disbursementAmountUSD.replaceAll(",", ""));
          this.totalDisbursementAmntUsd = this.totalDisbursementAmntUsd + this.disbursementAmountValueUSD;
        }
        else {
          this.totalDisbursementAmntUsd = this.totalDisbursementAmntUsd + 0;
        }
        if (this.disbursementDetails[i].amount != null) {
          this.disbursementAmountValue = Number.parseFloat(this.disbursementDetails[i].amount.replaceAll(",", ""));
          this.totalDisbursementAmnt = this.totalDisbursementAmnt + this.disbursementAmountValue;
        }
        else {
          this.totalDisbursementAmnt = this.totalDisbursementAmnt + 0;
        }
        //this.totalAmnt = this.totalAmnt + disbursementDetails[i].amount;
      }
      this.totalAmtMZNDisb = this.totalDisbursementAmntMzn;
      this.totalAmtUSDDisb = this.totalDisbursementAmntUsd;
      /* Add data in MatTableDataSource */
      this.disbursementdataSource.data = this.disbursementDetails;
      // setTimeout(() => {
      //   this.disbursementdataSource.sort = this.disbursementSort
      //   this.disbursementdataSource.paginator = this.disbursementPaginator
      // });
      this.findTotalAmountDisburse();
      return data;
    });
  }
  moveToSelectedTabDisbursement(disbursement_id: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-disbursement', disbursement_id]));
  }
  paymentDisplayedColumns: string[] = ['edit', 'paymentReference', 'stateBudget', 'amount', 'currency', "paymentAmountMZN", "paymentAmountUSD"];
  paymentDetails: PaymentCrudService[] = [];
  totalAmntMZNPayment: number = 0;
  totalAmntUsdPayment: number = 0;
  totalAmntPayment: number = 0;
  amountValuePayment: number = 0;
  amountValueMZNPayment: number = 0;
  amountValueUSDPayment: number = 0;
  totalRowsPayment: number = 0;
  paymentdataSource = null;
  private getPaymentDetails(financialAgreementId: number) {
    this.financingService.getPaymentDetailsByFaId(financialAgreementId).subscribe(data => {
      this.paymentDetails = data;
      this.totalRowsPayment = this.paymentDetails.length;
      this.totalAmntUsdPayment = 0;
      this.totalAmntMZNPayment = 0;
      this.totalAmntPayment = 0;
      for (let i = 0; i < this.paymentDetails.length; i++) {
        if (this.paymentDetails[i].amount != null)
          this.amountValuePayment = Number.parseFloat(this.paymentDetails[i].amount.replaceAll(",", ""));
        this.totalAmntPayment = this.totalAmntPayment + this.amountValuePayment;
        if (this.paymentDetails[i].paymentAmountMZN != null)
          this.amountValueMZNPayment = Number.parseFloat(this.paymentDetails[i].paymentAmountMZN.replaceAll(",", ""));
        this.totalAmntMZNPayment = this.totalAmntMZNPayment + this.amountValueMZNPayment;
        if (this.paymentDetails[i].paymentAmountUSD != null)
          this.amountValueUSDPayment = Number.parseFloat(this.paymentDetails[i].paymentAmountUSD.replaceAll(",", ""));
        this.totalAmntUsdPayment = this.totalAmntUsdPayment + this.amountValueUSDPayment;
        this.totalAmtMZNPmt = this.totalAmntMZNPayment;
        this.totalAmtUSDPmt = this.totalAmntUsdPayment;
      }
      /* Add data in MatTableDataSource */
      this.paymentdataSource.data = this.paymentDetails;

      setTimeout(() => {
        this.paymentdataSource.sort = this.paymentSort
        this.paymentdataSource.paginator = this.paymentPaginator
      });
      this.findTotalAmountPayment();
      return data;
    });
  }
  moveToSelectedTabPayment(payment_id: string) {
    localStorage.setItem("EditPayment", "EditPayment");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-payment', payment_id]));
  }
  viewMorePayment(payment_id: any) {

    localStorage.setItem("ViewMorePayment", "ViewMorePayment");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-payment', payment_id]));

  }
  openDialogPayment(payment_id: any) {
    localStorage.setItem("paymentId_vm", payment_id);
    const dialogRef = this.dialog.open(ViewTableModalPaymentComponent, {
      disableClose: true,
    });
  }
  opensweetalertDeletePayment(payment_id: any) {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.paymentCrud.deleteById(payment_id).subscribe(data => {
          this.paymentDetails = data;
          // this.findTotalAmountPayment();
          this.totalRowsPayment = this.paymentDetails.length;
          this.getPaymentDetails(this.EditId);
          /* Add data in MatTableDataSource */
          // this.paymentdataSource = new MatTableDataSource<PaymentCrudService>(this.paymentDetails);

        },
          error => console.log(error));
        this.savePaymentDeleteAlert();
        if (this.browserLang == 'en')
          Swal.fire('Deleted successfully', '', 'success')
        else
          Swal.fire('Apagado com sucesso', '', 'success')
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  userNameForNotification: string = "Charlie Adams"; //This field will be softcoded later.
  userGroupForNotification: string = "DNGDP Admin"; //This field will be softcoded later.
  //notification alert for execute on save funding
  saveFundingInsertAlert(resMsg: string) {
    this.getValueByLang();
    if (this.EditId == null) {
      if (this.browserLang == 'en') {
        resMsg = 'Submitted successfully'
      } else {
        resMsg = 'Submetido com sucesso'
      }
    } else {
      if (this.browserLang == 'en') {
        resMsg = 'Updated successfully'
      } else {
        resMsg = 'Actualizado com sucesso'
      }
    }
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Financial Agreement Reference ID "'
      + this.general_information_form.controls['donor_funding_reference'].value
      + '" created on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Financial Agreement Reference  "'
      + this.general_information_form.controls['donor_funding_reference'].value
      + '" with Title "'
      + this.general_information_form.controls['funding_donor_title'].value
      + ' and Id: ' + this.financialAgreementId
      + '" has been created by user "' + this.userNameForNotification
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-funding\\';

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    // notificationDetails.notificationMsg = this.userName + " has create financial agreement on " + (todayTime + '').substring(0, 24);
    notificationDetails.notificationMsg = "A new Financial Agreement has been registered and saved on " + (todayTime + '').substring(0, 24);
    notificationDetails.notificationMsgPt = "Um novo Acordo de Financiamento foi registado e salvo sobre " + (todayTime + '').substring(0, 24);

    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      Swal.fire(resMsg, '', 'success')
        .then(() => {
          this.router.navigate(['/admin/view-funding']);
        });
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info')
      // .then(() => {
      this.router.navigate(['/admin/view-funding']);
      // });
    });
  }
  saveFundingAsOnBudgetAlert() {
    if (this.general_information_form.controls['state_budget'].value == 1) {
      let notificationDetails: Notification = new Notification();
      let todayTime = new Date();
      notificationDetails.notificationGroup = this.userGroupForNotification;
      notificationDetails.updatedBy = this.userNameForNotification;
      // notificationDetails.notificationMsg = this.userName + " has create a financial agreement as On-Budget on " + (todayTime + '').substring(0, 24);
      notificationDetails.notificationMsg = "A Financial Agreement is recorded as On-Budget on " + (todayTime + '').substring(0, 24);
      notificationDetails.notificationMsgPt = "Um Acordo de Financiamento foi registado como Dentro do Orçamento sobre " + (todayTime + '').substring(0, 24);
      notificationDetails.updatedOn = todayTime;
      this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      });
    }
  }
  saveFundingAsOnCutOffCutAlert() {
    if (this.general_information_form.controls['state_budget'].value == 1) {
      let notificationDetails: Notification = new Notification();
      let todayTime = new Date();
      notificationDetails.notificationGroup = this.userGroupForNotification;
      notificationDetails.updatedBy = this.userNameForNotification;
      if (this.general_information_form.controls['treasury_single_account'].value == 1) {
        notificationDetails.notificationMsg = "On-CUT Financial Agreement is recorded on " + (todayTime + '').substring(0, 24) + " by " + this.userName;
      }
      else if (this.general_information_form.controls['treasury_single_account'].value == 2) {
        notificationDetails.notificationMsg = "Off-CUT Financial Agreement is recorded on " + (todayTime + '').substring(0, 24) + " by " + this.userName;
      }
      notificationDetails.updatedOn = todayTime;
      this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      });
    }
  }
  updateFundingAlert(resMsg: string) {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Financial Agreement Reference ID "'
      + this.general_information_form.controls['donor_funding_reference'].value
      + '" edited on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Financial Agreement Reference  "'
      + this.general_information_form.controls['donor_funding_reference'].value
      + '" with Title "'
      + this.general_information_form.controls['funding_donor_title'].value
      + ' and Id: ' + this.financialAgreementId
      + '" has been edited by user "' + this.userNameForNotification
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-funding\\' + this.EditId;

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    // notificationDetails.notificationMsg = this.userName + " has update financial agreement on " + (todayTime + '').substring(0, 24);
    notificationDetails.notificationMsg = "On-CUT/Off-CUT Financial Agreement is recorded on " + (todayTime + '').substring(0, 24);
    notificationDetails.notificationMsgPt = "Um Acordo de Financiamento foi registado como On-CUT / Off-CUT sobre " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      Swal.fire(resMsg, '', 'success').then(() => {
        this.router.navigate(['/admin/view-funding']);
      });
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info').then(() => {
      this.router.navigate(['/admin/view-funding']);
      // });
    });
  }
  savePaymentDeleteAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();
    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    notificationDetails.notificationMsg = this.userNameForNotification + " has deleted payment on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    });
  }
  totalAmtMZNDisb: number = 0;
  totalAmtUSDDisb: number = 0;

  private findTotalAmountDisburse() {
    this.disbursement_form.controls.total_amount_disbursed_in_meticais.patchValue(this.currencyPipe.transform(this.totalAmtMZNDisb, " "));
    this.disbursement_form.controls.total_amount_disbursed_in_usd.patchValue(this.currencyPipe.transform(this.totalAmtUSDDisb, " "));
    let disbursementFee = this.totalAmtMZNDisb / this.allocatedAmountMzn;
    if (disbursementFee == null || disbursementFee == Infinity || isNaN(disbursementFee)) {
      disbursementFee = 0;
    }
    this.disbursement_form.controls.disbursement_fee.patchValue(this.decimalPipe.transform(disbursementFee) + ' %');

  }
  totalAmtMZNPmt: number = 0;
  totalAmtUSDPmt: number = 0;
  private findTotalAmountPayment() {
    this.payment_form.controls['amount_paid_in_meticais'].setValue(this.currencyPipe.transform(this.totalAmtMZNPmt, " "));
    this.payment_form.controls['amount_paid_in_usd'].setValue(this.currencyPipe.transform(this.totalAmtUSDPmt, " "));
    let paymentFee = this.totalAmtMZNPmt / this.allocatedAmountMzn;
    this.payment_form.controls['financial_execution_rate'].setValue(this.decimalPipe.transform((paymentFee == null || paymentFee == Infinity || isNaN(paymentFee)) ? 0 : paymentFee) + ' %');
  }

  editDraftData() {
    this.auto_save_as_draft_flag = false;
    this.financialAgreementId = this.SaveAsDraft.value;
    this.financingService.getFinancialAgreementFromDraftForEditById(this.financialAgreementId).subscribe((data) => {
      this.editResponse = data;
      this.setValuesToFormField();
    })
  }
  checkData() {
    this.getValueByLang()
    if (this.saveAsDraftList.length == 0) {
      if (this.browserLang == 'en')
        Swal.fire('No Data Present Inside View Save As Draft', '', 'error');
      else
        Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error');
    }
  }
  checkDuplicateFundingDonorTitle(name: string) {
    this.getValueByLang()
    if (this.financialAgreementId != null && this.financialAgreementId > 0) {
      this.financingService.checkDuplicateFundingDonorTitleOnUpdate(name, this.financialAgreementId).subscribe(response => {
        if (response == true) {
          this.general_information_form.controls.funding_donor_title.reset();
          if (this.browserLang == 'en') {
            Swal.fire(
              'This name already exists, try something else.',
              '',
              'error'
            );
          } else {
            Swal.fire(
              'Este nome já existe, tente outra coisa.',
              '',
              'error'
            );
          }

        }
      })
    } else if (this.financialAgreementId == null) {
      this.financingService.checkDuplicateFundingDonorTitle(name).subscribe(response => {
        if (response == true) {
          this.general_information_form.controls.funding_donor_title.reset();
          if (this.browserLang == 'en') {
            Swal.fire(
              'This name already exists, try something else.',
              '',
              'error'
            );
          } else {
            Swal.fire(
              'Este nome já existe, tente outra coisa.',
              '',
              'error'
            );
          }

        }
      })
    }
  }

  checkDuplicateFundingDonorReference(name: string, fundingOrg: number) {
    this.getValueByLang();
    let refName = this.general_information_form.controls.funding_organization.value;
    let fundOrg = this.general_information_form.controls.funding_organization.value;
    if (refName != null && refName != undefined && refName != '' && fundOrg != null && fundOrg != undefined && fundOrg != '') {
      if (this.financialAgreementId != null && this.financialAgreementId > 0) {
        this.financingService.checkDuplicateFundingDonorReferenceOnUpdate(name, fundingOrg, this.financialAgreementId).subscribe(response => {
          if (response == true) {
            this.general_information_form.controls.donor_funding_reference.reset();
            if (this.browserLang == 'en') {
              Swal.fire(
                'This Donor Funding Reference name already exists, try something else.',
                '',
                'error'
              );
            } else {
              Swal.fire(
                'Esta Referência do Financiamento do Doador já existe',
                '',
                'error'
              );
            }

          }
        })
      } else if (this.financialAgreementId == null) {
        this.financingService.checkDuplicateFundingDonorReference(name, fundingOrg).subscribe(response => {
          if (response == true) {
            this.general_information_form.controls.donor_funding_reference.reset();
            if (this.browserLang == 'en') {
              Swal.fire(
                'This Donor Funding Reference name already exists, try something else.',
                '',
                'error'
              );
            } else {
              Swal.fire(
                'Esta Referência do Financiamento do Doador já existe',
                '',
                'error'
              );
            }

          }
        })
      }
    }

  }
  sumOfEnvelopeAmountMzn: number = 0;
  sumOfEnvelopeAmountUsd: number = 0;
  totalEnvelopeAmountMzn: number = 0;
  totalEnvelopeAmountUsd: number = 0;
  totalUnprogrammedFunds: number = 0;
  totalprogrammedFunds: number = 0;
  envRefCurrency: string = "";
  setValuesAccordingToEnvelope(envRef: string) {
    // this.allocation_form.controls.amount_allocated_in_financing_agreement.reset();
    // this.allocation_form.controls.currency_of_the_financing_agreement.reset();
    // this.allocation_form.controls.exchange_rates_in_usd.reset();
    // this.allocation_form.controls.exchange_rates_in_mzn.reset();
    // this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.reset();
    // this.allocation_form.controls.amount_allocated_from_financing_agreement_in_usd.reset();
    // this.allocation_form.controls.grantEquivalentMzn.reset();
    // this.allocation_form.controls.grantEquivalentUsd.reset();

    if (envRef != null && envRef != undefined && envRef != "Select"
      && (this.EditId != null || this.viewMoreId != null || this.viewDraftedFaId != null)
      && (this.editResponse.financial_agreement.envelopeReference != null)) {
      this.financingService.getEnvelopeDetailsByEnvelopeRef(envRef).subscribe(response => {
      
        this.totalUnprogrammedFunds = response.totalUnprogrammedFunds;
        this.totalprogrammedFunds = response.totalProgrammedFunds;
        if (response.currencyList.currency_shortname != null) {
          this.envRefCurrency = response.currencyList.currency_shortname;
        }
        this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(response.currencyList.currency_shortname);
        // this.allocation_form.controls.currency_of_the_financing_agreement.disable();
        this.sumOfEnvelopeAmountMzn = 0;
        this.sumOfEnvelopeAmountUsd = 0;
        this.totalEnvelopeAmountMzn = 0;
        this.totalEnvelopeAmountUsd = 0;
        // this.sumOfEnvelopeAmountMzn=this.getSumOfEnvelopeAmount(response.envelopeAllTableData);
        this.sumOfEnvelopeAmountMzn = response.totalUnfundedAmountMzn + response.totalEnvelopeAmountMzn;
        this.sumOfEnvelopeAmountUsd = response.totalUnfundedAmountUsd + response.totalEnvelopeAmountUsd;
        this.totalEnvelopeAmountMzn = response.totalEnvelopeAmountMzn;
        this.totalEnvelopeAmountUsd = response.totalEnvelopeAmountUsd;

        // if(this.sumOfEnvelopeAmountMzn < 0){
        //   Swal.fire('Maximum MZN Amount already allocated','Maximum MZN amount has been already alocated for this Envelope.','info')
        // }
        // if(this.sumOfEnvelopeAmountUsd < 0){
        //   Swal.fire('Maximum USD Amount already allocated','Maximum USD amount has been already alocated for this Envelope.','info')
        // }
        this.allocation_form.controls.envelopeAmountMzn.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' '));
        this.allocation_form.controls.envelopeAmountUsd.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountUsd, ' '));

        if (this.editResponse.financial_agreement.amt_local_currency_agreement != null && this.editResponse.financial_agreement.amt_local_currency_agreement != "null") {
          this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(+this.editResponse.financial_agreement.amt_local_currency_agreement, ' '));
        }

        if (this.editResponse.financial_agreement.financing_agreement_currency != null) {
          this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(this.currenyList.find(x => x.currency_id == this.editResponse.financial_agreement.financing_agreement_currency).currency_shortname);
        }
        // this.envRefObj.currency
        this.getCurrency();
        // let sumOfCommitmentAmountMzn: number = this.commitmentAmtMznArr.length>0 ? this.commitmentAmtMznArr.reduce((partial_sum, a) => partial_sum + a, 0):0;
        // let allocationAmountMzn: number = (this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value!=null || this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value!='')
        // ?Number((this.allocation_form.controls.amount_allocated_from_the_financing_agreement_in_meticais.value as string).replace(/[^0-9.]+/g, '')):0;
        // if(sumOfCommitmentAmountMzn>allocationAmountMzn){
        //   Swal.fire('Info','Hello','info');
        // }
        // if((this.editResponse.commitment as Array<any>).length>0){
        //   let i = 0;
        //   (this.editResponse.commitment as Array<any>).forEach( element => {
        //     this.addCommitmentTableRow();
        //     ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
        //       .get('year').patchValue(+this.editResponse.commitment[i].year);
        //       ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
        //       .get('amounts_of_annual_commitments_agreement_currency').patchValue(this.editResponse.commitment[i].amounts_of_annual_commitments_agreement_currency);
        //       ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
        //       .get('currencyName').patchValue(this.editResponse.commitment[i].currencyName);
        //       this.getCurrencyCommitment(i);
        //       i++;
        //     });
        // }
      })
      this.editResponse.financial_agreement.envelopeReference = null
    }
    else if (envRef != null && envRef != undefined && envRef != "Select") {
      this.financingService.getEnvelopeDetailsByEnvelopeRef(envRef).subscribe(response => {
        console.log("env response:", response);
        this.totalUnprogrammedFunds = response.totalUnprogrammedFunds;
        this.totalprogrammedFunds = response.totalProgrammedFunds;
        if (response.currencyList.currency_shortname != null) {
          this.envRefCurrency = response.currencyList.currency_shortname;
        }
        this.allocation_form.controls.currency_of_the_financing_agreement.patchValue(response.currencyList.currency_shortname);
        // this.allocation_form.controls.currency_of_the_financing_agreement.disable();
        this.sumOfEnvelopeAmountMzn = 0;
        this.sumOfEnvelopeAmountUsd = 0;
        // this.sumOfEnvelopeAmountMzn=this.getSumOfEnvelopeAmount(response.envelopeAllTableData);
        this.sumOfEnvelopeAmountMzn = response.totalUnfundedAmountMzn;
        this.sumOfEnvelopeAmountUsd = response.totalUnfundedAmountUsd;
        // if(this.sumOfEnvelopeAmountMzn < 0){
        //   Swal.fire('Maximum MZN Amount already allocated','Maximum MZN amount has been already alocated for this Envelope.','info')
        // }
        // if(this.sumOfEnvelopeAmountUsd < 0){
        //   Swal.fire('Maximum USD Amount already allocated','Maximum USD amount has been already alocated for this Envelope.','info')
        // }
        this.allocation_form.controls.envelopeAmountMzn.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' '));
        this.allocation_form.controls.envelopeAmountUsd.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountUsd, ' '));
        // this.allocation_form.controls.amount_allocated_in_financing_agreement.patchValue(this.currencyPipe.transform(this.sumOfEnvelopeAmountMzn, ' '));
        this.getCurrency();
      })
    } else if (envRef == "Select" || envRef == null) {
      // this.allocation_form.controls.envelopeReference.reset();
      // this.allocation_form.controls.currency_of_the_financing_agreement.enable();
      // this.allocation_form.controls.currency_of_the_financing_agreement.reset();
      this.allocation_form.controls.envelopeAmountMzn.patchValue(null);
      this.allocation_form.controls.envelopeAmountUsd.patchValue(null);

    }
  }
  envRefObj: BankOfMozambique = new BankOfMozambique();
  // getSumOfEnvelopeAmount(envelopeAllTableData: EnvelopeTableData[]): number {
  //   envelopeAllTableData.forEach(element => {
  //     this.sumOfEnvelopeAmountMzn = this.sumOfEnvelopeAmountMzn + Number(element.amount);
  //   });
  //   return this.sumOfEnvelopeAmountMzn;
  // }
  organizationList: OrganizationCrudServiceClass[] = [];
  private getOrganization() {
    this.organizationService.getOrganizationList().subscribe(data => {
      this.organizationList = data;
      this.getResponsibleOrganizationDetails(this.organizationList);
    });
  }

  publish() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to publish ?' : 'Você quer publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Publish` : 'Publicar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let financialAgreementId: number[] = [this.editResponse.financial_agreement.funding_id];

        this.financingService.publishById(financialAgreementId).subscribe(data => {
          if (data.status == 200) {
            Swal.fire(data.responseMessage, '', 'success').then((result) => {
              if (result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-financialAgreement']);
            });
          } else {
            Swal.fire(data.responseMessage, '', 'info');
          }
        });
      }
    });
  }
  enableUploadBtn() {
    let refNm = this.general_information_form.controls.funding_donor_title.value;
    if (refNm != null || refNm != '')
      localStorage.setItem("fundingRefNM", refNm);
    else
      localStorage.setItem("fundingRefNM", null);
  }
  discard() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to discard ?' : 'Você quer descartar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Discard` : 'Descartar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let financialAgreementId: number[] = [this.editResponse.financial_agreement.funding_id];

        this.financingService.discardById(financialAgreementId).subscribe(data => {
          if (data.status == 200) {
            Swal.fire(data.responseMessage, '', 'success');
          } else {
            Swal.fire(data.responseMessage, '', 'info');
          }
        });
      }
    });
  }
  @ViewChild('matRefProvinces') matRefProvinces: MatSelect;
  @ViewChild('matRefDistricts') matRefDistricts: MatSelect;
  resetLocation() {
    this.matRefProvinces.options.forEach((data: MatOption) => data.deselect());
    this.matRefDistricts.options.forEach((data: MatOption) => data.deselect());
    this.selectedValuesProvinces = [];
    this.selectedprovincename = [];
  }
  //this method is called when currency of allocation is changed. 
  //it sets the commitment currecy to allocation currency
  setCommitmentCurrency() {
    let allocationCurrencyName = this.allocation_form.controls.currency_of_the_financing_agreement.value;
    let commitmentLength = (this.commitment_form.controls.tableData as FormArray).length;
    //patch allocation currency to new row.
    if (allocationCurrencyName != null) {
      //ittirating through all rows and changing in required row
      for (let i = 0; i < commitmentLength; i++) {
        let commitmentCurrencyName = ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
          .get('currencyName').value;
        
        //if any row has different currency then change it to allocated currency
        if (commitmentCurrencyName != allocationCurrencyName) {
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('currencyName')
            .patchValue(allocationCurrencyName);
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('amounts_of_annual_commitments_in_meticais')
            .patchValue('');
          ((this.commitment_form.controls.tableData as FormArray).at(i) as FormGroup)
            .get('amounts_of_annual_commitments_in_usd')
            .patchValue('');
        }
        //getting amount mzn and amount usd for the new currency 
        this.getCurrencyCommitment(i);
      }
      //calcuating sum of amount mzn and usd
      this.sumOfCommitmentAmountMzn = this.currencyPipe.transform(this.getSumOfCommitmentAmountMzn(), ' ');
      this.sumOfCommitmentAmountUsd = this.currencyPipe.transform(this.getSumOfCommitmentAmountUsd(), ' ');
    }
  }

  /* If we select add new donor in funding organization then it will redirect to DialogBoxComponent */
  openExchangeRateAdministration() {
    let dialogRef = this.dialog.open(ExchangeRateAdministrationComponent);
    localStorage.setItem("FAExchangeRatePopUp", "Yes");
  }

  getIframeDtls(){
    let nameOfFinancialAgreement=this.general_information_form.controls['funding_donor_title'].value;
    let userId=localStorage.getItem('userId');
    let userName=localStorage.getItem('userName');
    let provinceId=this.locationForm.controls['provinces'].value;
    let districtId=this.locationForm.controls['districts'].value;
    let donorPartner=this.general_information_form.controls.donor.value;
    let responsible_organization=this.general_information_form.controls.responsible_organization.value;
    let funding_organization=this.general_information_form.controls.funding_organization.value;
    console.log("nameOfFinancialAgreement ",nameOfFinancialAgreement," userId ",userId," userName ",userName
    ," provinceId ",provinceId," districtId ",districtId," donorPartner ",donorPartner," responsible_organization ",responsible_organization
    ," funding_organization ",funding_organization);

    // let newUrl = "https://dev.mozgis.gov.mz/portal/apps/webappviewer/index.html?"+
    // "id=1b70e0339e684d1c8eba7868bb0efbf3&amp;a=1332&amp;b=Escola+da+MAtola&amp;"+
    // "c=233435&amp;d="+nameOfFinancialAgreement+"&amp;e="+userId+"&amp;f="+userName+"&amp;g="+provinceId+"&amp;h="+districtId+"&amp;i=23&amp;"+
    // "j=C&amp;k="+donorPartner+"&amp;l="+responsible_organization+"&amp;m="+funding_organization;

    // document.getElementById('iframeDtls').setAttribute("src",newUrl);

  }
  mpoList:any;
  mpoResposeJson:any;
  mpoResposeArray=new Array();
  mpoProgrammaticCode:string;
  getMpoData(){
    let stateBudget=this.general_information_form.controls.state_budget.value;
    let startYr;
    let endYr;
    if(this.general_information_form.controls['start_date'].value!=NaN){
    startYr= Number.parseInt(this.datepipe.transform(this.general_information_form.controls['start_date'].value,'yyyy'))}
    if(this.general_information_form.controls['end_date'].value!=NaN){
    endYr=Number.parseInt(this.datepipe.transform(this.general_information_form.controls['end_date'].value, 'yyyy'))}
    console.log("stB ",stateBudget," staYr ",startYr," endYr ",endYr)
    if(stateBudget==1 && startYr!=NaN && endYr!=NaN){
    this.fundingService.getMpoData(startYr,endYr).pipe(first()).subscribe(
      data => {
        console.log("data ",JSON.stringify(data));
        console.log(data["2022"]);
        this.mpoList=data;
        var selectedFundingOrganisation =this.fundingOrgNm;// get from selected one 
         this.mpoResposeJson = {};
         this.mpoResposeArray=[];
         console.log("selectedFundingOrganisation::",selectedFundingOrganisation);
  for(var key_ in data){
    var contentArr = data[key_].success.content;
    
    for(var i=0;i<contentArr.length;i++)
    {
      var json = contentArr[i];
      if(json.foundingSourceDescription == selectedFundingOrganisation)
      {
        this.mpoResposeJson[key_] = json.value;
        this.mpoResposeArray.push(json.value);
        this.commitment_form.controls.meo_resource_source.patchValue(json.codeResourceSource)
        this.mpoProgrammaticCode=json.codeProgrammatic;
        break;
      }
    }
  }
  this.mpoResposeJson=JSON.stringify(this.mpoResposeJson);
  console.log("this.mpoResposeJson:",this.mpoResposeJson);
  
  //   console.log("this.mpoResposeArray ",this.mpoResposeArray[0])
  
  
 
        // plotDetailsFromJson(data,selectedFundingOrganisation);
       
      });
  }}
}

function plotDetailsFromJson(data,selectedFundingOrganisation)
{
  var finalJson = {};
  for(var key_ in data){
    var contentArr = data[key_].success.content;
    
    for(var i=0;i<contentArr.length;i++)
    {
      var json = contentArr[i];
      if(json.foundingSourceDescription == selectedFundingOrganisation)
      {
        finalJson[key_] = json.value;
        break;
      }
    }
  }
  console.log(finalJson);
}
function toDegreesMinutesAndSeconds(coordinate) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return degrees + '°' + minutes + '’' + seconds + '″';
}

// function convertDMS(lat, lng) {
//   var latitude = toDegreesMinutesAndSeconds(lat);
//   var latitudeCardinal = lat >= 0 ? 'N' : 'S';

//   var longitude = toDegreesMinutesAndSeconds(lng);
//   var longitudeCardinal = lng >= 0 ? 'E' : 'W';

//   return {
//     latitude: latitude + ' ' + latitudeCardinal,
//     longitude: longitude + ' ' + longitudeCardinal,
//   };
// }

enum IATILocation {
  'Administrative Region',
  'Populated Place',
  'Structure',
  'Other topographical feature',
}
enum IATIAccuracy {
  'Exact',
  'Approximate',
}
export interface LocationData {
  geographicalReference: string;
  iatiLocation: string;
  iatiAccuracy: string;
  coordinates: string;
  geolocationComments: string;
}


export class BudgetSupport {
  budgetMasterId!: number;
  nameEn!: String;
  namePt!: String;
  status!: String;
}
export class Comment {
  comment: String;
  commentedBy;
  commentedOn;
}