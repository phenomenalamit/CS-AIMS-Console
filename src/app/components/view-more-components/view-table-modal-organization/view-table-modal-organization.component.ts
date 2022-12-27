import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import  { OrganizationCrudServiceService } from 'src/app/Service/organization-crud-service.service';
import { OrganizationCrudServiceClass } from 'src/app/Service-Class/organization-crud-service-class';

@Component({
  selector: 'app-view-table-modal-organization',
  templateUrl: './view-table-modal-organization.component.html',
  styleUrls: ['./view-table-modal-organization.component.css']
})
export class ViewTableModalOrganizationComponent implements OnInit {
  organizationGetDataList: OrganizationCrudServiceClass[];
  constructor(private organizationCrudServiceService:OrganizationCrudServiceService) { }
  displayedColumns: string[] = ['year','exchangerateUsd'];

  
  


  Multilateral_or_bilateral:any;
  Emerging_non_Emerging:any;
  email:any;
  telephone:any;
  telephoneCode:any;
  fax:any;
  faxCode:any;
  city:any;
  address:any;
  fundingAgency:any;
  organizationId:any;
  category:any;
  ngOnInit(): void {
    this.organizationId=localStorage.getItem("organizationId");
    this.category=localStorage.getItem("category");
    this.getMoreTableData();
  //   this.Multilateral_or_bilateral=localStorage.getItem("Multilateral_or_bilateral");
  //   this.Emerging_non_Emerging=localStorage.getItem("Emerging_non_Emerging");
  //   this.email=localStorage.getItem("email");
  //   this.telephone=localStorage.getItem("telephone");
  //   this.telephoneCode=localStorage.getItem("telephoneCode");
  //   this.fax=localStorage.getItem("fax");
  //  this.faxCode=localStorage.getItem("faxCode");
  //  this.city=localStorage.getItem("city");
  //  this.address=localStorage.getItem("address");
  // this.fundingAgency=localStorage.getItem("fundingAgency");
  }
  closebuttonedit(){
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
  }

  fundingOrgLength:any=0;
  fundingOrgSplit:any=[];
  private getMoreTableData(){
    this.organizationCrudServiceService.getOrganizationById(this.organizationId).subscribe(data=>{
      this.organizationGetDataList=data
      this.fundingOrgLength=0;
      console.log("organizationGetDataList:",this.organizationGetDataList);
      if(this.organizationGetDataList[0].names !=null){
        this.fundingOrgSplit=this.organizationGetDataList[0].names.split(",");
        this.fundingOrgLength=this.fundingOrgSplit.length
        console.log("after split the length ",this.fundingOrgSplit.length);
      }else{
        this.fundingOrgLength=0;
      }
    });
  }
}

