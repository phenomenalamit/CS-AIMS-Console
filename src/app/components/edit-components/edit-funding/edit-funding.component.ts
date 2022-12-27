import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FinancingDocumentUploadComponent } from '../../document-repository/upload-document/financing-document-upload/financing-document-upload.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-funding',
  templateUrl: './edit-funding.component.html',
  styleUrls: ['./edit-funding.component.css']
})
export class EditFundingComponent implements OnInit {

  usergroup:any;
  // EditFunding:any;
  // viewMoreFunding:any;
  ViewMoreFundingFromProject:any;
  EditId:any = null;
  viewMoreId: any = null;
  viewMoreDraftedFaId: any = null;
  constructor(private router: Router,private location: Location,private route: ActivatedRoute,public dialog:MatDialog) { }
  
  ngOnInit(): void {
    this.EditId = this.route.snapshot.paramMap.get("editFaId");
    /* Below is for At View more time we have to get the id from url */
    this.viewMoreId = this.route.snapshot.paramMap.get("viewMoreFaId");
    this.viewMoreDraftedFaId = this.route.snapshot.paramMap.get("viewMoreDraftdFaId");
    console.log("this.viewMoreDraftedFaId: ",this.viewMoreDraftedFaId);
    // localStorage.setItem("EditFundUrl","EditFundUrl");
    // this.EditFunding=localStorage.getItem("EditFunding");
    // console.log("EditFunding inside Fundnig-->",this.EditFunding);
    // this.viewMoreFunding=localStorage.getItem("ViewMoreFunding");
    this.usergroup=localStorage.getItem('usergroup');
    this.ViewMoreFundingFromProject = localStorage.getItem("ViewMoreFundingFromProject");
  }
  moveToFundingTab(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/funding']));
    this.location.back();
  }

  openDialog2() {
    let refNm=localStorage.getItem("fundingRefNM");
    if(refNm == null || refNm== ''){
      Swal.fire('Please Enter Funding Donor Title.')
    }else{
        const dialogRef = this.dialog.open(FinancingDocumentUploadComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['funding']);
            console.log(`Dialog result: ${result}`);
            // localStorage.removeItem('fundingRefNM');
        });
    }
  }

}
