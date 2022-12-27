/**
 * PrimaryLink services Date :10.06.2021
 *
 * @author satyabrata swain
 *
 */

import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DialogBoxComponent } from '../../../../dialog-box/dialog-box.component';

import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { data } from 'jquery';
import projectData from '../../../../data/project-data.json';
import { Provinces } from 'src/app/Service-Class/provinces';
import {ProvincesService} from 'src/app/Service/provinces.service'
import { Districts } from 'src/app/Service-Class/districts';
import { DistrictsService } from 'src/app/Service/districts.service';
import {TranslateService} from '@ngx-translate/core';
import primaryData from '../../../../data/primary-link-data.json';

interface iati_accuracy {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-primary-link-component',
  templateUrl: './primary-link-component.component.html',
  styleUrls: ['./primary-link-component.component.css']
})
export class PrimaryLinkComponentComponent implements OnInit {


  isReadOnly:any=true;
  fill:any="fill";
  usergroup: any;
  num: any;
  pickerDisable_flag:any=false;
  cancel_flag:any;
  flagOrgName: string;
  select_options_for_district_hdn_flag=true;
  projectForm: FormGroup;
  projectForm2: FormGroup;
  primaryForm: FormGroup;
  responsibleOrganization = new FormControl();
  implementingOrganization = new FormControl();
  dac_crs_sect1 = new FormControl();
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());
  districts = new FormControl();
  provinces!:Provinces[];
  districtsList!:Districts[];
  disList: string[] = ['Matutuíne ', 'Magude ', 'Manhiça ', 'Namaacha ', 'Moamba ', 'Marracuene '];
  // dac_crs = new FormControl();
  editing=false;
  editProfile()
    {
      this.isReadOnly=false;
      this.fill="";
    }
    tabClick(index: number) {
      this.num = index;
    }
    checked = false;
    indeterminate = false;
    disabled = false;
    newDynamic: any = {};


    headers = ["Primary Link", "Link Status"];
    primaryLinkRows = [
      // {
      //   "Global Link":"",
      //   "Link Status":""
      // }
    ];

    public addItem1(): void {

      const row = this.fb.group({
        Primary_Link: [''],

        Link_Status: ['']

      });
    }

    constructor(private fb: FormBuilder) { }
  ngOnInit(): void {


    this.primaryForm = new FormGroup({

    });
// const primaryLink:any[] = [];

  for(let i=0;i<primaryData.primaryLink.length;i++){


    // console.log("primaryLink[i].Primary_Link:"+primaryData.primaryLink[i].Primary_Link);
    // console.log("primaryLink[i].Link_Status:"+primaryData.primaryLink[i].Link_Status);
    this.primaryLinkRows.push({
      "Primary Link": primaryData.primaryLink[i].Primary_Link,
      "Link Status":primaryData.primaryLink[i].Link_Status
    });
    //console.log(this.projectForm2.get('tableData').value);   // {first: null, last: null}

    //this.projectForm2.get('tableData').setValue({Primary_Link: primaryLink[i].Primary_Link, Link_Status: primaryLink[i].Link_Status});
    //console.log(this.projectForm2.get('tableData').value);
    //let control =  ((this.projectForm2.get('tableData') as FormArray).patchValue([primaryLink[i]]));
    //this.fb.control([primaryLink[i]]);
    // control.push(this.fb.control(this.projectForm2.get('tableData').value))
    // control.push();
    //console.log(this.primaryLinkRows);

  }
}
editRow(j:any){
  this.isReadOnly=false;
  this.editing = true;
}
cancelRow(j:any){
  this.isReadOnly=true;
  this.editing = false;
}

}