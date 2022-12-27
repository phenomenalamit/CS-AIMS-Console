/**
 * View More Payment :10.06.2021
 *
 * @author Karisma Tripathy
 *
 */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentCrudService } from 'src/app/Service-Class/payment-crud-service';
import { PaymentCrudServiceService } from 'src/app/Service/payment-crud-service.service';
@Component({
  selector: 'app-view-table-modal-payment',
  templateUrl: './view-table-modal-payment.component.html',
  styleUrls: ['./view-table-modal-payment.component.css']
})
export class ViewTableModalPaymentComponent implements OnInit {
  paymentDataList: PaymentCrudService[];
  constructor(private paymentCrud:PaymentCrudServiceService) { }
  payment_id:any;

  ngOnInit(): void {
    this.payment_id=localStorage.getItem("paymentId_vm");
    console.log("id is1",this.payment_id)
    this.getPaymentViewMoreData();
  }
  closebuttonedit(){
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
  }
  private getPaymentViewMoreData(){
    console.log("id is2",this.payment_id)
    this.paymentCrud.getPaymentViewMoreById(this.payment_id).subscribe(data=>{
      console.log(this.paymentDataList=data)

      this.paymentDataList=data;
    });
  }
}



