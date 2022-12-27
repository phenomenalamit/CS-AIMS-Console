import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectService } from 'src/app/Service/project.service';
import { Provinces } from 'src/app/Service-Class/provinces';
import { ProvincesService } from 'src/app/Service/provinces.service';
import { ThisReceiver } from '@angular/compiler';
import { ImplementingOrganization } from 'src/app/Service-Class/implementing-organization';
import { ImplementingOrganizationService } from 'src/app/Service/implementing-organization.service';
import { MonitoringClass } from 'src/app/Service-Class/monitoring-class';
import { MonitoringService } from 'src/app/Service/monitoring.service';


import monitoringData from 'src/app/data/monitoring-data.json';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DialogBoxComponent } from 'src/app/dialog-box/dialog-box.component';
import { Project } from 'src/app/Service-Class/project';
import { SelectionModel } from '@angular/cdk/collections';
import { Districts } from 'src/app/Service-Class/districts';
import { DistrictsService } from 'src/app/Service/districts.service';

import { Output } from '@angular/core';
import { MonitoringCrudServiceClass } from 'src/app/Service-Class/monitoring-crud-service-class';
import { MonitoringCrudService } from 'src/app/Service/monitoring-crud-service';
import { MonitoringPhysicalExeServiceClass } from 'src/app/Service-Class/monitoring-physical-exe-service-class';
import { MonitoringFieldVisitsServiceClass } from 'src/app/Service-Class/monitoring-field-visits-service-class';
import { MonitoringContrctServiceClass } from 'src/app/Service-Class/monitoring-contrct-service-class';
import { MonitoringReasonAddendumClass } from 'src/app/Service-Class/monitoring-reason-addendum-class';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { ProjectCrud } from 'src/app/Service-Class/project-crud';
import { Notification } from 'src/app/Service-Class/notification';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { OrganizationService } from 'src/app/Service/organization.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-add-monitoring-revised',
  templateUrl: './add-monitoring-revised.component.html',
  styleUrls: ['./add-monitoring-revised.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddMonitoringRevisedComponent implements OnInit, OnDestroy {
  usergroup: any;
  @ViewChild('searchFS') searchTextBoxProvinces: ElementRef;
  browserLang: any;
  date = new FormControl(new Date());
  tableDatainancialPerformance: any;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator, { static: false }) set content1(paginator3: MatPaginator) {
    this.dataSource.paginator = paginator3;
  };
  public monitoringForm!: FormGroup;
  public monitoringForm3!: FormGroup;
  flagProjectName: string;
  pickerDisable_flag_start_date: any = false;
  pickerDisable_flag_end_date: any = false;
  pickerDisable_flag_date: any = true;
  startdate!: Date;
  enddate!: Date;
  budgetMzn!: number;
  levelOfAction!: string;
  strategicPriorityPQG!: string;
  strategicObjectivePQG!: string;
  projectName = new FormControl('', [Validators.required]);
  options: string[];
  filteredOptions: Observable<any[]>;
  displayedColumnsDisbursement: string[] = ['edit', 'finagr', 'year', 'associatedFunding', 'donor', 'allocatedBudjet', 'disbursedBudjet', 'budjetexecuted'];
  projectList: ProjectCrud[];
  provinceList1!: Provinces[];
  // implementingOrganization: ImplementingOrganization[];
  implementingOrganization:  OrganizationCrudServiceClass[]=[];
  recommendationList: MonitoringClass[];
  constraintList: MonitoringClass[];
  findingList: MonitoringClass[];
  levelOfActionList: MonitoringClass[];
  reasonForAddendumList:MonitoringClass[];
  optionFinding: MonitoringClass[];
  optionFindingAllData: Observable<MonitoringClass[]>[] = [];
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  auto_save_as_draft_flag=false;
  userNameForNotificationAlert:string='Charlie Adams';
  userGroupForNotificationAlert:string='Dngdp Data Administrator';

  dataSource = new MatTableDataSource<AmountData>(ELEMENT_DATA);
  selection = new SelectionModel<AmountData>(true, []);
  data = Object.assign(ELEMENT_DATA);
  num: any;
  funds: any;

  contractId: any = null;
  monitoringId: any = null;
  monitoringDraftId:any=null;
  monitoring_Id: any = null;
  monitoringPhyExeRAteId:any=[];
  monitoringContractId:any=[];
  tabClick(index: number) {
    this.num = index;
  }
  checked = false;
  indeterminate = false;
  terrainVisit_flag = "false";
  contract_flag = "false";
  mandatory_flag = "false";
  addendum_value_mandatory_flag = false;
  hdn_flag: any;
  hdn_flag1: any;
  select_options_for_finding_hdn_flag = true;
  other_reasons_hdn_flag = true;
  disabled = false;
  addExecutionTableFlag: any = false;
  disable_Falg: any = false;
  addLandVisitTableFlag: any = false;
  index: any;
  editMonitoring: any;
  viewMonitoring: any;
  districts = new FormControl('');
  districtContractor = new FormControl();
  step = 0;
  hidden: any = true;
  disabledpanel = true;
  provinceFilter: Observable<any[]>;
  province = new FormControl('', [Validators.required]);
  searchTextboxControlProvinces = new FormControl();
  implementingOrganizationfilteredOption: Observable<any[]>;
  organization = new FormControl();
  annualbudget: any;
  isDisable: any = false;
  districtSize: any = 0;
  district!: Districts[];
  districtList:Districts[];
  select_options_for_district_hdn_flag = true;
  disabledProvValue = false;
  provName: any;
  financialExecRate: any;
  addendumValueFinal: any;
  contractValueFinal: any;
  indexContract: number = 0;
  saveAsDraftList: MonitoringCrudServiceClass[];
  monitoringData: MonitoringCrudServiceClass = new MonitoringCrudServiceClass();
  monitoringPhyTabDta: MonitoringPhysicalExeServiceClass = new MonitoringPhysicalExeServiceClass();
  monitoringFieldVisitsData: MonitoringFieldVisitsServiceClass = new MonitoringFieldVisitsServiceClass();
  monitoringPhyExeData = new Array();
  monitoringFieldVisitData = new Array();
  monitoringContarctData = new Array();
  monitoringContractTabData: MonitoringContrctServiceClass = new MonitoringContrctServiceClass();
  monitoringReasonsAddendumData = new Array();
  monitoringReasonsAddendumTabData: MonitoringReasonAddendumClass = new MonitoringReasonAddendumClass();
  viewMoreMonitoring: MonitoringCrudServiceClass[];
  editMonitoringData: MonitoringCrudServiceClass[];
  pickerDisable_flag: any = false;
  districtDisable_flag: any = false;
  countContract:number=0;
  headers = ["Date Of Field Visit", "Province", "District", "Financial Execution", "Financial Execution Rate"];
  contractHeader = ["Date Of Field Visit", "Province", "District", "Name of Contracted Company", "Contract Value (MZN)",
    "Implementing Organization", "Did This Contract Have an Addendum ?","Reasons for Addendum",  "Addendum Value (MZN)", "Other Reasons for addendum", "Original Contract end date", "End date after adenda"];

  findingsHeader = ["Date Of Field Visit", "Province", "District", "Findings", "Select Options For Findings", "Other Reasons",
    "Constraints", "Recommendation"
  ];

  checkLength1(e, input) {
    const keyValue = +e.key;
    const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
    let current: string = input.value;
    const position = e.target.selectionStart;
    const next: string = [current.slice(0, position), e.key == 'Decimal' ? '.' : e.key, current.slice(position)].join('');
    if (+newValue > 100) {

      e.preventDefault();
    }

  }



  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
    });
  }
  rows = [
    {
      "Date Of Field Visit": "12/02/2021",
      "Province": "Maputo",
      "Financial Execution": "Y",
      "Financial Execution Rate": "12.9%"

    }
  ];

  executionHeaders = ["Date Of Field Visit", "Province", "District", "Physical Execution Rate", "Comments"];
  executionRows = [
    {
      "Date Of Field Visit": "10/01/2021",
      "Province": "Maputo",
      "Physical Execution Rate": "12.8%"
    }
  ];
  listofdisbursements = ["Year", "Associated Funding", "Donor", "Allocated Annual Budget", "Annual Disbursed Budget", "Annual Budget Executed", "Disbursement Rate", "Financial Execution Rate"];

  listofdisbursementsRows = [
    {
      "Year": "2011",
      "Associated funding": "Mozambique Bank",
      "Donor": "Mozambique Bank",
      "Allocated annual budget": "45566",
      "Annual disbursed budget": "56488",
      "Annual budget executed": "36488",
      "Disbursement rate": "14.5",
      "Financial execution rate": "12.9%"
    },

    {
      "Year": "2012",
      "Associated funding": "Mozambique Bank",
      "Donor": "Mozabique Bank",
      "Allocated annual budget": "458987",
      "Annual disbursed budget": "76489.19",
      "Annual budget executed": "66488.19",
      "Disbursement rate": "14.5",
      "Financial execution rate": "12.9%"
    }
  ];

  performanceHeaders = ["Year", "Associated funding", "Donor", "Allocated annual budget", "Annual disbursed budget", "Annual budget executed", "Disbursement rate", "Financial execution rate"];

  performanceRows = [
    {
      "Year": "2011",
      "Associated funding": "Mozabique Bank",
      "Donor": "Mozabique Bank",
      "Allocated annual budget": "01/02/2021",
      "Annual disbursed budget": "56488.19",
      "Annual budget executed": "36488.19",
      "Disbursement rate": "14.5",
      "Financial execution rate": "12.9"
    },

    {
      "Year": "2012",
      "Associated funding": "Mozabique Bank",
      "Donor": "Mozabique Bank",
      "Allocated annual budget": "01/03/2021",
      "Annual disbursed budget": "76489.19",
      "Annual budget executed": "66488.19",
      "Disbursement rate": "14.5",
      "Financial execution rate": "12.9"
    }
  ];

  public addExecutionItem(): void {
    this.addExecutionTableFlag = true;
    this.disable_Falg = false;
    const row = this.fb.group({
      dateOfFieldVisitPhysicalExecution: [{ value: '', disabled: true }, [Validators.required]],
      province: [{ value: '', disabled: true }, [Validators.required]],
      districts: [{ value: '', disabled: true }],
      physicalRate: ['', [Validators.required]],
      comments: [''],
      status: ['new']

    });

    (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).push(row);
  }


  public addDisbursements(): void {
    this.listofdisbursementsRows.push({

      "Year": "",
      "Associated funding": "",
      "Donor": "",
      "Allocated annual budget": "",
      "Annual disbursed budget": "",
      "Annual budget executed": "",
      "Disbursement rate": "",
      "Financial execution rate": ""
    })
  }


  public addItem(): void {

    this.addLandVisitTableFlag = true;
    
    const row = this.fb.group({
      dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }, [Validators.required]],
      province: [{ value: '', disabled: true }, [Validators.required]],
      districts: [{ value: '', disabled: true }],
      finExecution: ['', [Validators.required]],
      finExecutionRate: [{ value: '', disabled: true }],
      status: ['new']
    });
    if (this.countContract == 0) {
      this.contractFormArray.removeAt(0);
      this.findingFormArray.removeAt(0);
      (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(0);
      (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(0)
    }
      (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).push(row);
      this.countContract=1
    
    

  }
  public addContract(): void {
    const row = this.fb.group({
      dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }],
      province: [{ value: '', disabled: true }],
      district: [{ value: '', disabled: true }],
      company: ['', Validators.required],
      contractValue: ['', Validators.required],
      organization: [''],
      contractAb: [''],
      abValue: [{ value: '', disabled: true }],
      reasons: [{ value: '', disabled: true }],
      originalContractEndDate: [{ value: '', disabled: true }],
      endDateadenda: [{ value: '', disabled: true }],
      otherReasonsforaddendum: [{ value: '', disabled: true }]


    });

    (this.monitoringForm3.get('tableContract') as FormArray).push(row);

  }

  addFinding() {
    const row = this.fb.group({
      dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }],
      province: [{ value: '', disabled: true }],
      districts: [{ value: '', disabled: true }],
      findings: ['', Validators.required],
      optionFind: [{ value: '', disabled: true }],
      otherReason: [{ value: '', disabled: true }],
      contraints: [{ value: '', disabled: false }],
      recommendation: [{ value: '', disabled: false }],
      reasons: [{ value: '', disabled: true }],
      searchoptionFind: [''],


    });

    (this.monitoringForm3.get('tableFindings') as FormArray).push(row);
  }
  opensweetalertDelete(index: any) {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.data.splice(index, 1)
        this.dataSource = new MatTableDataSource<AmountData>(this.data);
        this.selection = new SelectionModel<AmountData>(true, []);
        //this.annualBudgetFormArray.removeAt(index);
        if(this.browserLang=='en'){
          Swal.fire('Deleted successfully', '', 'success')
        }else{
          Swal.fire('Apagado com sucesso', '', 'success')
        }
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }

  deleteRow(index: number) {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if(this.monitoringContractId[index] != undefined){
          this.monitoringContractId.splice(index,1);
        }
        if (this.contractFormArray.length == 1) {
          this.opensweetalert4();
        } else {
          this.contractFormArray.removeAt(index)
          if(this.browserLang=='en'){
            Swal.fire('Deleted successfully', '', 'success')
          }else{
            Swal.fire('Apagado com sucesso', '', 'success')
          }
        }
        if (this.findingFormArray.length == 1) {
          this.opensweetalert4();
        } else {
          this.findingFormArray.removeAt(index)
          if(this.browserLang=='en'){
            Swal.fire('Deleted successfully', '', 'success')
          }else{
            Swal.fire('Apagado com sucesso', '', 'success')
          }
        }
        if ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).length == 1) {
          this.opensweetalert4();
        } else {
          (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(index);
          if(this.browserLang=='en'){
            Swal.fire('Deleted successfully', '', 'success')
          }else{
            Swal.fire('Apagado com sucesso', '', 'success')
          }
        }

        if ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).length == 1) {
          this.opensweetalert4();
        } else {
          (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(index)
          if(this.browserLang=='en'){
            Swal.fire('Deleted successfully', '', 'success')
          }else{
            Swal.fire('Apagado com sucesso', '', 'success')
          }
        }

      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }

  physicalExecutionHeaders = ["Date of Physical Execution", "Financial Execution Rate", "Physical Execution Rate", "Comments"];
  physicalExecutionRows = [
    {
      "Date of Physical Execution": "",
      "Physical Execution Rate": ""
    }];
  get physicalExecutionRateArray(): FormArray {
    return this.monitoringForm.get('physicalExecutionData') as FormArray;
  }
  public addPhysicalExecutionHeaders(): void {

    this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });

    const row = this.fb.group({
      dateOfPhysicalExecution: [{ value: '', disabled: false }],

      funds: [{ value: '', disabled: true }],
      phiysicalExeRAte: [{ value: '', disabled: false }],
      comments: [''],

    });

    this.physicalExecutionRateArray.push(row);
  }

  constructor(private currencyPipe: CurrencyPipe, private dialog: MatDialog, private router: Router,
    private fb: FormBuilder, private projectService: ProjectService,
    private provincesService: ProvincesService, public translate: TranslateService,
    private implementingOrganizationService: ImplementingOrganizationService,
    private monitoringService: MonitoringService, private districtsService: DistrictsService,
    private monitoringCrudService: MonitoringCrudService, public datepipe: DatePipe,
    private readonly route: ActivatedRoute,private organizationService: OrganizationService,
    private notificationService: NotificationService) {

  }

  opensweetalert4() {
    this.getValueByLang()
    Swal.fire({
      title: (this.browserLang=='en')?'At least one record is required':'É necessário pelo menos um registo',
    })
  }

    
  deletePhysicalExecution(index: number) {
    this.getValueByLang();
    Swal.fire({
      /* Whenever we click on delete button then it will give two more button i.e. delete and cancel */
      title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
      showDenyButton: true,
      confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* If we click on delete button then by given id that record will deleted*/
      if (result.isConfirmed) {
        if (this.physicalExecutionRows.length == 1)
          this.opensweetalert4();
        else {
          if(this.monitoringPhyExeRAteId[index] != undefined){
            this.monitoringPhyExeRAteId.splice(index,1);
          }
          this.physicalExecutionRows.splice(index, 1);
          this.physicalExecutionRateArray.removeAt(index);
        }
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }


  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getOrganization();
    this.getProvinces();
    // this.getImplementingOrganization();
    this.getRecommendation();
    localStorage.setItem("monitoringRefNM", null);
    localStorage.removeItem("monitoringRefNM")
    this.getFinding();
    this.getProjectList();
    this.getLevelOfAction();
    this.getReasonForAddendum();
    this.getConstraint();
    this.getAllDistrict();
    this.getSaveAsDrfat();
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    this.usergroup = localStorage.getItem('usergroup');
    if (this.usergroup === undefined || this.usergroup === null)
      this.router.navigate(['/login']);
    this.editMonitoring = localStorage.getItem("editMonitoring");
    this.viewMonitoring = localStorage.getItem("viewMonitoring");
    this.contractId = this.route.snapshot.paramMap.get("contractId");

    this.index = localStorage.getItem("Index");

    this.monitoringForm = new FormGroup({
      saveAsDraft:new FormControl(''),
      reference: new FormControl(''),
      projectName: new FormControl('', [Validators.required]),
      startdate: new FormControl({ value: '', disabled: false }),
      enddate: new FormControl({ value: '', disabled: false }),
      budgetMzn: new FormControl({ value: '', disabled: true }),
      levelOfAction: new FormControl(''),
      strategicPriorityPQG: new FormControl({ value: '', disabled: true }),
      strategicObjectivePQG: new FormControl({ value: '', disabled: true }),
      conditions: new FormControl(''),
      physicalExecutionData: this.fb.array([
        this.fb.group({
          dateOfPhysicalExecution: [{ value: '', disabled: false }],
          funds: [{ value: '', disabled: true }],
          comments: [''],
          phiysicalExeRAte: [''],
        })
      ]),
    });
    // ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(0) as FormGroup).get('dateOfPhysicalExecution').disable();

    this.monitoringForm3 = this.fb.group({
      dovisit: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      districts: new FormControl(''),
      contractValue: new FormControl(''),
      organization: new FormControl(''),
      performance: new FormControl(''),
      contractAb: new FormControl(''),
      optionFind: new FormControl(''),
      otherReason: new FormControl(''),
      contraints: new FormControl(''),
      recommendation: new FormControl(''),
      dateOfLand: new FormControl('12/02/2020'),
      abValue: new FormControl({ value: '', disabled: true }),
      reasons: new FormControl({ value: '', disabled: true }),
      tableContract: this.fb.array([
        this.fb.group({
          dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }],
          province: [{ value: '', disabled: true }],

          district: [{ value: '', disabled: true }],
          company: [{ value: '', disabled: true }],
          contractValue: [{ value: '', disabled: true }],
          organization: [{ value: '', disabled: true }],
          contractAb: [{ value: '', disabled: true }],
          abValue: [{ value: '', disabled: true }],
          reasons: [{ value: [""], disabled: true }],
          originalContractEndDate: [{ value: '', disabled: true }],
          endDateadenda: [{ value: '', disabled: true }],
          otherReasonsforaddendum: [{ value: '', disabled: true }]
        })
      ]),

      tableFindings: this.fb.array([
        this.fb.group({
          dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }],
          province: [{ value: 9, disabled: true }],
          districts: [{ value: "", disabled: true }],
          findings: [{ value: '', disabled: true }],
          optionFind: [{ value: '', disabled: true }],
          otherReason: [{ value: '', disabled: true }],
          contraints: [{ value: [], disabled: true }],
          recommendation: [{ value: '', disabled: true }],
          reasons: [{ value: '', disabled: true }],
          searchoptionFind: [''],
        })
      ]),
      tableDatainancialPerformance: this.fb.array([

        this.fb.group({
          dateOfFieldVisitFinancialExecution: [{ value: '', disabled: true }],
          province: [{ value: '', disabled: true }],
          districts: [{ value: '', disabled: true }],
          finExecution: [{ value: '', disabled: true }],
          finExecutionRate: [{ value: '', disabled: true }],
        })
      ]),
      tableDataphysicalExecution: this.fb.array([
        this.fb.group({
          dateOfFieldVisitPhysicalExecution: [{ value: '', disabled: true }],
          province: [{ value: '', disabled: true }],
          districts: [{ value: '', disabled: true }],
          physicalRate: [{ value: '', disabled: true }, [Validators.required]],
          comments: [{ value: '', disabled: true }]
        })
      ]),

    });

    // ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('district').disable();
    // ((this.monitoringForm3.get('tableContract') as FormArray).at(1) as FormGroup).get('district').disable();

    // this.getOptionFinding(0, this.browserLang);
    this.editMonitoring = localStorage.getItem("editMonitoring");
    /* Below is for edit time we have to get the monitoring id from url */
    this.monitoringId = this.route.snapshot.paramMap.get("monitoringId");
    if (this.monitoringId != null) {
      this.auto_save_as_draft_flag=false;
      
      if(this.monitoringForm.controls['saveAsDraft'].value == ''){
        
      this.monitoringCrudService.editByMonitoringId(this.monitoringId).pipe(first()).subscribe(
        data => {
          this.editMonitoringData = data;
          console.log("edit data ", this.editMonitoringData);
          /* Physical Execution Rate All row remove strat*/
          for (let j = 0; j < this.physicalExecutionRateArray.length; j++) {
            this.physicalExecutionRows.splice(j, 1);
            this.physicalExecutionRateArray.removeAt(j);
          }
          /* Physical Execution Rate All row remove end*/
          /* Remove All Row from contract table Start*/
          let contractFormArray = this.contractFormArray.length;
          for (let l = 0; l < contractFormArray; l++) {
            this.contractFormArray.removeAt(l);
            this.findingFormArray.removeAt(l);
            (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(l);
            (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(l)
          }
          this.contractFormArray.removeAt(0);
          this.findingFormArray.removeAt(0);
          (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(0);
          (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(0)
          /* Remove All Row from contract table end*/

          for (let i = 0; i < this.editMonitoringData.length; i++) {

            this.monitoringForm.controls.projectName.setValue((this.editMonitoringData[i].projectId));
            this.addToUploadDocLocalVar(this.editMonitoringData[i].projectId);
            this.monitoringForm.controls.startdate.setValue(this.editMonitoringData[i].startDt);
            this.monitoringForm.controls.enddate.setValue(this.editMonitoringData[i].endDt)
            this.monitoringForm.controls['conditions'].patchValue(this.editMonitoringData[i].conditionOfDisbursment);
            this.monitoringForm.controls['levelOfAction'].patchValue(this.editMonitoringData[i].levelOfAction);
            let physicalExecindex=0;
            /* Physical Execution Rate add row nd patch strat*/
            
            let physicalExecutionRateSize = this.editMonitoringData[i].monitoringPhyAllData.length;
            if(physicalExecutionRateSize > 0){
            for (let k = 0; k < physicalExecutionRateSize; k++) {
              this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
              const row = this.fb.group({
                dateOfPhysicalExecution: [{ value: '', disabled: false }],
                funds: [{ value: '', disabled: true }],
                phiysicalExeRAte: [{ value: '', disabled: false }],
                comments: [''],
              });
              
            if(this.editMonitoringData[i].monitoringPhyAllData[k].status != 'InActive'){
              this.physicalExecutionRateArray.push(row);
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('dateOfPhysicalExecution').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].dateOfFinancialExecution));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('funds').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].financialExeRate));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('phiysicalExeRAte').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].physicalExeRate));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('comments').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].comment));
              this.monitoringPhyExeRAteId.push(this.editMonitoringData[i].monitoringPhyAllData[k].monitoringPhysicalId);
              physicalExecindex=physicalExecindex+1;
            }
            }
          }else{
            this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
              const row = this.fb.group({
                dateOfPhysicalExecution: [{ value: '', disabled: false }],
                funds: [{ value: '', disabled: true }],
                phiysicalExeRAte: [{ value: '', disabled: false }],
                comments: [''],
              });
              this.physicalExecutionRateArray.push(row);
          }
            /* Physical Execution Rate add row nd patch end*/

            /* field visit start*/
            for (let k = 0; k < this.editMonitoringData[i].monitoringFieldVisitAllData.length; k++) {
              this.monitoringForm3.controls.dovisit.clearValidators();//setting validation
              this.monitoringForm3.controls.dovisit.setErrors({ 'required': false });//error message
              this.monitoringForm3.controls.dovisit.updateValueAndValidity();//update validation

              this.monitoringForm3.controls.province.clearValidators();//setting validation
              this.monitoringForm3.controls.province.setErrors({ 'required': false });//error message
              this.monitoringForm3.controls.province.updateValueAndValidity();//update validation

              // this.monitoringForm3.controls.dovisit.setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
              // this.monitoringForm3.controls.province.setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience)
              this.select_options_for_district_hdn_flag = false;

              for (let l = 0; l < this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData.length; l++) {
                this.getDistricts();
                // var district = this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district;
                // var arr = [];
                // arr.push(district);
                // this.monitoringForm3.controls.districts.patchValue(arr);
                /* field visit end*/
               
                /* Value patch in Contract table start */
                  if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].status == 'Active') {
                    // this.addRow();
                    this.addItem();
                    this.addExecutionItem();
                    this.addContract();
                    this.addFinding();
                    this.validateOnChange();
                  this.getCurrency();

                    ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
                    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('district').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
                    ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);

                    ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitPhysicalExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
                    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
                     ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
                    ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
                     ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
                    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
                                    
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('company').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].nameOfContractedCompany);
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('contractValue').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].contractVAlueMZN, " ")));
                  if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].organizationId != null) {
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('organization').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].organizationId).toString());
                  } else {
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('organization').setValue('');
                  }
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('contractAb').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].didContractAddendum);

                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('abValue').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].addendumVAlueMZN, " ")));
                  var arrRgnForAddendum = [];
                  for (let b = 0; b < (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].reasonForAddendumAllData).length; b++) {
                    var rgnForAddendum = (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].reasonForAddendumAllData[b].reasonForAddendum);
                   
                    arrRgnForAddendum.push(rgnForAddendum);
                    ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('reasons').setValue(arrRgnForAddendum);
                  }
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('otherReasonsforaddendum').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].otherReasonAddendum);
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('originalContractEndDate').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].originalContractEndDate);
                  ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('endDateadenda').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].endDateAfterAddendum);
                  this.validateContract(this.indexContract);
                  this.checkReason(this.indexContract);
                  /* Value patch in Contract table end */
                  /* Value patch in Financial Performance of the Contract strat*/
                  ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('finExecution').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].financialExecution, " ")));
                  ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('finExecutionRate').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].financialExeRate, " ")));
                  /* Value patch in Financial Performance of the Contract end*/

                  /* Value patch in Physical Execution of the Contract strat*/
                  ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('physicalRate').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].physicalExeRate, " ")));
                  ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('comments').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].comments);
                   /* Value patch in Physical Execution of the Contract end*/

                    /* Value patch in Findings strat*/
                    if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].findings != null) {
                      ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('findings').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].findings).toString());
                    }
                    this.getOptionFinding(this.indexContract, 'en');
                    if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].selectOptionForFindings != null) {
                      ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('optionFind').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].selectOptionForFindings).toString());
                    }
                    ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('otherReason').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].otherReason));
                    if((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].recommendation) != null)
                    {
                      ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('recommendation').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].recommendation).toString());
                    }else{
                      ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('recommendation').setValue('');

                    }
                    var arrconstraint = [];
                    for (let a = 0; a < (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].constraint).length; a++) {
                      var constraint = this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].constraint[a].constraintMasterId;
                      
                      arrconstraint.push(constraint);
                      ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('contraints').setValue(arrconstraint);
                    }
                    this.FindingsChangeAction(this.indexContract);
                    /* Value patch in Findings end*/

                  this.indexContract = this.indexContract + 1;
                }
                

              }
            }
          }
          this.countContract=2;
          this.validateOnChange();
          this.getCurrency();
        },
        /* If We get Any error then the error will show here
        *  Suppose we give a id that will not present in our db then it will show an error message
        */
        error => {

          console.log("error ", error);
          this.getValueByLang()
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            (this.browserLang=='en')?Swal.fire("Some error happen.", '', 'error'):Swal.fire("Algum erro acontece.", '', 'error');
          } else {
            (this.browserLang=='en')?Swal.fire("Some error happen.", '', 'error'):Swal.fire("Algum erro acontece.", '', 'error');

          }

        });
    }
  }

    this.viewMonitoring = localStorage.getItem("viewMonitoring");

    /* Below is for At View more time we have to get the contract id from url */
    this.contractId = this.route.snapshot.paramMap.get("contractId");
    if (this.contractId != null) {
      this.auto_save_as_draft_flag=false;
      this.monitoringCrudService.viewMoreBycontractId(this.contractId).pipe(first()).subscribe(
        data => {
          console.log("view more data ", data)
          this.viewMoreMonitoring = data;
          for (let i = 0; i < this.viewMoreMonitoring.length; i++) {
            this.monitoring_Id = this.viewMoreMonitoring[i].monitoringId;
            this.monitoringForm.controls.projectName.setValue((this.viewMoreMonitoring[i].projectId));
            this.monitoringForm.controls.startdate.setValue(this.viewMoreMonitoring[i].startDt);
            this.monitoringForm.controls.enddate.setValue(this.viewMoreMonitoring[i].endDt)
            this.monitoringForm.controls['conditions'].patchValue(this.viewMoreMonitoring[i].conditionOfDisbursment);
            this.monitoringForm.controls['levelOfAction'].patchValue(this.viewMoreMonitoring[i].levelOfAction);
            this.monitoringForm3.controls.dovisit.setValue(this.viewMoreMonitoring[i].dateOfFieldVisit);
            this.monitoringForm3.controls.province.setValue(this.viewMoreMonitoring[i].provience)
            this.select_options_for_district_hdn_flag = false;
            this.getDistricts();
            this.getAllDistrict();
            var district = this.viewMoreMonitoring[i].district;
            var arr = [];
            arr.push(district);
            this.monitoringForm3.controls.districts.patchValue(this.viewMoreMonitoring[i].district);
            console.log(this.monitoringForm3.controls.districts.value)
            for (let j = 0; j < this.physicalExecutionRateArray.length; j++) {
              this.physicalExecutionRows.splice(j, 1);
              this.physicalExecutionRateArray.removeAt(j);
            }
            let physicalExecutionRateSize = this.viewMoreMonitoring[i].monitoringPhysicalExeData.length;
            if(physicalExecutionRateSize > 0){
              for (let k = 0; k < physicalExecutionRateSize; k++) {
              this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
              const row = this.fb.group({
                dateOfPhysicalExecution: [{ value: '', disabled: false }],
                funds: [{ value: '', disabled: true }],
                phiysicalExeRAte: [{ value: '', disabled: false }],
                comments: [''],
              });
              this.physicalExecutionRateArray.push(row);
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(k) as FormGroup).get('dateOfPhysicalExecution').setValue(this.viewMoreMonitoring[i].monitoringPhysicalExeData[k].dateOfFinancialExecution));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(k) as FormGroup).get('funds').setValue(this.viewMoreMonitoring[i].monitoringPhysicalExeData[k].financialExeRate));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(k) as FormGroup).get('phiysicalExeRAte').setValue(this.viewMoreMonitoring[i].monitoringPhysicalExeData[k].physicalExeRate));
              (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(k) as FormGroup).get('comments').setValue(this.viewMoreMonitoring[i].monitoringPhysicalExeData[k].comment));

            }
          }else{
            this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
              const row = this.fb.group({
                dateOfPhysicalExecution: [{ value: '', disabled: false }],
                funds: [{ value: '', disabled: true }],
                phiysicalExeRAte: [{ value: '', disabled: false }],
                comments: [''],
              });
              this.physicalExecutionRateArray.push(row);
          }


            let contractFormArray = this.contractFormArray.length;

            for (let l = 0; l < contractFormArray; l++) {
              this.contractFormArray.removeAt(l);
              this.findingFormArray.removeAt(l);
              (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(l);
              (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(l)
            }
            this.contractFormArray.removeAt(0);
            this.findingFormArray.removeAt(0);
            (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(0);
            (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(0)
            this.addRow();
            this.validateOnChange();
            this.getCurrency();

            ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(0) as FormGroup).get('districts').patchValue(this.viewMoreMonitoring[i].district);
            ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(0) as FormGroup).get('districts').patchValue(this.viewMoreMonitoring[i].district);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('district').patchValue(this.viewMoreMonitoring[i].district);
            ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('districts').patchValue(this.viewMoreMonitoring[i].district);
            

            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('company').setValue(this.viewMoreMonitoring[i].nameOfContractedCompany);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('contractValue').setValue((this.currencyPipe.transform(this.viewMoreMonitoring[i].contractVAlueMZN, " ")));
            if (this.viewMoreMonitoring[i].organizationId != null) {
              ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('organization').setValue((this.viewMoreMonitoring[i].organizationId).toString());
            } else {
              ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('organization').setValue('');
            }
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('contractAb').setValue(this.viewMoreMonitoring[i].didContractAddendum);

            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('abValue').setValue((this.currencyPipe.transform(this.viewMoreMonitoring[i].addendumVAlueMZN, " ")));
            var arrRgnForAddendum = [];
            for (let k = 0; k < (this.viewMoreMonitoring[i].reasonForAddendum).length; k++) {
              var rgnForAddendum = (this.viewMoreMonitoring[i].reasonForAddendum[k].reasonForAddendum);
              
              arrRgnForAddendum.push(rgnForAddendum);
              ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('reasons').setValue(arrRgnForAddendum);
            }
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('otherReasonsforaddendum').setValue(this.viewMoreMonitoring[i].otherReasonForAddendum);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('originalContractEndDate').setValue(this.viewMoreMonitoring[i].originalContractEndDate);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(0) as FormGroup).get('endDateadenda').setValue(this.viewMoreMonitoring[i].endDateAfterAddendum);

            ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(0) as FormGroup).get('finExecution').setValue((this.currencyPipe.transform(this.viewMoreMonitoring[i].financialExecution, " ")));
            ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(0) as FormGroup).get('finExecutionRate').setValue((this.currencyPipe.transform(this.viewMoreMonitoring[i].financialExeRateContract, " ")));

            ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(0) as FormGroup).get('physicalRate').setValue((this.currencyPipe.transform(this.viewMoreMonitoring[i].physicalExeRateContract, " ")));
            ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(0) as FormGroup).get('comments').setValue(this.viewMoreMonitoring[i].comments);

            if (this.viewMoreMonitoring[i].findings != null) {
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('findings').setValue((this.viewMoreMonitoring[i].findings).toString());
            }
            this.getOptionFinding(0, 'en');
            if (this.viewMoreMonitoring[i].selectOptionForFindings != null) {
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('optionFind').setValue((this.viewMoreMonitoring[i].selectOptionForFindings).toString());
            }
            ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('otherReason').setValue((this.viewMoreMonitoring[i].otherReason));
            ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('recommendation').setValue((this.viewMoreMonitoring[i].recommendation));
            var arrconstraint = [];
            for (let k = 0; k < (this.viewMoreMonitoring[i].constraint).length; k++) {
              var constraint = this.viewMoreMonitoring[i].constraint[k].constraintMasterId;
             
              arrconstraint.push(constraint);
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(0) as FormGroup).get('contraints').setValue(arrconstraint);
            }
            this.pickerDisable_flag = true;
            this.districtDisable_flag = true;
            this.monitoringForm.disable();
            this.monitoringForm3.disable();
            this.monitoringForm3.controls.districts.disable();
            (this.monitoringForm.get('physicalExecutionData') as FormArray).disable();

          }
        },
        /* If We get Any error then the error will show here
        *  Suppose we give a id that will not present in our db then it will show an error message
        */
        error => {

          console.log("error ", error);
          this.getValueByLang()
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            (this.browserLang=='en')?Swal.fire("Some error happen at view more time.", '', 'error'):Swal.fire("Algum erro acontece ao ver mais tempo.", '', 'error');
          } else {
            (this.browserLang=='en')?Swal.fire("Some error happen at view more time.", '', 'error'):Swal.fire("Algum erro acontece ao ver mais tempo.", '', 'error');
          }

        });
    }
  }



  MoveToEditMonitoring(monitoringId: any) {
    localStorage.setItem("editMonitoring", "editMonitoring");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-monitoring', monitoringId]));


  }
  addRowtableDatainancialPerformance(dateOfFieldVisitFinancialExecution, province, finExecution, finExecutionRate) {
    const row = this.fb.group({
      dateOfFieldVisitFinancialExecution: [dateOfFieldVisitFinancialExecution],
      province: [province],
      districts: [{ value: '', disabled: true }],
      finExecution: [finExecution],
      finExecutionRate: [finExecutionRate],
      status: ['existing']

    });

    (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).push(row);
    this.monitoringForm3.controls.tableDatainancialPerformance.disable();

  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Monitoring'){
        this.authorised_flag=true;
      }
    }
  }


  addRowtableDataphysicalExecution(dateOfFieldVisitPhysicalExecution, province, physicalRate) {
    const row = this.fb.group({
      dateOfFieldVisitPhysicalExecution: [dateOfFieldVisitPhysicalExecution],
      province: [province],
      districts: [{ value: '', disabled: true }],
      physicalRate: [physicalRate],
      status: ['existing'],
      comments: ['']

    });

    (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).push(row);
    this.monitoringForm3.controls.tableDataphysicalExecution.disable();
  }


  onEnter(evt: any): void {
    const selectedProject = this.projectList.find(project =>
      project.projectTitle.toLowerCase() == evt.source.value.toLowerCase());
    if (evt.source.selected) {
      if (selectedProject) {
        setTimeout(() => {
        }, 0);
      }

    }
  }
  moveToMoniteringTab() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/admin/view-monitoring']));
  }
  addendum_disable: any = false;
  rgnForAddendumFlag:any=false;
  validateContract(index: any) {
    let contarctLength = this.contractFormArray.length - 1;
    if (((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('contractAb').value == "Yes") {
      // this.addendum_value_mandatory_flag = true;
      this.rgnForAddendumFlag=true;
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').enable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').enable();
      // ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setValidators([Validators.required]);//setting validation
      // ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setErrors({ 'required': true });//error message
      // ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').updateValueAndValidity();//update validation

      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').setValidators([Validators.required]);//setting validation
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').setErrors({ 'required': true });//error message
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').updateValueAndValidity();//update validation
    } else {
      this.rgnForAddendumFlag=false;
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').disable();

      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').disable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').reset();

      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').reset();

      // this.addendum_value_mandatory_flag = false;
      this.hdn_flag = true;
      this.hdn_flag1 = true;

    }

    let contractAb = this.monitoringForm3.controls['contractAb'].value;
    if (contractAb == "Yes") {

      this.hdn_flag = "false";
      this.hdn_flag1 = "false";
    }
    if (contractAb == "No") {
      this.hdn_flag = "true";
      this.hdn_flag1 = "true";

    }
  }

  private filterProject(name: string) {
    return this.projectList.filter(project =>
      project.projectTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  public createmonitoring = (monitoringFormValue) => {
    if (this.monitoringForm3.valid) {
      this.executeDisbursementCreation(monitoringFormValue);
    }
  }
  private executeDisbursementCreation = (monitoringFormValue) => {
    let monitoring: Monitoring = {

      company: monitoringFormValue.company,
      contractValue: monitoringFormValue.contractValue,
      organization: monitoringFormValue.organization,
      performance: monitoringFormValue.performance,
      contractAb: monitoringFormValue.contractAb,
      abValue: monitoringFormValue.abValue,
      reasons: monitoringFormValue.reasons,
      findings: monitoringFormValue.findings,
      optionFind: monitoringFormValue.optionFind,
      otherReason: monitoringFormValue.otherReason,
      contraints: monitoringFormValue.contraints,
      recommendation: monitoringFormValue.recommendation,

    }
  }

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  FindingsChangeAction(index: any) {

    let finding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('findings').value;
    if (finding == 2) {
      this.select_options_for_finding_hdn_flag = true;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('optionFind').disable();
    } else {
      this.select_options_for_finding_hdn_flag = false;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('optionFind').enable();
    }
    this.getOptionFinding(index, this.browserLang);
    if (finding == 2) {
      this.select_options_for_finding_hdn_flag = true;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('optionFind').disable();

    }
    else {
      this.select_options_for_finding_hdn_flag = false;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('optionFind').enable();

    }

    if (finding == 3 || finding == 4 || finding == 5) {
      this.other_reasons_hdn_flag = false;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('otherReason').enable();

    }
    else {
      this.other_reasons_hdn_flag = true;
      ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('otherReason').disable();
    }

  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  clearStartDate(event) {
    event.stopPropagation();
    this.monitoringForm.controls['startdate'].reset();
  }

  clearEndDate(event) {
    event.stopPropagation();
    this.monitoringForm.controls['enddate'].reset();
  }

  clearPhysicalExeDate(event,index:number){
    event.stopPropagation();
    ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(index) as FormGroup).get('dateOfPhysicalExecution').reset();
  }

  clearfieldDate(event){
    event.stopPropagation();
    this.monitoringForm3.controls['dovisit'].reset();
  }

  moveToSelectedTabFunding(tabName: string) {
    localStorage.setItem("EditFunding", "EditFunding");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-funding']));

  }
  viewFunding() {
    localStorage.setItem("ViewMoreFunding", "ViewMoreFunding");
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-funding']));
  }
  validateOnChange() {
    this.auto_save_as_draft_flag=true;
    if (this.monitoringForm.valid) {
      this.terrainVisit_flag = "true";
      this.contract_flag = "true";
      this.hidden = false;
    }
    else {
      this.terrainVisit_flag = "false";

    }

    
  }

  validateProject() {

    if (this.monitoringForm.valid || this.monitoringForm.status == "DISABLED") {
      this.terrainVisit_flag = "true";
      this.nextStep();
      this.contract_flag = "true";
    }
    else {
      this.terrainVisit_flag = "false";
      this.contract_flag = "false";

    }
  }

  getCurrency() {
    this.disabledpanel = false;
    // this.monitoringForm.controls['startdate'].setValue(moment("15/03/2019", "DD/MM/YYYY"));
    // this.monitoringForm.controls['enddate'].setValue(moment("14/04/2023", "DD/MM/YYYY"));
    this.monitoringForm.controls['budgetMzn'].setValue(this.currencyPipe.transform("1555555.2", " "));
    this.flagProjectName = "Mozambique Infrastructure Project";
    this.monitoringForm.controls['strategicPriorityPQG'].setValue('REF - PQG - PR - 001 - Strategic Priority PQG1');
    this.monitoringForm.controls['strategicObjectivePQG'].setValue('REF - PQG - ST - 002 - Strategic Objective PQG2');

  }
  openMandatoryAlert() {
    $(".checkValidation").trigger("click");
    this.getValueByLang()
    if(this.monitoringForm.invalid || this.monitoringForm3.invalid){
      if(this.browserLang=='en')
      Swal.fire('Please fill all mandatory fields.')
      else
      Swal.fire('Por favor preencha todos os campos obrigatórios.')
    }else if(this.countContract == 0){
      if(this.browserLang=='en')
      Swal.fire('Please click on Add button.')
      else
      Swal.fire('Por favor clique no botão Adicionar.')
    }
    
  }
  opensweetalert() {
    this.getValueByLang();
    Swal.fire({
      title: (this.monitoringId==null)?((this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?'):((this.browserLang=='en')?'Do you want to Update?':'Você deseja actualizar?'),
      showDenyButton: true,
      confirmButtonText: (this.monitoringId==null) ? ((this.browserLang=='en')?`Submit`:'Submeter'):((this.browserLang=='en')?`Update`:'Actualizar'),
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
        this.monitoringData = new MonitoringCrudServiceClass();
        if(this.monitoringId != null){
          this.monitoringData.monitoringId=Number.parseInt(this.monitoringId);
        }else{
          this.monitoringData.monitoringId=this.monitoringId;
        }

        if (this.monitoringDraftId != null || this.monitoringDraftId != '' || this.monitoringDraftId != undefined) {
          this.monitoringData.saveAsDraftId = this.monitoringDraftId;
        }else{
          this.monitoringData.saveAsDraftId = this.monitoringDraftId;
        }
        this.monitoringData.language=this.browserLang;
        this.monitoringData.projectId = this.monitoringForm.controls['projectName'].value;
        var startDate=this.monitoringForm.controls['startdate'].value;
       
        this.monitoringData.startDt=startDate;
        var endDate=this.monitoringForm.controls['enddate'].value;
        
        this.monitoringData.endDt=endDate;
        
        this.monitoringData.levelOfAction = this.monitoringForm.controls['levelOfAction'].value;
        if(this.monitoringForm.controls['conditions'].value != null){
          this.monitoringData.conditionOfDisbursment = this.monitoringForm.controls['conditions'].value;
        }else{
          this.monitoringData.conditionOfDisbursment = '';
        }
        

        /* physical execution Start */
        var physicalExe = new Array();
        /* Here we get all table data and store in an array */
        for (let i = 0; i < this.physicalExecutionRateArray.length; i++) {
          var PhyJson: any = {};
          var financialExecRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value;
          if(financialExecRate != null){
            financialExecRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value).toString();
          }else{
            financialExecRate='';
          }
          var dateOfFinancialExecution = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('dateOfPhysicalExecution').value;
          var physicalExeRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value;
          if(physicalExeRate != null){
            physicalExeRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value).toString();
          }else{
            physicalExeRate='';
          }
          
          var comments = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value;
          if(comments != null){
            comments=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value).toString();
          }else{
            comments='';
          }

          if (dateOfFinancialExecution != '' && dateOfFinancialExecution != null) {
            var year = this.datepipe.transform(dateOfFinancialExecution, 'yyyy');
            var month = this.datepipe.transform(dateOfFinancialExecution, 'MMM');
            var date = this.datepipe.transform(dateOfFinancialExecution, 'dd');
            dateOfFinancialExecution = date + '-' + month + '-' + year;
          }else{
            dateOfFinancialExecution=''
          }
                   
          PhyJson.financialExecRate = financialExecRate;
          PhyJson.dateOfFinancialExecution = dateOfFinancialExecution;
          PhyJson.physicalExeRate = physicalExeRate;
          PhyJson.comments = comments;             
          physicalExe.push(PhyJson);
        }
        this.monitoringPhyExeData = new Array();
        for (let i = 0; i < physicalExe.length; i++) {

          var PhyJson = physicalExe[i];
          this.monitoringPhyTabDta = new MonitoringPhysicalExeServiceClass();
          this.monitoringPhyTabDta.dateOfFinancialExecution = PhyJson.dateOfFinancialExecution;
          if (PhyJson.financialExecRate != null) {
            this.monitoringPhyTabDta.financialExeRate = (PhyJson.financialExecRate).toString();
          } else {
            this.monitoringPhyTabDta.financialExeRate = '';
          }
          if (PhyJson.physicalExeRate != null) {
            this.monitoringPhyTabDta.physicalExeRate = (PhyJson.physicalExeRate).toString();
          } else {
            this.monitoringPhyTabDta.physicalExeRate = '';
          }


          this.monitoringPhyTabDta.comment = PhyJson.comments;
          this.monitoringPhyExeData.push(this.monitoringPhyTabDta);

        }
        this.monitoringData.monitoringPhyExeData = JSON.stringify(this.monitoringPhyExeData);
        /* physical execution End */

        /* Contract start */
        var contractArray = new Array();
        /* Field Visit Start */
        var fieldVisitArray=new Array();
        for (let i = 0; i < this.contractFormArray.length; i++) {
          var fieldVisitJson:any={};
          var dateOfVisit=((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('dateOfFieldVisitFinancialExecution').value;
          var provience =((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('province').value;
          if (dateOfVisit != '' && dateOfVisit !=null) {
            var yearVisit = this.datepipe.transform(dateOfVisit, 'yyyy');
            var monthVisit = this.datepipe.transform(dateOfVisit, 'MMM');
            var dateVisit = this.datepipe.transform(dateOfVisit, 'dd');
            dateOfVisit = dateVisit + '-' + monthVisit + '-' + yearVisit;
          }else{
            dateOfVisit=''
          }
          fieldVisitJson.dateOfVisit=dateOfVisit;
          fieldVisitJson.provience=provience;
          fieldVisitArray.push(fieldVisitJson);
          
          

         /* Field Visit End */

          
          var contractJson: any = {};
          var nameOfContComp = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value;
          if(nameOfContComp != null){
            nameOfContComp=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value).toString();
          }else{
            nameOfContComp='';
          }
          
          var contractValMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value;
         if(contractValMzn != null){
          contractValMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value).toString();
         }else{
          contractValMzn='';
         }
         
          var organization = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value;
          if(organization != null){
            organization=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value).toString();
          }else{
            organization='';
          }

          var didContrctAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value;
          if(didContrctAddendum !=null){
            didContrctAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value).toString();
          }else{
            didContrctAddendum='';
          }
          
          var addendumVAlMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value;
          if(addendumVAlMzn != null){
            addendumVAlMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value).toString();
          }else{
            addendumVAlMzn=''
          }
          
          var rgnForAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value;
          if(rgnForAddendum != null){
            rgnForAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value).toString();
          }else{
            rgnForAddendum='';
          }
          if(rgnForAddendum.length ==0){
            rgnForAddendum='';
          }
          var district = (((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('district').value);
          if(district != null){
           district= district.toString();
          }else{
            district='';
          }
         

          this.monitoringData.monitoringReasonsAddendumData = JSON.stringify(this.monitoringReasonsAddendumData);

          var otherRgn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value;
          if(otherRgn !=null){
            otherRgn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value).toString();
          }else{
            otherRgn='';
          }
          
          var originanalContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('originalContractEndDate').value;
          if (originanalContrctDt != '' && originanalContrctDt !=null) {
            
            var originalContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
            var originalContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
            var originalContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
            originanalContrctDt = originalContractDate + '-' + originalContractMonth + '-' + originalContractYr;
          }else{
            originanalContrctDt='';
          }

          var endContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('endDateadenda').value;
          if (endContrctDt != '' && endContractYr !=null) {
            var endContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
            var endContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
            var endContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
            endContrctDt = endContractDate + '-' + endContractMonth + '-' + endContractYr;
          }else{
            endContrctDt=''
          }


          //Financial Performance of the Contract
          var financialExe = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value;
          if(financialExe !=null){
            financialExe=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value).toString();
          }else{
            financialExe='';
          }

          var financialExeRate = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value;
          if(financialExeRate != null){
            financialExeRate=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value).toString();
          }else{
            financialExeRate='';
          }

          //Physical Execution of the Contract
          var phyExeRate = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value;
          if(phyExeRate != null){
            phyExeRate=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value).toString();
          }else{
            phyExeRate='';
          }
          
          var commentsPhy = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value;
          if(commentsPhy != null){
            commentsPhy=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value).toString();
          }else{
            commentsPhy='';
          }

          //Finding
          var findings = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value;
          if(findings != null){
            findings=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value).toString();
          }else{
            findings='';
          }

          var selectOptForFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value;
          if(selectOptForFinding != null){
            selectOptForFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value).toString();
          }else{
            selectOptForFinding='';
          }
          
          var otherRgnFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value;
          if(otherRgnFinding != null){
            otherRgnFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value).toString();
          }else{
            otherRgnFinding='';
          }
          
          var recommendation = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value;
          if(recommendation != null){
            recommendation=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value).toString();
          }else{
            recommendation='';
          }
          
          var constraint ="";
          // var constraint = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value;
         console.log("(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value)",(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value));
          if((((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value).at(0) != null){
            constraint=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value);
          }else{
            constraint='';
          }
          if(constraint.length ==0){
            constraint='';
          }
          contractJson.nameOfContComp = nameOfContComp;
          contractJson.contractValMzn = contractValMzn;
          contractJson.organization = organization;
          contractJson.didContrctAddendum = didContrctAddendum;
          contractJson.addendumVAlMzn = addendumVAlMzn;
          contractJson.otherRgn = otherRgn;
          contractJson.originanalContrctDt = originanalContrctDt;
          contractJson.endContrctDt = endContrctDt;
          contractJson.financialExe = financialExe;
          contractJson.financialExeRate = financialExeRate;
          contractJson.phyExeRate = phyExeRate;
          contractJson.commentsPhy = commentsPhy;
          contractJson.findings = findings;
          contractJson.selectOptForFinding = selectOptForFinding;
          contractJson.otherRgnFinding = otherRgnFinding;
          contractJson.recommendation = recommendation;
          contractJson.rgnForAddendum = rgnForAddendum;
          contractJson.constraint = constraint;
          contractJson.district = district;
       
          contractArray.push(contractJson);
        };
        this.monitoringContarctData = new Array();
        for (let i = 0; i < contractArray.length; i++) {
          var fieldVisitJson = fieldVisitArray[i];
          this.monitoringFieldVisitsData = new MonitoringFieldVisitsServiceClass();
          this.monitoringFieldVisitsData.dateOfFieldVisit = fieldVisitJson.dateOfVisit;
          this.monitoringFieldVisitsData.provience = fieldVisitJson.provience;
          this.monitoringFieldVisitData.push(this.monitoringFieldVisitsData);
          
        
          var contractJson = contractArray[i];
          this.monitoringContractTabData = new MonitoringContrctServiceClass();
          this.monitoringContractTabData.nameOfContractedCompany = contractJson.nameOfContComp;
          if (contractJson.contractValMzn != null) {
            this.monitoringContractTabData.contractVAlueMZN = (contractJson.contractValMzn).toString();
          } else {
            this.monitoringContractTabData.contractVAlueMZN = '';
          }

          this.monitoringContractTabData.organizationId = contractJson.organization;
          this.monitoringContractTabData.didContractAddendum = contractJson.didContrctAddendum;
          if (contractJson.addendumVAlMzn != null) {
            this.monitoringContractTabData.addendumVAlueMZN = (contractJson.addendumVAlMzn).toString();
          } else {
            this.monitoringContractTabData.addendumVAlueMZN = '';
          }

          this.monitoringContractTabData.otherReasonAddendum = contractJson.otherRgn;
          this.monitoringContractTabData.originalContractEndDate = contractJson.originanalContrctDt;
          this.monitoringContractTabData.endDateAfterAddendum = contractJson.endContrctDt
          if (contractJson.financialExe != null) {
            this.monitoringContractTabData.financialExecution = (contractJson.financialExe).toString();
          } else {
            this.monitoringContractTabData.financialExecution = '';
          }
          if (contractJson.financialExeRate != null) {
            this.monitoringContractTabData.financialExeRate = (contractJson.financialExeRate).toString();
          } else {
            this.monitoringContractTabData.financialExeRate = '';
          }
          if (contractJson.phyExeRate != null) {
            this.monitoringContractTabData.physicalExeRate = (contractJson.phyExeRate).toString();
          } else {
            this.monitoringContractTabData.physicalExeRate = '';
          }

          this.monitoringContractTabData.comments = contractJson.commentsPhy;
          this.monitoringContractTabData.findings = contractJson.findings;
          this.monitoringContractTabData.selectOptionForFindings = contractJson.selectOptForFinding;
          this.monitoringContractTabData.otherReason = contractJson.otherRgnFinding;
          this.monitoringContractTabData.recommendation = contractJson.recommendation;
          this.monitoringContractTabData.district = contractJson.district;
          if (contractJson.rgnForAddendum != '') {
            this.monitoringContractTabData.reasonAddendum = (contractJson.rgnForAddendum).toString();
          } else {
            this.monitoringContractTabData.reasonAddendum = contractJson.rgnForAddendum;
          }
          if (contractJson.constraint != '') {
            this.monitoringContractTabData.constraint = (contractJson.constraint).toString();
          } else {
            this.monitoringContractTabData.constraint = (contractJson.constraint);
          }
          this.monitoringContractTabData.monitoringContractId=contractJson.contractId;



          this.monitoringContarctData.push(this.monitoringContractTabData);
        }
        this.monitoringData.monitoringFieldVisitData = JSON.stringify(this.monitoringFieldVisitData);
        this.monitoringData.monitoringContractData = JSON.stringify(this.monitoringContarctData);


        /* Contract End */
        console.log("alll data ", JSON.stringify(this.monitoringData))
         this.saveMonitoringData();

      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }

  saveMonitoringData() {
    this.getValueByLang();
    this.monitoringCrudService.saveMonitoringData(this.monitoringData).pipe(first()).subscribe(
      {
        next: () => {
          this.auto_save_as_draft_flag=false;
          if(this.monitoringId==null){
            this.saveMonitoringNotificationAlert();
          }
          if(this.monitoringId==null){
            if(this.browserLang=='en'){
              Swal.fire('Submitted successfully', '', 'success');
            }else{
              Swal.fire('Submetido com sucesso', '', 'success');
            }
          }else{
            if(this.browserLang=='en'){
              Swal.fire('Updated successfully', '', 'success');
            }else{
              Swal.fire('Actualizado com Sucesso', '', 'success');
            }
          }
          if(this.monitoringId!=null){
            this.updateMonitoringNotificationAlert();
          }
          /* If data will store successfully then we call this method to go to view page */
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
  goToViewMonitoring() {
    this.router.navigate(['/admin/view-monitoring']);
  }

  opensweetalert2() {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to save as Draft?':'Deseja salvar como Rascunho?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang=='en')?`Save`:'Salve',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.monitoringData = new MonitoringCrudServiceClass();
        if(this.monitoringDraftId != null){
          this.monitoringData.monitoringId=Number.parseInt(this.monitoringDraftId);
        }else{
          this.monitoringData.monitoringId=this.monitoringDraftId;
        }
        this.monitoringData.usergroup=this.usergroup;
        this.monitoringData.projectId = this.monitoringForm.controls['projectName'].value;
        var startDate=this.monitoringForm.controls['startdate'].value;
       
        this.monitoringData.startDt=startDate;
        var endDate=this.monitoringForm.controls['enddate'].value;
        
        this.monitoringData.endDt=endDate;
        this.monitoringData.levelOfAction = this.monitoringForm.controls['levelOfAction'].value;
        if(this.monitoringForm.controls['conditions'].value != null){
          this.monitoringData.conditionOfDisbursment = this.monitoringForm.controls['conditions'].value;
        }else{
          this.monitoringData.conditionOfDisbursment = '';
        }
        

        /* physical execution Start */
        var physicalExe = new Array();
        /* Here we get all table data and store in an array */
        for (let i = 0; i < this.physicalExecutionRateArray.length; i++) {
          var PhyJson: any = {};
          var financialExecRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value;
          if(financialExecRate != null){
            financialExecRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value).toString();
          }else{
            financialExecRate='';
          }
          var dateOfFinancialExecution = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('dateOfPhysicalExecution').value;
          var physicalExeRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value;
          if(physicalExeRate != null){
            physicalExeRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value).toString();
          }else{
            physicalExeRate='';
          }
          
          var comments = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value;
          if(comments != null){
            comments=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value).toString();
          }else{
            comments='';
          }

          if (dateOfFinancialExecution != '' && dateOfFinancialExecution != null) {
            var year = this.datepipe.transform(dateOfFinancialExecution, 'yyyy');
            var month = this.datepipe.transform(dateOfFinancialExecution, 'MMM');
            var date = this.datepipe.transform(dateOfFinancialExecution, 'dd');
            dateOfFinancialExecution = date + '-' + month + '-' + year;
          }else{
            dateOfFinancialExecution=''
          }
                   
          PhyJson.financialExecRate = financialExecRate;
          PhyJson.dateOfFinancialExecution = dateOfFinancialExecution;
          PhyJson.physicalExeRate = physicalExeRate;
          PhyJson.comments = comments;             
          physicalExe.push(PhyJson);
        }
        this.monitoringPhyExeData = new Array();
        for (let i = 0; i < physicalExe.length; i++) {

          var PhyJson = physicalExe[i];
          this.monitoringPhyTabDta = new MonitoringPhysicalExeServiceClass();
          this.monitoringPhyTabDta.dateOfFinancialExecution = PhyJson.dateOfFinancialExecution;
          if (PhyJson.financialExecRate != null) {
            this.monitoringPhyTabDta.financialExeRate = (PhyJson.financialExecRate).toString();
          } else {
            this.monitoringPhyTabDta.financialExeRate = '';
          }
          if (PhyJson.physicalExeRate != null) {
            this.monitoringPhyTabDta.physicalExeRate = (PhyJson.physicalExeRate).toString();
          } else {
            this.monitoringPhyTabDta.physicalExeRate = '';
          }


          this.monitoringPhyTabDta.comment = PhyJson.comments;
          this.monitoringPhyExeData.push(this.monitoringPhyTabDta);

        }
        this.monitoringData.monitoringPhyExeData = JSON.stringify(this.monitoringPhyExeData);
        /* physical execution End */

        /* Contract start */
        var contractArray = new Array();
        /* Field Visit Start */
        var fieldVisitArray=new Array();
        for (let i = 0; i < this.contractFormArray.length; i++) {
          var fieldVisitJson:any={};
          var dateOfVisit=((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('dateOfFieldVisitFinancialExecution').value;
         
          var provience =((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('province').value;
          if(provience == null){
            provience=''
          }else{
            provience=provience.toString();
          }
          if (dateOfVisit != '' && dateOfVisit !=null) {
            var yearVisit = this.datepipe.transform(dateOfVisit, 'yyyy');
            var monthVisit = this.datepipe.transform(dateOfVisit, 'MMM');
            var dateVisit = this.datepipe.transform(dateOfVisit, 'dd');
            dateOfVisit = dateVisit + '-' + monthVisit + '-' + yearVisit;
          }else{
            dateOfVisit=''
          }
          fieldVisitJson.dateOfVisit=dateOfVisit;
          fieldVisitJson.provience=provience;
          fieldVisitArray.push(fieldVisitJson);
          
          

         /* Field Visit End */

          
          var contractJson: any = {};
          var nameOfContComp = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value;
          if(nameOfContComp != null){
            nameOfContComp=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value).toString();
          }else{
            nameOfContComp='';
          }
          
          var contractValMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value;
         if(contractValMzn != null){
          contractValMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value).toString();
         }else{
          contractValMzn='';
         }
         
          var organization = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value;
          if(organization != null){
            organization=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value).toString();
          }else{
            organization='';
          }

          var didContrctAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value;
          if(didContrctAddendum !=null){
            didContrctAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value).toString();
          }else{
            didContrctAddendum='';
          }
          
          var addendumVAlMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value;
          if(addendumVAlMzn != null){
            addendumVAlMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value).toString();
          }else{
            addendumVAlMzn=''
          }
          
          var rgnForAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value;
          if(rgnForAddendum != null){
            rgnForAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value).toString();
          }else{
            rgnForAddendum='';
          }
          if(rgnForAddendum.length==0){
            rgnForAddendum='';
          }
          var district = (((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('district').value);
          if(district != null){
           district= district.toString();
          }else{
            district='';
          }
         

          this.monitoringData.monitoringReasonsAddendumData = JSON.stringify(this.monitoringReasonsAddendumData);

          var otherRgn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value;
          if(otherRgn !=null){
            otherRgn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value).toString();
          }else{
            otherRgn='';
          }
          
          var originanalContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('originalContractEndDate').value;
          if (originanalContrctDt != '' && originanalContrctDt !=null) {
            
            var originalContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
            var originalContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
            var originalContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
            originanalContrctDt = originalContractDate + '-' + originalContractMonth + '-' + originalContractYr;
          }else{
            originanalContrctDt='';
          }

          var endContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('endDateadenda').value;
          if (endContrctDt != '' && endContractYr !=null) {
            var endContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
            var endContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
            var endContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
            endContrctDt = endContractDate + '-' + endContractMonth + '-' + endContractYr;
          }else{
            endContrctDt=''
          }


          //Financial Performance of the Contract
          var financialExe = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value;
          if(financialExe !=null){
            financialExe=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value).toString();
          }else{
            financialExe='';
          }

          var financialExeRate = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value;
          if(financialExeRate != null){
            financialExeRate=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value).toString();
          }else{
            financialExeRate='';
          }

          //Physical Execution of the Contract
          var phyExeRate = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value;
          if(phyExeRate != null){
            phyExeRate=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value).toString();
          }else{
            phyExeRate='';
          }
          
          var commentsPhy = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value;
          if(commentsPhy != null){
            commentsPhy=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value).toString();
          }else{
            commentsPhy='';
          }

          //Finding
          var findings = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value;
          if(findings != null){
            findings=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value).toString();
          }else{
            findings='';
          }

          var selectOptForFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value;
          if(selectOptForFinding != null){
            selectOptForFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value).toString();
          }else{
            selectOptForFinding='';
          }
          
          var otherRgnFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value;
          if(otherRgnFinding != null){
            otherRgnFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value).toString();
          }else{
            otherRgnFinding='';
          }
          
          var recommendation = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value;
          if(recommendation != null){
            recommendation=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value).toString();
          }else{
            recommendation='';
          }
          
          var constraint = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value;
          if(constraint != null){
            constraint=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value);
          }else{
            constraint='';
          }
          if(constraint.length == 0){
            constraint='';
          }
          contractJson.nameOfContComp = nameOfContComp;
          contractJson.contractValMzn = contractValMzn;
          contractJson.organization = organization;
          contractJson.didContrctAddendum = didContrctAddendum;
          contractJson.addendumVAlMzn = addendumVAlMzn;
          contractJson.otherRgn = otherRgn;
          contractJson.originanalContrctDt = originanalContrctDt;
          contractJson.endContrctDt = endContrctDt;
          contractJson.financialExe = financialExe;
          contractJson.financialExeRate = financialExeRate;
          contractJson.phyExeRate = phyExeRate;
          contractJson.commentsPhy = commentsPhy;
          contractJson.findings = findings;
          contractJson.selectOptForFinding = selectOptForFinding;
          contractJson.otherRgnFinding = otherRgnFinding;
          contractJson.recommendation = recommendation;
          contractJson.rgnForAddendum = rgnForAddendum;
          contractJson.constraint = constraint;
          contractJson.district = district;
       
          contractArray.push(contractJson);
        };
        this.monitoringContarctData = new Array();
        for (let i = 0; i < contractArray.length; i++) {
          var fieldVisitJson = fieldVisitArray[i];
          this.monitoringFieldVisitsData = new MonitoringFieldVisitsServiceClass();
          this.monitoringFieldVisitsData.dateOfFieldVisit = fieldVisitJson.dateOfVisit;
          this.monitoringFieldVisitsData.provience = fieldVisitJson.provience;
          this.monitoringFieldVisitData.push(this.monitoringFieldVisitsData);
          
        
          var contractJson = contractArray[i];
          this.monitoringContractTabData = new MonitoringContrctServiceClass();
          this.monitoringContractTabData.nameOfContractedCompany = contractJson.nameOfContComp;
          if (contractJson.contractValMzn != null) {
            this.monitoringContractTabData.contractVAlueMZN = (contractJson.contractValMzn).toString();
          } else {
            this.monitoringContractTabData.contractVAlueMZN = '';
          }

          this.monitoringContractTabData.organizationId = contractJson.organization;
          this.monitoringContractTabData.didContractAddendum = contractJson.didContrctAddendum;
          if (contractJson.addendumVAlMzn != null) {
            this.monitoringContractTabData.addendumVAlueMZN = (contractJson.addendumVAlMzn).toString();
          } else {
            this.monitoringContractTabData.addendumVAlueMZN = '';
          }

          this.monitoringContractTabData.otherReasonAddendum = contractJson.otherRgn;
          this.monitoringContractTabData.originalContractEndDate = contractJson.originanalContrctDt;
          this.monitoringContractTabData.endDateAfterAddendum = contractJson.endContrctDt
          if (contractJson.financialExe != null) {
            this.monitoringContractTabData.financialExecution = (contractJson.financialExe).toString();
          } else {
            this.monitoringContractTabData.financialExecution = '';
          }
          if (contractJson.financialExeRate != null) {
            this.monitoringContractTabData.financialExeRate = (contractJson.financialExeRate).toString();
          } else {
            this.monitoringContractTabData.financialExeRate = '';
          }
          if (contractJson.phyExeRate != null) {
            this.monitoringContractTabData.physicalExeRate = (contractJson.phyExeRate).toString();
          } else {
            this.monitoringContractTabData.physicalExeRate = '';
          }

          this.monitoringContractTabData.comments = contractJson.commentsPhy;
          this.monitoringContractTabData.findings = contractJson.findings;
          this.monitoringContractTabData.selectOptionForFindings = contractJson.selectOptForFinding;
          this.monitoringContractTabData.otherReason = contractJson.otherRgnFinding;
          this.monitoringContractTabData.recommendation = contractJson.recommendation;
          this.monitoringContractTabData.district = contractJson.district;
          if (contractJson.rgnForAddendum != '') {
            this.monitoringContractTabData.reasonAddendum = (contractJson.rgnForAddendum).toString();
          } else {
            this.monitoringContractTabData.reasonAddendum = contractJson.rgnForAddendum;
          }
          if (contractJson.constraint != '') {
            this.monitoringContractTabData.constraint = (contractJson.constraint).toString();
          } else {
            this.monitoringContractTabData.constraint = (contractJson.constraint);
          }
          this.monitoringContractTabData.monitoringContractId=contractJson.contractId;



          this.monitoringContarctData.push(this.monitoringContractTabData);
        }
        this.monitoringData.monitoringFieldVisitData = JSON.stringify(this.monitoringFieldVisitData);
        this.monitoringData.monitoringContractData = JSON.stringify(this.monitoringContarctData);
        /* Contract End */
        
        console.log("draft data ", JSON.stringify(this.monitoringData));
        this.saveDraftMonitoringData();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
      }
    })
  }
  autoSaveAsDraft() {
    this.monitoringData = new MonitoringCrudServiceClass();
    if(this.monitoringDraftId != null){
      this.monitoringData.monitoringId=Number.parseInt(this.monitoringDraftId);
    }else{
      this.monitoringData.monitoringId=this.monitoringDraftId;
    }
    this.monitoringData.usergroup=this.usergroup;
    this.monitoringData.projectId = this.monitoringForm.controls['projectName'].value;
    var startDate=this.monitoringForm.controls['startdate'].value;
   
    this.monitoringData.startDt=startDate;
    var endDate=this.monitoringForm.controls['enddate'].value;
    
    this.monitoringData.endDt=endDate;
    this.monitoringData.levelOfAction = this.monitoringForm.controls['levelOfAction'].value;
    if(this.monitoringForm.controls['conditions'].value != null){
      this.monitoringData.conditionOfDisbursment = this.monitoringForm.controls['conditions'].value;
    }else{
      this.monitoringData.conditionOfDisbursment = '';
    }
    

    /* physical execution Start */
    var physicalExe = new Array();
    /* Here we get all table data and store in an array */
    for (let i = 0; i < this.physicalExecutionRateArray.length; i++) {
      var PhyJson: any = {};
      var financialExecRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value;
      if(financialExecRate != null){
        financialExecRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('funds').value).toString();
      }else{
        financialExecRate='';
      }
      var dateOfFinancialExecution = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('dateOfPhysicalExecution').value;
      var physicalExeRate = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value;
      if(physicalExeRate != null){
        physicalExeRate=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('phiysicalExeRAte').value).toString();
      }else{
        physicalExeRate='';
      }
      
      var comments = ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value;
      if(comments != null){
        comments=(((this.monitoringForm.get('physicalExecutionData') as FormArray).at(i) as FormGroup).get('comments').value).toString();
      }else{
        comments='';
      }

      if (dateOfFinancialExecution != '' && dateOfFinancialExecution != null) {
        var year = this.datepipe.transform(dateOfFinancialExecution, 'yyyy');
        var month = this.datepipe.transform(dateOfFinancialExecution, 'MMM');
        var date = this.datepipe.transform(dateOfFinancialExecution, 'dd');
        dateOfFinancialExecution = date + '-' + month + '-' + year;
      }else{
        dateOfFinancialExecution=''
      }
               
      PhyJson.financialExecRate = financialExecRate;
      PhyJson.dateOfFinancialExecution = dateOfFinancialExecution;
      PhyJson.physicalExeRate = physicalExeRate;
      PhyJson.comments = comments;             
      physicalExe.push(PhyJson);
    }
    this.monitoringPhyExeData = new Array();
    for (let i = 0; i < physicalExe.length; i++) {

      var PhyJson = physicalExe[i];
      this.monitoringPhyTabDta = new MonitoringPhysicalExeServiceClass();
      this.monitoringPhyTabDta.dateOfFinancialExecution = PhyJson.dateOfFinancialExecution;
      if (PhyJson.financialExecRate != null) {
        this.monitoringPhyTabDta.financialExeRate = (PhyJson.financialExecRate).toString();
      } else {
        this.monitoringPhyTabDta.financialExeRate = '';
      }
      if (PhyJson.physicalExeRate != null) {
        this.monitoringPhyTabDta.physicalExeRate = (PhyJson.physicalExeRate).toString();
      } else {
        this.monitoringPhyTabDta.physicalExeRate = '';
      }


      this.monitoringPhyTabDta.comment = PhyJson.comments;
      this.monitoringPhyExeData.push(this.monitoringPhyTabDta);

    }
    this.monitoringData.monitoringPhyExeData = JSON.stringify(this.monitoringPhyExeData);
    /* physical execution End */

    /* Contract start */
    var contractArray = new Array();
    /* Field Visit Start */
    var fieldVisitArray=new Array();
    for (let i = 0; i < this.contractFormArray.length; i++) {
      var fieldVisitJson:any={};
      var dateOfVisit=((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('dateOfFieldVisitFinancialExecution').value;
     
      var provience =((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('province').value;
      if(provience == null){
        provience=''
      }else{
        provience=provience.toString();
      }
      if (dateOfVisit != '' && dateOfVisit !=null) {
        var yearVisit = this.datepipe.transform(dateOfVisit, 'yyyy');
        var monthVisit = this.datepipe.transform(dateOfVisit, 'MMM');
        var dateVisit = this.datepipe.transform(dateOfVisit, 'dd');
        dateOfVisit = dateVisit + '-' + monthVisit + '-' + yearVisit;
      }else{
        dateOfVisit=''
      }
      fieldVisitJson.dateOfVisit=dateOfVisit;
      fieldVisitJson.provience=provience;
      fieldVisitArray.push(fieldVisitJson);
      
      

     /* Field Visit End */

      
      var contractJson: any = {};
      var nameOfContComp = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value;
      if(nameOfContComp != null){
        nameOfContComp=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('company').value).toString();
      }else{
        nameOfContComp='';
      }
      
      var contractValMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value;
     if(contractValMzn != null){
      contractValMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractValue').value).toString();
     }else{
      contractValMzn='';
     }
     
      var organization = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value;
      if(organization != null){
        organization=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('organization').value).toString();
      }else{
        organization='';
      }

      var didContrctAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value;
      if(didContrctAddendum !=null){
        didContrctAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('contractAb').value).toString();
      }else{
        didContrctAddendum='';
      }
      
      var addendumVAlMzn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value;
      if(addendumVAlMzn != null){
        addendumVAlMzn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('abValue').value).toString();
      }else{
        addendumVAlMzn=''
      }
      
      var rgnForAddendum = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value;
      if(rgnForAddendum != null){
        rgnForAddendum=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('reasons').value).toString();
      }else{
        rgnForAddendum='';
      }
      if(rgnForAddendum.length==0){
        rgnForAddendum='';
      }
      var district = (((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('district').value);
      if(district != null){
       district= district.toString();
      }else{
        district='';
      }
     

      this.monitoringData.monitoringReasonsAddendumData = JSON.stringify(this.monitoringReasonsAddendumData);

      var otherRgn = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value;
      if(otherRgn !=null){
        otherRgn=(((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('otherReasonsforaddendum').value).toString();
      }else{
        otherRgn='';
      }
      
      var originanalContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('originalContractEndDate').value;
      if (originanalContrctDt != '' && originanalContrctDt !=null) {
        
        var originalContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
        var originalContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
        var originalContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
        originanalContrctDt = originalContractDate + '-' + originalContractMonth + '-' + originalContractYr;
      }else{
        originanalContrctDt='';
      }

      var endContrctDt = ((this.monitoringForm3.get('tableContract') as FormArray).at(i) as FormGroup).get('endDateadenda').value;
      if (endContrctDt != '' && endContractYr !=null) {
        var endContractYr = this.datepipe.transform(originanalContrctDt, 'yyyy');
        var endContractMonth = this.datepipe.transform(originanalContrctDt, 'MMM');
        var endContractDate = this.datepipe.transform(originanalContrctDt, 'dd');
        endContrctDt = endContractDate + '-' + endContractMonth + '-' + endContractYr;
      }else{
        endContrctDt=''
      }


      //Financial Performance of the Contract
      var financialExe = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value;
      if(financialExe !=null){
        financialExe=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecution').value).toString();
      }else{
        financialExe='';
      }

      var financialExeRate = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value;
      if(financialExeRate != null){
        financialExeRate=(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(i) as FormGroup).get('finExecutionRate').value).toString();
      }else{
        financialExeRate='';
      }

      //Physical Execution of the Contract
      var phyExeRate = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value;
      if(phyExeRate != null){
        phyExeRate=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('physicalRate').value).toString();
      }else{
        phyExeRate='';
      }
      
      var commentsPhy = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value;
      if(commentsPhy != null){
        commentsPhy=(((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(i) as FormGroup).get('comments').value).toString();
      }else{
        commentsPhy='';
      }

      //Finding
      var findings = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value;
      if(findings != null){
        findings=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('findings').value).toString();
      }else{
        findings='';
      }

      var selectOptForFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value;
      if(selectOptForFinding != null){
        selectOptForFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('optionFind').value).toString();
      }else{
        selectOptForFinding='';
      }
      
      var otherRgnFinding = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value;
      if(otherRgnFinding != null){
        otherRgnFinding=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('otherReason').value).toString();
      }else{
        otherRgnFinding='';
      }
      
      var recommendation = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value;
      if(recommendation != null){
        recommendation=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('recommendation').value).toString();
      }else{
        recommendation='';
      }
      
      var constraint = ((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value;
      if(constraint != null){
        constraint=(((this.monitoringForm3.get('tableFindings') as FormArray).at(i) as FormGroup).get('contraints').value);
      }else{
        constraint='';
      }
      if(constraint.length == 0){
        constraint='';
      }
      contractJson.nameOfContComp = nameOfContComp;
      contractJson.contractValMzn = contractValMzn;
      contractJson.organization = organization;
      contractJson.didContrctAddendum = didContrctAddendum;
      contractJson.addendumVAlMzn = addendumVAlMzn;
      contractJson.otherRgn = otherRgn;
      contractJson.originanalContrctDt = originanalContrctDt;
      contractJson.endContrctDt = endContrctDt;
      contractJson.financialExe = financialExe;
      contractJson.financialExeRate = financialExeRate;
      contractJson.phyExeRate = phyExeRate;
      contractJson.commentsPhy = commentsPhy;
      contractJson.findings = findings;
      contractJson.selectOptForFinding = selectOptForFinding;
      contractJson.otherRgnFinding = otherRgnFinding;
      contractJson.recommendation = recommendation;
      contractJson.rgnForAddendum = rgnForAddendum;
      contractJson.constraint = constraint;
      contractJson.district = district;
   
      contractArray.push(contractJson);
    };
    this.monitoringContarctData = new Array();
    for (let i = 0; i < contractArray.length; i++) {
      var fieldVisitJson = fieldVisitArray[i];
      this.monitoringFieldVisitsData = new MonitoringFieldVisitsServiceClass();
      this.monitoringFieldVisitsData.dateOfFieldVisit = fieldVisitJson.dateOfVisit;
      this.monitoringFieldVisitsData.provience = fieldVisitJson.provience;
      this.monitoringFieldVisitData.push(this.monitoringFieldVisitsData);
      
    
      var contractJson = contractArray[i];
      this.monitoringContractTabData = new MonitoringContrctServiceClass();
      this.monitoringContractTabData.nameOfContractedCompany = contractJson.nameOfContComp;
      if (contractJson.contractValMzn != null) {
        this.monitoringContractTabData.contractVAlueMZN = (contractJson.contractValMzn).toString();
      } else {
        this.monitoringContractTabData.contractVAlueMZN = '';
      }

      this.monitoringContractTabData.organizationId = contractJson.organization;
      this.monitoringContractTabData.didContractAddendum = contractJson.didContrctAddendum;
      if (contractJson.addendumVAlMzn != null) {
        this.monitoringContractTabData.addendumVAlueMZN = (contractJson.addendumVAlMzn).toString();
      } else {
        this.monitoringContractTabData.addendumVAlueMZN = '';
      }

      this.monitoringContractTabData.otherReasonAddendum = contractJson.otherRgn;
      this.monitoringContractTabData.originalContractEndDate = contractJson.originanalContrctDt;
      this.monitoringContractTabData.endDateAfterAddendum = contractJson.endContrctDt
      if (contractJson.financialExe != null) {
        this.monitoringContractTabData.financialExecution = (contractJson.financialExe).toString();
      } else {
        this.monitoringContractTabData.financialExecution = '';
      }
      if (contractJson.financialExeRate != null) {
        this.monitoringContractTabData.financialExeRate = (contractJson.financialExeRate).toString();
      } else {
        this.monitoringContractTabData.financialExeRate = '';
      }
      if (contractJson.phyExeRate != null) {
        this.monitoringContractTabData.physicalExeRate = (contractJson.phyExeRate).toString();
      } else {
        this.monitoringContractTabData.physicalExeRate = '';
      }

      this.monitoringContractTabData.comments = contractJson.commentsPhy;
      this.monitoringContractTabData.findings = contractJson.findings;
      this.monitoringContractTabData.selectOptionForFindings = contractJson.selectOptForFinding;
      this.monitoringContractTabData.otherReason = contractJson.otherRgnFinding;
      this.monitoringContractTabData.recommendation = contractJson.recommendation;
      this.monitoringContractTabData.district = contractJson.district;
      if (contractJson.rgnForAddendum != '') {
        this.monitoringContractTabData.reasonAddendum = (contractJson.rgnForAddendum).toString();
      } else {
        this.monitoringContractTabData.reasonAddendum = contractJson.rgnForAddendum;
      }
      if (contractJson.constraint != '') {
        this.monitoringContractTabData.constraint = (contractJson.constraint).toString();
      } else {
        this.monitoringContractTabData.constraint = (contractJson.constraint);
      }
      this.monitoringContractTabData.monitoringContractId=contractJson.contractId;



      this.monitoringContarctData.push(this.monitoringContractTabData);
    }
    this.monitoringData.monitoringFieldVisitData = JSON.stringify(this.monitoringFieldVisitData);
    this.monitoringData.monitoringContractData = JSON.stringify(this.monitoringContarctData);
    /* Contract End */
    
    console.log("draft data ", JSON.stringify(this.monitoringData));
    this.autoSaveDraftMonitoringData();
  }
  saveDraftMonitoringData() {
    this.monitoringCrudService.saveDraftMonitoringData(this.monitoringData).pipe(first()).subscribe(
      {
        next: () => {
          this.auto_save_as_draft_flag=false;
          this.getValueByLang();
          (this.browserLang=='en')? Swal.fire('Submitted successfully', '', 'success'):Swal.fire('Submetido com sucesso', '', 'success');
          /* If data will store successfully then we call this method to go to view page */
          this.goToCreateMonitoring();
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

  autoSaveDraftMonitoringData() {
    this.monitoringCrudService.saveDraftMonitoringData(this.monitoringData).pipe(first()).subscribe(
      {
        next: () => {
          this.auto_save_as_draft_flag=false;
          this.getValueByLang();
          if(this.browserLang=='en')
          Swal.fire('Monitoring Data saved as Draft successfully', '', 'success');
          else
          Swal.fire('Dados da Monitoria salvos como Rascunho com sucesso', '', 'success');
          /* If data will store successfully then we call this method to go to view page */
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

  saveMonitoringNotificationAlert(){
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='Monitoring Reference ID "'
      +"XXXXXX"
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Monitoring Reference ID "'
      +"XXXXXX"
      +'" for Budget Project "'
      +this.findBudgetProjectNameById(this.monitoringForm.controls['projectName'].value)
      +'" has been created by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-monitoring\\';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';


    notificationDetails.notificationGroup = this.usergroup;
    notificationDetails.updatedBy = this.userNameForNotificationAlert;
    notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has recorded a new monitoring visit for a Project on  " + (todayTime + '').substring(0, 24);
    notificationDetails.updatedOn = todayTime;
    this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
      console.log(data);
      // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
      this.goToViewMonitoring();
    });
  }

  updateMonitoringNotificationAlert(){
    let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='Monitoring Reference ID "'
      +this.monitoringId
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Monitoring Reference ID "'
      +this.monitoringId
      +'" for Budget Project "'
      +this.findBudgetProjectNameById(this.monitoringForm.controls['projectName'].value)
      +'" is edited by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\view-monitoring\\'+this.monitoringId;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';


    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has recorded a new monitoring visit for a Project on  " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.goToViewMonitoring();
  }

  private findBudgetProjectNameById(id:number):string{
    let projectName:string=null;
    for(let i=0;i<this.projectList.length;i++){
      if(this.projectList[i].projectId==id){
        projectName=this.projectList[i].projectTitle;
      }
    }
    return projectName;
  }

  /* If data save successfully in db then it will redirect to view page */
  goToCreateMonitoring() {
    this.auto_save_as_draft_flag=false;
    this.monitoringForm.reset();
    this.monitoringForm3.reset();
    this.contract_flag="false";
    this.hidden=true;
    this.disabledpanel=true;

    this.countContract= 0
    this.contractId=null;
    this.monitoringId=null;
    this.router.navigate(['/admin/monitoring']);
    //this.validateOnChange();
    this.getSaveAsDrfat();
    this.step=0;
   
    
  }
  clearForm(form: FormGroup) {
    form.reset();
    this.hidden = true;
    this.contract_flag = "false";
    this.disabledpanel=true;
    
    
    for(let k=this.physicalExecutionRateArray.length;k!=0;k--){
      // if(k!=0){
        this.physicalExecutionRows.splice(k, 1);
        this.physicalExecutionRateArray.removeAt(k);
      // }
      
    }
  }
  clearAllForm() {
    this.countContract= 0;
    if(this.monitoringId == null || this.monitoringDraftId ==null){
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }else{
      this.monitoringForm.reset();
      this.monitoringForm3.reset();
      this.contract_flag="false";
      this.hidden=true;
      this.disabledpanel=true;
    }
    
  }
  clearForm3(form: FormGroup) {
    form.reset();
    this.districts.reset();
    this.select_options_for_district_hdn_flag=true
    for(let index =0;index<this.contractFormArray.length;index++){
      this.contractFormArray.removeAt(index);
      this.findingFormArray.removeAt(index);
      (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(index);
      (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(index)
    }
    this.countContract=0;
  }
  onFocus(value) {
    this.monitoringForm3.controls['contractValue'].setValue(value.replace(/[^0-9.]+/g, ''));
  }
  onBlur(value, index: any) {
    value = value.split(",").join("");
    ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('contractValue').setValue(this.currencyPipe.transform(value, " "));
  }
  onBlurfinExecution(value, j) {
    value = value.split(",").join("");
    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(j) as FormGroup).get('finExecution').setValue(this.currencyPipe.transform(value, " "));
  }
  regex_CurrencyfinExecution(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }

  onFocus2(value, index: any) {
    ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setValue(value.replace(/[^0-9.]+/g, ''));
  }
  onBlur2(value, index: any) {
    value = value.split(",").join("");
    ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setValue(this.currencyPipe.transform(value, " "));
  }

  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
  }

  regex_Currency2(e, index: any) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
      (<HTMLInputElement>document.getElementById("abValue")).value.indexOf('.') < 0));
  }

  private getProjectList() {

    this.projectService.getOnBudgetProjectList().subscribe(data => {
      this.projectList = data;
      console.log("prj data ",this.projectList)
      this.filteredOptions = this.projectName.valueChanges
        .pipe(
          startWith(''),
          map(project => project ? this.filterProject(project) : this.projectList.slice())
        );
    });
    // this.projectService. getOnBudgetProjectList().subscribe(data=>{
    //   this.projectList=data;
    //   this.filteredOptions = this.projectName.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(project => project ? this.filterProject(project) : this.projectList.slice())
    //     );
    //  });
  }

  private getProvinces() {
    this.provincesService.getProvincesList().subscribe(data => {
      this.provinceList1 = data;
      for (let i = 0; i < this.provinceList1.length; i++) {
        let crtDt=this.provinceList1[i].createdOn;
        let updateDt=this.provinceList1[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.provinceList1[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.provinceList1[i].updateDifference=days_differenceForUpdate;
       }
        (this.provinceList1[i].difference)=days_difference;
      }
      this.provinceFilter = this.searchTextboxControlProvinces.valueChanges
        .pipe(
          startWith(''),
          map(name => this.filterProvince(name).sort())
        );
    });
  }
  private filterProvince(name: string) {
    return this.provinceList1.filter(province =>
      province.provinces_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  private getImplementingOrganization(list:OrganizationCrudServiceClass[]) {
    
    this.implementingOrganizationService.getImplementingOrganizationList().subscribe(data => {
      // this.implementingOrganization = data;
      console.log("org dtl :", this.organizationList)
      list.forEach(data=>{
        if(data.category.categoryNameEn !=='Donor'){
          this.implementingOrganization.push(data);
        }
      });
      console.log(" allorg dtl :", this.implementingOrganization)
      for (let i = 0; i < this.implementingOrganization.length; i++) {
        let crtDt=this.implementingOrganization[i].createdOn;
        let updateDt=this.implementingOrganization[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.implementingOrganization[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.implementingOrganization[i].updateDifference=days_differenceForUpdate;
       }
        (this.implementingOrganization[i].difference)=days_difference;
      }
      this.implementingOrganizationfilteredOption = this.organization.valueChanges
        .pipe(
          startWith(''),
          map(implementingOrganization => implementingOrganization ? this.filterorganization(implementingOrganization) : this.implementingOrganization.slice())
        );

    });
  }
  private filterorganization(name: string) {
    return this.implementingOrganization.filter(implementingOrganization =>
      implementingOrganization.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').
      toLowerCase().indexOf(name.toLowerCase()) !== -1 || implementingOrganization.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }
  private getRecommendation() {
    this.monitoringService.getRecommendationList().subscribe(data => {
      this.recommendationList = data;
      for (let i = 0; i < this.recommendationList.length; i++) {
        let crtDt=this.recommendationList[i].createdOn;
        let updateDt=this.recommendationList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.recommendationList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.recommendationList[i].updateDifference=days_differenceForUpdate;
       }
        (this.recommendationList[i].difference)=days_difference;
      }
    });
  }
  organizationList!: OrganizationCrudServiceClass[];
  private getOrganization() {
    this.organizationService.getOrganizationList().subscribe(data => {
      this.organizationList = data;
     
     this.getImplementingOrganization(this.organizationList)
    });
  }
  private getConstraint() {
    this.monitoringService.getConstraintList().subscribe(data => {
      this.constraintList = data;
      for (let i = 0; i < this.constraintList.length; i++) {
        let crtDt=this.constraintList[i].createdOn;
        let updateDt=this.constraintList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.constraintList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.constraintList[i].updateDifference=days_differenceForUpdate;
       }
        (this.constraintList[i].difference)=days_difference;
      }
      console.log("constraint lis ", this.constraintList)
    });
  }
  private getFinding() {
    this.monitoringService.getFindingList().subscribe(data => {
      this.findingList = data;
      for (let i = 0; i < this.findingList.length; i++) {
        let crtDt=this.findingList[i].createdOn;
        let updateDt=this.findingList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.findingList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.findingList[i].updateDifference=days_differenceForUpdate;
       }
        (this.findingList[i].difference)=days_difference;
      }
    });
  }
today:any;
  private getLevelOfAction() {
    this.monitoringService.getLevelOfAction().subscribe(data => {
      this.levelOfActionList = data;
      for (let i = 0; i < this.levelOfActionList.length; i++) {
        let crtDt=this.levelOfActionList[i].createdOn;
        let updateDt=this.levelOfActionList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.levelOfActionList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.levelOfActionList[i].updateDifference=days_differenceForUpdate;
       }
        (this.levelOfActionList[i].difference)=days_difference;
      }
    });
  }

  private getReasonForAddendum() {
    this.monitoringService.getReasonForAddendum().subscribe(data => {
      this.reasonForAddendumList = data;
      for (let i = 0; i < this.reasonForAddendumList.length; i++) {
        let crtDt=this.reasonForAddendumList[i].createdOn;
        let updateDt=this.reasonForAddendumList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.reasonForAddendumList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.reasonForAddendumList[i].updateDifference=days_differenceForUpdate;
       }
        (this.reasonForAddendumList[i].difference)=days_difference;
      }

    });
  }
  private getOptionFinding(index: any, browserLang: any) {

    var findingId = ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('findings').value;
    this.monitoringService.getOptionByFindingId(findingId).subscribe(data => {
      this.optionFinding = data;
      for (let i = 0; i < this.optionFinding.length; i++) {
        let crtDt=this.optionFinding[i].createdOn;
        let updateDt=this.optionFinding[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.optionFinding[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.optionFinding[i].updateDifference=days_differenceForUpdate;
       }
        (this.optionFinding[i].difference)=days_difference;
      }
      console.log("Finding options : ",this.optionFinding);
      this.optionFindingAllData[index] = ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup)
        .get('searchoptionFind').valueChanges
        .pipe(
          startWith(''),
          map(name => name ? this.filterOption(name) : this.optionFinding.slice())
        );
    });

  }
  private filterOption(name: string) {
    if(this.browserLang == 'en'){
      return this.optionFinding.filter(optFindData =>
        optFindData.optionFindingNameEn.indexOf(name) !== -1);
    }
    else{
      return this.optionFinding.filter(optFindData =>
        optFindData.optionFindingNamePt.indexOf(name) !== -1);
    }
    
  }

  get annualBudgetFormArray(): FormArray {
    return this.monitoringForm3.get('annualbudget') as FormArray;
  }
  get dateFormArray(): FormArray {
    return this.monitoringForm3.get('tableDatainancialPerformance') as FormArray;
  }
  get phisycalFormArray(): FormArray {
    return this.monitoringForm3.get('tableDataphysicalExecution') as FormArray;
  }
  get contractFormArray(): FormArray {
    return this.monitoringForm3.get('tableContract') as FormArray;
  }
  get phisicalFormArray(): FormArray {
    return this.monitoringForm3.get('tableDataphysicalExecution') as FormArray;
  }
  get findingFormArray(): FormArray {
    return this.monitoringForm3.get('tableFindings') as FormArray;
  }

  valueaddInSecodExp() {
    let lastIndex = this.dateFormArray.length - 1;
    let lastIndexPhisycal = this.phisycalFormArray.length - 1;
    ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').patchValue(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').value);
    ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').patchValue(((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').value);

  }
  validateOtherValue() {
    let lastIndex = this.dateFormArray.length - 1;
    let lastIndexPhisycal = this.phisycalFormArray.length - 1;
    let date = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').value;
    let provience = ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').value;

    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(date);
    ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').patchValue(provience);
  }

  addRow() {
    
    let dovisit = this.monitoringForm3.value.dovisit;
    let provience = this.monitoringForm3.value.province;
    let district = this.districts.value;
this.getValueByLang()
    if (dovisit == null || dovisit == '' || dovisit == undefined) {
      Swal.fire({
        title:(this.browserLang=='en')? 'Kindly choose a Date.':'Por favor, escolha uma data',
        confirmButtonText: `OK`,
      })
    }
    else if (provience == null || provience == '' || provience == undefined) {
      Swal.fire({
        title: (this.browserLang=='en')?'Please fill at least a Province.':'Por favor, preencha pelo menos uma Província',
        confirmButtonText: `OK`,
      })
    }
    else {

      if (district == null || district == '' || district == undefined) {
        this.addItem();
        this.addExecutionItem();
        this.addContract();
        this.addFinding();

        let lastIndex = this.dateFormArray.length - 1;
        let lastIndexPhisycal = this.phisycalFormArray.length - 1;
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').disable();
        ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').disable();
        ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').disable();
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
        ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').patchValue(this.monitoringForm3.value.dovisit);
        ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);

        //contract table
        let contarctLength = this.contractFormArray.length - 1;
        ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
        ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('province').disable();
        ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
        ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
        ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('district').patchValue('');

        //Finding Table

        let findingLength = this.findingFormArray.length - 1;
        ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
        ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('province').disable();
        ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
        ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('finExecutionRate').disable();

        ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('districts').patchValue('');
        ((this.monitoringForm3.get('tableFindings') as FormArray).at(contarctLength) as FormGroup).get('districts').patchValue('');

        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('districts').patchValue('');
      }


      else {
        for (let i = 0; i < district.length; i++) {

          this.addItem();
          this.addExecutionItem();
          this.addContract();
          this.addFinding();
          let lastIndex = this.dateFormArray.length - 1;
          let lastIndexPhisycal = this.phisycalFormArray.length - 1;
          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').disable();
          ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').disable();
          ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').disable();
          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
          ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('dateOfFieldVisitPhysicalExecution').patchValue(this.monitoringForm3.value.dovisit);
          ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
          ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(lastIndexPhisycal) as FormGroup).get('districts').patchValue(district[i]);
          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('districts').patchValue(district[i]);

          //contract table
          let contarctLength = this.contractFormArray.length - 1;
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('province').disable();
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('district').disable();
          ((this.monitoringForm3.get('tableContract') as FormArray).at(contarctLength) as FormGroup).get('district').patchValue(district[i]);

          //Finding Table

          let findingLength = this.findingFormArray.length - 1;
          ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').disable();
          ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('province').disable();
          ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.monitoringForm3.value.dovisit);
          ((this.monitoringForm3.get('tableFindings') as FormArray).at(findingLength) as FormGroup).get('province').patchValue(this.monitoringForm3.value.province);
          ((this.monitoringForm3.get('tableFindings') as FormArray).at(contarctLength) as FormGroup).get('districts').patchValue(district[i]);

          ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(lastIndex) as FormGroup).get('finExecutionRate').disable();
        }
      }
    }
  }
  getFindingData() {
    this.browserLang=localStorage.getItem("browserLang");
   console.log("browserLang ",this.browserLang)
  }
  getOptFindingDataByLang(){
    this.browserLang=localStorage.getItem("browserLang");
  }
  getOptionFindingData() {
    this.browserLang = localStorage.getItem("browserLang");
    this.getOptionFinding(this.index, this.browserLang);
  }

  checkReason(index: any) {
    this.getValueByLang()
    let reason = ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('reasons').value;
    let reasonAddendumNm='Increase in the price paid for the good or service'
    if (reason != '' && reason != null && reason != undefined) {
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('originalContractEndDate').enable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('endDateadenda').enable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('otherReasonsforaddendum').enable();
   
     for(let j=0;j<reason.length;j++){
      for (let i = 0; i < this.reasonForAddendumList.length; i++) {
        if(reason[j] ==this.reasonForAddendumList[i].reasonForAddendumId){
          if( (reasonAddendumNm==this.reasonForAddendumList[i].reasonForAddendumNameEn) || 
          ('Aumento do preço pago pelo bem ou serviço')==this.reasonForAddendumList[i].reasonForAddendumNamePt)
          {
            this.addendum_value_mandatory_flag = true;
            this.validateContract(index);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setValidators([Validators.required]);//setting validation
            ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setErrors({ 'required': true });//error message
            ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').updateValueAndValidity();//update validation
      
          }
            
          else{
            ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').clearValidators();//setting validation
            // ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setErrors({ 'required': false });//error message
            ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').updateValueAndValidity();//update validation
            this.addendum_value_mandatory_flag = false;
          }
          
        }
      }
    }
    }
    if (reason == ''  || reason == null) {
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('originalContractEndDate').disable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('endDateadenda').disable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('otherReasonsforaddendum').disable();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('otherReasonsforaddendum').reset();
      this.addendum_value_mandatory_flag = false;
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').clearValidators();//setting validation
      // ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').setErrors({ 'required': false });//error message
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').updateValueAndValidity();//update validation
     
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('originalContractEndDate').reset();
      ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('endDateadenda').reset();
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

  private getAllDistrict(){
    this.districtsService.getAllDistrictURL().subscribe(data => {
      this.districtList = data;
      
    });
  }
  private getDistricts() {
    var provincesId = this.monitoringForm3.value.province;
    this.districtsService.getDistrictByProvinceId(provincesId).subscribe(data => {
      this.district = data;
      console.log("this.district  ",this.district )
      for (let i = 0; i < this.district.length; i++) {
        let crtDt=this.district[i].createdOn;
        let updateDt=this.district[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       this.district[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.district[i].updateDifference=days_differenceForUpdate;
       }
        (this.district[i].difference)=days_difference;
      }
      
      if (this.district.length == 0) {
        this.select_options_for_district_hdn_flag = true
      } else {
        this.select_options_for_district_hdn_flag = false
      }
    });
  }
  showDistrict() {
    let projectType = this.monitoringForm3.value.province;
    this.getDistricts();

  }
  selectedValuesProvinces = [];
  selectedprovincename: String[] = [];
  selectionChangeProvinces(event) {

    let projectType = this.monitoringForm3.value.province;

    for (let i = 0; i < projectType.length; i++) {
      if (projectType[i] === 0) {
        this.select_options_for_district_hdn_flag = true;
      }
    }
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValuesProvinces.indexOf(event.source.value);
      this.selectedValuesProvinces.splice(index, 1);
      this.selectedprovincename.splice(index, 1);
    }
  }

  provname(provId) {
    for (let i = 0; i < this.provinceList1.length; i++) {
      if (provId === this.provinceList1[i].provinces_id)
        this.provName = this.provinceList1[i].provinces_name;
    }
    return this.provName;

  }
  phyExecutionRate: any = 0;
  findPhysicalExecutionRAte(index: any) {
    let date = (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(index) as FormGroup).get('dateOfPhysicalExecution').value).toString();
    let dateSplit = date.split(" ");
    let year = dateSplit[3];
    let allocatedAnnualBudget = 0;
    let annualBudgetExecuted = 0;
    for (let i = 0; i < ELEMENT_DATA.length; i++) {
      if (year >= ELEMENT_DATA[i].year) {
        allocatedAnnualBudget = allocatedAnnualBudget + ELEMENT_DATA[i].allocatedBudjet;
        annualBudgetExecuted = annualBudgetExecuted + ELEMENT_DATA[i].budjetexecuted;
      }
    }

    this.phyExecutionRate = (annualBudgetExecuted / allocatedAnnualBudget) * 100;
    ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(index) as FormGroup).get('funds').patchValue(0.23);

  }

  setFinancialExecRate(index: any) {
    this.getValueByLang()
    let financialExecution = ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(index) as FormGroup).get('finExecution').value;
    let contractValue = ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('contractValue').value;
    let addendumValue = ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').value;

    if (contractValue == '' || contractValue == null || contractValue == undefined) {
      contractValue = 0;
    }
    if (addendumValue == '' || addendumValue == null || addendumValue == undefined) {
      addendumValue = 0
    }
    if (contractValue == 0 && addendumValue == 0) {

      ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(index) as FormGroup).get('finExecutionRate').reset();
      if(this.browserLang=='en')
      Swal.fire("Contract value or Addendum value cannot be found so Financial Execution Rate cannot be calculated.")
      else
      Swal.fire("O valor do Contrato ou o valor da Adenda não foram encontrados. A Taxa de Execução Financeira não pode ser calculada.")
    }
    if (financialExecution != '') {
      if (addendumValue != '') {
        addendumValue = Number.parseFloat(addendumValue.replaceAll(",", ""));
      }
      if (contractValue != '') {
        contractValue = Number.parseFloat(contractValue.replaceAll(",", ""));
      }
      let contractAndAddendum = addendumValue + contractValue;

      let financialExecutionCal = (Number.parseFloat(financialExecution.replaceAll(",", "")) * 100);
      let finExe = financialExecution.replaceAll(",", "");
      if (contractAndAddendum < finExe) {
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(index) as FormGroup).get('finExecutionRate').reset();
        if(this.browserLang=='en')
        Swal.fire("The sum of Contract and Addendum values is less than the financial execution. Financial Execution Rate cannot be calculated.")
else
Swal.fire("A soma dos valores do Contrato e da Adenda é menor do que a execução financeira. A taxa de execução financeira não pode ser calculada.")
      } else {
        this.financialExecRate = (financialExecutionCal / contractAndAddendum);
        ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(index) as FormGroup).get('finExecutionRate').patchValue(parseFloat(this.financialExecRate).toFixed(2));

      }
    }
  }
  chkContractAddendum(index: any) {
    this.getValueByLang()
    let contractValue = ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('contractValue').value;
    let addendumValue = ((this.monitoringForm3.get('tableContract') as FormArray).at(index) as FormGroup).get('abValue').value;
    if (contractValue == '' || contractValue == null || contractValue == undefined) {
      contractValue = 0;
    }
    if (addendumValue == '' || addendumValue == null || addendumValue == undefined) {
      addendumValue = 0
    }
    if (contractValue == 0 && addendumValue == 0) {

      ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(index) as FormGroup).get('finExecutionRate').reset();
      if(this.browserLang=='en')
      Swal.fire("Contract Value or Addendum Value cannot be found. Financial Execution Rate cannot be calculated.")
      else
      Swal.fire("O valor do Contrato ou o Valor da Adenda não foram encontrados. A Taxa de Execução Financeira não pode ser calculada.")
    }
  }

  openOptionSearch(e, index) {

    ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('searchoptionFind').patchValue('');
  }
  clearOptionSearch(e, index) {
    event.stopPropagation();
    ((this.monitoringForm3.get('tableFindings') as FormArray).at(index) as FormGroup).get('searchoptionFind').patchValue('');
  }
  findFinancialRate(index: any) {
    ((this.monitoringForm.get('physicalExecutionData') as FormArray).at(index) as FormGroup).get('funds').patchValue(28.2);

  }
  draftfilteredOption: Observable<any[]>;
  searchDraft= new FormControl('');
  /* Here we call service to get all save as draft values that is present in db */
  private getSaveAsDrfat() {
    this.usergroup = localStorage.getItem('usergroup');
    
    this.monitoringCrudService.getSaveAsDraftMonitoringData(this.usergroup).subscribe(data => {
      this.saveAsDraftList = data;
      for(let k=0;k<this.saveAsDraftList.length;k++){
        if(this.saveAsDraftList[k].projectId!=null){
          for(let i=0;i<this.projectList.length;i++){
            if(this.saveAsDraftList[k].projectId == this.projectList[i].idProject){
              this.saveAsDraftList[k].budgetPrj=this.projectList[i].projectTitle
              break;
            }else{
              this.saveAsDraftList[k].budgetPrj==''
            }
          }
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
      (data.budgetPrj==undefined)?'':data.budgetPrj.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().indexOf(name.toLowerCase()) !== -1 );
  }
  chkDraft(){
    this.getValueByLang()
    if(this.saveAsDraftList.length ==0){
      if(this.browserLang=='en')
      Swal.fire('No Data Present Inside View Save As Draft', '', 'error')
      else
      Swal.fire('Nenhum dado presente dentro da Janela, Salvar Como Rascunho','','error')
    }
  }
  draftValue(){
    this.auto_save_as_draft_flag=false;
    let id=this.monitoringForm.controls['saveAsDraft'].value;
   
    if(this.monitoringId !=null){
      this.monitoringForm.reset();
      this.monitoringForm3.reset();
    }
   
    this.monitoringCrudService.getDraftByMonitoringId(id).subscribe(data => {
    this.editMonitoringData = data;
    this.monitoringDraftId=id;
    /* Physical Execution Rate All row remove strat*/
    for (let j = 0; j < this.physicalExecutionRateArray.length; j++) {
      this.physicalExecutionRows.splice(j, 1);
      this.physicalExecutionRateArray.removeAt(j);
    }
    if(this.physicalExecutionRateArray.length !=0){
      this.physicalExecutionRows.splice(0, 1);
      this.physicalExecutionRateArray.removeAt(0);
    }
    /* Physical Execution Rate All row remove end*/
    /* Remove All Row from contract table Start*/
    let contractFormArray = this.contractFormArray.length;
    for (let l = 0; l < contractFormArray; l++) {
      this.contractFormArray.removeAt(l);
      this.findingFormArray.removeAt(l);
      (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(l);
      (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(l)
    }
    this.contractFormArray.removeAt(0);
    this.findingFormArray.removeAt(0);
    (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(0);
    (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(0)
    /* Remove All Row from contract table end*/

    for (let i = 0; i < this.editMonitoringData.length; i++) {
      this.monitoringForm.controls.saveAsDraft.setValue(id);
      if((this.editMonitoringData[i].projectId) !=null){
        this.monitoringForm.controls.projectName.setValue((this.editMonitoringData[i].projectId));
        this.monitoringForm.controls.startdate.setValue(this.editMonitoringData[i].startDt);
            this.monitoringForm.controls.enddate.setValue(this.editMonitoringData[i].endDt)
      }else{
        this.monitoringForm.controls.projectName.setValue('');
        this.hidden=true;
      }
      
      this.monitoringForm.controls['conditions'].patchValue(this.editMonitoringData[i].conditionOfDisbursment);
      this.monitoringForm.controls['levelOfAction'].patchValue(this.editMonitoringData[i].levelOfAction);
      let physicalExecindex=0;
      /* Physical Execution Rate add row nd patch strat*/
      
      let physicalExecutionRateSize = this.editMonitoringData[i].monitoringPhyAllData.length;
      if(physicalExecutionRateSize > 0){
      for (let k = 0; k < physicalExecutionRateSize; k++) {
        this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
        const row = this.fb.group({
          dateOfPhysicalExecution: [{ value: '', disabled: false }],
          funds: [{ value: '', disabled: true }],
          phiysicalExeRAte: [{ value: '', disabled: false }],
          comments: [''],
        });
        
      if(this.editMonitoringData[i].monitoringPhyAllData[k].status != 'InActive'){
        this.physicalExecutionRateArray.push(row);
        (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('dateOfPhysicalExecution').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].dateOfFinancialExecution));
        (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('funds').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].financialExeRate));
        (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('phiysicalExeRAte').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].physicalExeRate));
        (((this.monitoringForm.get('physicalExecutionData') as FormArray).at(physicalExecindex) as FormGroup).get('comments').setValue(this.editMonitoringData[i].monitoringPhyAllData[k].comment));
        this.monitoringPhyExeRAteId.push(this.editMonitoringData[i].monitoringPhyAllData[k].monitoringPhysicalId);
        physicalExecindex=physicalExecindex+1;
      }
      }
    }else{
      this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });
        const row = this.fb.group({
          dateOfPhysicalExecution: [{ value: '', disabled: false }],
          funds: [{ value: '', disabled: true }],
          phiysicalExeRAte: [{ value: '', disabled: false }],
          comments: [''],
        });
        this.physicalExecutionRateArray.push(row);
    }
      /* Physical Execution Rate add row nd patch end*/

      /* field visit start*/
      for (let k = 0; k < this.editMonitoringData[i].monitoringFieldVisitAllData.length; k++) {
       for (let l = 0; l < this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData.length; l++) {
          if(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience !=null){
            this.monitoringForm3.controls.dovisit.clearValidators();//setting validation
            this.monitoringForm3.controls.dovisit.setErrors({ 'required': false });//error message
            this.monitoringForm3.controls.dovisit.updateValueAndValidity();//update validation
    
            this.monitoringForm3.controls.province.clearValidators();//setting validation
            this.monitoringForm3.controls.province.setErrors({ 'required': false });//error message
            this.monitoringForm3.controls.province.updateValueAndValidity();//update validation
            this.select_options_for_district_hdn_flag = false;
            this.getDistricts();      
          /* field visit end*/
         
          /* Value patch in Contract table start */
          if(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData.length >0){
            if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].status == 'Active') {
              // this.addRow();
              this.addItem();
              this.addExecutionItem();
              this.addContract();
              this.addFinding();
              this.validateOnChange();
            this.getCurrency();
            this.select_options_for_district_hdn_flag = false;
              ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
              ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('district').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('districts').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].district);

              ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitPhysicalExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
              ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
               ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
               ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('dateOfFieldVisitFinancialExecution').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].dateOfFieldVisit);
              ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('province').patchValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].provience);
                              
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('company').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].nameOfContractedCompany);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('contractValue').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].contractVAlueMZN, " ")));
            if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].organizationId != null) {
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('organization').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].organizationId).toString());
            } else {
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('organization').setValue('');
            }
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('contractAb').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].didContractAddendum);

            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('abValue').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].addendumVAlueMZN, " ")));
           
            var arrRgnForAddendum = [];
            for (let b = 0; b < (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].reasonForAddendumAllData).length; b++) {
              var rgnForAddendum = (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].reasonForAddendumAllData[b].reasonForAddendum);
              arrRgnForAddendum.push(rgnForAddendum);
              ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('reasons').setValue(arrRgnForAddendum);
            }
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('otherReasonsforaddendum').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].otherReasonAddendum);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('originalContractEndDate').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].originalContractEndDate);
            ((this.monitoringForm3.get('tableContract') as FormArray).at(this.indexContract) as FormGroup).get('endDateadenda').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].endDateAfterAddendum);
            this.validateContract(this.indexContract);
            this.checkReason(this.indexContract);
            /* Value patch in Contract table end */
            /* Value patch in Financial Performance of the Contract strat*/
            ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('finExecution').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].financialExecution, " ")));
            ((this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).at(this.indexContract) as FormGroup).get('finExecutionRate').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].financialExeRate, " ")));
            /* Value patch in Financial Performance of the Contract end*/

            /* Value patch in Physical Execution of the Contract strat*/
            ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('physicalRate').setValue((this.currencyPipe.transform(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].physicalExeRate, " ")));
            ((this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).at(this.indexContract) as FormGroup).get('comments').setValue(this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].comments);
             /* Value patch in Physical Execution of the Contract end*/

              /* Value patch in Findings strat*/
              if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].findings != null) {
                ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('findings').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].findings).toString());
              }
              this.getOptionFinding(this.indexContract, 'en');
              if (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].selectOptionForFindings != null) {
                ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('optionFind').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].selectOptionForFindings).toString());
              }
              ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('otherReason').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].otherReason));
              if((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].recommendation) != null)
              {
                ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('recommendation').setValue((this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].recommendation).toString());
              }else{
                ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('recommendation').setValue('');

              }
              var arrconstraint = [];
              for (let a = 0; a < (this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].constraint).length; a++) {
                var constraint = this.editMonitoringData[i].monitoringFieldVisitAllData[k].monitoringContrctData[l].constraint[a].constraintMasterId;
                
                arrconstraint.push(constraint);
                ((this.monitoringForm3.get('tableFindings') as FormArray).at(this.indexContract) as FormGroup).get('contraints').setValue(arrconstraint);
              }
              this.FindingsChangeAction(this.indexContract);
              /* Value patch in Findings end*/

            this.indexContract = this.indexContract + 1;
          }
        }else{
            this.addItem();
            this.addExecutionItem();
            this.addContract();
            this.addFinding();
          }
          this.countContract=2;
          }else{
            this.countContract=0;
            this.select_options_for_district_hdn_flag=true;
            this.monitoringForm3.controls.dovisit.setValidators([Validators.required]);//setting validation
            this.monitoringForm3.controls.dovisit.setErrors({ 'required': true });//error message
            this.monitoringForm3.controls.dovisit.updateValueAndValidity();//update validation
    
            this.monitoringForm3.controls.province.setValidators([Validators.required]);//setting validation
            this.monitoringForm3.controls.province.setErrors({'required': true });//error message
            this.monitoringForm3.controls.province.updateValueAndValidity();//update validation
            
          }
        }
        }
      }
    
    
    this.validateOnChange();
    this.getCurrency();
  }
  ,
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
ngOnDestroy(){
  if(this.auto_save_as_draft_flag==true){
    this.autoSaveAsDraft();
  }
}
getRecommendationByLang(){
  this.browserLang = localStorage.getItem("browserLang");
}
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
}
enableUploadBtn(){
  let refNm=this.monitoringForm.controls.projectName.value;
  for(let i=0;i<this.projectList.length;i++){
    if(refNm==this.projectList[i].idProject){
      refNm=this.projectList[i].projectTitle
      break;
    }
  }
  if(refNm != null || refNm!='')
  localStorage.setItem("monitoringRefNM", refNm);
  else
  localStorage.setItem("monitoringRefNM", null);
}
  addToUploadDocLocalVar(budjProjId:number){
    let edtRefName:any=null;
    this.projectService.getOnBudgetProjectList().toPromise().then(data=>{
      this.projectList = data;
          console.log("prj data ",this.projectList)
          this.filteredOptions = this.projectName.valueChanges
            .pipe(
              startWith(''),
              map(project => project ? this.filterProject(project) : this.projectList.slice())
            );
            for(let z=0;z<this.projectList.length;z++){
              if(budjProjId==this.projectList[z].idProject){
                edtRefName=this.projectList[z].projectTitle
                break;
              }}
        });
   
   
    localStorage.setItem("monitoringRefNM", edtRefName);
  }
}
export class Monitoring {
  company: string;
  contractValue: string;
  organization: string;
  performance: string;
  contractAb: string;
  abValue: string;
  reasons: string;
  findings: string;
  optionFind: string;
  otherReason: string;
  contraints: string;
  recommendation: string;
}

export interface AmountData {
  finagr: any;
  year: number;
  associatedFunding: string;
  donor: string;
  allocatedBudjet: number;
  disbursedBudjet: number;
  budjetexecuted: number;

}

const ELEMENT_DATA: AmountData[] = [
  { finagr: "fin - 002", year: 2021, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 88512340.43, disbursedBudjet: 1202041.70, budjetexecuted: 1121 },
  { finagr: "fin - 001", year: 2019, associatedFunding: 'World Bank', donor: 'World Bank', allocatedBudjet: 294731451.00, disbursedBudjet: 4002600, budjetexecuted: 1121 },
  { finagr: "fin - 004", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 824464.71, disbursedBudjet: 11196.64, budjetexecuted: 1121 },
  { finagr: "fin - 002", year: 2019, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 514237300.61, disbursedBudjet: 6983598.84, budjetexecuted: 1121 },
  { finagr: "fin - 003", year: 2018, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 796067985.00, disbursedBudjet: 10811000.00, budjetexecuted: 1121 },
  { finagr: "fin - 007", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 159295393.17, disbursedBudjet: 2163310.83, budjetexecuted: 1121 },
  { finagr: "fin - 005", year: 2018, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 828247245.84, disbursedBudjet: 11248010.40, budjetexecuted: 1121 },
  { finagr: "fin - 008", year: 2019, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 6622391.65, disbursedBudjet: 89935.38, budjetexecuted: 1121 },
  { finagr: "fin - 006", year: 2021, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 19304659.74, disbursedBudjet: 262236.06, budjetexecuted: 1121 },
  { finagr: "fin - 006", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 2070475650.22, disbursedBudjet: 28118091.28, budjetexecuted: 1121 },
];


