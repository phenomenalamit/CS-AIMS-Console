import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { UserAccessClass } from 'src/app/Service-Class/user-access-class';
import { ForgotPasswordService } from 'src/app/Service/forgot-password-service';
import { LoginService } from 'src/app/Service/login.service';
import { UserAccessClassService } from 'src/app/Service/user-access-class.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  constructor( private userAccessService: UserAccessClassService,private forgotPasswordService:ForgotPasswordService) { }
  public forgotPasswordform: FormGroup;
  userNameValid:any=false;
  mailValid:any=false;
  UserAccessList!: UserAccessClass[];
  language:string;
    ngOnInit(): void {
      this.fetchUserAccessData();
      this.forgotPasswordform = new FormGroup({
        username: new FormControl('', [Validators.required]),
        mail: new FormControl('', [Validators.required]),
      });
     
}
  private fetchUserAccessData(){
     this.userAccessService.getUserAccessDetailsToGetUserNmAndEmail().subscribe(data => {
       this.UserAccessList = data;
      // console.log("this.UserAccessList ",this.UserAccessList)
      
     });
  }
  invalidAlert(){
    if(this.userNameValid==2){
      Swal.fire('Invalid User Name.')
    }else if(this.mailValid==2){
      Swal.fire('Invalid Mail Id.')
    }else if(this.forgotPasswordform.invalid){
      Swal.fire('Please Fill All Required Field.')
    }
  }
  browserLang:any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  getPassword() {
    let userNm = this.forgotPasswordform.controls.username.value;
    let emailId = this.forgotPasswordform.controls.mail.value;
    let userAccessId=null;
    for(let i=0;i<this.UserAccessList.length;i++){
if(userNm== this.UserAccessList[i].userName){
  if(emailId==this.UserAccessList[i].email){
userAccessId=this.UserAccessList[i].userAccessId;
break;
  }
}else{
  Swal.fire('User name and email did not match.')
}
 }
 if(userAccessId!=null){
    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.getValueByLang();
        this.language=this.browserLang;
        this.forgotPasswordService.mailPassword(userAccessId,this.language).pipe(first()).subscribe(
          {
            next: () => {
              // Swal.fire('Password sent to your email.Please check email.')
            },
            /* At Data save time if there is an error occured then here we can handel that error */
            error: error => {
              if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
                // Swal.fire(error.error.message, '', 'error');
              } else {
                // Swal.fire(error.error, '', 'error');
              }
            }
          }
        );
      

      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')

      }
    })
  }

  }
checkUserName(){
  let userNm=this.forgotPasswordform.controls.username.value;
  for(let i=0;i<this.UserAccessList.length;i++){
    if(userNm==this.UserAccessList[i].userName){
      // If user name valid
      this.userNameValid=1;
      break;
    }else{
      // If user name not valid
      this.userNameValid=2;
    }
  }
}
checkMail(){
  let emailId=this.forgotPasswordform.controls.mail.value; 
  for(let i=0;i<this.UserAccessList.length;i++){
    if(emailId==this.UserAccessList[i].email){
      // If user name valid
      this.mailValid=1;
      break;
    }else{
      // If user name not valid
      this.mailValid=2;
    }
  }
}
}

// function getPassword() {
//   throw new Error('Function not implemented.');
// }
