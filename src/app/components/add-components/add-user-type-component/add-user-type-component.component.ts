/**
 * UserType services Date :10.06.2021
 * 
 * @author satyabrata swain
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { Router } from '@angular/router';
import usertype from 'src/app/data/usertype-data.json';
import { UserTypeServiceService } from 'src/app/Service/user-type-service.service';
import { UserTypeClass } from 'src/app/Service-Class/user-type-class';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { AssignGroup } from 'src/app/Service-Class/assign-group';
import { MatSelect } from '@angular/material/select';
import { numberFormat } from 'highcharts';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Notification } from 'src/app/Service-Class/notification';
@Component({
  selector: 'app-add-user-type-component',
  templateUrl: './add-user-type-component.component.html',
  styleUrls: ['./add-user-type-component.component.css']
})
export class AddUserTypeComponentComponent implements OnInit {
  displayedColumns: string[] = ['edit', 'userType'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  public userTypeForm!: FormGroup;
  usergroup: any;
  editusertype = "false";
  step = 0;
  UserTypeList!: UserTypeClass[];
  userTypeData: any;
  userTypeObject: UserTypeClass;
  totalRows: any;
  primaryLinkList: PrimaryLink[]=[];
  assignGroupArr: AssignGroup[]=[];
  userTypeBean:UserTypeClass;
  uAccessPermArr:UserAccessPermission[]=[];
  userPermission:number[]=[];
  authorised_flag=false;
  userNameForNotificationAlert:string="Charlie Adams";
  userGroupForNotificationAlert:string="DNGDP Data Administration";
  headers=["Module","Access Permission"];
  setStep(index: number) {
    this.step = index;
  }
  @ViewChild(MatSort) sort: MatSort;


  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  constructor(public translate: TranslateService,private primaryLinkService: PrimaryLinkService ,
    public userTypeService: UserTypeServiceService, public dialog: MatDialog, private router: Router,private fb: FormBuilder) { }
  browserLang: any;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.getUserType();
    this.usergroup = localStorage.getItem('usergroup');
    this.browserLang = localStorage.getItem("browserLang");
    this.setToUserPermission();
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    this.userTypeForm = new FormGroup({
      language:new FormControl(''),
      userType: new FormControl('', [Validators.required]),
      userTypeId: new FormControl(''),
      tableData: this.fb.array([
        this.fb.group({
          permissionArr:new FormControl(''),
        })
      ])
    });
    (this.userTypeForm.get('tableData') as FormArray).removeAt(0);
    this.getPrimaryLinkDetails();
  }
  public createUserform = (userTypeFormValue) => {
    if (this.userTypeForm.valid) {
      this.executeUserTypeCreation(userTypeFormValue);
    }
  }
  private executeUserTypeCreation = (userTypeFormValue) => {
    let userTypes: UserType = {
      userType: userTypeFormValue.userType


    }
  }

  UserTypeDatasource=new MatTableDataSource<UserTypeClass>(this.UserTypeList);
  private getUserType() {
    this.userTypeService.getUserType().subscribe(data => {
      this.UserTypeList = data;
      this.totalRows = this.UserTypeList.length;
      this.UserTypeDatasource=new MatTableDataSource<UserTypeClass>(this.UserTypeList);
      setTimeout(() =>
        this.UserTypeDatasource.paginator=this.paginator
      );
      setTimeout(() =>
          this.UserTypeDatasource.sort=this.sort
      );
    });
  }

  //Sourav Kumar Nayak
  setToUserPermission(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Type')
        this.userPermission=this.uAccessPermArr[i].permissionArr;
    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Type'){
        this.authorised_flag=true;
      }
    }
  }

  checkDuplicateUserType() {
    this.getValueByLang()
    this.userTypeService.checkDuplicateUserType(this.userTypeForm.value).subscribe(data => {
      console.log(data);
      if(data===null)
      {
      this.saveUserType();   
      }else{ 
        if(this.browserLang=='en')
        Swal.fire('This Name already exists. Please try another Name')
        else
        Swal.fire('Este nome já existe. Por favor, tente outro Nome')
      }
    },
      error => console.log(error));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    console.log("getValueByLang-->",this.browserLang);
  }
  private getPrimaryLinkDetails() {
    this.primaryLinkService.getPrimaryLinkListWithStatusActive().subscribe(data => {
     
      this.primaryLinkList = data;
      console.log(this.primaryLinkList);
      for(let i=0;i<this.primaryLinkList.length;i++){
        const row = this.fb.group({
          permissionArr: [''],
        });
        (this.userTypeForm.get('tableData') as FormArray).push(row);
      }
    });
  }
  saveUserType() {
    this.getValueByLang()
    this.userTypeService.saveUserType(this.userTypeBean).subscribe(data => {
      console.log(data);
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
      this.saveUserTypeNotificationAlert();
      this.clearUserForm();
    },
      error => console.log(error));
  }

  saveUserTypeNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='User Type Reference ID "'
      +"XXXXXX"
    +'" created on "'+((todayTime+'').substring(0, 24))+'"';

    let bodyForEmail:string='User Type "'
      +this.userTypeForm.controls['userType'].value
      +'" with Reference ID "'
      +"XXXXXX"
      +'" has been created by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\user-type\\';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';


    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has create disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    //   this.moveToViewTab();
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToSelectedTab;
  }

  updateUserTypeNotificationAlert(){
    //let notificationDetails: Notification = new Notification();
    let todayTime = new Date();

    //email subject
    let subjectForEmail:string='User Type Reference ID "'
      +this.userTypeBean.userTypeId
    +'" edited on "'+((todayTime+'').substring(0, 24))+'"';

    let bodyForEmail:string='User Type "'
      +this.userTypeBean.userType
      +'" with Reference ID "'
      +this.userTypeBean.userTypeId
      +'" has been edited by user "'+this.userNameForNotificationAlert
      +'" Please click the link to view the details. <br/>'
    +'Click here : www.aims.mz\\user-type\\'+this.userTypeBean.userTypeId;

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';


    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userNameForNotificationAlert;
    // notificationDetails.notificationMsg = this.userNameForNotificationAlert + " has create disbursement on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    //   this.moveToViewTab();
    // });
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToSelectedTab;
  }

  private changeUserTypeStatus(id: number) {
    this.getValueByLang()
    this.userTypeService.changeUserTypeStatus(id,this.browserLang).subscribe(data => {
      this.UserTypeList = data;
      this.totalRows = this.UserTypeList.length;
      this.UserTypeDatasource=new MatTableDataSource<UserTypeClass>(this.UserTypeList);
      setTimeout(() =>
        this.UserTypeDatasource.paginator=this.paginator
      );
      setTimeout(() =>
          this.UserTypeDatasource.sort=this.sort
      );
      if(this.browserLang=='en')
        Swal.fire('Deleted successfully', '', 'success')
        else
        Swal.fire('Apagado com sucesso', '', 'success')
      this.userTypeForm.reset();
      this.step=0;
    });
    this.userTypeDeleteAlert(id);
  }
  updateUserType() {
    this.getValueByLang()
    this.userTypeService.updateUserType(this.userTypeBean).subscribe(data => {
      console.log(data);
        if(this.browserLang=='en'){
          Swal.fire('Updated successfully', '', 'success');
        }else{
          Swal.fire('Actualizado com sucesso', '', 'success');
        }
      this.updateUserTypeNotificationAlert();
      this.clearUserForm();
    },
      error => console.log(error));
  }
  
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  openMandatoryAlert() {
    this.getValueByLang()
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalertDelete(id: number) {
    this.getValueByLang()
    Swal.fire({
      title:(this.browserLang=='en')? 'Do you want to Delete?':'Deseja Apagar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Delete`:'Apagar',
      denyButtonText:(this.browserLang=='en')? `Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.changeUserTypeStatus(id);
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }

  // Sourav Kumar Nayak
  setData(i:number,select:MatSelect){
    if((select.value!=null) && (select.value!='') && (select.value!=undefined)){
      for(let j=0;j<this.assignGroupArr.length;j++){
        if(this.assignGroupArr[j].primaryLinkId==this.primaryLinkList[i].primaryLinkId){
          this.assignGroupArr.splice(j,1);
          break;
        }
      }
      let assignGroup:AssignGroup;
      assignGroup=new AssignGroup();
      assignGroup.primaryLinkId=this.primaryLinkList[i].primaryLinkId;
      assignGroup.primaryLinkName=this.primaryLinkList[i].primaryLinkName;
      assignGroup.primaryLinkPermissions=select.value;
      assignGroup.globalLinkId=this.primaryLinkList[i].globalLinkId;
      this.assignGroupArr.push(assignGroup);
    }
    else{
      for(let j=0;j<this.assignGroupArr.length;j++){
        if(this.assignGroupArr[j].primaryLinkId==this.primaryLinkList[i].primaryLinkId){
          this.assignGroupArr.splice(j,1);
        }
      }
    }
  }

  // Sourav Kumar Nayak
  setDataEdit(pLinkId:number,pLinkName:string,gLinkId:number,perArr:string[]){
    let assignGroup:AssignGroup;
    assignGroup=new AssignGroup();
    assignGroup.primaryLinkId=pLinkId;
    assignGroup.primaryLinkName=pLinkName;
    assignGroup.primaryLinkPermissions=perArr;
    assignGroup.globalLinkId=gLinkId;
    this.assignGroupArr.push(assignGroup);
  }

  //for notification alert, execute on delete userType
  userTypeDeleteAlert(uid:number) {
    let todayTime = new Date();
    let userType=this.findUserType(uid);
    // let notificationDetails: Notification = new Notification();
    // notificationDetails.notificationGroup = this.usergroup;
    // notificationDetails.updatedBy = this.userName;
    // notificationDetails.notificationMsg = this.userName + " has delete User-Type on " + (todayTime + '').substring(0, 24);
    // notificationDetails.updatedOn = todayTime;
    // this.notificationService.saveNotificationDetails(notificationDetails).subscribe(data => {
    //   console.log(data);
    // });

    //email subject
    let subjectForEmail:string='User Type Reference ID  "'
      +uid
    +'" Deleted on "'+((todayTime+'').substring(0, 24))+'"';

    //email body
    let bodyForEmail:string='User Type "'
      +userType
      +'" with Reference ID "'
      +uid
      +'" has been deleted by user "'+this.userNameForNotificationAlert
      +'" in AIMS on "'
    +((todayTime+'').substring(0, 24))+'" ';

    //email signature
    let emailSignature='Thanks<br/>-----------------------------------<br/>'
      +'Aid Information Management System – AIMS<br/>'
      +'Ministry of Economic and Finance - MEF<br/>'
      +'Government of Mozambique<br/><br/>'
      +'Website:www.aims.mz<br/><br/>'
    +'Note: This is a system-generated email, please don’t reply to it.';
    // Swal.fire(subjectForEmail,'<br/>'+bodyForEmail+'<br/>'+emailSignature,'info');
    this.moveToSelectedTab;
  }

  //for notification alert
  private findUserType(id:number):string{
    let userType:string=null;
    for(let i=0;i<this.UserTypeList.length;i++){
      if(this.UserTypeList[i].userTypeId==id){
        userType=this.UserTypeList[i].userType;
      }
    }
    return userType;
  }

  addToBean(){
    this.getValueByLang()
    this.userTypeBean=new UserTypeClass();
    this.userTypeBean.userType=this.userTypeForm.controls.userType.value;
    this.userTypeBean.userTypeId=this.userTypeForm.controls.userTypeId.value;
    this.userTypeBean.assignGroupArr=this.assignGroupArr;
    this.userTypeBean.language=this.browserLang;
  }

  opensweetalert() {
    this.addToBean();
    this.getValueByLang();
    Swal.fire({
      title:(this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.checkDuplicateUserType();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  opensweetalertUpdate() {
    this.getValueByLang()
    this.addToBean();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Update?':'Você deseja actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText:  (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.updateUserType();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info')
        else
        Swal.fire('Cancelado', '', 'info')
      }
    })
  }
  
  editUserType(id: number) {
    this.userTypeForm.reset();
    let pLinkArr:PLink[]=[];
    this.userTypeService.getUserTypeId(id)
      .subscribe(
        data => {
          this.userTypeData = data;
          this.userTypeObject = this.userTypeData;
          console.log(this.userTypeObject);
          //for matching userAssignGroup with userTypePermission and patch to multi dropdown by Sourav Kumar Nayak
          for(let i=0;i<this.userTypeObject.userTypeAssignGroup.length;i++){
            let plink=new PLink();
            for(let j=0;j<this.userTypeObject.userAssignGroupPermissionModel.length;j++){
              if(this.userTypeObject.userTypeAssignGroup[i].primaryLinkId==this.userTypeObject.userAssignGroupPermissionModel[j].primarylink_id){
                //console.log("index--------->",this.userTypeObject.userTypeAssignGroup[i].primaryLinkId);
                //console.log(this.userTypeObject.userAssignGroupPermissionModel[j].permissionId);
                plink.pLinkId=this.userTypeObject.userTypeAssignGroup[i].primaryLinkId;
                plink.pLinkName=this.userTypeObject.userTypeAssignGroup[i].primaryLinkName;
                plink.gLinkId=this.userTypeObject.userTypeAssignGroup[i].globalLinkId;
                plink.permissionIdArr.push(this.userTypeObject.userAssignGroupPermissionModel[j].permissionId+'');
              }
            }
            pLinkArr.push(plink);
          }
          for(let i=0;i<pLinkArr.length;i++){
            let plId=pLinkArr[i].pLinkId;
            for(let j=0;j<this.primaryLinkList.length;j++){
                if(plId==this.primaryLinkList[j].primaryLinkId){
                  this.setDataEdit(pLinkArr[i].pLinkId,pLinkArr[i].pLinkName,pLinkArr[i].gLinkId,pLinkArr[i].permissionIdArr);
                  ((this.userTypeForm.get('tableData') as FormArray).at(j) as FormGroup).get('permissionArr').patchValue(pLinkArr[i].permissionIdArr);
                }
            }
          }
          this.userTypeForm.controls['userType'].patchValue(this.userTypeObject.userType);
          this.userTypeForm.controls['userTypeId'].patchValue(this.userTypeObject.userTypeId);
          this.editusertype = "true";
          this.step=1;
        },
        error => this.step=0);
  }
  
  clearUserForm(){
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/admin/user-type']));
  }


 
  moveToViewTab() {
    this.step = 0;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
      console.log(`Dialog result: ${result}`);
    });
  }
}
export interface UserType {
 
  userType: any;
}
export interface PeriodicElement {
  
  userType: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { userType: "DNGDP Admin" },
  { userType: "DNGDP Team" },
  { userType: "DNPO" }
  // { userType: "CEDCIF" }
];

export class PLink{
  pLinkId:number;
  pLinkName:string;
  gLinkId:number;
  permissionIdArr:string[]=[];
}