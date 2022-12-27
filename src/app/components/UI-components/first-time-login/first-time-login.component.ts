import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/Service/login.service';
import { ChangePasswordService } from 'src/app/Service/change-password.service';
import { Router } from '@angular/router';
import { ChangePassword } from 'src/app/Service-Class/change-password';
import Swal from 'sweetalert2';
import { PasswordValidation } from '../password/password-validator';

@Component({
  selector: 'app-first-time-login',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.css']
})
export class FirstTimeLoginComponent implements OnInit {
  firstTimeloginForm: any;
  userName: string;
  changePasswordBean: ChangePassword;
  showPassword:boolean;
  showPassword1:boolean;
  showPassword2:boolean;

  constructor(private router: Router, public formBuilder: FormBuilder, public changePasswordService: ChangePasswordService) {
    this.showPassword=false;
    this.showPassword1=false;
    this.showPassword2=false;
   }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    console.log("user Name =====", this.userName);
    this.firstTimeloginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern("^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$")]],
      confirmPassword: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.pattern("")]],


       }, {
         validator: PasswordValidation.MatchPassword
    });
  }
  messageobj: any;
  messagestatus: any;
  saveFirstTimeLoginUserDetails() {
    this.addToBean();
    this.changePasswordService.saveFirstTimeLoginUserDetails(this.changePasswordBean).subscribe(data => {
      this.messageobj = data;
      console.log(data);
      console.log(this.messageobj.message);
      if (this.messageobj.status == 'OK') {
       
        Swal.fire({
          
          title: 'Password has been changed.Go to Login Page?',
          showDenyButton: true,
         
          confirmButtonText: `OK`,
         
        }).then((result) => {
    
    
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
           this.router.navigate(['/login']);
          } 
        })
        
      } else {
       
        Swal.fire(this.messageobj.message);
      }


    },
      error => console.log(error));
  }
  addToBean() {
    this.changePasswordBean = new ChangePassword();
    this.changePasswordBean.password = this.firstTimeloginForm.controls.password.value;
    this.changePasswordBean.confirmPassword = this.firstTimeloginForm.controls.confirmPassword.value;
    this.changePasswordBean.oldPassword = this.firstTimeloginForm.controls.oldPassword.value;
    this.changePasswordBean.userName = this.userName;
  }
}
