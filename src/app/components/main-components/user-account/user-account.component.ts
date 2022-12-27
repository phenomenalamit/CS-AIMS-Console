import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import { UserAccount } from 'src/app/model/user-account';
import Swal from 'sweetalert2';



const ELEMENT_DATA: UserAccount[] = [
  {firstName:'Karishma',lastName:'Kapoor',userName:'Karisma',email:'karisma@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Lopamudra',lastName:'Panda',userName:'Lopa',email:'karisma@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Prashant',lastName:'Kapoor',userName:'prashant',email:'prashant@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Amit',lastName:'Nayak',userName:'amit',email:'amit@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Raman',lastName:'Nayak',userName:'raman',email:'raman@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'},
  {firstName:'Pinaki',lastName:'Sahoo',userName:'pinaki',email:'pinaki@gmail.com',typeOfUser:'Donor',userGroup:'Donor Agency1',permissions:'8327755005',operations:'xyz',features:'cbc'}


  ];
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  public userAccountForm!: FormGroup;
  userAccount:UserAccount=new UserAccount();
  elements!: NodeListOf<Element>;

  displayedColumns: string[] = [ 'firstName','lastName', 'userName','email','typeOfUser','userGroup','permissions','operations','features','edit'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router :Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private dialog: MatDialog) { }


    num:any;
    usergroup:any;
    tabClick(index: number) {
      this.num=index;
    }
  ngOnInit(): void {

    localStorage.setItem("EditEnvUrl","Reset-EditEnvUrl");
localStorage.setItem("EditDisbUrl","Reset-EditDisbUrl");
localStorage.setItem("EditFundUrl","Reset-EditFundUrl");
localStorage.setItem("EditIndUrl","Reset-EditIndUrl");
localStorage.setItem("EditMonitoringUrl","Reset-EditMonitoringUrl");
localStorage.setItem("EditOrgUrl","Reset-EditOrgUrl");
localStorage.setItem("EditPaymentUrl","Reset-EditPaymentUrl");
localStorage.setItem("EditProjectUrl","Reset-EditProjectUrl");
localStorage.setItem("EditUserAcctUrl","Reset-EditUserAcctUrl");
    this.usergroup=localStorage.getItem('usergroup');
      // if(this.usergroup===undefined || this.usergroup===null)
      // this.router.navigate(['/login']);
    this.userAccountForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      typeOfUser: new FormControl('', [Validators.required]),
      userGroup: new FormControl('', [Validators.required]),
      permissions:new FormControl('', [Validators.required]),
      operations:new FormControl('', [Validators.required]),
      userName:new FormControl(''),
      features:new FormControl('')
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.userAccountForm.controls[controlName].hasError(errorName);
  }

  public createUserAccount = (userAccountFormValue) => {
    if (this.userAccountForm.valid) {
      this.executeUserAccountCreation(userAccountFormValue);
    }
  }

  private executeUserAccountCreation = (userAccountFormValue) => {
    let userAccount: UserAccount = {
      firstName: userAccountFormValue.firstName,
      lastName: userAccountFormValue.lastName,
      userName: userAccountFormValue.userName,
      email: userAccountFormValue.email,
      typeOfUser: userAccountFormValue.typeOfUser,
      userGroup:userAccountFormValue.userGroup,
      permissions:userAccountFormValue.permissions,
      operations:userAccountFormValue.operations,
      features:userAccountFormValue.features,
      // position:userAccountFormValue.position

    }
  }

  // generateExcel(){
  //   console.log("123456");
  //   let obj = new ViewUserAccountComponentComponent(this.excelService,this.router);
  //   obj.ExportTOExcel();
  // }
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
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
  clearForm(form: FormGroup) {
    form.reset();
    }

}
