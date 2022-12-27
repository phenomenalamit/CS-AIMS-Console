import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProjectCrudService } from 'src/app/Service-Application/project-crud.service';
import { ProjectCrud } from 'src/app/Service-Class/project-crud';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-mozgis-project',
  templateUrl: './delete-mozgis-project.component.html',
  styleUrls: ['./delete-mozgis-project.component.css']
})
export class DeleteMozgisProjectComponent implements OnInit {

  projectList: ProjectCrud[];
  project: ProjectCrud;
  public projectForm!: FormGroup;
  constructor( private projectCrudService:ProjectCrudService) { }

  num:any;
   tabClick(index: number) {
     this.num=index;
   }
  ngOnInit(): void {
    this.getProjectSituationDetails();
    this.projectForm = new FormGroup({
      project_formControl:new FormControl('', [Validators.required])
    });
  }

  private getProjectSituationDetails() {
    this.projectCrudService.getProjectAllViewDetails().subscribe(data => {
      console.log("response:"+data);
      this.projectList = data;
    });
  }

  deleteRecord(){
    let projectId = this.projectForm.controls['project_formControl'].value;
    console.log("project_formControl:"+projectId);
    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Delete`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteProjectById(projectId);
        Swal.fire('Deleted Successfully!', '', 'success')
        // this.moveToSelectedTab;
      } else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  private deleteProjectById(projectId:number){
    this.projectCrudService.deleteProjectFromMozgisById(projectId).subscribe(data=>{
      this.project=data;
    });
  }
}
