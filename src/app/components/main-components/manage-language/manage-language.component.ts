import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GlobalLink } from 'src/app/model/global-link';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { ManageLanguageService } from 'src/app/Service/ManageLanguage.service';
import Swal from 'sweetalert2';

/*
* Author : Raman Shrestha
* Purpose : Component to do update label values
* Date : 29th June, 20201
*/
@Component({
  selector: 'app-manage-language-details',
  templateUrl: './manage-language.component.html',
  styleUrls: ['./manage-language.component.css']
})

export class ManageLanguageComponent implements OnInit {

  /*
  * Start of varibale declaration
  */

  public LanguageForm!: FormGroup;
  browserLang: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  moduleList: GlobalLink[] = []; // to store list of modules
  submoduleList: PrimaryLink[] = []; // to store list of submodules
  dataSource: any; //to store table data

  //stores the list of headers of table
  displayedColumns: string[] = ['Label Name', 'English Value', 'Portuguese Value', 'Action'];
  tempLabelArr: Label[] = []; // to store the original data of label (data of label before its clicking edit button)
  labeldetails: Label[] = []; //to store label details
  primaryLinkName: string;
  sortedData: Label[];

  /*
  * End of varibale declaration
  */


  /*
   * Start of Constructor
   */
  constructor(private fb: FormBuilder, public translate: TranslateService, private languageService: ManageLanguageService) {
    this.sortedData = this.labeldetails.slice();
  }
  /*
   * End of Constructor
   */

  ngOnInit(): void {
    //for translation
    this.browserLang = localStorage.getItem("browserLang");
    if (this.browserLang === undefined || this.browserLang === null)
      this.browserLang = 'en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');

    //fetch modules (List of Global Links)
    this.getModules()
    //form for module and submodule dropdown
    this.LanguageForm = new FormGroup({
      module: new FormControl('', [Validators.required]),
      submodule: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit() {

  }

  /*
  * Start of methods block
  */

  // method to fetche list of modules (GlobalLink)
  getModules() {
    this.languageService.getModules().subscribe(data => {
      this.moduleList = data;
    })
  }

  // method to fetch list of submodules (primaryLink) by globallink id
  getSubmodule() {

    // stores globallink id in it
    let glId: number = this.LanguageForm.controls.module.value;

    //http request through service to fetch list of modules
    this.languageService.getSubmodules(glId).subscribe(data => {

      //storing the data in the variable
      this.submoduleList = data;
    })
  }

  //method to get label details
  getLabelDetails() {
    this.primaryLinkName = this.submoduleList.find(x => x.primaryLinkId == this.LanguageForm.controls.submodule.value).primaryLinkName;
    //variable stores primary link id
    let plId: number = this.LanguageForm.controls.submodule.value;

    //http request to fetch label details by primary link id
    this.languageService.getLabelDetails(plId).subscribe(data => {

      //storing the data in the varibale
      this.labeldetails = data;

      //initializaing the datasource with data
      this.dataSource = new MatTableDataSource(this.labeldetails);

      //paginating and sorting the table
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  //method to enable the user to do inline editing of the label value.
  editLabelValue(data: Label) {

    //making isEdit true to show input text field for editing purpose
    data.isEdit = true;

    //variable to store original label data temporarily
    let tempLabel: Label = new Label();

    //stores the original value of the label
    tempLabel.name = data.name;
    tempLabel.en = data.en;
    tempLabel.pt = data.pt;

    //finding label data already exists in arr
    let labelObj = this.tempLabelArr.find(x => x.name == data.name)
    // if not present then push the templabel in arr
    if (labelObj == undefined) {
      //pushing the tempLabel in array
      console.log("true");
      this.tempLabelArr.push(tempLabel);
    }else{
      //if already present then remove it and push the new templabel
      console.log("false");
      this.tempLabelArr.splice(this.tempLabelArr.findIndex(x => x.name == labelObj.name), 1);
      this.tempLabelArr.push(tempLabel);
    }
  }

  //method to update the Label value
  //parameter "data" of Label type holds the new value of the label
  updateLabelValue(data: Label) {

    //show pop up to confirm action
    Swal.fire({
      title: 'Do you want to update?',
      showDenyButton: true,
      confirmButtonText: `Update`,
      denyButtonText: `Cancel`,
    }).then(result => {

      //check if update clicked
      if (result.isConfirmed) {

        //store the primary link Id and trim spaces from en and pt values
        data.plId = this.LanguageForm.controls.submodule.value;
        data.en = data.en.trim();
        data.pt = data.pt.trim();

        //http request to update the label
        this.languageService.updateLabel(data).subscribe(res => {

          //check the response
          if (res == "success") {

            //if success then set isEdit false to hide input text field and show updated label values
            data.isEdit = false;

            //show successful message with popup
            Swal.fire('Updated successfully!', '', 'success');
          } else {

            //if operation failed then show error message on popup
            Swal.fire('Something went wrong', '', 'info');
          }
        },
          error => console.log(error));
      }

      // if cancel button clicked on popup then show cancelled message on popup
      else if (result.isDenied) {
        Swal.fire('Cancelled', '', 'info')
      }
    })
  }

  //method to close the edit fields
  close(data: Label) {
    //this variable holds the original values of the en and pt label before the fields were dirty
    let labelObj = this.tempLabelArr.find(x => x.name == data.name)

    //making the edit status false to hide the input text fields
    data.isEdit = false;

    //setting the value of data to what it was originally.
    data.en = labelObj.en;
    data.pt = labelObj.pt;

    // removing the label object from the array after the job of showing original value on clicking cancel is done.
    this.tempLabelArr.splice(this.tempLabelArr.findIndex(x => x.name == data.name), 1);
  }

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
    const data = this.labeldetails.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }


    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'en': return compare(a.en, b.en, isAsc);
        case 'pt': return compare(a.pt, b.pt, isAsc);
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  /*
   * End of component block
   */
}

//Label class to hold label details
export class Label {
  plId: number; // to store primary link id
  name: string; // to store label key name
  en: string; // to store english value
  pt: string; // to store portuguese value
  isEdit: boolean = false; // to store state of fields (shows input text field if true, hides it if false)
}

