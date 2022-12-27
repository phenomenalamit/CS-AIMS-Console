import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-view-table-modal-monitoring',
  templateUrl: './view-table-modal-monitoring.component.html',
  styleUrls: ['./view-table-modal-monitoring.component.css']
})
export class ViewTableModalMonitoringComponent implements OnInit {

  constructor() { }
  
  displayedColumns: string[] = ['year','exchangerateUsd'];
  
  


  prioritypqg:any;
  objpqg:any;
  conddisburse:any;
  startDate:any;
  endDate:any;
  levelOfAction:any;
  implementingorganization:any;
  ngOnInit(): void {
    this.prioritypqg=localStorage.getItem("prioritypqg");
    this.objpqg=localStorage.getItem("objpqg");
    this.conddisburse=localStorage.getItem("conddisburse");
   this.startDate=localStorage.getItem("startDate");
   this.endDate=localStorage.getItem("endDate");
   this.levelOfAction=localStorage.getItem("levelOfAction");
   this.implementingorganization=localStorage.getItem("implementing organization");
  }
  closebuttonedit(){
    localStorage.setItem('EditOrg','');
    localStorage.setItem('EditOrgElement','');
  }
}







