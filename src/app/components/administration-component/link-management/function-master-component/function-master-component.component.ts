/**
 * FunctionMaster services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { FunctionMaster } from 'src/app/model/function-master';
import { FunctionMasterService } from 'src/app/Service-Application/function-master.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-function-master-component',
  templateUrl: './function-master-component.component.html',
  styleUrls: ['./function-master-component.component.css']
})
export class FunctionMasterComponentComponent implements OnInit {
  public functionMasterForm!: FormGroup;
  fMaster:FunctionMaster = new FunctionMaster();
  functionMasterdata: any;
  functionMasterObject: FunctionMaster;
  editFunctionMaster: any;
  id: number;
  updateFunctionMaster ="false";
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  constructor(private functionMasterService: FunctionMasterService,
    private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.functionMasterForm = new FormGroup({
      functionId: new FormControl(),
      functionName: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      description: new FormControl(),

      action: new FormControl(),
      status: new FormControl(),

    });
    this.setToAuthFlag();
    this.editFunctionMaster = localStorage.getItem("editFunctionMaster");
    if (this.editFunctionMaster == "editFunctionMaster") {
      this.id= this.route.snapshot.params['id'];
      this.functionMasterService.getFunctionMasterById(this.id)
      .subscribe(
        data => {
          this.functionMasterdata = data

          console.log("globalLink class data");

          this.functionMasterObject=this.functionMasterdata;
          this.functionMasterForm.controls['functionName'].patchValue(this.functionMasterObject.functionName);
          this.functionMasterForm.controls['fileName'].patchValue(this.functionMasterObject.fileName);
          this.functionMasterForm.controls['description'].patchValue(this.functionMasterObject.description);
          this.functionMasterForm.controls['status'].patchValue(this.functionMasterObject.status);
          this.functionMasterForm.controls['action'].setValue(this.functionMasterObject.action);
          this.functionMasterForm.controls['functionId'].setValue(this.functionMasterObject.functionId);
          this.updateFunctionMaster = "true";
          localStorage.setItem('editFunctionMaster', 'reset-edit-PrimaryLink');
        },
        error => console.log(error));

    }
  }
  browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  checkFunctionMasterName() {
    this.getValueByLang();
    this.functionMasterService.checkFunctionMasterName(this.functionMasterForm.value).subscribe(data => {
      if(data.length==0)
      {
      this.saveFunctionMaster();   
      }else{ 
        (this.browserLang=='en')? Swal.fire('This Function Master Name or File Name already exists. Please try another Name'):
        Swal.fire('Este Nome de Função Mestre ou Nome do Ficheiro já existe. Por favor, tente outro Nome');
      }
    },
      error => console.log(error));
  }

  saveFunctionMaster() {
    this.getValueByLang();
    this.functionMasterService.saveFunctionMaster(this.functionMasterForm.value).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
      this.moveToViewTab()
    },
      error => console.log(error));
  }
  updateFunctionMasterDetails() {
    this.getValueByLang();
    this.functionMasterService.updateFunctionMaster(this.functionMasterForm.value).subscribe(data => {
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
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Function Master'){
        this.authorised_flag=true;
      }
    }
  }

  moveToViewTab(){
    this.router.navigate(['/admin/view-function-master']);
  }
  clearForm(form: FormGroup) {
    form.reset();
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
    this.getValueByLang();
    Swal.fire({
      title:(this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        console.log("aasuchi ts submit true ku ");
        this.checkFunctionMasterName();
       // this.moveToViewTab();
      } else if(result.isDenied) {
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
      if(result.isConfirmed) {
        console.log("aasuchi ts submit true ku ");
        this.updateFunctionMasterDetails();
        //this.moveToViewTab();
      } else if(result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
}
