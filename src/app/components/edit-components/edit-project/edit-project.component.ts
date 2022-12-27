import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectDocumentUploadComponent } from '../../document-repository/upload-document/project-document-upload/project-document-upload.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  usergroup:any;
  EditProject:any;
  viewMoreProject:any;
  num:any;
  projectId:any=null;
  draftedId:any=null;
  viewProjectId:any=null;

  constructor(private router: Router,private location: Location,private readonly route: ActivatedRoute,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("projectId");
    this.viewProjectId=this.route.snapshot.paramMap.get("viewProjectId");
    this.draftedId=this.route.snapshot.paramMap.get("draftedId");
    localStorage.setItem("EditProjectUrl","EditProjectUrl");
    this.EditProject=localStorage.getItem("EditProject");
    console.log("EditProject inside Project-->",this.EditProject);
    this.viewMoreProject=localStorage.getItem("ViewMoreProject");
    this.usergroup=localStorage.getItem('usergroup');
  }

  moveToProjectTab(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    // this.router.navigate(['/admin/project']));
    this.location.back();
  }

  tabClick(index: number) {
    this.num=index;
  }

  openDialog2() {
    let refNm=localStorage.getItem("prjRefNm");
    if(refNm == 'null' || refNm== ''){
      Swal.fire('Please Enter Project Title.')
    }else{
      const dialogRef = this.dialog.open(ProjectDocumentUploadComponent);
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['project']);
        console.log(`Dialog result: ${result}`);
        localStorage.removeItem('prjRefNm');
      });
    }
  }

}
