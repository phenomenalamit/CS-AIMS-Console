import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-organization-component',
  templateUrl: './edit-organization-component.component.html',
  styleUrls: ['./edit-organization-component.component.css']
})
export class EditOrganizationComponentComponent implements OnInit {
  usergroup:any;
  constructor(private currencyPipe: CurrencyPipe,
    private router :Router,
    private readonly route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private excelService: ExcelService,public dialog:MatDialog,private location: Location) { }

    id:any=null;
    

  viewByTableId:any=null;

    num:any;
    EditOrganization:any;
    ViewMoreOrganization:any;
    tabClick(index: number) {
      this.num=index;
    }
    viewOrgId:any=null;
    draftedId:any = null;
    //ViewMoreDisbursement:any;
  ngOnInit(): void {
    this.viewByTableId=this.route.snapshot.paramMap.get("id");
    this.id=this.route.snapshot.paramMap.get("orgId");
    this.viewOrgId=this.route.snapshot.paramMap.get("viewId");
    this.draftedId = this.route.snapshot.paramMap.get("draftedId");

    localStorage.setItem("EditOrgUrl","EditOrgUrl");
    this.usergroup=localStorage.getItem('usergroup');
    
    // this.EditOrganization=localStorage.getItem("EditOrganization");
    // this.ViewMoreOrganization=localStorage.getItem("ViewMoreOrganization");
  }

  moveToOrganizationTab(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/organization']));
    this.location.back();
  }

}
