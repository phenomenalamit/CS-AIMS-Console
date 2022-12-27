import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import Swal from 'sweetalert2';
import { ChangePasswordService } from 'src/app/Service/change-password.service';
// import { MustMatch } from '../confirm-password';




@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePassword: ChangePassword = new ChangePassword();
  errorMgs: string;
  selectedPattern: string;
  public changePasswordForm!: FormGroup;

  //Minimum 8 characters, at least one letter and one number:
  //  patternNormal: any = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";

  constructor(private _formBuilder: FormBuilder, public changePasswordService: ChangePasswordService) { }

  ngOnInit(): void {
    this.changePasswordForm = this._formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")]),

      newPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")]),

      confirmPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z0-9@$!%?&*#])(?=.*\\d)[A-Za-z0-9@$!%?&*#\\d]{8,}$")])

    },
      {
        Validators: this.checkPasswords
      });

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group

    const password = group.get('newPassword').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  }

  public createChangePassword = (changePasswordFormValue) => {
    if (this.changePasswordForm.valid) {
      this.executeChangePasswordCreation(changePasswordFormValue);
    }
  }

  private executeChangePasswordCreation = (changePasswordFormValue) => {
    let changePassword: ChangePassword = {
      oldPassword: changePasswordFormValue.oldPassword,
      newPassword: changePasswordFormValue.newPassword,
      confirmPassword: changePasswordFormValue.confirmPassword


    }
  }

  saveChangePassword() {
    this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe(data => {
      console.log("change password return" + data);


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
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Submit?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Submit`,

      denyButtonText: `Cancel`,

    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.saveChangePassword();
        Swal.fire('Submitted Successfully', '', 'success')
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

export class ChangePassword {

  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;


}
function ConfirmPasswordValidator(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

