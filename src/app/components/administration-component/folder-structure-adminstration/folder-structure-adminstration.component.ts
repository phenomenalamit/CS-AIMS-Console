import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { startWith, map, first } from 'rxjs/operators';
import { FolderStructureServiceClass } from 'src/app/Service-Class/folder-structure-service-class';
import { ModuleListClass } from 'src/app/Service-Class/module-list-class';
import { FolderStructureService } from 'src/app/Service/folder-structure-service';
import { ModuleListService } from 'src/app/Service/module-list-service';
import Swal from 'sweetalert2';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';

@Component({
  selector: 'app-folder-structure-adminstration',
  templateUrl: './folder-structure-adminstration.component.html',
  styleUrls: ['./folder-structure-adminstration.component.css']
})
export class FolderStructureAdminstrationComponent implements OnInit {
  public folderStructureForm!: FormGroup;
  modulefilteredOption: Observable<any[]>;
  module = new FormControl('', Validators.required);
  moduleList: ModuleListClass[];
  num: any;
  subFolder: string = '';
  editId: any = null;
  viewId: any = null;
  subFolderList: any = new Array();
  updateFolderStr: FolderStructureServiceClass[];
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  folderStructureData: FolderStructureServiceClass = new FolderStructureServiceClass();
  tabClick(index: number) {
    this.num = index;
  }
  constructor(private fb: FormBuilder, private moduleListService: ModuleListService,public translate: TranslateService,
    private folderStrService: FolderStructureService, private router: Router, private readonly route: ActivatedRoute) {
    this.folderStructureForm = this.fb.group({
      module: new FormControl('', [Validators.required]),
      folderName: new FormControl('', [Validators.required]),
      // subFolder: new FormControl('', [Validators.required]),
      // folderStrData: this.fb.array([
      //   this.fb.group({
      //     subFolder: ['', Validators.required],
      //   })
      // ]),
    });
  }

  ngOnInit(): void {
    this.browserLang = localStorage.getItem('browserLang');
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(
      this.browserLang.match(/en|pt/) ? this.browserLang : 'en'
    );
    this.setToAuthFlag();
    /* Call All Module List */
    this.getModuleList();

    /* get id from url */
    this.editId = this.route.snapshot.paramMap.get("editId");
    this.viewId = this.route.snapshot.paramMap.get("viewId");

    /* This condition is checked that the id is null or not
       *  If  null then it doesn't patch any value
       *  If not null then it patch value (At Edit time)
       */
      
    if (this.editId != null) {
      /* Here we call service to get perticular values by given id  */
      this.folderStrService.getFolderStrDataById(this.editId).pipe(first()).subscribe(
        data => {
          this.updateFolderStr = data;
          /* Call getModuleList for get module List */
          this.getModuleList();

          this.folderStructureForm = this.fb.group({
            module: new FormControl('', [Validators.required]),
            folderName: new FormControl('', [Validators.required]),
            // subFolder: new FormControl(''),
            // folderStrData: this.fb.array([
            //   this.fb.group({
            //     subFolder: ['', Validators.required],
            //   })
            // ]),
          });

          /* Patch values  */
          for (let i = 0; i < this.updateFolderStr.length; i++) {
            this.folderStructureForm.controls.module.setValue(Number.parseInt(this.updateFolderStr[i].moduleName));
            this.folderStructureForm.controls.folderName.setValue(this.updateFolderStr[i].folderName);
            
            // let subFldr = this.updateFolderStr[i].subFolder.split("/");
            // this.folderStructureForm.controls.subFolder.setValue(subFldr[1]);
            // this.subFolderList.push(subFldr);

            // for (let j = 1; j < subFldr.length - 2; j++) {
            //   this.addFolderStructure();
            // }
            // console.log("sub folder list ", subFldr[2])
            // for (let k = 2; k < subFldr.length; k++) {
            //   ((this.folderStructureForm.get('folderStrData') as FormArray).at(k - 2) as FormGroup).get('subFolder').patchValue(subFldr[k]);
            // }
          }
        },
        /* If We get Any error then the error will show here
         *  Suppose we give a id that will not present in our db then it will show an error message
         */
        error => {

          console.log("error ", error);
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      );
    }
    


    /* This condition is checked that the id is null or not
       *  If  null then it doesn't patch any value
       *  If not null then it patch value (At View time)
       */
    if (this.viewId != null) {
      /* Here we call service to get perticular values by given id  */
      this.folderStrService.getFolderStrDataById(this.viewId).pipe(first()).subscribe(
        data => {
          this.updateFolderStr = data;
          /* Call getModuleList for get module List */
          this.getModuleList();

          this.folderStructureForm = this.fb.group({
            module: new FormControl('', [Validators.required]),
            folderName: new FormControl('', [Validators.required]),
            // subFolder: new FormControl('', [Validators.required]),
            // folderStrData: this.fb.array([
            //   this.fb.group({
            //     subFolder: ['', Validators.required],
            //   })
            // ]),
          });
         
          /* Patch values  */
          for (let i = 0; i < this.updateFolderStr.length; i++) {
            this.folderStructureForm.controls.module.setValue(Number.parseInt(this.updateFolderStr[i].moduleName));            
            this.folderStructureForm.controls.folderName.setValue(this.updateFolderStr[i].folderName);
            let subFldr = this.updateFolderStr[i].subFolder.split("/");
            this.folderStructureForm.controls.subFolder.setValue(subFldr[1]);
            this.folderStructureForm.controls.subFolder.disable();
            this.folderStructureForm.controls.folderName.disable();

            // let subFldr = this.updateFolderStr[i].subFolder.split("/");
           

            // for (let j = 1; j < subFldr.length - 2; j++) {
            //   this.addFolderStructure();
            // }
            // console.log("sub folder list ", subFldr[2])
            // for (let k = 2; k < subFldr.length; k++) {
            //   ((this.folderStructureForm.get('folderStrData') as FormArray).at(k - 2) as FormGroup).get('subFolder').patchValue(subFldr[k]);
            // }
            
            // for(let l=0;l<this.folderFormArray.length;l++){
            //   ((this.folderStructureForm.get('folderStrData') as FormArray).at(l) as FormGroup).get('subFolder').disable();
            // }
          }
          
        },
        /* If We get Any error then the error will show here
         *  Suppose we give a id that will not present in our db then it will show an error message
         */
        error => {

          console.log("error ", error);
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      );
    }
    if (this.viewId != null) {
    this.folderStructureForm.disable();
    }
  }
  get folderFormArray(): FormArray {
    return this.folderStructureForm.get('folderStrData') as FormArray;
  }
  //Sourav Kumar Nayak
  setToAuthFlag(){
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='Folder Structure'){
        this.authorised_flag=true;
      }
    }
  }
  addFolderStructure() {
    const row = this.fb.group({
      subFolder: ['', Validators.required],
    });
    this.folderFormArray.push(row);
  }
  deleteFolderStructure(index: number) {
    this.getValueByLang();
    if (this.folderFormArray.length == 1) {
      Swal.fire({
        title: (this.browserLang=='en')?'Atleast One Row Must Be Present.':'Deve haver pelo menos um registo',
        confirmButtonText: `OK`,
      })
    } else {
      this.folderFormArray.removeAt(index);
    }
  }

  /* If you are not fill all mandatory fields then it will give an alert */
  openMandatoryAlert() {
    this.getValueByLang();
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }

  /* Whenever we click on save button then it will show an alert */
  openSavealert() {
    // this.subFolder = '';
    // for (let j = 0; j < this.moduleList.length; j++) {
    //   if (this.moduleList[j].moduleId == (this.folderStructureForm.controls['module'].value)) {
    //     this.subFolder += '/' + this.moduleList[j].moduleName;
    //     break;
    //   }
    // }
    // for (let i = 0; i < this.folderFormArray.length; i++) {
    //   this.subFolder += '/' + (((this.folderStructureForm.get('folderStrData') as FormArray).at(i) as FormGroup).get('subFolder').value);
    // }
    this.getValueByLang()

    Swal.fire({
      /* Here it will give two option i.e Submit and Cancel */
      title: (this.editId==null)?((this.browserLang=='en')?'Do you want to Submit?':'Você quer enviar?'):((this.browserLang=='en')?'Do you want to Update?':'Você deseja actualizar?'),
      showDenyButton: true,
      confirmButtonText:(this.editId==null) ? ((this.browserLang=='en')?`Submit`:'Enviar'):((this.browserLang=='en')?`Update`:'Actualizar'),
      denyButtonText: (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {

      /* If we click on submit button then we can save data in db*/
      if (result.isConfirmed) {
        this.folderStructureData.folderStrId=this.editId;
        this.folderStructureData.moduleName = this.folderStructureForm.controls['module'].value;
        this.folderStructureData.folderName = this.folderStructureForm.controls['folderName'].value;
        // this.subFolder='';
        // this.subFolder='/';
        // this.subFolder=this.subFolder+this.folderStructureForm.controls['subFolder'].value;
        this.folderStructureData.subFolder = this.subFolder;
        this.saveFolderStructure();
      }
      /* If we click on cancel button then we can not save data */
      else if (result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    });
  }
  saveFolderStructure() {
    this.getValueByLang();
    this.folderStrService.saveFolderStructure(this.folderStructureData).pipe(first()).subscribe(
      {
        next: () => {
          if(this.editId==null){
            if(this.browserLang=='en'){
              Swal.fire('Submitted successfully', '', 'success');
            }else{
              Swal.fire('Submetido com sucesso', '', 'success');
            }
          }else{
            if(this.browserLang=='en'){
              Swal.fire('Updated successfully', '', 'success');
            }else{
              Swal.fire('Actualizado com sucesso', '', 'success');
            }
          }
          /* If data will store successfully then we call this method to go to view page */
          this.goToViewPage();
        },
        /* At Data save time if there is an error occured then here we can handel that error */
        error: error => {
          if ((error.status == 400) || (error.status == 500) || (error.status == 404)) {
            Swal.fire(error.error.message, '', 'error');
          } else {
            Swal.fire(error.error, '', 'error');
          }
        }
      }
    );
  }

  /* If data save successfully in db then it will redirect to view page */
  goToViewPage() {
    this.router.navigate(['/admin/view-folder-structure-administartion']);
  }
  /* If you click on reset button then it will clear all field that you written or selected */
  clearForm(form: FormGroup) {
    form.reset();
  }
  browserLang: any;
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
    console.log("getValueByLang-->",this.browserLang);
  }
  /* Service Call for get module List */
  private getModuleList() {
    this.moduleListService.getModuleList().subscribe(data => {
      this.moduleList = data;
      this.modulefilteredOption = this.module.valueChanges
        .pipe(
          startWith(''),
          map(module => module ? this.filterModuleList(module) : this.moduleList.slice())
        );
    });
  }
  /* filter module list */
  private filterModuleList(name: string) {
    return this.moduleList.filter(fundingOrganization =>
      fundingOrganization.moduleName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  /* move to view page */
  moveToViewpage() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/admin/view-folder-structure-administartion']));
  }

  /* This is for go to edit page */
  goToEdit(editId: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/edit-folder-structure-administartion', editId]));
  }
}
