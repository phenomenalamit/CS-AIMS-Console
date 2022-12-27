import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PasswordValidation } from './password-validator';
import { ChangePasswordService } from 'src/app/Service/change-password.service';
import { ChangePassword } from 'src/app/Service-Class/change-password';
import { Router } from '@angular/router';
// import { PasswordStrengthValidator } from "./password-strength.validators";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  loginForm: FormGroup;
  showPassword:boolean;
  showPassword1:boolean;
  showPassword2:boolean;


  error_messages = {
    'oldPassword': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],

    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
  }
  moveToSelectedTab: any;
  userName: string;
  changePasswordBean: ChangePassword;
  constructor(public formBuilder: FormBuilder, public translate: TranslateService,
     public changePasswordService: ChangePasswordService,private router: Router) {
    // this.loginForm = this.formBuilder.group({
    //   oldPassword: new FormControl('', Validators.compose([
    //     Validators.required,Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")

    //   ])),
    //   password: new FormControl('', Validators.compose([
    //     Validators.required,Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")

    //   ])),
    //   confirmpassword: new FormControl('', Validators.compose([
    //     Validators.required,Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")

    //   ])),
    // }, { 
    //   validators: this.password.bind(this)
    // });
    this.showPassword = false;
    this.showPassword1 = false;
    this.showPassword2 = false;

  }
  browserLang: any;
  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    console.log("user Name =====", this.userName);
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    //console.log("this.browserLang",this.browserLang);
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern("^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$")]],
      confirmPassword: ['', Validators.required],
      // oldPassword: ['', [Validators.required, Validators.pattern("^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$")]],
      oldPassword: ['', Validators.required],


    }, {
      validator: PasswordValidation.MatchPassword
    });
  }
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  messageobj: any;
  saveChangePassword() {
    this.addToBean();
    this.changePasswordService.changePassword(this.changePasswordBean).subscribe(data => {
      this.messageobj = data;
      if (this.messageobj.status == 'OK') {
        Swal.fire(this.messageobj.message);
        this.router.navigate(['/']);
      }else{
        Swal.fire(this.messageobj.message);
      }
    },
      error => console.log(error));
  }
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,

      confirmButtonText: `Submit`,

      denyButtonText: `Cancel`,

    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.saveChangePassword();
        // Swal.fire('Reset Password Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  addToBean() {
    this.changePasswordBean = new ChangePassword();
    this.changePasswordBean.password = this.loginForm.controls.password.value;
    this.changePasswordBean.confirmPassword = this.loginForm.controls.confirmPassword.value;
    this.changePasswordBean.oldPassword = this.loginForm.controls.oldPassword.value;
    this.changePasswordBean.userName = this.userName;

   
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
}
