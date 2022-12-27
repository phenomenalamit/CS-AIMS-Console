/**
 * Edit GlobalLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { GlobalLink } from 'src/app/model/global-link';

@Component({
  selector: 'app-edit-global-link-component',
  templateUrl: './edit-global-link-component.component.html',
  styleUrls: ['./edit-global-link-component.component.css']
})
export class EditGlobalLinkComponentComponent implements OnInit {
  public globalLinkForm!: FormGroup;
  id:number;
  globalLink: GlobalLink;
  globalLinkdata: any;
  num:any;
  usergroup:any;
  editGlobalLink:any;
  viewMonitoring:any;
  constructor(private globalLinlService: GlobalLinkServiceService, private route:ActivatedRoute,
    private router: Router,private location: Location) { }

  ngOnInit(): void {

    localStorage.setItem("EditGlobalLinkUrl","EditGlobalLinkUrl");
    this.usergroup=localStorage.getItem('usergroup');
    console.log("localsto editglobalLink--->",localStorage.getItem("editGlobalLink"));
    this.editGlobalLink=localStorage.getItem("editGlobalLink");

  }
  moveToMonitoringTab(){
    this.location.back();
     }
  moveToViewTab(){
    this.router.navigate(['/admin/view-global-link']);
  }
  updateGlobalLink() {
    this.globalLinlService.updateGlobalLink(this.globalLinkForm.value).subscribe(data => {

      console.log(data);
      console.log("aasuchi ts file  ku");

    },
      error => console.log(error));
  }
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  opensweetalert() {
    Swal.fire({
      title: 'Do you want to Update?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Update`,
      denyButtonText: `Cancel`,
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        console.log("aasuchi ts update true ku ");
       this.updateGlobalLink();
        Swal.fire('Updated Successfully!', '', 'success')
        this.moveToViewTab();
      } else if(result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }
}
