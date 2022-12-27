/**
 * View FunctionMaster services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { FunctionMaster, FunctionMasterFilterBean } from 'src/app/model/function-master';
import { FunctionMasterService } from 'src/app/Service-Application/function-master.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

// import { GlobalLink } from 'src/app/global-link';
// import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';

@Component({
  selector: 'app-view-function-master-component',
  templateUrl: './view-function-master-component.component.html',
  styleUrls: ['./view-function-master-component.component.css']
})
export class ViewFunctionMasterComponentComponent implements OnInit {
  functionMasterList: FunctionMaster[];
  functionMaster: FunctionMaster;
  uAccessPermArr:UserAccessPermission[]=[];
  functionMasterNameData : FunctionMasterFilterBean = null;
  userPermission:number[]=[];
  filterSelectObj = [];
  authorised_flag=false;
  public functionMasterForm!: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  functionMasterdataSource = new MatTableDataSource<FunctionMaster>();

  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  displayedColumns: string[] = ['edit','functionName','fileName','description', 'status'];
  totalRows: any;
  browserLang: any;
  constructor(private functionMasterService: FunctionMasterService, private router: Router,
    public translate: TranslateService,private location: Location) {
    
    }



  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    if(this.browserLang==='en')
    {
      this.filterSelectObj = [
        {
          name: 'Filter Function Name',
          columnProp: 'functionName',
          options: []
        },
        {
          name: 'Filter File Name',
          columnProp: 'fileName',
          options: []
        },
        {
          name: 'Filter Status',
          columnProp: 'status',
          options: []
        }
      ];

    }
    else{
      this.filterSelectObj = [
        {
          name: 'Filtre Nome da Função',
          columnProp: 'functionName',
          options: []
        },
        {
          name: 'Filtre Nome do arquivo',
          columnProp: 'fileName',
          options: []
        },
        {
          name: 'Filtre Estado',
          columnProp: 'status',
          options: []
        }
      ];
    }
    this.functionMasterForm = new FormGroup({
      functionName: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      description: new FormControl(),

      action: new FormControl(),

    });
    this.setToAuthFlag();
    this.setToUserPermission();
    this.fetchFunctionMasterData();
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Function Master')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='View Function Master'){
        this.authorised_flag=true;
      }
    }
  }

  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
  }

  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let functionName=[];
    let  fileName=[];
    let functionNameStatus=[];
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.functionMasterList.length; i++) {
       
        if (columnName == 'functionName') {
          if(this.functionName.length ==0){
          if (((this.functionMasterList[i].functionName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            functionName.push(this.functionMasterList[i].functionName);
          }
        }else if(this.functionName.length !=0){
          if(this.functionName[i] !=undefined)  {
          if (((this.functionName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
            functionName.push(this.functionName[i]);
          }
        }
        } 
            
      }

      if (columnName == 'fileName') {
        if(this.fileName.length ==0){
        if (((this.functionMasterList[i].fileName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          fileName.push(this.functionMasterList[i].fileName);
        }
      }else if(this.fileName.length !=0){
        if(this.fileName[i] !=undefined)  {
        if (((this.fileName[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
          fileName.push(this.fileName[i]);
        }
      }
      } 
          
    }

    if (columnName == 'status') {
      if(this.functionNameStatus.length ==0){
      if (((this.functionMasterList[i].status).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
        functionNameStatus.push(this.functionMasterList[i].status);
      }
    }else if(this.functionNameStatus.length !=0){
      if(this.functionNameStatus[i] !=undefined)  {
      if (((this.functionNameStatus[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
        functionNameStatus.push(this.functionNameStatus[i]);
      }
    }
    } 
        
  }
    }
  }
  if(columnName == 'functionName') {
    functionName = [...new Set(functionName)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'functionName') {
        o.options = functionName, 'functionName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'functionName' && this.functionName.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'functionName')
      o.options = this.functionName, 'functionName';
    });
  }

  if(columnName == 'fileName') {
    fileName = [...new Set(fileName)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'fileName') {
        o.options = fileName, 'fileName';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'fileName' && this.fileName.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp == 'fileName')
      o.options = this.fileName, 'fileName';
    });
  }
  if(columnName == 'status') {
    functionNameStatus = [...new Set(functionNameStatus)];
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'status') {
        o.options = functionNameStatus, 'status';
      }
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'status' && this.functionNameStatus.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp == 'status')
      o.options = this.functionNameStatus, 'status';
    });
  }
  }

  functionName:any=[]
  functionNameChange(filter, event) {
    this.functionName=[]
    this.functionName=filter.modelValue;
  }

  fileName:any=[]
  fileNameChange(filter, event) {
    this.fileName=[]
    this.fileName=filter.modelValue;
  }

  functionNameStatus:any=[]
  statusChange(filter, event) {
    this.functionNameStatus=[]
    this.functionNameStatus=filter.modelValue;
  }

  submitData(){
    //  console.log("values ",this.yearData)
    this.functionMasterNameData = new FunctionMasterFilterBean();
    if(this.functionName.length == 0 || this.functionName == null || this.functionName == undefined){
      this.functionMasterList.forEach(data=>{
        this.functionMasterNameData.functionMasterNames.push(data.functionName);
      });
    }
    else{
      this.functionMasterNameData.functionMasterNames=this.functionName;
    }
    if(this.fileName.length == 0 || this.fileName == null || this.fileName == undefined){
      this.functionMasterList.forEach(data=>{
        this.functionMasterNameData.fileName.push(data.fileName);
      });
    }
    else{
      this.functionMasterNameData.fileName=this.fileName;
    }
    if(this.functionNameStatus.length == 0 || this.functionNameStatus == null || this.functionNameStatus == undefined){
      this.functionMasterList.forEach(data=>{
        this.functionMasterNameData.status.push(data.status);
      });
    }
    else{
      this.functionMasterNameData.status=this.functionNameStatus;
    }
    if(this.functionMasterNameData!=null){
      console.log('---->',this.functionMasterNameData);
      this.functionMasterService.filterData(this.functionMasterNameData).subscribe(data => {
        console.log("return data" + data.length);
        this.functionMasterList = data;
        this.totalRows = this.functionMasterList.length;
        this.functionMasterdataSource=new MatTableDataSource<FunctionMaster>(this.functionMasterList);
        console.log("envelopeDetails ",this.functionMasterdataSource);
        setTimeout(() =>
          this.functionMasterdataSource.paginator=this.paginator
        );
       setTimeout(() =>
          this.functionMasterdataSource.sort=this.sort
       );
       this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.functionMasterList, o.columnProp);
      });
     },
       /* If We get Any error then the error will show here
       *  Suppose we give a id that will not present in our db then it will show an error message
       */
       error => {

         console.log("error ", error);
         if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
           Swal.fire(error.error.message, '', 'error');
         } else {
           Swal.fire(error.error, '', 'error');
         }
     });
   }
 }

 resetFilters() {
  //   this.selectRef.forEach(function (el) {
  //     el.options.forEach((data: MatOption) => data.deselect());
  // });
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  moveToSelectedTab1() {
    this.location.back();
  }

  generateExcel() {
    window.open(environment.functionMasterExcelUrl,'_self');
  }

  private getFunctionMaster() {
    this.functionMasterService.getFunctionMasterList().subscribe(data => {
      console.log("return data" + data.length);
      this.functionMasterList = data;
    });
  }
  // get totalRows(): number {
  //   return this.functionMasterList.length;
  // }
  private fetchFunctionMasterData(){

    this.functionMasterService.getFunctionMasterList().subscribe(data => {
      console.log("return data" + data.length);
      this.functionMasterList = data;
      this.totalRows = this.functionMasterList.length;
      this.functionMasterdataSource=new MatTableDataSource<FunctionMaster>(this.functionMasterList);
      console.log("envelopeDetails ",this.functionMasterdataSource);
      setTimeout(() =>
        this.functionMasterdataSource.paginator=this.paginator
      );
     setTimeout(() =>
        this.functionMasterdataSource.sort=this.sort
     );
     this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.functionMasterList, o.columnProp);
    });


   });

  }

  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
         if (obj[key] != "") {
          uniqChk.push(obj[key]);
         }
      }
      return obj;
    });
    return uniqChk;
  }

  updateFunctionMaster(id: number){
    localStorage.setItem("editFunctionMaster", "editFunctionMaster");
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/admin/update-functionMaster',id]));


  }
  private updatefunctionMasterById(functionId: number) {
    this.functionMasterService.getFunctionMasterById(functionId)
      .subscribe(
        data => {
          this.functionMaster = data

          console.log("functionMaster class data");
          console.log(this.functionMaster);


        },
        error => console.log(error));
    }

  }
