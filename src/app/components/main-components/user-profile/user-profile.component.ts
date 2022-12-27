import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CountryDialingCodeService } from 'src/app/Service/country-dialing-code.service';
import { CountryDialingCode } from 'src/app/Service-Class/country-dialing-code';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userName: string;
  userAccessData: any;
  userAccessObject: UserAccessClass;
  userAccessBean:UserAccessClass;
  fullName:string;
  usergroup:string=null;
  srcRawImage:any=null;

  constructor(public translate: TranslateService,private userAccessService: UserAccessClassService,
    private countryDialingCodeService: CountryDialingCodeService,private router: Router) { }
  isReadOnly:any=true;
  fill:any="outline";
  browserLang:any;
  //code:any;
  countryDialingCodeList: CountryDialingCode[];
  countryDialingCodeFilteredOption:Observable<any[]>;

  userProfileForm:any;
  ngOnInit(): void {
    //this.userName = localStorage.getItem('userName');
    this.usergroup = localStorage.getItem('usergroup');
    //alert(this.userName);
    this.srcImage();
    // this.editUserProfile(this.userName);
    this.getCountryDialingCodes();
    localStorage.setItem("EditEnvUrl","Reset-EditEnvUrl");
localStorage.setItem("EditDisbUrl","Reset-EditDisbUrl");
localStorage.setItem("EditFundUrl","Reset-EditFundUrl");
localStorage.setItem("EditIndUrl","Reset-EditIndUrl");
localStorage.setItem("EditMonitoringUrl","Reset-EditMonitoringUrl");
localStorage.setItem("EditOrgUrl","Reset-EditOrgUrl");
localStorage.setItem("EditPaymentUrl","Reset-EditPaymentUrl");
localStorage.setItem("EditProjectUrl","Reset-EditProjectUrl");
localStorage.setItem("EditUserAcctUrl","Reset-EditUserAcctUrl");
    this.browserLang=localStorage.getItem("browserLang");
      if(this.browserLang===undefined || this.browserLang===null)
      this.browserLang='en';
      this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

      this.userProfileForm = new FormGroup({
        userAccessId: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      //dateOfJoining: new FormControl('', [Validators.required]),
      countryCode:new FormControl(''),
      telephone: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
  
      });
      this.editUserProfile();
  }
  clearForm(form: FormGroup) {
    form.reset();
    }
    check_email_flag:any;
    check_email1_flag:any;
    validateEmail(){
      var email = this.userProfileForm.controls['email'].value;
      var expr = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;
      if (!expr.test(email)) {
        //console.log( "Invalid email address.");
        this.check_email_flag=false;//for invalid email
        this.check_email1_flag=true;//for valid
      }
      else{
        // console.log( "valid.");
        this.check_email_flag=true;//for invalid email
        this.check_email1_flag=false;//for valid
      }
    }
    check_phone_flag=true;
    check_phone1_flag=true;
    phoneMessage:any;
    validatePhone(){
      var phone = this.userProfileForm.controls['telephone'].value;
      // alert(phone);
      if(phone.trim().length == 0)
        {
          this.check_phone_flag=true;
          this.phoneMessage=' '
        }
        else
        {
      // var expr = /^(?:[0-9] ?){6,10}[0-9]$/;
      // var expr = /^[0-9]{2}[0-9]{8}$/;
      var expr = /^\s*\d{9,10}\s*$/;
      if (!expr.test(phone)) {
        console.log( "Invalid phone ......");
        this.check_phone_flag=false;//for invalid phone
        this.check_phone1_flag=true;//for valid
      }
      else{
        console.log( "valid.....");
        this.check_phone_flag=true;//for invalid phone
        this.check_phone1_flag=false;//for valid
        this.phoneMessage='not show'
      }
    }
    }
    addToBean(){
      this.userAccessBean=new UserAccessClass();
      this.userAccessBean.userType=this.userAccessObject.userType;
      this.userAccessBean.userAccessId=this.userAccessObject.userAccessId;
      this.userAccessBean.userFullName=null;
      this.userAccessBean.userName=this.userProfileForm.controls['userName'].value;
      this.userAccessBean.password=this.userAccessObject.password;
      this.userAccessBean.email=this.userProfileForm.controls['email'].value;
      this.userAccessBean.dateOfJoining=this.userAccessObject.dateOfJoining;
      this.userAccessBean.firstName=this.userProfileForm.controls['firstName'].value;
      this.userAccessBean.lastName=this.userProfileForm.controls['lastName'].value;
      this.userAccessBean.countryCode=this.userProfileForm.controls['countryCode'].value;
      this.userAccessBean.telephone=this.userProfileForm.controls['telephone'].value;
      this.userAccessBean.address=this.userProfileForm.controls['address'].value;
      this.userAccessBean.city=this.userProfileForm.controls['city'].value;
    }
    editProfile()
    {
      this.isReadOnly=false;
      this.fill="";
    }
    cancelProfile(){
      this.isReadOnly=true;
      this.fill="outline";
    }
    updateUserAccessProfilePicture(){
      this.addToBean();
      let formData=new FormData();
      formData.append("file",this.srcRawImage);
      formData.append("userAccessId", (this.userAccessBean.userAccessId).toString());
      this.userAccessService.updateUserAccessProfilePicture(formData).subscribe(data=>{
          console.log('submited data--> ',data);
          this.userAccessData=data;
          this.userAccessObject=this.userAccessData;
          localStorage.setItem("userAccessAllDetails",JSON.stringify(this.userAccessObject));
          Swal.fire('Profile picture updated successfully', '', 'success');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/admin/user-profile']));
      });
    }
    updateUserDetails(){
      this.addToBean();
      this.userAccessService.updateUserAccess(this.userAccessBean).subscribe(data=>{
        console.log(data);
        this.userAccessData=data;
        this.userAccessObject=this.userAccessData;
        localStorage.setItem("userAccessAllDetails",JSON.stringify(this.userAccessObject));
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/admin/user-profile']));
      });
    }
   
   srcImage(){
    //  if(this.isReadOnly===true) 
     this.avatarURL= "./assets/images/blankImage.jpg";
   }

    private selectedFile: File;
    public avatarURL: any;
  
    onFileSelect(event) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile.name);
    }
  
    changeAvatar(files) {
          if (files.length === 0) {
              return;
          }
  
          const mimeType = files[0].type;
          if (mimeType.match(/image\/*/) == null) {
              console.log("Only images are supported.");
              return;
          }
  
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = (_event) => {
              this.avatarURL = reader.result;
              this.srcRawImage=files[0];
              this.updateUserAccessProfilePicture();
          };
      }

      private getCountryDialingCodes(){
        this.countryDialingCodeService.getCountryDialingCodeDetails().subscribe(data=>{
            this.countryDialingCodeList=data;
            this.countryDialingCodeList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
            this.countryDialingCodeFilteredOption=this.userProfileForm.controls['countryCode'].valueChanges
            .pipe(
                startWith(''),
                map(code =>  
                  code ? this.filterCode(code+'') : this.countryDialingCodeList.slice())
            );
        });
      }
      private filterCode(name:string){
        return this.countryDialingCodeList.filter(code=>
          code.countryName.toLowerCase().indexOf(name.toLowerCase())===0);
      }

      // editUserProfile(userName: string) {
      //   this.userAccessService.getUserAccessObjectByUserName(userName)
      //     .subscribe(
      //       data => {
      //         this.userAccessData = data
      //         console.log("UserAccount class data");
      //         console.log(this.userAccessData);
      //         this.userAccessObject = this.userAccessData;
      //         console.log("aasuchi edit patch values ku");
      //         this.avatarURL='data:image/png;base64,' +this.userAccessObject.image;
      //         this.userProfileForm.controls['firstName'].patchValue(this.userAccessObject.firstName);
      //         this.userProfileForm.controls['lastName'].patchValue(this.userAccessObject.lastName);
      //         this.userProfileForm.controls['userName'].patchValue(this.userAccessObject.userName);
      //         this.userProfileForm.controls['email'].patchValue(this.userAccessObject.email);
      //        // this.userProfileForm.controls['dateOfJoining'].patchValue(this.userAccessObject.dateOfJoining);
      //         this.userProfileForm.controls['userAccessId'].patchValue(this.userAccessObject.userAccessId);
      //         this.userProfileForm.controls['countryCode'].patchValue(this.userAccessObject.countryCode);
      //         this.userProfileForm.controls['telephone'].patchValue(this.userAccessObject.telephone);
      //         this.userProfileForm.controls['city'].patchValue(this.userAccessObject.city);
      //         this.userProfileForm.controls['address'].patchValue(this.userAccessObject.address);
      //         this.fullName=this.userAccessObject.firstName+" "+this.userAccessObject.lastName;
      //         // this.editmanageuser = "true";
      //         // this.viewmanageuser = "false";
      //         this.userProfileForm.enable();
      //         // this.step = 1;
      //       },
      //       error => console.log(error))
           
       
      // }

      editUserProfile(){
        this.userAccessObject=JSON.parse(localStorage.getItem("userAccessAllDetails"));
        if(this.userAccessObject.image == null || this.userAccessObject.image == undefined || this.userAccessObject.image == ''){
          this.avatarURL="./assets/images/blankImage.jpg";
        }
        else{
          this.avatarURL='data:image/png;base64,' +this.userAccessObject.image;
        }
        this.userProfileForm.controls['firstName'].patchValue(this.userAccessObject.firstName);
        this.userProfileForm.controls['lastName'].patchValue(this.userAccessObject.lastName);
        this.userProfileForm.controls['userName'].patchValue(this.userAccessObject.userName);
        this.userProfileForm.controls['email'].patchValue(this.userAccessObject.email);
        // this.userProfileForm.controls['dateOfJoining'].patchValue(this.userAccessObject.dateOfJoining);
        this.userProfileForm.controls['userAccessId'].patchValue(this.userAccessObject.userAccessId);
        this.userProfileForm.controls['countryCode'].patchValue(this.userAccessObject.countryCode);
        this.userProfileForm.controls['telephone'].patchValue(this.userAccessObject.telephone);
        this.userProfileForm.controls['city'].patchValue(this.userAccessObject.city);
        this.userProfileForm.controls['address'].patchValue(this.userAccessObject.address);
        this.fullName=this.userAccessObject.firstName+" "+this.userAccessObject.lastName;
        // this.editmanageuser = "true";
        // this.viewmanageuser = "false";
        this.userProfileForm.enable();
        // this.step = 1;
      }

}
