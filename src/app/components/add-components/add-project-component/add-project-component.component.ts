/*
* Author Sourav Kumar Nayak
* This page is for adding project purpose
* This page is belongs to Project module
*/

//import statements are started
import { Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Provinces } from 'src/app/Service-Class/provinces';
import { ProvincesService } from 'src/app/Service/provinces.service'
import { Districts } from 'src/app/Service-Class/districts';
import { DistrictsService } from 'src/app/Service/districts.service';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationService } from 'src/app/Service/organization.service';
import { IatiLocation } from 'src/app/Service-Class/iati-location';
import { IatiLocationService } from 'src/app/Service/iati-location.service';
import { Donor } from 'src/app/Service-Class/donor';
import { DonorService } from 'src/app/Service/donor.service';
import { ProjectSituationService } from 'src/app/Service/project-situation.service';
import { ProjectSituation } from 'src/app/Service-Class/project-situation';
import { SustainableDevelopmentGoal } from 'src/app/Service-Class/sustainable-development-goal';
import { SustainableDevelopmentGoalService } from 'src/app/Service/sustainable-development-goal.service';
import { SustainableDevelopmentTarget } from 'src/app/Service-Class/sustainable-development-target';
import { SustainableDevelopmentTargetService } from 'src/app/Service/sustainable-development-target.service';
import { ResponsibleOrganizationService } from 'src/app/Service/responsible-organization.service';
import { PurposeDACCRSService } from 'src/app/Service/purpose-dac-crs.service';
import { PurposeDACCRS } from 'src/app/Service-Class/purpose-dac-crs';
import { BankOfMozambiqueService } from 'src/app/Service/bank-of-mozambique.service';
import { BankOfMozambique } from 'src/app/Service-Class/bank-of-mozambique';
import { SnipPopupComponent } from '../../view-more-components/snip-popup/snip-popup.component';
import { Project } from 'src/app/model/project';
import { ImplementingOrganizationService } from 'src/app/Service/implementing-organization.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { MarkerTableData, OdaAllocation, ProjectCrud, TableComments, TableIndividualOrganizaton } from 'src/app/Service-Class/project-crud';
import { ProjectCrudService } from 'src/app/Service-Application/project-crud.service';
import { MarkerMaster } from 'src/app/Service-Class/marker-master';
import { MarkerMasterService } from 'src/app/Service/marker-master.service';
import { CurrencyService } from 'src/app/Service/currency.service';
import { Currency } from 'src/app/Service-Class/currency';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { FinancialAgreementObj } from 'src/app/Service-Class/project-model';
import { IndividualCrudServiceService } from 'src/app/Service/individual-crud-service.service';
import { IndividualCrudServiceClass } from 'src/app/Service-Class/individual-crud-service-class';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Covid19Master, GenderEqualityMarker, RioMarkerBioDiversity, RioMarkerClimateChangeAdaption, RioMarkerClimateChangeDesertification, RioMarkerClimateChangeMitigation } from 'src/app/Service/marker-master-options';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { FinancingProvinceDistrict } from 'src/app/Service-Class/financing-province-district';
import { MatSelect } from '@angular/material/select';
import { Comment } from '../add-funding/add-funding.component';
import { MatOption } from '@angular/material/core';
import { FundingOrganization, ProjectFinancialAgreement, ProjectImplOrg, ProjectMarker, ProjectModel, ProjectOdaAllocation, ProjectSustainableDevelopementGoal, ProjectSustainableDevelopementTarget, ResponsibleOrganization } from 'src/app/Service-Class/project-model';
import { I } from '@angular/cdk/keycodes';
//ending of all import statements

//@Component decorator for providing meta-data about selector tag, html file and css which are associated with AddProjectComponentComponent
@Component({
  selector: 'app-add-project-component',
  templateUrl: './add-project-component.component.html',
  styleUrls: ['./add-project-component.component.css']
})
//starting of AddProjectComponentComponent class
export class AddProjectComponentComponent implements OnInit, OnDestroy {

  //projectForm is the formgroup for Project General Information expainson
  projectForm: FormGroup;
  //projectForm2 is the formgroup for Project Financial Information / Allocation expainson
  projectForm2: FormGroup;
  //projectFormCommitment is the formgroup for Project Financial Information / Commitment expainson
  projectFormCommitment: FormGroup;
  //projectFormDisbursements is the formgroup for Financial Information / Disbursement
  projectFormDisbursements: FormGroup;
  //projectFormPayments is the formgroup for Financial Information / Payment
  projectFormPayments: FormGroup;

  implOrgMandatoryFlag = false;
  startDateEndDateMandatoryFalg = false;
  authorised_flag = false;
  auto_save_as_draft_flag = false;
  confidentialProjectFlag = false;
  // duplicateProjectTitleFlag=false;
  projectId: any = null;
  viewProjectId: any = null;
  draftedId: any = null;
  projectDetails: ProjectCrud;
  projectDraftDetails: ProjectCrud;
  saveAsDraftDetails: ProjectCrud[] = [];
  disbursementDetails: DisbursementCrudService[] = [];
  paymentDetails: PaymentCrudService[] = [];
  fundingDetails: FinancialAgreement[] = [];
  fundingCommitmentDetails: FinancialAgreement[] = [];
  userNameForNotification: string = 'Charlie Adams'; //this will be softcoded latter
  userGroupForNotification = 'DNGDP Admin'; //this will be softcoded latter
  provincesBySelectFund: FinancingProvinceDistrict[] = [];
  districtsBySelectFund: FinancingProvinceDistrict[] = [];
  tokenForEsnip!: any;
  eSnipDataById!: any;

  //constructor of AddProjectComponentComponent class for initializing and declaring fields
  constructor(public translate: TranslateService, private districtsService: DistrictsService, private provincesService: ProvincesService, private router: Router,
    @Inject(DOCUMENT) private _document: HTMLDocument, public dialog: MatDialog, private fb: FormBuilder,
    private organizationService: OrganizationService, private iatiLocationService: IatiLocationService,
    private donorService: DonorService, private projectSituationService: ProjectSituationService,
    private sdgService: SustainableDevelopmentGoalService,
    private sdgTargetService: SustainableDevelopmentTargetService,
    private responsibleOrganizationService: ResponsibleOrganizationService,
    private purposeDACCRSService: PurposeDACCRSService,public datepipe: DatePipe,
    private listOfAssociatedFundingService: FinancingServiceService,
    private currencyPipe: CurrencyPipe,
    private bankOfMozambiqueService: BankOfMozambiqueService,
    private implementingOrganizationService: ImplementingOrganizationService,
    private projectCrudService: ProjectCrudService,
    private markerMasterService: MarkerMasterService,
    private currencyService: CurrencyService,
    private individualCrudServiceService: IndividualCrudServiceService,
    private route: ActivatedRoute,
    private disbursementCrudService: DisbursementCrudServiceService,
    private paymentCrudServiceService: PaymentCrudServiceService,
    private notificationService: NotificationService) { }
  associatedFundingName: string[] = [];
  //ngOnInit is used for placing the elements which are needs to execute during the loading of class
  ngOnInit(): void {
    
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.setToAuthFlag();
    localStorage.removeItem('prjRefNm');
    localStorage.setItem("prjRefNm", null);
    this.projectId = this.route.snapshot.paramMap.get("projectId");
    this.viewProjectId = this.route.snapshot.paramMap.get("viewProjectId");
    this.draftedId = this.route.snapshot.paramMap.get("draftedId");
    //  associatedFundingName: string[] = [];
    //creating projectForm FormGroup object by declaring the fields of Project General Information expainson
    this.projectForm = new FormGroup({
      projectId: new FormControl(''),
      language: new FormControl(''),
      projectTitle: new FormControl('', [Validators.required]),
      e_snipId: new FormControl({ value: '', disabled: true }),
      e_snipProjectTitle: new FormControl({ value: '', disabled: true }),
      saveAsDraftId: new FormControl(''),
      projectSituation: new FormControl('', [Validators.required]),
      projectOverview: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      responsibleOrganization: new FormControl('', [Validators.required]),
      implementingOrganization: new FormControl(''),
      regional: new FormControl(''),
      projetLink: new FormControl(''),
      provinces: new FormControl(''),
      districts: new FormControl(''),
      sustainable_development_goals: new FormControl('', [Validators.required]),
      sustainable_development_target: new FormControl(''),
      confidentialProject: new FormControl(false),
      tableDataManager: this.fb.array([
        this.fb.group({
          orgName: ['', [Validators.required]],
          managers: [{ value: '', disabled: true }, [Validators.required]],
          startDate: [{ value: '', disabled: true }],
          endDate: [{ value: '', disabled: true }],
          post: [{ value: '', disabled: true }],
          emailId: [{ value: '', disabled: true }],
          contactNo: [{ value: '', disabled: true }],
        })
      ]),
      // SelectListOfAssociatedFunding: new FormControl('', [Validators.required]),
      SelectListOfAssociatedFunding: new FormControl(''),
      //support: new FormControl(''),
      tableData: this.fb.array([
        this.fb.group({
          fundingRef: [{ value: '', disabled: true }],
          fundingTitle: [{ value: '', disabled: true }],
          fundingOrg: [{ value: '', disabled: true }],
          startDate: [{ value: '', disabled: true }],
          endDate: [{ value: '', disabled: true }],
          amountAloFinUsd: [{ value: '', disabled: true }],
        })
      ]),
      markerTableData: this.fb.array([
        this.fb.group({
          markerId: [''],
          markerOptions: [''],
        })
      ]),
      tableComments: this.fb.array([
        // this.fb.group({
        //   comments:['']
        // })
      ]),
    });
    (this.projectForm.get('markerTableData') as FormArray).removeAt(0);
    //creating projectForm2 FormGroup object by declaring the fields of Project Financial Information / Allocation expainson
    this.projectForm2 = new FormGroup({
      tableData: this.fb.array([
        this.fb.group({
          purposeDACCRS: ['', [Validators.required]],
          enter_funds: [{ value: '', disabled: true }],
          currency1: [{ value: '', disabled: true }],
          funds_mzn: [{ value: '', disabled: true }],
          funds_usd: [{ value: '', disabled: true }]
        })
      ]),
      odaAmountMzn: new FormControl({ value: '', disabled: true }),
      odaAmountUsd: new FormControl({ value: '', disabled: true }),
      nationalAmountmzn: new FormControl(['']),
      nationalAmountusd: new FormControl(['']),
      totalAmountMzn: new FormControl({ value: '', disabled: true }),
      totalAmountUsd: new FormControl({ value: '', disabled: true }),
      purposeDACCRS: new FormControl(''),
    });
    //initialize with null
    this.projectForm.controls['saveAsDraftId'].setValue(null);

    this.getSelectListOfAssociatedFunding();
 
    this.setToUserDisbursementPermission();
    this.setToUserPaymentPermission();
    this.setToUserFundingPermission();
    if (this.projectId == null && this.viewProjectId == null && this.draftedId == null) {
      this.getMarkerMasterDetails();
    }
    this.getCurrencyOptions();
    this.getProjectDraftValue();
    //this.getDonorDetails();
    this.getPurposeDACCRS();
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');


    this.newDynamic = { project: "", financing: "", donor: "", disbursementDate: "", disbursementAmount: "", meticaisAmountdisbursement: "", usdDisbursementAmount: "", exchangeRates: "" };
    this.dynamicArray.push(this.newDynamic);

    this.newPayment = { project: "", financing: "", donor: "", disbursementDate: "", disbursementAmount: "", meticaisAmountdisbursement: "", usdDisbursementAmount: "", exchangeRates: "" };
    this.paymentArray.push(this.newDynamic);
    this.getProvinces();
    this.getOrganization();
    this.getIndividual();
    //this.getIatiLocation();
    //this.getDonor();
    this.getProjectSituationDetails();
    this.getSustainableDevelopmentGoalDetails();
    // this.getResponsibleOrganizationDetails();
    //this.getImplementingOrganizationList();

    //this.getDistricts();
    this.getEsnipToken();

    this.clearTableDataManager();

    //values set in Project/commitment start
    this.projectFormCommitment = new FormGroup({
      totalAmountOfAnnularODACommitmentsMZN: new FormControl(''),
      totalAmountOfAnnularODACommitmentsUSD: new FormControl(''),
      commitmentRate: new FormControl(''),

    });

    //this.projectFormCommitment.controls['commitmentRate'].setValue(test.commitmentRate.concat(''));
    this.projectFormCommitment.disable();

    //values set in Project/commitment END.

    //values set in Project/Disbursement START.
    this.projectFormDisbursements = new FormGroup({
      totalAmountOfDisbursedMZN: new FormControl(''),
      totalAmountOfDisbursedUSD: new FormControl(''),
      disbursementRate: new FormControl(''),


    });

    this.projectFormDisbursements.disable();


    //values set in Project/Disbursement END.

    //values set in Project/Payments START.
    this.projectFormPayments = new FormGroup({
      totalAmountPaidMZN: new FormControl(''),
      totalAmountPaidUSD: new FormControl(''),
      financialExecutionRate: new FormControl(''),


    });

    this.projectFormPayments.disable();
    this.projectFormCommitment.controls['commitmentRate'].setValue(0.0);

    //values set in Project/Payments END.

    //Auto complete code
    this.filteredOptions = this.projectForm.controls['responsibleOrganization'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.implementingFilteredOptions = this.projectForm.controls['implementingOrganization'].valueChanges
      .pipe(
        startWith(''),
        map(value => this.impOrganization_filter(value))
      );
    this.filteredOptionsDistricts = this.myControl1.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );

    // this.filteredOptionsC = this.currency1.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter21(value))
    //   );

    this.EditProject = localStorage.getItem("EditProject");
    this.ViewMoreProject = localStorage.getItem("ViewMoreProject");
    if (this.projectId != null) {
      this.eSnipHiddenFlag = true;
      this.select_options_for_development_target_hdn_flag = false;
      this.validateListFundFlag = false;
      this.auto_save_as_draft_flag = false;
      this.projectCrudService.getProjectById(this.projectId).toPromise().then(data => {
        this.projectDetails = data;
     
        this.projectForm.controls.projectId.patchValue(this.projectDetails.projectId);
        this.projectForm.controls.projectTitle.patchValue(this.projectDetails.projectTitle);
        localStorage.setItem("prjRefNm", this.projectDetails.projectTitle);
        this.projectForm.controls.e_snipId.patchValue(this.projectDetails.eSnipId);
        this.projectForm.controls.e_snipProjectTitle.patchValue(this.projectDetails.eSnipProjectTitle);
        this.projectForm.controls.projectOverview.patchValue(this.projectDetails.projectOverview);
        this.projectForm.controls.startDate.patchValue(this.projectDetails.startDate);
        this.projectForm.controls.endDate.patchValue(this.projectDetails.endDate);
        this.projectForm.controls.regional.patchValue(this.projectDetails.regional);
        if (this.projectDetails.fetchProjectSituation != null && this.projectDetails.fetchProjectSituation != undefined) {
          this.projectForm.controls.projectSituation.patchValue(this.projectDetails.fetchProjectSituation.projectSituationId);
        }
        if (this.projectDetails.fetchResponsibleOrganizationBean != null && this.projectDetails.fetchResponsibleOrganizationBean != undefined) {
          this.projectForm.controls.responsibleOrganization.patchValue(+this.projectDetails.fetchResponsibleOrganizationBean.responsibleOrganizationId);
        }
        if (this.projectDetails.confidentialProject == 'true') {
          this.projectForm.controls['confidentialProject'].setValue(true);
          this.confidentialProjectFlag = true;
        }
        let implArr: number[] = [];
        if (this.projectDetails.projectImplOrgBean != null && this.projectDetails.projectImplOrgBean != null) {
          this.projectDetails.projectImplOrgBean.forEach(dataImpl => {
            implArr.push(+dataImpl.idOrganization);
          });
          this.projectForm.controls.implementingOrganization.patchValue(implArr);
          this.setSelectedValues();
        }
        let sdgsArr: string[] = [];
        if (this.projectDetails.projectSustainableDevelopementGoalBean != null && this.projectDetails.projectSustainableDevelopementGoalBean != undefined) {
          this.projectDetails.projectSustainableDevelopementGoalBean.forEach(dataSdgs => {
            sdgsArr.push(dataSdgs.idSusDevGoalmaster + '');
          });
          this.projectForm.controls.sustainable_development_goals.patchValue(sdgsArr);
          this.sdgTargetService.getSustainableDevelopmentTargets(sdgsArr).subscribe(dataSdt => {
            this.sDGTargetList = dataSdt;
          });
        }
        let sdtArr: string[] = [];
        if (this.projectDetails.sustainableDevelopementTargetBean != null && this.projectDetails.sustainableDevelopementTargetBean != undefined) {
          this.projectDetails.sustainableDevelopementTargetBean.forEach(dataSdts => {
            sdtArr.push(dataSdts.idSusDevTargetmaster + '');
          });
          this.projectForm.controls.sustainable_development_target.patchValue(sdtArr);
        }
        this.projectForm.controls.projetLink.patchValue(this.projectDetails.projectLink);
        this.getMarkerMasterDetailsPatch(this.projectDetails.markerTableData);
        if (this.projectDetails.tableDataManager != null && this.projectDetails.tableDataManager != undefined) {
          for (let i = 0; i < this.projectDetails.tableDataManager.length; i++) {
            this.orgIndRel.set(i, this.projectDetails.tableDataManager[i].orgName);
            const row = this.fb.group({
              orgName: ['', [Validators.required]],
              managers: ['', [Validators.required]],
              startDate: [{ value: '', disabled: false }],
              endDate: [{ value: '', disabled: false }],
              // firstName: [{value:'',disabled:true}],
              // lastName:[{value:'',disabled:true}],
              post: [{ value: '', disabled: true }],
              emailId: [{ value: '', disabled: true }],
              contactNo: [{ value: '', disabled: true }]
            });
            (this.projectForm.get('tableDataManager') as FormArray).push(row);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').patchValue(this.projectDetails.tableDataManager[i].orgName);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').patchValue(this.projectDetails.tableDataManager[i].managers);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.projectDetails.tableDataManager[i].startDate);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.projectDetails.tableDataManager[i].endDate);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('post').patchValue(this.projectDetails.tableDataManager[i].post);
            for (let j = 0; j < this.individualList.length; j++) {
              if (this.projectDetails.tableDataManager[i].managers == +this.individualList[j].id) {
                ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('emailId').patchValue(this.individualList[j].email1);
                ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('contactNo').patchValue(this.individualList[j].phone1);
              }
            }
          }
        }
        let listOfAss: string[] = [];
        let listOfAssNum: number[] = [];
        if (this.projectDetails.projectFinancialAgreementBean != null && this.projectDetails.projectFinancialAgreementBean != undefined) {
          this.projectDetails.projectFinancialAgreementBean.forEach(assoFun => {
            listOfAss.push(assoFun.idFinanceAgreement);
            listOfAssNum.push(assoFun.idFinanceAgreement);
          });

          this.getFinancialAgreementList(listOfAssNum);
          this.getDisbursementDetails(listOfAssNum);
          this.getPaymentDetails(listOfAssNum);
          this.getProvinceByFinancialAgreementId(listOfAssNum);
          this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(listOfAss);
          this.setSelectedValuesListOfAsso();
          (this.projectForm.get('tableData') as FormArray).removeAt(0);
          for (let i = 0; i < listOfAss.length; i++) {
            const row = this.fb.group({
              fundingRef: [{ value: '', disabled: true }],
              fundingTitle: [{ value: '', disabled: true }],
              fundingOrg: [{ value: '', disabled: true }],
              startDate: [{ value: '', disabled: true }],
              endDate: [{ value: '', disabled: true }],
              amountAloFinUsd: [{ value: '', disabled: true }]
            });
            (this.projectForm.get('tableData') as FormArray).push(row);



            for (let j = 0; j < this.listOfAssociatedFunding.length; j++) {
              if (this.projectDetails.projectFinancialAgreementBean[i].idFinanceAgreement == this.listOfAssociatedFunding[j].funding_id) {
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingRef').patchValue(this.listOfAssociatedFunding[j].reference_for_financing_donor);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingTitle').patchValue(this.listOfAssociatedFunding[j].donor_funding_title);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingOrg').patchValue(this.listOfAssociatedFunding[j].fundingOrganization);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.listOfAssociatedFunding[j].start_date);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.listOfAssociatedFunding[j].end_date);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('amountAloFinUsd').patchValue((this.currencyPipe.transform(this.listOfAssociatedFunding[j].amt_usd, " ")));
                this.associatedFundingName.push(this.listOfAssociatedFunding[j].donor_funding_title);
                
              }

            }

          }
        }
        if (this.projectDetails.tableComments != null && this.projectDetails.tableComments != undefined) {
          // (this.projectForm.get('tableComments') as FormArray).removeAt(0);
          // this.date=new Date(this.projectDetails.commentDate)+'';
          // this.todayDateTime=this.date.substring(0,24);
          // this.userName=this.projectDetails.commentedBy;
          // for(let i=0;i<this.projectDetails.tableComments.length;i++){
          //    const row = this.fb.group({
          //     comments:['']
          //    });
          //    (this.projectForm.get('tableComments') as FormArray).push(row);
          //    ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).get('comments').patchValue(this.projectDetails.tableComments[i].comments);
          // }

          (this.projectForm.controls.tableComments as FormArray).clear();


          let responseCommentsLength = this.projectDetails.tableComments.length;
          // if(length>0){
          //   tableData = ((this.general_information_form.controls.tableFundingComments as FormArray).at(length-1) as FormControl).value;
          //   }

          for (let i = 0; i < responseCommentsLength; i++) {
            this.generateCommentsDataEdit(i);
            // ((this.general_information_form.controls.tableFundingComments as FormArray).at(i) as FormControl).patchValue(this.editResponse.faComments[i]);
          }
          this.addCommentRowEdit(responseCommentsLength);
        }
        // this.setSelectedValuesListOfAsso();
        if (this.projectDetails.projectOdaAllo != null && this.projectDetails.projectOdaAllo != undefined) {
          (this.projectForm2.get('tableData') as FormArray).removeAt(0);
          for (let i = 0; i < this.projectDetails.projectOdaAllo.length; i++) {
            const row = this.fb.group({
              purposeDACCRS: ['', [Validators.required]],
              enter_funds: [{ value: '', disabled: false }],
              currency1: [{ value: '', disabled: false }],
              funds_mzn: [{ value: '', disabled: true }],
              funds_usd: [{ value: '', disabled: true }]
            });
            (this.projectForm2.get('tableData') as FormArray).push(row);
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').patchValue(this.projectDetails.projectOdaAllo[i].purposeDACCRS + '');
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').patchValue(this.projectDetails.projectOdaAllo[i].currency);
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('enter_funds').patchValue(this.currencyPipe.transform(this.projectDetails.projectOdaAllo[i].funds, " "));
            var x = new BankOfMozambique();
            var retriveData: BankOfMozambique;
            x.year = new Date().getFullYear();
            x.amount = this.projectDetails.projectOdaAllo[i].funds;
            x.currency_id = this.projectDetails.projectOdaAllo[i].currency + '';
            this.getValueByLang()
            this.bankOfMozambiqueService.getOdaAmount(x).subscribe(data => {
              if (data === null) {
                if (this.browserLang == 'en')
                  Swal.fire('Currency Not Found', '', 'error');
                else
                  Swal.fire('Moeda não encontrada', '', 'error');
              }
              else {
                retriveData = data;
                ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_mzn').patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
                ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_usd').patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
                this.totOdaAmtMzn = 0;
                this.totOdaAmtUsd = 0;
                for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
                  this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
                  this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
                }
                this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totOdaAmtUsd) * 100) + '').toFixed(2));
              }
            });
            this.validateDacCRS();
          }
        }
        if (this.projectDetails.amtAlloNatPartMZN != null && this.projectDetails.amtAlloNatPartMZN != undefined) {
          this.projectForm2.controls.nationalAmountmzn.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartMZN, " ")));
          if (this.projectDetails.totOdaAmtAlloMZN != null && this.projectDetails.totOdaAmtAlloMZN != undefined) {
            this.projectForm2.controls.totalAmountMzn.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloMZN) + (+this.projectDetails.amtAlloNatPartMZN)), " ")));
          }
        }
        if (this.projectDetails.amtAlloNatPartUSD != null && this.projectDetails.amtAlloNatPartUSD != undefined) {
          this.projectForm2.controls.nationalAmountusd.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartUSD, " ")));
          if (this.projectDetails.totOdaAmtAlloUSD != null && this.projectDetails.totOdaAmtAlloUSD != undefined) {
            this.projectForm2.controls.totalAmountUsd.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloUSD) + (+this.projectDetails.amtAlloNatPartUSD)), " ")));
            this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / ((+this.projectDetails.totOdaAmtAlloUSD) + (+this.projectDetails.amtAlloNatPartUSD)))) + '').toFixed(2));
          }
        }
        if (this.projectDetails.totOdaAmtAlloMZN != null && this.projectDetails.totOdaAmtAlloMZN != undefined) {
          this.projectForm2.controls.odaAmountMzn.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloMZN, " ")));
        }
        if (this.projectDetails.totOdaAmtAlloUSD != null && this.projectDetails.totOdaAmtAlloUSD != undefined) {
          this.projectForm2.controls.odaAmountUsd.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloUSD, " ")));
        }
      });
      this.validateGeneralInformation();
      this.validateAllocation();


      localStorage.setItem("EditProject", "reset-edit-project");
    }
    if (this.viewProjectId != null) {
      this.eSnipHiddenFlag = true;
      this.select_options_for_development_target_hdn_flag = false;
      this.validateListFundFlag = false;
      this.auto_save_as_draft_flag = false;
      this.projectCrudService.getProjectById(this.viewProjectId).subscribe(data => {
        this.projectDetails = data;
        if (this.projectDetails != null && this.projectDetails != undefined) {
        
          this.projectForm.controls.projectId.patchValue(this.projectDetails.projectId);
          this.projectForm.controls.projectTitle.patchValue(this.projectDetails.projectTitle);
          this.projectForm.controls.e_snipId.patchValue(this.projectDetails.eSnipId);
          this.projectForm.controls.e_snipProjectTitle.patchValue(this.projectDetails.eSnipProjectTitle);
          this.projectForm.controls.projectOverview.patchValue(this.projectDetails.projectOverview);
          this.projectForm.controls.startDate.patchValue(this.projectDetails.startDate);
          this.pickerDisable_flag1 = true;
          this.projectForm.controls.endDate.patchValue(this.projectDetails.endDate);
          this.projectForm.controls.regional.patchValue(this.projectDetails.regional);
          if (this.projectDetails.fetchProjectSituation != null && this.projectDetails.fetchProjectSituation != undefined) {
            this.projectForm.controls.projectSituation.patchValue(this.projectDetails.fetchProjectSituation.projectSituationId);
          }
          if (this.projectDetails.fetchResponsibleOrganizationBean != null && this.projectDetails.fetchResponsibleOrganizationBean != undefined) {
            this.projectForm.controls.responsibleOrganization.patchValue(+this.projectDetails.fetchResponsibleOrganizationBean.responsibleOrganizationId);
          }
          if (this.projectDetails.confidentialProject == 'true') {
            this.projectForm.controls['confidentialProject'].setValue(true);
            this.confidentialProjectFlag = true;
          }
          let implArr: number[] = [];
          if (this.projectDetails.projectImplOrgBean != null && this.projectDetails.projectImplOrgBean != null) {
            this.projectDetails.projectImplOrgBean.forEach(dataImpl => {
              implArr.push(+dataImpl.idOrganization);
            });
            this.projectForm.controls.implementingOrganization.patchValue(implArr);
            this.setSelectedValues();
          }
          let sdgsArr: string[] = [];
          if (this.projectDetails.projectSustainableDevelopementGoalBean != null && this.projectDetails.projectSustainableDevelopementGoalBean != undefined) {
            this.projectDetails.projectSustainableDevelopementGoalBean.forEach(dataSdgs => {
              sdgsArr.push(dataSdgs.idSusDevGoalmaster + '');
            });
            this.projectForm.controls.sustainable_development_goals.patchValue(sdgsArr);
            this.sdgTargetService.getSustainableDevelopmentTargets(sdgsArr).subscribe(dataSdt => {
              this.sDGTargetList = dataSdt;
            });
          }
          let sdtArr: string[] = [];
          if (this.projectDetails.sustainableDevelopementTargetBean != null && this.projectDetails.sustainableDevelopementTargetBean != undefined) {
            this.projectDetails.sustainableDevelopementTargetBean.forEach(dataSdts => {
              sdtArr.push(dataSdts.idSusDevTargetmaster + '');
            });
            this.projectForm.controls.sustainable_development_target.patchValue(sdtArr);
          }
          this.projectForm.controls.projetLink.patchValue(this.projectDetails.projectLink);
          this.getMarkerMasterDetailsPatch(this.projectDetails.markerTableData);
          if (this.projectDetails.tableDataManager != null && this.projectDetails.tableDataManager != undefined) {
            for (let i = 0; i < this.projectDetails.tableDataManager.length; i++) {
              this.orgIndRel.set(i, this.projectDetails.tableDataManager[i].orgName);
              const row = this.fb.group({
                orgName: ['', [Validators.required]],
                managers: ['', [Validators.required]],
                startDate: [{ value: '', disabled: true }],
                endDate: [{ value: '', disabled: true }],
                // firstName: [{value:'',disabled:true}],
                // lastName:[{value:'',disabled:true}],
                post: [{ value: '', disabled: true }],
                emailId: [{ value: '', disabled: true }],
                contactNo: [{ value: '', disabled: true }]
              });
              (this.projectForm.get('tableDataManager') as FormArray).push(row);
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').patchValue(this.projectDetails.tableDataManager[i].orgName);
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').disable();
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').patchValue(this.projectDetails.tableDataManager[i].managers);
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').disable();
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.projectDetails.tableDataManager[i].startDate);
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.projectDetails.tableDataManager[i].endDate);
              ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('post').patchValue(this.projectDetails.tableDataManager[i].post);
              for (let j = 0; j < this.individualList.length; j++) {
                if (this.projectDetails.tableDataManager[i].managers == +this.individualList[j].id) {
                  ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('emailId').patchValue(this.individualList[j].email1);
                  ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('contactNo').patchValue(this.individualList[j].phone1);
                }
              }
            }
          }
          let listOfAss: string[] = [];
          let listOfAssNum: number[] = [];
          if (this.projectDetails.projectFinancialAgreementBean != null && this.projectDetails.projectFinancialAgreementBean != undefined) {

            this.projectDetails.projectFinancialAgreementBean.forEach(assoFun => {
              listOfAss.push(assoFun.idFinanceAgreement);
              listOfAssNum.push(assoFun.idFinanceAgreement);
            });
           
            this.getFinancialAgreementList(listOfAssNum);
          
            this.getDisbursementDetails(listOfAssNum);
            
            this.getPaymentDetails(listOfAssNum);
        
            this.getProvinceByFinancialAgreementId(listOfAssNum);
           
            this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(listOfAss);
            
            // this.setSelectedValuesListOfAsso();
            (this.projectForm.get('tableData') as FormArray).removeAt(0);
            for (let iView = 0; iView < listOfAss.length; iView++) {
              // console.log("inside for loop",this.associatedFundingName);
              // const row = this.fb.group({
              //   fundingRef: [{ value: '', disabled: true }],
              //   fundingTitle: [{ value: '', disabled: true }],
              //   fundingOrg: [{ value: '', disabled: true }],
              //   startDate: [{ value: '', disabled: true }],
              //   endDate: [{ value: '', disabled: true }],
              //   amountAloFinUsd: [{ value: '', disabled: true }]
              // });
              // (this.projectForm.get('tableData') as FormArray).push(row);
              // for(let jView=0;jView<this.listOfAssociatedFunding.length;jView++){
              //   this.associatedFundingName.push(this.listOfAssociatedFunding[jView].donor_funding_title);
              //   console.log("view associatedFundingName",this.associatedFundingName);
              //   console.log("id comp",this.projectDetails.projectFinancialAgreementBean[iView].idFinanceAgreement,this.listOfAssociatedFunding[jView].funding_id)
              //   if(this.projectDetails.projectFinancialAgreementBean[iView].idFinanceAgreement==this.listOfAssociatedFunding[jView].funding_id){
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('fundingRef').patchValue(this.listOfAssociatedFunding[jView].reference_for_financing_donor);
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('fundingTitle').patchValue(this.listOfAssociatedFunding[jView].donor_funding_title);
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('fundingOrg').patchValue(this.listOfAssociatedFunding[jView].fundingOrganization);
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('startDate').patchValue(this.listOfAssociatedFunding[jView].start_date);
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('endDate').patchValue(this.listOfAssociatedFunding[jView].end_date);
              //     ((this.projectForm.get('tableData') as FormArray).at(iView) as FormGroup).get('amountAloFinUsd').patchValue((this.currencyPipe.transform(this.listOfAssociatedFunding[jView].amt_usd, " ")));

              //   }

              // }

            }
          }
          if (this.projectDetails.tableComments != null && this.projectDetails.tableComments != undefined) {
            (this.projectForm.get('tableComments') as FormArray).removeAt(0);
            this.date = new Date(this.projectDetails.commentDate) + '';
            this.todayDateTime = this.date.substring(0, 24);
            this.userName = this.projectDetails.commentedBy;
            for (let i = 0; i < this.projectDetails.tableComments.length; i++) {
              const row = this.fb.group({
                comments: ['']
              });
              (this.projectForm.get('tableComments') as FormArray).push(row);
              ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).get('comments').patchValue(this.projectDetails.tableComments[i].comments);
              ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).disable();
            }
          }
          if (this.projectDetails.projectOdaAllo != null && this.projectDetails.projectOdaAllo) {
            (this.projectForm2.get('tableData') as FormArray).removeAt(0);
            for (let i = 0; i < this.projectDetails.projectOdaAllo.length; i++) {
              const row = this.fb.group({
                purposeDACCRS: ['', [Validators.required]],
                enter_funds: [{ value: '', disabled: true }],
                currency1: [{ value: '', disabled: true }],
                funds_mzn: [{ value: '', disabled: true }],
                funds_usd: [{ value: '', disabled: true }]
              });
              (this.projectForm2.get('tableData') as FormArray).push(row);
              ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').patchValue(this.projectDetails.projectOdaAllo[i].purposeDACCRS + '');
              ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').disable();
              ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').patchValue(this.projectDetails.projectOdaAllo[i].currency);
              ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('enter_funds').patchValue((this.currencyPipe.transform(this.projectDetails.projectOdaAllo[i].funds, " ")));
              var x = new BankOfMozambique();
              var retriveData: BankOfMozambique;
              x.year = new Date().getFullYear();
              x.amount = this.projectDetails.projectOdaAllo[i].funds;
              x.currency_id = this.projectDetails.projectOdaAllo[i].currency + '';
              this.getValueByLang()
              this.bankOfMozambiqueService.getOdaAmount(x).subscribe(data => {
                if (data === null) {
                  if (this.browserLang == 'en')
                    Swal.fire('Currency Not Found', '', 'error');
                  else
                    Swal.fire('Moeda não encontrada', '', 'error');
                }
                else {
                  retriveData = data;
                  ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_mzn').patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
                  ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_usd').patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
                  this.totOdaAmtMzn = 0;
                  this.totOdaAmtUsd = 0;
                  for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
                    this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
                    this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
                  }
                  this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                  this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                  this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                  this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                  this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totOdaAmtUsd) * 100) + '').toFixed(2));
                }
              });
              this.validateDacCRS();
            }
          }
          if (this.projectDetails.amtAlloNatPartMZN != null && this.projectDetails.amtAlloNatPartMZN != undefined) {
            this.projectForm2.controls.nationalAmountmzn.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartMZN, " ")));
            if (this.projectDetails.totOdaAmtAlloMZN != null && this.projectDetails.totOdaAmtAlloMZN != undefined) {
              this.projectForm2.controls.totalAmountMzn.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloMZN) + (+this.projectDetails.amtAlloNatPartMZN)), " ")));
            }
          }
          if (this.projectDetails.amtAlloNatPartUSD != null && this.projectDetails.amtAlloNatPartUSD != undefined) {
            this.projectForm2.controls.nationalAmountusd.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartUSD, " ")));
            if (this.projectDetails.totOdaAmtAlloUSD != null && this.projectDetails.totOdaAmtAlloUSD != undefined) {
              this.projectForm2.controls.totalAmountUsd.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloUSD) + (+this.projectDetails.amtAlloNatPartUSD)), " ")));
              this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / ((+this.projectDetails.totOdaAmtAlloUSD) + (+this.projectDetails.amtAlloNatPartUSD))) * 100) + '').toFixed(2));
            }
          }
          if (this.projectDetails.totOdaAmtAlloMZN != null && this.projectDetails.totOdaAmtAlloMZN != undefined) {
            this.projectForm2.controls.odaAmountMzn.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloMZN, " ")));
          }
          if (this.projectDetails.totOdaAmtAlloUSD != null && this.projectDetails.totOdaAmtAlloUSD != undefined) {
            this.projectForm2.controls.odaAmountUsd.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloUSD, " ")));
          }
        }
      });
      //this.getCurrency(Number(projectData.tableData[0].enter_funds));
      this.projectForm.disable();
      this.projectForm2.disable();
      this.locationForm.disable();
      this.projectFormCommitment.disable();
      this.projectFormPayments.disable();
      this.projectFormDisbursements.disable();
      this.validateGeneralInformation();
      this.validateAllocation();
      localStorage.setItem("ViewMoreProject", "reset-ViewMore-project");
    }
    // if (this.draftedId != null) {
    //   this.eSnipHiddenFlag=true;
    //   this.select_options_for_development_target_hdn_flag=false;
    //   this.validateListFundFlag = false;
    //   this.auto_save_as_draft_flag=false;
    //   this.projectCrudService.getProjectById(this.draftedId).subscribe(data=>{
    //       this.projectDetails=data;
    //       if(this.projectDetails!=null && this.projectDetails!=undefined){
    //         console.log('draft----->',this.projectDetails);
    //         this.projectForm.controls.projectId.patchValue(this.projectDetails.projectId);
    //         this.projectForm.controls.projectTitle.patchValue(this.projectDetails.projectTitle);
    //         this.projectForm.controls.e_snipId.patchValue(this.projectDetails.eSnipId);
    //         this.projectForm.controls.e_snipProjectTitle.patchValue(this.projectDetails.eSnipProjectTitle);
    //         this.projectForm.controls.projectOverview.patchValue(this.projectDetails.projectOverview);
    //         this.projectForm.controls.startDate.patchValue(this.projectDetails.startDate);
    //         this.pickerDisable_flag1 = true;
    //         this.projectForm.controls.endDate.patchValue(this.projectDetails.endDate);
    //         this.projectForm.controls.regional.patchValue(this.projectDetails.regional);
    //         if(this.projectDetails.fetchProjectSituation!=null && this.projectDetails.fetchProjectSituation!=undefined){
    //           this.projectForm.controls.projectSituation.patchValue(this.projectDetails.fetchProjectSituation.projectSituationId);
    //         }
    //         if(this.projectDetails.fetchResponsibleOrganizationBean!=null && this.projectDetails.fetchResponsibleOrganizationBean!=undefined){
    //           this.projectForm.controls.responsibleOrganization.patchValue(+this.projectDetails.fetchResponsibleOrganizationBean.responsibleOrganizationId);
    //         }
    //         if(this.projectDetails.confidentialProject=='true'){
    //           this.projectForm.controls['confidentialProject'].setValue(true);
    //           this.confidentialProjectFlag=true;
    //         }
    //         let implArr:number[]=[];
    //         if(this.projectDetails.projectImplOrgBean!=null && this.projectDetails.projectImplOrgBean!=null){
    //           this.projectDetails.projectImplOrgBean.forEach(dataImpl=>{
    //             implArr.push(+dataImpl.idOrganization);
    //           });
    //           this.projectForm.controls.implementingOrganization.patchValue(implArr);
    //           this.setSelectedValues();
    //         }
    //         let sdgsArr:string[]=[];
    //         if(this.projectDetails.projectSustainableDevelopementGoalBean!=null && this.projectDetails.projectSustainableDevelopementGoalBean!=undefined){
    //           this.projectDetails.projectSustainableDevelopementGoalBean.forEach(dataSdgs=>{
    //             sdgsArr.push(dataSdgs.idSusDevGoalmaster+'');
    //           });
    //           this.projectForm.controls.sustainable_development_goals.patchValue(sdgsArr);
    //           this.sdgTargetService.getSustainableDevelopmentTargets(sdgsArr).subscribe(dataSdt => {
    //             this.sDGTargetList = dataSdt;
    //           });
    //         }
    //         let sdtArr:string[]=[];
    //         if(this.projectDetails.sustainableDevelopementTargetBean!=null && this.projectDetails.sustainableDevelopementTargetBean!=undefined){
    //           this.projectDetails.sustainableDevelopementTargetBean.forEach(dataSdts=>{
    //             sdtArr.push(dataSdts.idSusDevTargetmaster+'');
    //           });
    //           this.projectForm.controls.sustainable_development_target.patchValue(sdtArr);
    //         }
    //         this.projectForm.controls.projetLink.patchValue(this.projectDetails.projectLink);
    //         this.getMarkerMasterDetailsPatch(this.projectDetails.markerTableData);
    //         if(this.projectDetails.tableDataManager!=null && this.projectDetails.tableDataManager!=undefined){
    //           for(let i=0;i<this.projectDetails.tableDataManager.length;i++){
    //             this.orgIndRel.set(i,this.projectDetails.tableDataManager[i].orgName);
    //             const row = this.fb.group({
    //               orgName: ['', [Validators.required]],
    //               managers: ['', [Validators.required]],
    //               startDate: [{ value: '', disabled: true }],
    //               endDate: [{ value: '', disabled: true }],
    //               // firstName: [{value:'',disabled:true}],
    //               // lastName:[{value:'',disabled:true}],
    //               post: [{ value: '', disabled: true }],
    //               emailId: [{ value: '', disabled: true }],
    //               contactNo: [{ value: '', disabled: true }]
    //             });
    //             (this.projectForm.get('tableDataManager') as FormArray).push(row);
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').patchValue(this.projectDetails.tableDataManager[i].orgName);
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').disable();
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').patchValue(this.projectDetails.tableDataManager[i].managers);
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').disable();
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.projectDetails.tableDataManager[i].startDate);
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.projectDetails.tableDataManager[i].endDate);
    //             ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('post').patchValue(this.projectDetails.tableDataManager[i].post);
    //             for(let j=0;j<this.individualList.length;j++){
    //               if(this.projectDetails.tableDataManager[i].managers==+this.individualList[j].id){
    //                 ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('emailId').patchValue(this.individualList[j].email1);
    //                 ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('contactNo').patchValue(this.individualList[j].phone1);
    //               }
    //             }
    //           }
    //         }
    //         let listOfAss:string[]=[];
    //         let listOfAssNum:number[]=[];
    //         if(this.projectDetails.projectFinancialAgreementBean!=null && this.projectDetails.projectFinancialAgreementBean!=undefined){
    //           this.projectDetails.projectFinancialAgreementBean.forEach(assoFun=>{
    //             listOfAss.push(assoFun.idFinanceAgreement);
    //             listOfAssNum.push(assoFun.idFinanceAgreement);
    //           });
    //           this.getFinancialAgreementList(listOfAssNum);
    //           this.getDisbursementDetails(listOfAssNum);
    //           this.getPaymentDetails(listOfAssNum);
    //           this.getProvinceByFinancialAgreementId(listOfAssNum);
    //           this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(listOfAss);
    //           // this.setSelectedValuesListOfAsso();
    //           (this.projectForm.get('tableData') as FormArray).removeAt(0);
    //           for(let i=0;i<listOfAss.length;i++){
    //             const row = this.fb.group({
    //               fundingRef: [{ value: '', disabled: true }],
    //               fundingTitle: [{ value: '', disabled: true }],
    //               fundingOrg: [{ value: '', disabled: true }],
    //               startDate: [{ value: '', disabled: true }],
    //               endDate: [{ value: '', disabled: true }],
    //               amountAloFinUsd: [{ value: '', disabled: true }]
    //             });
    //             (this.projectForm.get('tableData') as FormArray).push(row);
    //             for(let j=0;j<this.listOfAssociatedFunding.length;j++){
    //               if(this.projectDetails.projectFinancialAgreementBean[i].idFinanceAgreement==this.listOfAssociatedFunding[j].funding_id){
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingRef').patchValue(this.listOfAssociatedFunding[j].reference_for_financing_donor);
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingTitle').patchValue(this.listOfAssociatedFunding[j].donor_funding_title);
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingOrg').patchValue(this.listOfAssociatedFunding[j].fundingOrganization);
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.listOfAssociatedFunding[j].start_date);
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.listOfAssociatedFunding[j].end_date);
    //                 ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('amountAloFinUsd').patchValue((this.currencyPipe.transform(this.listOfAssociatedFunding[j].amt_usd, " ")));
    //               }
    //               this.associatedFundingName.push(this.listOfAssociatedFunding[j].donor_funding_title);
    //             }


    //           }
    //         }
    //         if(this.projectDetails.tableComments!=null && this.projectDetails.tableComments!=undefined){
    //           (this.projectForm.get('tableComments') as FormArray).removeAt(0);
    //           this.date=new Date(this.projectDetails.commentDate)+'';
    //           this.todayDateTime=this.date.substring(0,24);
    //           this.userName=this.projectDetails.commentedBy;
    //           for(let i=0;i<this.projectDetails.tableComments.length;i++){
    //              const row = this.fb.group({
    //               comments:['']
    //              });
    //              (this.projectForm.get('tableComments') as FormArray).push(row);
    //              ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).get('comments').patchValue(this.projectDetails.tableComments[i].comments);
    //              ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).disable();
    //           }
    //         }
    //         if(this.projectDetails.projectOdaAllo!=null && this.projectDetails.projectOdaAllo){
    //           (this.projectForm2.get('tableData') as FormArray).removeAt(0);
    //           for(let i=0;i<this.projectDetails.projectOdaAllo.length;i++){
    //             const row = this.fb.group({
    //               purposeDACCRS: ['', [Validators.required]],
    //               enter_funds: [{ value: '', disabled: true }],
    //               currency1: [{ value: '', disabled: true }],
    //               funds_mzn:[{ value: '', disabled: true }],
    //               funds_usd:[{ value: '', disabled: true }]
    //             });
    //             (this.projectForm2.get('tableData') as FormArray).push(row);
    //             ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').patchValue(this.projectDetails.projectOdaAllo[i].purposeDACCRS+'');
    //             ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').disable();
    //             ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').patchValue(this.projectDetails.projectOdaAllo[i].currency);
    //             ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('enter_funds').patchValue((this.currencyPipe.transform(this.projectDetails.projectOdaAllo[i].funds, " ")));
    //             var x = new BankOfMozambique();
    //             var retriveData:BankOfMozambique;
    //             x.year=new Date().getFullYear();
    //             x.amount=this.projectDetails.projectOdaAllo[i].funds;
    //             x.currency_id=this.projectDetails.projectOdaAllo[i].currency+'';
    //             this.getValueByLang()
    //             this.bankOfMozambiqueService.getOdaAmount(x).subscribe(data=>{
    //               if(data===null){
    //                 if(this.browserLang=='en')
    //                 Swal.fire('Currency Not Found','','error');
    //                 else
    //                 Swal.fire('Moeda não encontrada','','error');
    //               }
    //               else{
    //                 retriveData=data;
    //                 ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_mzn').patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
    //                 ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_usd').patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
    //                 this.totOdaAmtMzn=0;
    //                 this.totOdaAmtUsd=0;
    //                 for(let k=0;k<(this.projectForm2.get('tableData') as FormArray).length;k++){
    //                   this.totOdaAmtMzn=this.totOdaAmtMzn+(+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
    //                   this.totOdaAmtUsd=this.totOdaAmtUsd+(+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
    //                 }
    //                 this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
    //                 this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
    //                 this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
    //                 this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
    //                 this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt/this.totOdaAmtUsd)*100)+'').toFixed(2));
    //               }
    //             });
    //             this.validateDacCRS();
    //           }
    //         }
    //         if(this.projectDetails.amtAlloNatPartMZN!=null && this.projectDetails.amtAlloNatPartMZN!=undefined){
    //           this.projectForm2.controls.nationalAmountmzn.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartMZN, " ")));
    //           if(this.projectDetails.totOdaAmtAlloMZN!=null && this.projectDetails.totOdaAmtAlloMZN!=undefined){
    //             this.projectForm2.controls.totalAmountMzn.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloMZN)+(+this.projectDetails.amtAlloNatPartMZN)), " ")));
    //           }
    //         }
    //         if(this.projectDetails.amtAlloNatPartUSD!=null && this.projectDetails.amtAlloNatPartUSD!=undefined){
    //           this.projectForm2.controls.nationalAmountusd.patchValue((this.currencyPipe.transform(this.projectDetails.amtAlloNatPartUSD, " ")));
    //           if(this.projectDetails.totOdaAmtAlloUSD!=null && this.projectDetails.totOdaAmtAlloUSD!=undefined){
    //             this.projectForm2.controls.totalAmountUsd.patchValue((this.currencyPipe.transform(((+this.projectDetails.totOdaAmtAlloUSD)+(+this.projectDetails.amtAlloNatPartUSD)), " ")));
    //             this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt/((+this.projectDetails.totOdaAmtAlloUSD)+(+this.projectDetails.amtAlloNatPartUSD)))*100)+'').toFixed(2));
    //           }
    //         }
    //         if(this.projectDetails.totOdaAmtAlloMZN!=null && this.projectDetails.totOdaAmtAlloMZN!=undefined){
    //           this.projectForm2.controls.odaAmountMzn.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloMZN, " ")));
    //         }
    //         if(this.projectDetails.totOdaAmtAlloUSD!=null && this.projectDetails.totOdaAmtAlloUSD!=undefined){
    //           this.projectForm2.controls.odaAmountUsd.patchValue((this.currencyPipe.transform(this.projectDetails.totOdaAmtAlloUSD, " ")));
    //         }
    //       }
    //   });
    //   //this.getCurrency(Number(projectData.tableData[0].enter_funds));
    //   this.projectForm.disable();
    //   this.projectForm2.disable();
    //   this.locationForm.disable();
    //   this.projectFormCommitment.disable();
    //   this.projectFormPayments.disable();
    //   this.projectFormDisbursements.disable();
    //   this.validateGeneralInformation();
    //   this.validateAllocation();
    //   localStorage.setItem("ViewMoreProject", "reset-ViewMore-project");
    // }


    /**
       * Set filter event based on value changes
       */

  }

  ngOnDestroy() {
    if (this.auto_save_as_draft_flag == true) {
      this.autoSaveAsDraft();
    }
  }


  @ViewChild('search') searchTextBox: ElementRef;
  @ViewChild('searchprovinces') searchTextBoxProvinces: ElementRef;
  @ViewChild('searchListOfAsso') searchTextBoxListOfAsso: ElementRef;

  selectedprovincename: String[] = [];
  searchTextboxControlProvinces = new FormControl();
  selectedValuesProvinces = [];
  searchTextboxControlListOfAsso = new FormControl();
  searchTextboxControl = new FormControl();
  searchResponsibleOrganization = new FormControl();
  searchOrgName = new FormControl();
  purdaccrsSearch = new FormControl();
  selectedValues = [];
  purposeDACCRS = new FormControl();
  selectedValuesListOfAsso = [];
  implementingOrganizationList: OrganizationCrudServiceClass[] = [];
  uAccessPermArr: UserAccessPermission[] = [];
  userDisbursementPermission: number[] = [];
  userPaymentPermission: number[] = [];
  userFundingPermission: number[] = [];
  totalAmtMZNDisb: number = 0;
  totalAmtUSDDisb: number = 0;
  totalAmtMZNPmt: number = 0;
  totalAmtUSDPmt: number = 0;
  totalAmtMZNCmmt: number = 0;
  totalAmtUSDCmmt: number = 0;
  filteredImplementingOrg: Observable<any[]>;
  filteredOptionProvinces: Observable<any[]>;
  filteredOptionListOfAsso: Observable<any[]>;
  snipMarkerSts: string;
  checkFinancingAgreement: any;
  usergroup: any;
  userId:number;
  num: any;
  pickerDisable_flag1: any = false;
  cancel_flag: any;
  flagOrgName: string;
  select_options_for_district_hdn_flag = true;
  // select_options_for_prv_opt_flag = true;
  // select_options_for_prv_opt_flag1 = true;
  manager_flag = true;
  manager_table_flag = true;
  select_options_for_development_target_hdn_flag = true;


  responsibleOrganization = new FormControl();
  dac_crs_sect1 = new FormControl();
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());
  //districts = new FormControl();
  provinceList1!: Provinces[];
  managers = new FormControl();
  individualList!: IndividualCrudServiceClass[];
  district!: Districts[];
  organizationList!: OrganizationCrudServiceClass[];
  iatiLocationList!: IatiLocation[];
  projectSituationList!: ProjectSituation[];
  sDGList!: SustainableDevelopmentGoal[];
  sDGTargetList!: SustainableDevelopmentTarget[];
  responsibleOrganizationList: OrganizationCrudServiceClass[] = [];
  responsibleOrganizationFilteredOption: Observable<any[]>;
  organizationListFilteredOption: Observable<any[]>;
  sum = -1;
  deleteCount = 0;

  listOfAssociatedFunding: FinancialAgreement[] = [];
  USDMZNexchangeRateUSD!: number;
  TotalODAAmountAllocatedMZN!: number;
  TotalODAAmountAllocatedUSD!: number;
  AmountAllocatedOfNationalParticipationMZN!: number;
  AmountAllocatedOfNationalParticipationUSD!: number;
  TotalAmountAllocatedMZN!: number;
  TotalAmountAllocatedUSD!: number;


  myControl1 = new FormControl();
  options1: string[] = ['Ancuabe', 'Angoche', 'Angónia', 'Changara', 'Dondo'];
  filteredOptionsDistricts: Observable<string[]>;



  myControl = new FormControl();

  currency1 = new FormControl();
  currOptions: Currency[] = [];
  private getCurrencyOptions() {
    this.currencyService.getCurrencyDetails().subscribe(data => {
      this.currOptions = data;
      for (let i = 0; i < this.currOptions.length; i++) {
        let crtDt = this.currOptions[i].createdOn;
        let updateDt = this.currOptions[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.currOptions[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.currOptions[i].updateDifference = days_differenceForUpdate;
        }
        (this.currOptions[i].difference) = days_difference;
      }
    });
  }
  filteredOptionsC: Observable<string[]>;

  filteredOptionsSDG: Observable<string[]>;

  filteredOptionsDACCRS_Sector: Observable<string[]>;
  purposeDACCRSfilteredOption: Observable<any[]>;
  purposeDacCrsList!: PurposeDACCRS[];


  location_flag = "false";
  //completedList: any;
  commitment_flag = "false";
  disbursement_flag = "false";
  payment_flag = "false";
  locationForm = new FormGroup({
    iati_accuracy: new FormControl(''),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    geolocation_comments: new FormControl(''),
    comments: new FormControl(''),
    iati_location: new FormControl(''),
    //provinces: new FormControl(''),
    //districts: new FormControl('')

  })
  get_location_fields_hidden_flag: boolean;

  tabClick(index: number) {
    this.num = index;
  }
  checked = false;
  indeterminate = false;
  // labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  //dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};


  //paymentArray: Array<PaymentGrid> = [];
  newPayment: any = {};
  flagListfund: any;
  flagListProj: any;

  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
     
    });
  }

  newImplOrg = '';
  newImplOrgId: any;
  openDialogOrg() {
    const dialogRef = this.dialog.open(DialogBoxComponent);
    localStorage.setItem("dataKey", "ImplOrg");
    localStorage.setItem("checkModule", "Project");
    dialogRef.afterClosed().subscribe((result) => {
      this.newImplOrg = localStorage.getItem("implOrgNm");
      this.newImplOrgId = localStorage.getItem("implOrgId");
      if (this.newImplOrgId !== null && this.newImplOrgId !== undefined && this.newImplOrgId !== '') {
        this.getOrganization();
        // let implArr:number[]=[];
        // implArr.push(+this.newImplOrgId);
        // this.projectForm.controls.implementingOrganization.patchValue(implArr);
        // this.setSelectedValues();
        localStorage.removeItem("implOrgNm");
        localStorage.removeItem("implOrgId");
      }
    });
  }

  pushToMarkerTable() {
    for (let i = 0; i < this.markersList.length; i++) {
      const row = this.fb.group({
        markerId: [''],
        markerOptions: [''],
      });
      (this.projectForm.get('markerTableData') as FormArray).push(row);
    }
  }
  pushToMarkerTablePatch(markerTableDataList: MarkerTableData[]) {
    for (let i = 0; i < this.markersList.length; i++) {
      const row = this.fb.group({
        markerId: this.markersList[i].markerId,
        markerOptions: [''],
      });
      (this.projectForm.get('markerTableData') as FormArray).push(row);
    }
    for (let m = 0; m < (this.projectForm.get('markerTableData') as FormArray).length; m++) {
      if (markerTableDataList != null && markerTableDataList != undefined) {
        for (let j = 0; j < markerTableDataList.length; j++) {
          if (((this.projectForm.get('markerTableData') as FormArray).at(m) as FormGroup).get('markerId').value == markerTableDataList[j].markerId) {
            ((this.projectForm.get('markerTableData') as FormArray).at(m) as FormGroup).get('markerOptions').patchValue(markerTableDataList[j].markerOptions);
          }
        }
        if (this.viewProjectId != null || this.draftedId) {
          ((this.projectForm.get('markerTableData') as FormArray).at(m) as FormGroup).get('markerOptions').disable();
        }
      }
    }
  }

  chkDraftAvailabilty() {
    this.getValueByLang()
    if (this.saveAsDraftDetails.length == 0) {

      (this.browserLang == 'en') ? Swal.fire('No Data Present Inside View Save As Draft', '', 'error') :
        Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho', '', 'error');
    }
  }

  patchDraftValue() {
    let projectId: number = this.projectForm.controls['saveAsDraftId'].value;
    this.eSnipHiddenFlag = true;
    this.select_options_for_development_target_hdn_flag = false;
    this.validateListFundFlag = false;
    this.auto_save_as_draft_flag = false;
    this.projectCrudService.getProjectDraftById(projectId).subscribe(data => {
      this.projectDraftDetails = data;
      if (this.projectDraftDetails != null && this.projectDraftDetails != undefined) {
        
        this.projectForm.controls.projectTitle.patchValue(this.projectDraftDetails.projectTitle);
        this.projectForm.controls.e_snipId.patchValue(this.projectDraftDetails.eSnipId);
        this.projectForm.controls.e_snipProjectTitle.patchValue(this.projectDraftDetails.eSnipProjectTitle);
        this.projectForm.controls.projectOverview.patchValue(this.projectDraftDetails.projectOverview);
        this.projectForm.controls.startDate.patchValue(this.projectDraftDetails.startDate);
        this.projectForm.controls.endDate.patchValue(this.projectDraftDetails.endDate);
        this.projectForm.controls.regional.patchValue(this.projectDraftDetails.regional);
        if (this.projectDraftDetails.fetchProjectSituation != null && this.projectDraftDetails.fetchProjectSituation != undefined) {
          this.projectForm.controls.projectSituation.patchValue(this.projectDraftDetails.fetchProjectSituation.projectSituationId);
        }
        if (this.projectDraftDetails.fetchResponsibleOrganizationBean != null && this.projectDraftDetails.fetchResponsibleOrganizationBean != undefined) {
          this.projectForm.controls.responsibleOrganization.patchValue(+this.projectDraftDetails.fetchResponsibleOrganizationBean.responsibleOrganizationId);
        }
        if (this.projectDraftDetails.confidentialProject == 'true') {
          this.projectForm.controls['confidentialProject'].setValue(true);
          this.confidentialProjectFlag = true;
        }
        let implArr: number[] = [];
        if (this.projectDraftDetails.projectImplOrgBean != null && this.projectDraftDetails.projectImplOrgBean != undefined) {
          this.projectDraftDetails.projectImplOrgBean.forEach(dataImpl => {
            implArr.push(+dataImpl.idOrganization);
          });
          this.setSelectedValues();
          this.projectForm.controls.implementingOrganization.patchValue(implArr);
        }
        let sdgsArr: string[] = [];
        if (this.projectDraftDetails.projectSustainableDevelopementGoalBean != null && this.projectDraftDetails.projectSustainableDevelopementGoalBean != undefined) {
          this.projectDraftDetails.projectSustainableDevelopementGoalBean.forEach(dataSdgs => {
            sdgsArr.push(dataSdgs.idSusDevGoalmaster + '');
          });
          this.projectForm.controls.sustainable_development_goals.patchValue(sdgsArr);
          this.sdgTargetService.getSustainableDevelopmentTargets(sdgsArr).subscribe(dataSdt => {
            this.sDGTargetList = dataSdt;
          });
        }
        let sdtArr: string[] = [];
        if (this.projectDraftDetails.sustainableDevelopementTargetBean != null && this.projectDraftDetails.sustainableDevelopementTargetBean != undefined) {
          this.projectDraftDetails.sustainableDevelopementTargetBean.forEach(dataSdts => {
            sdtArr.push(dataSdts.idSusDevTargetmaster + '');
          });
          this.projectForm.controls.sustainable_development_target.patchValue(sdtArr);
        }
        this.projectForm.controls.projetLink.patchValue(this.projectDraftDetails.projectLink);
        for (let m = 0; m < (this.projectForm.get('markerTableData') as FormArray).length; m++) {
          if (this.projectDraftDetails.markerTableData != null && this.projectDraftDetails.markerTableData != undefined) {
            for (let j = 0; j < this.projectDraftDetails.markerTableData.length; j++) {
              if (((this.projectForm.get('markerTableData') as FormArray).at(m) as FormGroup).get('markerId').value == this.projectDraftDetails.markerTableData[j].markerId) {
                ((this.projectForm.get('markerTableData') as FormArray).at(m) as FormGroup).get('markerOptions').patchValue(this.projectDraftDetails.markerTableData[j].markerOptions);
              }
            }
          }
        }
        if (this.projectDraftDetails.tableDataManager != null && this.projectDraftDetails.tableDataManager != undefined) {
          for (let i = 0; i < this.projectDraftDetails.tableDataManager.length; i++) {
            this.orgIndRel.set(i, this.projectDraftDetails.tableDataManager[i].orgName);
            const row = this.fb.group({
              orgName: ['', [Validators.required]],
              managers: ['', [Validators.required]],
              startDate: [{ value: '', disabled: false }],
              endDate: [{ value: '', disabled: false }],
              // firstName: [{value:'',disabled:true}],
              // lastName:[{value:'',disabled:true}],
              post: [{ value: '', disabled: true }],
              emailId: [{ value: '', disabled: true }],
              contactNo: [{ value: '', disabled: true }]
            });
            (this.projectForm.get('tableDataManager') as FormArray).push(row);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').patchValue(this.projectDraftDetails.tableDataManager[i].orgName);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').patchValue(this.projectDraftDetails.tableDataManager[i].managers);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.projectDraftDetails.tableDataManager[i].startDate);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.projectDraftDetails.tableDataManager[i].endDate);
            ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('post').patchValue(this.projectDraftDetails.tableDataManager[i].post);
            for (let j = 0; j < this.individualList.length; j++) {
              if (this.projectDraftDetails.tableDataManager[i].managers == +this.individualList[j].id) {
                ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('emailId').patchValue(this.individualList[j].email1);
                ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('contactNo').patchValue(this.individualList[j].phone1);
              }
            }
          }
        }
        let listOfAss: string[] = [];
        let listOfAssNum: number[] = [];
        if (this.projectDraftDetails.projectFinancialAgreementBean != null && this.projectDraftDetails.projectFinancialAgreementBean != undefined) {
          this.projectDraftDetails.projectFinancialAgreementBean.forEach(assoFun => {
            listOfAss.push(assoFun.idFinanceAgreement);
            listOfAssNum.push(assoFun.idFinanceAgreement);
          });
          this.getFinancialAgreementList(listOfAssNum);
          this.getDisbursementDetails(listOfAssNum);
          this.getPaymentDetails(listOfAssNum);
          this.getProvinceByFinancialAgreementId(listOfAssNum);
          this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(listOfAss);
          this.setSelectedValuesListOfAsso();
          (this.projectForm.get('tableData') as FormArray).removeAt(0);
          for (let i = 0; i < listOfAss.length; i++) {
            const row = this.fb.group({
              fundingRef: [{ value: '', disabled: true }],
              fundingTitle: [{ value: '', disabled: true }],
              fundingOrg: [{ value: '', disabled: true }],
              startDate: [{ value: '', disabled: true }],
              endDate: [{ value: '', disabled: true }],
              amountAloFinUsd: [{ value: '', disabled: true }]
            });
            (this.projectForm.get('tableData') as FormArray).push(row);
            for (let j = 0; j < this.listOfAssociatedFunding.length; j++) {
              if (this.projectDraftDetails.projectFinancialAgreementBean[i].idFinanceAgreement == this.listOfAssociatedFunding[j].funding_id) {
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingRef').patchValue(this.listOfAssociatedFunding[j].reference_for_financing_donor);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingTitle').patchValue(this.listOfAssociatedFunding[j].donor_funding_title);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('fundingOrg').patchValue(this.listOfAssociatedFunding[j].fundingOrganization);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.listOfAssociatedFunding[j].start_date);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.listOfAssociatedFunding[j].end_date);
                ((this.projectForm.get('tableData') as FormArray).at(i) as FormGroup).get('amountAloFinUsd').patchValue((this.currencyPipe.transform(this.listOfAssociatedFunding[j].amt_usd, " ")));
              }
            }
          }
        }
        if (this.projectDraftDetails.tableComments != null && this.projectDraftDetails.tableComments != undefined) {
          (this.projectForm.get('tableComments') as FormArray).removeAt(0);
          this.date = new Date(this.projectDraftDetails.commentDate) + '';
          this.todayDateTime = this.date.substring(0, 24);
          this.userName = this.projectDraftDetails.commentedBy;
          for (let i = 0; i < this.projectDraftDetails.tableComments.length; i++) {
            const row = this.fb.group({
              comments: ['']
            });
            (this.projectForm.get('tableComments') as FormArray).push(row);
            ((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).get('comments').patchValue(this.projectDraftDetails.tableComments[i].comments);
          }
        }
        if (this.projectDraftDetails.projectOdaAllo != null && this.projectDraftDetails.projectOdaAllo != undefined) {
          (this.projectForm2.get('tableData') as FormArray).removeAt(0);
          for (let i = 0; i < this.projectDraftDetails.projectOdaAllo.length; i++) {
            const row = this.fb.group({
              purposeDACCRS: ['', [Validators.required]],
              enter_funds: [{ value: '', disabled: false }],
              currency1: [{ value: '', disabled: false }],
              funds_mzn: [{ value: '', disabled: true }],
              funds_usd: [{ value: '', disabled: true }]
            });
            (this.projectForm2.get('tableData') as FormArray).push(row);
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').patchValue(this.projectDraftDetails.projectOdaAllo[i].purposeDACCRS + '');
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').patchValue(this.projectDraftDetails.projectOdaAllo[i].currency);
            ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('enter_funds').patchValue(this.currencyPipe.transform(this.projectDraftDetails.projectOdaAllo[i].funds, " "));
            var x = new BankOfMozambique();
            var retriveData: BankOfMozambique;
            x.year = new Date().getFullYear();
            x.amount = this.projectDraftDetails.projectOdaAllo[i].funds;
            x.currency_id = this.projectDraftDetails.projectOdaAllo[i].currency + '';
            this.getValueByLang()
            this.bankOfMozambiqueService.getOdaAmount(x).subscribe(data => {
              if (data === null) {
                (this.browserLang == 'en') ? Swal.fire('Currency not found', '', 'error') : Swal.fire('Moeda não encontrada', '', 'error');
              }
              else {
                retriveData = data;
                ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_mzn').patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
                ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_usd').patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
                this.totOdaAmtMzn = 0;
                this.totOdaAmtUsd = 0;
                for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
                  this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
                  this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
                }
                this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
                this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
                this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totOdaAmtUsd) * 100) + '').toFixed(2));
              }
            });
            this.validateDacCRS();
          }
        }
        if (this.projectDraftDetails.amtAlloNatPartMZN != null && this.projectDraftDetails.amtAlloNatPartMZN != undefined) {
          this.projectForm2.controls.nationalAmountmzn.patchValue((this.currencyPipe.transform(this.projectDraftDetails.amtAlloNatPartMZN, " ")));
          if (this.projectDraftDetails.totOdaAmtAlloMZN != null && this.projectDraftDetails.totOdaAmtAlloMZN != undefined) {
            this.projectForm2.controls.totalAmountMzn.patchValue((this.currencyPipe.transform(((+this.projectDraftDetails.totOdaAmtAlloMZN) + (+this.projectDraftDetails.amtAlloNatPartMZN)), " ")));
          }
        }
        if (this.projectDraftDetails.amtAlloNatPartUSD != null && this.projectDraftDetails.amtAlloNatPartUSD != undefined) {
          this.projectForm2.controls.nationalAmountusd.patchValue((this.currencyPipe.transform(this.projectDraftDetails.amtAlloNatPartUSD, " ")));
          if (this.projectDraftDetails.totOdaAmtAlloUSD != null && this.projectDraftDetails.totOdaAmtAlloUSD != undefined) {
            this.projectForm2.controls.totalAmountUsd.patchValue((this.currencyPipe.transform(((+this.projectDraftDetails.totOdaAmtAlloUSD) + (+this.projectDraftDetails.amtAlloNatPartUSD)), " ")));
            this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / ((+this.projectDraftDetails.totOdaAmtAlloUSD) + (+this.projectDraftDetails.amtAlloNatPartUSD))) * 100) + '').toFixed(2));
          }
        }
        if (this.projectDraftDetails.totOdaAmtAlloMZN != null && this.projectDraftDetails.totOdaAmtAlloMZN != undefined) {
          this.projectForm2.controls.odaAmountMzn.patchValue((this.currencyPipe.transform(this.projectDraftDetails.totOdaAmtAlloMZN, " ")));
        }
        if (this.projectDraftDetails.totOdaAmtAlloUSD != null && this.projectDraftDetails.totOdaAmtAlloUSD != undefined) {
          this.projectForm2.controls.odaAmountUsd.patchValue((this.currencyPipe.transform(this.projectDraftDetails.totOdaAmtAlloUSD, " ")));
        }
      }
    });
  }

  private getProvinces() {
    this.provincesService.getProvincesList().subscribe(data => {
      this.provinceList1 = data;
      // if(this.browserLang=='en'){
      //   this.provinceList1 = this.provinceList1.sort((a, b) => (a.provinces_name.toLowerCase() > b.provinces_name.toLowerCase()) ? 1 : ((b.provinces_name.toLowerCase() > a.provinces_name.toLowerCase()) ? -1 : 0));
      // }
      // else{
      //   this.provinceList1 = this.provinceList1.sort((a, b) => (a.provinces_name.toLowerCase() > b.provinces_name.toLowerCase()) ? 1 : ((b.provinces_name.toLowerCase() > a.provinces_name.toLowerCase()) ? -1 : 0));
      // }
      this.filteredOptionProvinces = this.searchTextboxControlProvinces.valueChanges
        .pipe(
          startWith<string>(''),
          map(name => this._filterdProvinces(name).sort())
        );
    });
  }
  private getIatiLocation() {
    this.iatiLocationService.getIatiLocationList().subscribe(data => {
      this.iatiLocationList = data;
    });
  }
  private getDistricts() {
    console.log("provincesId:" + this.projectForm.controls['provinces'].value);
    var provincesId = this.projectForm.controls['provinces'].value;
    this.districtsService.getDistrictByProvinceId(provincesId).subscribe(data => {
      this.district = data;
      if (this.browserLang == 'en') {
        this.district = this.district.sort((a, b) => (a.districts_name.toLowerCase() > b.districts_name.toLowerCase()) ? 1 : ((b.districts_name.toLowerCase() > a.districts_name.toLowerCase()) ? -1 : 0));
      }
      else {
        this.district = this.district.sort((a, b) => (a.districts_name.toLowerCase() > b.districts_name.toLowerCase()) ? 1 : ((b.districts_name.toLowerCase() > a.districts_name.toLowerCase()) ? -1 : 0));
      }
    });
  }

  provName: any;
  district1: any;
  districtbyProvId(provId) {
    this.districtsService.getDistrictByProvinceId(provId).subscribe(data => {
      //  console.log("district data",data);
      this.district1 = data;
    });
    return this.district1;
  }
  provname(provId) {
    for (let i = 0; i < this.provinceList1.length; i++) {
      if (provId === this.provinceList1[i].provinces_id)
        this.provName = this.provinceList1[i].provinces_name;


    }
    // console.log("district1--->",this.district1);
    return this.provName;

  }

  v_goalName: any;
  goalName(goalId) {
    this.getValueByLang();
    if(this.browserLang=='en'){
      for (let i = 0; i < this.sDGList.length; i++) {
        if (goalId === this.sDGList[i].sustainableDevelopmentGoalId)
          this.v_goalName = this.sDGList[i].sustainableDevelopmentGoalName;
      }
    }
    else{
      for (let i = 0; i < this.sDGList.length; i++) {
        if (goalId === this.sDGList[i].sustainableDevelopmentGoalId)
          this.v_goalName = this.sDGList[i].sustainableDevelopmentGoalNamePt;
      }
    }
    return this.v_goalName;
  }

  prvSdgVal: string[] = [];
  getSdgTargets(select: MatSelect) {
    var goal_id = this.projectForm.controls['sustainable_development_goals'].value;
    let prvSdgVal1: string[] = select.value;
    if (this.prvSdgVal.toString() !== prvSdgVal1.toString()) {
      if (prvSdgVal1.toString() != null && prvSdgVal1.toString() != '' && prvSdgVal1.toString() != undefined) {
        this.sdgTargetService.getSustainableDevelopmentTargets(goal_id).subscribe(data => {
          this.sDGTargetList = data;
          for (let i = 0; i < this.sDGTargetList.length; i++) {
            let crtDt = this.sDGTargetList[i].createdOn;
            let updateDt = this.sDGTargetList[i].updatedOn;
            this.today = new Date();
            crtDt = new Date(crtDt);
            //calculate time difference
            var time_difference = this.today.getTime() - crtDt.getTime();
            //calculate days difference by dividing total milliseconds in a day
            var days_difference = time_difference / (1000 * 60 * 60 * 24);
            this.sDGTargetList[i].updateDifference = 15
            if (updateDt != null) {
              updateDt = new Date(updateDt);
              var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
              var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
              this.sDGTargetList[i].updateDifference = days_differenceForUpdate;
            }
            (this.sDGTargetList[i].difference) = days_difference;
          }
        });
      }
    }
    this.prvSdgVal = select.value;
  }

  private getOrganization() {
    this.organizationService.getOrganizationList().subscribe(data => {
      this.organizationList = data;
      if (this.browserLang == 'en') {
        this.organizationList = this.organizationList.sort((a, b) => (a.names.toLowerCase() > b.names.toLowerCase()) ? 1 : ((b.names.toLowerCase() > a.names.toLowerCase()) ? -1 : 0));
      }
      else {
        this.organizationList = this.organizationList.sort((a, b) => (a.names.toLowerCase() > b.names.toLowerCase()) ? 1 : ((b.names.toLowerCase() > a.names.toLowerCase()) ? -1 : 0));
      }
      this.organizationListFilteredOption = this.searchOrgName.valueChanges
        .pipe(
          startWith(''),
          map(orgData => orgData ? this.filterOrganization(orgData) : this.organizationList.slice())
        );
      this.getResponsibleOrganizationDetails(this.organizationList);
      this.getImplementingOrganizationList(this.organizationList);
    });
  }

  private filterOrganization(name: string) {
    return this.organizationList.filter(organization =>
      organization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(name.toLowerCase()) !== -1 || organization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  private getIndividual() {
    this.individualCrudServiceService.getIndividualDropdownURL().subscribe(data => {
      this.individualList = data;
      if (this.browserLang == 'en') {
        this.individualList = this.individualList.sort((a, b) => (a.names.toLowerCase() > b.names.toLowerCase()) ? 1 : ((b.names.toLowerCase() > a.names.toLowerCase()) ? -1 : 0));
      }
      else {
        this.individualList = this.individualList.sort((a, b) => (a.names.toLowerCase() > b.names.toLowerCase()) ? 1 : ((b.names.toLowerCase() > a.names.toLowerCase()) ? -1 : 0));
      }
    });
  }

  private getDonor() {
    this.donorService.getDonorList().subscribe(data => {
      this.organizationOptions = data;
    });
  }

  private getSustainableDevelopmentGoalDetails() {
    this.sdgService.getSustainableDevelopmentGoal().subscribe(data => {
      this.sDGList = data;
      for (let i = 0; i < this.sDGList.length; i++) {
        let crtDt = this.sDGList[i].createdOn;
        let updateDt = this.sDGList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.sDGList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.sDGList[i].updateDifference = days_differenceForUpdate;
        }
        (this.sDGList[i].difference) = days_difference;
      }
    });
  }

  private getProvinceByFinancialAgreementId(financialAgreementIds: number[]) {
    this.projectForm.controls.provinces.reset();
    let provinceArr: number[] = [];
    this.projectCrudService.getProvinceByFinancialAgreementId(financialAgreementIds).subscribe(data => {
      this.provincesBySelectFund = data;
     
      this.provincesBySelectFund.forEach(x => {
        provinceArr.push(x.provinceMasterId);
      });
     
      this.projectForm.controls.provinces.patchValue(provinceArr);
      this.setSelectedValuesProvinces();
      this.getDistricts();

      this.getDistrictByFinancialAgreementId(financialAgreementIds);
    });
  }

  private getDistrictByFinancialAgreementId(financialAgreementIds: number[]) {
    this.projectForm.controls.districts.reset();
    let districtArr: number[] = [];
    this.projectCrudService.getDistrictByFinancialAgreementId(financialAgreementIds).subscribe(data => {
      this.districtsBySelectFund = data;
      this.districtsBySelectFund.forEach(x => {
        districtArr.push(x.districtMasterId);
      });
      this.projectForm.controls.districts.patchValue(districtArr);
    });
  }

  paymentArray = [{ project: "1", financing: "Mozabique Bank", paymentDate: "01/02/2021", disbursementPaymentAmount: "65000", meticaisPaymentAmount: "66488.19", usdPaymentAmount: "5600", exchangeRates: 12.9 }];
  addPaymentRow1() {
    this.newPayment = { project: "", financing: "", donor: "", disbursementDate: "", disbursementAmount: "", meticaisAmountdisbursement: "", usdDisbursementAmount: "", exchangeRates: "" };
    this.paymentArray.push(this.newPayment);
    //this.toastr.success('New row added successfully', 'New Row');
   
    return true;
  }
  allocation_flag = "false";
  deletePaymentRow1(index: number) {
    if (this.paymentArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.paymentArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }

  disabledProvValue = false;

  showDistrict() {
    // if (this.projectForm.controls.provinces.value[0] != 0) {
    //   this.select_options_for_prv_opt_flag1 = false;
    // }
    // else {
    //   this.select_options_for_prv_opt_flag1 = true;
    // }
    // if (this.projectForm.controls.provinces.value.length === 0) {
    //   this.select_options_for_prv_opt_flag1 = true;
    // }
    let projectType = this.projectForm.controls['provinces'].value;

   
    for (let i = 0; i < projectType.length; i++) {
      if (projectType[i] !== 0) {
        this.select_options_for_district_hdn_flag = false;
        this.disabledProvValue = false;
        this.getDistricts();
      }
      else {

        this.disabledProvValue = true;
        this.select_options_for_district_hdn_flag = true;

      }
    }
  }

  dynamicArray = [{ project: "Maputo Express Highway", financing: "Mozabique Bank", donor: "Mozabique Bank", disbursementDate: "01/02/2021", disbursementAmount: "56488.19", meticaisAmountdisbursement: "36488.19", usdDisbursementAmount: "4600", exchangeRates: 12.9 }];


  addRow1() {
    this.newDynamic = { project: "", financing: "", donor: "", disbursementDate: "", disbursementAmount: "", meticaisAmountdisbursement: "", usdDisbursementAmount: "", exchangeRates: "" };
    this.dynamicArray.push(this.newDynamic);
    //this.toastr.success('New row added successfully', 'New Row');
  
    return true;
  }

  deleteRow1(index: number) {
    if (this.dynamicArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');
      return true;
    }
  }

  headers = ["Purpose DAC-CRS", "Fund", "Currency", "Funds (MZN)", "Funds (USD)"];
  headersListofassociatedFunding = ["Action", "Funding Reference", "Funding Title", "Funding Organization", "Start Date", "End Date", "Amount Allocated in Financial Agreement (USD)"];
  //  mj:any={"DAC-CRS sector" : [],"Funds":[]};
  rows = [
    {
      "Purpose DAC-CRS": "",
      "DAC-CRS sector": "",
      "Fund": "",
      "Currency": ""
    }

    // {
    //   "DAC-CRS sector" : "1",
    //   "Funds" : "1000"
    // },
    // {
    //   "DAC-CRS sector" : "2",
    //   "Funds" : "2000"
    // }
  ];
  managerheaders = ["Organization", "Project Stakeholder", "Start Date", "End Date", "Post", "Email ID", "Contact Phone No"];
  commentHeaders = ["Comments"];
  managePurposeDACCRSHeaders = ["Purpose DAC-CRS", "DAC-CRS Sector", "Fund", "Currency"];
  markerHeaders = ["Markers", "Scoring"];
  markersList: MarkerMaster[] = [];
  // markersOptionsList:MarkerMasterOptions[]=[];
  covid19MasterOptionsList: Covid19Master[] = [];
  genderEqualityMarkerOptionsList: GenderEqualityMarker[] = [];
  rioMarkerClimateChangeMitigationOptionsList: RioMarkerClimateChangeMitigation[] = [];
  rioMarkerClimateChangeDesertification: RioMarkerClimateChangeDesertification[] = [];
  rioMarkerClimateChangeAdaption: RioMarkerClimateChangeAdaption[] = [];
  rioMarkerBioDiversity: RioMarkerBioDiversity[] = [];

  getMarkerMasterDetails() {
    this.markerMasterService.getMarkerMasterDetails().subscribe(data => {
      this.markersList = data;
      for (let i = 0; i < this.markersList.length; i++) {
        let crtDt = this.markersList[i].createdOn;
        let updateDt = this.markersList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.markersList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.markersList[i].updateDifference = days_differenceForUpdate;
        }
        (this.markersList[i].difference) = days_difference;
      }
      this.getMarkerMasterOptionsDetails();
    });
  }
  getMarkerMasterDetailsPatch(markerTableDataList: MarkerTableData[]) {
    this.markerMasterService.getMarkerMasterDetails().subscribe(data => {
      this.markersList = data;
      this.getMarkerMasterOptionsDetailsPatch(markerTableDataList);
    });
  }
  covid19option: any;
  getMarkerMasterOptionsDetails() {
    // this.markerMasterService.getMarkerMasterOptionsDetails().subscribe(data=>{
    //   this.markersOptionsList=data;
    // });
    this.markerMasterService.getAllCovid19MasterDetails().subscribe(covidData => {
      this.covid19MasterOptionsList = covidData;
      console.log("this.covid19MasterOptionsList", this.covid19MasterOptionsList);
      if (this.browserLang === 'en')
        this.covid19option = this.covid19MasterOptionsList[0].covid19NameEn;
      else
        this.covid19option = this.covid19MasterOptionsList[0].covid19NamePt;
      this.markerMasterService.getAllGenderEqualityMarkerDetails().subscribe(genderEqData => {
        this.genderEqualityMarkerOptionsList = genderEqData;
        this.markerMasterService.getAllRioMarkerClimateChangeMitigationDetails().subscribe(mitigationData => {
          this.rioMarkerClimateChangeMitigationOptionsList = mitigationData;
          this.markerMasterService.getAllRioMarkerClimateChangeDesertificationDetails().subscribe(desertificationData => {
            this.rioMarkerClimateChangeDesertification = desertificationData;
            this.markerMasterService.getAllRioMarkerClimateChangeAdaptionDetails().subscribe(covidData => {
              this.rioMarkerClimateChangeAdaption = covidData;
              this.markerMasterService.getAllRioMarkerBioDiversityDetails().subscribe(bioDiversityData => {
                this.rioMarkerBioDiversity = bioDiversityData;
                this.pushToMarkerTable();
              });
            });
          });
        });
      });
    });
  }
  getMarkerMasterOptionsDetailsPatch(markerTableDataList: MarkerTableData[]) {
    // this.markerMasterService.getMarkerMasterOptionsDetails().subscribe(data=>{
    //   this.markersOptionsList=data;
    // });
    this.markerMasterService.getAllCovid19MasterDetails().subscribe(covidData => {
      this.covid19MasterOptionsList = covidData;
      this.markerMasterService.getAllGenderEqualityMarkerDetails().subscribe(genderEqData => {
        this.genderEqualityMarkerOptionsList = genderEqData;
        this.markerMasterService.getAllRioMarkerClimateChangeMitigationDetails().subscribe(mitigationData => {
          this.rioMarkerClimateChangeMitigationOptionsList = mitigationData;
          this.markerMasterService.getAllRioMarkerClimateChangeDesertificationDetails().subscribe(desertificationData => {
            this.rioMarkerClimateChangeDesertification = desertificationData;
            this.markerMasterService.getAllRioMarkerClimateChangeAdaptionDetails().subscribe(covidData => {
              this.rioMarkerClimateChangeAdaption = covidData;
              this.markerMasterService.getAllRioMarkerBioDiversityDetails().subscribe(bioDiversityData => {
                this.rioMarkerBioDiversity = bioDiversityData;
                this.pushToMarkerTablePatch(markerTableDataList);
              });
            });
          });
        });
      });
    });
  }
  PurposeDACCRSHeaders = ["Purpose DAC-CRS"];

  PurposeDACCRSRow = [{
    "Purpose DAC-CRS": ""

  }];
  public addPurposeDACCRS(): void {
    this.PurposeDACCRSRow.push({
      "Purpose DAC-CRS": ""
    });
  }
  deletePurposeDACCRSRow(d: { "Purpose DAC-CRS": string; }) {
    //console.log(12);
    const index = this.PurposeDACCRSRow.indexOf(d);
    this.PurposeDACCRSRow.splice(index, 1);
  }

  DistrictsHeaders = ["Districts"];

  DistrictsRow = [{
    "Districts": ""

  }];

  public addDistricts(): void {
    this.DistrictsRow.push({
      "Districts": ""
    });
  }
  deleteDistrictsRow(d: { Districts: string; }) {

    //console.log(12);
    const index = this.DistrictsRow.indexOf(d);
    this.DistrictsRow.splice(index, 1);
  }
  searchAssociatedFunding(i: string) {
    if (i == "REF-001") {
      this.flagListfund = "true";
      this.sum = this.sum + 1;
    }
    else
      this.flagListfund = "false";
    if (this.flagListfund == "true") {
      var currentElement: any;
      
      if (this.projectForm.controls['SelectListOfAssociatedFunding'].value == 'List Of Associated Funding1')
        currentElement = this.associatedFundingRows[0];
      else
        currentElement = this.associatedFundingRows[1];
      this.associatedFundingRows1.splice(this.sum, 0, currentElement);
    }
  }


  manageraddflag: any = [];
  addManager(j) {

    if ((this.projectForm.get('tableDataManager') as FormArray).at(j).get("startDate").value !== ""
      && (this.projectForm.get('tableDataManager') as FormArray).at(j).get("endDate").value !== "") {
      (this.projectForm.get('tableDataManager') as FormArray).at(j).disable();
      this.manageraddflag[j] = false;
    }
  }

  deleteManager(j) {
    (this.projectForm.get('tableDataManager') as FormArray).removeAt(j);
    // console.log("this.projectform", this.projectForm.controls.managers.value);
    // const newToppingsValue = this.projectForm.controls.managers.value.slice();
    // newToppingsValue.splice(j, 1)
    // console.log("newToppingsValue", newToppingsValue);
    // this.projectForm.controls.managers.patchValue(newToppingsValue);
    // if (j !== ((this.projectForm.get('tableDataManager') as FormArray).length - 1))
    //   this.manageraddflag[j] = this.manageraddflag[j + 1];
    // else
    //   this.manageraddflag[j] = true;

    // this.StartDateValue.splice(j, 1);
    // this.endaDateValue.splice(j, 1);
    // console.log("this.startdatevalue", this.StartDateValue);
  }
  // deleteCommentsRow(j){
  //   (this.projectForm.get('tableComments') as FormArray).removeAt(j);
  // }
  deleteCommentsRow(j) {
    this.getValueByLang()
    let length = ((this.projectForm.controls.tableComments as FormArray).length);
    //  if(length == 1){
    //    if(this.browserLang=='en')
    //   Swal.fire("Cannot delete this field","","info");
    //   else
    //   Swal.fire("Não é possível apagar este campo","","info");
    //   return;
    // }
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        (
          this.projectForm.get('tableComments') as FormArray
        ).removeAt(j);
        this.commentsData.splice(j, 1);
        this.permissionDeleteComment.splice(j, 1);
      } else if (result.isDenied) {
      }
    });
  }
  checkOrganizationName(index: any) {
    this.manager_flag = false;
   
    if (this.projectForm.value.orgName == "1") {

      this.flagOrgName = "WHO"
    } else if (this.projectForm.value.orgName == "2") {

      this.flagOrgName = "India"
    } else if (this.projectForm.value.orgName == "3") {

      this.flagOrgName = "USA"
    }
    else
      this.flagOrgName = "false";




  }
  getManagertable() {
    this.manager_table_flag = false;
  }

  addManagerRow() {

    const row = this.fb.group({
      orgName: ['', [Validators.required]],
      managers: [{ value: '', disabled: true }, [Validators.required]],
      startDate: [{ value: '', disabled: true }],
      endDate: [{ value: '', disabled: true }],
      // firstName: [{value:'',disabled:true}],
      // lastName:[{value:'',disabled:true}],
      post: [{ value: '', disabled: true }],
      emailId: [{ value: '', disabled: true }],
      contactNo: [{ value: '', disabled: true }]
    });
    (this.projectForm.get('tableDataManager') as FormArray).push(row);
    // for(let j=0;j< (this.projectForm.get('tableDataManager') as FormArray).length;j++){
    //   if( ((this.projectForm.get('tableDataManager') as FormArray).at(j) as FormGroup).get('firstName').value===null
    //   ||  ((this.projectForm.get('tableDataManager') as FormArray).at(j) as FormGroup).get('firstName').value === undefined)
    //   (this.projectForm.get('tableDataManager') as FormArray).removeAt(j);
    // }

    // for(let i=0;i<this.StartDateValue.length;i++)
    // {
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').patchValue(this.StartDateValue[i]);
    // }
    // for(let i=0;i<this.endaDateValue.length;i++)
    // {
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').patchValue(this.endaDateValue[i]);
    // }

    //(this.projectForm.get('tableDataManager') as FormArray).disable();
  }

  date = new Date() + '';
  todayDateTime: string = this.date.substring(0, 24);
  userName = "Charlie Adams";
  // addCommentRow(){
  //   this.date=new Date()+'';
  //   this.todayDateTime=this.date.substring(0,24);
  //   const row = this.fb.group({
  //       comments:['']
  //   });
  //   (this.projectForm.get('tableComments') as FormArray).push(row);
  // }
  addCommentRow() {

    this.getValueByLang()
    let length: number = (this.projectForm.controls.tableComments as FormArray).length;

    let tableData = null;
    if (length > 0) {
      tableData = ((this.projectForm.controls.tableComments as FormArray).at(length - 1) as FormControl).value;

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
        this.projectForm.get('tableComments') as FormArray
      ).push(row);
    } else if (length == 0) {
      const row = this.fb.group({
        comments: [''],
      });
      (
        this.projectForm.get('tableComments') as FormArray
      ).push(row);
    }
    length = (this.projectForm.controls.tableComments as FormArray).length;
    if (length > 0)
      this.generateCommentsData(length - 1);

    this.permissionDeleteComment[length - 1] = true;
  }

  clearTableDataManager() {
    if ((this.projectForm.get('tableDataManager') as FormArray).length !== 0) {
      (this.projectForm.get('tableDataManager') as FormArray).removeAt(0);
    }
  }

  StartDateValue: any = [];
  endaDateValue: any = [];

  dateChangeProMan(j) {
    this.StartDateValue.push(((this.projectForm.get('tableDataManager') as FormArray).at(j) as FormGroup).controls.startDate.value);
    this.endaDateValue.push(((this.projectForm.get('tableDataManager') as FormArray).at(j) as FormGroup).controls.endDate.value);
  }

  getmanager(event) {
    console.log("length", (this.projectForm.get('tableDataManager') as FormArray).length);
    for (let j = 0; j < (this.projectForm.get('tableDataManager') as FormArray).length; j++) {

      //  this.StartDateValue.push(((this.projectForm.get('tableDataManager') as FormArray).at(j)as FormGroup).controls.startDate.value);
      //  this.endaDateValue.push(((this.projectForm.get('tableDataManager') as FormArray).at(j)as FormGroup).controls.endDate.value);
      (this.projectForm.get('tableDataManager') as FormArray).reset();
      (this.projectForm.get('tableDataManager') as FormArray).removeAt(j);
    }
    console.log("startdate,end", this.StartDateValue, this.endaDateValue);
    if (event.value.length != 0) {
      for (let i = 0; i < event.value.length; i++) {
        this.addManagerRow();
      }
      if (((this.projectForm.get('tableDataManager') as FormArray).at(0) as FormGroup).get('firstName').value !== null
        || ((this.projectForm.get('tableDataManager') as FormArray).at(0) as FormGroup).get('firstName').value !== undefined
        || ((this.projectForm.get('tableDataManager') as FormArray).at(0) as FormGroup).get('firstName').value !== '')
        this.manager_table_flag = false;
    }
  }
  validateOnChangeOrgName(e) {

    if (this.projectForm.value.projectSituation !== "") {
      this.flagListProj = "true";

    } else {
      this.flagListProj = "false";
    }

    //logic forimplOrg required field
    if (e.value == 1) {
      this.implOrgMandatoryFlag = false;
      this.projectForm.controls['implementingOrganization'].clearValidators();
    }
    else {

      this.implOrgMandatoryFlag = true;
      this.projectForm.controls['implementingOrganization'].setValidators([Validators.required]);
    }
    this.projectForm.controls['implementingOrganization'].updateValueAndValidity();
  }

  associatedFundingHeaders = ["Action", "Donor Funding Reference", "Funding Donor Title", "Donor", "Date Of Signature", "Start Date", "Come In Like.."];
  associatedFundingRows1 = [];
  associatedFundingRows = [{
    "Donor Funding Reference": "Donor-336",
    "Funding Donor Title": "World Bank",
    "Donor": "World Bank",
    "Date Of Signature": "01/02/2021",
    "Start Date": "01/02/2021",
    "Comments ": "Donated funds to the Govt.",
    "Come In Like..": "In Currency"


  },
  {
    "Donor Funding Reference": "Donor-337",
    "Funding Donor Title": "WHO",
    "Donor": "WHO",
    "Date Of Signature": "01/02/2019",
    "Start Date": "01/02/2019",
    "Comments ": "Donated funds to the Govt.",
    "Come In Like..": "In Kind"


  }
  ];


  deleteAssociatedFunding(d: { "Donor Funding Reference": string; "Funding Donor Title": string; Donor: string; "Date Of Signature": string; "Start Date": string; "Comments ": string; "Come In Like..": string; }) {
    //console.log(12);
    const index = this.associatedFundingRows.indexOf(d);
    this.associatedFundingRows.splice(index, 1);
  }

  //projectManagerheaders = ["Organization Name", "Title", "Email ID", "Contact Phone No", "Start Date", "End Date"];
  projectManagerheaders = ["First Name", "Last Name", "Post", "Email ID", "Contact Phone No"];

  projectManagerRows = [{
    "First Name": "Tanya",
    "Last Name": " Anacleto",
    "Post": "Research",
    "Email ID": "wkc@wkc.who.int",
    "Contact Phone No": " +81 78 230 3100"
  }];

  projectManagerRows1 = [{
    "First Name": "Bheu",
    "Last Name": "Januário",
    "Post": "Finance",
    "Email ID": "wim-dfs@nic.in",
    "Contact Phone No": "011-23748769",
  }];

  projectManagerRows2 = [{
    "First Name": "Daviz",
    "Last Name": "Simango",
    "Post": "Finance",
    "Email ID": "SBLFInstitutions@treasury.gov",
    "Contact Phone No": "(800) 333-1795"
  }];

  public addProjectManager(): void {
    this.projectManagerRows.push({
      "First Name": "",
      "Last Name": "",
      "Post": "",
      "Email ID": "",
      "Contact Phone No": ""
    });
  }

  deleteProjectManager(d: { "First Name": string; "Last Name": string; "Post": string; "Email ID": string; "Contact Phone No": string }) {
    //console.log(12);
    const index = this.projectManagerRows.indexOf(d);
    this.projectManagerRows.splice(index, 1);
  }

  listofcommitments = ["Action", "Year", "Funding Organization", 'Financial Agreement', "Amount (MZN)", "Amount (USD)"];

  listofcommitmentsPt = ["Acção", "Ano", "Organização Financiadora", "Acordo de Financiamento", "Montante (MZN)", "Montante (USD)"];

  totalAlloAmtForFindingRates: number;
  private findTotalAmountCommitment() {
    this.totalAmtMZNCmmt = 0;
    this.totalAmtUSDCmmt = 0;
    for (let i = 0; i < this.fundingCommitmentDetails.length; i++) {
      this.totalAmtMZNCmmt = this.totalAmtMZNCmmt + (+(this.fundingDetails[i].amt_mzn + ''));
      this.totalAmtUSDCmmt = this.totalAmtUSDCmmt + (+(this.fundingDetails[i].amt_usd + ''));
    }
    this.totalAlloAmtForFindingRates = this.totalAmtMZNCmmt;
  }

  listofcommitmentsRows = [
    {
      "Year": "2021",
      "Funding Organization": "Bank Of Australia",
      "Financial Agreement": "FIN-001",
      "Amount (MZN)": "201065.00",
      "Amount (USD)": "280284.00"

    },

    {
      "Year": "2022",
      "Funding Organization": "Bank Of Australia",
      "Financial Agreement": "FIN-002",
      "Amount (MZN)": "3726065.00",
      "Amount (USD)": "9826182.00"
    }
  ];




  listofdisbursements = ["Action", "ID", "Funding Organization", 'Financial Agreement', "Date", "Amount", "Disbursement Currency", "Amount (MZN)", "Amount (USD)"];
  private findTotalAmountDisburse() {
    this.totalAmtMZNDisb = 0;
    this.totalAmtUSDDisb = 0;
    for (let i = 0; i < this.disbursementDetails.length; i++) {
      this.totalAmtMZNDisb = this.totalAmtMZNDisb + (+(this.disbursementDetails[i].disbursementAmountMZN + '').replace(/[^0-9.]+/g, ''));
      this.totalAmtUSDDisb = this.totalAmtUSDDisb + (+(this.disbursementDetails[i].disbursementAmountUSD + '').replace(/[^0-9.]+/g, ''));
    }
    this.projectFormDisbursements.controls['totalAmountOfDisbursedMZN'].setValue(this.currencyPipe.transform(this.totalAmtMZNDisb, " "));
    this.projectFormDisbursements.controls['totalAmountOfDisbursedUSD'].setValue(this.currencyPipe.transform(this.totalAmtUSDDisb, " "));
    console.log("this.totalAmtMZNDisb", this.totalAmtMZNDisb);
    console.log("this.totalAlloAmtForFindingRates", this.projectForm2.controls['totalAmountMzn'].value);
    // if(isNaN(parseFloat(((this.totalAmtMZNDisb/this.totalAlloAmtForFindingRates)*100)+'')))
    // this.projectFormDisbursements.controls['disbursementRate'].setValue(0);
    // else
    this.projectFormDisbursements.controls['disbursementRate'].setValue(parseFloat(((this.totalAmtMZNDisb / (this.projectForm2.controls['totalAmountMzn'].value.replace(/[^0-9.]+/g, ''))) * 100) + '').toFixed(2));
  }
  listofdisbursementsRows = [
    {
      "ID": "1",
      "Funding Organization": "Bank Of Australia",
      "Financial Agreement": "FIN-001",
      // "Donor": "Mozabique Bank",
      "Date": "01/02/2021",
      "Amount": "31,451.00",
      "Disbursement Currency": "Australia Dollar (AUD)",
      "Amount (MZN)": "201065.00",
      "Amount (USD)": "280284.00"

    },

    {
      "ID": "2",
      "Funding Organization": "Bank Of India",
      "Financial Agreement": "FIN-002",
      //"Donor": "Mozabique Bank",
      "Date": "01/03/2021",
      "Amount": "76,489.19",
      "Disbursement Currency": "Indian Rupee (INR)",
      "Amount (MZN)": "664880.00",
      "Amount (USD)": "926842.00"
    }
  ];


  // paymentList = ["Action","Payment ID", "Financial Agreement", "Payment Date", "Payment Amount (Disbursement Currency)", "Payment Amount (MZN)", "Payment Amount (USD)", "Exchange Rates"];
  paymentList = ["Action", "ID", "Financial Agreement", "Date", "Amount", "Payment Currency", "Amount (MZN)", "Amount (USD)"];
  private findTotalAmountPayment() {
    this.totalAmtMZNPmt = 0;
    this.totalAmtUSDPmt = 0;
    for (let i = 0; i < this.paymentDetails.length; i++) {
      this.totalAmtMZNPmt = this.totalAmtMZNPmt + (+(this.paymentDetails[i].paymentAmountMZN + '').replace(/[^0-9.]+/g, ''));
      this.totalAmtUSDPmt = this.totalAmtUSDPmt + (+(this.paymentDetails[i].paymentAmountUSD + '').replace(/[^0-9.]+/g, ''));
    }
    this.projectFormPayments.controls['totalAmountPaidMZN'].setValue(this.currencyPipe.transform(this.totalAmtMZNPmt, " "));
    this.projectFormPayments.controls['totalAmountPaidUSD'].setValue(this.currencyPipe.transform(this.totalAmtUSDPmt, " "));
    this.projectFormPayments.controls['financialExecutionRate'].setValue(parseFloat(((this.totalAmtMZNPmt / (this.projectForm2.controls['totalAmountMzn'].value.replace(/[^0-9.]+/g, ''))) * 100) + '').toFixed(2));
  }
  paymentListRows = [
    {
      "ID": "1",
      "Financial Agreement": "FIN-001",
      "Date": "01/02/2021",
      "Amount": "65,000.00",
      "Payment Currency": "Australia Dollar (AUD)",
      "Amount (MZN)": "66488.19",
      "Amount (USD)": "5600.00",

    },
    {
      "ID": "2",
      "Financial Agreement": "FIN-002",
      "Date": "03/02/2021",
      "Amount": "55,000.00",
      "Payment Currency": "Indian Rupee (INR)",
      "Amount (MZN)": "56488.19",
      "Amount (USD)": "460220.23",

    }
  ];

  snipRows = [
    {
      "e_snipId": "1001",
      "e_SnipProjectTitle": "Project 001 - Health",
      "projectOverview": "Allocated Amount (MZN): 12,789.00, Allocated Amount (USD): 29,566",
      "projectSituation": "Identification / Planning",
      "startDate": "2021-03-25T18:30:00.000Z",
      "endDate": "2021-07-23T18:30:00.000Z"
    },
    {
      "e_snipId": "1002",
      "e_SnipProjectTitle": "Project 002 - Education",
      "projectOverview": "Allocated Amount (MZN): 11,424.00, Allocated Amount (USD): 11,231",
      "projectSituation": "Signed",
      "startDate": "2019-04-11T18:30:00.000Z",
      "endDate": "2019-06-16T18:30:00.000Z"
    },
    {
      "e_snipId": "1003",
      "e_SnipProjectTitle": "Project 003 - Transport",
      "projectOverview": "Allocated Amount (MZN): 10,874.00, Allocated Amount (USD): 31,231",
      "projectSituation": "Ongoing",
      "startDate": "2020-11-11T18:30:00.000Z",
      "endDate": "2019-03-16T18:30:00.000Z"
    },
    {
      "e_snipId": "1004",
      "e_SnipProjectTitle": "Project 004 - Communication",
      "projectOverview": "Allocated Amount (MZN): 99,424.00, Allocated Amount (USD): 91,253",
      "projectSituation": "Suspended",
      "startDate": "2019-08-10T18:30:00.000Z",
      "endDate": "2020-04-16T18:30:00.000Z"
    },
    {
      "e_snipId": "1005",
      "e_SnipProjectTitle": "Project 005 - Culture",
      "projectOverview": "Allocated Amount (MZN): 39,453.00, Allocated Amount (USD): 12,635",
      "projectSituation": "Canceled",
      "startDate": "2019-01-11T18:30:00.000Z",
      "endDate": "2019-03-16T18:30:00.000Z"
    }
  ];

  public addItem(): void {
    this.rows.push({ "Purpose DAC-CRS": "", "DAC-CRS sector": "", "Fund": "", "Currency": "" });
  }

  get dateFormArray(): FormArray {
    return this.projectForm2.get('tableData') as FormArray;
  }

  viewMoreDisbursement(disbursement_id: any) {

    // localStorage.setItem("ViewMoreDisbursement", "ViewMoreDisbursement");
    // console.log("View More inside view--->", localStorage.getItem("ViewMoreDisbursement"));
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/edit-disbursement']));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-disbursement', disbursement_id]));

  }

  //Sourav Kumar Nayak
  setToUserDisbursementPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Disbursement List')
        this.userDisbursementPermission = this.uAccessPermArr[i].permissionArr;
    }
  }
  //Sourav Kumar Nayak
  setToUserPaymentPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Payment List')
        this.userPaymentPermission = this.uAccessPermArr[i].permissionArr;
    }
  }
  //Sourav Kumar Nayak
  setToUserFundingPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Financial Agreement')
        this.userFundingPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Create Project') {
        this.authorised_flag = true;
      }
    }
  }



  moveToSelectedTabFunding(editFaId: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-funding', editFaId]));
    console.log("after route");
  }

  // viewMorePayment(element:any,i:any){

  //   localStorage.setItem("ViewMorePayment", "ViewMorePayment");
  //   // localStorage.setItem("Index",i);
  //   // console.log("View More inside view--->",localStorage.getItem("ViewMoreDisbursementFromProject"));
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
  //   this.router.navigate(['/admin/edit-payment']));

  // }
  viewMoreFunding(viewMoreFaId: number) {
    localStorage.setItem("ViewMoreFundingFromProject", "ViewMoreFundingFromProject");
    // localStorage.setItem("Index", i);
    // console.log("View More inside view--->", localStorage.getItem("ViewMoreFundingFromProject"));
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/edit-funding']));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-funding', viewMoreFaId]));

  }

  public addItem1(): void {
    const row = this.fb.group({
      purposeDACCRS: ['', [Validators.required]],
      enter_funds: [{ value: '', disabled: true }],
      currency1: [{ value: '', disabled: true }],
      funds_mzn: [{ value: '', disabled: true }],
      funds_usd: [{ value: '', disabled: true }]
    });
    (this.projectForm2.get('tableData') as FormArray).push(row);
    //(this.projectForm2.get('tableData') as FormArray).disable();
    console.log("envelopeform--->", this.projectForm2);
  }




  viewMorePayment(payment_id: number) {
    localStorage.setItem("ViewMorePayment", "ViewMorePayment");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-payment', payment_id]));
  }


  moveToSelectedTabPayment(payment_id: number) {
    // localStorage.setItem("EditPayment", "EditPayment");

    // console.log("editenv inside view--->", localStorage.getItem("EditPayment"));


    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/edit-payment']));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-payment', payment_id]));
    console.log("after route");

  }


  moveToSelectedTabDisbursement(disbursement_id: any) {
    // localStorage.setItem("EditDisbursement", "EditDisbursement");

    // console.log("editenv inside view--->", localStorage.getItem("EditDisbursement"));


    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/admin/edit-disbursement']));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-disbursement', disbursement_id]));

    console.log("after route");

  }

  opensweetalertDeleteFunding(funding_id: number) {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.listOfAssociatedFundingService.deleteById(funding_id).subscribe(data => {
          let response: any = data;
          // response = JSON.parse(data);
          // this.fundingDetails=response.newList;
          //this.findTotalAmountCommitment();
        });
        if (this.browserLang == 'en')
          Swal.fire('Deleted successfully', '', 'success')
        else
          Swal.fire('Apagado com sucesso', '', 'success')
        // this.moveToSelectedTab();
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  opensweetalertDeleteDisubrsement(disbursement_id: number) {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.disbursementCrudService.deleteById(disbursement_id).subscribe(data => {
          this.disbursementDetails = data;
          this.findTotalAmountDisburse();
        });
        if (this.browserLang == 'en')
          Swal.fire('Deleted successfully', '', 'success')
        else
          Swal.fire('Apagado com sucesso', '', 'success')
        // this.moveToSelectedTab();
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  opensweetalertDeletePayment(payment_id: number) {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Delete?' : 'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Delete` : 'Apagar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.paymentCrudServiceService.deleteById(payment_id).subscribe(data => {
          this.paymentDetails = data;
          this.findTotalAmountPayment();
        });
        if (this.browserLang == 'en')
          Swal.fire('Deleted successfully', '', 'success')
        else
          Swal.fire('Apagado com sucesso', '', 'success')
        // this.moveToSelectedTab();
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }


  public addPaymentList(): void {
    this.paymentListRows.push({
      "ID": "",
      "Financial Agreement": "",
      "Date": "",
      "Amount": "",
      "Payment Currency": "",
      "Amount (MZN)": "",
      "Amount (USD)": "",

    });
  }
  public addDisbursements(): void {
    this.listofdisbursementsRows.push({
      "ID": "",
      "Funding Organization": "",
      "Financial Agreement": "",

      //"Donor": "",
      "Date": "",
      "Amount": "",
      "Amount (MZN)": "",
      "Amount (USD)": "",
      "Disbursement Currency": ""
    });
  }

  //Sustainable Development Goals(SDG) code start..
  chcksdg11: any;
  chcksdg1: any;
  chcksdg2: any;
  chcksdg3: any;
  chcksdg4: any;

  call1(i: any) {

    if (this.chcksdg11 = i) {
      this.chcksdg1 = "true";

    } else {
      // this.SDGRow1[{}]=[];
      this.SDGRow1 = [];

    }

  }

  call2(i: any) {


    this.chcksdg2 = "true";
  }

  call3(i: any) {


    this.chcksdg3 = "true";
  }
  moveToProjectTab() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-project']));
  }

  call4(i: any) {


    this.chcksdg4 = "true";
  }
  SDGHeaders = ["Goals"];

  SDGRow1 = [{
    "Sustainable Development Goals(SDG)": ""

  }];


  public addSDG1(): void {
    this.SDGRow1.push({
      "Sustainable Development Goals(SDG)": "",
    });
  }


  deleteSDGRow1(d: { "Sustainable Development Goals(SDG)": string; }) {

    const index = this.SDGRow1.indexOf(d);
    this.SDGRow1.splice(index, 1);
  }

  SDGRow2 = [{
    "Sustainable Development Goals(SDG)": ""

  }];


  public addSDG2(): void {
    this.SDGRow2.push({
      "Sustainable Development Goals(SDG)": ""
    });
  }


  deleteSDGRow2(d: { "Sustainable Development Goals(SDG)": string; }) {

    const index = this.SDGRow2.indexOf(d);
    this.SDGRow2.splice(index, 1);
  }

  SDGRow3 = [{
    "Sustainable Development Goals(SDG)": ""

  }];


  public addSDG3(): void {
    this.SDGRow3.push({
      "Sustainable Development Goals(SDG)": ""
    });
  }


  deleteSDGRow3(d: { "Sustainable Development Goals(SDG)": string; }) {

    const index = this.SDGRow3.indexOf(d);
    this.SDGRow3.splice(index, 1);
  }

  SDGRow4 = [{
    "Sustainable Development Goals(SDG)": ""

  }];


  public addSDG4(): void {
    this.SDGRow4.push({
      "Sustainable Development Goals(SDG)": ""
    });
  }


  deleteSDGRow4(d: { "Sustainable Development Goals(SDG)": string; }) {

    const index = this.SDGRow4.indexOf(d);
    this.SDGRow4.splice(index, 1);
  }


  //Sustainable Development Goals(SDG) code end..

  deleteRow(index: number) {
   
    this.rows.splice(index, 1);
  }

  deletePurposeDaccrsData(index: number) {
    this.getValueByLang()
    if (((this.projectForm2.get('tableData') as FormArray).length) == 1) {
      if (this.browserLang == 'en')
        Swal.fire('At least one record is required', '', 'error');
      else
        Swal.fire('É necessário pelo menos um registo', '', 'error');
    }
    else {
      (this.projectForm2.get('tableData') as FormArray).removeAt(index);
      this.totOdaAmtMzn = 0;
      this.totOdaAmtUsd = 0;
      for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
        this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
        this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
      }
      this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
      this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
      this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
      this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
    }
  }

  deleteAssociateRows(index: number) {
    (this.projectForm.get('tableData') as FormArray).removeAt(index);
    console.log("this.projectform", this.projectForm.controls.SelectListOfAssociatedFunding.value);
    const newToppingsValue = this.projectForm.controls.SelectListOfAssociatedFunding.value.slice();
    newToppingsValue.splice(index, 1)
    console.log("newToppingsValue", newToppingsValue);
    this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(newToppingsValue);


    // if(this.associatedFundingRows1.length==1)
    //  this.opensweetalert4();
    // else
    //   this.associatedFundingRows1.splice(index,1);
  }



  // deleteDisbursements(d: { "ID": string; "Funding Organization": string; "Financial Agreement": string; "Date": string; "Amount": string; "Disbursement Currency": string; "Amount (MZN)": string; "Amount (USD)": string; }) {
  //   const index = this.listofdisbursementsRows.indexOf(d);
  //   this.listofdisbursementsRows.splice(index, 1);
  // }

  // deletePayments(d: { "ID": string; "Financial Agreement": string; "Date": string; "Amount": string; "Payment Currency": string; "Amount (MZN)": string; "Amount (USD)": string; }) {
  //   const index = this.paymentListRows.indexOf(d);
  //   this.paymentListRows.splice(index, 1);
  // }
  // deleteRows(d: { "ID": string; "Funding Organization": string; "Financial Agreement": string; "Date": string; "Amount": string; "Amount (MZN)": string; "Amount (USD)": string; "Disbursement Currency": string; }) {
  //   //console.log(12);
  //   const index = this.listofdisbursementsRows.indexOf(d);
  //   this.listofdisbursementsRows.splice(index, 1);
  // }
  today: any;
  private getProjectSituationDetails() {
    this.projectSituationService.getProjectSituationList().subscribe(data => {
      this.projectSituationList = data;
      // if(this.browserLang=='en'){
      //   this.projectSituationList = this.projectSituationList.sort((a, b) => (a.projectSituationNameEn.toLowerCase() > b.projectSituationNameEn.toLowerCase()) ? 1 : ((b.projectSituationNameEn.toLowerCase() > a.projectSituationNameEn.toLowerCase()) ? -1 : 0));
      // }
      // else{
      //   this.projectSituationList = this.projectSituationList.sort((a, b) => (a.projectSituationNamePt.toLowerCase() > b.projectSituationNamePt.toLowerCase()) ? 1 : ((b.projectSituationNamePt.toLowerCase() > a.projectSituationNamePt.toLowerCase()) ? -1 : 0));
      // }
      for (let i = 0; i < this.projectSituationList.length; i++) {
        let crtDt = this.projectSituationList[i].createdOn;
        let updateDt = this.projectSituationList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.projectSituationList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.projectSituationList[i].updateDifference = days_differenceForUpdate;
        }
        (this.projectSituationList[i].difference) = days_difference;
      }
    });
  }

  private getResponsibleOrganizationDetails(list: OrganizationCrudServiceClass[]) {
      list.forEach(data => {
        if (data.category.categoryNameEn == 'Funding Organization') {
          this.responsibleOrganizationList.push(data);
        }
      });
      this.responsibleOrganizationFilteredOption = this.searchResponsibleOrganization.valueChanges
        .pipe(
          startWith(''),
          map(responsibleOrganization =>
            responsibleOrganization ? this.filterResponsibleOrganization(responsibleOrganization) : this.responsibleOrganizationList.slice())
      );
      // if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
      //   this.organizationService.getFundingOrgDetailsByUserAccessId(this.userId).subscribe(data => {
      //     this.responsibleOrganizationList = data;
      //     this.responsibleOrganizationFilteredOption = this.searchResponsibleOrganization.valueChanges
      //     .pipe(
      //       startWith(''),
      //       map(responsibleOrganization =>
      //         responsibleOrganization ? this.filterResponsibleOrganization(responsibleOrganization) : this.responsibleOrganizationList.slice())
      //       );
      //   });
      // }
      // else {
      //   this.organizationService.getFundingOrganizationDetails().subscribe(data => {
      //     this.responsibleOrganizationList = data;
      //     this.responsibleOrganizationFilteredOption = this.searchResponsibleOrganization.valueChanges
      //     .pipe(
      //       startWith(''),
      //       map(responsibleOrganization =>
      //         responsibleOrganization ? this.filterResponsibleOrganization(responsibleOrganization) : this.responsibleOrganizationList.slice())
      //       );
      //   });
      // }
  }

  private filterResponsibleOrganization(name: string) {
    return this.responsibleOrganizationList.filter(responsibleOrganization =>
      responsibleOrganization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(name.toLowerCase()) !== -1 || responsibleOrganization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  EditProject: any;
  ViewMoreProject: any;
  browserLang: any;

  /**
    * Used to filter data based on search input
    */
  private _filterdImplOrg(name: string): OrganizationCrudServiceClass[] {
    const filterValue = name;
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.projectForm.controls.implementingOrganization.patchValue(this.selectedValues);
    let filteredList = this.implementingOrganizationList.filter(option =>
      option.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 || option.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
    return filteredList;
  }
  private _filterdProvinces(name: string): Provinces[] {
    const filterValueProvinces = name;
    // Set selected values to retain the selected checkbox state
    this.setSelectedValuesProvinces();
    this.projectForm.controls.provinces.patchValue(this.selectedValuesProvinces);
    let filteredListProvinces = this.provinceList1.filter(option => option.provinces_name.toLowerCase().indexOf(filterValueProvinces.toLowerCase()) !== -1);
    // return filteredListProvinces.sort((a, b) => (a.provinces_name > b.provinces_name) ? 1 : ((b.provinces_name > a.provinces_name) ? -1 : 0));
    return filteredListProvinces;
  }
  private _filterdListOfAsso(name: string): FinancialAgreement[] {

    const filterValue = name;
    // Set selected values to retain the selected checkbox state
    this.setSelectedValuesListOfAsso();
    this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(this.selectedValuesListOfAsso);
    let filteredList = this.listOfAssociatedFunding.filter(option =>
      option.donor_funding_title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      option.fundingOrganization.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
      option.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
        toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
    return filteredList;
  }
  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
      this.selectedImplementingOrgName.splice(index, 1);
    }
  }
  selectionChangeProvinces(event) {
    let projectType = this.projectForm.controls['provinces'].value;
    // for (let i = 0; i < projectType.length; i++) {
    //   if (projectType[i] === 0)
    //     this.select_options_for_district_hdn_flag = true;
    // }
    if (event.isUserInput && event.source.selected == false) {
      // debugger
      let index = this.selectedValuesProvinces.indexOf(event.source.value);

      this.selectedValuesProvinces.splice(index, 1);
      this.selectedprovincename.splice(index, 1);

    }
  }
  selectionChangeListOfAsso(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValuesListOfAsso.indexOf(event.source.value);
      this.selectedValuesListOfAsso.splice(index, 1);
      this.associatedFundingName.splice(index, 1);
    }
  }
  // province_method_flag = false;
  // provinceFlag() {
  //   if (this.province_method_flag == false) {
  //     this.province_method_flag = true;
  //     this.select_options_for_prv_opt_flag = false;

  //   }
  //   else {
  //     this.select_options_for_prv_opt_flag = true;
  //     this.province_method_flag = false;
  //   }
  // }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  openedChangeProvinces(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControlProvinces.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBoxProvinces.nativeElement.focus();
    }
  }
  openedChangeListOfAsso(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControlListOfAsso.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBoxListOfAsso.nativeElement.focus();
    }
  }
  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }
  clearSearchProvinces(event) {
    event.stopPropagation();
    this.searchTextboxControlProvinces.patchValue('');
  }
  clearSearchListOfAsso(event) {
    event.stopPropagation();
    this.searchTextboxControlListOfAsso.patchValue('');
  }
  /**
   * Set selected values to retain the state
   */
  selectedImplementingOrgName: string[] = [];
  setSelectedValues() {
    if (this.implementingOrganizationList.length > 0) {
      if (this.projectForm.controls.implementingOrganization.value && this.projectForm.controls.implementingOrganization.value.length > 0) {
        this.projectForm.controls.implementingOrganization.value.forEach((e) => {
          if (this.selectedValues.indexOf(e) == -1) {
            this.selectedValues.push(e);
            this.selectedImplementingOrgName.push(
              this.implementingOrganizationList.find((x) => x.id === e).names
            );
          }
        });
      }
    }
  }
  setSelectedValuesProvinces() {
    if (this.projectForm.controls.provinces.value && this.projectForm.controls.provinces.value.length > 0) {
      this.projectForm.controls.provinces.value.forEach((e) => {
        if (this.selectedValuesProvinces.indexOf(e) == -1) {
          this.selectedValuesProvinces.push(e);
          this.selectedprovincename.push(this.provinceList1.find(x => x.provinces_id === e).provinces_name);
        }
      });
    }
  }

  setSelectedValuesListOfAsso() {
    if (this.projectForm.controls.SelectListOfAssociatedFunding.value && this.projectForm.controls.SelectListOfAssociatedFunding.value.length > 0) {
      this.projectForm.controls.SelectListOfAssociatedFunding.value.forEach((e) => {
        if (this.selectedValuesListOfAsso.indexOf(e) == -1) {
          this.selectedValuesListOfAsso.push(e);
          // this.associatedFundingName.push(
          //   this.listOfAssociatedFunding.find((x)=> x.funding_id === e).donor_funding_title
          // );
          for (let i = 0; i < this.listOfAssociatedFunding.length; i++) {
            if (this.listOfAssociatedFunding[i].funding_id == e) {
              this.associatedFundingName.push(this.listOfAssociatedFunding[i].donor_funding_title);
            }
          }
          // alert("associatedFundingName"+JSON.stringify(this.associatedFundingName));
        }
      });
    }

  }

  setSelectedValuesListOfAssoEdit(listOfAss) {

    this.projectForm.controls.SelectListOfAssociatedFunding.patchValue(listOfAss);
   
    //  this.getSelectListOfAssociatedFunding();

    if (this.projectForm.controls.SelectListOfAssociatedFunding.value && this.projectForm.controls.SelectListOfAssociatedFunding.value.length > 0) {
      this.projectForm.controls.SelectListOfAssociatedFunding.value.forEach((e) => {
        if (this.selectedValuesListOfAsso.indexOf(e) == -1) {
          this.selectedValuesListOfAsso.push(e);
          // this.associatedFundingName.push(
          //   this.listOfAssociatedFunding.find((x)=> x.funding_id === e).donor_funding_title
          // );
          this.getSelectListOfAssociatedFunding();
         
          for (let i = 0; i < this.listOfAssociatedFunding.length; i++) {
            if (this.listOfAssociatedFunding[i].funding_id == e) {
              this.associatedFundingName.push(this.listOfAssociatedFunding[i].donor_funding_title);
            }
          }
         
        }
      });
    }


  }

  eSnipHiddenFlag = false;
  openPopUp() {
    let projectTitleForEsnip: string = this.projectForm.controls['projectTitle'].value;
    localStorage.setItem("projectTitleForEsnip", projectTitleForEsnip);
    const dialogRef = this.dialog.open(SnipPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!(result == null || result == undefined || result == '')) {
        this.eSnipHiddenFlag = true;
      }
      this.addEsnipPatch(result);
    });
  }

  public addEsnipPatch(snipRowId: number) {
    console.log("tokenForEsnip-->",this.tokenForEsnip);
    this.projectCrudService.getProjectsFromEsnipById(this.tokenForEsnip, snipRowId).subscribe(data => {
      this.eSnipDataById = data;
      this.projectForm.controls.e_snipId.patchValue(this.eSnipDataById.id);
      this.projectForm.controls.e_snipProjectTitle.patchValue(this.eSnipDataById.name);
      this.projectForm.controls.startDate.patchValue(this.eSnipDataById.start_date);
      this.projectForm.controls.endDate.patchValue(this.eSnipDataById.end_date);
      this.projectForm.controls.projectOverview.patchValue(this.eSnipDataById.current_project_detail.summary);
    });
  }

  donorList: Donor[];
  donorfilteredOption: Observable<any[]>;
  private getDonorDetails() {
    this.donorService.getDonorList().subscribe(data => {
      this.donorList = data;
      this.donorfilteredOption = this.projectForm.controls['donor'].valueChanges
        .pipe(
          startWith(''),
          map(donor => donor ? this.filterDonor(donor) : this.donorList.slice())
        );
    });
  }

  private filterDonor(name: string) {
    return this.donorList.filter(donor =>
      donor.donor_name_en.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  // private _filter21(value: string): Currency[] {
  //   const filterValue = value.toLowerCase();

  //   return this.currOptions.filter(option => option.currency_shortname().toLowerCase().includes(filterValue));
  // }

  private getSelectListOfAssociatedFunding() {
    if (this.usergroup == 'Development Partner Administrator' || this.usergroup == 'DNGDP Team') {
      this.projectCrudService.getFinancialAgreementIdAndNamesByUserAccess(this.userId).toPromise().then(data => {
        console.log('funding id and names: ', data);
        this.listOfAssociatedFunding = data;
        if (this.browserLang == 'en') {
          this.listOfAssociatedFunding = this.listOfAssociatedFunding.sort((a, b) => (a.donor_funding_title.toLowerCase() > b.donor_funding_title.toLowerCase()) ? 1 : ((b.donor_funding_title.toLowerCase() > a.donor_funding_title.toLowerCase()) ? -1 : 0));
        }
        else {
          this.listOfAssociatedFunding = this.listOfAssociatedFunding.sort((a, b) => (a.donor_funding_title.toLowerCase() > b.donor_funding_title.toLowerCase()) ? 1 : ((b.donor_funding_title.toLowerCase() > a.donor_funding_title.toLowerCase()) ? -1 : 0));
        }
        this.filteredOptionListOfAsso = this.searchTextboxControlListOfAsso.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterdListOfAsso(name))
          );
      });
    }
    else {
      this.projectCrudService.getFinancialAgreementIdAndNames().toPromise().then(data => {
       
        this.listOfAssociatedFunding = data;
        if (this.browserLang == 'en') {
          this.listOfAssociatedFunding = this.listOfAssociatedFunding.sort((a, b) => (a.donor_funding_title.toLowerCase() > b.donor_funding_title.toLowerCase()) ? 1 : ((b.donor_funding_title.toLowerCase() > a.donor_funding_title.toLowerCase()) ? -1 : 0));
        }
        else {
          this.listOfAssociatedFunding = this.listOfAssociatedFunding.sort((a, b) => (a.donor_funding_title.toLowerCase() > b.donor_funding_title.toLowerCase()) ? 1 : ((b.donor_funding_title.toLowerCase() > a.donor_funding_title.toLowerCase()) ? -1 : 0));
        }
        this.filteredOptionListOfAsso = this.searchTextboxControlListOfAsso.valueChanges
          .pipe(
            startWith<string>(''),
            map(name => this._filterdListOfAsso(name))
          );
      });
    }
  }

  private getImplementingOrganizationList(list: OrganizationCrudServiceClass[]) {
    list.forEach(data => {
      if (data.category.categoryNameEn != 'Donor') {
        this.implementingOrganizationList.push(data);
      }
    });
    this.filteredImplementingOrg = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filterdImplOrg(name))
      );
    // this.implementingOrganizationService.getImplementingOrganizationList().subscribe(data=> {
    //   this.implementingOrganizationList=data;
    //   this.filteredImplementingOrg = this.searchTextboxControl.valueChanges
    //   .pipe(
    //     startWith<string>(''),
    //     map(name => this._filterdImplOrg(name))
    //   );
    // });
  }

  async getFinancialAgreementList(financialAgreementIds: number[]) {
    const data = await this.projectCrudService.getFinancialAgreementByFundingId(financialAgreementIds).toPromise();
    console.log('FA data:',data);
    
    // await this.projectCrudService.getFinancialAgreementByFundingId(financialAgreementIds).toPromise().then(data=>{
    this.fundingDetails = data;
    console.log('Fund details : ',this.fundingDetails);
    
    this.findTotalAmountCommitment();
    this.getDisbursementDetails(financialAgreementIds);
    this.getPaymentDetails(financialAgreementIds);
    for (let j = 0; j < (this.projectForm.get('tableData') as FormArray).length; j++) {
      (this.projectForm.get('tableData') as FormArray).reset();
      (this.projectForm.get('tableData') as FormArray).removeAt(j);
    }

    //update start_date and end_date of project according to the oldest start_date among all funding and latest end_date of all funding
    let oldestStartDate: Date = null;
    let latestEndDate: Date = null;
    let localStartDate: Date = this.projectForm.controls['startDate'].value;
    let localEndDate: Date = this.projectForm.controls['endDate'].value;

    //update project situation according to funding
    let localSituation: number = null;
    let localSituationOrgVal: number = null;
    let latestSituation: number = null;
    if (this.projectForm.controls.projectSituation.value != '' && this.projectForm.controls.projectSituation.value != null
      && this.projectForm.controls.projectSituation.value != undefined) {
      console.log("this.projectForm.controls.projectSituation.value", this.projectForm.controls.projectSituation.value);
      localSituationOrgVal = this.projectForm.controls.projectSituation.value;
      if (this.projectForm.controls.projectSituation.value == 5) {
        localSituation = 1;
      }
      else if (this.projectForm.controls.projectSituation.value == 7) {
        localSituation = 2;
      }
      else if (this.projectForm.controls.projectSituation.value == 6) {
        localSituation = 3;
      }
      else if (this.projectForm.controls.projectSituation.value == 1) {
        localSituation = 4;
      }
      else if (this.projectForm.controls.projectSituation.value == 2) {
        localSituation = 5;
      }
      else if (this.projectForm.controls.projectSituation.value == 4) {
        localSituation = 6;
      }
      else if (this.projectForm.controls.projectSituation.value == 3) {
        localSituation = 7;
      }
     
    }

    for (let i = 0; i < financialAgreementIds.length; i++) {
      for (let j = 0; j < this.fundingDetails.length; j++) {
        console.log("this.fundingDetails[j].funding_id", this.fundingDetails[j].funding_id);
        console.log("financialAgreementIds[i]", financialAgreementIds[i])
        console.log("this.situationPriorityJson", this.situationPriorityJson);
        console.log("this.fundingDetails[j].financing_situation", this.fundingDetails);
        if (this.fundingDetails[j].funding_id == financialAgreementIds[i]) {

          //Patch financing situation to project if it is greater then project situation
          if (this.fundingDetails[j].financing_situation != null && this.fundingDetails[j].financing_situation != undefined) {
            // console.log("this.situationPriorityJson",this.situationPriorityJson);
            // console.log("this.fundingDetails[j].financing_situation",this.fundingDetails[j].financing_situation)
            if (this.situationPriorityJson[1] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 1;
              }
              if (latestSituation < 1) {
                latestSituation = 1;
              }
            }
            if (this.situationPriorityJson[2] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 2;
              }
              if (latestSituation < 2) {
                latestSituation = 2;
              }
            }
            if (this.situationPriorityJson[3] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 3;
              }
              if (latestSituation < 3) {
                latestSituation = 3;
              }
            }
            if (this.situationPriorityJson[4] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 4;
              }
              if (latestSituation < 4) {
                latestSituation = 4;
              }
            }
            if (this.situationPriorityJson[5] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 5;
              }
              if (latestSituation < 5) {
                latestSituation = 5;
              }
            }
            if (this.situationPriorityJson[6] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 6;
              }
              if (latestSituation < 6) {
                latestSituation = 6;
              }
            }
            if (this.situationPriorityJson[7] == this.fundingDetails[j].financing_situation) {
              if (latestSituation == null) {
                latestSituation = 7;
              }
              if (latestSituation < 7) {
                latestSituation = 7;
              }
            }
            console.log("latestSituation", latestSituation);
          }

          this.totalFundAmt = (+this.totalFundAmt + (+this.fundingDetails[j].amt_usd));
          this.addRowassofund(this.fundingDetails[j].reference_for_financing_donor,
            this.fundingDetails[j].donor_funding_title,
            this.fundingDetails[j].fundingOrganization,
            this.fundingDetails[j].start_date,
            this.fundingDetails[j].end_date,
            (this.currencyPipe.transform(this.fundingDetails[j].amt_usd, " "))
          );
          if (this.fundingDetails[j].start_date != null && this.fundingDetails[j].start_date != undefined) {
            oldestStartDate = new Date(this.fundingDetails[j].start_date);
          }
          if (this.fundingDetails[j].end_date != null && this.fundingDetails[j].end_date != undefined) {
            latestEndDate = new Date(this.fundingDetails[j].end_date);
          }
          if (localStartDate != null && localStartDate != undefined) {
            if (oldestStartDate == null || oldestStartDate == undefined) {
              oldestStartDate = localStartDate;
            }
            else {
              if (new Date(oldestStartDate).getTime() > new Date(localStartDate).getTime()) {
                oldestStartDate = localStartDate;
              }
            }
          }
          if (localEndDate != null && localEndDate != undefined) {
            if (latestEndDate == null || latestEndDate == undefined) {
              latestEndDate = localEndDate;
            }
            else {
              if (new Date(latestEndDate).getTime() < new Date(localEndDate).getTime()) {
                latestEndDate = localEndDate;
              }
            }
          }
        }
      }
    }
    if (oldestStartDate != null && oldestStartDate != undefined) {
      this.projectForm.controls.startDate.patchValue(oldestStartDate);
    }
    if (latestEndDate != null && latestEndDate != undefined) {
      this.projectForm.controls.endDate.patchValue(latestEndDate);
    }
    if (localSituation != null) {
      if (latestSituation > localSituation) {
        this.projectForm.controls.projectSituation.patchValue(this.situationPriorityJson[latestSituation] + '');
      }
      else {
        this.projectForm.controls.projectSituation.patchValue(this.situationPriorityJson[localSituation] + '');
      }
    }
    else {
      this.projectForm.controls.projectSituation.patchValue(this.situationPriorityJson[latestSituation] + '');
    }
    if ((this.projectForm.get('tableData') as FormArray).length != 0) {
      if (((this.projectForm.get('tableData') as FormArray).at(0) as FormGroup).get('fundingRef').value !== null
        || ((this.projectForm.get('tableData') as FormArray).at(0) as FormGroup).get('fundingRef').value !== undefined
        || ((this.projectForm.get('tableData') as FormArray).at(0) as FormGroup).get('fundingRef').value !== '')
        this.validateListFundFlag = false;
    }
    console.log('sourav fund------>', this.fundingDetails);
    // });
    this.projectCrudService.getFinancialAgreementCommitmentsByFundingId(financialAgreementIds).subscribe(data => {
      this.fundingCommitmentDetails = data;
      this.findTotalAmountCommitment();
    });
  }



  getDisbursementDetails(financialAgreementIds: number[]) {
    this.projectCrudService.getDisbursementByFundingId(financialAgreementIds).subscribe(data => {
      this.disbursementDetails = data;
      this.findTotalAmountDisburse();
      console.log('sourav disb---->', this.disbursementDetails);
    });
  }

  getPaymentDetails(financialAgreementIds: number[]) {
    this.projectCrudService.getPaymentByFundingId(financialAgreementIds).subscribe(data => {
      this.paymentDetails = data;
      this.findTotalAmountPayment();
      console.log('sourav payment---->', this.paymentDetails);
    });
  }
  searchDraft= new FormControl('');
  draftfilteredOption: Observable<any[]>;
  getProjectDraftValue() {
    this.projectCrudService.getProjectDraftDataViewList().subscribe(data => {
      this.saveAsDraftDetails = data;
      for(let k=0;k<this.saveAsDraftDetails.length;k++){
        if(this.saveAsDraftDetails[k].projectTitle==null){
          this.saveAsDraftDetails[k].projectTitle=""
        }
      }
      console.log("this.saveAsDraftList ",this.saveAsDraftDetails)
      this.draftfilteredOption = this.searchDraft.valueChanges
          .pipe(
            startWith(''),
            map(data => data ? this.filterDraftData(data) : this.saveAsDraftDetails.slice())
          );
    });
  }
  private filterDraftData(name: string) {
    return this.saveAsDraftDetails.filter(data =>
      data.projectTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  triggerEvent(j: number) {
    ((this.projectForm2.get('tableData') as FormArray).at(j) as FormGroup).get('enter_funds').enable();
  }

  totOdaAmtMzn: number = 0;
  totOdaAmtUsd: number = 0;
  totAmtAlloUsd: number = 0;
  totAmtAlloMzn: number = 0;
  triggerCurr(index: number) {
    this.getValueByLang()
    var x = new BankOfMozambique();
    var retriveData: BankOfMozambique;
    x.year = new Date().getFullYear();
    x.amount = (((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('enter_funds').value).replace(/[^0-9.]+/g, '');
    x.currency_id = ((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('currency1').value;
    this.bankOfMozambiqueService.getOdaAmount(x).subscribe(data => {
      if (data === null) {
        if (this.browserLang == 'en')
          Swal.fire('Currency not found', '', 'error');
        else
          Swal.fire('Moeda não encontrada', '', 'error');
      }
      else {
        retriveData = data;
        ((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('funds_mzn').patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
        ((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('funds_usd').patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
        this.totOdaAmtMzn = 0;
        this.totOdaAmtUsd = 0;
        this.totAmtAlloMzn = 0;
        this.totAmtAlloUsd = 0;
        for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
          this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
          this.totAmtAlloMzn = this.totAmtAlloMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
          this.totAmtAlloUsd = this.totAmtAlloUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
          this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
        }
        if (this.projectForm2.controls['totalAmountMzn'].value != null && this.projectForm2.controls['totalAmountMzn'] != undefined && this.projectForm2.controls['totalAmountMzn'].value != '') {
          this.totAmtAlloMzn;
        }
        this.projectForm2.controls['odaAmountMzn'].patchValue(this.currencyPipe.transform(this.totOdaAmtMzn, " "));
        this.projectForm2.controls['odaAmountUsd'].patchValue(this.currencyPipe.transform(this.totOdaAmtUsd, " "));
        this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totAmtAlloMzn, " "));
        this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totAmtAlloUsd, " "));
        this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totAmtAlloUsd) * 100) + '').toFixed(2));
      }
    });
  }

  triggerFundsOnBlur(index: number) {
    if (((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('currency1').value != null && ((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('currency1').value != '' && ((this.projectForm2.get('tableData') as FormArray).at(index) as FormGroup).get('currency1').value != undefined) {
      this.triggerCurr(index);
    }
  }



  triggerUSDtoMznEvent() {
    var x = new BankOfMozambique();
    var retriveData: BankOfMozambique;
    x.year = new Date().getFullYear();
    x.amount = (+(this.projectForm2.controls['nationalAmountusd'].value).replace(/[^0-9.]+/g, ''));
    for (let i = 0; i < this.currOptions.length; i++) {
      if (this.currOptions[i].currency_shortname == 'USD') {
        x.currency_id = this.currOptions[i].currency_id + '';
      }
    }
    this.bankOfMozambiqueService.getOdaAmountUsd(x).subscribe(data => {
      if (data === null) {
        this.getValueByLang()
        if (this.browserLang == 'en')
          Swal.fire('Currency Not Found', '', 'error');
        else
          Swal.fire('Moeda não encontrada', '', 'error');
      }
      else {
        retriveData = data;
        this.totOdaAmtMzn = 0;
        this.totOdaAmtUsd = 0;
        this.totAmtAlloMzn = 0;
        this.totAmtAlloUsd = 0;
        for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
          this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
          this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
        }
        this.totAmtAlloMzn = this.totOdaAmtMzn + retriveData.fundsMZN;
        this.totAmtAlloUsd = this.totOdaAmtUsd + (+(this.projectForm2.controls['nationalAmountusd'].value).replace(/[^0-9.]+/g, ''));
        this.projectForm2.controls['nationalAmountmzn'].patchValue(this.currencyPipe.transform(retriveData.fundsMZN, " "));
        this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totAmtAlloMzn, " "));
        this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totAmtAlloUsd, " "));
        this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totAmtAlloUsd) * 100) + '').toFixed(2));
      }
    });
  }
  triggerEvent2() {
    this.getValueByLang()
    var x = new BankOfMozambique();
    var retriveData: BankOfMozambique;
    x.year = new Date().getFullYear();
    x.amount = (+(this.projectForm2.controls['nationalAmountmzn'].value).replace(/[^0-9.]+/g, ''));
    for (let i = 0; i < this.currOptions.length; i++) {
      if (this.currOptions[i].currency_shortname == 'USD') {
        x.currency_id = this.currOptions[i].currency_id + '';
      }
    }
    this.bankOfMozambiqueService.getOdaAmountMzn(x).subscribe(data => {
      if (data === null) {
        if (this.browserLang == 'en')
          Swal.fire('Currency not found', '', 'error');
        else
          Swal.fire('Moeda não encontrada', '', 'error');
      }
      else {
        retriveData = data;
        this.totOdaAmtMzn = 0;
        this.totOdaAmtUsd = 0;
        this.totAmtAlloMzn = 0;
        this.totAmtAlloUsd = 0;
        for (let k = 0; k < (this.projectForm2.get('tableData') as FormArray).length; k++) {
          this.totOdaAmtMzn = this.totOdaAmtMzn + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
          this.totOdaAmtUsd = this.totOdaAmtUsd + (+(((this.projectForm2.get('tableData') as FormArray).at(k) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
        }
        this.totAmtAlloMzn = this.totOdaAmtMzn + (+(this.projectForm2.controls['nationalAmountmzn'].value).replace(/[^0-9.]+/g, ''));
        this.totAmtAlloUsd = this.totOdaAmtUsd + retriveData.fundsUSD;
        this.projectForm2.controls['nationalAmountusd'].patchValue(this.currencyPipe.transform(retriveData.fundsUSD, " "));
        this.projectForm2.controls['totalAmountMzn'].patchValue(this.currencyPipe.transform(this.totAmtAlloMzn, " "));
        this.projectForm2.controls['totalAmountUsd'].patchValue(this.currencyPipe.transform(this.totAmtAlloUsd, " "));
        this.projectFormCommitment.controls['commitmentRate'].setValue(parseFloat(((this.totalAmtUSDCmmt / this.totAmtAlloUsd) * 100) + '').toFixed(2));
      }
    });
    console.log('this.projectForm2.getRawValue:',this.projectForm2.getRawValue());
    
  }
  onBlur(value) {
    this.projectForm2.controls['nationalAmountmzn'].setValue(this.currencyPipe.transform(value, " "));

  }

  onBlurUsd(value) {
    this.projectForm2.controls['nationalAmountusd'].setValue(this.currencyPipe.transform(value, " "));

  }

  onBlurFunds(value, j: number) {
    ((this.projectForm2.get('tableData') as FormArray).at(j) as FormGroup).get('enter_funds').setValue(this.currencyPipe.transform(value, " "));
    ((this.projectForm2.get('tableData') as FormArray).at(j) as FormGroup).get('currency1').enable();
  }


  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options1.filter(option => option.toLowerCase().includes(filterValue));
  }

  public createProject = (projectFormValue: any) => {

    if (this.projectForm.valid) {

      this.executeEnvelopeCreation(projectFormValue);

    }

  }

  clearStartDate(event) {
    event.stopPropagation();
    this.projectForm.controls['startDate'].reset();
  }

  clearEndDate(event) {
    event.stopPropagation();
    this.projectForm.controls['endDate'].reset();
  }

  // clearStartDateManager(event,index:number) {
  //   event.stopPropagation();
  //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('startDate').reset();
  // }

  // clearEndDateManager(event,index:number) {
  //   event.stopPropagation();
  //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('endDate').reset();
  // }


  private executeEnvelopeCreation = (projectFormValue: { projectTitle: any; startDate: any; endDate: any; projectSituation: any; purposeDACCRS: any; responsibleOrganization: any; provinces: any; }) => {

    let project: Project = {

      projectTitle: projectFormValue.projectTitle,
      startDate: projectFormValue.startDate,
      endDate: projectFormValue.endDate,
      projectSituation: projectFormValue.projectSituation,
      responsibleOrganization: projectFormValue.responsibleOrganization,
      provinces: projectFormValue.provinces
    }

  }
  public hasError = (controlName: string, errorName: string) => {

    return this.projectForm.controls[controlName].hasError(errorName);

  }

  step = 0;
  true = true;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  moveToSelectedTab() {
    // for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
    //   if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
    //     (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
    //   }
    // }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-project']));
  }
  moveToSelectedTabEdit() {
    let projectId: any = this.projectForm.controls.projectId.value;
    // localStorage.setItem("EditProject", "EditProject");
    // console.log("editProject inside view--->", localStorage.getItem("EditProject"));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-project', projectId]));
    //console.log("after route");
  }

  clearForm1(form: FormGroup) {
    this.markerData = new MarkerTableData();
    this.markerArr = [];
    
    this.select_options_for_development_target_hdn_flag = true;
    this.select_options_for_district_hdn_flag = true

    for (let i = 0; i <= (this.projectForm.get('tableDataManager') as FormArray).length; i++)
      (this.projectForm.get('tableDataManager') as FormArray).removeAt(i);
    (this.projectForm.get('tableDataManager') as FormArray).removeAt(0);

    for (let j = 0; j < (this.projectForm.get('tableComments') as FormArray).length; j++) {
      if (j != 0)
        (this.projectForm.get('tableComments') as FormArray).removeAt(j);
    }
    (this.projectForm.get('tableComments') as FormArray).removeAt(0);

    for (let k = 0; k <= (this.projectForm.get('tableData') as FormArray).length; k++)
      (this.projectForm.get('tableData') as FormArray).removeAt(k);
    (this.projectForm.get('tableData') as FormArray).removeAt(0);

    for (let i = 0; i <= this.projectForm.controls['SelectListOfAssociatedFunding'].value.length; i++) {
      this.selectedValuesListOfAsso.splice(i, 1);
      this.associatedFundingName.splice(i, 1);
    }
    this.selectedValuesListOfAsso.splice(0, 1);
    this.associatedFundingName.splice(0, 1);

    for (let m = 0; m < this.projectForm.controls['implementingOrganization'].value.length; m++)
      this.projectForm.controls['implementingOrganization'].value.splice(m, 1);
    this.projectForm.controls['implementingOrganization'].value.splice(0, 1);




    // this.associatedFundingName.splice(0,1);

    // this.projectCrudBean.implementingOrganization=null;

    //   this.selectRef.forEach(function (el) {
    //     el.options.forEach((data: MatOption) => data.deselect());
    // });
    form.reset();
    this.validateListFundFlag = true;
    this.projectForm.controls.SelectListOfAssociatedFunding.setValue([]);


  }

  clearForm2(form: FormGroup) {
    form.reset();
    for (let index = 0; index < (this.projectForm2.get('tableData') as FormArray).length; index++) {
      if (index != 0)
        (this.projectForm2.get('tableData') as FormArray).removeAt(index);
    }
  }

  clearForm3(form: FormGroup) {
    form.reset();
  }
  clearForm4(form: FormGroup) {
    form.reset();
  }
  clearForm5(form: FormGroup) {
    form.reset();
  }
  clearForm() {
    this.markerData = new MarkerTableData();
    this.markerArr = [];

    for (let i = 0; i <= (this.projectForm.get('tableDataManager') as FormArray).length; i++)
      (this.projectForm.get('tableDataManager') as FormArray).removeAt(i);
    (this.projectForm.get('tableDataManager') as FormArray).removeAt(0);

    for (let j = 0; j < (this.projectForm.get('tableComments') as FormArray).length; j++) {
      if (j != 0)
        (this.projectForm.get('tableComments') as FormArray).removeAt(j);
    }


    for (let k = 0; k <= (this.projectForm.get('tableData') as FormArray).length; k++)
      (this.projectForm.get('tableData') as FormArray).removeAt(k);
    (this.projectForm.get('tableData') as FormArray).removeAt(0);

    for (let index = 0; index < (this.projectForm2.get('tableData') as FormArray).length; index++) {
      if (index != 0)
        (this.projectForm2.get('tableData') as FormArray).removeAt(index);
    }


    for (let i = 0; i <= this.projectForm.controls['SelectListOfAssociatedFunding'].value.length; i++) {
      this.selectedValuesListOfAsso.splice(i, 1);
      this.associatedFundingName.splice(i, 1);
    }
    this.selectedValuesListOfAsso.splice(0, 1);
    this.associatedFundingName.splice(0, 1);

    //   this.selectRef.forEach(function (el) {
    //     el.options.forEach((data: MatOption) => data.deselect());
    // });
    // form.reset();
    this.validateListFundFlag = true;
    this.projectForm.controls.SelectListOfAssociatedFunding.setValue([]);
    this.projectForm.reset();
    this.projectForm2.reset();
    this.locationForm.reset();
    this.projectFormCommitment.reset();
    this.projectFormDisbursements.reset();
    this.projectFormPayments.reset();

  }
  other_reasons_hdn_flag = true;

  addRowassofund(fundingRef, fundingTitle, fundingOrg, startDate, endDate, amountAloFinUsd) {
    const row = this.fb.group({
      'fundingRef': [fundingRef],
      'fundingTitle': [fundingTitle],
      'fundingOrg': [fundingOrg],
      'startDate': [startDate],
      'endDate': [endDate],
      'amountAloFinUsd': [amountAloFinUsd]
    });

    (this.projectForm.get('tableData') as FormArray).push(row);

    for (let j = 0; j < (this.projectForm.get('tableData') as FormArray).length; j++) {
      if (((this.projectForm.get('tableData') as FormArray).at(j) as FormGroup).get('fundingRef').value === null
        || ((this.projectForm.get('tableData') as FormArray).at(j) as FormGroup).get('fundingRef').value === undefined)
        (this.projectForm.get('tableData') as FormArray).removeAt(j);


    }

    (this.projectForm.get('tableData') as FormArray).disable();


  }

  addRow(dac_crs_sect, enter_funds, currency1) {


    const row = this.fb.group({
      'dac_crs_sect': [dac_crs_sect],
      'enter_funds': [enter_funds],
      'currency1': [currency1]
    });

    (this.projectForm2.get('tableData') as FormArray).push(row);

    for (let j = 0; j < (this.projectForm2.get('tableData') as FormArray).length; j++) {
      if (((this.projectForm2.get('tableData') as FormArray).at(j) as FormGroup).get('dac_crs_sect').value === null
        || ((this.projectForm2.get('tableData') as FormArray).at(j) as FormGroup).get('dac_crs_sect').value === undefined)
        (this.projectForm2.get('tableData') as FormArray).removeAt(j);


    }

    (this.projectForm2.get('tableData') as FormArray).disable();

  }


  //validateDacCRSFlag1: any;
  situationPriorityJson = {
    4: 1,
    5: 2,
    7: 3,
    6: 4,
    1: 5,
    3: 6,
    2: 7
  };
chkFinancialAssociatedWithPrj:any=false;
  totalFundAmt: number;
  validateListFundFlag: any = true;
  nameArr: string[] = [];
  chkCmnVal:any=[];
   
  validateDacCRS1(select: MatSelect) {
    this.getValueByLang()
    this.totalFundAmt = 0;
    let fundArr: number[] = select.value;
    this.nameArr= [];
    let projId: number = 0;
    if (this.projectId != null) {
      projId = this.projectId;
    }
    debugger
    this.projectCrudService.checkDuplicateFundingOnproject(fundArr, projId).subscribe(data => {
      let deselectArray=[];
      if (data == null || data == undefined) {
        this.getFinancialAgreementList(fundArr);
        this.getProvinceByFinancialAgreementId(fundArr);
        this.chkFinancialAssociatedWithPrj=false;
      }
      else {
        data.forEach(name => {
          console.log("nm ",name)
          this.nameArr.push(name.donor_funding_title);
          deselectArray.push(name.financialAgreementId)
          
          
        });

        let actual = this.projectForm.controls['SelectListOfAssociatedFunding'].value;
          actual = actual.filter(function(val) {
            return deselectArray.indexOf(val) == -1;
          });
          
          for (let i = 0; i <= this.projectForm.controls['SelectListOfAssociatedFunding'].value.length; i++) {
            this.selectedValuesListOfAsso.splice(i, 1);
            this.associatedFundingName.splice(i, 1);
          }
          this.selectedValuesListOfAsso.splice(0, 1);
          this.associatedFundingName.splice(0, 1);
          this.projectForm.controls['SelectListOfAssociatedFunding'].patchValue(actual)
        if (this.browserLang == 'en'){
          this.chkFinancialAssociatedWithPrj=true;
          Swal.fire("Financial Agreement " + this.nameArr.join(",") + " is already associated with another project");
        
        }else{
          this.chkFinancialAssociatedWithPrj=true;
          Swal.fire("O Acordo de Financiamento " + this.nameArr.join(",") + " já está vinculado com um outro projecto");
      
          }  }
    });
  }

  validateDacCRS() {
    if (this.projectForm2.valid || this.projectForm2.status == "DISABLED") {
      this.location_flag = "true";
      this.commitment_flag = "true";
      this.disbursement_flag = "true";
      this.payment_flag = "true";
    }
    else {
      this.location_flag = "false";
      this.commitment_flag = "false";
      this.disbursement_flag = "false";
      this.payment_flag = "false";
    }
  }

  coutsust(event) {
    
    if (this.projectForm.controls['sustainable_development_target'].value.length >= 11) {
      this.projectForm.controls.sustainable_development_target.value.splice(10, this.projectForm.controls['sustainable_development_target'].value.length - 1);
      
      this.projectForm.controls.sustainable_development_target.patchValue(this.projectForm.controls.sustainable_development_target.value);
      this.opensweetalertSustainableTarget();
    }
  }

  countstatus(event) {
    if (this.projectForm.controls['sustainable_development_goals'].value.length >= 5) {
      this.projectForm.controls.sustainable_development_goals.value.splice(4, this.projectForm.controls['sustainable_development_goals'].value.length - 1);
      this.projectForm.controls.sustainable_development_goals.patchValue(this.projectForm.controls.sustainable_development_goals.value);
      this.opensweetalertSustainableGoals();
    }
  }

  validateOnChange() {
    this.auto_save_as_draft_flag = true;
    if (this.projectForm.controls['sustainable_development_goals'].value != '' && this.projectForm.controls['sustainable_development_goals'].value != null) {
      this.select_options_for_development_target_hdn_flag = false;
    } else {
      this.select_options_for_development_target_hdn_flag = true;
    }

    if (this.projectForm.valid || this.projectForm.status == "DISABLED") {
      this.allocation_flag = "true";
      this.location_flag = "true";
      this.commitment_flag = "true";
      this.disbursement_flag = "true";
      this.payment_flag = "true";
    }
    else {
      this.allocation_flag = "false";
    }

    if (this.projectForm2.valid || this.projectForm2.status == "DISABLED") {
      this.location_flag = "true";
      this.commitment_flag = "true";
      this.disbursement_flag = "true";
      this.payment_flag = "true";
    }
    else {
      this.location_flag = "false";
      this.commitment_flag = "false";
      this.disbursement_flag = "false";
      this.payment_flag = "false";
    }
  }
  validateGeneralInformation() {
   
    if (this.projectForm.valid || this.projectForm.status == "DISABLED") {
      this.allocation_flag = "true";

      this.nextStep();

    }
    else {
      this.allocation_flag = "false";
    }
  }

  validateAllocation() {
    console.log('sourav kumar nayak ' + this.projectForm2.valid + '   ' + this.projectForm2.status);
    if (this.projectForm2.valid || this.projectForm2.status == "DISABLED") {
      console.log('Print2-->', this.projectForm2.valid);
      //  this.allocation_flag = "true";
      this.location_flag = "true";
      this.commitment_flag = "true";
      this.disbursement_flag = "true";
      this.payment_flag = "true";
      this.nextStep();
    }
    else {
      // this.allocation_flag = "false";
      this.location_flag = "false";
      this.commitment_flag = "false";
      this.disbursement_flag = "false";
      this.payment_flag = "false";

    }
  }

  allvalidation() {
    if (this.projectForm.value.projectTitle != "" && (this.projectForm.value.responsibleOrganization != "" && this.projectForm.value.responsibleOrganization != undefined)
      && (this.projectForm.value.startDate != "" && this.projectForm.value.startDate != null) && (this.projectForm.value.endDate != "" && this.projectForm.value.endDate != null)
      && (this.projectForm.value.projectSituation != "" && this.projectForm.value.projectSituation != undefined)) {

      this.opensweetalert();
    }
  }

  viewPayment() {
   
    localStorage.setItem("ViewMorePayment", "ViewMorePayment");

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-payment']));
  }

  //add to projectCrud bean
  projectCrudBean: ProjectCrud;
  addToBean() {
    this.getValueByLang();
    
    this.projectCrudBean = new ProjectCrud();
    if (this.projectId != null) {
      this.projectCrudBean.projectId = this.projectForm.controls['projectId'].value;
    }
    else {
      this.projectCrudBean.projectId = null;
    }
    this.projectCrudBean.language = this.browserLang;
    this.projectCrudBean.saveAsDraftId = this.projectForm.controls['saveAsDraftId'].value;
    if (this.projectForm.controls['projectTitle'].value == '' || this.projectForm.controls['projectTitle'].value == null || this.projectForm.controls['projectTitle'].value == undefined) {
      this.projectCrudBean.projectTitle = null;
    }
    else {
      this.projectCrudBean.projectTitle = this.projectForm.controls['projectTitle'].value;
    }
    if (this.projectForm.controls['e_snipId'].value == '' || this.projectForm.controls['e_snipId'].value == null || this.projectForm.controls['e_snipId'].value == undefined) {
      this.projectCrudBean.eSnipId = null;
    }
    else {
      this.projectCrudBean.eSnipId = this.projectForm.controls['e_snipId'].value;
    }
    if (this.projectForm.controls['e_snipProjectTitle'].value == '' || this.projectForm.controls['e_snipProjectTitle'].value == null || this.projectForm.controls['e_snipProjectTitle'].value == undefined) {
      this.projectCrudBean.eSnipProjectTitle = null;
    }
    else {
      this.projectCrudBean.eSnipProjectTitle = this.projectForm.controls['e_snipProjectTitle'].value;
    }
    if (this.projectForm.controls['projectSituation'].value == '' || this.projectForm.controls['projectSituation'].value == null || this.projectForm.controls['projectSituation'].value == undefined) {
      this.projectCrudBean.projectSituation = null;
    }
    else {
      this.projectCrudBean.projectSituation = this.projectForm.controls['projectSituation'].value;
    }
    if (this.projectForm.controls['projectOverview'].value == '' || this.projectForm.controls['projectOverview'].value == null || this.projectForm.controls['projectOverview'].value == undefined) {
      this.projectCrudBean.projectOverview = null;
    }
    else {
      this.projectCrudBean.projectOverview = this.projectForm.controls['projectOverview'].value;
    }
    if (this.projectForm.controls['startDate'].value == '' || this.projectForm.controls['startDate'].value == null || this.projectForm.controls['startDate'].value == undefined) {
      this.projectCrudBean.startDate = null;
    }
    else {
      this.projectCrudBean.startDate = this.projectForm.controls['startDate'].value;
    }
    if (this.projectForm.controls['endDate'].value == '' || this.projectForm.controls['endDate'].value == null || this.projectForm.controls['endDate'].value == undefined) {
      this.projectCrudBean.endDate = null;
    }
    else {
      this.projectCrudBean.endDate = this.projectForm.controls['endDate'].value;
    }
    if (this.projectForm.controls['responsibleOrganization'].value == '' || this.projectForm.controls['responsibleOrganization'].value == null || this.projectForm.controls['responsibleOrganization'].value == undefined) {
      this.projectCrudBean.responsibleOrganization = null;
    }
    else {
      this.projectCrudBean.responsibleOrganization = this.projectForm.controls['responsibleOrganization'].value;
    }
    if (this.projectForm.controls['implementingOrganization'].value == '' || this.projectForm.controls['implementingOrganization'].value == null || this.projectForm.controls['implementingOrganization'].value == undefined) {
      this.projectCrudBean.implementingOrganization = null;
    }
    else {
      this.projectCrudBean.implementingOrganization = this.projectForm.controls['implementingOrganization'].value;
    }
    if (this.projectForm.controls['regional'].value == '' || this.projectForm.controls['regional'].value == null || this.projectForm.controls['regional'].value == undefined) {
      this.projectCrudBean.regional = null;
    }
    else {
      this.projectCrudBean.regional = this.projectForm.controls['regional'].value;
    }
    if (this.projectForm.controls['projetLink'].value == '' || this.projectForm.controls['projetLink'].value == null || this.projectForm.controls['projetLink'].value == undefined) {
      this.projectCrudBean.projectLink = null;
    }
    else {
      this.projectCrudBean.projectLink = this.projectForm.controls['projetLink'].value;
    }
    if (this.projectForm.controls['sustainable_development_goals'].value == '' || this.projectForm.controls['sustainable_development_goals'].value == null || this.projectForm.controls['sustainable_development_goals'].value == undefined) {
      this.projectCrudBean.sustainableDevelopmentGoals = null;
    }
    else {
      this.projectCrudBean.sustainableDevelopmentGoals = this.projectForm.controls['sustainable_development_goals'].value;
    }
    if (this.projectForm.controls['sustainable_development_target'].value == '' || this.projectForm.controls['sustainable_development_target'].value == null || this.projectForm.controls['sustainable_development_target'].value == undefined) {
      this.projectCrudBean.sustainableDevelopmentTarget = null;
    }
    else {
      this.projectCrudBean.sustainableDevelopmentTarget = this.projectForm.controls['sustainable_development_target'].value;
    }
    if (this.projectForm.controls['confidentialProject'].value == '' || this.projectForm.controls['confidentialProject'].value == null || this.projectForm.controls['confidentialProject'].value == undefined) {
      this.projectCrudBean.confidentialProject = false + '';
    }
    else {
      this.projectCrudBean.confidentialProject = this.projectForm.controls['confidentialProject'].value + '';
    }
    let tableDataManagers: TableIndividualOrganizaton[] = [];
    for (let i = 0; i < ((this.projectForm.get('tableDataManager') as FormArray).length); i++) {
      let manager: TableIndividualOrganizaton = new TableIndividualOrganizaton();
      manager.managers = ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('managers').value;
      manager.orgName = ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('orgName').value;
      manager.post = ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('post').value;
      manager.startDate = ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('startDate').value;
      manager.endDate = ((this.projectForm.get('tableDataManager') as FormArray).at(i) as FormGroup).get('endDate').value;
      tableDataManagers.push(manager);
    }
    this.projectCrudBean.tableDataManager = tableDataManagers;
    this.projectCrudBean.selectListOfAssociatedFunding = this.projectForm.controls['SelectListOfAssociatedFunding'].value;
    let markerTableDatas: MarkerTableData[] = [];
    for (let i = 0; i < ((this.projectForm.get('markerTableData') as FormArray).length); i++) {
      let markers: MarkerTableData = new MarkerTableData();
      markers.markerId = ((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerId').value;
      markers.markerOptions = ((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerOptions').value;
      markerTableDatas.push(markers);
    }
    this.projectCrudBean.markerTableData = markerTableDatas;
    // let commentsArray:TableComments[]=[];
    // for(let i=0;i<((this.projectForm.get('tableComments') as FormArray).length);i++){
    //   let comments:TableComments=new TableComments();
    //   comments.comments=((this.projectForm.get('tableComments') as FormArray).at(i) as FormGroup).get('comments').value;
    //   commentsArray.push(comments);
    // }
    this.projectCrudBean.tableComments = this.commentsData;
    this.projectCrudBean.commentDate = this.date;
    this.projectCrudBean.commentedBy = this.userName;
    let odaArray: OdaAllocation[] = [];
    for (let i = 0; i < ((this.projectForm2.get('tableData') as FormArray).length); i++) {
      let odaAllocation: OdaAllocation = new OdaAllocation();
      odaAllocation.purposeDACCRS = ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').value;
      odaAllocation.currency = ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('currency1').value;
      let fundsRetrived = ((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('enter_funds').value;
      odaAllocation.funds = fundsRetrived.replace(/[^0-9.]+/g, '');
      odaArray.push(odaAllocation);
    }
    this.projectCrudBean.projectOdaAllo = odaArray;
    if (this.projectForm2.controls['odaAmountMzn'].value == '' || this.projectForm2.controls['odaAmountMzn'].value == null || this.projectForm2.controls['odaAmountMzn'].value == undefined) {
      this.projectCrudBean.totOdaAmtAlloMZN = null;
    }
    else {
      this.projectCrudBean.totOdaAmtAlloMZN = this.projectForm2.controls['odaAmountMzn'].value;
    }
    if (this.projectForm2.controls['odaAmountUsd'].value == '' || this.projectForm2.controls['odaAmountUsd'].value == null || this.projectForm2.controls['odaAmountUsd'].value == undefined) {
      this.projectCrudBean.totOdaAmtAlloUSD = null;
    }
    else {
      this.projectCrudBean.totOdaAmtAlloUSD = this.projectForm2.controls['odaAmountUsd'].value;
    }
    if (this.projectForm2.controls['nationalAmountmzn'].value == '' || this.projectForm2.controls['nationalAmountmzn'].value == null || this.projectForm2.controls['nationalAmountmzn'].value == undefined) {
      this.projectCrudBean.amtAlloNatPartMZN = null;
    }
    else {
      this.projectCrudBean.amtAlloNatPartMZN = this.projectForm2.controls['nationalAmountmzn'].value;
    }
    if (this.projectForm2.controls['nationalAmountusd'].value == '' || this.projectForm2.controls['nationalAmountusd'].value == null || this.projectForm2.controls['nationalAmountusd'].value == undefined) {
      this.projectCrudBean.amtAlloNatPartUSD = null;
    }
    else {
      this.projectCrudBean.amtAlloNatPartUSD = this.projectForm2.controls['nationalAmountusd'].value;
    }
   
  }

  mozgisCrudBean: ProjectModel = null;
  finalJsonForCreateFinanceMozig= {PROJECT:{}};
  addToMozgis() {
    this.mozgisCrudBean = new ProjectModel();
    if (this.projectId != null) {
      this.mozgisCrudBean.ID_PROJECT = this.projectForm.controls['projectId'].value;
    }
    else {
      this.mozgisCrudBean.ID_PROJECT = null;
    }
    if (this.projectForm.controls['projectTitle'].value == '' || this.projectForm.controls['projectTitle'].value == null || this.projectForm.controls['projectTitle'].value == undefined) {
      this.mozgisCrudBean.PROJECT_TITLE = '';
    }
    else {
      this.mozgisCrudBean.PROJECT_TITLE = this.projectForm.controls['projectTitle'].value;
    }
    if (this.projectForm.controls['startDate'].value == '' || this.projectForm.controls['startDate'].value == null || this.projectForm.controls['startDate'].value == undefined) {
      this.mozgisCrudBean.START_DATE = null;
    }
    else {
      this.mozgisCrudBean.START_DATE =new Date(this.projectForm.controls['startDate'].value).toISOString();
    }
    if (this.projectForm.controls['projectSituation'].value == '' || this.projectForm.controls['projectSituation'].value == null || this.projectForm.controls['projectSituation'].value == undefined) {
      this.mozgisCrudBean.ID_PROJECT_SITUATION_MASTER = 0;
    }
    else {
      this.mozgisCrudBean.ID_PROJECT_SITUATION_MASTER =Number(this.projectForm.controls['projectSituation'].value);
    }
    if (this.projectForm2.controls['odaAmountMzn'].value == '' || this.projectForm2.controls['odaAmountMzn'].value == null || this.projectForm2.controls['odaAmountMzn'].value == undefined) {
      this.mozgisCrudBean.TOT_ODA_MZN = 0;
    }
    else {
      this.mozgisCrudBean.TOT_ODA_MZN =Number.parseFloat(this.projectForm2.controls['odaAmountMzn'].value.replaceAll(",", ""));
    }
    if (this.projectForm2.controls['odaAmountUsd'].value == '' || this.projectForm2.controls['odaAmountUsd'].value == null || this.projectForm2.controls['odaAmountUsd'].value == undefined) {
      this.mozgisCrudBean.TOT_ODA_USD = 0;
    }
    else {
      this.mozgisCrudBean.TOT_ODA_USD =Number.parseFloat( this.projectForm2.controls['odaAmountUsd'].value.replaceAll(",", ""));
    }
    if (this.projectForm2.controls['nationalAmountmzn'].value == '' || this.projectForm2.controls['nationalAmountmzn'].value == null || this.projectForm2.controls['nationalAmountmzn'].value == undefined) {
      this.mozgisCrudBean.AMT_ALO_NAT_MZN = 0;
    }
    else {
      this.mozgisCrudBean.AMT_ALO_NAT_MZN =Number.parseFloat(this.projectForm2.controls['nationalAmountmzn'].value);
    }
    if (this.projectForm2.controls['nationalAmountusd'].value == '' || this.projectForm2.controls['nationalAmountusd'].value == null || this.projectForm2.controls['nationalAmountusd'].value == undefined) {
      this.mozgisCrudBean.AMT_ALO_NAT_USD = 0;
    }
    else {
      this.mozgisCrudBean.AMT_ALO_NAT_USD =Number.parseFloat(this.projectForm2.controls['nationalAmountusd'].value);
    }
    if (this.projectForm.controls['endDate'].value == '' || this.projectForm.controls['endDate'].value == null || this.projectForm.controls['endDate'].value == undefined) {
      this.mozgisCrudBean.END_DATE = null;
    }
    else {
      this.mozgisCrudBean.END_DATE =new Date(this.projectForm.controls['endDate'].value).toISOString() ;
    }
    if(this.projectForm.value.responsibleOrganization == '' || this.projectForm.value.responsibleOrganization == null || this.projectForm.value.responsibleOrganization == undefined){
      this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION = null;
    }else{
      this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION = new ResponsibleOrganization();
      
      let org_obj:OrganizationCrudServiceClass = new OrganizationCrudServiceClass();
      org_obj =  this.responsibleOrganizationList.find( e => e.id ==  this.projectForm.value.responsibleOrganization);
      console.log('org obj : ',org_obj);
      
      this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION.ID_ORGANIZATION = (org_obj.id==null)?0:org_obj.id;
      this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION.NAME = org_obj.names;
      this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION.ACRONYM = org_obj.acronym;
      // this.mozgisCrudBean.RESPONSIBLE_ORGANIZATION.COUNTRY_PARENT_ORGANIZATION = org_obj.;

    }
    if (this.projectForm.controls['implementingOrganization'].value == '' || this.projectForm.controls['implementingOrganization'].value == null || this.projectForm.controls['implementingOrganization'].value == undefined) {
      this.mozgisCrudBean.PROJECT_IMPLEMENTING_ORG = [];
    }
    else {
      let implOrgArr: number[] = this.projectForm.controls['implementingOrganization'].value;
      implOrgArr.forEach(data => {
        let projectImplOrg: ProjectImplOrg = new ProjectImplOrg();
        let orgObj = this.implementingOrganizationList.find(e => e.id == data);
        console.log('org Obj:',orgObj);
        
        projectImplOrg.ID_ORGANIZATION = data;
        projectImplOrg.ACRONYM = orgObj.acronym;
        projectImplOrg.NAME = orgObj.names;
        projectImplOrg.COUNTRY_PARENT_ORGANIZATION=(orgObj.country==null)?'':orgObj.country;

        this.mozgisCrudBean.PROJECT_IMPLEMENTING_ORG.push(projectImplOrg);
      });
    }

    for (let i = 0; i < ((this.projectForm2.get('tableData') as FormArray).length); i++) {
      let projectOdaAllocation: ProjectOdaAllocation = new ProjectOdaAllocation();
      projectOdaAllocation.ID_SECTOR_DAC_CRS_5DIGIT_MSTR = (((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').value==null)?0:Number(((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('purposeDACCRS').value);
      projectOdaAllocation.AMOUNT_ALO_MZN =  Number(String(((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_mzn').value).replace(/[^0-9.]+/g, ''));
      projectOdaAllocation.AMOUNT_ALO_USD =  Number(String(((this.projectForm2.get('tableData') as FormArray).at(i) as FormGroup).get('funds_usd').value).replace(/[^0-9.]+/g, ''));
      projectOdaAllocation.ID_PROJECT_ODA_ALLOCATION=2
      projectOdaAllocation.AMOUNT_DES_MZN=23
      projectOdaAllocation.AMOUNT_DES_USD=24
      this.mozgisCrudBean.PROJECT_ODA_ALLOCATION.push(projectOdaAllocation);
    }
    ( this.mozgisCrudBean.PROJECT_ODA_ALLOCATION==null)? (this.mozgisCrudBean.PROJECT_ODA_ALLOCATION=[]): this.mozgisCrudBean.PROJECT_ODA_ALLOCATION;
    if (this.projectForm.controls['sustainable_development_goals'].value == '' || this.projectForm.controls['sustainable_development_goals'].value == null || this.projectForm.controls['sustainable_development_goals'].value == undefined) {
      this.mozgisCrudBean.PROJECT_SUSTAINABLE_DEV_GOAL =[];
    }
    else {
      let sustainableDevelopmentGoals: number[] = this.projectForm.controls['sustainable_development_goals'].value;
      sustainableDevelopmentGoals.forEach(data => {
        let projectSustainableDevelopementGoal = new ProjectSustainableDevelopementGoal();
        projectSustainableDevelopementGoal.ID_SUSTAINABLE_DEV_GOAL_MASTER = (data==null)?0:Number(data);
        projectSustainableDevelopementGoal.ID_PROJECT_SDG=null
        if(this.totalFundAmt!=null && this.totalFundAmt!=undefined ){
      
        }
        this.mozgisCrudBean.PROJECT_SUSTAINABLE_DEV_GOAL.push(projectSustainableDevelopementGoal);
      });
    }

    if (this.projectForm.controls['sustainable_development_target'].value == '' || this.projectForm.controls['sustainable_development_target'].value == null || this.projectForm.controls['sustainable_development_target'].value == undefined) {
      this.mozgisCrudBean.PROJECT_SUSTAINABLE_DEV_TARGET = [];
    }
    else {
      let sustainableDevelopmentTargets: number[] = this.projectForm.controls['sustainable_development_target'].value;
      sustainableDevelopmentTargets.forEach(data => {
        let projectSustainableDevelopementTarget = new ProjectSustainableDevelopementTarget();
        projectSustainableDevelopementTarget.ID_SUSTAINABLE_DEV_TARGET_MSTR = (data==null)?0:Number(data);
        projectSustainableDevelopementTarget.ID_PROJECT_SDT=null
        this.mozgisCrudBean.PROJECT_SUSTAINABLE_DEV_TARGET.push(projectSustainableDevelopementTarget);
      });
    }

    for (let i = 0; i < ((this.projectForm.get('markerTableData') as FormArray).length); i++) {
      let projectMarker: ProjectMarker = new ProjectMarker();
      projectMarker.ID_PROJECT_MRK = null
      let markerOptions=((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerOptions').value;
      projectMarker.MARKER_OPTN = (markerOptions==null || markerOptions.trim() == '')?0:((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerOptions').value;
      projectMarker.ID_MARKER=(((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerId').value==null)?0:((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerId').value;
      this.mozgisCrudBean.PROJECT_MARKER.push(projectMarker);
    }

   

    
    let selectListOfAss: number[] = this.projectForm.controls['SelectListOfAssociatedFunding'].value;
    selectListOfAss.forEach(data => {
      let projectFinancialAgreement: ProjectFinancialAgreement = new ProjectFinancialAgreement();
      console.log('selectListOfAss data:',data);
      
      projectFinancialAgreement.ID_FINANCIAL_AGREEMENT = data;

      // let orgDetails = this.fundingDetails.find(e => e.funding_id==data);
      // console.log('orgDetails',orgDetails);
      let finanialAgreementObj = this.fundingDetails.find(e => e.funding_id==data);

      projectFinancialAgreement.FINANCIAL_AGREEMENT = new FinancialAgreementObj(); 
      
      projectFinancialAgreement.ID_PROJECT_FINANCIAL_AGREEMENT=1;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_DONOR_TITLE = (finanialAgreementObj.donor_funding_title==null || finanialAgreementObj.donor_funding_title==undefined)?(''):(finanialAgreementObj.donor_funding_title);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_FINANCING_SITUATION_MASTER =(finanialAgreementObj.financing_situation==null)?0: Number(finanialAgreementObj.financing_situation);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_COOPERATION_MODALITIES =(finanialAgreementObj.cooperationModalitiesId==null)?0: (finanialAgreementObj.cooperationModalitiesId);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.START_DATE =(finanialAgreementObj.start_date!=null) ?new Date(finanialAgreementObj.start_date).toISOString():null;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.END_DATE =(finanialAgreementObj.end_date!=null) ? new Date(finanialAgreementObj.end_date).toISOString() :null;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_STATE_BUDGET_MASTER =(finanialAgreementObj.state_budget==null)?0: Number(finanialAgreementObj.state_budget);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_PILLAR_PQG_MASTER =(finanialAgreementObj.pqg_meo_pillar==null)?0: Number(finanialAgreementObj.pqg_meo_pillar);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_STRATEGIC_OBJCTV_PQG_MASTER =(finanialAgreementObj.pqg_meo_strategic_objective==null)?0: Number(finanialAgreementObj.pqg_meo_strategic_objective);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ALLOCATED_AMOUNT = 6543452;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.AMT_ALLOCATED_IN_FA_MZN = (finanialAgreementObj.amt_mzn==null)?0:Number(finanialAgreementObj.amt_mzn);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.AMT_ALLOCATED_IN_FA_USD = (finanialAgreementObj.amt_usd==null)?0:Number(finanialAgreementObj.amt_usd);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.AMT_ALLOCATED_IN_FA_GE_MZN = 6451843;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.AMT_ALLOCATED_IN_FA_GE_USD=101057.35
      if(finanialAgreementObj.type_of_financing_daccrs!=null)
        projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_TYPE_OF_FINANCE_MASTER = Number(finanialAgreementObj.type_of_financing_daccrs);
      else
      projectFinancialAgreement.FINANCIAL_AGREEMENT.ID_TYPE_OF_FINANCE_MASTER =0;

      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION = new FundingOrganization();
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION.ID_ORGANIZATION = finanialAgreementObj.fundingOrganizationId;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION.NAME =(finanialAgreementObj.fundingOrganization==null)?'': (finanialAgreementObj.fundingOrganization);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION.ACRONYM =(finanialAgreementObj.acronym==null)?'': (finanialAgreementObj.acronym);
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION.COUNTRY_PARENT_ORGANIZATION=(finanialAgreementObj.countryParentOrg!=null)?finanialAgreementObj.countryParentOrg:'';
      
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FINANCIAL_AGREEMENT_PROVINCE = (finanialAgreementObj.financial_AGREEMENT_PROVINCE==null)?[]:finanialAgreementObj.financial_AGREEMENT_PROVINCE;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.FINANCIAL_AGREEMENT_DISTRICT = (finanialAgreementObj.financial_AGREEMENT_DISTRICT==null)?[]:finanialAgreementObj.financial_AGREEMENT_DISTRICT;

      // projectFinancialAgreement.FINANCIAL_AGREEMENT.FUNDING_ORGANIZATION;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.RESPONSIBLE_ORGANIZATION = new ResponsibleOrganization();
      projectFinancialAgreement.FINANCIAL_AGREEMENT.RESPONSIBLE_ORGANIZATION.ID_ORGANIZATION = finanialAgreementObj.responsibleOrganizationId;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.RESPONSIBLE_ORGANIZATION.NAME =(finanialAgreementObj.responsibleOrganization==null)?'': finanialAgreementObj.responsibleOrganization;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.RESPONSIBLE_ORGANIZATION.ACRONYM =(finanialAgreementObj.responsibleOrganizationAcronym==null)?'': finanialAgreementObj.responsibleOrganizationAcronym;
      projectFinancialAgreement.FINANCIAL_AGREEMENT.RESPONSIBLE_ORGANIZATION.COUNTRY_PARENT_ORGANIZATION =(finanialAgreementObj.countryParentOrg!=null)?finanialAgreementObj.countryParentOrg:'' ;
      this.mozgisCrudBean.PROJECT_FINANCIAL_AGREEMENT.push(projectFinancialAgreement);
      
      // var finalJsonForCreateFinanceMozig = {PROJECT:{}};
      this.finalJsonForCreateFinanceMozig.PROJECT = this.mozgisCrudBean;
      console.log("check mozigs data ",JSON.stringify(this.finalJsonForCreateFinanceMozig))
    });
   

  }

  saveProjectDetails(projectCrud: ProjectCrud) {
    this.getValueByLang();
    this.projectForm.controls.language.setValue(this.browserLang)
    projectCrud.createFinanceForMozigs=JSON.stringify(this.finalJsonForCreateFinanceMozig);
    console.log("all daata ",JSON.stringify(projectCrud))
    this.projectCrudService.saveProjectDetails(projectCrud).subscribe(data=>{
      console.log('sourav---->',data);
      this.auto_save_as_draft_flag=false;
      if(this.projectId==null){
        if(this.browserLang=='en'){
          
          Swal.fire('Submitted successfully', '', 'success').then(data=>{
            // this.projectCrudService.saveToMozgis(this.mozgisCrudBean).subscribe(retriveData=>{
              
            // });
          });
        }
        else{
          Swal.fire('Submetido com sucesso', '', 'success').then(data=>{
            // this.projectCrudService.saveToMozgis(this.mozgisCrudBean).subscribe(retriveData=>{
             
            // });
          });
        }
      } else {
        if (this.browserLang == 'en') {
          Swal.fire('Updated successfully', '', 'success');
        } else {
          Swal.fire('Actualizado com sucesso', '', 'success');
        }
      }
      this.shareProjectToESnip();
      this.saveProjectNotificationAlert();
    });
  }

  updateProjectDetails(projectCrud: ProjectCrud) {
    this.getValueByLang()
    this.projectForm.controls.language.setValue(this.browserLang)
    projectCrud.createFinanceForMozigs=JSON.stringify(this.finalJsonForCreateFinanceMozig);
    console.log("all daata ",JSON.stringify(projectCrud))
    this.projectCrudService.updateProjectDetails(projectCrud).subscribe(data => {
      console.log('sourav---->', data);
      this.auto_save_as_draft_flag = false;
      if (this.browserLang == 'en') {
        Swal.fire('Updated successfully', '', 'success');
      } else {
        Swal.fire('Actualizado com sucesso', '', 'success');
      }
      // this.projectCrudService.updateFinancialAgreementToMozgis(this.mozgisCrudBean).subscribe(retriveData=>{
     
      // });
      this.updateProjectNotificationAlert();
    });
  }

  updateSaveAsDraftProjectById(projectCrud: ProjectCrud) {
    this.getValueByLang()
    this.projectCrudService.updateSaveAsDraftProjectById(projectCrud).subscribe(data => {
      this.auto_save_as_draft_flag = false;
      if (this.browserLang == 'en')
        Swal.fire('Project Data in Saved as Draft Successfully Updated', '', 'success');
      else
        Swal.fire('Dados do projecto salvos como rascunho atualizados com sucesso', '', 'success');
    });
  }

  saveAsDraftProjectDetails(projectCrud: ProjectCrud) {
    this.getValueByLang();
    this.projectCrudService.saveAsDraftProjectDetails(projectCrud).subscribe(data => {
      this.auto_save_as_draft_flag = false;
      if (this.browserLang == 'en')
        Swal.fire('Project Data Successfully Saved as Draft', '', 'success');
      else
        Swal.fire('Dados do projecto salvos como rascunho com sucesso', '', 'success');
    });
  }

  private getEsnipToken() {
    this.projectCrudService.getEsnipToken("aims", "Qwerty1@").subscribe(data => {
      let response: any = data;
      this.tokenForEsnip = response.access_token;
      localStorage.setItem("tokenForEsnip", this.tokenForEsnip);
    });
  }

  shareProjectToESnip() {
    let name = this.projectForm.controls['projectTitle'].value;
    let startDate = this.projectForm.controls['startDate'].value;
    let endDate = this.projectForm.controls['endDate'].value;
    let summary = this.projectForm.controls['projectOverview'].value;
    let project_status: string;
    for (let i = 0; i < this.projectSituationList.length; i++) {
      if (this.projectSituationList[i].projectSituationId == this.projectForm.controls['projectSituation'].value) {
        project_status = this.projectSituationList[i].projectSituationNameEn;
      }
    }
    let project = {
      "name": name,
      "start_date": startDate,
      "end_date": endDate,
      "summary": summary,
      "pillar": "Pillar details",
      "strategic_objective": "Strategic objectvies",
      "area_sectoral": "Area Sectorial",
      "project_status": project_status
    };
    this.projectCrudService.shareProjectToESnip(this.tokenForEsnip, project).subscribe(data => {
      console.log('Share project to e-snip---->', data);
    });
  }

  checkDuplicateProjectTitle() {
    this.getValueByLang();
    let projectTitle: string = this.projectForm.controls['projectTitle'].value;
    let responsibleOrganizationId: any = this.projectForm.controls['responsibleOrganization'].value;
    if ((projectTitle != null && projectTitle != '' && projectTitle != undefined) && (responsibleOrganizationId != null && responsibleOrganizationId != undefined && responsibleOrganizationId != '')) {
      this.projectCrudService.checkDuplicateProjectTitle(projectTitle, responsibleOrganizationId).subscribe(data => {
        var val = JSON.parse(JSON.stringify(data));
        if (val.isDuplicateProjectTitle == true) {
          Swal.fire({
            title: (this.browserLang == 'en') ? 'Project Title already exists.' : 'O Título do Projecto já existe.',
            confirmButtonText: `OK`,
          });
          this.projectForm.controls['projectTitle'].reset();
          this.projectForm.controls['responsibleOrganization'].reset();
        }
      });
    }
  }

  // markerArr = [];
  markerArr: MarkerTableData[] = [];
  markerData: MarkerTableData = new MarkerTableData();

  validateMarkerSelection(event,position:number){
   
    if (this.projectId != null) {
      for(let j=0;j<(this.projectForm.get('markerTableData') as FormArray).length;j++){
        
        if(j!=position && ((this.projectForm.get('markerTableData') as FormArray).at(j) as FormGroup).get('markerOptions').value !==null )
        {
          this.markerData.markerId=j;
         this.markerData.markerOptions=((this.projectForm.get('markerTableData') as FormArray).at(j) as FormGroup).get('markerOptions').value;
         this.markerArr.push(this.markerData); 
         this.markerData=new MarkerTableData();
        }
        // if(((this.projectForm.get('markerTableData') as FormArray).at(j) as FormGroup).get('markerOptions')>0)

      }
    }


  if(this.markerArr.length==0){
    
    this.markerData.markerId=position;
    this.markerData.markerOptions=event.value;
    // this.markerArr.push(markerData);
      // this.markerArr.push(event.value);
    }
    else{
    for(let j=0;j<this.markerArr.length;j++){
      console.log("this.markerArr[j].markerOptions",this.markerArr[j].markerOptions);
    console.log("event.value",event.value);
      if(this.markerArr[j].markerOptions == event.value){
        // Swal.fire((this.browserLang=='en')?"There can only be one Principal Objective":"Só pode haver um objetivo principal").then(data=>{
         
          // this.projectForm.get('markerTableData').value.splice(position,1);
          // ((this.projectForm.get('markerTableData') as FormArray).at(position) as FormGroup).get('markerOptions').reset();
          // this.markerArr.splice(position,1);
        
          // // for(let i=0;i<((this.projectForm.get('markerTableData') as FormArray).length);i++){
          // //   if(this.markerArr[j].markerId == ((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerId').value){
          // //     ((this.projectForm.get('markerTableData') as FormArray).at(i) as FormGroup).get('markerOptions').reset();
          // //   }
          // }
        // });
      }
      else{
        // let markerData:MarkerTableData=new MarkerTableData();
        this.markerData.markerId=position;
        this.markerData.markerOptions=event.value;
        console.log("thuismarker arr in else",this.markerArr);
        
      }
    }
    
  }
  if(this.markerData!=null && this.markerData!=undefined){
    this.markerArr.push(this.markerData);
      this.markerData=new MarkerTableData();
  }
}
  opensweetalertSustainableTarget() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'You cannot select more than 10 Targets.' : 'Não pode seleccionar mais de 10 Metas.',

      confirmButtonText: `Ok`,

    })
  }

  opensweetalertSustainableGoals() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'You cannnot select more than 4 Goals.' : 'Não pode seleccionar mais de 4 Objectivos.',

      confirmButtonText: `Ok`,

    })
  }

  openMandatoryAlert() {
    $(".checkValidation").trigger("click");
    this.getValueByLang()
    if (this.browserLang == 'en')
      Swal.fire('Please fill all mandatory fields.')
    else
      Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalert() {
  
    if(this.chkFinancialAssociatedWithPrj==true){
    if (this.browserLang == 'en'){
      Swal.fire("Financial Agreement " + this.nameArr.join(",") + " is already associated with another project");
    
    }else{
      Swal.fire("O Acordo de Financiamento " + this.nameArr.join(",") + " já está vinculado com um outro projecto");
      }}else{
        this.addToBean();
        this.addToMozgis();
        this.getValueByLang();
    Swal.fire({
      title: (this.projectId == null) ? ((this.browserLang == 'en') ? 'Do you want to Submit?' : 'Deseja Submeter?') : ((this.browserLang == 'en') ? 'Do you want to Update?' : 'Deseja Actualizar?'),
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.projectId == null) ? ((this.browserLang == 'en') ? `Submit` : 'Submeter') : ((this.browserLang == 'en') ? `Update` : 'Actualizar'),
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if((this.totAmtAlloUsd>this.totalFundAmt)){
          this.getValueByLang();
          (this.browserLang == 'en') ? Swal.fire('The Project Funding exceeds the Funding of all Associated Financial Agreements', '', 'error') :
            Swal.fire('O Financiamento do Projecto excede o Financiamento de todos os Acordos de Financiamento associados', '', 'error').then(data => {
              if (this.projectCrudBean.projectId != null) {
                this.updateProjectDetails(this.projectCrudBean);
              }
              else {
                this.saveProjectDetails(this.projectCrudBean);
              }
            }
            );
        }
        else {
          if (this.projectCrudBean.projectId != null) {
            this.updateProjectDetails(this.projectCrudBean);
          }
          else {
            this.saveProjectDetails(this.projectCrudBean);
          }
        }
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
      }
  }

  opensweetalert2() {
    this.addToBean();
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Save as Draft?' : 'Quer salvar como rascunho?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Save` : 'Salve',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.projectCrudBean.saveAsDraftId != null) {
          this.updateSaveAsDraftProjectById(this.projectCrudBean);
        }
        else {
          this.saveAsDraftProjectDetails(this.projectCrudBean);
        }
      } else if (result.isDenied) {
        if (this.browserLang == 'en')
          Swal.fire('Cancelled', '', 'info')
        else
          Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  opensweetalert3(e) {
    this.getValueByLang()
    if (this.projectForm.controls['projectSituation'].value == 7) {
      Swal.fire({
        title: (this.browserLang == 'en') ? 'This Project is Completed but has undisbursed funds.!' : 'Este Projecto está Concluído, mas tem fundos não desembolsados.!',
        // showDenyButton: true,
        // showCancelButton: true,
        //confirmButtonText: `Save`,
        // denyButtonText: `Cancel`,
        timer: 3000,
      })
      // .then((result) => {
      // Swal.fire('This Project is complete, funds not yet disbursed.!')

      /* Read more about isConfirmed, isDenied below */
      // if (result.isConfirmed) {


      //   //this.moveToSelectedTab();
      // } else if (result.isDenied) {
      //   Swal.fire('Cancelled', '', 'info')
      // }
      // })
    }
    //logic for startDate and endDate required field
    if (e.value == 3 || e.value == 5 || e.value == 6 || e.value == 7) {
      this.startDateEndDateMandatoryFalg = true;
      this.projectForm.controls['startDate'].setValidators([Validators.required]);
      this.projectForm.controls['endDate'].setValidators([Validators.required]);
    }
    else {
      this.startDateEndDateMandatoryFalg = false;
      this.projectForm.controls['startDate'].clearValidators();
      this.projectForm.controls['endDate'].clearValidators();
    }
    this.projectForm.controls['startDate'].updateValueAndValidity();
    this.projectForm.controls['endDate'].updateValueAndValidity();
  }
  opensweetalert4() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Select at least one record.' : 'Seleccione pelo menos um registo.',
    })
  }

  autoSaveAsDraft() {
    this.addToBean();
    if (this.projectCrudBean.saveAsDraftId != null) {
      this.updateSaveAsDraftProjectById(this.projectCrudBean);
    }
    else {
      this.saveAsDraftProjectDetails(this.projectCrudBean);
    }
  }

  saveProjectNotificationAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Project Reference ID "'
      + this.projectForm.controls['projectTitle'].value
      + '" created on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Project Name "'
      + this.projectForm.controls['projectTitle'].value
      + '" with Reference ID "'
      + this.projectForm.controls['e_snipId'].value
      + '" has been created by user "' + this.userNameForNotification
      + '" in AIMS on "' + ((todayTime + '').substring(0, 24))
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-project\\';

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    notificationDetails.notificationMsg = this.userNameForNotification + " has created project on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.moveToSelectedTab();
    });
  }

  updateProjectNotificationAlert() {
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail: string = 'Project Reference ID "'
      + this.projectForm.controls['projectTitle'].value
      + '" modified on "' + ((todayTime + '').substring(0, 24)) + '"';

    //email body
    let bodyForEmail: string = 'Project Name "'
      + this.projectForm.controls['projectTitle'].value
      + '" with Reference ID "'
      + this.projectForm.controls['e_snipId'].value
      + '" has been edited by user "' + this.userNameForNotification
      + '" in AIMS on "' + ((todayTime + '').substring(0, 24))
      + '" Please click the link to view the details. <br/>'
      + 'Click here : www.aims.mz\\view-project\\' + this.projectId;

    //email signature
    let emailSignature = 'Thanks<br/>-----------------------------------<br/>'
      + 'Aid Information Management System – AIMS<br/>'
      + 'Ministry of Economic and Finance - MEF<br/>'
      + 'Government of Mozambique<br/><br/>'
      + 'Website:www.aims.mz<br/><br/>'
      + 'Note: This is a system-generated email, please don’t reply to it.';

    notificationDetails.notificationGroup = this.userGroupForNotification;
    notificationDetails.updatedBy = this.userNameForNotification;
    notificationDetails.notificationMsg = this.userNameForNotification + " has updated project on " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.moveToSelectedTab();
    });
  }



  //Autocomplete code for Responsible Organization..

  organizationOptions: Donor[];
  organizationOptions1: string[] = ['Austria', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Netherlands', 'Norway',
    'Portugal', 'Sweden', 'Switzerland', 'United Kingdom', 'Finland', 'Iceland', 'Ireland', 'Luxembourg', 'Greece', 'Spain', 'Slovenia', 'Czech Republic',
    'Slovak Republic', 'Hungary', 'Poland', 'Canada', 'United States', 'Japan', 'Korea', 'Australia', 'New Zealand', 'EU Institutions', 'Nordic Development Fund',
    'UNEP', 'Global Environment Facility', 'Montreal Protocol', 'International Bank for Reconstruction and Development', 'Multilateral Investment Guarantee Agency',
    'International Finance Corporation', 'International Development Association', 'Caribbean Development Bank', 'International Monetary Fund', 'Inter - American Development Bank',
    'African Development Bank', 'African Development Fund', 'Asian Development Bank', 'Arab Fund (AFESD)', 'UN Peacebuilding Fund', 'Council of Europe',
    'World Health Organisation', 'Food and Agriculture Organisation', 'International Labour Organisation', 'International Atomic Energy Agency', 'UNECE',
    'OPEC Fund for International Development', 'OAPEC', 'Arab Bank for Economic Development in Africa', 'Special Arab Aid Fund for Africa',
    'IMF Trust Fund', 'IMF (Concessional Trust Fund)', 'UNDP', 'UNTA', 'UNICEF', 'UNRWA', 'WFP', 'UNHCR', 'UNAIDS', 'UNFPA', 'Islamic Development Bank',
    'OSCE', 'Islamic Monetary Fund', 'Arab Fund for Technical Assistance to African and Arab Countries', 'Black Sea Trade & Development Bank', 'GODE',
    'Other Arab Agencies', 'IFAD', 'European Bank for Reconstruction and Development', 'UN AGENCIES', 'Global Partnership for Education',
    'Climate Investment Fund', 'Adaptation Fund', 'Council of Europe Development Bank', 'Private Infrastructure Development Group',
    'Development Bank of Latin America', 'Green Climate Fund', 'Credit Guarantee and Investment Facility', 'Global Energy Efficiency and Renewable Energy Fund', 'IDB Invest',
    'Central Emergency Response Fund', 'World Tourism Organisation', 'Asian Infrastructure Investment Bank', 'Center of Excellence in Finance',
    'International Investment Bank', 'UN Institute for Disarmament Research', 'Global Alliance for Vaccines and Immunization',
    'Global Fund', 'Global Green Growth Institute', 'Cyprus', 'Malta', 'Turkey', 'Croatia', 'Liechtenstein', 'Bulgaria',
    'Romania', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Algeria', 'Libya', 'Mexico', 'Iraq', 'Israel', 'Kuwait', 'Qatar', 'Saudi Arabia',
    'United Arab Emirates', 'Azerbaijan', 'Kazakhstan', 'Chinese Taipei', 'Thailand', 'Timor - Leste',
    'Bill & Melinda Gates Foundation', 'Dutch Postcode Lottery', 'Swedish Postcode Lottery', "People's Postcode Lottery",
    'MetLife Foundation', 'MasterCard Foundation', 'Grameen Crédit Agricole Foundation', 'IKEA Foundation', 'Bernard van Leer Foundation', 'MAVA Foundation',
    'Oak Foundation', 'H&M Foundation', 'Laudes Foundation', 'Charity Projects Ltd (Comic Relief)', "Children's Investment Fund Foundation",
    'Gatsby Charitable Foundation', 'Conrad N. Hilton Foundation', 'David & Lucile Packard Foundation', 'John D. & Catherine T. MacArthur Foundation', 'Carnegie Corporation of New York',
    'Michael & Susan Dell Foundation', 'Omidyar Network Fund, Inc.', 'Rockefeller Foundation', 'William & Flora Hewlett Foundation', 'Arcus Foundation',
    'Gordon and Betty Moore Foundation', 'Ford Foundation', 'Wellcome Trust', 'UBS Optimus Foundation', 'World Diabetes Foundation', 'McKnight Foundation',
    'Citi Foundation', 'LEGO Foundation', 'Norwegian Postcode Lottery', 'BBVA Microfinance Foundation', 'Jacobs Foundation',
    'Arcadia Fund', 'Margaret A. Cargill Foundation', 'La Caixa Banking Foundation'];

  filteredOptions: Observable<string[]>;



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.organizationOptions1.filter(option => option.toLowerCase().includes(filterValue));
  }
  //end code for Responsible Organization..

  //Autocomplete code for Implementing Organization
  // implementingOrganizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco', 'World Health Organization', 'india'];
  implementingOrganizationOptions: string[] = ['MEF', 'Mozambique', 'Austria', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Netherlands', 'Norway',
    'Portugal', 'Sweden', 'Switzerland', 'United Kingdom', 'Finland', 'Iceland', 'Ireland', 'Luxembourg', 'Greece', 'Spain', 'Slovenia', 'Czech Republic',
    'Slovak Republic', 'Hungary', 'Poland', 'Canada', 'United States', 'Japan', 'Korea', 'Australia', 'New Zealand', 'EU Institutions', 'Nordic Development Fund',
    'UNEP', 'Global Environment Facility', 'Montreal Protocol', 'International Bank for Reconstruction and Development', 'Multilateral Investment Guarantee Agency',
    'International Finance Corporation', 'International Development Association', 'Caribbean Development Bank', 'International Monetary Fund', 'Inter - American Development Bank',
    'African Development Bank', 'African Development Fund', 'Asian Development Bank', 'Arab Fund (AFESD)', 'UN Peacebuilding Fund', 'Council of Europe',
    'World Health Organisation', 'Food and Agriculture Organisation', 'International Labour Organisation', 'International Atomic Energy Agency', 'UNECE',
    'OPEC Fund for International Development', 'OAPEC', 'Arab Bank for Economic Development in Africa', 'Special Arab Aid Fund for Africa',
    'IMF Trust Fund', 'IMF (Concessional Trust Fund)', 'UNDP', 'UNTA', 'UNICEF', 'UNRWA', 'WFP', 'UNHCR', 'UNAIDS', 'UNFPA', 'Islamic Development Bank',
    'OSCE', 'Islamic Monetary Fund', 'Arab Fund for Technical Assistance to African and Arab Countries', 'Black Sea Trade & Development Bank', 'GODE',
    'Other Arab Agencies', 'IFAD', 'European Bank for Reconstruction and Development', 'UN AGENCIES', 'Global Partnership for Education',
    'Climate Investment Fund', 'Adaptation Fund', 'Council of Europe Development Bank', 'Private Infrastructure Development Group',
    'Development Bank of Latin America', 'Green Climate Fund', 'Credit Guarantee and Investment Facility', 'Global Energy Efficiency and Renewable Energy Fund', 'IDB Invest',
    'Central Emergency Response Fund', 'World Tourism Organisation', 'Asian Infrastructure Investment Bank', 'Center of Excellence in Finance',
    'International Investment Bank', 'UN Institute for Disarmament Research', 'Global Alliance for Vaccines and Immunization',
    'Global Fund', 'Global Green Growth Institute', 'Cyprus', 'Malta', 'Turkey', 'Croatia', 'Liechtenstein', 'Bulgaria',
    'Romania', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Algeria', 'Libya', 'Mexico', 'Iraq', 'Israel', 'Kuwait', 'Qatar', 'Saudi Arabia',
    'United Arab Emirates', 'Azerbaijan', 'Kazakhstan', 'Chinese Taipei', 'Thailand', 'Timor - Leste',
    'Bill & Melinda Gates Foundation', 'Dutch Postcode Lottery', 'Swedish Postcode Lottery', "People's Postcode Lottery",
    'MetLife Foundation', 'MasterCard Foundation', 'Grameen Crédit Agricole Foundation', 'IKEA Foundation', 'Bernard van Leer Foundation', 'MAVA Foundation',
    'Oak Foundation', 'H&M Foundation', 'Laudes Foundation', 'Charity Projects Ltd (Comic Relief)', "Children's Investment Fund Foundation",
    'Gatsby Charitable Foundation', 'Conrad N. Hilton Foundation', 'David & Lucile Packard Foundation', 'John D. & Catherine T. MacArthur Foundation', 'Carnegie Corporation of New York',
    'Michael & Susan Dell Foundation', 'Omidyar Network Fund, Inc.', 'Rockefeller Foundation', 'William & Flora Hewlett Foundation', 'Arcus Foundation',
    'Gordon and Betty Moore Foundation', 'Ford Foundation', 'Wellcome Trust', 'UBS Optimus Foundation', 'World Diabetes Foundation', 'McKnight Foundation',
    'Citi Foundation', 'LEGO Foundation', 'Norwegian Postcode Lottery', 'BBVA Microfinance Foundation', 'Jacobs Foundation',
    'Arcadia Fund', 'Margaret A. Cargill Foundation', 'La Caixa Banking Foundation'];
  implementingFilteredOptions: Observable<string[]>;



  private impOrganization_filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.implementingOrganizationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
  //end code for Implementing Organization..
  // getPurpose() {
  //   this.browserLang = localStorage.getItem("browserLang");
  //   this.getPurposeDACCRS(this.browserLang);
  // }
  private getPurposeDACCRS() {
    this.purposeDACCRSService.getPurposeCodesFiveDetails().subscribe(data => {
      this.purposeDacCrsList = data;
      // if(this.browserLang=='en'){
      //   this.purposeDacCrsList = this.purposeDacCrsList.sort((a, b) => (a.name_EN.toLowerCase() > b.name_EN.toLowerCase()) ? 1 : ((b.name_EN.toLowerCase() > a.name_EN.toLowerCase()) ? -1 : 0));
      // }
      // else{
      //   this.purposeDacCrsList = this.purposeDacCrsList.sort((a, b) => (a.name_PT.toLowerCase() > b.name_PT.toLowerCase()) ? 1 : ((b.name_PT.toLowerCase() > a.name_PT.toLowerCase()) ? -1 : 0));
      // }
      this.purposeDacCrsList = this.purposeDacCrsList.sort((a, b) => (a.dac5_code > b.dac5_code) ? 1 : ((b.dac5_code > a.dac5_code) ? -1 : 0));
      for (let i = 0; i < this.purposeDacCrsList.length; i++) {
        let crtDt = this.purposeDacCrsList[i].createdOn;
        let updateDt = this.purposeDacCrsList[i].updatedOn;
        this.today = new Date();
        crtDt = new Date(crtDt);
        //calculate time difference
        var time_difference = this.today.getTime() - crtDt.getTime();
        //calculate days difference by dividing total milliseconds in a day
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        this.purposeDacCrsList[i].updateDifference = 15
        if (updateDt != null) {
          updateDt = new Date(updateDt);
          var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
          var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
          this.purposeDacCrsList[i].updateDifference = days_differenceForUpdate;
        }
        (this.purposeDacCrsList[i].difference) = days_difference;
      }
      this.purposeDACCRSfilteredOption = this.purdaccrsSearch.valueChanges
        .pipe(
          startWith(''),
          map(purposeDACCRSDAta => purposeDACCRSDAta ? this.filterpurposeDACCRS(purposeDACCRSDAta) : this.purposeDacCrsList.slice())
        );
    });
  }
  private filterpurposeDACCRS(name: string) {
    if (this.browserLang == 'en') {
      return this.purposeDacCrsList.filter(purposeDACCRSData =>
        purposeDACCRSData.name_EN.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
          toLowerCase().indexOf(name.toLowerCase()) !== -1 || purposeDACCRSData.dac5_code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    } else {
      return this.purposeDacCrsList.filter(purposeDACCRSData =>
        purposeDACCRSData.name_PT.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
          toLowerCase().indexOf(name.toLowerCase()) !== -1 || purposeDACCRSData.dac5_code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }
  }

  private filterpurposeDACCRSPt(name: string) {
    return this.purposeDacCrsList.filter(purposeDACCRSData =>
      purposeDACCRSData.name_PT.toLowerCase().indexOf(name.toLowerCase()) === 0);

  }

  orgIndRel: Map<number, number> = new Map<number, number>();
  enableStakeHolderDropdown(index: number, event: any) {
    this.orgIndRel.set(index, event.value);
    ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('managers').enable();
  }
  fillOtherManagerData(index: number, ev: any) {
    // this.getValueByLang()
    // let orgName = ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('orgName').value;
    // if (orgName == null || orgName == '' || orgName == undefined) {
    //   Swal.fire({
    //     title:(this.browserLang=='en')? 'Please Select Organization.':'Selecione a organização.',
    //     confirmButtonText: `OK`,
    //   });
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('managers').reset();
    // }
    // else {
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('startDate').enable();
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('endDate').enable();
    //   ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('post').enable();
    //   for(let i=0;i<this.individualList.length;i++){
    //     if(this.individualList[i].id==ev.value){
    //       ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('emailId').patchValue(this.individualList[i].email1);
    //       ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('contactNo').patchValue(this.individualList[i].phone1);
    //     }
    //   }
    // }
    ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('startDate').enable();
    ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('endDate').enable();
    ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('post').enable();
    for (let i = 0; i < this.individualList.length; i++) {
      if (this.individualList[i].id == ev.value) {
        ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('emailId').patchValue(this.individualList[i].email1);
        ((this.projectForm.get('tableDataManager') as FormArray).at(index) as FormGroup).get('contactNo').patchValue(this.individualList[i].phone1);
      }
    }
  }
  viewIndividual(j: number) {
    this.getValueByLang()
    var individualId: any = ((this.projectForm.get('tableDataManager') as FormArray).at(j) as FormGroup).get('managers').value;
    if (individualId == null || individualId == undefined || individualId == '') {
      if (this.browserLang == 'en')
        Swal.fire("Please Choose an Stakeholder")
      else
        Swal.fire("Por favor seleccione um participante")
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/admin/view-individual', individualId]));
    }
  }
  getPrjSituationByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }

  publish() {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Publish?' : 'Deseja Publicar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Publish` : 'Publicar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id: number[] = [this.draftedId];
        if (id.length > 0) {
          this.projectCrudService.publishProject(id).subscribe(data => {
            Swal.fire('Published Successfully', '', 'success').then((result) => {
              if (result.isConfirmed)
                this.router.navigate(['/admin/view-drafted-project']);
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
      title: (this.browserLang == 'en') ? 'Do you want to Discard?' : 'Deseja Descartar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang == 'en') ? `Discard` : 'Descartar',
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let id: number[] = [this.draftedId];
        if (id.length > 0) {
          this.projectCrudService.discardProject(id).subscribe(data => {
            (this.browserLang == 'en') ? Swal.fire('Discarded successfully.', '', 'success') :
              Swal.fire('Discarded successfully.', '', 'success').then((result) => {
                if (result.isConfirmed)
                  this.router.navigate(['/admin/view-drafted-project']);
              });
          },
            error => console.log(error));
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/view-drafted-project']);
  }
  enableUploadBtn() {
    let prjRefNm = this.projectForm.controls.projectTitle.value;
    if (prjRefNm != null || prjRefNm != '')
      localStorage.setItem("prjRefNm", prjRefNm);
    else
      localStorage.setItem("prjRefNm", null);
  }

  userAccessObject = JSON.parse(localStorage.getItem("userAccessAllDetails"));
  loggedInUserfullName = this.userAccessObject.firstName + " " + this.userAccessObject.lastName;

  commentsData: TableComments[] = [];
  permissionDeleteComment = [];

  generateCommentsData(index: number) {
    let comment = '';
    if ((this.projectForm.controls.tableComments as FormArray).length > 0) {
      comment = ((this.projectForm.controls.tableComments as FormArray).at(index) as FormControl).get('comments').value;
    }
    let date = String(new Date()).substring(0, 24);
    this.commentsData[index] = {
      comments: comment,
      commentedBy: this.loggedInUserfullName,
      commentedOn: date
    }
   
  }
  generateCommentsDataEdit(index: number) {
    let comment = this.projectDetails.tableComments[index].comments;
    let commentedBy = this.projectDetails.tableComments[index].commentedBy;
    let responseDate: string = this.projectDetails.tableComments[index].commentedOn;
    let date = responseDate;
    this.commentsData[index] = {
      comments: comment,
      commentedBy: commentedBy,
      commentedOn: date
    }
    if (this.loggedInUserfullName == commentedBy)
      this.permissionDeleteComment[index] = true
    else
      this.permissionDeleteComment[index] = false

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
        this.projectForm.get('tableComments') as FormArray
      ).push(row);
      ((
        this.projectForm.controls.tableComments as FormArray
      ).at(i) as FormGroup).controls.comments.patchValue(this.commentsData[i].comments);

    }
  }
}
export class DynamicGrid {
  project: string;
  financing: string;
  donor: string;
  disbursementDate: string;
  disbursementAmount: string;
  meticaisAmountdisbursement: string;
  usdDisbursementAmount: string;
  exchangeRates: number;
}



export class PaymentGrid {
  project: string;
  financing: string;
  paymentDate: string;
  disbursementPaymentAmount: string;
  meticaisPaymentAmount: string;
  usdPaymentAmount: string;
  exchangeRates: number;
}

function _filter(value: any, string: any) {
  throw new Error('Function not implemented.');
}
function value(value: any, string: any) {
  throw new Error('Function not implemented.');
}
