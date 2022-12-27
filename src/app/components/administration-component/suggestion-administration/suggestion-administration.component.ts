// Business Logic TS component for Feedback Administration
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackServiceService } from 'src/app/Service/feedback-service.service';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import * as _moment from 'moment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackPopupComponent } from '../../dialogbox-components/feedback-popup/feedback-popup.component';
import { MatSelectChange } from '@angular/material/select';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const moment=_moment;
@Component({
  selector: 'app-suggestion-administration',
  templateUrl: './suggestion-administration.component.html',
  styleUrls: ['./suggestion-administration.component.css']
})
export class SuggestionAdministrationComponent implements OnInit, AfterViewInit, OnDestroy  {

 
  public feedBackForm!: FormGroup;
  public feedBackFilterForm!: FormGroup;
  headers=["Name","Email","Comments"];
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  private subs = new Subscription();

  displayedColumns: string[] = ['action','priority','feedbackDate','name', 'email', 'phone', 'organization', 'comments','status'];

  public dataSource: MatTableDataSource<Feedback> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('filterForm',{static:false}) public filterForm: NgForm;
  private dataArray: Feedback[]=[];

  num:any;
  resultsLength:number = 0;
  // isShown: boolean = false;

  constructor(private fb: FormBuilder,private feedbackService: FeedbackServiceService, private _snackBar: MatSnackBar
    ,private dialog: MatDialog,private router :Router,public translate: TranslateService) {
    // this.dataSource = new MatTableDataSource([]);
    
   }

 
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    this.feedBackFilterForm = new FormGroup({
      priority: new FormControl('All'),
      status: new FormControl('All'),
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });

    this.feedBackForm=new FormGroup({
      tableData: this.fb.array([
        this.fb.group({
          name: [{ value: '', disabled: true }],
          email: [{ value: '', disabled: true }],
          comments: [{ value: '', disabled: true }],
        })
      ])
    });
    this.setToAuthFlag();
    this.getFeedbacks();
    
  }
  ngAfterViewInit() {
    
  }
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
  getValueByLang() {
    this.browserLang = localStorage.getItem("browserLang");
  }
  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Suggestion Administration'){
        this.authorised_flag=true;
      }
    }
  }

  tabClick(index: number) {
    this.num=index;
  }
  
  public openRecord(id: number, name: string): void {
    this._snackBar.open(`Record ${id} ${name} `, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });    
  }
  priorityFilter:string[]=['All'];
  statusFilter: string[]=['All'];
  defaultValue:string = 'All';
  browserLang: any;
  private getFeedbacks(): Subscription{
    return this.subs.add(this.feedbackService.getFeedbacks()
      .subscribe((res:Feedback[]) => {
        this.dataArray = res;
        // console.log("Response : ",this.dataArray);
        this.dataArray.forEach(element => {
          if(element.organization=="" || element.organization==null)
            element.organization="-";
          if(element.telephone=="" || element.telephone==null)
            element.telephone="-";
          this.priorityFilter.push(element.priority);
          this.statusFilter.push(element.status);
        });
        this.dataArray.sort((a, b) => b.feedbackId - a.feedbackId);
        this.priorityFilter=[...new Set(this.priorityFilter)];
        this.statusFilter=[...new Set(this.statusFilter)];
        // this.feedbackFilters.push({name:'Priority',options:this.priorityFilter=[...new Set(this.priorityFilter)],defaultValue:this.defaultValue});
        // this.feedbackFilters.push({name:'Status',options:this.statusFilter=[...new Set(this.statusFilter)],defaultValue:this.defaultValue});
      
        this.resultsLength = res.length;
        this.dataSource = new MatTableDataSource<Feedback>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        }));
  }
  createFilterPredicate(data:Feedback, filter:string) {
   let fromDate = (<HTMLInputElement>document.getElementById("fromDate")).value;
   let toDate = (<HTMLInputElement>document.getElementById("toDate")).value;
   console.log(moment(data.createdOn).format('DD/MM/yyyy'),fromDate,toDate);
   console.log(moment(data.createdOn).isBetween(fromDate,toDate));
      var map = new Map(JSON.parse(filter));
      console.log('map: ',map);
      let isMatch = false;
      for(let [key,value] of map){
        if( fromDate!='' && toDate!='' ){
          isMatch = ( (value=="All") || (data[key as keyof Feedback] == value) ) && (moment(data.createdOn).isBetween(fromDate,toDate) ); 
        }else{
          isMatch = (value=="All") || (data[key as keyof Feedback] == value) ; 
        }
        
        if(!isMatch) return false;
      }
      return isMatch;
}
 
  edit(id:number){
    // this._snackBar.open("Feedback with Id: "+ Id +" edited successfully.","Ok");
    // (this.feedBackForm.get('tableData') as FormArray).at(j).enable();
    let element = this.dataArray.find( x => x.feedbackId==id);
    if(element.isEdit)
        element.isEdit = false;
      else
        element.isEdit = true;
  }


  ignoreFeedback(id:number) {
    this.getValueByLang();
    if(this.browserLang==='en')
    {
    Swal.fire({
      title: 'Do you want to Ignore this feedback? You will not be able to answer it later.',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedbackService.ignoreFeedback(id).subscribe(
          data =>
          {
            if(data.status==204)
            {
              this.dataArray.find(x => x.feedbackId==id).status="Ignored";
              Swal.fire("Feedback ignored successfully.");
            }
            // console.log('success', data)
          } ,
          error => {
            Swal.fire("Something went wrong, please try again later.")
            console.log('oops', error)
          }
        );
        // this._snackBar.open("Feedback with Id: "+ Id +" ignored successfully.","Ok");
        // this.status[i]="Ignored";
      }
    });
  }
  else{
    Swal.fire({
      title: 'Deseja Ignorar este feedback? Você não poderá respondê-lo mais tarde.',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Sim`,
      denyButtonText: `Não`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedbackService.ignoreFeedback(id).subscribe(
          data =>
          {
            if(data.status==204)
            {
              this.dataArray.find(x => x.feedbackId==id).status="Ignored";
              Swal.fire("Feedback ignored successfully.");
            }
            // console.log('success', data)
          } ,
          error => {
            Swal.fire("Something went wrong, please try again later.")
            console.log('oops', error)
          }
        );
        // this._snackBar.open("Feedback with Id: "+ Id +" ignored successfully.","Ok");
        // this.status[i]="Ignored";
      }
    });

  }
  }
  
  openPopup(id:number){
    const dialogRef = this.dialog.open(FeedbackPopupComponent,{
      data: this.dataArray.find(x=>x.feedbackId==id)
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result==='sent'){
      }
    });
  }
  // feedbackFilters: FeedBackFilter[]=[];
  filterDictionary= new Map<string,string>();
  dateFilterDictionary = new Map<string,Date>();
  resetFilter(){
    this.feedBackFilterForm.controls.priority.patchValue('All');
    this.feedBackFilterForm.controls.status.patchValue('All');
    this.clearFromDate();
    this.clearToDate();
    this.filterDictionary.set('status','All');
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filterPredicate = this.createFilterPredicate;
    this.dataSource.filter = jsonString;
    this.applyDateFilter();
  }
  applyFeedBackFilter(ob:MatSelectChange,feedbackfilter:string) {
    console.log(
    (<HTMLInputElement>document.getElementById("Priority")));
    this.filterDictionary.set(feedbackfilter,ob.value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filterPredicate = this.createFilterPredicate;
    this.dataSource.filter = jsonString;
  }
  applyDateFilter(){
    this.filterDictionary.set('priority',this.feedBackFilterForm.value.priority);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filterPredicate = this.createFilterPredicate;
    this.dataSource.filter = jsonString;
  }
  
  clearFromDate(){
    this.feedBackFilterForm.controls.fromDate.patchValue('');
  }
  clearToDate(){
    this.feedBackFilterForm.controls.toDate.patchValue('');
  }
  updateFeedback(feedback:Feedback){
    this.getValueByLang();
    //show pop up to confirm action
    Swal.fire({
      title: (this.browserLang == 'en') ? 'Do you want to Update?' : 'Você deseja actualizar?',
      showDenyButton: true,
      confirmButtonText: (this.browserLang == 'en') ? 'Update' : 'Actualizar',
      denyButtonText: (this.browserLang == 'en') ? 'Cancel' : 'Cancelar',
    }).then(result => {

      //check if update clicked
      if (result.isConfirmed) {

        //http request to update the label
        this.feedbackService.updateFeedback(feedback).subscribe(res => {

          //check the response
          if (res.status == 200) {

            //if success then set isEdit false to hide input text field and show updated label values
            feedback.isEdit = false;

            //show successful message with popup
            if (this.browserLang == 'en') {
              Swal.fire('Updated successfully', '', 'success');
            } else {
              Swal.fire('Actualizado com sucesso', '', 'success');
            }
          }
        },
          error => {
            Swal.fire("Something went wrong, please try again later.")
            console.log(error)
          });
      }
    })
  }
}
export interface FeedBackFilter {
  name:string;
  options:string[];
  defaultValue:string;
}

export interface filterOption{
  name:string;
  value:string;
  isdefault:boolean;
}