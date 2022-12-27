import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/Service/excel.service';
import { DOCUMENT } from '@angular/common';
import { ViewTableModalFinancialAgreementComponent } from '../../view-more-components/view-table-modal-financial-agreement/view-table-modal-financial-agreement.component';
import { Location } from '@angular/common';
import { FinancingServiceService } from 'src/app/Service/financing-service.service';
import { FinancialAgreement } from 'src/app/model/financial-agreement';
import { UserAccessPermission } from '../../UI-components/loginscreen/loginscreen.component';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-publish-financial-agreement',
  templateUrl: './publish-financial-agreement.component.html',
  styleUrls: ['./publish-financial-agreement.component.css']
})
export class PublishFinancialAgreementComponent implements OnInit {
  uAccessPermArr: UserAccessPermission[] = [];
  userPermission: number[] = [];
  displayedColumns: string[] = ['select', 'edit', 'donortit', 'fundingorg', 'startDate', 'endDate',
    'amountmzn', 'amountusd'];
  displayedColumnsReadOnly: string[] = ['donorref', 'donortit', 'donor', 'fundingorg', 'resporg', 'dateofsign',
    'financingsit', 'typeofaid'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2: any;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  usergroup: any;

  constructor(private router: Router, private excelService: ExcelService, @Inject(DOCUMENT) private _document: HTMLDocument, private dialog: MatDialog, private location: Location, private financingService: FinancingServiceService) {
    this.sortedData = this.financialAgreementList.slice();
    this.filterSelectObj = [
      {
        name: 'Funding Donor Title',
        columnProp: 'donor_funding_title',
        options: []
      }, {
        name: 'Funding Organization',
        columnProp: 'fundingOrganization',
        options: []
      }

    ]
  }
  elements!: NodeListOf<Element>;
  selection = new SelectionModel<FinancialAgreement>(true, []);


  ngOnInit(): void {
    this.uAccessPermArr = JSON.parse(localStorage.getItem("uAccessPermArr"));

    this.setToAuthFlag();
    this.usergroup = localStorage.getItem('usergroup');
    this.setToUserPermission();
    this.getDraftedFinancialAgreementList();
  }
  financialAgreementList: FinancialAgreement[] = [];
  private getDraftedFinancialAgreementList() {
    this.financingService.getDraftedFinancialAgreementList().subscribe(data => {
      this.financialAgreementList = data;
      // console.log("this.financialAgreementList: ",this.financialAgreementList)

      this.dataSource2 = new MatTableDataSource(this.financialAgreementList);
      this.donorTitle = [];
      this.fundingOrganization = [];
      for (let i = 0; i < this.financialAgreementList.length; i++) {
        this.donorTitle.push(this.financialAgreementList[i].donor_funding_title);
        if (this.financialAgreementList[i].fundingOrganization != null)
          this.fundingOrganization.push(this.financialAgreementList[i].fundingOrganization)
      }
      this.donorTitle = [...new Set(this.donorTitle)];
      this.fundingOrganization = [...new Set(this.fundingOrganization)];
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.financialAgreementList, o.columnProp);
      });
      this.dataSource2.filterPredicate = this.createFilter();
      //paginating and sorting the table
      setTimeout(() => {
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      });
    });
  }
  sortedData: FinancialAgreement[] = [];
  sortData(sort: Sort) {
    const data = this.financialAgreementList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      console.log(this.sortedData)
      return;
    }


    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {

        case 'title': return compare(a.donor_funding_title, b.donor_funding_title, isAsc);
        case 'fundingOrg': return compare(a.fundingOrganization, b.fundingOrganization, isAsc);
        // case 'startDate': return compare(a.start_date.getTime(), b.start_date.getTime(), isAsc);
        // case 'endDate': return compare(a.end_date.getTime(), b.end_date.getTime(), isAsc);
        case 'amtMzn': return compare(a.amt_mzn, b.amt_mzn, isAsc);
        case 'amtUsd': return compare(a.amt_usd, b.amt_usd, isAsc);

        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    this.dataSource2 = new MatTableDataSource(this.sortedData);
    //paginating and sorting the table
    setTimeout(() => {
      this.dataSource2.paginator = this.paginator;
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
  }


  //Sourav Kumar Nayak
  setToUserPermission() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Financial Agreement')
        this.userPermission = this.uAccessPermArr[i].permissionArr;
    }
  }

  moveToSelectedTab1(tabName: string) {
    this.location.back();
  }
  viewMoreFunding(fundingId: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/admin/view-more-drafted-fa', fundingId]));
  }

  //Sourav Kumar Nayak
  authorised_flag = false;
  setToAuthFlag() {
    for (let i = 0; i < this.uAccessPermArr.length; i++) {
      if (this.uAccessPermArr[i].primaryLinkName == 'View Financial Agreement') {
        this.authorised_flag = true;
      }
    }
  }

  publish() {
    Swal.fire({
      title: 'Do you want to publish ?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Publish`,
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("publish ids: ", this.ids);
        if (this.ids.length > 0) {
          this.financingService.publishById(this.ids).subscribe(data => {
            console.log("response after action: ",data);
            if(data.status==200){
              this.financialAgreementList = data.newList;
              /* Add data in MatTableDataSource */
              this.dataSource2 = new MatTableDataSource<FinancialAgreement>(this.financialAgreementList);
              /* Set Paginator */
              setTimeout(() =>
                this.dataSource2.paginator = this.paginator
              );
              /* Set sorting */
              setTimeout(() =>
                this.dataSource2.sort = this.sort
              );
              Swal.fire(data.responseMessage, '', 'success')
            }else{
              Swal.fire(data.responseMessage, '', 'info');
            }
          });
        } else {
          Swal.fire('Select atleast 1 record', '', 'info');
        }
      }
    });
  }

  discard() {
    Swal.fire({
      title: 'Do you want to discard ?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: `Discard`,
      denyButtonText: `Cancel`,
    }).then((result) => {

      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("discard ids: ", this.ids);
        if (this.ids.length > 0) {
          this.financingService.discardById(this.ids).subscribe(data => {
            console.log("response after action: ",data);
            if(data.status==200){
              this.financialAgreementList = data.newList;
              /* Add data in MatTableDataSource */
              this.dataSource2 = new MatTableDataSource<FinancialAgreement>(this.financialAgreementList);
              /* Set Paginator */
              setTimeout(() =>
                this.dataSource2.paginator = this.paginator
              );
              /* Set sorting */
              setTimeout(() =>
                this.dataSource2.sort = this.sort
              );
              Swal.fire(data.responseMessage, '', 'success')
            }else{
              Swal.fire(data.responseMessage, '', 'info');
            }
          });
        } else {
          Swal.fire('Select atleast 1 record', '', 'info');
        }
      }
    })
  }





  openDialog(faId: string) {
    localStorage.setItem("financialAgreementId", faId);

    const dialogRef = this.dialog.open(ViewTableModalFinancialAgreementComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['view-funding']);
    });

  }


  filterSelectObj = [];
  searchFilter = new FormControl('');
  openOptionSearch(e) {
    this.searchFilter.patchValue('');

  }
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {

      if (!uniqChk.includes(obj[key])) {

        if (obj[key] != null) {
          uniqChk.push(obj[key]);
        }
      }
      return obj;
    });
    return uniqChk;
  }
  chkValue(filter) {

    var searchFilterVal = this.searchFilter.value;
    let columnName = filter.columnProp;
    let donortit = [];
    let fundingorg = [];

    // return nothing if empty value in input
    if (searchFilterVal !== "") {
      for (var i = 0; i < this.financialAgreementList.length; i++) {
        if (columnName == 'donor_funding_title') {
          if (this.donorTitle.length == 0) {
            if (((this.financialAgreementList[i].donor_funding_title).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              donortit.push(this.financialAgreementList[i].donor_funding_title);
            }
          } else if (this.donorTitle.length != 0) {
            if (this.donorTitle[i] != undefined) {
              if (((this.donorTitle[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                donortit.push(this.donorTitle[i]);
              }
            }
          }

        } else if (columnName == 'fundingOrganization') {
          if (this.fundingOrganization.length == 0) {
            if (((this.financialAgreementList[i].fundingOrganization).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
              if (this.financialAgreementList[i].fundingOrganization != null)
                fundingorg.push(this.financialAgreementList[i].fundingOrganization);
            }
          } else if (this.fundingOrganization.length != 0) {
            if (this.fundingOrganization[i] != undefined) {
              if (((this.fundingOrganization[i]).toString().trim().toLowerCase()).indexOf((searchFilterVal.toString()).trim().toLowerCase()) > -1) {
                if (this.financialAgreementList[i].fundingOrganization != null)
                  fundingorg.push(this.fundingOrganization[i]);
              }
            }
          }
        }
      }
    } if (columnName == 'donor_funding_title') {
      donortit = [...new Set(donortit)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'donor_funding_title') {
          o.options = donortit, 'donor_funding_title';
        }
      });
    } else if (columnName == 'fundingOrganization') {
      fundingorg = [...new Set(fundingorg)];
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrganization') {
          o.options = fundingorg, 'fundingOrganization';
        }
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'donor_funding_title' && this.donorTitle.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'donor_funding_title')
          o.options = this.donorTitle, 'donor_funding_title';
      });
    }
    if (searchFilterVal.length == 0 && columnName == 'fundingOrganization' && this.fundingOrganization.length != 0) {
      this.filterSelectObj.filter((o) => {
        if (o.columnProp == 'fundingOrganization')
          o.options = this.fundingOrganization, 'fundingOrganization';
      });
    }
  }
  filterValues = {};
  filterChange(filter, event) {
    this.filterValues[filter.columnProp] = event.value;
    this.dataSource2.filter = JSON.stringify(this.filterValues);
    console.log("filter values ", this.dataSource2.filteredData)

  }
  resetFilters() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);

  }
  donorTitle = [];
  fundingOrganization = [];

  createFilter() {

    let filterFunction = (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(this.financialAgreementList, o.columnProp);
          });
        }
      }

      let nameSearch = () => {
        let found = false;
        let checkIn = 0;
        let total = 0;
        if (isFilterSet) {
          for (const col in searchTerms) {
            total++;
            ((searchTerms[col]).toString()).trim().toLowerCase().split().forEach(word => {
              // this.purdaccrs=[];
              let spl = word.split(",");
              for (let i = 0; i < spl.length; i++) {
                // /* adding Running filter start */

                // /* adding Running filter end */

                if (data[col].toString().toLowerCase().indexOf(spl[i].toLowerCase()) != -1 && isFilterSet) {
                  found = true;
                  checkIn++;
                }
              }
            });
          }
          return (checkIn == total);
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  selectType = [
    { text: "Single", value: SelectType.single },
    { text: "Multiple", value: SelectType.multiple }
  ];

  displayType = SelectType.multiple;
  ids: number[] = [];

  selectHandler(row: FinancialAgreement) {
    if (this.displayType == SelectType.single) {
      if (!this.selection.isSelected(row)) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.ids.push(row.funding_id);
    } else {
      let index = this.ids.indexOf(row.funding_id, 0);
      this.ids.splice(index, 1);
    }
  }

}
export enum SelectType {
  single,
  multiple
}