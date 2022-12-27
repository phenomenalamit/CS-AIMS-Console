import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import  { IndividualCrudServiceService } from 'src/app/Service/individual-crud-service.service';
import { IndividualCrudServiceClass } from 'src/app/Service-Class/individual-crud-service-class';
@Component({
  selector: 'app-view-table-modal-individual',
  templateUrl: './view-table-modal-individual.component.html',
  styleUrls: ['./view-table-modal-individual.component.css']
})
export class ViewTableModalIndividualComponent implements OnInit {
  individualGetDataList: IndividualCrudServiceClass[];
  constructor(private individualCrudServiceService:IndividualCrudServiceService) { }
  displayedColumns: string[] = ['year','exchangerateUsd'];


  email1:any;
  email2:any;
  phoneCode1:any;
  phone1:any;
  phoneCode2:any;

  phone2:any;
  faxCode:any;
  fax:any;
  address:any;
  city:any;
  country:any;
  otherContactDetails:any;
  individualId:any;

  ngOnInit(): void {
    this.individualId=localStorage.getItem("individualId");
    console.log("individualId:"+this.individualId);
    this.getMoreTableData();
    // alert(this.individualId);
    // this.getIndividualDetails();

  //   this.email1=localStorage.getItem("email1");
  //   this.email2=localStorage.getItem("email2");
  //   this.phoneCode1=localStorage.getItem("phoneCode1");
  //   this.phone1=localStorage.getItem("phone1");
  //   this.phoneCode2=localStorage.getItem("phoneCode2");
  //   this.phone2=localStorage.getItem("phone2");
  //  this.faxCode=localStorage.getItem("faxCode");
  //  this.fax=localStorage.getItem("fax");
  //  this.address=localStorage.getItem("address");
  // this.city=localStorage.getItem("city");
  // this.country=localStorage.getItem("country");
  // this.otherContactDetails=localStorage.getItem("otherContactDetails");
  }
  closebuttonedit(){
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
  }
  // private getIndividualDetails() {
  //   this.individualCrudServiceService.getIndividualCurd().subscribe(data => {
  //     console.log("return data" + data.length);
  //     this.individualGetDataList = data;
  //   });
  // }

  private getMoreTableData(){
    console.log("individualId in getMoreTableData:"+this.individualId);
    this.individualCrudServiceService.getIndividualViewMoreById(this.individualId).subscribe(data=>{
      console.log(this.individualGetDataList=data)
      console.log("individual id:",this.individualId);
      this.individualGetDataList=data;
    });
  }
}



