import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MonitoringDocumentUploadComponent } from '../../document-repository/upload-document/monitoring-document-upload/monitoring-document-upload.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-monitoring',
  templateUrl: './edit-monitoring.component.html',
  styleUrls: ['./edit-monitoring.component.css']
})
export class EditMonitoringComponent implements OnInit {

  constructor(private location: Location,private readonly route: ActivatedRoute,private dialog: MatDialog, private router: Router) { }
  num:any;
  usergroup:any;
  editMonitoring:any;
  viewMonitoring:any;
  contractId:any=null;
  monitoringId:any=null;
  tabClick(index: number) {
    this.num=index;
  }
  ngOnInit(): void {
    localStorage.setItem("EditMonitoringUrl","EditMonitoringUrl");
    this.usergroup=localStorage.getItem('usergroup');
    console.log("localsto editmon--->",localStorage.getItem("editMonitoring"));
    this.editMonitoring=localStorage.getItem("editMonitoring");
    this.viewMonitoring=localStorage.getItem("viewMonitoring");
    this.contractId = this.route.snapshot.paramMap.get("contractId");
    this.monitoringId=this.route.snapshot.paramMap.get("monitoringId");
  }
  moveToMonitoringTab(){
 this.location.back();
  }
  openDialog2() {
    let refNm=localStorage.getItem("monitoringRefNM");
    if(refNm == null || refNm== ''){
      Swal.fire('Please Select a Budaget Project.')
    }else{
    const dialogRef = this.dialog.open(MonitoringDocumentUploadComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['monitoring']);
      console.log(`Dialog result: ${result}`);
    });
  }
  }
}
