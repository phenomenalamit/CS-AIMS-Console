
/**
 * GlobalLink services Date :10.06.2021
 * 
 * @author satyabrata swain
 *
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import globalData from '../../../../data/global-link-data.json';
@Component({
  selector: 'app-global-link-component',
  templateUrl: './global-link-component.component.html',
  styleUrls: ['./global-link-component.component.css']
})
export class GlobalLinkComponentComponent implements OnInit {

  isReadOnly: any = true;
  fill: any = "fill";
  usergroup: any;
  editing=false;
  num: any;
  pickerDisable_flag: any = false;
  cancel_flag: any;
  flagOrgName: string;
  select_options_for_district_hdn_flag = true;
  projectForm: FormGroup;
  globalForm: FormGroup;
  responsibleOrganization = new FormControl();
  implementingOrganization = new FormControl();
  dac_crs_sect1 = new FormControl();



  tabClick(index: number) {
    this.num = index;
  }
  checked = false;
  indeterminate = false;
  // labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  //dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};

  editProfile() {
    this.isReadOnly = false;
    this.fill = "";
  }
  headers = ["Global Link", "Link Status"];
  globalLinkRows = [
    // {
    //   "Global Link":"",
    //   "Link Status":""
    // }
  ];
  //  mj:any={"DAC-CRS sector" : [],"Funds":[]};

  public addItem1(): void {

    const row = this.fb.group({
      Global_Link: [''],

      Link_Status: ['']

    });
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.globalForm = new FormGroup({
      // usd_mznERate: new FormControl(''),
      // odaAmountMzn: new FormControl(''),
      // odaAmountUsd: new FormControl(''),
      // nationalAmountmzn: new FormControl(''),
      // nationalAmountusd: new FormControl(''),
      // totalAmountMzn: new FormControl(''),
      // totalAmountUsd: new FormControl(''),
      // tableData: this.fb.array([

      //   this.fb.group({
      //     Global_Link : [''],
      //     Link_Status:[''],

      //   })  ]),





    });

    for (let i = 0; i < globalData.globalLink.length; i++) {
      this.globalLinkRows.push({
        "Global Link": globalData.globalLink[i].Global_Link,
        "Link Status": globalData.globalLink[i].Link_Status
      });
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


