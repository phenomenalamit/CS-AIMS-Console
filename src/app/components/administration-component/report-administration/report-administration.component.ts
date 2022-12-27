import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportAdministration } from 'src/app/Service-Class/report-administration';
import { ReportAdministrationServiceService } from 'src/app/Service/report-administration-service.service';
import Swal from 'sweetalert2';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

@Component({
  selector: 'app-report-administration',
  templateUrl: './report-administration.component.html',
  styleUrls: ['./report-administration.component.css']
})
export class ReportAdministrationComponent implements OnInit {
  num: any;
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  authorised_flag=false;
  tabClick(index: number) {
    this.num = index;
  }
  constructor(private fb: FormBuilder, private reportAdminService: ReportAdministrationServiceService) { }

  public reportAdminForm!: FormGroup;
  isReadOnly: any = [];
  headers: any = [];
  reportList!: ReportAdministration[];
  reportObj :ReportAdministration = new ReportAdministration();
  chkDetails:number=0;
  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.headers = ["Report Name", "Status"];
    this.reportAdminForm = new FormGroup({
      tableData: this.fb.array([
      ]),
    });
    this.setToUserPermission();

    this.reportAdminService.getReportAdmin().subscribe(data => {
      console.log("data" + data);
      this.reportList = data;
      console.log("reportList is:", this.reportList);
      for (let i = 0; i < this.reportList.length; i++) {
        this.addNew();
      }
      for (let i = 0; i < this.reportList.length; i++) {
        console.log("this.reportList[i].reportId:" + this.reportList[i].reportId);
        ((this.reportAdminForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('id')
          .patchValue(this.reportList[i].reportId);


        ((this.reportAdminForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('reportName')
          .patchValue(this.reportList[i].reportName);

          ((this.reportAdminForm.get('tableData') as FormArray).at(i) as FormGroup)
          .get('status')
          .patchValue(this.reportList[i].status);
          (this.reportAdminForm.get('tableData') as FormArray).disable();
      }
      for(let j=0;j<(this.reportAdminForm.get('tableData') as FormArray).length;j++)
      {
        (this.reportAdminForm.get('tableData') as FormArray).at(j).disable();
      this.isReadOnly[j]=true;
      this.editing[j]=true;
    }
    this.chkAddDetails=0

    })
  }

  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Report Administration')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Report Administration'){
        this.authorised_flag=true;
      }
    }
  }
  chkAddDetails:number=0;
  addNew() {

    const row = this.fb.group({
      id: new FormControl(''),
      reportName: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)

    });
    // this.dateFormArray.push(row);
    this.dateFormArray.insert(0,row);
    let lastIndex = (this.reportAdminForm.get('tableData') as FormArray).length - 1;
    this.chkAddDetails=this.chkAddDetails+1;
    for(let i=0;i<this.chkAddDetails;i++){
      this.isReadOnly[i]=false;
     }
    // this.isReadOnly[0] = false;
  }
  editing:any=[];
  editRow(j:any){
    (this.reportAdminForm.get('tableData') as FormArray).at(j).enable();
    this.isReadOnly[j]=false;
    this.editing[j] = true;

  }
  get dateFormArray(): FormArray {

    return this.reportAdminForm.get('tableData') as FormArray;

  }
  addNewflag:any=false;
  saveRow(j){


    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("id:"+((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("id").value);

         console.log("reportName:"+((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("reportName").value);

         console.log("status:"+((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("status").value);

    this.reportObj.reportId = ((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("id").value;
    this.reportObj.reportName = ((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("reportName").value;
    this.reportObj.status = ((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("status").value;

    this.reportAdminService.saveReports(this.reportObj).subscribe(data=>{
      console.log("save new element:-->>", this.reportAdminService.saveReports(this.reportObj));
    });
        (this.reportAdminForm.get('tableData') as FormArray).at(j).disable();
        this.isReadOnly[j]=true;
    this.editing[j] = false;
        Swal.fire('Submitted Successfully', '', 'success')
        this.chkDetails=this.chkDetails-1;

      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })


  }
  deleteRow(j){

    Swal.fire({
      title: 'Do you want to Delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Delete`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let id = ((this.reportAdminForm.get('tableData') as FormArray).at(j) as FormGroup).get("id").value;
        this.reportAdminService.deleteReports(id).subscribe(data=>{
          console.log("delete element:-->>", this.reportAdminService.deleteReports(id));
          this.reportList = data;
        });
        this.dateFormArray.removeAt(j);
        this.isReadOnly[j]=true;
    this.editing[j]=true;
        Swal.fire('Deleted Successfully!', '', 'success')
        this.chkDetails=this.chkDetails-1;

      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  addRow() {
    const row = this.fb.group({
     id:[''],
     reportName:['', Validators.required],
     property:['', Validators.required],


   });

   //this.dateFormArray.push(row);
   console.log(row);
   (this.reportAdminForm.get('tableData') as FormArray).push(row);
 }

 cancelRow(j:any){

  (this.reportAdminForm.get('tableData') as FormArray).at(j).disable();
  this.isReadOnly[j]=true;
  this.editing[j] = false;
  if(this.addNewflag===true)
  {
  (this.reportAdminForm.get('tableData') as FormArray).removeAt(j);
  this.addNewflag=false;
  }
}
}

