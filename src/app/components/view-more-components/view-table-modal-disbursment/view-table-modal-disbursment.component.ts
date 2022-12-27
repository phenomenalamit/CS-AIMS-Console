/**
 * View More Disbursement :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */

import { Component, OnInit } from '@angular/core';
import { DisbursementCrudService } from 'src/app/Service-Class/disbursement-crud-service';
import { DisbursementCrudServiceService } from 'src/app/Service/disbursement-crud-service.service';

@Component({
  selector: 'app-view-table-modal-disbursment',
  templateUrl: './view-table-modal-disbursment.component.html',
  styleUrls: ['./view-table-modal-disbursment.component.css']
})
export class ViewTableModalDisbursmentComponent implements OnInit {
  disbursementDataList: DisbursementCrudService[];
  constructor(private disbursementCrud:DisbursementCrudServiceService) { }
   disbursement_id:any;
  ngOnInit(): void {
    this.disbursement_id=localStorage.getItem("disbursementId_vm");
    console.log("id is1",this.disbursement_id)
    this.getDisbursementViewMoreData();
  }
  closebuttonedit(){
    localStorage.setItem('EditDisbursemnt','');
    //localStorage.setItem('EditOrgElement','');
  }
  private getDisbursementViewMoreData(){
    console.log("id is2",this.disbursement_id)
    this.disbursementCrud.getDisuburementViewMoreById(this.disbursement_id).subscribe(data=>{
      console.log(this.disbursementDataList=data)

      this.disbursementDataList=data;
    });
  }
}
