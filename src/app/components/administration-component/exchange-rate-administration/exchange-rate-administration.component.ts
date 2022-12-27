// Business Logic TS for Exchange rate administration
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/Service-Class/currency';
import { CurrencyService } from 'src/app/Service/currency.service';
import exchangeRateData from '../../../data/exchange-rate-data.json';
import { tap, map, startWith, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ExchangeRateServiceService } from 'src/app/Service/exchange-rate-service.service';
import { ExchangeRate, ExchangeRateBean } from 'src/app/Service-Class/exchange-rate';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConditionalExpr } from '@angular/compiler';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-exchange-rate-administration',
  templateUrl: './exchange-rate-administration.component.html',
  styleUrls: ['./exchange-rate-administration.component.css']
})
export class ExchangeRateAdministrationComponent implements OnInit {
  num:any;
  tabClick(index: number) {
    this.num=index;
  }
  chkAddDetails:number=0;
  constructor(private fb: FormBuilder,private currencyService: CurrencyService,private router: Router,
    private exchangeRateService:ExchangeRateServiceService,
    private currencyPipe: CurrencyPipe,public translate: TranslateService) { 
    // this.ngOnInit();
    // this.setToAuthFlag();
    // this.setToUserPermission();
    this.getCurrencyDetails();
     
    }
  public exchangeRate!: FormGroup;
  isReadOnly:any=[];
  headers:any=[];
  exchangeRateList!:ExchangeRate[];
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  authorised_flag=false;
  exchangeRateObj :ExchangeRate = new ExchangeRate();
  filterSelectObj = [];
   /* This is for open currency */
   openCurrencySearch(e, index) {
    ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('searchCurrency').patchValue('');
  }
 id:any=null;
 allYear:any=[];
 allCrncy:any=[];
exchangeRatedataSource = new MatTableDataSource<ExchangeRate>(this.exchangeRateList);

@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
rowAdd:number=0;
totalRow=0
lastRow=false;
pgLoading=0 // 0 means pg loading tym
currenyList: Currency[];
 getAllData(){
  this.exchangeRateList=[];
  this.exchangeRateService.getExchangeRate().subscribe(data => {
    
    this.exchangeRateList = data;
    console.log("echnage rate get all data")
    // this.getCurrencyDetails();
    if(this.pgLoading==0){
      if(this.exchangeRateList.length>5){
        this.rowAdd=5;
      }else{
        this.rowAdd=this.exchangeRateList.length
      }
    
    
    this.totalRow=this.exchangeRateList.length;
    this.exchangeRatedataSource = new MatTableDataSource<ExchangeRate>(this.exchangeRateList);
    /* Set Paginator */
    setTimeout(() =>
    this.exchangeRatedataSource.paginator = this.paginator
  );
  /* Set sorting */
  setTimeout(() =>
    this.exchangeRatedataSource.sort = this.sort
  );
    console.log("this.exchangeRateList.length:",this.exchangeRateList);
    for(let j=this.dateFormArray.length;j>0;j--){
      this.dateFormArray.removeAt(j);
    }
    if(this.dateFormArray.length>0){
      this.dateFormArray.removeAt(0);
    }
    // for(let i=0;i<this.rowAdd;i++){
      for(let i=0;i<this.exchangeRateList.length;i++){
      this.addNew();
      this.chkAddDetails=0
      this.chkcrncyAllCallOrNot=this.chkcrncyAllCallOrNot+1
    }
      
    //  for (let i = 0; i < this.rowAdd; i++) {
      // if(this.chkcrncyAllCallOrNot==this.exchangeRateList.length){
      for (let i = 0; i < this.exchangeRateList.length; i++) {
       console.log("this.exchangeRateList[i].exchange_rate_id:" + this.exchangeRateList[i].exchangeRateId);
       ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
         .get('id').patchValue(this.exchangeRateList[i].exchangeRateId);
       ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
         .get('year').patchValue(this.exchangeRateList[i].year);
         this.year.push(this.exchangeRateList[i].year)
       let currencyId = Number.parseInt(this.exchangeRateList[i].currency);
  ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('currency').setValue(currencyId);
  this.crncy.push(this.exchangeRateList[i].currencyFullName+' ('+this.exchangeRateList[i].currencyShortName+')');
  // ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('currency').setValue(this.currenyList.find(x => x.currency_id == currencyId).currency_id);
// ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
//               .get('currency')
//               .patchValue(this.exchangeRateList[i].currency);
       let unit = this.exchangeRateList[i].unit
       let mznAmount = this.exchangeRateList[i].mznAmount;
       let usdAmnt = this.exchangeRateList[i].usdAmount;

       mznAmount = mznAmount * unit;
       usdAmnt = usdAmnt * unit;
       ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('unit').patchValue((this.exchangeRateList[i].unit).toString());
       let currency_id=Number.parseInt(this.exchangeRateList[i].currency);
       let currencyShortnmUsd="USD";
       let currencyShortnmMzn="MZN";
       let currency_shortname=''
      
       console.log("Currency Length:",this.currenyList.length);
       for(let k=0;k<this.currenyList.length;k++){
        if(currency_id == this.currenyList[k].currency_id){
          currency_shortname=this.currenyList[k].currency_shortname;
          break;
        }
      }
    
          if(currency_shortname == currencyShortnmUsd){
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountUSD')
         .patchValue((this.currencyPipe.transform(1, " ")));
        
          }else{
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountUSD')
         .patchValue((this.currencyPipe.transform(usdAmnt, " ")));
          }
          if(currency_shortname == currencyShortnmMzn){
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountMZN')
            .patchValue((this.currencyPipe.transform(1, " ")));
         break;
          }else{
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountMZN')
         .patchValue((this.currencyPipe.transform(mznAmount, " ")));
          }
       
       (this.exchangeRate.get('tableData') as FormArray).disable();
    //  }
    }
     this.year = [...new Set(this.year)];
     this.crncy= [...new Set(this.crncy)];
     this.allYear=this.year;
     this.allCrncy=this.crncy;
    for(let j=0;j<(this.exchangeRate.get('tableData') as FormArray).length;j++)
{
  (this.exchangeRate.get('tableData') as FormArray).at(j).disable();
this.isReadOnly[j]=true;
this.editing[j]=true;
}
this.filterSelectObj.filter((o) => {
  o.options = this.getFilterObject(this.exchangeRateList, o.columnProp);
});}
   });
  
 }
 /* Reset table filters */
 resetFilters() {
  // this.ngOnInit();
  let currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);
  // this.router
  // .navigateByUrl('/', { skipLocationChange: true })
  // .then(() => this.router.navigate([currentUrl]));
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
chkcrncyAllCallOrNot:number=0;

  ngOnInit(): void {
    this.browserLang=localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
    this.browserLang = 'en';
  this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
  console.log("this.browserLang", this.browserLang);
    // this.browserLang=localStorage.getItem("browserLang");
    
      this.filterSelectObj = [
        {
          name: 'Filter Year',
          columnProp: 'year',
          options: []
        }
        , {
          name: 'Filter currency',
          columnProp: 'currencyFullName',
          options: []
        },
      ]
    // }
    // else{
    //   this.filterSelectObj = [
    //     {
    //       name: 'Filtre Ano',
    //       columnProp: 'year',
    //       options: []
    //     }
    //     , {
    //       name: 'Filtrar Moeda',
    //       columnProp: 'currencyFullName',
    //       options: []
    //     },
    //   ]
    // }

    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.headers = ["Year","Currency","Unit","Amount (MZN)","Amount (USD)"];
    this.setToAuthFlag();
    this.setToUserPermission();
    this.FAExchangeRatePopUp = localStorage.getItem('FAExchangeRatePopUp');
    console.log("currency ",this.currencyfilteredOption);
    this.exchangeRate = new FormGroup({
      // year:new FormControl('', [Validators.required]),
      // currency:new FormControl('', [Validators.required]),
      // amountMZN:new FormControl('', [Validators.required]),
      // amountUSD:new FormControl('', [Validators.required]),
      tableData: this.fb.array([
      ]),
     });
    
this.getAllData();
    
    
//      for(let i=0;i<exchangeRateData.exchange_rate_Data_Json.length;i++){
//      const row = this.fb.group({
//       year: [exchangeRateData.exchange_rate_Data_Json[i].year],
//     currency:[exchangeRateData.exchange_rate_Data_Json[i].currency],
//     amountMZN:[exchangeRateData.exchange_rate_Data_Json[i].amountMZN],
//     amountUSD:[exchangeRateData.exchange_rate_Data_Json[i].amountUSD]

    
// });
    
// (this.exchangeRate.get('tableData') as FormArray).push(row);
// (this.exchangeRate.get('tableData') as FormArray).disable();
// //console.log("All DAta ",(this.exchangeRate.get('tableData') as FormArray).at(i).value)
//   }
}
ngOnDestroy(){
  localStorage.setItem('FAExchangeRatePopUp','No');
}
  addRow() {
     const row = this.fb.group({
      id:[''],
      year:['', Validators.required],
      currency:['', Validators.required],
      amountMZN:['', Validators.required],
      amountUSD:['', Validators.required],
      searchCurrency: [''],

    });

    //this.dateFormArray.push(row);
    console.log(row);
    (this.exchangeRate.get('tableData') as FormArray).push(row);
  }
editing:any=[];
editRow(j:any){
  (this.exchangeRate.get('tableData') as FormArray).at(j).enable();
  this.isReadOnly[j]=false;
  this.editing[j] = true;
  this.id=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('id').value;
  let mznAmount=(((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('amountMZN').value).split(",").join("");
  let usdAmnt=(((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('amountUSD').value).split(",").join("");
  ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('amountMZN').setValue(mznAmount);
  ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('amountUSD').setValue(usdAmnt);
  console.log("id ",this.id)
}
//tableLength:any=(this.exchangeRate.get('tableData') as FormArray).length;
get dateFormArray(): FormArray {

  return this.exchangeRate.get('tableData') as FormArray;

}
browserLang:any
getValueByLang(){
  this.browserLang = localStorage.getItem("browserLang");
}
deleteRow(j){
  this.getValueByLang()
  Swal.fire({
    title: (this.browserLang=='en')? 'Do you want to delete?':'Deseja Apagar?',
    showDenyButton: true,
    // showCancelButton: true,
    confirmButtonText:(this.browserLang=='en')? `Delete`:'Apagar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
  }).then((result) => {


    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      let id = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("id").value;
      this.exchangeRateService.deleteExchangeRate(id).subscribe(data=>{
        console.log("delete element:-->>", this.exchangeRateService.deleteExchangeRate(id));
        this.exchangeRateList = data;
      });
      this.dateFormArray.removeAt(j);
      this.isReadOnly[j]=true;
  this.editing[j]=true;
  this.getValueByLang()
  if(this.browserLang=='en')
      Swal.fire('Deleted successfully', '', 'success')
else
Swal.fire('Apagado com sucesso', '', 'success')
      
    } else if (result.isDenied) {
      if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else{
          Swal.fire('Cancelado', '', 'info')
        }
    }
  })
}
  addNew(){
     this.getCurrencyDetails();
      const row = this.fb.group({
        id:new FormControl(''),
        year: new FormControl('',Validators.required),
        currency: new FormControl('',Validators.required),
        unit:new FormControl('',Validators.required),
        amountMZN:new FormControl('',Validators.required),
        amountUSD:new FormControl('',Validators.required),
        searchCurrency: [''],

        // id: [''],
        // year:['', Validators.required],
        // currency:['', Validators.required],
        // amountMZN:['', Validators.required],
        // amountUSD:['', Validators.required]
      
  });
  this.dateFormArray.insert(0,row);
  // console.log("chkAddDetails " ,this.chkAddDetails)
  this.chkAddDetails=this.chkAddDetails+1;
   let lastIndex=(this.exchangeRate.get('tableData') as FormArray).length-1;
   for(let i=0;i<this.chkAddDetails;i++){
    this.isReadOnly[i]=false;
   }
   
    
  ((this.exchangeRate.get('tableData') as FormArray).at(0) as FormGroup).get('amountMZN').disable();
  ((this.exchangeRate.get('tableData') as FormArray).at(0) as FormGroup).get('amountUSD').disable();
  }
  addNewflag:any=false;
  dataSave(j){
    this.getValueByLang();
    // console.log("currency:"+((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("currency").value);
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {
  
  
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let unit=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('unit').value;
        let mznAmount=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountMZN").value;
        mznAmount=mznAmount/unit;
        // console.log("mznAmount ",mznAmount)
        let usdAmnt=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountUSD").value;
        usdAmnt=usdAmnt/unit
        // console.log("usdAmnt ",usdAmnt)
       this.exchangeRateObj.exchangeRateId = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("id").value;
    this.exchangeRateObj.currency = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("currency").value;
    let currencyShortnmUsd="USD";
    let currencyShortnmMzn="MZN"
    let shortNm='';
    // for(let i=0;i<this.currenyList.length;i++){
    //   if(Number.parseInt(this.exchangeRateObj.currency) ==this.currenyList[i].currency_id)
    //   {
    //     shortNm=this.currenyList[i].currency_shortname;
    //     if(shortNm == currencyShortnmUsd){
    //       this.exchangeRateObj.usdAmount = 1;
    //     break;
    //   }else{
    //     this.exchangeRateObj.usdAmount = usdAmnt
    //   }
    //   if(shortNm == currencyShortnmMzn){
    //     this.exchangeRateObj.mznAmount = 1;
    //   break;
    // }else{
    //   this.exchangeRateObj.mznAmount = mznAmount;
    // }
    //   }
      
        
    // }
    this.exchangeRateObj.usdAmount = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountUSD").value;
    this.exchangeRateObj.mznAmount = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountMZN").value;

    this.exchangeRateObj.unit=unit;
    this.exchangeRateObj.year = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("year").value;
    // this.exchangeRateObj.usdAmount = usdAmnt
    // this.exchangeRateObj.mznAmount = mznAmount;
    this.exchangeRateService.saveExchangeRate(this.exchangeRateObj).subscribe(data=>{
      // console.log("save new element:-->>", this.exchangeRateService.saveExchangeRate(this.exchangeRateObj));
      (this.exchangeRate.get('tableData') as FormArray).at(j).disable();
        this.isReadOnly[j]=true;
    this.editing[j] = false;
    this.getValueByLang()
    if(this.browserLang=='en'){
      Swal.fire('Submitted successfully', '', 'success');
    }else{
      Swal.fire('Submetido com sucesso', '', 'success');
    }
    // this.ngOnInit();   
    });
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  // this.router.onSameUrlNavigation = 'reload';
  // this.router.navigate([currentUrl]);
  // this.router
  // .navigateByUrl('/', { skipLocationChange: true })
  // .then(() => this.router.navigate([currentUrl]));
        
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
  saveRow(j){
let year=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("year").value;
let currency=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("currency").value;
let mznAmount=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountMZN").value;
let usdAmnt=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("amountUSD").value;
let unitValue=((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("unit").value;
// console.log("usd amnt ",usdAmnt)
if(year=='' || currency=='' || mznAmount=='' || usdAmnt=='' || unitValue=='' ||
year==null || currency==null || mznAmount==null || usdAmnt==null || unitValue==null){
  this.getValueByLang();
  if(this.browserLang=='en')
  Swal.fire('Please fill all mandatory fields.')
  else
  Swal.fire('Por favor preencha todos os campos obrigatórios.')
}else{
for(let i=0;i<this.exchangeRateList.length;i++){
  if(this.id != this.exchangeRateList[i].exchangeRateId){
    if(year==this.exchangeRateList[i].year && currency==this.exchangeRateList[i].currency){
      if(this.browserLang=='en')
  Swal.fire('This year and currency already exist.');
  else
  Swal.fire('Este ano e a moeda já existem');
  ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("year").setValue('');
  ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get("currency").setValue('');
  break;
}else{
  this.dataSave(j);
}
}else{
  this.dataSave(j);
}
}
    
}
   
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Exchange Rate Administration')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Exchange Rate Administration'){
        this.authorised_flag=true;
      }
    }
  }

  cancelRow(j:any){
    // this.ngOnInit();
    (this.exchangeRate.get('tableData') as FormArray).at(j).disable();
    this.isReadOnly[j]=true;
    this.editing[j] = false;
    if(this.addNewflag===true)
    {
    (this.exchangeRate.get('tableData') as FormArray).removeAt(j);
    this.addNewflag=false;  
    }
    // let currentUrl = this.router.url;
  //   this.router
  // .navigateByUrl('/', { skipLocationChange: true })
  // .then(() => this.router.navigate([currentUrl]));
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  // this.router.onSameUrlNavigation = 'reload';
  // this.router.navigate([currentUrl]);
  }
  // currenyList: Currency[];
  currencyfilteredOption: Observable<Currency[]>[] = [];;
   /* Here we call service to get all currency list that will present in db */
   private getCurrencyDetails() {
    
      this.currencyService.getCurrencyDetails().subscribe(data => {
      this.currenyList = data;
     
      // console.log(" this.currenyList", this.currenyList);
      for (let i = 0; i < (this.exchangeRate.get('tableData') as FormArray).length; i++) {
        
        this.currencyfilteredOption[i] = ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
          .get('searchCurrency').valueChanges
          .pipe(
            startWith(''),
            map(name => name ? this.filterCurrency(name) : this.currenyList.slice())
          );
         
      }
    });
  

  }

  chkCurrency(event, j) {
    if (event.keyCode == 8) {
      this.filterCurrency(((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('currency').value);
    }
    this.filterCurrency(((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('currency').value);
    let currency = ((this.exchangeRate.get('tableData') as FormArray).at(j) as FormGroup).get('currency').value;
    if (currency == null || currency == '' || currency == undefined) {
      this.getCurrencyDetails();
      this.getValueByLang()
      Swal.fire({
        title: (this.browserLang=='en')?'Kindly select a Currency':'Por favor, seleccione uma Moeda',
        confirmButtonText: `OK`,
      })
    }
  }
  unit:any=null;
  MznUsdChk(index){
    // ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').enable();
    // ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').enable();
    let currency_id=((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('currency').value;
    let currencyShortnmUsd="USD";
      let currencyShortnmMzn="MZN"
      let currency_shortname='';
      // console.log("unit ",((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('unit').value)
      if(((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('unit').value >0 || 
      ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('unit').value !=''){
        this.unit=((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('unit').value;
      }
      for(let i=0;i<this.currenyList.length;i++){
        if(currency_id == this.currenyList[i].currency_id){
          currency_shortname=this.currenyList[i].currency_shortname;
          if(currency_shortname == currencyShortnmUsd){
            ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').setValue(1);
            ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').disable();
          break;
        }else{
          if(this.unit !=null)
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').enable();
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').reset();

        }
        if(currency_shortname == currencyShortnmMzn){
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').setValue(1)
        break;
      }else{
        if(this.unit !=null)
        ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').enable();
      ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').reset();
      }
        }
         
      }}
enableMznUsd(index){
  this.getValueByLang()
  // ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').enable();
  // ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').enable();
  let currency_id=((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('currency').value;
  if(currency_id == ''){
    (this.browserLang=='en')?Swal.fire('Kindly select a Currency'):Swal.fire('Por favor, seleccione uma Moeda')
  }
  let currencyShortnmUsd="USD";
    let currencyShortnmMzn="MZN"
    let currency_shortname='';
    for(let i=0;i<this.currenyList.length;i++){
      if(currency_id == this.currenyList[i].currency_id){
        currency_shortname=this.currenyList[i].currency_shortname;
        if(currency_shortname == currencyShortnmUsd){
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').setValue(1);
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').disable();
          ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').enable();
          break;
      }else{
        ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountUSD').enable();
      }
      if(currency_shortname == currencyShortnmMzn){
        ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').setValue(1)
      break;
    }else{
      ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('amountMZN').enable();
    }
      }
       
    }
}
  /* This is for clear currency that you will search*/
  clearCurrencySearch(e, index) {
    event.stopPropagation();
    ((this.exchangeRate.get('tableData') as FormArray).at(index) as FormGroup).get('searchCurrency').patchValue('');
  }
  filterValues = {};
   /* This is for filter data that will be present in db */
   filterChange(filter, event) {
   this.yearData=[];
   this.yearData=event.value;
  }
  crncyDAta:any=[]
  currencyChange(filter, event) {
    this.crncyDAta=[];
    this.crncyDAta=event.value;
    console.log("crncyDAta ",this.crncyDAta)
   }
  searchFilter = new FormControl('');
  openOptionSearch(filter) {
    this.searchFilter.patchValue('');
    this.filterSelectObj.filter((o) => {
      if (o.columnProp == 'year') {
        o.options = this.allYear, 'year';
      }
    });

    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'currencyFullName')
      o.options = this.allCrncy, 'currencyFullName';
    });
  }
  year:any=[];
  crncy:any=[];
  chkValue(filter) {
    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let year=[];
    let currency=[]
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.exchangeRateList.length; i++) {
       
        if (columnName == 'year') {
          if (this.year.length == 0) {
            if (((this.exchangeRateList[i].year).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              year.push(this.exchangeRateList[i].year);
            }
          } else if (this.year.length != 0) {
            if (this.year[i] != undefined) {
              if (((this.year[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                year.push(this.year[i]);
              }
            }
          }
        }
        if (columnName == 'currencyFullName') {
          if (this.crncy.length == 0) {
            if (((this.exchangeRateList[i].currencyFullName).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              currency.push(this.exchangeRateList[i].currencyFullName+' ('+this.exchangeRateList[i].currencyShortName+')');
            }
          } else if (this.crncy.length != 0) {
            if (this.crncy[i] != undefined) {
              if (((this.crncy[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                currency.push(this.crncy[i]);
              }
            }
          }
        }
    }
  }
    if (columnName == 'year') {
      year = [...new Set(year)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'year') {
          o.options = year, 'year';
        }
      });
    }

    if (columnName == 'currencyFullName') {
      currency = [...new Set(currency)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'currencyFullName') {
          o.options = currency, 'currencyFullName';
        }
      });
    }

  if (searchFilterVal.length == 0 && columnName== 'year' && this.year.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'year')
      o.options = this.year, 'year';
    });
  }
  if (searchFilterVal.length == 0 && columnName== 'currencyFullName' && this.crncy.length!=0) {
    this.filterSelectObj.filter((o) => {
      if(o.columnProp== 'currencyFullName')
      o.options = this.crncy, 'currencyFullName';
    });
  }
  }
  yearData:any=[];
  exchangeData:ExchangeRateBean = new ExchangeRateBean();
  submitData(){
    //  console.log("values ",this.yearData)

    this.exchangeData.yearInArray=this.yearData
    this.exchangeData.currencyFullNameInArray=this.crncyDAta;

     if(this.yearData.length>0 || this.crncyDAta.length>0){
    this.exchangeRateService.filterData(this.exchangeData).pipe(first()).subscribe(
      data => {
        this.exchangeRateList=[];
        this.exchangeRateList = data;
        for(let j=this.dateFormArray.length;j>0;j--){
          this.dateFormArray.removeAt(j);
        }
        if(this.dateFormArray.length>0){
          this.dateFormArray.removeAt(0);
        }
        for(let k=0;k<this.exchangeRateList.length;k++){
          this.addNew();
          this.chkAddDetails=0
        }
        // console.log("this.exchangeRateList: " , this.exchangeRateList);
        for (let i = 0; i < this.exchangeRateList.length; i++) {
          
          ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
            .get('id').patchValue(this.exchangeRateList[i].exchangeRateId);
          ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup)
            .get('year').patchValue(this.exchangeRateList[i].year);
          let currencyId = Number.parseInt(this.exchangeRateList[i].currency);
          ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('currency').setValue(currencyId);

          let unit = this.exchangeRateList[i].unit
          let mznAmount = this.exchangeRateList[i].mznAmount;
          let usdAmnt = this.exchangeRateList[i].usdAmount;

          mznAmount = mznAmount * unit;
          usdAmnt = usdAmnt * unit;

          let currency_id = Number.parseInt(this.exchangeRateList[i].currency);
          let currencyShortnmUsd = "USD";
          let currencyShortnmMzn = "MZN";
          let currency_shortname = ''
          for (let k = 0; k < this.currenyList.length; k++) {
            if (currency_id == this.currenyList[k].currency_id) {
              currency_shortname = this.currenyList[k].currency_shortname;
              break;
            }
          }
          if (currency_shortname == currencyShortnmUsd) {
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountUSD')
              .patchValue((this.currencyPipe.transform(1, " ")));

          } else {
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountUSD')
              .patchValue((this.currencyPipe.transform(usdAmnt, " ")));
          }
          if (currency_shortname == currencyShortnmMzn) {
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountMZN')
              .patchValue((this.currencyPipe.transform(1, " ")));
            break;
          } else {
            ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('amountMZN')
              .patchValue((this.currencyPipe.transform(mznAmount, " ")));
          }


          ((this.exchangeRate.get('tableData') as FormArray).at(i) as FormGroup).get('unit').patchValue((this.exchangeRateList[i].unit).toString());


          (this.exchangeRate.get('tableData') as FormArray).disable();
        }
    
        for(let j=0;j<(this.exchangeRate.get('tableData') as FormArray).length;j++)
    {
      (this.exchangeRate.get('tableData') as FormArray).at(j).disable();
    this.isReadOnly[j]=true;
    this.editing[j]=true;
    }

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
    }else{
      this.getAllData();
    }
  }
  private filterCurrency(name: string) {
    return this.currenyList.filter(currencyData =>
      currencyData.currency_fullname.normalize('NFD').
        replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1 || currencyData.currency_shortname.normalize('NFD').
        replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
  }
  page=1;
  selected :any= '5';
  changePage(pgnm:string){
    this.pgLoading=1
    if(pgnm=='btn_prev'){
      if(this.rowAdd >5){
        this.rowAdd-=5;
        this.selected=Number.parseInt(this.selected);
        this.selected= this.selected/2;
        this.page-=1
        if(this.page==1){
          this.pgLoading=0
        }
        
      }
      this.selected=(this.selected).toString();
    }else{
      let totalRow=this.exchangeRateList.length;
      this.rowAdd+=5;
      if(this.rowAdd >totalRow){
        let extraRow=this.rowAdd-totalRow;
        this.rowAdd=this.rowAdd-extraRow
        this.lastRow=true
        
      }
      this.page++;
      this.selected=Number.parseInt(this.selected);
      this.selected= this.selected*2;
      this.selected=(this.selected).toString();
    }

this.getAllData();
  }
  FAExchangeRatePopUp:string = '';
  closebuttonedit(){
    localStorage.setItem('FAExchangeRatePopUp','No');
  }
}
function tableData(arg0: FormArray) {
  throw new Error('Function not implemented.');
}