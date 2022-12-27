/**
 * Edit PrimaryLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionMaster } from 'src/app/model/function-master';

import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import Swal from 'sweetalert2';
import { GlobalLink } from 'src/app/model/global-link';
import { FunctionMasterService } from 'src/app/Service-Application/function-master.service';

@Component({
  selector: 'app-edit-primary-link-component',
  templateUrl: './edit-primary-link-component.component.html',
  styleUrls: ['./edit-primary-link-component.component.css']
})
export class EditPrimaryLinkComponentComponent implements OnInit {
  public primaryLinkForm!: FormGroup;
  functionMasterList:FunctionMaster[];
  globalLinkList:GlobalLink[];
  id:number;
  num: any;
  funds:any;
  primaryLinkdata: any;
  primaryLink:PrimaryLink;
  constructor(private primaryLinkService: PrimaryLinkService, private route:ActivatedRoute,private globalLinkServiceService: GlobalLinkServiceService,private functionMasterService: FunctionMasterService,  private router: Router) { }

  ngOnInit(): void {



    this.primaryLinkForm = new FormGroup({
      primaryLinkId:new FormControl(),
      primaryLinkName: new FormControl('', [Validators.required]),
      functionId: new FormControl('', [Validators.required]),
      globalLinkId: new FormControl('', [Validators.required]),
      status: new FormControl(),



    });


  }

  tabClick(index: number) {
    this.num = index;
  }


  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  moveToViewTab(){
    this.router.navigate(['/admin/view-primary-link']);
  }
  clearForm(form: FormGroup) {
    form.reset();
  }

}
