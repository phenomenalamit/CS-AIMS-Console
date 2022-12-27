// Business Logic TS component of Code List Management
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import fieldManagementData from '../../../data/field-management-data.json';
import { TranslateService } from '@ngx-translate/core';
import { objectEach } from 'highcharts';
import { FieldManagementServiceService } from '../../../Service/field-management-service.service';
import { PurposeDACCRSService } from 'src/app/Service/purpose-dac-crs.service';
import { PurposeDACCRS } from 'src/app/Service-Class/purpose-dac-crs';
import { Currency } from 'src/app/Service-Class/currency';
import { CurrencyService } from 'src/app/Service/currency.service';
import { FundingOrganization } from 'src/app/Service-Class/funding-organization';
import { FundingOrganizationService } from 'src/app/Service/funding-organization.service';
import { Donor } from 'src/app/Service-Class/donor';
import { DonorService } from 'src/app/Service/donor.service';
import { ProvincesService } from 'src/app/Service/provinces.service';
import { Provinces } from 'src/app/Service-Class/provinces';
import { DistrictsService } from 'src/app/Service/districts.service';
import { Districts } from 'src/app/Service-Class/districts';
import { FundingServiceClass } from 'src/app/Service-Class/fundingServiceClass-class';
import { FundingServiceService } from 'src/app/Service/fundingService.service';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FinancingClass } from 'src/app/Service-Class/financing-class';
import { CodeManagement } from 'src/app/Service-Class/code-management';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { OrganizationService } from 'src/app/Service/organization.service';
import { Organization } from 'src/app/Service-Class/organization';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { Category } from '../../add-components/add-organization-component/add-organization-component.component';
import { OrganizationServiceService } from 'src/app/Service/organization-service.service';
import { OrganizationServiceClass } from 'src/app/Service-Class/organization-service-class';
import { MonitoringService } from 'src/app/Service/monitoring.service';
import { MonitoringClass } from 'src/app/Service-Class/monitoring-class';
import { ImplementingOrganizationService } from 'src/app/Service/implementing-organization.service';
import { ImplementingOrganization } from 'src/app/Service-Class/implementing-organization';
import { ProjectSituationService } from 'src/app/Service/project-situation.service';
import { ProjectSituation } from 'src/app/Service-Class/project-situation';
import { ResponsibleOrganizationService } from 'src/app/Service/responsible-organization.service';
import { ResponsibleOrganization } from 'src/app/Service-Class/responsible-organization';
import { SustainableDevelopmentGoal } from 'src/app/Service-Class/sustainable-development-goal';
import { SustainableDevelopmentGoalService } from 'src/app/Service/sustainable-development-goal.service';
import { SustainableDevelopmentTarget } from 'src/app/Service-Class/sustainable-development-target';
import { SustainableDevelopmentTargetService } from 'src/app/Service/sustainable-development-target.service';
import { PermissionService } from 'src/app/Service/permission.service';
import { Permission } from 'src/app/Service-Class/permission';
import { Country } from 'src/app/Service-Class/country';
import { MarkerMasterService } from 'src/app/Service/marker-master.service';
import { MarkerMaster } from 'src/app/Service-Class/marker-master';
import { MarkerMasterOptions } from 'src/app/Service/marker-master-options';
import { BudgetSupport } from '../../add-components/add-funding/add-funding.component';


@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.css']
})
export class FieldManagementComponent implements OnInit {
  select_options_for_finding_hdn_flag = true;
  select_options_for_field_hdn_flag = true;
  code: CodeManagement = new CodeManagement();
  public fieldManagementForm!: FormGroup;
  browserLang: any;
  purposeDACCRS: PurposeDACCRS[];
  currenyList: Currency[];
  fundingOrganizationList: OrganizationCrudServiceClass[];
  organizationList: Organization[];
  countryDialingCodeList: CountryDialingCode[] = [];
  countryList:Country[];
  donorList: Donor[];
  district!: Districts[];
  provinceList1!: Provinces[];
  pillarPqgMeoList: FinancingClass[];
  strategicPqgMeo!: FinancingClass[];
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  authorised_flag=false;
  dacCodeShow:any=false;
  headers= ["Input Field Element(En)", "Input Field Element(Pt)","Link Status"];
  meoResourceSourceList: FinancingClass[];
  categoryList:OrganizationServiceClass[];
  levelOfActionList: MonitoringClass[];
  implementingOrganization: ImplementingOrganization[];
  reasonForAddendumList:MonitoringClass[];
  findingList: MonitoringClass[];
  optionFinding: MonitoringClass[];
  constraintList: MonitoringClass[];
  recommendationList: MonitoringClass[];
  projectSituationList!: ProjectSituation[];
  responsibleOrganizationList!: ResponsibleOrganization[];
  sDGList!: SustainableDevelopmentGoal[];
  sDGTargetList!: SustainableDevelopmentTarget[];
  purposeDacCrsList!: PurposeDACCRS[];
  permissionList:Permission[];
  financingSituationList: FinancingClass[];
  cooperationModalitiesList:FinancingClass[];
  comesInList:FinancingClass[];
  typeOfImplementationList:FinancingClass[];
  stateBudgetList:FinancingClass[];
  typeofFinanceList:FinancingClass[];
  pillarPQGList:FinancingClass[];
  markersList:MarkerMaster[]=[];
  markersOptionsList:MarkerMasterOptions[]=[];
budgetSupportList:BudgetSupport[]=[];
  primaryLinkRows = [

  ];
  isReadOnly: any = [];

  fill: any = "fill";
  editing: any = [];
  editProfile() {
    this.isReadOnly = false;
    this.fill = "";
  }
  get dateFormArray(): FormArray {

    return this.fieldManagementForm.get('tableData') as FormArray;

  }
  editRow(j: any) {
    (this.fieldManagementForm.get('tableData') as FormArray).at(j).enable();
    this.isReadOnly[j] = false;
    this.editing[j] = true;

  }
  cancelRow(j: any) {
    (this.fieldManagementForm.get('tableData') as FormArray).at(j).disable();
    this.isReadOnly[j] = true;
    this.editing[j] = false;
    if (this.addNewflag === true) {
      (this.fieldManagementForm.get('tableData') as FormArray).removeAt(j);
      this.addNewflag = false;
    }

  }
  public addItem1(): void {

    const row = this.fb.group({
      Global_Link: [''],

      Link_Status: [''],

    });
  }
  dacCrsLength=0;
  addNew1ForFilter() {

      const row = this.fb.group({
        id: new FormControl(''),
        inputEn: new FormControl('', Validators.required),
        inputPt: new FormControl('', Validators.required),
        linkStatus: new FormControl('', Validators.required),
        dacCode: new FormControl('', Validators.required),

      });
      // (this.fieldManagementForm.get('tableData') as FormArray).push(row);
      // (this.fieldManagementForm.get('tableData') as FormArray).disable();
      (this.fieldManagementForm.get('tableData') as FormArray).insert(0,row);
      for (let j = 0; j < (this.fieldManagementForm.get('tableData') as FormArray).length; j++) {
        this.isReadOnly[j] = true;
        this.editing[j] = false;
      }
    

  }
  /* If we type something for filter then here the data will filter */
applyFilter(filterValue: string) {
  // this.foldertStrDataSource.filter = filterValue.trim().toLowerCase();
  this.addNewflag = false
 
  for(let i=0;i<this.dacCrsLength;i++){
    if (((this.purposeDACCRS[i].name_EN).toString().trim().toLowerCase()).indexOf((filterValue.toString()).trim().toLowerCase()) > -1){
      console.log("this.purposeDACCRS[i].name_EN ",this.purposeDACCRS[i].name_EN)
      this.removeRows();
      this.addNew1ForFilter();
    }
  }
  
  }
  // public primaryForm!:FormGroup;
  constructor(private fb: FormBuilder,
    public translate: TranslateService,
    private fieldManagementService: FieldManagementServiceService,
    private purposeDACCRSService: PurposeDACCRSService,
    private currencyService: CurrencyService,
    private organizationServiceService: OrganizationServiceService,
    private organizationService: OrganizationService,
    private countryDialingCodeService: CountryDialingCodeService,
    private fundingOrganizationService: FundingOrganizationService,
    private donorService: DonorService,
    private districtsService: DistrictsService,
    private provincesService: ProvincesService,
    private financingService: FinancingServiceService,
    private fundingService: FundingServiceService,
    private monitoringService: MonitoringService,
    private implementingOrganizationService: ImplementingOrganizationService,
    private projectSituationService: ProjectSituationService,
    private responsibleOrganizationService: ResponsibleOrganizationService,
    private sdgService: SustainableDevelopmentGoalService,
    private sdgTargetService: SustainableDevelopmentTargetService,
    private permissionService:PermissionService,
    private organizationCrudService:OrganizationCrudServiceService,
    private markerMasterService:MarkerMasterService,
    ) {

  }
  num: any;
  tabClick(index: number) {
    this.num = index;
  }

  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    //for translation
    this.browserLang = localStorage.getItem("browserLang");
    this.setToUserPermission();
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    //for form control
    this.fieldManagementForm = new FormGroup({
      Fields_FormControl: new FormControl('', [Validators.required]),
      Module_formControl: new FormControl('', [Validators.required]),
      tableData: this.fb.array([
      ]),

    });



  }
  addNewflag: any = false;

  addNew() {
    if (this.addNewflag === false) {
      const row = this.fb.group({
        id: new FormControl(''),
        inputEn: new FormControl('', Validators.required),
        inputPt: new FormControl('', Validators.required),
        linkStatus: new FormControl('', Validators.required),
        dacCode: new FormControl('', Validators.required),

      });

      this.isReadOnly[0] = false;
      this.editing[0] = true;
      (this.fieldManagementForm.get('tableData') as FormArray).insert(0, row);
      (this.fieldManagementForm.get('tableData') as FormArray).at(0).enable();
    }


    this.addNewflag = true;
    // this.primaryLinkRows.push({
    //   "Input Field": "",
    //   "Input Field Element(En)":"",
    //   "Input Field Element(Pt)":"",
    //   "Link Status":""

    //   // "Fields":fieldManagementData.primaryLink[i].Fields
    // });
  }

  addNew1() {

    if (this.addNewflag === false) {
      const row = this.fb.group({
        id: new FormControl(''),
        inputEn: new FormControl('', Validators.required),
        inputPt: new FormControl('', Validators.required),
        linkStatus: new FormControl('', Validators.required),
        dacCode: new FormControl('', Validators.required),

      });
      (this.fieldManagementForm.get('tableData') as FormArray).push(row);
      (this.fieldManagementForm.get('tableData') as FormArray).disable();
      for (let j = 0; j < (this.fieldManagementForm.get('tableData') as FormArray).length; j++) {
        this.isReadOnly[j] = true;
        this.editing[j] = false;
      }
    }

  }
  changedaccrsCode(j){
    let dac_code=((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("dacCode").value;
    ((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup)
    .get('dacCode')
    .patchValue(dac_code);
  }
  saveRow(j) {
    // this.addNewflag=false;
    var obj = [];
    let inputEn = ((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("inputEn").value;
    let inputPt = ((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("inputPt").value;
    let dacCode=((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("dacCode").value;
    let linkStatus = ((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("linkStatus").value;
    let finding = this.fieldManagementForm.controls['Module_formControl'].value;
    let findingModule = this.fieldManagementForm.controls['Fields_FormControl'].value;
    obj.push(linkStatus);
    obj.push(inputEn);
    obj.push(inputPt);
    obj.push(finding);
    obj.push(findingModule);
    obj.push(dacCode)

    this.code.id = ((this.fieldManagementForm.get('tableData') as FormArray).at(j) as FormGroup).get("id").value;
    this.code.module = finding;
    this.code.moduleFeild = findingModule;
    this.code.inputEn = inputEn;
    this.code.inputPt = inputPt;
    this.code.status = linkStatus;
    this.code.dacCode=dacCode


    this.fieldManagementService.saveNewElement(this.code).subscribe(data => {
      console.log("save new element:-->>", this.fieldManagementService.saveNewElement(this.code));
      this.select_options_for_field_hdn_flag = false;
      this.isReadOnly[j] = true;
      this.cancelRow(j);
      this.FieldChangeAction();
    });
  }

  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Code List Management')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }
  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Code List Management'){
        this.authorised_flag=true;
      }
    }
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    console.log("getValueByLang-->",this.browserLang);
  }
  //blank array to push
  findingOptionList = [];
  findingOptionListPt = [];
  //module name and field name will show from this array
  findingOptionPt: any = [
    {
      'findingsName': 'Envelope',
      findingOptions: [
        'Objectivo DAC-CRS', 'Moeda',
        // 'Funding Organization',
      ],
      
    },

    {
      'findingsName': 'Acordo de Financiamento',
      findingOptions: [
        // 'Donor', 'Funding Organization','IATI Location','MEO Resource Source','Comes In Like','Trasury Single Account','Moeda','Organização Responsável', 'Tipo de Implementação',
        'Situação do Financiamento','Modalidades de Cooperação',
        'Orçamento do Estado','Apoio Orçamental',
        'Tipo de Financiamento',
        'Prioridade / Pilar PQG', 'Objetivo Estratégico PQG',
        'Província', 'Distrito'
      ]
    },

    {
      'findingsName': 'Projecto',
      findingOptions: [
        'Situação do Projecto', 
         'Objetivo de Desenvolvimento Sustentável', 'Meta de Desenvolvimento Sustentável','Marcadores de Política','Pontuação de Política',
        'Sector CAD-CRS 5 dígitos','Moeda',
        // 'Province','District', 'Organização Responsável','Organização Implementadora',
        // 'Organization', 
        // 'DAC-CRS Sector', 'Currency', 'IATI Location', 'Province', 'District','Regional/National Implementation',
      ]
    },
    {
      'findingsName': 'Desembolso',
      findingOptions: [
        // 'Project Title', 'Funding Title', 'Funding Organization',
        'Moeda'
      ]
    },
    {
      'findingsName': 'Pagamento',
      findingOptions: [
        // 'Financial Agreement', 'Project', 
        'Moeda'

      ]
    },
    {
      'findingsName': 'Organização',
      findingOptions: [
        'Categoria', 'País'
        // 'Funding Organization', 'Country / Parent Organization','City', 
      ]
    },
    {
      'findingsName': 'Indivíduo',
      findingOptions: [
        // 'Organization',
        'País'
      ]
    },
    {
      'findingsName': 'Monitoramento',
      findingOptions: [
        // 'Project Name',
        'Nivel de actuação',
         'Província','Distrito','Organização Implementadora','Razões da Adenda ao Contrato',
        'Constatações', 'Selecione uma opção','Constrangimentos', 'Recomendações'

      ]
    },
    {
      'findingsName': 'Conta de Usuário',
      findingOptions: [
        // 'User Type', 'User Group',  'Operations', 'Features'
        'Permissões'
      ]
    }

  ];
  findingsList: any = [
    {
      'findingsName': 'Envelope',
      findingOptions: [
        'Purpose DAC-CRS', 'Currency',
        // 'Funding Organization',
      ]
    },

    {
      'findingsName': 'Financial Agreement',
      findingOptions: [
        // 'Donor', 'Funding Organization','IATI Location','MEO Resource Source','Comes In Like','Trasury Single Account','Currency','Responsible Organization', 'Type of Implementation',
        'Financing Situation','Cooperation Modalities',
        'State Budget','Budget Support',
        'Type of Finance',
        'Priority/Pillar PQG', 'Strategic Objective PQG',
        'Province', 'District'
      ]
    },

    {
      'findingsName': 'Project',
      findingOptions: [
        'Project Situation', 
        'Sustainable Development Goal', 'Sustainable Development Target','Marker Master','Marker Master Options',
        'Purpose DAC-CRS-Five-Digit','Currency',
        // 'Province','District', 'Responsible Organization','Implementing Organization', 
        // 'Organization', 
        // 'DAC-CRS Sector', 'Currency', 'IATI Location', 'Province', 'District','Regional/National Implementation',
      ]
    },
    {
      'findingsName': 'Disbursement',
      findingOptions: [
        // 'Project Title', 'Funding Title', 'Funding Organization',
        'Currency'
      ]
    },
    {
      'findingsName': 'Payment',
      findingOptions: [
        // 'Financial Agreement', 'Project', 
        'Currency'

      ]
    },
    {
      'findingsName': 'Organization',
      findingOptions: [
        'Category', 'Country'
        // 'Funding Organization', 'Country / Parent Organization','City', 
      ]
    },
    {
      'findingsName': 'Individual',
      findingOptions: [
        // 'Organization',
        'Country'
      ]
    },
    {
      'findingsName': 'Monitoring',
      findingOptions: [
        // 'Project Name',
        'Level Of Action',
         'Province','District','Implementing Organization','Reason For Addendum',
        'Findings', 'Select Options for Findings','Constraints', 'Recommendation'

      ]
    },
    {
      'findingsName': 'Primary Link',
      findingOptions: [
        // 'User Type', 'User Group',  'Operations', 'Features'
        'Permissions'
      ]
    }
  ];
  fieldChangeType=0;
  chkfieldChange(){
this.fieldChangeType=0;
  }
  //field name is dependent on module name
  ModuleChangeAction() {
    this.select_options_for_finding_hdn_flag = false;
    if(this.fieldChangeType==0){
      this.select_options_for_field_hdn_flag=true;
      this.fieldManagementForm.controls.Fields_FormControl.reset();
    }
    
    let finding = this.fieldManagementForm.controls['Module_formControl'].value;
    let dropDownData :any
    if(this.browserLang == 'en'){
      dropDownData = this.findingsList.find((data: any) => data.findingsName === finding);
    }else{
     dropDownData = this.findingOptionPt.find((data: any) => data.findingsName === finding);
    }
    if (dropDownData) {
      if(this.browserLang == 'en'){
        this.findingOptionList = dropDownData.findingOptions;
      }else{
        this.findingOptionListPt = dropDownData.findingOptions;
      }
      
    } else {
      this.findingOptionList = [];
    }
  }

  addRow() {
    const row = this.fb.group({
      id: [''],
      inputEn: [''],
      inputPt: [''],
      linkStatus: ['']

    });

    this.dateFormArray.push(row);
  }
  //remove row from datatable

  private removeRows() {
    if ((this.fieldManagementForm.get('tableData') as FormArray).length > 0) {
      this.dateFormArray.clear();
    }
  }
  clearSearch(){
    $("#myInput").val("");
    this.fieldChangeType=1;
  }
  //flag for table is depending on field name
  FieldChangeAction() {
    let findingModule = this.fieldManagementForm.controls['Fields_FormControl'].value;
   
    var searchValue = "";
    try{
      searchValue = ($("#myInput").val()).toString();
      if(searchValue == undefined)
      {
        searchValue="";
      }
    }
    catch(e)
    {
      searchValue="";
    }
    searchValue = searchValue.trim();
    this.removeRows();
    if (findingModule === 'Purpose DAC-CRS' || findingModule === 'Objectivo DAC-CRS' ) {
      this.purposeDACCRSService.getPurposeCodesAllThreeDetails(searchValue).subscribe(data => {
        
        this.purposeDACCRS = data;
        this.dacCrsLength=this.purposeDACCRS.length
        // this.headers.push('DacCrsCode')
        console.log("this.purposeDACCRS ",this.purposeDACCRS)
        this.dacCodeShow=true;
        for (let i = 0; i < this.purposeDACCRS.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.purposeDACCRS.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.purposeDACCRS[i].purpose_codes_Id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.purposeDACCRS[i].name_EN);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.purposeDACCRS[i].name_PT);
            ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('dacCode')
            .patchValue(this.purposeDACCRS[i].dac_code);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.purposeDACCRS[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
         
         
      });
    }
    else{
      this.dacCodeShow=false;
      // if(this.headers.length!=3)
      // this.headers.pop()
    }

    if (findingModule === 'Currency' || findingModule === 'Moeda') {
      this.currencyService.getAllCurrencyDetails(searchValue).subscribe(data => {
       
        this.currenyList = data;
        for (let i = 0; i < this.currenyList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.currenyList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.currenyList[i].currency_id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.currenyList[i].currency_fullname);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.currenyList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Country' || findingModule === 'País') {
      this.organizationCrudService.getAllCountryDetails(searchValue).subscribe(data => {
        this.countryList = data;
        for (let i = 0; i < this.countryList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.countryList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.countryList[i].countryId);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.countryList[i].countryName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue("");
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.countryList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Donor' || findingModule === 'Doadora') {
      this.donorService.getDonorList().subscribe(data => {
        this.donorList = data;
        //this.removeRows();
        for (let i = 0; i < this.donorList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.donorList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.donorList[i].donor_id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.donorList[i].donor_name_en);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.donorList[i].donor_name_pt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.donorList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }

      });
    }

    if (findingModule === 'Province' || findingModule === 'Província') {
      this.provincesService.getAllProvincesList(searchValue).subscribe(data => {
        this.provinceList1 = data;
        //this.removeRows();
        for (let i = 0; i < this.provinceList1.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.provinceList1.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.provinceList1[i].provinces_id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.provinceList1[i].provinces_name);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.provinceList1[i].provinces_name);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.provinceList1[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }

      });
    }

    if (findingModule === 'District' || findingModule === 'Distrito') {
      this.districtsService.getAllDistrictsURL(searchValue).subscribe(data => {
        this.district = data;
        //this.removeRows();
        // console.log("this.district",this.district)
        for (let i = 0; i < this.district.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.district.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.district[i].districts_id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.district[i].districts_name);
          // ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
          //   .get('inputPt')
          //   .patchValue(this.district[i].districts_name);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.district[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }

      });
    }

  

    if (findingModule === 'Strategic Objective PQG' || findingModule === 'Objetivo Estratégico PQG') {
      this.financingService.getStrategicPqgMeoActiveInActive(searchValue).subscribe(data => {
        this.strategicPqgMeo = data;
        //this.removeRows();
        for (let i = 0; i < this.strategicPqgMeo.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.strategicPqgMeo.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.strategicPqgMeo[i].strategicObjPqgMeoId);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.strategicPqgMeo[i].strategicObjPqgMeoName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.strategicPqgMeo[i].strategicObjPqgMeoNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.strategicPqgMeo[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }

      });
    }


    if (findingModule === 'MEO Resource Source' || findingModule === 'Fonte de recursos MEO') {
      this.financingService.getMeoResourceSource().subscribe(data => {
        this.meoResourceSourceList = data;
        //this.removeRows();
        for (let i = 0; i < this.meoResourceSourceList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.meoResourceSourceList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.meoResourceSourceList[i].meoResourceSourceId);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.meoResourceSourceList[i].meoResourceSourceName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.meoResourceSourceList[i].meoResourceSourceName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.meoResourceSourceList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Category' || findingModule === 'Categoria') {
      this.organizationServiceService.getAllCategory(searchValue).subscribe(data => {
        this.categoryList = data;
        //this.removeRows();
        for (let i = 0; i < this.categoryList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.categoryList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.categoryList[i].categoryId);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.categoryList[i].categoryNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.categoryList[i].categoryNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.categoryList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Level Of Action' || findingModule === 'Nivel de actuação') {
      this.monitoringService.getAllLevelOfAction(searchValue).subscribe(data => {
        this.levelOfActionList = data;
        for (let i = 0; i < this.levelOfActionList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.levelOfActionList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.levelOfActionList[i].levelOfActionId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.levelOfActionList[i].levelOfActionNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.levelOfActionList[i].levelOfActionNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.levelOfActionList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Implementing Organization' || findingModule === 'Organização Implementadora') {
      this.implementingOrganizationService.getAllImplementingOrganizationList(searchValue).subscribe(data => {
        this.implementingOrganization = data;
        for (let i = 0; i < this.implementingOrganization.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.implementingOrganization.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.implementingOrganization[i].implementingOrganizationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.implementingOrganization[i].implementingOrganizationName);
          // ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
          //   .get('inputPt')
          //   .patchValue(this.implementingOrganization[i].levelOfActionNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.implementingOrganization[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Reason For Addendum' || findingModule === 'Razões da Adenda ao Contrato') {
      this.monitoringService.getAllReasonForAddendum(searchValue).subscribe(data => {
        this.reasonForAddendumList = data;  
        for (let i = 0; i < this.reasonForAddendumList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.reasonForAddendumList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.reasonForAddendumList[i].reasonForAddendumId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.reasonForAddendumList[i].reasonForAddendumNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.reasonForAddendumList[i].reasonForAddendumNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.reasonForAddendumList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Findings' || findingModule === 'Constatações') {
      this.monitoringService.getAllFindingList(searchValue).subscribe(data => {
        this.findingList = data;
        for (let i = 0; i < this.findingList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.findingList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.findingList[i].finding_Id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.findingList[i].findingNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.findingList[i].findingNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.findingList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Select Options for Findings' || findingModule === 'Selecione uma opção') {
      this.monitoringService.getAllOptionForFinding(searchValue).subscribe(data => {
        this.optionFinding = data;
        for (let i = 0; i < this.optionFinding.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.optionFinding.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.optionFinding[i].optionFindingId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.optionFinding[i].optionFindingNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.optionFinding[i].optionFindingNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.optionFinding[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Constraints' || findingModule === 'Constrangimentos') {
      this.monitoringService.getAllConstraintList(searchValue).subscribe(data => {
        this.constraintList = data;
        for (let i = 0; i < this.constraintList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.constraintList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.constraintList[i].constraintId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.constraintList[i].constraintNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.constraintList[i].constraintNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.constraintList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Recommendation' || findingModule === 'Recomendações') {
      this.monitoringService.getAllRecommendationList(searchValue).subscribe(data => {
        this.recommendationList = data;
        for (let i = 0; i < this.recommendationList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.recommendationList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.recommendationList[i].recommendationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.recommendationList[i].recommendationNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.recommendationList[i].recommendationNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.recommendationList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Project Situation' || findingModule === 'Situação do Projecto') {
      this.projectSituationService.getAllProjectSituationList(searchValue).subscribe(data => {
        this.projectSituationList = data;
        for (let i = 0; i < this.projectSituationList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.projectSituationList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.projectSituationList[i].projectSituationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.projectSituationList[i].projectSituationNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.projectSituationList[i].projectSituationNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.projectSituationList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    // if ((findingModule === 'Project Situation')) {
    //   this.projectSituationService.getAllProjectSituationList().subscribe(data => {
    //     this.projectSituationList = data;
    //     for (let i = 0; i < this.projectSituationList.length; i++) {
    //       this.addNew1();
    //     }
    //     for (let i = 0; i < this.projectSituationList.length; i++) {
    //       ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
    //         .get('id')
    //         .patchValue(this.projectSituationList[i].projectSituationId);

    //       ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
    //         .get('inputEn')
    //         .patchValue(this.projectSituationList[i].projectSituationNameEn);
    //       ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
    //         .get('inputPt')
    //         .patchValue(this.projectSituationList[i].projectSituationNamePt);
    //       ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
    //         .get('linkStatus')
    //         .patchValue(this.projectSituationList[i].status);
    //       (this.fieldManagementForm.get('tableData') as FormArray).disable();
    //     }
    //   });
    // }
     if (findingModule === 'Responsible Organization' || findingModule === 'Organização Responsável') {
      this.responsibleOrganizationService.getAllResponsibleOrganizationList().subscribe(data => {
        this.responsibleOrganizationList = data;
        for (let i = 0; i < this.responsibleOrganizationList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.responsibleOrganizationList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.responsibleOrganizationList[i].responsibleOrganizationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.responsibleOrganizationList[i].responsibleOrganizationName);
          // ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
          //   .get('inputPt')
          //   .patchValue(this.responsibleOrganizationList[i].projectSituationNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.responsibleOrganizationList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Sustainable Development Goal' || findingModule === 'Objetivo de Desenvolvimento Sustentável') {
      this.sdgService.getAllSustainableDevelopmentGoal(searchValue).subscribe(data => {
        this.sDGList = data;
        for (let i = 0; i < this.sDGList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.sDGList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.sDGList[i].sustainableDevelopmentGoalId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.sDGList[i].sustainableDevelopmentGoalName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.sDGList[i].sustainableDevelopmentGoalNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.sDGList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Sustainable Development Target' || findingModule === 'Meta de Desenvolvimento Sustentável') {
      this.sdgTargetService.getAllSustainableDevelopmentTargets(searchValue).subscribe(data => {
        this.sDGTargetList = data;
        for (let i = 0; i < this.sDGTargetList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.sDGTargetList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.sDGTargetList[i].sustainableDelopmentTargetId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.sDGTargetList[i].sustainableDelopmentTargetName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.sDGTargetList[i].sustainableDelopmentTargetNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.sDGTargetList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Purpose DAC-CRS-Five-Digit' || findingModule === 'Sector CAD-CRS 5 dígitos') {
      this.purposeDACCRSService.getAllPurposeCodesFiveDetails(searchValue).subscribe(data => {
        this.purposeDacCrsList = data;
        this.dacCodeShow=true;
        // this.headers.push('DacCrsCode')
        console.log("this.purposeDacCrsList ",this.purposeDacCrsList)
        for (let i = 0; i < this.purposeDacCrsList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.purposeDacCrsList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.purposeDacCrsList[i].purpose_codes_Id);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.purposeDacCrsList[i].name_EN);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.purposeDacCrsList[i].name_PT);
            
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.purposeDacCrsList[i].status);
            ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('dacCode')
            .patchValue(Number.parseInt(this.purposeDacCrsList[i].dac5_code));
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    else{
      this.dacCodeShow=false;
      // if(this.headers.length!=3)
      // this.headers.pop()
    }
    if (findingModule === 'Permissions' || findingModule === 'Permissões') {
      this.permissionService.getAllPermissonDetails(searchValue).subscribe(data => {
        this.permissionList = data;
        for (let i = 0; i < this.permissionList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.permissionList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.permissionList[i].permissionMasterId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.permissionList[i].permissionMasterNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.permissionList[i].permissionMasterNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.permissionList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Financing Situation' || findingModule === 'Situação do Financiamento') {
      this.financingService.getAllFinancingSituationDetails(searchValue).subscribe((data) => {
        this.financingSituationList = data;
        for (let i = 0; i < this.financingSituationList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.financingSituationList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.financingSituationList[i].financingSituationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.financingSituationList[i].financingSituationNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.financingSituationList[i].financingSituationNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.financingSituationList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Cooperation Modalities' || findingModule === 'Modalidades de Cooperação') {
      this.financingService.getAllCooperationModalities(searchValue).subscribe(data => {
        this.cooperationModalitiesList = data;
        for (let i = 0; i < this.cooperationModalitiesList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.cooperationModalitiesList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.cooperationModalitiesList[i].dacCrsId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.cooperationModalitiesList[i].dacCrsNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.cooperationModalitiesList[i].dacCrsNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.cooperationModalitiesList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Comes In Like' || findingModule === 'Vem em like') {
      this.financingService.getAllComesInLike().subscribe(data => {
        this.comesInList = data;
        for (let i = 0; i < this.comesInList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.comesInList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.comesInList[i].dacCrsId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.comesInList[i].dacCrsNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.comesInList[i].dacCrsNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.comesInList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'Type of Implementation' || findingModule === 'Tipo de Implementação') {
      this.financingService.getAllTypeofImplementation().subscribe(data => {
        this.typeOfImplementationList = data;
        for (let i = 0; i < this.typeOfImplementationList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.typeOfImplementationList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.typeOfImplementationList[i].typeOfImplementationId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.typeOfImplementationList[i].typeOfImplementationName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.typeOfImplementationList[i].typeOfFinanceNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.typeOfImplementationList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }

    if (findingModule === 'State Budget' || findingModule === 'Orçamento do Estado') {
      this.financingService.getAllStateBudget(searchValue).subscribe(data => {
        this.stateBudgetList = data;
        for (let i = 0; i < this.stateBudgetList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.stateBudgetList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.stateBudgetList[i].stateBudgetId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.stateBudgetList[i].stateBudget);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.stateBudgetList[i].stateBudgetPt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.stateBudgetList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Type of Finance' || findingModule === 'Tipo de Financiamento') {
      this.financingService.getAllTypeofFinance(searchValue).subscribe(data => {
        this.typeofFinanceList = data;
        for (let i = 0; i < this.typeofFinanceList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.typeofFinanceList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.typeofFinanceList[i].typeOfFinanceId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.typeofFinanceList[i].typeOfFinanceName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.typeofFinanceList[i].typeOfFinanceNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.typeofFinanceList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Priority/Pillar PQG' || findingModule === 'Prioridade / Pilar PQG') {
      this.financingService.getAllPillarPQG(searchValue).subscribe(data => {
        this.pillarPQGList = data;
        for (let i = 0; i < this.pillarPQGList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.pillarPQGList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.pillarPQGList[i].pillarPqgMeoId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.pillarPQGList[i].pillarPqgMeoName);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.pillarPQGList[i].pillarPqgMeoNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.pillarPQGList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Marker Master' || findingModule === 'Marcadores de Política') {
      this.markerMasterService.getAllMarkerMasterDetails(searchValue).subscribe(data=>{
        this.markersList=data;
        for (let i = 0; i < this.markersList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.markersList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.markersList[i].markerId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.markersList[i].markerNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.markersList[i].markerNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.markersList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Marker Master Options' || findingModule === 'Pontuação de Política') {
      this.markerMasterService.getAllMarkerMasterOptionsDetails(searchValue).subscribe(data=>{
        this.markersOptionsList=data;
        for (let i = 0; i < this.markersOptionsList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.markersOptionsList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.markersOptionsList[i].markerTableOptionsId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.markersOptionsList[i].optionNameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.markersOptionsList[i].optionNamePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.markersOptionsList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    if (findingModule === 'Budget Support' || findingModule === 'Apoio Orçamental') {
      this.financingService.getAllBudgetSupport(searchValue).subscribe(data=>{
        this.budgetSupportList=data;
        for (let i = 0; i < this.budgetSupportList.length; i++) {
          this.addNew1();
        }
        for (let i = 0; i < this.budgetSupportList.length; i++) {
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id')
            .patchValue(this.budgetSupportList[i].budgetMasterId);

          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputEn')
            .patchValue(this.budgetSupportList[i].nameEn);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('inputPt')
            .patchValue(this.budgetSupportList[i].namePt);
          ((this.fieldManagementForm.get('tableData') as FormArray).at(i) as FormGroup)
            .get('linkStatus')
            .patchValue(this.budgetSupportList[i].status);
          (this.fieldManagementForm.get('tableData') as FormArray).disable();
        }
      });
    }
    this.select_options_for_field_hdn_flag = false;
  }
  searchval=0;
myFunction(obj){
  this.searchval=1;
  this.FieldChangeAction();
}
chkLength(){
  var searchValue = "";
  searchValue = ($("#myInput").val()).toString();
  if(searchValue.length ==0){
    this.FieldChangeAction();
    this.searchval=1;
  }else{
    this.searchval=0;
  }
}
}
function removeAt(j: number) {
  throw new Error('Function not implemented.');
}

