/**
 * Edit FunctionMaster services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionMaster } from 'src/app/model/function-master';
import { FunctionMasterService } from 'src/app/Service-Application/function-master.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-function-master-component',
  templateUrl: './edit-function-master-component.component.html',
  styleUrls: ['./edit-function-master-component.component.css']
})
export class EditFunctionMasterComponentComponent implements OnInit {
  public functionMasterForm!: FormGroup;
  id:number;
  num: any;
  functionMasterdata: any;
  functionMasterObject: FunctionMaster;
  constructor(private functionMasterService: FunctionMasterService,private route:ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.id= this.route.snapshot.params['id'];
    this.functionMasterService.getFunctionMasterById(this.id)
    .subscribe(
      data => {
        this.functionMasterdata = data

        console.log("globalLink class data");

        this.functionMasterObject=this.functionMasterdata;

      },
      error => console.log(error));

    this.functionMasterForm = new FormGroup({
      functionId: new FormControl(),
      functionName: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      description: new FormControl(),

      action: new FormControl(),
      status: new FormControl(),

    });
  }
  tabClick(index: number) {
    this.num = index;
  }
  updateFunctionMaster() {
    this.functionMasterService.updateFunctionMaster(this.functionMasterForm.value).subscribe(data => {
      console.log(data);
      console.log("aasuchi ts file  ku");

    },
      error => console.log(error));
  }
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
  moveToViewTab(){
    this.router.navigate(['/admin/view-function-master']);
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Update?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Update`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        console.log("aasuchi ts submit true ku ");
        this.updateFunctionMaster();
        Swal.fire('Updated Successfully!', '', 'success')
        this.moveToViewTab();
      } else if(result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
}
