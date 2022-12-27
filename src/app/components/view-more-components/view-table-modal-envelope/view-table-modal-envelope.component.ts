import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-table-modal-envelope',
  templateUrl: './view-table-modal-envelope.component.html',
  styleUrls: ['./view-table-modal-envelope.component.css']
})
export class ViewTableModalEnvelopeComponent implements OnInit {
  constructor() { }
 year:any;
  currency:any;
  purposeDacCrs:any;
  ngOnInit(): void {
   
   this.year=localStorage.getItem("year");
   this.currency=localStorage.getItem("currency");
  this.purposeDacCrs=localStorage.getItem("purposeDacCrs");
  }
  closebuttonedit(){
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
  }
}

