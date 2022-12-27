
import { DOCUMENT } from '@angular/common';
import { Component, OnInit ,AfterViewInit, ViewChild, ViewChildren, QueryList, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import Swal, * as swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { DialogBoxComponent } from '../../../dialog-box/dialog-box.component';
import { Location } from '@angular/common';
import { Envelope } from '../../../model/envelope';
// import { LanguagemasterService } from '../languagemaster.service';
import { ViewEnvelopeComponentComponent } from '../../../components/view-components/view-envelope-component/view-envelope-component.component';
import { ExcelService } from '../../../Service/excel.service';
import { EnvelopeServiceClass } from 'src/app/Service-Class/envelope-service-class';
import { EnvelopeServiceService } from 'src/app/Service/envelope-service.service';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { EnvelopeDocumentViewComponent } from '../../document-repository/view-document/envelope-document-view/envelope-document-view.component';
import { EnvelopeDocumentUploadComponent } from '../../document-repository/upload-document/envelope-document-upload/envelope-document-upload.component';


const ELEMENT_DATA: Envelope[] = [
  {position: 1, donor: 'World Bank', year: '2020', envagrcurr: '10079', exchangerateusd: '8.2',exchangeratemzn:'9.2',amtannenvmeti:'10079',annenvamtusd:'10079',purdaccrs:'3 digits (CRS)',comments:'xyz'},
  {position: 2,donor: 'WHO',year: '2019', envagrcurr: '4026', exchangerateusd: '9.2',exchangeratemzn:'9.2',amtannenvmeti:'4026',annenvamtusd:'4026',purdaccrs:'5 digits (SNPC)',comments:'abc'},
  {position: 3,donor: 'UNESCO',year: '2020', envagrcurr: '6941', exchangerateusd: '8.2',exchangeratemzn:'9.2',amtannenvmeti:'6941',annenvamtusd:'10079',purdaccrs:'3 digits (CRS)',comments:'xyz'},
  {position: 4,donor: 'World Bank',year: '2018', envagrcurr: '90122', exchangerateusd: '9.2',exchangeratemzn:'9.2',amtannenvmeti:'90122',annenvamtusd:'4026',purdaccrs:'5 digits (SNPC)',comments:'xabcyz'},
  {position: 5,donor: 'UNESCO',year: '2018', envagrcurr: '90122', exchangerateusd: '8.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'10079',purdaccrs:'3 digits (CRS)',comments:'xyz'},
  {position: 6,donor: 'UNESCO',year: '2018', envagrcurr: '120107', exchangerateusd: '9.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'4026',purdaccrs:'5 digits (SNPC)',comments:'abc'},
  {position: 7,donor: 'WHO',year: '2019', envagrcurr: '140067', exchangerateusd: '8.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'10079',purdaccrs:'3 digits (CRS)',comments:'xyz'},
  {position: 8,donor: 'WHO',year: '2017', envagrcurr: '1994', exchangerateusd: '9.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'4026',purdaccrs:'5 digits (SNPC)',comments:'abc'},
  {position: 9,donor: 'UNICEF',year: '2019', envagrcurr: '1984', exchangerateusd: '8.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'10079',purdaccrs:'3 digits (CRS)',comments:'xyzabc'},
  {position: 10,donor: 'UNICEF',year: '2018', envagrcurr: '201574', exchangerateusd: '9.2',exchangeratemzn:'9.2',amtannenvmeti:'120107',annenvamtusd:'4026',purdaccrs:'5 digits (SNPC)',comments:'xyz'},

];


@Component({
  selector: 'app-edit-envelope-component',
  templateUrl: './edit-envelope-component.component.html',
  styleUrls: ['./edit-envelope-component.component.css']
})
export class EditEnvelopeComponentComponent implements OnInit {
  public envelopeForm!: FormGroup;
  envelope:Envelope =new Envelope();
  elements!: NodeListOf<Element>;
  usergroup:any;
  displayedColumns: string[] = ['position', 'donor', 'year', 'envagrcurr', 'exchangerateusd','amtannenvmeti','annenvamtusd','purdaccrs','comments','edit'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router :Router,private location:Location,
    @Inject(DOCUMENT) private _document: HTMLDocument,private excelService: ExcelService,private dialog: MatDialog,
    private envelopeService:EnvelopeServiceService,private readonly route: ActivatedRoute,private notificationService:NotificationService) { }


     h:HTMLDocument;

    num:any;
    tabClick(index: number) {
      this.num=index;
    }

    generateExcel(){
      console.log("123456");
      let obj = new ViewEnvelopeComponentComponent(this.h,this.excelService,this.router,this.dialog,this.location,this.envelopeService,this.notificationService);
      obj.ExportTOExcel();
    }
    EditEnv:any;
    // viewMoreEnv:any=null;
    id:any=null;
    viewByTableId:any=null;
    ngOnInit(): void {
      this.viewByTableId=this.route.snapshot.paramMap.get("tabId");
      this.id=this.route.snapshot.paramMap.get("id");
      localStorage.setItem("EditEnvUrl","EditEnvUrl");
this.EditEnv=localStorage.getItem("EditEnv");
console.log("editenv inside envelope-->",this.EditEnv);
// this.viewMoreEnv=localStorage.getItem("ViewMoreEnv");

      this.usergroup=localStorage.getItem('usergroup');
       //Validation Starts form Here
      this.envelopeForm = new FormGroup({
        year: new FormControl('', [Validators.required]),
        envagrcurr: new FormControl('', [Validators.required]),
        donor:new FormControl('', [Validators.required]),
        exchangerateusd:new FormControl(''),
        amtannenvmeti:new FormControl(''),
        annenvamtusd:new FormControl(''),
        purdaccrs:new FormControl(''),
        comments:new FormControl('')
      });
    }
    public hasError = (controlName: string, errorName: string) =>{
      return this.envelopeForm.controls[controlName].hasError(errorName);
    }

    public createEnvelope = (envelopeFormValue) => {
      if (this.envelopeForm.valid) {
        this.executeEnvelopeCreation(envelopeFormValue);
      }
    }
    private executeEnvelopeCreation = (envelopeFormValue) => {
      let envelope: Envelope = {
        year: envelopeFormValue.year,
        envagrcurr: envelopeFormValue.envagrcurr,
        exchangerateusd: envelopeFormValue.exchangerateusd,
        exchangeratemzn: envelopeFormValue.exchangeratemzn,
        amtannenvmeti: envelopeFormValue.amtannenvmeti,
        donor:envelopeFormValue.donor,
        annenvamtusd:envelopeFormValue.annenvamtusd,
        purdaccrs:envelopeFormValue.purdaccrs,
        comments:envelopeFormValue.comments,
        position:envelopeFormValue.position

      }
    }
 //Validation ends Here
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

  moveToEnvelopeTab(){
    // this.location.back();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-envelope']));
  }


  opensweetalert()
  {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('New record created and saved!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  opensweetalert2()
  {
    Swal.fire({
      title: 'Do you want to Save as Draft?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        Swal.fire('Saved as Draft Successfully!', '', 'success')
        this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogBoxComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['organization']);
      console.log(`Dialog result: ${result}`);
    });
  }
  clearForm(form: FormGroup) {
    form.reset();
    }
 /* This is for open document modal */
  openDocumentDialog() {
    const dialogRef = this.dialog.open(EnvelopeDocumentViewComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-envelope']);
    });
  }

  openDialog2() {
    let refNm=localStorage.getItem("refNM");
    if(refNm == null || refNm== ''){
      Swal.fire('Please Enter Envelope Reference Name.')
    }else{
      const dialogRef = this.dialog.open(EnvelopeDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['envelope']);
        // console.log(`Dialog result: ${result}`);
        // localStorage.removeItem('refNM');
      });
    }
  }
  
}






