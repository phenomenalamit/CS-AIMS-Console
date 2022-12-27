/**
 * Edit Disbursement :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Disbursement } from 'src/app/model/disbursement';
import { ExcelService } from 'src/app/Service/excel.service';
import Swal from 'sweetalert2';
import { ViewDisbursementComponentComponent } from '../../view-components/view-disbursement-component/view-disbursement-component.component';
import { Location } from '@angular/common';
import { DisbursementDocumentUploadComponent } from '../../document-repository/upload-document/disbursement-document-upload/disbursement-document-upload.component';

@Component({
  selector: 'app-edit-disbursement',
  templateUrl: './edit-disbursement.component.html',
  styleUrls: ['./edit-disbursement.component.css']
})
export class EditDisbursementComponent implements OnInit {

  exchangeRateMZN!: number;
  exchangeRateUSD!: number;
  exchangeRatesAgreementCurrency!: number;
  disbursementAmountMZN!: number;
  disbursementAmountUSD!: number;
  disburmentAmountAgreementCurrency!: number;
  id:any=null;
  viewByTableId:any=null;

  public disbursementForm!: FormGroup;
  disbursement:Disbursement =new Disbursement();
  displayedColumns: string[] = ['position','disbursementReference','project','fundingTitle',
  'amount','exchangeRates','amountOfdisbursementMeticais',
  'amountOfdisbursementUSD','amountOfdisbursementAgreement','names','date',
  'swiftcode','receivedswiftcode','receivedBankNIB','edit'];
  // dataSource = ELEMENT_DATA;
  elements!: NodeListOf<Element>;


  names = new FormControl();
  organizationOptions: string[] = ['World Bank', 'Unicef', 'Unesco','Mozambique Government','WHO'];
  filteredOptions: Observable<string[]>;
  usergroup:any;

  currency = new FormControl();

  filteredOptionsC: Observable<string[]>;
  ViewMoreDisbursementFromProject: any;

  constructor(private currencyPipe: CurrencyPipe,
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,
    public dialog:MatDialog,private location: Location,private readonly route: ActivatedRoute) { }



    num:any;
    EditDisbursement:any;
    tabClick(index: number) {
      this.num=index;
    }

    ViewMoreDisbursement:any;
    draftedDisbursementId:any = null;
  ngOnInit(): void {
    this.viewByTableId=this.route.snapshot.paramMap.get("disbursement_id");
    this.draftedDisbursementId = this.route.snapshot.paramMap.get("drafted_disbursement_id");
    this.id=this.route.snapshot.paramMap.get("id");
    localStorage.setItem("EditDisbUrl","EditDisbUrl");
    this.usergroup=localStorage.getItem('usergroup');

    // this.EditDisbursement=localStorage.getItem("EditDisbursement");
    // this.ViewMoreDisbursement=localStorage.getItem("ViewMoreDisbursement");
    this.ViewMoreDisbursementFromProject = localStorage.getItem("ViewMoreDisbursementFromProject");
    console.log("View More inside view from project--->",localStorage.getItem("ViewMoreDisbursementFromProject"));
    this.disbursementForm = new FormGroup({
      currency : new FormControl('',[Validators.required]),
      disbursementReference: new FormControl('', [Validators.required]),
      project: new FormControl('', [Validators.required]),
      fundingDonorTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('0.00', [Validators.required]),
      names: new FormControl('', [Validators.required]),
      date:new FormControl('', [Validators.required]),
      exchangeRates:new FormControl({value:'',disabled:true}),
      exchangeRatesMzn:new FormControl({value:'',disabled:true}),
      amountOfdisbursementMeticais:new FormControl({value:'',disabled:true}),
      amountOfdisbursementUSD:new FormControl({value:'',disabled:true}),
      amountOfdisbursementAgreement:new FormControl({value:'',disabled:true}),
      swiftcode:new FormControl(''),
      receivedswiftcode:new FormControl(''),
      receivedBankNIB:new FormControl(''),
      // currency : new FormControl('')
    });

    this.filteredOptions = this.names.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }

  onBlur(value) {
    this.disbursementForm.controls['amount'].setValue(this.currencyPipe.transform(value, " "));
  }

  regex_Currency(e) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 &&
   (<HTMLInputElement>document.getElementById("contractValue")).value.indexOf('.') < 0));
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
    // for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
    //     if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
    //       (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
    //     }
    //   }
    this.location.back();
  }

  moveToDisbursementTab(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/disbursement']));
    this.location.back();
  }


  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewDisbursementComponentComponent(this.excelService,this.dialog);
  //   obj.ExportTOExcel();
  // }
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

  openDialog() {
    let refNm=localStorage.getItem("disbRefNM");
    if(refNm == null || refNm== ''){
      Swal.fire('Please Enter Disbursment Reference Name.')
    }else{
      const dialogRef = this.dialog.open(DisbursementDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['disbursement']);
        console.log(`Dialog result: ${result}`);
        // localStorage.removeItem('disbRefNM');
      });
    }
  }

  clearForm(form: FormGroup) {
    form.reset();
    }


}
