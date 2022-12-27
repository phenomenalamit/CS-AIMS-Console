/**
 * PrimaryLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FunctionMaster } from 'src/app/model/function-master';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import Swal from 'sweetalert2';
import { GlobalLink } from 'src/app/model/global-link';
import { FunctionMasterService } from 'src/app/Service-Application/function-master.service';
import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import { PermissionService } from 'src/app/Service/permission.service';
import { Permission } from 'src/app/Service-Class/permission';
import { TranslateService } from '@ngx-translate/core';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-primary-link-component',
  templateUrl: './create-primary-link-component.component.html',
  styleUrls: ['./create-primary-link-component.component.css']
})
export class CreatePrimaryLinkComponentComponent implements OnInit {
  functionMasterList:FunctionMaster[];
  public primaryLinkForm!: FormGroup;
  globalLinkList: GlobalLink[];
  permissionDetailsList: Permission[];
  searchFunctionId = new FormControl();
  searchGlobalLinkId = new FormControl();
  functionMasterListFilteredOption: Observable<any[]>;
  globalLinkListFilteredOption: Observable<any[]>;
  editPrimaryLink:  any;
  updatePrimaryLink="false";
  id: number;
  primaryLinkdata:any;
  primaryLink:PrimaryLink;
  permissionArr:any=[];
  permissionArrStrArray:String[]=[];
  permissionArrString:string;
  browserLang: any;
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;

  constructor(private functionMasterService: FunctionMasterService, private globalLinkServiceService: GlobalLinkServiceService,
    private route: ActivatedRoute, private permissionService:PermissionService,private primaryLinkService: PrimaryLinkService,
    private router: Router,public translate: TranslateService) { }

  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang", this.browserLang);
    this.primaryLinkForm = new FormGroup({
      primaryLinkName: new FormControl('', [Validators.required]),
      functionId: new FormControl('', [Validators.required]),
      globalLinkId: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      primaryLinkId: new FormControl(''),
      permissionArr:new FormControl('')
    });
    this.editPrimaryLink = localStorage.getItem("editPrimaryLink");
    if (this.editPrimaryLink == "editPrimaryLink") {
      this.id = this.route.snapshot.params['id'];
      console.log("Primary class id"+this.id);
      this.primaryLinkService.getPrimaryLinkById(this.id)
        .subscribe(
          data => {
            this.primaryLinkdata = data
            this.primaryLink = this.primaryLinkdata;
            this.primaryLinkForm.controls['primaryLinkId'].patchValue(this.primaryLink.primaryLinkId);
            this.primaryLinkForm.controls['primaryLinkName'].patchValue(this.primaryLink.primaryLinkName);
            this.primaryLinkForm.controls['functionId'].patchValue(this.primaryLink.functionId);
            this.primaryLinkForm.controls['globalLinkId'].patchValue(this.primaryLink.globalLinkId);
            this.primaryLinkForm.controls['status'].patchValue(this.primaryLink.status);
            //by Sourav Kumar Nayak
            for(let i=0;i<this.primaryLink.primaryLinkPermissions.length;i++){
                this.permissionArrStrArray.push(this.primaryLink.primaryLinkPermissions[i].permissionMasterId);
                this.onPermissionChange(this.primaryLink.primaryLinkPermissions[i].permissionMasterId);
            }
            //by Sourav Kumar Nayak
            if(this.primaryLink.primaryLinkPermissions.length==0){
              this.primaryLinkForm.controls.permissionArr.setValue(this.permissionArr);
            }
            this.permissionArrString=this.permissionArrStrArray.toString();
            this.updatePrimaryLink = "true";
            localStorage.setItem('editPrimaryLink', 'reset-edit-PrimaryLink');
          },
          error => console.log(error));

    }

    this.getFunctionMaster();
    this.getGlobalLinkDetails();
    this.getPermissionDetails();
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Primary Link'){
        this.authorised_flag=true;
      }
    }
  }

  checkPrimaryLinkName() {
    this.getValueByLang()
    this.primaryLinkService.checkPrimaryLinkNameDuplicate(this.primaryLinkForm.value).subscribe(data => {
      console.log(data);
      if(data===null)
      {
      this.savePrimaryLink();   
      }else{ 
        (this.browserLang=='en')?Swal.fire('This Primary Link Name already exists. Please try another Name'):Swal.fire('Este Nome de Link Primário já existe. Por favor, tente outro Nome');
      }
    },
      error => console.log(error));
  }

  savePrimaryLink() {
    this.getValueByLang()
    this.primaryLinkService.savePrimaryLink(this.primaryLinkForm.value).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
      this.moveToViewTab();
    },
      error => console.log(error));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    console.log("getValueByLang-->",this.browserLang);
  }
  private getFunctionMaster() {
    this.getValueByLang();
    this.functionMasterService.getFunctionMasterDetailsForPLinkByOrder().subscribe(data => {
      console.log("return data" + data.length);
      this.functionMasterList = data;
      if(this.browserLang == 'en'){
        this.functionMasterListFilteredOption = this.searchFunctionId.valueChanges.pipe(
          startWith(''),
              map(fMaster =>
                fMaster ? this.filterFunctionMasterEn(fMaster) : this.functionMasterList.slice())
        );
      }
      else{
        this.functionMasterListFilteredOption = this.searchFunctionId.valueChanges.pipe(
          startWith(''),
              map(fMaster =>
                fMaster ? this.filterFunctionMasterPt(fMaster) : this.functionMasterList.slice())
        );
      }
    });
  }

  private filterFunctionMasterEn(name: string) {
    return this.functionMasterList.filter(fMaster =>
      fMaster.functionName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  private filterFunctionMasterPt(name: string) {
    return this.functionMasterList.filter(fMaster =>
      fMaster.functionNamePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  private getGlobalLinkDetails() {
    this.globalLinkServiceService.getAllGlobalLinkForPrimaryByOrder().subscribe(data => {
      this.globalLinkList = data;
      if(this.browserLang == 'en'){
        this.globalLinkListFilteredOption = this.searchGlobalLinkId.valueChanges.pipe(
          startWith(''),
              map(globalLink =>
                globalLink ? this.filterGlobalLinkEn(globalLink) : this.globalLinkList.slice())
        );
      }
      else{
        this.globalLinkListFilteredOption = this.searchGlobalLinkId.valueChanges.pipe(
          startWith(''),
              map(globalLink =>
                globalLink ? this.filterGlobalLinkPt(globalLink) : this.globalLinkList.slice())
        );
      }
    });
  }

  private filterGlobalLinkEn(name: string) {
    return this.globalLinkList.filter(fMaster =>
      fMaster.globalLinkName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  private filterGlobalLinkPt(name: string) {
    return this.globalLinkList.filter(fMaster =>
      fMaster.globalLinkNamePt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

today:any;
  private getPermissionDetails() {
    this.permissionService.getPermissionDetailsUrl().subscribe(data => {
     
      this.permissionDetailsList = data;
      for (let i = 0; i < this.permissionDetailsList.length; i++) {
        let crtDt=this.permissionDetailsList[i].createdOn;
        let updateDt=this.permissionDetailsList[i].updatedOn;
         this.today=new Date();
         crtDt=new Date(crtDt);
        //calculate time difference
       var time_difference = this.today.getTime() - crtDt.getTime();
       //calculate days difference by dividing total milliseconds in a day
       var days_difference = time_difference / (1000 * 60 * 60 * 24);
       
       this.permissionDetailsList[i].updateDifference=15
       if(updateDt !=null){
        updateDt=new Date(updateDt);
        var time_differenceForUpdate = this.today.getTime() - updateDt.getTime();
        var days_differenceForUpdate = time_differenceForUpdate / (1000 * 60 * 60 * 24);
        this.permissionDetailsList[i].updateDifference=days_differenceForUpdate;
       }
      this.permissionDetailsList[i].difference=days_difference;
      
       }
       console.log("this.permissionDetailsList" , this.permissionDetailsList);
    });
  }

  updatePrimaryLinkDetails() {
    this.getValueByLang()
    this.primaryLinkService.updatePrimaryLink(this.primaryLinkForm.value).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Updated successfully', '', 'success');
      }else{
        Swal.fire('Actualizado com Sucesso', '', 'success');
      }
      this.moveToViewTab();
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
  moveToViewTab(){
    this.router.navigate(['/admin/view-primary-link']);
  }
  clearForm(form: FormGroup) {
    form.reset();
  }

  //onPermissionChange Author: Sourav Kumar Nayak
  onPermissionChangeflag=false;
  onPermissionChange(e:number){
    this.onPermissionChangeflag=true;
    let contains=this.permissionArr.indexOf(e);
    if(contains==-1){
      this.permissionArr.push(e);
    }
    else{
      this.permissionArr.splice(contains,1);
    }
    this.primaryLinkForm.controls.permissionArr.setValue(this.permissionArr);
  }



  openMandatoryAlert() {
    $(".checkValidation").trigger("click");
    this.getValueByLang()
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }
  opensweetalert() {
    if(this.onPermissionChangeflag==false){
      this.primaryLinkForm.controls.permissionArr.setValue(this.permissionArr);
    }
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("aasuchi ts submit true ku ");
        this.checkPrimaryLinkName();
        //this.moveToViewTab();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
  opensweetalertUpdate() {
    this.getValueByLang();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Update?':'Você deseja actualizar?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Update`:'Actualizar',
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("aasuchi ts update true ku ");
        this.updatePrimaryLinkDetails();
       // this.moveToViewTab();
      } else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
}
