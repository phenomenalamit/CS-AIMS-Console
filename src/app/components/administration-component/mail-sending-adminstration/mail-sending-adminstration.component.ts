import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'jquery';
import { Observable } from 'rxjs';
import { first, startWith } from 'rxjs/operators';
import { BulkMailAdminstrationServiceClass } from 'src/app/Service-Class/bulk-mail-adminstration-service-class';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { UserTypeClass } from 'src/app/Service-Class/user-type-class';
import { BulkMailAdminstrationService } from 'src/app/Service/bulk-mail-adminstration-service';
import { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import { UserTypeServiceService } from 'src/app/Service/user-type-service.service';
import Swal from 'sweetalert2';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

@Component({
  selector: 'app-mail-sending-adminstration',
  templateUrl: './mail-sending-adminstration.component.html',
  styleUrls: ['./mail-sending-adminstration.component.css']
})
export class MailSendingAdminstrationComponent implements OnInit {

  editId: any = null;
  viewId: any = null;
  authorised_flag = false;
  num: any;
  uAccessPermArr: UserAccessPermission[] = [];
  UserAccessList: UserAccessClass[] = [];
  browserLang: any;
  UserTypeList!: UserTypeClass[];
  emailListWithUserAccessList: UserAccessClass[] = [];
  email: any = [];
  userType: any = []
  fundingOrg:any=[]
  userTypeName: UserTypeClass[];
  fundingOrgNm:OrganizationCrudServiceClass[];
  selectable = true;
  removable = true;
  selectedEmailList:any=[];
  fundingOrganizationList:OrganizationCrudServiceClass[]=[];
  public bulkMailAdminstrationForm!: FormGroup;
  @ViewChild('emailInput', {static: false})
  emailInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  tabClick(index: number) {
    this.num = index;
  }
  constructor(private fb: FormBuilder, public translate: TranslateService,
    private router: Router, private readonly route: ActivatedRoute, private userAccessService: UserAccessClassService,
    public userTypeService: UserTypeServiceService,
    private organizationCrudServiceService: OrganizationCrudServiceService,private bulkMailAdminStrationService: BulkMailAdminstrationService,
    ) {
     
  }
  ngOnInit(): void {
    this.browserLang = localStorage.getItem('browserLang');
    this.fetchUserAccessData();
    this.getUserType();
    this.getFundingOrg();
    
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(
      this.browserLang.match(/en|pt/) ? this.browserLang : 'en'
    );
    this.setToAuthFlag();
    this.bulkMailAdminstrationForm = this.fb.group({
      from: new FormControl('', [Validators.required]),
      to: new FormControl(''),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
    this.bulkMailAdminstrationForm.controls.from.setValue('aims@cedsif.gov.mz');
    this.bulkMailAdminstrationForm.controls.from.disable();
  }
  private fetchUserAccessData() {
    this.userAccessService.getUserAccessDetails().subscribe(data => {
      this.UserAccessList = data;
      console.log("this.UserAccessList ", this.UserAccessList)
    });
  }
  private getFundingOrg() {
    this.organizationCrudServiceService.getFundingOrganizationDetails().subscribe(data => {
      this.fundingOrganizationList = data;
    });
  }
  //Sourav Kumar Nayak
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'Folder Structure') {
        this.authorised_flag = true;
      }
    }
  }

  /* If you click on reset button then it will clear all field that you written or selected */
  clearForm(form: FormGroup) {
    form.reset();
    this.bulkMailAdminstrationForm.controls.from.setValue('aims@cedsif.gov.mz');
    this.selectedEmailList=[]
    this.email = []
    this.userType = []
  }
  /* If you are not fill all mandatory fields then it will give an alert */
  openMandatoryAlert() {
    this.getValueByLang()
    if(this.bulkMailAdminstrationForm.invalid)
    if (this.browserLang == 'en')
    Swal.fire('Please fill all mandatory fields.')
  else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
    if(this.selectedEmailList.length==0){
      if (this.browserLang == 'en')
      Swal.fire('Please enter a mail id to whom you want to send the message.')
      else
      Swal.fire('Introduza por favor o email de quem pretende enviar a mensagem.')
    }
  }
  bulkMailAdminstrationData=new BulkMailAdminstrationServiceClass()
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  openSavealert() {
    this.getValueByLang()
    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: ((this.browserLang == 'en') ?'Do you want to Send?':'Deseja enviar?'),
      showDenyButton: true,
      confirmButtonText:  ((this.browserLang == 'en') ?`Send`:'Envia'),
      denyButtonText: (this.browserLang == 'en') ? `Cancel` : 'Cancelar',
    }).then((result) => {

      /* If we click on submit button then we can save data in db*/
      if (result.isConfirmed) {
this.getValueByLang()
this.bulkMailAdminstrationData==new BulkMailAdminstrationServiceClass();
// this.bulkMailAdminstrationData.from=this.bulkMailAdminstrationForm.controls.from.value;
this.bulkMailAdminstrationData.from="";
this.bulkMailAdminstrationData.to=this.selectedEmailList;
this.bulkMailAdminstrationData.subject=this.bulkMailAdminstrationForm.controls.subject.value;
this.bulkMailAdminstrationData.message=this.bulkMailAdminstrationForm.controls.message.value;
this.bulkMailAdminstrationData.language=this.browserLang;
console.log("submit data ",JSON.stringify(this.bulkMailAdminstrationData))
this.sendMail();
      }
      /* If we click on cancel button then we can not save data */
      else if (result.isDenied) {
        // Swal.fire('Cancelled', '', 'info');
      }
    });
  }
  sendMail(){
    this.bulkMailAdminStrationService.sendMail(this.bulkMailAdminstrationData).pipe(first()).subscribe(
      {
        next: () => {
          let currentUrl = this.router.url;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
        //  Swal.fire('Message send successfully.')
        }
        ,
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          this.getValueByLang();
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            if(this.browserLang=='en')
            Swal.fire("Mail can not send. Please Try Again.", '', 'error');
            else
            Swal.fire("Email não enviado. Por favor tente novamente.", '', 'error');
          } else {
            if(this.browserLang=='en')
            Swal.fire("Mail can not send. Please Try Again.", '', 'error');
            else
            Swal.fire("Email não enviado. Por favor tente novamente.", '', 'error');
          }
        }
      })
    }
  checkEmail() {
    var to = this.bulkMailAdminstrationForm.controls.to.value;
    this.filterEmail(to);
    this.filterUserType(to);
    this.filterFundingOrg(to);
  }

  private filterEmail(name: string) {
    this.email = [];
    if (name != null) {
      this.emailListWithUserAccessList = this.UserAccessList.filter(list =>
        list.email.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1)
    }
    if (name.length > 0) {
      for (let i = 0; i < this.emailListWithUserAccessList.length; i++) {
        this.email.push(this.emailListWithUserAccessList[i].email)
      }
    }
  }
  private getUserType() {
    this.userTypeService.getUserType().subscribe(data => {
      this.UserTypeList = data;
    });
  }
  private filterFundingOrg(name: string) {
    this.fundingOrg = [];
    if (name != null) {
      this.fundingOrgNm = this.fundingOrganizationList.filter(list =>
        list.names.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
        || list.acronym.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1)
        
    }
    if (name.length > 0) {
      for (let i = 0; i < this.fundingOrgNm.length; i++) {
        this.fundingOrg.push(this.fundingOrgNm[i].names)
      }
    }
  }
  private filterUserType(name: string) {
    this.userType = [];
    if (name != null) {
      this.userTypeName = this.UserTypeList.filter(list =>
        list.userType.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1)
    }
    if (name.length > 0) {
      for (let i = 0; i < this.userTypeName.length; i++) {
        this.userType.push(this.userTypeName[i].userType)
      }
    }
  }
  addEmailSender(email:string){
    this.selectedEmailList.push(email);
      // this.bulkMailAdminstrationForm.controls.to.setValue(email);
  }
  remove(email: string): void {
    const index = this.selectedEmailList.indexOf(email);

    if (index >= 0) {
      this.selectedEmailList.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedEmailList.push(event.option.viewValue);
    this.emailInput.nativeElement.value = '';
    this.bulkMailAdminstrationForm.controls.to.setValue('');
  }
  
  add(event: MatChipInputEvent): void {
    // Add email only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our email
      if ((value || '').trim()) {
        this.selectedEmailList.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
this.email=[];
this.userType=[];
      this.bulkMailAdminstrationForm.controls.to.setValue('');
    }
  }
}
