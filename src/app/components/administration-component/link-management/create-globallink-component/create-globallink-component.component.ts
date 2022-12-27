/**
 * GlobalLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from 'src/app/components/add-components/add-user-type-component/add-user-type-component.component';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';

import { GlobalLink } from 'src/app/model/global-link';
import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-globallink-component',
  templateUrl: './create-globallink-component.component.html',
  styleUrls: ['./create-globallink-component.component.css']
})
export class CreateGloballinkComponentComponent implements OnInit {
  public globalLinkForm!: FormGroup;
  editGlobalLink: any;
  updateGlobalLink = "false";
  id: number;
  globalLink: GlobalLink;
  globalLinkdata: any;
  globalLinkList: GlobalLink[];
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  constructor(private globalLinlService: GlobalLinkServiceService,
    private router: Router, private route: ActivatedRoute) { }
  gLink: GlobalLink = new GlobalLink();
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
    this.globalLinkForm = new FormGroup({
      globalLinkName: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      globalLinkId: new FormControl(),
      icon:new FormControl(),
    });
    this.editGlobalLink = localStorage.getItem("editGlobalLink");
    if (this.editGlobalLink == "editGlobalLink") {
      this.id = this.route.snapshot.params['id'];
      console.log("globalLink Id " + this.id);
      this.globalLinlService.getGlobalLinkById(this.id)
        .subscribe(
          data => {
            this.globalLinkdata = data

            console.log("globalLink class data");
            console.log(this.globalLinkdata);
            this.globalLink = this.globalLinkdata;
            console.log("globalLink class Icon name===>>",this.globalLink.icon);
            this.globalLinkForm.controls['globalLinkId'].patchValue(this.globalLink.globalLinkId);
            this.globalLinkForm.controls['globalLinkName'].patchValue(this.globalLink.globalLinkName);
            this.globalLinkForm.controls['icon'].patchValue(this.globalLink.icon);
            this.globalLinkForm.controls['status'].patchValue(this.globalLink.status);
            this.updateGlobalLink = "true";
            localStorage.setItem('editGlobalLink', 'reset-edit-GlobalLink');
          },
          error => console.log(error));

    }
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Create Global Link'){
        this.authorised_flag=true;
      }
    }
  }
  browserLang:any
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }
  checkGlobalLinkName() {
    this.getValueByLang();
    this.globalLinlService.checkGlobalLinkName(this.globalLinkForm.value).subscribe(data => {
      console.log(data);
      if(data===null)
      {
      this.saveGlobalLink();   
      }else{ 
        (this.browserLang=='en')?Swal.fire('This Global Link Name already exists. Please try another Name'):Swal.fire('Este Nome de Link Global já existe. Por favor, tente outro Nome');
      }
    },
      error => console.log(error));
  }
  saveGlobalLink() {
    this.getValueByLang();
    this.globalLinlService.saveGlobalLink(this.globalLinkForm.value).subscribe(data => {
      console.log(data);
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
      this.moveToViewTab();
    },
      error => console.log(error));
  }
  updateGlobalLinkForm() {
    this.getValueByLang();
    this.globalLinlService.updateGlobalLink(this.globalLinkForm.value).subscribe(data => {
      if(this.browserLang=='en'){
        Swal.fire('Updated successfully', '', 'success');
      }else{
        Swal.fire('Actualizado com sucesso', '', 'success');
      }
      this.moveToViewTab();
    },
      error => console.log(error));
  }
  private getGlobalLinkDetails() {
    this.globalLinlService.getGlobalLinkList().subscribe(data => {
      console.log("return data" + data.length);
      this.globalLinkList = data;

    });
  }
  public createUserform = (userTypeFormValue) => {
    if (this.globalLinkForm.valid) {
      this.executeUserTypeCreation(userTypeFormValue);
    }
  }
  private executeUserTypeCreation = (userTypeFormValue) => {
    let userTypes: UserType = {
      userType: userTypeFormValue.userType


    }
  }

  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  moveToViewTab() {
    this.router.navigate(['/admin/view-global-link']);
  }
  clearForm(form: FormGroup) {
    form.reset();
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
        console.log("aasuchi ts Update true ku ");
        this.updateGlobalLinkForm();
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
      title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText:(this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText:(this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("aasuchi ts submit true ku ");
        this.checkGlobalLinkName();
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
}

