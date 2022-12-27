import { Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/Service/login.service';
import Swal from 'sweetalert2';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { UserMappingClass } from 'src/app/Service-Class/user-mapping-class';
import { UserMappingServiceService } from 'src/app/Service/user-mapping-service.service';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { UserTypeServiceService } from 'src/app/Service/user-type-service.service';
import { UserTypeClass } from 'src/app/Service-Class/user-type-class';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import { HttpParams } from '@angular/common/http';
import {NgxCaptchaService} from '@binssoft/ngx-captcha';
//import { CaptchaComponent} from 'src/app/components/UI-components/captcha/captcha.component';
//import {CaptchaService} from 'src/app/components/UI-components/captcha/captcha.service';
import {LoginClass} from  'src/app/Service-Class/login-class';
import { ReCaptcha2Component } from 'ngx-captcha';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';


declare var grecaptcha: any;
@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.css']
})
export class LoginscreenComponent implements OnInit{
  [x: string]: any;
  browserLang: any=null;
  public loginform: FormGroup;
  userMappingData: any;
  sitekey: string;
  constructor(private router: Router, public userTypeService: UserTypeServiceService,
     private primaryLinkService: PrimaryLinkService, private UserMappingServiceService: UserMappingServiceService,
      private loginService: LoginService, private fb: FormBuilder, private notificationService: NotificationService,
      private captchaService:NgxCaptchaService,public translate: TranslateService) {
    this.showPassword = false;
    this.sitekey = '6LfE3VkcAAAAAEvl92hWsAKYjI8H_NU65yLelzc4';
    translate.addLangs(['en', 'pt']);
    translate.setDefaultLang('pt');
    this.browserLang = localStorage.getItem("browserLang");
    console.log("browserLang ",this.browserLang);
    if(this.browserLang==null)
    localStorage.setItem("browserLang",'pt');
    this.browserLang = localStorage.getItem("browserLang");
  }
  usergroup: any;
  wrongpass: any;
  lockpass: any;
  jwtTokenExpiry: any;
  catpchaerror: any;
  userAccesData: any;
  userTypeObject: UserTypeClass;
  UserAccessClassObject: UserAccessClass;
  userMappingObject: UserMappingClass;
  userTypeData: any;
  userTypeName: any;
  primaryLinkList: PrimaryLink[] = [];
  captchaStatus:any = '';
  captchaError: boolean = false;
  captch_input:any ={};
  //protected aFormGroup: FormGroup;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild('langInput') langInput: ElementRef;
  
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  
  wrongcaptcha:any;
  captchaValueReadonly:any;
  catptchaValue:any;

  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    this.loginform = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      // recaptcha: new FormControl('', [Validators.required])
      catptchaValue:new FormControl('', [Validators.required]),
      captchaValueReadonly:new FormControl(this.catptchaValueCall())

    });
    window.onload = () => {
      const myInput = document.getElementById('password2');
      myInput.onpaste = e => e.preventDefault();
    }

   
   
  }
  

  check(){

    
    if(this.captch_input !== null){
      this.captchaService.captchStatus.subscribe((status)=>{
        this.captchaStatus= status;
        if (status == false) {
          Swal.fire("Opps!\nCaptcha mismatch");
        } else  if (status == true) {
          console.log("Success!\nYou are right");
          this.getToken();
        }
      });
    }
    
    console.log("this.captchaStatus:"+this.captchaStatus);
  }

  switchLanguage(language: string) {
    localStorage.setItem("browserLang", language);
    this.translate.use(language);
    let currentUrl = this.router.url;
    let crntUrlChk=((currentUrl).split('/'))[2]
    if(crntUrlChk.includes("view")){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }else{

    }
    // if((currentUrl == '/admin/envelope') || (currentUrl == '/admin/project') || (currentUrl == '/admin/funding') ||
    // (currentUrl == '/admin/disbursement') || (currentUrl == '/admin/payment') || (currentUrl == '/admin/organization') || (currentUrl == '/admin/individual') || (currentUrl == '/admin/monitoring')
    // || (currentUrl == '/admin/user-type')|| (currentUrl == '/admin/user-account')|| (currentUrl == '/admin/user-mapping')|| (currentUrl == '/admin/user-access-management')
    // || (currentUrl == '/admin/field-management')|| (currentUrl == '/admin/exchange-rate-administartion')|| (currentUrl == '/admin/suggestion-administartion')
    // || (currentUrl == '/admin/folder-structure-administartion')|| (currentUrl == '/admin/report-administration')|| (currentUrl == '/admin/bulk-mail-adminstration')
    // || (currentUrl == '/admin/global-link')|| (currentUrl == '/admin/primary-link')|| (currentUrl == '/admin/function-master') || (currentUrl == '/admin/dashboard')){

    // }else{
     
    // }
    
  }
  
  

  handleSuccess(data) {
    //console.log("data:"+this.aFormGroup.controls.status);
    console.log("ReCaptcha",data);
    this.captchaStatus = data;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.loginform.controls[controlName].hasError(errorName);
  }

  

  private getToken(){

    var password = this.loginform.controls.password.value;
    for(var i=0;i<17;i++)
    {
      password = btoa(password);
    }

    localStorage.setItem('password',this.loginform.controls.password.value);
    let tokenRequestBody ={
      "username": this.loginform.controls.userName.value,
      "password": password
  };
  localStorage.setItem("tokenRequestBody",JSON.stringify(tokenRequestBody));
  let login = new LoginClass();
    login.userName = this.loginform.controls.userName.value;
    login.password = password;
   // login.captchaRes = this.loginform.controls.captchaValueReadonly.value;
    //login.captchAns = this.loginform.controls.catptchaValue.value;

  let captchalogin ={ 
    "username": this.loginform.controls.userName.value,
    "password": this.loginform.controls.password.value,
    "captchaRes": this.loginform.controls.captchaValueReadonly.value,
    "captchAns": this.loginform.controls.catptchaValue.value
     };

    this.loginService.captchaValidation(captchalogin).subscribe(data=>{

      let response:any = data;

      if (response.MESSAGE=='SUCCESS') { 

    this.loginService.userIdPasswordValidation(tokenRequestBody).subscribe(data=>{

      let response:any = data;

      if (response.status=='success') { 

    this.loginService.getToken(tokenRequestBody).subscribe(data=>{
      let response:any = data;
      console.log("token = ",response);
      localStorage.setItem('token',response.token);
      console.log( "JWT token : ",localStorage.getItem('token'));
      if(localStorage.getItem('token')!=""){
      this.loginform.controls.password.setValue(password);
      // console.log("form ",this.loginform.value)
        this.loginService.firstTimeLoginUser(this.loginform.value).subscribe(data => {
          this.userAccesData = data;
         
          if (data === null) {
           // this.loginService.loginUser(this.loginform.value).subscribe(data => {
            this.loginService.loginUser(login).subscribe(data => {
              console.log(data);
              this.userAccesData = data;
              this.UserAccessClassObject = this.userAccesData;
        
              if (data === null) {
                this.wrongpass = "true";
              }
              else if(this.UserAccessClassObject.firstName === null){
                this.jwtTokenExpiry = "true";
              }else {
                this.checkPasswordExpireAlert(this.UserAccessClassObject.userAccessId);
                console.log("UserTypeId name" + this.UserAccessClassObject.userAccessId);
                localStorage.setItem('userName', this.UserAccessClassObject.userName);
                localStorage.setItem('userId',this.UserAccessClassObject.userAccessId+'');
                
               this.userTypeService.getUserTypeForUserWiseAssignDetails(this.UserAccessClassObject.userAccessId)
                  .toPromise().then(
                    data => {
                      this.userTypeData = data;
                      console.log("getUserTypeForUserWiseAssignDetails data--->",data);
                      if (data === null) {
                        console.log('*group wise*');
                        // start get userMapping Details from userAccessId
                        this.UserMappingServiceService.getUserTypeById(this.UserAccessClassObject.userAccessId)
                          .subscribe(
                            data => {
                              this.userMappingData = data
        
        
                              this.userMappingObject = this.userMappingData;
        
                              //Start get UserType Object from userTypeId.
                              this.userTypeService.getUserTypeId(this.userMappingObject.userTypeId)
                                .subscribe(
                                  data => {
                                    this.userTypeData = data
        
                                    console.log("UserType class data");
                                    this.userTypeObject = this.userTypeData;
                                    console.log("userType name " + this.userTypeObject.userType);
                                    this.userTypeName = this.userTypeObject.userType;
                                    this.setUserAccessPermission(this.userTypeObject.userType);
                                    console.log(this.userTypeObject);
                                    
                                    // alert(JSON.stringify(this.userTypeObject));
                                  },
                                  error => console.log(error));
                              //End get UserType Object from userTypeId.
        
                            },
                            error => console.log(error));
                      } else {
                        console.log('*user wise*');
                        this.userTypeObject = this.userTypeData;
                        console.log("userType name " , this.userTypeObject.userType);
                        this.userTypeName = this.userTypeObject.userType;
                        this.setUserAccessPermission(this.userTypeObject.userType);
                        console.log(this.userTypeObject);
        
                      }
        
        
                      // alert(JSON.stringify(this.userTypeObject));
                    },
                    error => console.log(error));
        
                // End get userMapping Details from userAccessId
                //this.usergroup = "dngdpadmin";
                this.primaryLinkService.getPrimaryLinkListWithStatusActive().toPromise().then(data => {

                  this.primaryLinkList = data;
                  localStorage.setItem("pLinkLoginList",JSON.stringify(this.primaryLinkList));
                  localStorage.setItem("userAccessAllDetails",JSON.stringify(this.UserAccessClassObject));
                  this.loginService.getEmailIdOfUser(login.userName).subscribe(data => {
                    console.log("email ",data)
                  },
                  error => {
                    // console.log("email ",error.error.text)
                    localStorage.setItem("userEmail",error.error.text);
                })
                  this.router.navigate(['/admin/dashboard']);
                  console.log("primaryLink details loging page ==", this.primaryLinkList);
                  // this.setMenu();
            
                });
                // this.usergroup=this.userTypeName;
                // localStorage.setItem('usergroup', this.usergroup);
                // this.router.navigate(['/admin/dashboard']);
              }
              console.log("Duplicate Check****** " + data);





              // if()

             


             
            },
            error => console.log(error));
          } else {
            localStorage.setItem('userName', this.userAccesData.userName);
            console.log("aasuchi ts file  firstTime loging page pain ");
           // alert();
           //this.router.navigate(['/admin/dashboard']);
             this.router.navigate(['/firstTimelogin']);
          
          }
            },
            error => console.log(error));
       
      }

    },
    error => console.log(error));

  }
  else{

    if(response.count>=10){
    this.lockpass="true";
    this.wrongpass="false";
    this.generate();
     } else{
    this.wrongpass="true";
    this.generate();
     }
  }

  });



    }
    else{
      this.wrongcaptcha="true";
      this.generate();
    }
     
    });
    
  }

  


  catptchaValueCall(){
    let captcha;
    let alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
    console.log(alphabets.length);
    // let status = document.getElementById('status');
    // status.innerText = "Captcha Generator";
    
    //  generate = () => {
    // console.log(status)
    let first = alphabets[Math.floor(Math.random() * alphabets.length)];
    let second = Math.floor(Math.random() * 10);
    let third = Math.floor(Math.random() * 10);
    let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
    let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
    let sixth = Math.floor(Math.random() * 10);
    captcha = first.toString()+second.toString()+third.toString()+fourth.toString()+fifth.toString()+sixth.toString();
    console.log(captcha);
   return captcha;
  }

  generate()
  {
    this.loginform.controls.captchaValueReadonly.setValue(this.catptchaValueCall());
    
  }


  // Start check userFirstTime Login User or not..
  loginFormSubmit() {
  // if(this.captchaStatus!=null){
  //   console.log("status:"+this.captchaStatus);
  if(this.loginform.controls.captchaValueReadonly.value===this.loginform.controls.catptchaValue.value)
{
 this.wrongcaptcha="false";
    this.getToken();
}
else{
  this.wrongcaptcha="true";
  this.generate();
}
  }

  

    
    
    
    // this.loginService.firstTimeLoginUser(this.loginform.value).subscribe(data => {
    //   console.log(data);
    //   this.userAccesData = data;
     
    //   if (data === null) {
    //     this.loginService.loginUser(this.loginform.value).subscribe(data => {
    //       console.log(data);
    //       this.userAccesData = data;
    //       this.UserAccessClassObject = this.userAccesData;
    
    //       if (data === null) {
    //         this.wrongpass = "true";
    //       } else {
    //         this.checkPasswordExpireAlert(this.UserAccessClassObject.userAccessId);
    //         console.log("UserTypeId name" + this.UserAccessClassObject.userAccessId);
    //         localStorage.setItem('userName', this.UserAccessClassObject.userName);
    //        // this.getPrimaryLinkDetails();
    //        // localStorage.setItem('email', this.UserAccessClassObject.email);
    //         this.userTypeService.getUserTypeForUserWiseAssignDetails(this.UserAccessClassObject.userAccessId)
    //           .subscribe(
    //             data => {
    //               this.userTypeData = data
                  
    //               if (data === null) {
    //                 // start get userMapping Details from userAccessId
    //                 this.UserMappingServiceService.getUserTypeById(this.UserAccessClassObject.userAccessId)
    //                   .subscribe(
    //                     data => {
    //                       this.userMappingData = data
    
    
    //                       this.userMappingObject = this.userMappingData;
    
    //                       //Start get UserType Object from userTypeId.
    //                       this.userTypeService.getUserTypeId(this.userMappingObject.userTypeId)
    //                         .subscribe(
    //                           data => {
    //                             this.userTypeData = data
    
    //                             console.log("UserType class data");
    //                             this.userTypeObject = this.userTypeData;
    //                             console.log("userType name " + this.userTypeObject.userType);
    //                             this.userTypeName = this.userTypeObject.userType;
    //                             this.setUserAccessPermission();
    //                             console.log(this.userTypeObject);
                                
    //                             // alert(JSON.stringify(this.userTypeObject));
    //                           },
    //                           error => console.log(error));
    //                       //End get UserType Object from userTypeId.
    
    //                     },
    //                     error => console.log(error));
    //               } else {
    
    //                 this.userTypeObject = this.userTypeData;
    //                 console.log("userType name " + this.userTypeObject.userType);
    //                 this.userTypeName = this.userTypeObject.userType;
    //                 this.setUserAccessPermission();
    //                 console.log(this.userTypeObject);
    
    //               }
    
    
    //               // alert(JSON.stringify(this.userTypeObject));
    //             },
    //             error => console.log(error));
    
    //         // End get userMapping Details from userAccessId
    //         this.usergroup = "dngdpadmin";
    //         localStorage.setItem('usergroup', this.usergroup);
    //         this.router.navigate(['/admin/dashboard']);
    //         // this.usergroup=this.userTypeName;
    //         // localStorage.setItem('usergroup', this.usergroup);
    //         // this.router.navigate(['/admin/dashboard']);
    //       }
    //       console.log("aasuchi ts file  ku duplicate check pain " + data);
         
    //     },
    //     error => console.log(error));
    //   } else {
    //     localStorage.setItem('userName', this.userAccesData.userName);
    //     console.log("aasuchi ts file  firstTime loging page pain ");
    //    // alert();
    //    //this.router.navigate(['/admin/dashboard']);
    //      this.router.navigate(['/firstTimelogin']);
      
    //   }
    //     },
    //     error => console.log(error));
   
     
  // }
  //End login user Code
  // private getPrimaryLinkDetails() {
    
  // }

  //by Sourav Kumar Nayak
  uAccessPermArr:UserAccessPermission[]=[];
  setUserAccessPermission(usergroup:any){
    if(this.userTypeObject==null){
      let userAccessIdString = localStorage.getItem("userAccessId");
      console.log("enter1---->"+parseInt(userAccessIdString));
      let userAccessId = parseInt(userAccessIdString)
      this.userTypeService.getUserTypeForUserWiseAssignDetails(userAccessId)
          .subscribe(
            data => {
              this.userTypeObject = data;
              console.log("this.userTypeObject:"+data);
            });
            
    }
    if(this.userTypeObject!=null){
      for(let i=0;i<this.userTypeObject.userTypeAssignGroup.length;i++){
        let uAccessPerm:UserAccessPermission=new UserAccessPermission();
        uAccessPerm.primaryLinkId=this.userTypeObject.userTypeAssignGroup[i].primaryLinkId;
        uAccessPerm.primaryLinkName=this.userTypeObject.userTypeAssignGroup[i].primaryLinkName;
        this.uAccessPermArr.push(uAccessPerm);
      }
      for(let i=0;i<this.userTypeObject.userAssignGroupPermissionModel.length;i++){
        for(let k=0;k<this.uAccessPermArr.length;k++){
          if(this.userTypeObject.userAssignGroupPermissionModel[i].primarylink_id==this.uAccessPermArr[k].primaryLinkId){
              this.uAccessPermArr[k].permissionArr.push(this.userTypeObject.userAssignGroupPermissionModel[i].permissionId);
          }
        }
      }
      console.log("this.uAccessPermArr:"+this.uAccessPermArr);
      localStorage.setItem("uAccessPermArr",JSON.stringify(this.uAccessPermArr));
      localStorage.setItem('usergroup', usergroup);
    }
      
    
    
    
  }


  showPassword: boolean;

  //by Sourav Kumar Nayak
  checkPasswordExpireAlert(userId: number) {
    this.notificationService.checkPasswordExpireAlert(userId).subscribe(data => {
      console.log(data);
    });
  }

  

}

export class UserAccessPermission{
  primaryLinkId!:number;
  primaryLinkName!:string;
  permissionArr:number[]=[];
}