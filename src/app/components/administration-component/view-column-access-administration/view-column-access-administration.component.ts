import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewColumnAccessService } from 'src/app/Service/view-column-access.service';
import { ViewColumnAccessServiceClass } from 'src/app/Service-Class/view-column-access-service-class';

import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { table } from 'console';


@Component({
  selector: 'app-view-column-access-administration',
  templateUrl: './view-column-access-administration.component.html',
  styleUrls: ['./view-column-access-administration.component.css']
})
export class ViewColumnAccessAdministrationComponent implements OnInit {

  public viewForm!: FormGroup;
  select_options_for_finding_hdn_flag = true;
  select_options_for_field_hdn_flag = true;
  columndetails: ViewColumnAccessServiceClass = new ViewColumnAccessServiceClass(); //to store label details

  sortedData: tableSkeleton[];
  // headers = ["Column Name","Status"];
  displayedColumns = ["Column Name", "Status", "Action"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any; //to store table data
  tempLabelArr: ViewColumnAccessServiceClass[] = []; // to store the original data of label (data of label before its clicking edit button)
  constructor(private viewColumnService: ViewColumnAccessService, private fb: FormBuilder) {
    this.sortedData = this.tableData.slice();
  }
  num: any;
  tabClick(index: number) {
    this.num = index;
  }
  ngOnInit(): void {
    this.usergroup = localStorage.getItem('usergroup');
    this.viewForm = new FormGroup({
      moduleName: new FormControl('', [Validators.required]),

      tableData: this.fb.array([


      ]),
    });
  }
  findingOptionList = [];
  findingsList: any = [
    {
      'findingsName': 'View Envelope List',
      findingOptions: [
        'Funding Organization', 'DAC-CRS Sector', 'Year', 'Amount', 'Currency', 'Amount (USD)'
      ]
    },

    {
      'findingsName': 'View Financial Agreement List',
      findingOptions: [
        'Funding Donor Title', 'Funding Organization', 'Start Date', 'End Date', 'Amount (MZN)', 'Amount (USD)'
        , 'Donor Funding Reference', 'Donor', 'Responsible Organization',
        'Financing Situation', 'Type of Aid'

      ]
    },

    {
      'findingsName': 'View Project List',
      findingOptions: [
        'Project Title', 'Project Situation',
        'Responsible Organization', 'Allocated Amount (MZN)', 'Allocated Amount (USD)', 'Province',
        'District', 'Financial Execution Rate (in %)'
      ]
    },
    {
      'findingsName': 'View Disbursement List',
      findingOptions: [
        'Disbursement Reference',
        'Project Title', 'Disbursement Amount', 'Disbursement Currency', 'Amount (MZN)', 'Amount (USD)'
        , 'Financial Agreement', 'Responsible Organization', 'SWIFT Code (IB)', 'SWIFT Code (RB)', 'Disbursement Date',
        'Receiving Bank NIB', 'Exchange Rate (MZN)', 'Exchange Rate (USD)'
      ]
    },
    {
      'findingsName': 'View Payment List',
      findingOptions: [
        'Payment Reference', 'State Budget', 'Amount', 'Payment Currency', 'Amount (MZN)', 'Amount (USD)', 'Financial Agreement',
        'Project', 'UGB MEO', 'MEO Resource Sources', 'Payment Date'
      ]
    },
    {
      'findingsName': 'View Organization List',
      findingOptions: [
        'Name', 'Acronym', 'Category', 'Country / Parent Organization', 'Multilateral'
        , 'DAC-OECD-Member', 'Telephone Code', 'Telephone', 'Fax Code', 'Email', 'City', 'Address'
      ]
    },
    {
      'findingsName': 'View Individual List',
      findingOptions: [
        'Name', 'Surname', 'Post', 'Organization', 'Email 1', 'Email 2'
        , 'Phone Number Code 1', 'Phone Number 1', 'Phone Number Code 2',
        'Phone Number 2', 'Fax', 'Address', 'City', 'Country', 'Other Contact Details'
      ]
    },
    {
      'findingsName': 'View Monitoring List',
      findingOptions: [
        'Project Name', 'Start Date', 'End Date',
        'Total Budget (MZN)', 'Level of Action', 'Strategic Priority PQG',
        'Strategic Objective PQG', 'Disbursement Condition'

      ]
    }
  ];
  //method to filter the table datasource
  applyFilter(filterValue: string) {

    //filtering the datasource
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //shows the filtered data starting from the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //method to sort the data when header is clicked
  sortData(sort: Sort) {
    const data = this.tableData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }


    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'columnName': return compare(a.columnName, b.columnName, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }


  usergroup: any;
  moduleName: any;
  columnObj = [];
  columnName: any;
  userGroup: string = "dngdpadmin"; //letter this field will be softcoded

  // ModuleChangeAction(){
  //   this.select_options_for_finding_hdn_flag=false;
  //   console.log(" user group is ",this.usergroup);
  //   this.moduleName=this.viewForm.controls.moduleName.value;
  //   console.log(" modulename is=> ",this.viewForm.controls.moduleName.value);
  //   this.columnObj.push( this.moduleName,this.userGroup);
  //   console.log("Object is:",this.columnObj)
  //   this.viewColumnService.getCloumnAccessByUser(this.columnObj).subscribe(data => {
  //     console.log("Coming to view Column service ")
  //     console.log(" userwise Data is ",data);
  //   });
  //   // let finding = this.viewForm.controls['moduleName'].value;
  //   // let dropDownData = this.findingsList.find((data: any) => data.findingsName === finding);
  //   //  console.log(dropDownData);
  //   // if (dropDownData) {
  //   //   this.findingOptionList = dropDownData.findingOptions;
  //   // } else {
  //   //   this.findingOptionList = [];
  //   // }
  // }

  tableData: tableSkeleton[] = [];


  ModuleChangeAction() {
    this.select_options_for_finding_hdn_flag = false;
    console.log(" user group is----- ", this.usergroup);

    this.moduleName = this.viewForm.controls.moduleName.value;

    console.log(" modulename is=>------ ", this.viewForm.controls.moduleName.value);
    this.viewColumnService.getCloumnAccessByUser(this.usergroup, this.moduleName).subscribe(data => {

      console.log("Coming to view Column service ")
      console.log(" response Module Data :", data);


      //storing the data in the varibale
      this.columndetails = data[0][0];
      console.log("  Data in columndetails is-- ", this.columndetails);
      this.tableData = [];
      Object.keys(this.columndetails).forEach((key) => {
        // console.log("key :"+key+", status :",(this.columndetails)[key]);
        let tableRow: tableSkeleton = new tableSkeleton();
        tableRow.columnName = key;
        tableRow.status = (this.columndetails)[key];
        tableRow.isEdit = false;
        this.tableData.push(tableRow);
      });
      // initializaing the datasource with data
      this.dataSource = new MatTableDataSource(this.tableData);
      console.log(" userwise Data in dataSource is--- ", this.dataSource);
      //paginating and sorting the table
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });





    });
  }


  editStatusValue(data: tableSkeleton) {
    //making isEdit true to show input text field for editing purpose
    data.isEdit = true;
     //variable to store original label data temporarily
     let tempStatus: tableSkeleton = new tableSkeleton();

     //stores the original value of the label
     tempStatus.status = data.status;

       //finding label data already exists in arr
    let columnObj = this.tempLabelArr.find(x => x.status == data.status)
    // if not present then push the templabel in arr
    if (columnObj == undefined) {
      //pushing the tempLabel in array
      console.log("true");
      this.tempLabelArr.push(tempStatus);
    }else{
      //if already present then remove it and push the new templabel
      console.log("false");
      this.tempLabelArr.splice(this.tempLabelArr.findIndex(x => x.status == columnObj.status), 1);
      this.tempLabelArr.push(tempStatus);
    }
  }
}

//Label class to hold label details

class tableSkeleton {
  columnName: string;
  status: string;
  isEdit: boolean= false;
  moduleName!:string;
}