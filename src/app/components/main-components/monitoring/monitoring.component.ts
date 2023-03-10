// Business LOgic TS file Monitoring Component
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Project } from '../../../Service-Class/project';
import { ProjectService } from '../../../Service/project.service';
import { Provinces } from '../../../Service-Class/provinces';
import { ProvincesService } from '../../../Service/provinces.service';
import { ThisReceiver } from '@angular/compiler';
import { ImplementingOrganization } from '../../../Service-Class/implementing-organization';
import { ImplementingOrganizationService } from '../../../Service/implementing-organization.service';
import { MonitoringClass } from '../../../Service-Class/monitoring-class';
import { MonitoringService } from '../../../Service/monitoring.service';

import monitoringData from '../../../data/monitoring-data.json';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MonitoringDocumentUploadComponent } from '../../document-repository/upload-document/monitoring-document-upload/monitoring-document-upload.component';
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
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  })




export class MonitoringComponent implements OnInit {
  // @ViewChild(MatSort) sort: MatSort;
  usergroup:any;
  @ViewChild(MatPaginator, {static:false}) paginator3!: MatPaginator;
  browserLang:any;
date=new FormControl(new Date());

    @ViewChild(MatSort, { static: false }) sort: MatSort;
  public monitoringForm!: FormGroup;
  public monitoringForm2!: FormGroup;
  public monitoringForm3!: FormGroup;
  flagProjectName: string;
  startdate!:Date;
  enddate!:Date;
  budgetMzn!:number;
  levelOfAction!:string;
  strategicPriorityPQG!:string;
  strategicObjectivePQG!:string;
  projectName = new FormControl('', [Validators.required]);
  options = ['Mozambique Infrastructure Project', 'Beira Express Way', 'Maputo smart City'];//: string[];
  filteredOptions: Observable<any[]>;
  displayedColumnsDisbursement: string[] = ['edit','finagr','year', 'associatedFunding', 'donor', 'allocatedBudjet', 'disbursedBudjet', 'budjetexecuted'];
  public projectList:Project[];
  provinceList1!:Provinces[];
  implementingOrganization:ImplementingOrganization[];
  recommendationList:MonitoringClass[];
  findingList:MonitoringClass[];
  optionFinding:MonitoringClass[];
  dataSource = new MatTableDataSource<AmountData>(ELEMENT_DATA);

  // dataSource1 = new MatTableDataSource<AmountData>(ELEMENT_DATA1);

  // dataSource2 = new MatTableDataSource<AmountData>(ELEMENT_DATA2);


  num: any;
  funds:any;
  tabClick(index: number) {
    this.num = index;
  }
  checked = false;
  indeterminate = false;
  terrainVisit_flag = "false";
  contract_flag = "false";
  mandatory_flag = "false";
  addendum_value_mandatory_flag=false;
  hdn_flag:any;
  hdn_flag1:any;
  select_options_for_finding_hdn_flag=true;
  other_reasons_hdn_flag=true;

  // labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  //dateSelected =new FormControl(); //.setValue(moment("12/02/2021", "DD/MM/YYYY"));
  headers = ["Date Of Field Visit", "Province", "Financial Execution", "Financial Execution Rate"];
  donorOptions: string[] = [ 'Austria','Belgium','Denmark','France','Germany','Italy','Netherlands','Norway',
'Portugal','Sweden','Switzerland','United Kingdom','Finland','Iceland','Ireland','Luxembourg','Greece','Spain','Slovenia','Czech Republic',
'Slovak Republic','Hungary','Poland','Canada','United States','Japan','Korea','Australia','New Zealand','EU Institutions','Nordic Development Fund',
'UNEP','Global Environment Facility','Montreal Protocol','International Bank for Reconstruction and Development','Multilateral Investment Guarantee Agency',
'International Finance Corporation','International Development Association','Caribbean Development Bank','International Monetary Fund','Inter-American Development Bank',
'African Development Bank','African Development Fund','Asian Development Bank','Arab Fund(AFESD)','UN Peacebuilding Fund','Council of Europe',
'World Health Organisation','Food and Agriculture Organisation','International Labour Organisation','International Atomic Energy Agency','UNECE',
'OPEC Fund for International Development','OAPEC','Arab Bank for Economic Development in Africa','Special Arab Aid Fund for Africa',
'IMF Trust Fund','IMF(Concessional Trust Funds)','UNDP','UNTA','UNICEF','UNRWA','WFP','UNHCR','UNAIDS','UNFPA','Islamic Development Bank',
'OSCE','Islamic Monetary Fund','Arab Fund for Technical Assistance to African and Arab Countries','Black Sea Trade & Development Bank','GODE',
'Other Arab Agencies','IFAD','European Bank for Reconstruction and Development','UN AGENCIES','Global Partnership for Education',
'Climate Investment Funds','Adaptation Fund','Council of Europe Development Bank','Private Infrastructure Development Group',
'Development Bank of Latin America','Green Climate Fund','Credit Guarantee and Investment Facility','Global Energy Efficiency and Renewable Energy Fund','IDB Invest',
'Central Emergency Response Fund','World Tourism Organisation','Asian Infrastructure Investment Bank','Center of Excellence in Finance',
'International Investment Bank','UN Institute for Disarmament Research','Global Alliance for Vaccines and Immunization',
'Global Fund','Global Green Growth Institute','Cyprus','Malta','Turkey','Croatia','Liechtenstein','Bulgaria',
'Romania','Estonia','Latvia','Lithuania','Russia','Algeria','Libya','Mexico','Iraq','Israel','Kuwait','Qatar','Saudi Arabia',
'United Arab Emirates','Azerbaijan','Kazakhstan','Chinese Taipei','Thailand','Timor-Leste',
'Bill & Melinda Gates Foundation','Dutch Postcode Lottery','Swedish Postcode Lottery',"People's Postcode Lottery",
'MetLife Foundation','MasterCard Foundation','Grameen Cr??dit Agricole Foundation','IKEA Foundation','Bernard van Leer Foundation','MAVA Foundation',
'Oak Foundation','H&M Foundation','Laudes Foundation','Charity Projects Ltd(Comic Relief)',"Children's Investment Fund Foundation",
'Gatsby Charitable Foundation','Conrad N. Hilton Foundation','David & Lucile Packard Foundation','John D. & Catherine T. MacArthur Foundation','Carnegie Corporation of New York',
'Michael & Susan Dell Foundation','Omidyar Network Fund, Inc.','Rockefeller Foundation','William & Flora Hewlett Foundation','Arcus Foundation',
'Gordon and Betty Moore Foundation','Ford Foundation','Wellcome Trust','UBS Optimus Foundation','World Diabetes Foundation','McKnight Foundation',
'Citi Foundation','LEGO Foundation','Norwegian Postcode Lottery','BBVA Microfinance Foundation','Jacobs Foundation',
'Arcadia Fund','Margaret A. Cargill Foundation','La Caixa Banking Foundation'
];
donorfilter!: Observable<string[]>;
private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
checkLength1(e, input) {

  const keyValue = +e.key;
  const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
  let current: string = input.value;
  const position = e.target.selectionStart;
  const next: string = [current.slice(0, position), e.key == 'Decimal' ? '.' : e.key, current.slice(position)].join('');
  // if (next && !String(next).match(this.regex)) {

  //  e.preventDefault();
  // }
if(+newValue > 100)
{

  e.preventDefault();
}

}



openDialog() {
  const dialogRef = this.dialog.open(DialogBoxComponent, { disableClose: true });

  dialogRef.afterClosed().subscribe(result => {
    this.router.navigate(['organization']);
    console.log(`Dialog result: ${result}`);
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

  executionHeaders = ["Date Of Field Visit", "Province", "Physical Execution Rate"];
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

  addExecutionTableFlag:any=false;
  public addExecutionItem(): void {
    this.addExecutionTableFlag=true;
    // this.executionRows.push({ "Date Of Field Visit": "", "Province": "", "Physical Execution Rate": "" });
    const row = this.fb.group({
      dateOfFieldVisitPhysicalExecution: [''],
    province:[''],
    physicalRate:[''],
    status:['new']

});

(this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).push(row);
  }

  deleteExecutionRows(index:number) {
   // console.log("index "+index);
   // const index = this.executionRows.indexOf(d);
   (this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).removeAt(index);
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
  deleteDisbursements(d) {
    //console.log(12);
    const index = this.listofdisbursementsRows.indexOf(d);
    this.listofdisbursementsRows.splice(index, 1);
  }

  addLandVisitTableFlag:any=false;
  public addItem(): void {
    console.log("this.monitoringForm3.get('tableDatainancialPerformance')",this.monitoringForm3.get('tableDatainancialPerformance'));
    //let dateSelected = new FormControl('');
     this.addLandVisitTableFlag=true;
    //this.rows.push({ "Date Of Land Visit In The Province": dateSelected.setValue(''), "Province Of The Land Visit": "", "Financial Execution": "", "Financial Execution Rate": "" });
    // this.rows.push({ "Date Of Field Visit": "", "Province": "", "Financial Execution": "", "Financial Execution Rate": "" });

    const row = this.fb.group({
      'dateOfFieldVisitFinancialExecution': [''],
    'province':[''],
    'finExecution':[''],
    'finExecutionRate':[''],
    'status':['new']
});

(this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).push(row);

}
  deleteRows(index:number) {
    //console.log(12);
    console.log("index " +index);
    //const index = this.rows.indexOf(d);
    (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).removeAt(index);
  }

  physicalExecutionHeaders = ["Date of Physical Execution", "Physical Execution Rate"];
  physicalExecutionRows = [
    {
      "Date of Physical Execution": "",
      "Physical Execution Rate": ""
    }];
    get physicalExecutionRateArray():FormArray {
      return this.monitoringForm.get('physicalExecutionData') as FormArray;
    }
  public addPhysicalExecutionHeaders(): void {

    this.physicalExecutionRows.push({ "Date of Physical Execution": "", "Physical Execution Rate": "" });

    const row = this.fb.group({
      dateOfPhysicalExecution: [''],

      funds:[''],

    });


    this.physicalExecutionRateArray.push(row);
  }

  // deleteRows(index:number) {
  //   //console.log(12);
  //   console.log("index " +index);
  //   //const index = this.rows.indexOf(d);
  //   this.rows.splice(index, 1);
  // }
  deletePhysicalExecutionRows(index:number) {
    //console.log(12);
    // console.log("index "+d);
    //const index2 = this.physicalExecutionRows.indexOf(d);
    this.physicalExecutionRows.splice(index, 1);
  }
  constructor(private currencyPipe: CurrencyPipe,private dialog: MatDialog,private router: Router,
    private fb: FormBuilder,private projectService:ProjectService,
    private provincesService:ProvincesService, public translate: TranslateService,
    private implementingOrganizationService:ImplementingOrganizationService,
    private monitoringService:MonitoringService) {
    // this.monitoringForm = this.fb.group({
    //   physicalExecutionData: this.fb.array([
    //     this.fb.group({
    //       dateOfPhysicalExecution: [''],
    //       funds:[''],
    //       })
    //  ]),

    // dateOfPhysicalExecution:new FormControl(''),
    // funds:new FormControl('')

    // });

    // this.projectService. getProjectList().subscribe(data=>{
    //   this.projectList=data;
    //   this.filteredOptions = this.projectName.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(project => project ? this.filterProject(project) : this.projectList.slice())
    //     );
    //  });


  }


  opensweetalert4() {
    Swal.fire({
      title: 'At Least One Record Is Required!!!',
    })
  }

   deletePhysicalExecution(index: number) {

    console.log("index "+index );
    if(this.physicalExecutionRows.length==1)
     this.opensweetalert4();
    else{
      this.physicalExecutionRows.splice(index, 1);
      this.physicalExecutionRateArray.removeAt(index);
    }
  }



  ngOnInit(): void {

    //this.getProjectList();
    this.getProvinces();
    this.getImplementingOrganization();
    this.getRecommendation();
    this.getFinding();

    setTimeout(() =>this.dataSource.sort = this.sort);
    // setTimeout(() =>this.dataSource1.sort = this.sort);
    // setTimeout(() =>this.dataSource2.sort = this.sort);
    setTimeout(() =>this.dataSource.paginator=this.paginator3);

    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
   // console.log("this.browserLang",this.browserLang);

   this.filteredOptions = this.projectName.valueChanges

      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    this.usergroup=localStorage.getItem('usergroup');
      // if(this.usergroup===undefined || this.usergroup===null)
      // this.router.navigate(['/login']);


    this.monitoringForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      startdate:new FormControl(''),
      enddate:new FormControl(''),
      budgetMzn:new FormControl(''),
      levelOfAction:new FormControl(''),
      strategicPriorityPQG:new FormControl(''),
      strategicObjectivePQG:new FormControl(''),
      conditions :new FormControl(''),
      physicalExecutionData: this.fb.array([
        this.fb.group({
          dateOfPhysicalExecution: [''],
          funds:[''],
          })
     ]),
    });

    this.monitoringForm2 = new FormGroup({
      dovisit: new FormControl('', [Validators.required]),
       province: new FormControl('', [Validators.required]),

      lastvisitor:new  FormControl('', [Validators.required])
    });

    this.monitoringForm3 = new FormGroup({
      company: new FormControl('', [Validators.required]),
      findings: new FormControl('', [Validators.required]),
      contractValue: new FormControl(''),
      organization: new FormControl(''),
      performance: new FormControl(''),
      contractAb: new FormControl(''),
      // abValue: new FormControl('0.00'),
      // reasons: new FormControl(''),
      optionFind: new FormControl(''),
      otherReason: new FormControl(''),
      contraints: new FormControl(''),
      recommendation: new FormControl(''),
      dateOfLand:new FormControl('12/02/2020'),
      abValue: new FormControl({value: '',disabled: true}),
      reasons: new FormControl({value: '',disabled: true}),
      tableDatainancialPerformance: this.fb.array([
        // this.fb.group({
        //   dateOfFieldVisitFinancialExecution: [''],
        //   province:[''],
        //   finExecution:[''],
        //   finExecutionRate:[''],
        //   })
     ]),
     tableDataphysicalExecution: this.fb.array([
      // this.fb.group({
      //   dateOfFieldVisitFinancialExecution: [''],
      //   province:[''],
      //   finExecution:[''],
      //   finExecutionRate:[''],
      //   })
   ]),
    });

    for(let i=0;i<monitoringData.tableDatainancialPerformance.length;i++){
      this.addRowtableDatainancialPerformance(monitoringData.tableDatainancialPerformance[i].dateOfFieldVisitFinancialExecution,
        monitoringData.tableDatainancialPerformance[i].province,
        monitoringData.tableDatainancialPerformance[i].finExecution,
        monitoringData.tableDatainancialPerformance[i].finExecutionRate);
    }

    for(let i=0;i<monitoringData.tableDataphysicalExecution.length;i++){
      this.addRowtableDataphysicalExecution(monitoringData.tableDataphysicalExecution[i].dateOfFieldVisitPhysicalExecution,
        monitoringData.tableDataphysicalExecution[i].province,
        monitoringData.tableDataphysicalExecution[i].physicalRate);

    }


    this.donorfilter = this.monitoringForm3.controls.organization.valueChanges
    .pipe(
      startWith(''),
      map(value => this.donorFilter(value))
    );

  }


  addRowtableDatainancialPerformance (dateOfFieldVisitFinancialExecution,province,finExecution,finExecutionRate){
      const row = this.fb.group({
                dateOfFieldVisitFinancialExecution: [dateOfFieldVisitFinancialExecution],
              province:[province],
              finExecution:[finExecution],
              finExecutionRate:[finExecutionRate],
              status:['existing']

      });

      (this.monitoringForm3.get('tableDatainancialPerformance') as FormArray).push(row);
      this.monitoringForm3.controls.tableDatainancialPerformance.disable();

  }


  addRowtableDataphysicalExecution(dateOfFieldVisitPhysicalExecution,province,physicalRate){
    const row = this.fb.group({
      dateOfFieldVisitPhysicalExecution: [dateOfFieldVisitPhysicalExecution],
    province:[province],
    physicalRate:[physicalRate],
    status:['existing']

});

(this.monitoringForm3.get('tableDataphysicalExecution') as FormArray).push(row);
this.monitoringForm3.controls.tableDataphysicalExecution.disable();
  }


  onEnter(evt: any): void{
    console.log(evt.source.value);
    const selectedProject =  this.projectList.find(project =>
      project.projectNameEn.toLowerCase()==evt.source.value.toLowerCase());
    if (evt.source.selected) {
      console.log(selectedProject);
      if(selectedProject) {
      setTimeout(()=>{
        console.log(this.projectName.patchValue(selectedProject.projectNameEn));
      }, 0);
      }

    }
  }
  validateContract()
 {

     if(this.monitoringForm3.controls['contractAb'].value=="Yes")
     {
      this.addendum_value_mandatory_flag=true;
      // this.hdn_flag=true;
     this.monitoringForm3.controls['abValue'].enable();//enable input field
      this.monitoringForm3.controls['abValue'].setValidators([Validators.required]);//setting validation
      this.monitoringForm3.controls['abValue'].setErrors({'required':true});//error message
      this.monitoringForm3.controls['abValue'].updateValueAndValidity();//update validation

      this.monitoringForm3.controls['reasons'].enable();//enable input field
      this.monitoringForm3.controls['reasons'].setValidators([Validators.required]);//setting validation
      this.monitoringForm3.controls['reasons'].setErrors({'required':true});//error message
      this.monitoringForm3.controls['reasons'].updateValueAndValidity();//update validation
    }else {
      this.addendum_value_mandatory_flag=false;
      // this.hdn_flag=false;
      this.monitoringForm3.controls['abValue'].disable();//disable input field
      this.monitoringForm3.controls['abValue'].clearValidators;//remove validation
      this.monitoringForm3.controls['abValue'].setErrors({'required':true});//error message
      this.monitoringForm3.controls['abValue'].updateValueAndValidity();//update validation

      this.monitoringForm3.controls['reasons'].disable();//disable input field
      this.monitoringForm3.controls['reasons'].clearValidators;//remove validation
      this.monitoringForm3.controls['reasons'].setErrors({'required':true});//error message
      this.monitoringForm3.controls['reasons'].updateValueAndValidity();//update validation
        }
        let contractAb = this.monitoringForm3.controls['contractAb'].value;
        if(contractAb="Yes"){
          this.hdn_flag="false";
          this.hdn_flag1="false";
        }else if(contractAb="No"){
          this.hdn_flag="true";
          this.hdn_flag1="true";

        }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterProject(name: string) {
    return this.projectList.filter(project =>
      project.projectNameEn.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  private donorFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.donorOptions.filter(option => option.toLowerCase().includes(filterValue));;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.monitoringForm.controls[controlName].hasError(errorName);
  }

  public hasError2 = (controlName: string, errorName: string) => {
    return this.monitoringForm2.controls[controlName].hasError(errorName);
  }
  public hasError3 = (controlName: string, errorName: string) => {
    return this.monitoringForm3.controls[controlName].hasError(errorName);
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


  findingOptionList = [];






  findingsList: any = [
    {
      'findingsName': 'Completed',
      findingOptions: [
        'Delivered', 'Correction', ' Not Delivered',
      ]
    },

    {
      'findingsName': 'Ongoing',
      // findingsList: [ ]
    },

    {
      'findingsName': 'Paralyzed',
      findingOptions: [
        'Lack of Funds', 'Delay in Disbursements', 'TA Delay'
      ]
    },

    {
      'findingsName': 'Abandoned',
      findingOptions: [
        'Lack of Paid', ' Contractors Dishonesty',
      ]
    },
    {
      'findingsName': 'Not Started',
      findingOptions: [
        'Lack of Funds', 'Delay in Disbursements', 'TA Delay',
      ]
    }
  ];




  // editInfo(educationInfo) {
  //   this.education_level = educationInfo.aa;
  //   this.exam_title = educationInfo.bb;
  //   this.gender = educationInfo.cc;
  //   this.educationLevelChangeAction(this.education_level);
  // }
  FindingsChangeAction() {
    this.select_options_for_finding_hdn_flag=false;
    let finding = this.monitoringForm3.controls['findings'].value;
    /*if(finding=="Completed"  )
    {
      this.select_options_for_finding_hdn_flag=false;
       this.other_reasons_hdn_flag=true;
    }else if(finding=="Paralyzed" || finding=="Abandoned" || finding=="Not Started"){
      this.select_options_for_finding_hdn_flag=false;
      this.other_reasons_hdn_flag=false;
    }
    let dropDownData = this.findingsList.find((data: any) => data.findingsName === finding);
     console.log(dropDownData);
    if (dropDownData) {
      this.findingOptionList = dropDownData.findingOptions;
    } else {
      this.findingOptionList = [];
    }*/
    //alert(finding);
    this.getOptionFinding();
    if(finding == 3 || finding == 4 ||finding == 5 )
    {
      this.other_reasons_hdn_flag=false;
    }
    else{
      this.other_reasons_hdn_flag=true;
    }

  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  viewFunding(){
    console.log("inside--->")
    localStorage.setItem("ViewMoreFunding", "ViewMoreFunding");
    console.log("View More inside view--->",localStorage.getItem("ViewMoreFunding"));
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-funding']));
  }



  validateOnChange() {
    // debugger
    console.log(this.projectName);
    if (this.projectName.valid) {
      this.terrainVisit_flag="true";
      //this.nextStep();
    }
    else {
      this.terrainVisit_flag = "false";
      this.contract_flag = "false";
    }
    if (this.monitoringForm2.valid) {
      // if(this.monitoringForm2.value.dovisit!="" && this.monitoringForm.value.province!="" ){
       this.contract_flag="true";
      //    //this.nextStep();
      // }

    } else {
      this.contract_flag = "false";
      // this.disbursement_flag="false";
      // this.payments_flag="false";
    }


  }

  validateProject() {

    console.log(this.projectName.valid)
    if (this.projectName.valid) {
      this.terrainVisit_flag = "true";
      this.nextStep();
    }
    else {
      this.terrainVisit_flag = "false";

    }
  }

  validateTrrainvisit() {
    if (this.monitoringForm2.valid) {
      this.contract_flag = "true";
      this.nextStep();
    }
    else {
      this.contract_flag = "false";
      // this.disbursement_flag="false";
      // this.payments_flag="false";
    }
  }
  getCurrency(data){

    const currencyName = data.option.value;
    // debugger;
    if(currencyName=='Mozambique Infrastructure Project')
    {
      this.monitoringForm.controls['startdate'].setValue(moment("15/03/2019", "DD/MM/YYYY"));
    // this.startdate=new Date('05/12/2019');
    this.monitoringForm.controls['enddate'].setValue(moment("14/04/2023", "DD/MM/YYYY"));
    this.monitoringForm.controls['budgetMzn'].setValue('155.2');
    this.flagProjectName = "Mozambique Infrastructure Project";
    this.monitoringForm.controls['levelOfAction'].setValue('Central');
    this.monitoringForm.controls['strategicPriorityPQG'].setValue('REF - PQG - PR - 001 - Strategic Priority PQG1');
    this.monitoringForm.controls['strategicObjectivePQG'].setValue('REF - PQG - ST - 002 - Strategic Objective PQG2');




  }

  else if(currencyName=='Beira Express Way')
  {
    this.monitoringForm.controls['startdate'].setValue(moment("31/10/2020", "DD/MM/YYYY"));
    // this.startdate=new Date('05/12/2019');
    this.monitoringForm.controls['enddate'].setValue(moment("28/04/2024", "DD/MM/YYYY"));
    this.monitoringForm.controls['budgetMzn'].setValue('155.2');
    this.flagProjectName = "Beira Express Way";
    this.monitoringForm.controls['levelOfAction'].setValue('Provincial');
    this.monitoringForm.controls['strategicPriorityPQG'].setValue('Strategic Priority PQG2');
    this.monitoringForm.controls['strategicObjectivePQG'].setValue('Strategic Objective PQG1');
  }
 else if(currencyName=='Maputo smart City')
 {
  this.monitoringForm.controls['startdate'].setValue(moment("31/01/2020", "DD/MM/YYYY"));
  // this.startdate=new Date('05/12/2019');
  this.monitoringForm.controls['enddate'].setValue(moment("28/04/2023", "DD/MM/YYYY"));
  this.monitoringForm.controls['budgetMzn'].setValue('184.2');
  this.flagProjectName = "Maputo smart City";
  this.monitoringForm.controls['levelOfAction'].setValue('Provincial');
  this.monitoringForm.controls['strategicPriorityPQG'].setValue('Strategic Priority PQG2');
  this.monitoringForm.controls['strategicObjectivePQG'].setValue('Strategic Objective PQG2');
  }
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

  clearForm(form: FormGroup) {
    form.reset();
    }
    clearForm2(form: FormGroup) {
      form.reset();
      }
      clearForm3(form: FormGroup) {
        form.reset();
        }
        onFocus(value) {
          // on focus remove currency formatting
          this.monitoringForm3.controls['contractValue'].setValue(value.replace(/[^0-9.]+/g, ''));
        }
        onBlur(value) {
          // on blur, add currency formatting
          // this.myForm2.controls['amount_allocated_in_financing_agreement'].patchValue =
          this.monitoringForm3.controls['contractValue'].setValue(this.currencyPipe.transform(value, " "));
        }


        onFocus2(value) {
          // on focus remove currency formatting
          this.monitoringForm3.controls['abValue'].setValue(value.replace(/[^0-9.]+/g, ''));
        }
        onBlur2(value) {
          // on blur, add currency formatting
          // this.myForm2.controls['amount_allocated_in_financing_agreement'].patchValue =
          this.monitoringForm3.controls['abValue'].setValue(this.currencyPipe.transform(value, " "));
        }

        regex_Currency(e) {
        return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
       (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
      }

      regex_Currency2(e) {
        return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
       (<HTMLInputElement>document.getElementById("abValue")).value.indexOf('.') < 0));
      }

      private getProjectList(){

        this.projectService. getProjectList().subscribe(data=>{
          this.projectList=data;
         });
         //alert("this.projectList:"+this.projectList.length);
      }
      private getProvinces(){
        this.provincesService.getProvincesList().subscribe(data=>{
          this.provinceList1=data;
          console.log("data:"+this.provinceList1.length);
        });
      }
      private getImplementingOrganization(){
        this.implementingOrganizationService.getImplementingOrganizationList().subscribe(data=>{
          this.implementingOrganization=data;

        });
      }
      private getRecommendation(){
        this.monitoringService.getRecommendationList().subscribe(data=>{
          this.recommendationList=data;

        });
      }
      private getFinding(){
        this.monitoringService.getFindingList().subscribe(data=>{
          this.findingList=data;
          console.log("finding data : "+this.findingList)

        });
      }
      private getOptionFinding(){

        var findingId = this.monitoringForm3.controls['findings'].value;

        this.monitoringService.getOptionByFindingId(findingId).subscribe(data=>{
          this.optionFinding=data;
        });
      }
      openDialog2() {
        let refNm=localStorage.getItem("monitoringRefNM");
        if(refNm == null || refNm== ''){
          Swal.fire('Please Select a Budaget Project.')
        }else{
        const dialogRef = this.dialog.open(MonitoringDocumentUploadComponent);
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['monitoring']);
          console.log(`Dialog result: ${result}`);
        });
      }
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
  finagr:any;
  year: number;
  associatedFunding: string;
  donor: string;
  allocatedBudjet: number;
  disbursedBudjet: number;
  budjetexecuted: number;
  // disrate: number;
  // financialrate: number;
}

const ELEMENT_DATA: AmountData[] = [
  { finagr:"fin - 002",year: 2021, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 88512340.43, disbursedBudjet: 1202041.70, budjetexecuted: 1121},
  { finagr:"fin - 001",year: 2019, associatedFunding: 'World Bank', donor: 'World Bank', allocatedBudjet: 294731451.00, disbursedBudjet: 4002600, budjetexecuted: 1121 },
  { finagr:"fin - 004",year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 824464.71, disbursedBudjet: 11196.64, budjetexecuted: 1121},
  { finagr:"fin - 002",year: 2019, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 514237300.61, disbursedBudjet: 6983598.84, budjetexecuted: 1121 },
  { finagr:"fin - 003",year: 2018, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 796067985.00, disbursedBudjet: 10811000.00, budjetexecuted: 1121},
  {finagr:"fin - 007", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 159295393.17, disbursedBudjet: 2163310.83, budjetexecuted: 1121},
  {finagr:"fin - 005", year: 2018, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 828247245.84, disbursedBudjet: 11248010.40, budjetexecuted: 1121 },
  { finagr:"fin - 008",year: 2019, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 6622391.65, disbursedBudjet: 89935.38, budjetexecuted: 1121},
  { finagr:"fin - 006",year: 2021, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 19304659.74, disbursedBudjet: 262236.06, budjetexecuted: 1121 },
  { finagr:"fin - 006",year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 2070475650.22, disbursedBudjet: 28118091.28, budjetexecuted: 1121 },
];


const ELEMENT_DATA1: AmountData[] = [
  { finagr:"fin - 001",year: 2021, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 99512340.43, disbursedBudjet: 1202041.70, budjetexecuted: 5235},
  { finagr:"fin - 002",year: 2020, associatedFunding: 'World Bank', donor: 'World Bank', allocatedBudjet: 316731451.00, disbursedBudjet: 4002600, budjetexecuted: 5235 },
  { finagr:"fin - 003",year: 2019, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 724464.71, disbursedBudjet: 11196.64, budjetexecuted: 5235},
  { finagr:"fin - 004",year: 2019, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 560237300.61, disbursedBudjet: 9883598.84, budjetexecuted: 5235 },
  { finagr:"fin - 005",year: 2018, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 796067985.00, disbursedBudjet: 19811000.00, budjetexecuted: 5235},
  {finagr:"fin - 007", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 456295393.17, disbursedBudjet: 1563310.83, budjetexecuted: 5235},
  {finagr:"fin - 006", year: 2018, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 958247245.84, disbursedBudjet: 11248010.40, budjetexecuted: 5235 },
  { finagr:"fin - 008",year: 2019, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 7322391.65, disbursedBudjet: 89935.38, budjetexecuted: 5235},
  { finagr:"fin - 009",year: 2021, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 19804659.74, disbursedBudjet: 365236.06, budjetexecuted: 5235 },
  { finagr:"fin - 006",year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 2070475650.22, disbursedBudjet: 28118091.28, budjetexecuted: 5235 },
];


const ELEMENT_DATA2: AmountData[] = [
  { finagr:"fin - 008",year: 2021, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 15812340.43, disbursedBudjet: 1202041.70, budjetexecuted: 9855},
  { finagr:"fin - 009",year: 2019, associatedFunding: 'World Bank', donor: 'World Bank', allocatedBudjet: 965731451.00, disbursedBudjet: 4002600, budjetexecuted: 9855 },
  { finagr:"fin - 004",year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 726464.71, disbursedBudjet: 11196.64, budjetexecuted: 9855},
  { finagr:"fin - 002",year: 2019, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 165237300.61, disbursedBudjet: 6983598.84, budjetexecuted: 9855 },
  { finagr:"fin - 003",year: 2018, associatedFunding: 'WHO', donor: 'WHO', allocatedBudjet: 796067985.00, disbursedBudjet: 10811000.00, budjetexecuted: 9855},
  {finagr:"fin - 007", year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 159295393.17, disbursedBudjet: 2163310.83, budjetexecuted: 9855},
  {finagr:"fin - 005", year: 2018, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 828247245.84, disbursedBudjet: 11248010.40, budjetexecuted: 9855 },
  { finagr:"fin - 008",year: 2019, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 6622391.65, disbursedBudjet: 89935.38, budjetexecuted: 9855},
  { finagr:"fin - 006",year: 2021, associatedFunding: 'UNESCO', donor: 'UNESCO', allocatedBudjet: 19304659.74, disbursedBudjet: 262236.06, budjetexecuted: 9855 },
  { finagr:"fin - 006",year: 2020, associatedFunding: 'UNICEF', donor: 'UNICEF', allocatedBudjet: 2070475650.22, disbursedBudjet: 28118091.28, budjetexecuted: 9855 },
];