// Business Logic TS component of View Funding Html
import { Component,ElementRef,Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import { DOCUMENT } from '@angular/common';
import { ViewTableModalFinancialAgreementComponent }  from '../../view-more-components/view-table-modal-financial-agreement/view-table-modal-financial-agreement.component';
import { Location } from '@angular/common';
import { FinancingDocumentViewComponent } from '../../document-repository/view-document/financing-document-view/financing-document-view.component';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from 'src/environments/environment';
import { FinancingDocumentUploadComponent } from '../../document-repository/upload-document/financing-document-upload/financing-document-upload.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { isNull, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Organization } from 'src/app/model/organization';
import { Provinces } from 'src/app/Service-Class/provinces';
import { Districts } from 'src/app/Service-Class/districts';
import { ProvincesService } from 'src/app/Service/provinces.service';
import { DistrictsService } from 'src/app/Service/districts.service';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-view-funding-component',
  templateUrl: './view-funding-component.component.html',
  styleUrls: ['./view-funding-component.component.css']
})

export class ViewFundingComponentComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'names', 'nicknames', 'post','organization','email1',
  // 'email2','phone1','phone2','fax','address','city','country','othercontacts','edit'];
  // displayedColumns: string[] = ['edit','donorref', 'donortit', 'donor', 'fundingorg','resporg','startDate','endDate',
  // 'financingsit','typeofaid','amountmzn','amountusd'];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  displayedColumns: string[] = ['select','edit',  'donortit','fundingorg','startDate','endDate',
  'amountmzn','amountusd'];
  displayedColumnsReadOnly: string[] = ['donorref', 'donortit', 'donor', 'fundingorg','resporg','dateofsign',
  'financingsit','typeofaid'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // dataSource2: any;
  dataSource2 = new MatTableDataSource<FinancialAgreement>([]);
  userNameForNotification:string='Charlie Adams';
  userGroupForNotification:string='DNGDP Data Administrator';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;
 

  usergroup:any;
  userId:number;
  browserLang: any;

  constructor(private router :Router,private excelService :ExcelService,@Inject(DOCUMENT) private _document: HTMLDocument,private dialog: MatDialog,private location: Location,private financingService:FinancingServiceService,
  private districtsService: DistrictsService,private provincesService: ProvincesService) { 
    this.sortedData = this.financialAgreementList.slice();
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang == 'en'){
    this.filterSelectObj = [
      {
        name: 'Funding Donor Title',
        columnProp: 'donor_funding_title',
        options: []
      }, {
        name: 'Funding Organization',
        columnProp: 'fundingOrganization',
        options: []
      }, {
        name: 'Financing Situation',
        columnProp: 'financing_situation',
        options: []
      },{
        name: 'Province',
        columnProp: 'province',
        options: []
      },{
        name: 'District',
        columnProp: 'district',
        options: []
      },{
        name: 'Cooperation Modalities',
        columnProp: 'coOperationModalitiesEn',
        options: []
      },{
        name: 'Type of Finance',
        columnProp: 'typeOfFinance',
        options: []
      },{
        name: 'Type of Implementation',
        columnProp: 'typeOfImplementation',
        options: []
      },{
        name: 'Donor',
        columnProp: 'donor',
        options: []
      },{
        name: 'Priority / Pillar PQG',
        columnProp: 'priorityPillarPQg',
        options: []
      }
    ]
  }else{
    this.filterSelectObj = [
      {
        name: 'Título de doador financiador',
        columnProp: 'donor_funding_title',
        options: []
      }, {
        name: 'Organização de Financiamento',
        columnProp: 'fundingOrganization',
        options: []
      },{
        name: 'Situação do Financiamento',
        columnProp: 'financing_situationPt',
        options: []
      },{
        name: 'Província',
        columnProp: 'province',
        options: []
      },{
        name: 'Distrito',
        columnProp: 'district',
        options: []
      },{
        name: 'Modalidades de cooperação',
        columnProp: 'coOperationModalitiesPt',
        options: []
      },{
        name: 'Tipo de financiamento',
        columnProp: 'typeOfFinancePt',
        options: []
      },{
        name: 'Tipo de implementação',
        columnProp: 'typeOfImplementation',
        options: []
      },{
        name: 'Doador',
        columnProp: 'donor',
        options: []
      },{
        name: 'Prioridade Estratégica PQG',
        columnProp: 'priorityPillarPQg',
        options: []
      }
      
    ]
  }
  }
  elements!: NodeListOf<Element>;

  totalRows:number=0;
  // get totalRows(): number {
  //   return this.financialAgreementList.length;
  //   }

  userEmail:string;
  nationalOrderProvince=[];
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.userEmail=localStorage.getItem('userEmail');
    this.usergroup = localStorage.getItem('usergroup');
    this.userId = +localStorage.getItem('userId');
    this.getFinancialAgreementList();
    this.setToAuthFlag();
    //this.findTotalAmount();
    this.usergroup=localStorage.getItem('usergroup');
    this.setToUserPermission();
    // setTimeout(() =>this.dataSource2.paginator=this.paginator);
    // this.dataSource2.paginator = this.paginator;
    // setTimeout(() =>this.dataSource.sort = this.sort);
    // this.dataSource2.filterPredicate = this.createFilter();
    this.getAllDistrict();
    this.getProvinces();
  }
  donorList: Organization[] = [];
  donors:string[]=[];
  financialAgreementList:FinancialAgreement[] = [];

  allProvinceList:string[] = [];
  allDistrictList:string[] = [];

  provName: any;
  districtList:Districts[];
  private getAllDistrict(){
    this.districtsService.getAllDistrictURL().subscribe(data => {
      this.districtList = data;
    });
  }
  provinceList1: Provinces[] = [];
  private getProvinces() {
    this.provincesService.getProvincesList().subscribe((data) => {

      this.provinceList1 = data;   
      for(let i=0;i<this.provinceList1.length;i++)
      {
        this.nationalOrderProvince.push(this.provinceList1[i].provinces_name);
      }
    });  
    
  }

  provinceNm(district: string) {
    if(this.districtList!=undefined){
    if(this.districtList.length !=0){
      for(let i=0;i<this.districtList.length;i++){
        if(district == this.districtList[i].districts_name){
          let provId=this.districtList[i].provinces_id;
          if(this.provinceList1.length !=0){
            for(let k=0;k<this.provinceList1.length;k++){
              if(Number.parseInt(provId)==this.provinceList1[k].provinces_id){
                this.provName=this.provinceList1[k].provinces_name
              }
            }
          }
          
        }
      }
    }
  }
    
    return this.provName;
  }
  limits:number=0
  loadAllData(){
    this.limits=1;
    this.getFinancialAgreementList();
      }
  private getFinancialAgreementList() {
    // this.financingService.getProvinceList().subscribe(data => {
    //   this.province = data;
    // });
    // var limits=$("#limitDropDown").val();
    // if(limits==undefined)
    //   limits=0;
    // var arr = new Array();
    this.financingService.getFinancialAgreementList(this.limits).toPromise().then(data => {
      this.financingService.getDonorListByUserAccess(this.userId).toPromise().then(dataFin=>{
        this.donorList = dataFin;
        this.donorList.forEach(donor=>{
          this.donors.push(donor.names);
        });
        for (let i =0; i< this.financialAgreementList.length; i++) {
          // arr = this.financialAgreementList[i].records;
          this.financialAgreementList[i].emailChk = false;
          for (let j=0;j<this.donors.length;j++) {
            if (this.financialAgreementList[i].donor == this.donors[j]) {
              this.financialAgreementList[i].emailChk = true;
            }
          }
        }
        // try{
        //   $('#limitDropDown').find('option').remove();
        //   arr.forEach(str=>{
        //     console.log(str);
        //     $("#limitDropDown").append('<option value="'+str+'">'+str+'</option>');
        //   });
        //   $("#limitDropDown").val(this.financialAgreementList.length);
        // }
        // catch(e)
        // {console.error('while ploting in dropdown')}
      });
      // console.log("FA lIst: ",data)
      this.totalRows=0;
      this.financialAgreementList = data;
      // console.log('FA List : ',this.financialAgreementList);
      
      this.totalRows=this.financialAgreementList.length;
      console.log("return data" , this.financialAgreementList);
      for(let i=0;i<this.financialAgreementList.length;i++){
        // console.log("funding data" , this.financialAgreementList[i].fundingOrganization+" acro ",this.financialAgreementList[i].acronym);
        let amt_mzn: number = +this.financialAgreementList[i].amt_mzn;
        let amt_usd:number = +this.financialAgreementList[i].amt_usd;
        if(this.financialAgreementList[i].amt_mzn!= null && this.financialAgreementList[i].amt_mzn>0){
          this.totalAmntMZN=+this.totalAmntMZN+amt_mzn;
        }
        if(this.financialAgreementList[i].amt_usd!= null && this.financialAgreementList[i].amt_usd>0){
          this.totalAmntUsd=+this.totalAmntUsd+amt_usd;
        }
        this.financialAgreementList[i].provinces.forEach(e=>{this.allProvinceList.push(e)});
        this.financialAgreementList[i].districts.forEach(e=>{this.allDistrictList.push(e)});
      }
      this.allProvinceList = [...new Set( this.allProvinceList)];
      this.allDistrictList = [...new Set( this.allDistrictList)];
      this.dataSource2 = new MatTableDataSource(this.financialAgreementList);
      this.donorTitle = [];
      this.fundingOrganization = [];
      this.province=[];
      this.district=[];
      this.acronym=[];
      this.cooperationModalities=[]
      this.typeOfFinance=[];
      this.typeOfImplementation=[];
      this.donor=[];
      this.priorityPillarPqg=[];
      for(let i=0;i<this.financialAgreementList.length;i++){
        this.donorTitle.push(this.financialAgreementList[i].donor_funding_title);
        this.cooperationModalities.push(this.financialAgreementList[i].coOperationModalitiesEn)
        this.typeOfFinance.push(this.financialAgreementList[i].typeOfFinance)
        this.typeOfImplementation.push(this.financialAgreementList[i].typeOfImplementation)
        this.donor.push(this.financialAgreementList[i].donor)
        this.priorityPillarPqg.push(this.financialAgreementList[i].priorityPillarPQg)
        if(this.financialAgreementList[i].fundingOrganization !=null)
          this.fundingOrganization.push(this.financialAgreementList[i].fundingOrganization)
          // if(this.financialAgreementList[i].provinces.length>0){
          //   this.financialAgreementList[i].provinces.forEach(e=>{
          //     this.province.push(e);
          //   })
          // }
          // if(this.financialAgreementList[i].districts.length>0){
          //   this.financialAgreementList[i].districts.forEach(e=>{
          //     this.district.push(e);
          //   })
          // }
        // this.province.push(this.financialAgreementList[i].province)
        this.province = this.allProvinceList;
        let provInLocal=this.province;
        this.province=[];
        // console.log("province list for filter ",provInLocal)
        // console.log("province in national order ",this.nationalOrderProvince)
        for(let k=0;k<this.nationalOrderProvince.length;k++){
          for(let l=0;l<provInLocal.length;l++){
            // for(let k=0;k<this.nationalOrderProvince.length;k++){
              if(this.nationalOrderProvince[k]==provInLocal[l]){
                this.province.push(provInLocal[l])
              }
            }
            
          }
          // console.log("prov aftr ",this.province)
        
        // this.district.push(this.financialAgreementList[i].district)
        this.district = this.allDistrictList;
        this.acronym.push(this.financialAgreementList[i].acronym)
      }
      this.donorTitle = [...new Set(this.donorTitle)];
      this.fundingOrganization = [...new Set(this.fundingOrganization)];
      this.province=[...new Set(this.province)];
      this.proviceFinal=this.province;
      // console.log(this.province)
      this.district=[...new Set(this.district)];
      this.acronym=[...new Set(this.acronym)];
      this.cooperationModalities=[...new Set(this.cooperationModalities)];
      this.typeOfFinance=[...new Set(this.typeOfFinance)];
      this.typeOfImplementation=[...new Set(this.typeOfImplementation)];
      this.donor=[...new Set(this.donor)];
      this.priorityPillarPqg=[...new Set(this.priorityPillarPqg)];
      for(let j=0;j<this.province.length;j++){
        if(this.province[j] == null){
          this.province[j]=''
        }
      }
      // console.log("Province List 172:",this.province);
      // console.log("District List:",this.district);
      this.filterSelectObj.filter((o) => {
        // if(o.columnProp!='province' && o.columnProp!='district')
          o.options = this.getFilterObject(this.financialAgreementList, o.columnProp);
        if(o.columnProp=='province')
          o.options = this.allProvinceList;
          if(o.columnProp=='district')
          o.options = this.allDistrictList;
        // if(o.columnProp=='province' || o.columnProp=='district')
        //   console.log('options : ', o.options );
        
      });
      this.dataSource2.filterPredicate = this.createFilter();
      //paginating and sorting the table
      setTimeout(() => {
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      });
      // console.log("all data" , this.financialAgreementList);
    });
  }
  sortedData: FinancialAgreement[] = [];
  sortData(sort: Sort) {
    const data = this.financialAgreementList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      // console.log(this.sortedData)
      return;
    }


    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      
      switch (sort.active) {
        
        case 'title': return compare(a.donor_funding_title, b.donor_funding_title, isAsc);
        case 'fundingOrg': return compare(a.fundingOrganization, b.fundingOrganization, isAsc);
        // case 'startDate': return compare(a.start_date.getTime(), b.start_date.getTime(), isAsc);
        // case 'endDate': return compare(a.end_date.getTime(), b.end_date.getTime(), isAsc);
        case 'amtMzn': return compare(a.amt_mzn, b.amt_mzn, isAsc);
        case 'amtUsd': return compare(a.amt_usd, b.amt_usd, isAsc);
        
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {  
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    this.dataSource2 = new MatTableDataSource(this.sortedData);
  //paginating and sorting the table
  setTimeout(() => {
    this.dataSource2.paginator = this.paginator;
  });
  }

  public ExportTOExcel() {
    // console.log("inside view part");
    this.excelService.exportTableElmToExcel("ExampleMaterialTable", 'View Financial Agreement');
    //this.excelService.exportTableElmToExcel(this.epltable, 'Funding');
  }

  generateFundingExcel(){
    let id=[];
for(let i=0;i<this.dataSource2.filteredData.length;i++){
  id.push(this.dataSource2.filteredData[i].funding_id)
}
console.log("id ",id)
  window.open(environment.downloadFinancialAgreementDetailsExcel+id+'/'+btoa(this.checkedFilterColumn),'_self')
    // window.open(environment.downloadFinancialAgreementDetailsExcel, '_self');
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    // console.log("filter data",this.dataSource2);
    // if (this.dataSource2.paginator) {
    //   this.dataSource2.paginator.firstPage();
    //   this.totalAmntUsd = 0;
    // this.totalAmntMZN = 0;
    // /* The below loop is for to find all total amount summation */
    // for (let i = 0; i < this.dataSource2.filteredData.length; i++) {
    //   this.totalAmntMZN = this.totalAmntMZN + this.dataSource2.filteredData[i].amount;
    //   this.totalAmntUsd=this.totalAmntUsd+ this.dataSource2.filteredData[i].usdAmount;
    // }
    // }
  }

  ngAfterViewInit() {
  //   //console.log(this.epltable.nativeElement); // I am a child component!
  //   this.excelService.exportTableElmToExcel(this.epltable, 'Funding');
  }
  generateExcel(){
    // console.log("123456");
    let obj = new ViewFundingComponentComponent(this.router,this.excelService,this._document,this.dialog,this.location,this.financingService,this.districtsService,this.provincesService);
    obj.ExportTOExcel();
    //this.ngAfterViewInit();
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Financial Agreement')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  

  
  moveToSelectedTab(fundingId: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/edit-funding',fundingId]));

  }
  moveToSelectedTab1(tabName: string) {
    this.location.back();
  }
  viewMoreFunding(fundingId: number){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/view-funding',fundingId]));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  opensweetalertDelete() {
    this.getValueByLang();
    if(this.ids.length>0){
      Swal.fire({
        title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
        denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
      }).then((result) => {
  
  
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
  
          // Swal.fire('Deleted Successfully!', '', 'success')
          this.financingService.delete(this.ids,this.browserLang).subscribe(data =>{
            let response: any = data;
            response = JSON.parse(data);
            // console.log("response : ", response);
            if (response.status == 200) {
              // Swal.fire(response.responseMessage, '', 'success').then(() => {
              //   // this.router.navigate(['/admin/view-funding']);
              // });
              this.financialAgreementDeleteAlert(this.ids);
              this.financialAgreementList = response.newList;
              // console.log(this.financialAgreementList);
              this.dataSource2 = new MatTableDataSource(this.financialAgreementList);
              //paginating and sorting the table
              setTimeout(() => {
                this.dataSource2.paginator = this.paginator;
              });
              this.totalRows = this.financialAgreementList.length;
            } else if (response.status != 200) {
              // Swal.fire(response.message, response.responseMessage, 'error')
              Swal.fire(response.responseMessage,'', 'error')
            }
          });
          
        }
         else if (result.isDenied) {
          if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
          this.selection.clear();
        this.ids = [];
        }
      });
    }else{
      if(this.browserLang=='en')
    Swal.fire('Select at least one record');
    else
    Swal.fire('Seleccione pelo menos um registo');
    }
    
  }

  

  //for notification alert, execute on delete Financial Agreement
  financialAgreementDeleteAlert(ids:number[]) {
    let todayTime = new Date();
    let fundRefArr:string[] = [];
    let fundTitleArr:string[] = [];
    // console.log("financialAgreementList: ",this.financialAgreementList);
    ids.forEach(id => {
      // let fundRef=this.findFundingRefById(id);
      let fundRef : string = this.financialAgreementList.find(x => x.funding_id==id ).reference_for_financing_donor;
      fundRefArr.push(fundRef);
      // let fundTitle=this.findFundingTitelById(id);
      let fundTitle : string = this.financialAgreementList.find(x => x.funding_id==id ).donor_funding_title;
      fundTitleArr.push(fundTitle);
    });
    
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete funding on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='Financial Agreement Reference ID  "'
      +fundRefArr
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='Financial Agreement "'
      +fundTitleArr
      +'" with Reference ID "'
      +fundRefArr
      +'" respectively has been deleted by user "'+this.userNameForNotification+'" in AIMS on "'
    +((todayTime+'').substring(0, 24))+'" ';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
  }

  //for notification alert
  private findFundingRefById(id:number):string{
    let fundRef:string=null;
    for(let i=0;i<this.financialAgreementList.length;i++){
      if(this.financialAgreementList[i].funding_id==id){
        fundRef=this.financialAgreementList[i].reference_for_financing_donor;
      }
    }
    return fundRef;
  }

  //for notification alert
  private findFundingTitelById(id:number):string{
    let fundTitel:string=null;
    for(let i=0;i<this.financialAgreementList.length;i++){
      if(this.financialAgreementList[i].funding_id==id){
        fundTitel=this.financialAgreementList[i].donor_funding_title;
      }
    }
    return fundTitel;
  }

  //Sourav Kumar Nayak
  authorised_flag=false;
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Financial Agreement'){
        this.authorised_flag=true;
      }
    }
  }
  opensweetalert()
  {
Swal.fire({
  title: 'Do you want to save the changes?',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: `Save`,
  denyButtonText: `Don't save`,
}).then((result) => {


  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {

Swal.fire('Saved', '', 'success')
this.moveToSelectedTab;
  } else if (result.isDenied) {
Swal.fire('Changes are not saved', '', 'info')
  }
})
  }

  editFunding(element : any){

  }
  totalAmntMZN:number=0;
  totalAmntUsd:number=0;

  openDialog(faId:string) {
    localStorage.setItem("financialAgreementId",faId);

     const dialogRef = this.dialog.open(ViewTableModalFinancialAgreementComponent, {
       disableClose: true,
     });
     dialogRef.afterClosed().subscribe((result) => {
       this.router.navigate(['view-funding']);
      });

   }
   openDocumentDialog(fundingReferenceName:string) {
    localStorage.setItem("fundingReferenceName",fundingReferenceName);
    const dialogRef = this.dialog.open(FinancingDocumentViewComponent, {
      disableClose: true,
    });
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.router.navigate(['view-funding']);
    //  });
  }

  filterSelectObj = [];
    searchFilter = new FormControl('');
    openOptionSearch(e) {
      this.searchFilter.patchValue('');
     
    }
    getFilterObject(fullObj, key) {
      const uniqChk = [];
      fullObj.filter((obj) => {
        
        if (!uniqChk.includes(obj[key])) {
  
           if (obj[key] != null) {
            uniqChk.push(obj[key]);
           }
        }
        return obj;
      });
      return uniqChk;
    }
    chkValue(filter) {
    
      var searchFilterVal = this.searchFilter.value;
      let columnName = filter.columnProp;
      let donortit=[];
      let fundingorg=[];
      let province=[];
      let district=[];
      let acronym=[];
      let cooperationModalities=[];
      let typeOfFinance=[];
      let typeOfImplementation=[];
      let donor=[];
      let priorityPillarPQg=[];
      // return nothing if empty value in input
      if (searchFilterVal !== "") {
        for (var i = 0; i < this.financialAgreementList.length; i++) {
          if (columnName == 'donor_funding_title') {
            if(this.donorTitle.length ==0){
              if (((this.financialAgreementList[i].donor_funding_title).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                donortit.push(this.financialAgreementList[i].donor_funding_title);
              }
            }else if(this.donorTitle.length !=0){
              if(this.donorTitle[i] !=undefined)  {
              if (((this.donorTitle[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                donortit.push(this.donorTitle[i]);
              }
            }
            } 
            
          }else if (columnName == 'fundingOrganization') {
            if(this.fundingOrganization.length ==0){
            if ((((this.financialAgreementList[i].fundingOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) ) {
              if(this.financialAgreementList[i].fundingOrganization !=null)
              fundingorg.push(this.financialAgreementList[i].fundingOrganization);
            }
          }else if(this.fundingOrganization.length !=0){
            if(this.fundingOrganization[i] !=undefined)  {
if(this.acronym[i] == null || this.acronym[i] == undefined){
  this.acronym[i]=''
}
            if ((((this.fundingOrganization[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) ||
            (((this.acronym[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1)) {
              if(this.financialAgreementList[i].fundingOrganization !=null)
              fundingorg.push(this.fundingOrganization[i]);
              acronym.push(this.acronym[i])
            }
          }
          } 
        }
        else if (columnName == 'province') {
          if (this.province.length == 0) {
            this.fundingOrganization[i].provinces.forEach(e => {
              if(e.toString().trim().toLowerCase().indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1){
                province.push(e);
              }
            });
            // if (((this.fundingOrganization[i].province).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            //   province.push(this.fundingOrganization[i].province);
            // }
          }
          else if (this.province.length != 0) {
            if (this.province[i] != undefined) {
              if (((this.province[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                province.push(this.province[i]);

              }
            }
          }
        }else if (columnName == 'district') {
          if (this.district.length == 0) {
            // if (((this.fundingOrganization[i].district).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            //   district.push(this.fundingOrganization[i].district);
            // }
            this.fundingOrganization[i].districts.forEach(e => {
              if(e.toString().trim().toLowerCase().indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1){
                district.push(e);
              }
            });
          }
          else if (this.district.length != 0) {
            if (this.district[i] != undefined) {
              if (((this.district[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                district.push(this.district[i]);

              }
            }
          }
          } else if (columnName == 'coOperationModalitiesEn') {
            if (this.cooperationModalities.length == 0) {
              if (((this.financialAgreementList[i].coOperationModalitiesEn).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                cooperationModalities.push(this.financialAgreementList[i].coOperationModalitiesEn);
              }
            } else if (this.cooperationModalities.length != 0) {
              if (this.cooperationModalities[i] != undefined) {
                if (((this.cooperationModalities[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                  cooperationModalities.push(this.cooperationModalities[i]);
                }
              }
            }
          }else if (columnName == 'typeOfFinance') {
            if (this.typeOfFinance.length == 0) {
              if (((this.financialAgreementList[i].typeOfFinance).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                typeOfFinance.push(this.financialAgreementList[i].typeOfFinance);
              }
            } else if (this.typeOfFinance.length != 0) {
              if (this.typeOfFinance[i] != undefined) {
                if (((this.typeOfFinance[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                  typeOfFinance.push(this.typeOfFinance[i]);
                }
              }
            }
          }else if (columnName == 'typeOfImplementation') {
            if (this.typeOfImplementation.length == 0) {
              if (((this.financialAgreementList[i].typeOfImplementation).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                typeOfImplementation.push(this.financialAgreementList[i].typeOfImplementation);
              }
            } else if (this.typeOfImplementation.length != 0) {
              if (this.typeOfImplementation[i] != undefined) {
                if (((this.typeOfImplementation[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                  typeOfImplementation.push(this.typeOfImplementation[i]);
                }
              }
            }
          }else if (columnName == 'donor') {
            if (this.donor.length == 0) {
              if (((this.financialAgreementList[i].donor).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                donor.push(this.financialAgreementList[i].donor);
              }
            } else if (this.donor.length != 0) {
              if (this.donor[i] != undefined) {
                if (((this.donor[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                  donor.push(this.donor[i]);
                }
              }
            }
          }else if (columnName == 'priorityPillarPQg') {
            if (this.priorityPillarPqg.length == 0) {
              if (((this.financialAgreementList[i].priorityPillarPQg).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                priorityPillarPQg.push(this.financialAgreementList[i].priorityPillarPQg);
              }
            } else if (this.priorityPillarPqg.length != 0) {
              if (this.priorityPillarPqg[i] != undefined) {
                if (((this.priorityPillarPqg[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                  priorityPillarPQg.push(this.priorityPillarPqg[i]);
                }
              }
            }
          }
        }
      }if (columnName == 'donor_funding_title') {
        donortit = [...new Set(donortit)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'donor_funding_title') {
            o.options = donortit, 'donor_funding_title';
          }
        });
      }else if(columnName == 'fundingOrganization') {
        fundingorg = [...new Set(fundingorg)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'fundingOrganization') {
            o.options = fundingorg, 'fundingOrganization';
          }
        });
      }
      else if(columnName == 'coOperationModalitiesEn') {
        cooperationModalities = [...new Set(cooperationModalities)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'coOperationModalitiesEn') {
            o.options = cooperationModalities, 'coOperationModalitiesEn';
          }
        });
      }
      else if(columnName == 'typeOfFinance') {
        typeOfFinance = [...new Set(typeOfFinance)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'typeOfFinance') {
            o.options = typeOfFinance, 'typeOfFinance';
          }
        });
      }
      else if(columnName == 'typeOfImplementation') {
        typeOfImplementation = [...new Set(typeOfImplementation)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'typeOfImplementation') {
            o.options = typeOfImplementation, 'typeOfImplementation';
          }
        });
      }
      else if(columnName == 'priorityPillarPQg') {
        priorityPillarPQg = [...new Set(priorityPillarPQg)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'priorityPillarPQg') {
            o.options = priorityPillarPQg, 'priorityPillarPQg';
          }
        });
      }
      else if(columnName == 'donor') {
        donor = [...new Set(donor)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'donor') {
            o.options = donor, 'donor';
          }
        });
      }
      if (columnName == 'province') {
        province = [...new Set(province)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'province') {
            o.options = province, 'province';
          }
        });
      }
      if (columnName == 'district') {
        district = [...new Set(district)];
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'district') {
            o.options = district, 'district';
          }
        });
      }
      if (searchFilterVal.length == 0 && columnName == 'province' && this.province.length != 0) {
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'province')
            o.options = this.province, 'province';
        });
      }
      if (searchFilterVal.length == 0 && columnName == 'district' && this.district.length != 0) {
        this.filterSelectObj.filter((o) => {
          if (o.columnProp == 'district')
            o.options = this.district, 'district';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'donor_funding_title' && this.donorTitle.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'donor_funding_title')
          o.options = this.donorTitle, 'donor_funding_title';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'fundingOrganization' && this.fundingOrganization.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'fundingOrganization')
          o.options = this.fundingOrganization, 'fundingOrganization';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'coOperationModalitiesEn' && this.cooperationModalities.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'coOperationModalitiesEn')
          o.options = this.cooperationModalities, 'coOperationModalitiesEn';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'typeOfFinance' && this.typeOfFinance.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'typeOfFinance')
          o.options = this.typeOfFinance, 'typeOfFinance';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'typeOfImplementation' && this.typeOfImplementation.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'typeOfImplementation')
          o.options = this.typeOfImplementation, 'typeOfImplementation';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'priorityPillarPQg' && this.priorityPillarPqg.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'priorityPillarPQg')
          o.options = this.priorityPillarPqg, 'priorityPillarPQg';
        });
      }
      if (searchFilterVal.length == 0 && columnName== 'donor' && this.priorityPillarPqg.length!=0) {
        this.filterSelectObj.filter((o) => {
          if(o.columnProp== 'donor')
          o.options = this.donor, 'donor';
        });
      }
    }
    filterValues = {};
    checkedFilterColumn:any={};
    filterChange(filter, event) {
      // debugger
      //let filterValues = {}
      // this.amnt_flag=true;
      // console.log("event:"+event.value);
      // console.log("filter: "+filter.columnProp);
      this.filterValues[filter.columnProp] = event.value;
      this.dataSource2.filter = JSON.stringify(this.filterValues);
      //console.log("this.filterValues:"+this.filterValues);
      let allCol=[];
      // console.log("filter values ",this.dataSource2.filteredData)
      // this.filterSelectObj.filter((o) => {
      //       o.options = this.getFilterObject(this.dataSource2.filteredData, o.columnProp);
      // });
      this.totalRows=0;
      this.totalRows=this.dataSource2.filteredData.length;
      this.totalAmntMZN=0;
      this.totalAmntUsd=0;
      this.checkedFilterColumn=this.dataSource2.filter;
      for(let i=0;i<this.dataSource2.filteredData.length;i++){
        let amt_mzn: number = +this.dataSource2.filteredData[i].amt_mzn;
        let amt_usd:number = +this.dataSource2.filteredData[i].amt_usd;
        if(this.dataSource2.filteredData[i].amt_mzn!= null && this.dataSource2.filteredData[i].amt_mzn>0){
          this.totalAmntMZN=+this.totalAmntMZN+amt_mzn;
        }
        if(this.dataSource2.filteredData[i].amt_usd!= null && this.dataSource2.filteredData[i].amt_usd>0){
          this.totalAmntUsd=+this.totalAmntUsd+amt_usd;
        }
  
      }
      console.log(this.dataSource2.filteredData);
      
    }
    resetFilters() {
      let currentUrl = this. router. url;
        this. router. routeReuseStrategy. shouldReuseRoute = () => false;
        this. router. onSameUrlNavigation = 'reload';
        this. router. navigate([currentUrl]);
      
    }
    donorTitle=[];
    fundingOrganization=[];
    province:string[]=[];
  district:string[]=[];
  acronym=[]
  proviceFinal:any=[]
  cooperationModalities:any=[];
  typeOfFinance:any=[];
  typeOfImplementation:any=[];
  donor:any=[];
  priorityPillarPqg:any=[];
    createFilter() {

      let filterFunction =  (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        // console.log("searchTerms[col].toString() ",searchTerms[col].toString())
          if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
          } else {
          delete searchTerms[col];
            this.donorTitle = [];
            this.proviceFinal = [];
            isFilterSet = false;
            this.fundingOrganization = [];
            this.cooperationModalities=[];
            this.typeOfFinance=[]
            this.typeOfImplementation=[];
            this.donor=[];
            this.priorityPillarPqg=[];
            for (let i = 0; i < this.financialAgreementList.length; i++) {
              this.donorTitle.push(this.financialAgreementList[i].donor_funding_title);
              if (this.financialAgreementList[i].fundingOrganization != null)
                this.fundingOrganization.push(this.financialAgreementList[i].fundingOrganization)
                // this.province.push(this.financialAgreementList[i].province);
                // this.district.push(this.financialAgreementList[i].district);
                this.financialAgreementList[i].provinces.forEach(e => {this.province.push(e)});
                this.financialAgreementList[i].districts.forEach(e=>this.district.push(e));
                this.acronym.push(this.financialAgreementList[i].acronym)
                this.cooperationModalities.push(this.financialAgreementList[i].coOperationModalitiesEn)
                this.typeOfFinance.push(this.financialAgreementList[i].typeOfFinance)
                this.typeOfImplementation.push(this.financialAgreementList[i].typeOfImplementation)
                this.donor.push(this.financialAgreementList[i].donor)
                this.priorityPillarPqg.push(this.financialAgreementList[i].priorityPillarPQg)
            }
            this.donorTitle = [...new Set(this.donorTitle)];
            this.fundingOrganization = [...new Set(this.fundingOrganization)];
            this.province = [...new Set(this.province)];
      this.district = [...new Set(this.district)];
      this.cooperationModalities = [...new Set(this.cooperationModalities)];
      this.typeOfFinance=[...new Set(this.typeOfFinance)];
      this.typeOfImplementation=[...new Set(this.typeOfImplementation)];
      this.donor=[...new Set(this.donor)];
      this.priorityPillarPqg=[...new Set(this.priorityPillarPqg)];
      let district=[]
      for(let k=0;k<this.district.length;k++){
        if(this.district[k] !=undefined)
        district.push(this.district[k].trim())
      }
      district = [...new Set(district)];
        for(let j=0;j<district.length;j++){
          if(this.districtList.length !=0){
            for(let i=0;i<this.districtList.length;i++){
              if(district[j] == this.districtList[i].districts_name){
                let provId=this.districtList[i].provinces_id;
                if(this.provinceList1.length !=0){
                  for(let k=0;k<this.provinceList1.length;k++){
                    if(Number.parseInt(provId)==this.provinceList1[k].provinces_id){
                      this.proviceFinal.push(this.provinceList1[k].provinces_name)
                    }
                  }
                }
              }
              }
            }
        }
      this.acronym= [...new Set(this.acronym)];
      this.proviceFinal= [...new Set(this.proviceFinal)];
      // console.log("districtForOpt ",district)
          this.filterSelectObj.filter((o) => {
            if(o.columnProp!='district'){
          o.options = this.getFilterObject(this.financialAgreementList, o.columnProp);
            }
          if(o.columnProp=='province')
          o.options = this.province;
          if(o.columnProp=='district'){
            district = [...new Set(district)];
            o.options = district;
          }
          
        });
          }
      }
      
      let nameSearch = () => {
          let found = false;
          let checkIn = 0;
            let total = 0;
          if (isFilterSet) {
          for (let col in searchTerms) {
            total++;
            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              this.donorTitle=[];
              this.fundingOrganization=[];
              this.province=[];
            this.district=[];
            this.acronym=[];
            this.proviceFinal = [];
            this.cooperationModalities=[];
            this.typeOfFinance=[];
            this.typeOfImplementation=[]
            this.donor=[]
            this.priorityPillarPqg=[]
                let spl = word.split(",");
                for(let i=0;i<spl.length;i++)
                {
                  if(spl[i] == 'No Data'){
                    spl[i]=''
                  }
                   /* adding Running filter start */
                  for(let j=0;j<this.financialAgreementList.length;j++){
                    if(col =='donor_funding_title'){
                      if (spl[i].toLowerCase() == (this.financialAgreementList[j].donor_funding_title).toString().toLowerCase()) {
                        this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                        this.acronym.push(this.financialAgreementList[j].acronym);
                        this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                        this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                        // this.district.push(this.financialAgreementList[j].districts)
                        this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn);
                        this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                        this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                        this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                      }
                    }
                    else if(col =='fundingOrganization'){
                      if(this.financialAgreementList[j].fundingOrganization != null){
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].fundingOrganization).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn);
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          // this.province.push(this.financialAgreementList[j].province);
                          // this.district.push(this.financialAgreementList[j].district);
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if (col == 'coOperationModalitiesEn') {
                      if (this.financialAgreementList[j].coOperationModalitiesEn != null) {
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].coOperationModalitiesEn).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          this.donor.push(this.financialAgreementList[j].donor)
                          this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if (col == 'donor') {
                      if (this.financialAgreementList[j].donor != null) {
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].donor).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn)
                          this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if (col == 'priorityPillarPQg') {
                      if (this.financialAgreementList[j].priorityPillarPQg != null) {
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].priorityPillarPQg).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn)
                          this.donor.push(this.financialAgreementList[j].donor)
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if(col =='typeOfFinance'){
                      if(this.financialAgreementList[j].typeOfFinance != null){
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].typeOfFinance).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if(col =='typeOfImplementation'){
                      if(this.financialAgreementList[j].typeOfImplementation != null){
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].typeOfImplementation).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn)
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    else if(col =='province'){
                      // if(this.financialAgreementList[j].provinces!=null && this.financialAgreementList[j].provinces.length>0){
                        if(this.financialAgreementList[j].province!=null){
                        // this.financialAgreementList[j].provinces.forEach(e => {
                        //  if (spl[i].trim().toLowerCase() == e.trim().toLowerCase()){
                        //   this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                        //   this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                        //   this.district.push(this.financialAgreementList[j].district)
                        //   this.acronym.push(this.financialAgreementList[j].acronym);
                        //  }
                        // });
                        this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn);
                        this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                        this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                        this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                        for(let l=0;l<this.financialAgreementList[j].provinces.length;l++){
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].provinces[l]).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          // this.district.push(this.financialAgreementList[j].district)
                          // this.financialAgreementList[j].districts.forEach(e => this.district.push(e));
                          // this.district.forEach(e => this.district.push(e));
                          for(let m=0;m<this.provinceList1.length;m++){
                            if(spl[i].toLowerCase().trim() == this.provinceList1[m].provinces_name.toLowerCase().trim()){
                              let provinceId=this.provinceList1[m].provinces_id;
                              for (let a = 0; a < this.districtList.length; a++) {
                               
                                if(provinceId==Number.parseInt(this.districtList[a].provinces_id)){
                                  for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                                    if(this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name){
                                      this.district.push(this.districtList[a].districts_name)
                                    }
                                  }
                                }
                              }
                            }
                          }

                          this.acronym.push(this.financialAgreementList[j].acronym);
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      
                      }
                    }
                    else if(col =='district'){
                      if(this.financialAgreementList[j].district != null){
                        for(let p=0;p<this.financialAgreementList[j].districts.length;p++){
                        if (spl[i].toLowerCase() == (this.financialAgreementList[j].districts[p]).toString().toLowerCase()) {
                          this.donorTitle.push(this.financialAgreementList[j].donor_funding_title);
                          this.cooperationModalities.push(this.financialAgreementList[j].coOperationModalitiesEn);
                          this.donor.push(this.financialAgreementList[j].donor)
                        this.priorityPillarPqg.push(this.financialAgreementList[j].priorityPillarPQg)
                          this.typeOfFinance.push(this.financialAgreementList[j].typeOfFinance)
                          this.typeOfImplementation.push(this.financialAgreementList[j].typeOfImplementation)
                          this.financialAgreementList[j].provinces.forEach(e => this.province.push(e));
                          // this.province.push(this.financialAgreementList[j].province);
                          this.fundingOrganization.push(this.financialAgreementList[j].fundingOrganization);
                          this.acronym.push(this.financialAgreementList[j].acronym);
                          for (let c = 0; c < this.financialAgreementList[j].districts.length; c++) {
                            if (this.districtList.length != 0) {
                              for (let a = 0; a < this.districtList.length; a++) {
                                if (this.financialAgreementList[j].districts[c] == this.districtList[a].districts_name) {
                                  let provId = this.districtList[a].provinces_id;
                                  if (this.provinceList1.length != 0) {
                                    for (let b = 0; b < this.provinceList1.length; b++) {
                                      if (Number.parseInt(provId) == this.provinceList1[b].provinces_id) {
                                        this.proviceFinal.push(this.provinceList1[b].provinces_name)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                     
                      }
                    }
                  }
                  // if(col=='province')
                  //  col='provinces';
                  /* adding Running filter end */
                  // console.log('col ',col)
                  // console.log('data ',data)
                  // console.log('data[col]:',data[col]);
                  if(data[col] !=null){
                  //   if (data[col].toString().toLowerCase() == spl[i].toLowerCase() && isFilterSet) {
                  //     found = true;
                  //     checkIn++;
                  // }
                  /* adding Running filter end */
                  // console.log('spl[i]:',spl[i].trim().toLowerCase());
                  // console.log('data[col]:',data[col].toString().trim().toLowerCase());
                  // debugger
                  // if(col=='provinces'){
                  //   if(data[col].length>0){
                  //     for(let k=0;k<data[col].length;k++){
                  //       if (data[col][k].toString().trim().toLowerCase().indexOf(spl[i].trim().toLowerCase()) != -1 && isFilterSet) {
                  //         found = true;
                  //         checkIn++;
                  //       }
                  //     }
                  //   }
                  // }else{
                    // if (data[col].toString().trim().toLowerCase().indexOf(spl[i].trim().toLowerCase()) != -1 && isFilterSet) {
                      if ((data[col].toString()).trim().toLowerCase() == spl[i].trim().toLowerCase() && isFilterSet) {
                    found = true;
                      checkIn++;
                    }
                  // }
                  }
                 
                }
                
                
              });
            
          }
          // console.log("this.donorTitle: ",this.donorTitle );
            this.donorTitle = [...new Set(this.donorTitle)];
            // console.log("this.donorTitle: ",this.donorTitle );
            this.fundingOrganization = [...new Set(this.fundingOrganization)];
            this.province=[...new Set(this.province)];
            this.district=[...new Set(this.district)];
            this.acronym=[...new Set(this.acronym)];
            this.proviceFinal = [...new Set(this.proviceFinal)];
            this.cooperationModalities= [...new Set(this.cooperationModalities)];
            this.typeOfFinance= [...new Set(this.typeOfFinance)];
            this.typeOfImplementation=[...new Set(this.typeOfImplementation)];
            this.donor=[...new Set(this.donor)];
            this.priorityPillarPqg=[...new Set(this.priorityPillarPqg)];
            if (this.donorTitle.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'donor_funding_title') {
                  o.options = this.donorTitle, 'donor_funding_title';
                }
              });
            }
            if (this.typeOfFinance.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'typeOfFinance') {
                  o.options = this.typeOfFinance, 'typeOfFinance';
                }
              });
            }
            if (this.typeOfImplementation.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'typeOfImplementation') {
                  o.options = this.typeOfImplementation, 'typeOfImplementation';
                }
              });
            }
            if (this.cooperationModalities.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'coOperationModalitiesEn') {
                  o.options = this.cooperationModalities, 'coOperationModalitiesEn';
                }
              });
            }
            if(this.province.length !=0){
              console.log("prov ",this.province)
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'province') {
                  o.options = this.province, 'province';
                }
              });
            }
            if(this.district.length !=0){
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'district') {
                  o.options = this.district, 'district';
                }
              });
            }
            if (this.fundingOrganization.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'fundingOrganization') {
                  o.options = this.fundingOrganization, 'fundingOrganization';
                }
              });
            }
            if (this.donor.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'donor') {
                  o.options = this.donor, 'donor';
                }
              });
            }
            if (this.priorityPillarPqg.length != 0) {
              this.filterSelectObj.filter((o) => {
                if (o.columnProp == 'priorityPillarPQg') {
                  o.options = this.priorityPillarPqg, 'priorityPillarPQg';
                }
              });
            }
          return (checkIn == total);
          } else {
          return true;
          }
      }
      return nameSearch()
      }
      return filterFunction
    }

    selection = new SelectionModel<FinancialAgreement>(true, []);

    selectType = [
      { text: "Single", value: SelectType.single },
      { text: "Multiple", value: SelectType.multiple }
    ];
  
    displayType = SelectType.multiple;
    ids: number[] = [];
  
    selectHandler(row: FinancialAgreement) {
      if (this.displayType == SelectType.single) {
        if (!this.selection.isSelected(row)) {
          this.selection.clear();
        }
      }
      this.selection.toggle(row);
      if (this.selection.isSelected(row)) {
        this.ids.push(row.funding_id);
      } else {
        let index = this.ids.indexOf(row.funding_id, 0);
        this.ids.splice(index, 1);
      }
    }
    openDialog2(fundingRefNM:string) {
      localStorage.setItem("fundingRefNM", fundingRefNM);
      // let refNm=localStorage.getItem("fundingRefNM");
      // if(refNm == null || refNm== ''){
      //   Swal.fire('Please Enter Funding Donor Title.')
      // }else{
            const dialogRef = this.dialog.open(FinancingDocumentUploadComponent);
            dialogRef.afterClosed().subscribe(result => {
              this.router.navigate(['funding']);
              console.log(`Dialog result: ${result}`);
              // localStorage.removeItem('fundingRefNM');
            }
            );
          // }
        }

        
  minValue: number = 1000;
  maxValue: number = 6000;

  minValueMZN: number = 1000;
  maxValueMZN: number = 6000;
  minAmount: any = [];
  optionsMT: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if(this.browserLang == 'en'){
              return '<b>Min Amount : </b> MZN' + value;
            }else{
              return '<b>Montante mínimo : </b> MZN' + value;
            }
            
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang == 'en'){
            return '<b>Max Amount : </b> MZN' + value;
            }else{
              return '<b>Montante máximo : </b> MZN' + value;
            }
          }
        default:
          if(this.browserLang == 'en'){
          return 'Filter Amount (MZN)';
          }else{
            return 'Filtrar Montante (MZN)';
          }
      }

    }
  }

  /* If we move the amount slider then here we get filter data */
  getRangeForMZN() {
    this.totalRows =0;
    this.totalAmntMZN = 0;
    this.totalAmntUsd = 0;
    this.dataSource2.data = this.financialAgreementList;
    //console.log("envelopeDetails:"+this.envelopedataSource.data);
    const from = this.minValueMZN;
    const to = this.maxValueMZN;
    
    this.dataSource2.data = this.dataSource2.data.filter(e =>  e.amt_mzn >= from &&   e.amt_mzn <= to);
    this.totalRows = this.dataSource2.data.length;
    
    for (let i = 0; i < this.dataSource2.filteredData.length; i++) {
      
      this.totalAmntMZN = this.totalAmntMZN + Number(this.dataSource2.filteredData[i].amt_mzn);
      this.totalAmntUsd = this.totalAmntUsd + Number(this.dataSource2.filteredData[i].amt_usd);
    }
  }

  options1: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      var min;
      var max;
      switch (label) {
        case LabelType.Low:
          {
            min = value;
            if(this.browserLang == 'en'){
            return '<b>Min Amount : </b> $' + value;
            }else{
              return '<b>Montante mínimo : </b> $' + value;
            }
          }
        case LabelType.High:
          {
            max = value;
            if(this.browserLang == 'en'){
            return '<b>Max Amount : </b> $' + value;
            }else{
              return '<b>Montante máximo : </b> $' + value;
            }
          }
        default:
          if(this.browserLang == 'en'){
          return 'Filter Amount (USD)';
          }else{
            return 'Filtrar Montante (USD)';
          }
      }

    }
  }

   /* If we move the amount usd slider then here we get filter data */
   getRange() {
    console.log("max:" + this.maxValue);
    console.log("main:" + this.minValue);
    this.totalRows =0;
    this.totalAmntMZN = 0;
    this.totalAmntUsd = 0;
    this.dataSource2.data = this.financialAgreementList;
    const from = this.minValue;
    const to = this.maxValue;
    this.dataSource2.data = this.dataSource2.data.filter(e => e.amt_usd >= this.minValue && e.amt_usd <= this.maxValue);
    this.totalRows = this.dataSource2.data.length;
   
    for (let i = 0; i < this.dataSource2.filteredData.length; i++) {
      
      this.totalAmntMZN = this.totalAmntMZN + Number(this.dataSource2.filteredData[i].amt_mzn);
      this.totalAmntUsd = this.totalAmntUsd + Number(this.dataSource2.filteredData[i].amt_usd);
    }
  }
  public dateFilterForm= new FormGroup({
    fromDate: new FormControl({value: null,disabled: false}),
    toDate: new FormControl({value: null,disabled: false}),
});
get fromDate() { return this.dateFilterForm.get('fromDate').value; }
get toDate() { return this.dateFilterForm.get('toDate').value; }

filterDictionary= new Map<string,_moment.Moment>();

// applyDateFilter(dateFilterName:string,ob: MatDatepickerInputEvent<_moment.Moment>){
  applyDateFilter(dateFilterName:string,ob: _moment.Moment){
  let fromDate = moment(this.dateFilterForm.value.fromDate);
  let toDate =  moment(this.dateFilterForm.value.toDate);
  // fromDate = moment(fromDate).format('DD-MMM-yyyy');
  // toDate = moment(toDate).format('DD-MMM-yyyy');
  console.log('fromDate:',fromDate);
  console.log('toDate:',toDate);
  
    // if((fromDate.isValid() && toDate.isValid()) ){
    // Swal.fire('From Date and To Date should not be blank');
    console.log("Inside");
    if(!fromDate.isValid() && !toDate.isValid()){
      this.dataSource2 = new MatTableDataSource(this.financialAgreementList);
      this.dataSource2.filterPredicate = this.createFilter();
      setTimeout(() => {
        this.dataSource2.paginator = this.paginator;
      });
      return
    }else{
      this.filterDictionary.set(dateFilterName,ob);
      var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.dataSource2.filterPredicate = this.createFilterPredicate;
      this.dataSource2.filter = jsonString;
    }
    
    // this.dataSource2.data.filter(e=> e.start_date >= moment(this.dateFilterForm.value.fromDate).toDate() && e.end_date <= moment(this.dateFilterForm.value.toDate).toDate());
  // }
  
}
createFilterPredicate(data:FinancialAgreement, filter:string) {
  // console.log('data:', data);
  // let searchString = JSON.parse(filter);
  // return data.admissionno.toString().trim().indexOf(searchString.admissionno) !== -1 &&      
  // data.firstname.toString().trim().toLowerCase().indexOf(searchString.firstname.toLowerCase()) !== -1;
  // this.dataSource.filterPredicate = function (data,filter) {
    // console.log('Filter Predicate');
    
    var map = new Map<string,_moment.Moment>(JSON.parse(filter));
    // console.log('map:',map)
    let isMatch = false;
    for(let [key,value] of map){
      // debugger
      // isMatch = (value=="All") || (data[key as keyof FinancialAgreement] == value); 
      if(key=='start_date'){
        // console.log('value  :',value);
      // console.log('value valid :',value.isValid);
      // console.log('filter value formated:',moment(value).format('DD-MMM-yyyy'));
      // if(value.isValid)
        // isMatch = moment(value).isSameOrBefore(data[key]);
        isMatch = moment(value.toISOString(),'MM/DD/YYYY').isSameOrBefore(moment(new Date(data[key]).toISOString(),'MM/DD/YYYY'));
      // else if(!value.isValid)
      //   isMatch = true;
        // console.log('data value: ',data[key]);
        // console.log('Condition output: ',moment(value).isSameOrAfter(data[key]));
        
      } 
      else if(key == 'end_date'){
        // if(value.isValid)
          // isMatch = moment(value).isSameOrAfter(data[key]); 
          isMatch = moment(value.toISOString(),'MM/DD/YYYY').isSameOrAfter(moment(new Date(data[key]).toISOString(),'MM/DD/YYYY'));
        // else if(!value.isValid)
        //   isMatch = true;
      }
      if(!isMatch) 
        return false;
    }
    return isMatch;
  // }
}
clearToDate(){
  this.dateFilterForm.controls.toDate.reset();
  console.log('after to date clear:', this.dateFilterForm.value.toDate);
  this.applyDateFilter('end_date',this.dateFilterForm.value.toDate);
}
clearFromDate(){
  this.dateFilterForm.controls.fromDate.reset();
  console.log('after from date clear:', this.dateFilterForm.value.fromDate);
  this.applyDateFilter('start_date',this.dateFilterForm.value.toDate);
}


true:boolean=true;
  
  // range = new FormGroup({
  //   start_date: new FormControl(),
  //   end_date: new FormControl(),
  // });
  // clearStartDate(event) {
  //   event.stopPropagation();
  //   this.range.controls.start_date.reset();
  // }
  // clearEndDate(event) {
  //   event.stopPropagation();
  //   this.range.controls.end_date.reset();
  // }
  // filterByDate(){
    // let from:Date = this.range.controls.start_date.value;
    // let to:Date = this.range.controls.end_date.value;
    // startDate.
    // console.log( from );
    // console.log( to);
    // if(from!=null && to!=null)
    //   this.dataSource2.data = this.dataSource2.data.filter(e=> e.start_date >= from.toDate() && e.end_date <= to.toDate());
    // if(from==null && to!=null)
    //   this.dataSource2.data = this.dataSource2.data.filter(e=> e.start_date >= from.toDate() && e.end_date <= to.toDate());
    // if(from!=null && to==null)
      // this.dataSource2.data = this.dataSource2.data.filter(e=> e.start_date >= from );
    // if(from==null && to==null)
      // this.dataSource2.data = this.dataSource2.data;
  // }

}
export interface PeriodicElement {
  donorref: string;
  donortit: string;
  donor: string;
  fundingorg: string;
  resporg: string;
  startDate: string;
  endDate:string;
  // dateofsign:string;
  financingsit: string;
  typeofaid: string;
  amountmzn:number;
  amountusd:number;


}

export enum SelectType {
  single,
  multiple
}