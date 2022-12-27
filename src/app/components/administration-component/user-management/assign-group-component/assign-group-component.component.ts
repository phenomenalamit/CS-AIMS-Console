import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { E } from '@angular/cdk/keycodes';
import { UserTypeServiceService } from 'src/app/Service/user-type-service.service';
import { GlobalLinkServiceService } from 'src/app/Service-Application/global-link-service.service';
import { GlobalLink } from 'src/app/model/global-link';
import { PrimaryLinkService } from 'src/app/Service-Application/primary-link.service';
import { PrimaryLink } from 'src/app/Service-Class/primary-link';
import { PermissionService } from 'src/app/Service/permission.service';
import { Permission } from 'src/app/Service-Class/permission';
import { UserMappingServiceService } from 'src/app/Service/user-mapping-service.service';
import { UserMappingClass } from 'src/app/Service-Class/user-mapping-class';
import { UserTypeClass } from 'src/app/Service-Class/user-type-class';
import { PLink } from 'src/app/components/add-components/add-user-type-component/add-user-type-component.component';
import { MatSelect } from '@angular/material/select';
import { AssignGroup } from 'src/app/Service-Class/assign-group';
import { UserAccessPermission } from 'src/app/components/UI-components/loginscreen/loginscreen.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: ' Create Envelope'},
  {position: 2, name: 'View Envelope'}
];
const ELEMENT_DATA2: PeriodicElement[] = [
  {position: 1, name: ' Create Project'},
  {position: 2, name: 'View Project'}
];
const ELEMENT_DATA3: PeriodicElement[] = [
  {position: 1, name: ' Create Funding'},
  {position: 2, name: 'View Funding'}
];
const ELEMENT_DATA4: PeriodicElement[] = [
  {position: 1, name: ' Create Disbursement'},
  {position: 2, name: 'View Disbursement'}
];
const ELEMENT_DATA5: PeriodicElement[] = [
  {position: 1, name: ' Create Payment'},
  {position: 2, name: 'View Payment'}
];
const ELEMENT_DATA6: PeriodicElement[] = [
  {position: 1, name: ' Create Organization'},
  {position: 2, name: 'View Organization'}
];
const ELEMENT_DATA7: PeriodicElement[] = [
  {position: 1, name: ' Create Individual'},
  {position: 2, name: 'View Individual'}
];
const ELEMENT_DATA8: PeriodicElement[] = [
  {position: 1, name: ' Create User Account'},
  {position: 2, name: 'View User Account'}
];
const ELEMENT_DATA9: PeriodicElement[] = [
  {position: 1, name: ' Create Monitoring'},

];

@Component({
  selector: 'app-assign-group-component',
  templateUrl: './assign-group-component.component.html',
  styleUrls: ['./assign-group-component.component.css']
})
export class AssignGroupComponentComponent implements OnInit {

  public assignGroupForm!: FormGroup;
  permissions="false";
  userPermissionFlag=false;
  userMappingList:UserMappingClass[];
  searchUsername= new FormControl();
  userMappingListFilteredOption: Observable<any[]>;
  globalLinkList: GlobalLink[];
  primaryLinkList: PrimaryLink[];
  permissionDetailsList: Permission[];
  userTypeData: any;
  userTypeObject: UserTypeClass;
  userTypeBean:UserTypeClass;
  userTypeId:number;
  assignGroupArr: AssignGroup[]=[];
  userAccessId!:number;
  uAccessPermArr:UserAccessPermission[]=[];
  authorised_flag=false;
  userType: string;
  headers=["Module","Access Permission"];


  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA2);
  dataSource3 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA3);
  dataSource4 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA4);
  dataSource5 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA5);
  dataSource6 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA6);
  dataSource7 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA7);
  dataSource8 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA8);
  dataSource9 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA9);

  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.modules_object.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.modules_object.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  constructor(public translate: TranslateService,private permissionService:PermissionService, private primaryLinkService: PrimaryLinkService,private globalLinlService: GlobalLinkServiceService,
    public userTypeService: UserTypeServiceService, private userMappingServiceService: UserMappingServiceService,private fb: FormBuilder,private router:Router) { }
  browserLang:any;
  ngOnInit(): void {
    this.uAccessPermArr=JSON.parse(localStorage.getItem("uAccessPermArr"));
    this.setToAuthFlag();
  this.getGlobalLinkDetails();
  this.getPermissionDetails();
  this.getUserMappingDetails();

     //for form control
     this.assignGroupForm = new FormGroup({

      username:new FormControl('',[Validators.required]),
      defaultPermission: new FormControl({value:'',disabled: true}, [Validators.required]),
      tableData: this.fb.array([
        this.fb.group({
          permissionArr:new FormControl(''),
        })
      ])
    });
    (this.assignGroupForm.get('tableData') as FormArray).removeAt(0);
    this.getPrimaryLinkDetails();
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
  }

  //Sourav Kumar Nayak
  setToAuthFlag(){
    console.log("this.uAccessPermArr",this.uAccessPermArr);
    for(let i=0;i<this.uAccessPermArr.length;i++){
      if(this.uAccessPermArr[i].primaryLinkName=='User Access Management'){
        this.authorised_flag=true;
      }
    }
  }

  private getGlobalLinkDetails() {
    this.globalLinlService.getGlobalLinkList().subscribe(data => {
      this.globalLinkList = data;
    });
  }
  private getPrimaryLinkDetails() {
    this.primaryLinkService.getPrimaryLinkListWithStatusActive().subscribe(data => {
      this.primaryLinkList = data;
      for(let i=0;i<this.primaryLinkList.length;i++){
        const row = this.fb.group({
          permissionArr: [''],
        });
        (this.assignGroupForm.get('tableData') as FormArray).push(row);
      }
    });
  }
  private getPermissionDetails() {
    this.permissionService.getPermissionDetailsUrl().subscribe(data => {
      console.log("return data" + data.length);
      this.permissionDetailsList = data;
    });
  }

  private getUserMappingDetails(){ 
    this.userMappingServiceService.getUserMappingDetails().subscribe(data=> {
      this.userMappingList=data;
      this.userMappingListFilteredOption = this.searchUsername.valueChanges.pipe(
        startWith(''),
            map(userNames =>
              userNames ? this.filterUserType(userNames) : this.userMappingList.slice())
      );
    });
  }

  private filterUserType(name: string) {
    return this.userMappingList.filter(userType =>
      userType.userName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  permissionsList: any = [
    {
      'userType': 'DNGDP Admin',
      "Envelope": [
         {'name':'Create Envelope','permission':'CRUD'},
         {'name':'View Envelope','permission':'R'}
      ],
      "Project": [
        {'name':'Create Project','permission':'CRUD'},
         {'name':'View Project','permission':'R'}
      ],
      "Funding": [
        {'name':'Create Funding','permission':'CRUD'},
         {'name':'View Funding','permission':'R'}
      ],
      "Disbursement": [
        {'name':'Create Disbursement','permission':'CRUD'},
         {'name':'View Disbursement','permission':'R'}
      ],
      "Payment": [
        {'name':'Create Payment','permission':'CRUD'},
        {'name':'View Payment','permission':'R'}
      ],
      "Organization": [
        {'name':'Create Organization','permission':'CRUD'},
        {'name':'View Organization','permission':'R'}
      ],
      "Individual": [
        {'name':'Create Individual','permission':'CRUD'},
        {'name':'View Individual','permission':'R'}
      ],
      "UserAccount": [
        {'name':'Create User Account','permission':'CRUD'},
        {'name':'View User Account','permission':'R'}
      ],
      "Monitoring": [
        {'name':'Create Monitoring','permission':'CRUD'},
        {'name':'View Monitoring','permission':'R'}
      ]
    },
    {
      'userType': 'DNGDP Team',
      "enevlope": [
        {'name':'Create Envelope','permission':'CRUD'},
        {'name':'View Envelope','permission':'R'}
     ],
     "Project": [
      {'name':'Create Project','permission':'CRUD'},
       {'name':'View Project','permission':'R'}
    ],
    "Funding": [
      {'name':'Create Funding','permission':'CRUD'},
       {'name':'View Funding','permission':'R'}
    ],
    "Disbursement": [
      {'name':'Create Disbursement','permission':'CRUD'},
       {'name':'View Disbursement','permission':'R'}
    ],
    "Payment": [
      {'name':'Create Payment','permission':'CRUD'},
      {'name':'View Payment','permission':'R'}
    ],
    "Organization": [
      {'name':'Create Organization','permission':'CRUD'},
      {'name':'View Organization','permission':'R'}
    ],
    "Individual": [
      {'name':'Create Individual','permission':'CRUD'},
      {'name':'View Individual','permission':'R'}
    ],
    "UserAccount": [
      {'name':'Create User Account','permission':'CRUD'},
      {'name':'View User Account','permission':'R'}
    ],
    "Monitoring": [
      {'name':'Create Monitoring','permission':'CRUD'},
      {'name':'View Monitoring','permission':'R'}
    ]
    },
    {
      'userType': 'DNPO',
      "enevlope": [
        {'name':'Create Envelope','permission':'R'},
        {'name':'View Envelope','permission':'R'}
     ],
     "Project": [
      {'name':'Create Project','permission':'R'},
       {'name':'View Project','permission':'R'}
    ],
    "Funding": [
      {'name':'Create Funding','permission':'R'},
       {'name':'View Funding','permission':'R'}
    ],
    "Disbursement": [
      {'name':'Create Disbursment','permission':'R'},
       {'name':'View Disbursment','permission':'R'}
    ],
    "Payment": [
      {'name':'Create Payment','permission':'R'},
      {'name':'View Payment','permission':'R'}
    ],
    "Organization": [
      {'name':'Create Organization','permission':'R'},
      {'name':'View Organization','permission':'R'}
    ],
    "Individual": [
      {'name':'Create Individual','permission':'R'},
      {'name':'View Individual','permission':'R'}
    ],
    "UserAccount": [
      {'name':'Create User Account','permission':'R'},
      {'name':'View User Account','permission':'R'}
    ],
    "Monitoring": [
      {'name':'Create Monitoring','permission':'CRUD'},
      {'name':'View Monitoring','permission':'R'}
    ]
    },
    // {
    //   'userType': 'Cedcif',
    //   "enevlope": [
    //     {'name':'Create Envelope','permission':'CRUD'},
    //     {'name':'View Envelope','permission':'R'}
    //  ],
    //  "Project": [
    //   {'name':'Create Project','permission':'CRUD'},
    //    {'name':'View Project','permission':'R'}
    // ],
    // "Funding": [
    //   {'name':'Create Funding','permission':'CRUD'},
    //    {'name':'View Funding','permission':'R'}
    // ],
    // "Disbursement": [
    //   {'name':'Create Disbursement','permission':'CRUD'},
    //    {'name':'View Disbursement','permission':'R'}
    // ],
    // "Payment": [
    //   {'name':'Create Payment','permission':'CRUD'},
    //   {'name':'View Payment','permission':'R'}
    // ],
    // "Organization": [
    //   {'name':'Create Organization','permission':'CRUD'},
    //   {'name':'View Organization','permission':'R'}
    // ],
    // "Individual": [
    //   {'name':'Create Individual','permission':'CRUD'},
    //   {'name':'View Individual','permission':'R'}
    // ],
    // "UserAccount": [
    //   {'name':'Create User Account','permission':'CRUD'},
    //   {'name':'View User Account','permission':'R'}
    // ],
    // "Monitoring": [
    //   {'name':'Create Monitoring','permission':'CRUD'},
    //   {'name':'View Monitoring','permission':'R'}
    // ]
    // }

  ];
  permissionList:any=[
    {"name": "CRUD", ID: "1", "checked": false},
    {"name": "CRU", ID: "2", "checked": false},
    {"name": "RU", ID: "3", "checked": false},
    {"name": "R", ID: "4", "checked": false}
  ]
  // permissionList:any=[];

  modules_object:any= [
		{
			"moduleId": 1,
			"moduleName": "Envelope",isSelected:false,
			"subModule":[
				{
					"subModuleId": 1,
					"subModuleName": "Create Envelope",
					"selectedRightType": 1,
          isSelected:false,
				},{
					"subModuleId": 2,
					"subModuleName": "View Envelope",
					"selectedRightType": 2,
          isSelected:false,
				}
			]
		},
		{
			"moduleId": 2,
			"moduleName": "Project",
			"subModule":[
				{
					"subModuleId": 3,
					"subModuleName": "Create Project",
					"selectedRightType": 1,
				},{
					"subModuleId": 4,
					"subModuleName": "View Project",
					"selectedRightType": 2,
				}
			]
		},
		{
			"moduleId": 3,
			"moduleName": "Funding",
			"subModule":[
				{
					"subModuleId": 5,
					"subModuleName": "Create Funding",
					"selectedRightType": 1,
				},{
					"subModuleId": 6,
					"subModuleName": "View Funding",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 4,
			"moduleName": "Disbursement",
			"subModule":[
				{
					"subModuleId": 7,
					"subModuleName": "Create Disbursement",
					"selectedRightType": 1,
				},{
					"subModuleId": 8,
					"subModuleName": "View Disbursement",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 5,
			"moduleName": "Payment",
			"subModule":[
				{
					"subModuleId": 9,
					"subModuleName": "Create Payment",
					"selectedRightType": 1,
				},{
					"subModuleId": 10,
					"subModuleName": "View Payment",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 6,
			"moduleName": "Organization",
			"subModule":[
				{
					"subModuleId": 11,
					"subModuleName": "Create Organization",
					"selectedRightType": 1,
				},{
					"subModuleId": 12,
					"subModuleName": "View Organization",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 7,
			"moduleName": "Individual",
			"subModule":[
				{
					"subModuleId": 13,
					"subModuleName": "Create Individual",
					"selectedRightType": 1,
				},{
					"subModuleId": 14,
					"subModuleName": "View Individual",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 8,
			"moduleName": "UserAccount",
			"subModule":[
				{
					"subModuleId": 15,
					"subModuleName": "Create User Account",
					"selectedRightType": 1,
				},{
					"subModuleId": 16,
					"subModuleName": "View User Account",
					"selectedRightType": 2,
				}
			]
		},
    {
			"moduleId": 9,
			"moduleName": "Monitoring",
			"subModule":[
				{
					"subModuleId": 17,
					"subModuleName": "Create Monitoring",
					"selectedRightType": 1,
				},{
					"subModuleId": 18,
					"subModuleName": "View Monitoring",
					"selectedRightType": 2,
				}
			]
		}
]


selectedIds = [];
change(data, children, event) {
  console.log("event.target.checked:"+event.target.checked);
  console.log("data:"+data);

  if (event.target.checked === true) {
    this.selectedIds.push({ id: data, checked: event.target.checked });
    for (let child in children) {
      console.log("children:"+child);
      this.selectedIds[this.selectedIds.length-1][child]=event.target.checked;
    }
  }
  if (event.target.checked === false) {
    this.selectedIds = this.selectedIds.filter((item) => item.id !== data);
  }

}
changeChild(parentKey,childKey,event)
{
  let item:any = this.selectedIds.find(x => x.id == parentKey)
  if (event.target.checked)
    item[childKey]=event.target.checked;
  else
    delete item[childKey];

}

clearForm(form: FormGroup) {
  form.reset();
}

isChecked(parentKey,childKey) {
  let item:any = this.selectedIds.find(x => x.id == parentKey)
  return item ? item[childKey] : false
}

status = false;

categoryChange(event, cat, sub) {
  console.log("event:"+event.target.checked);
  cat.selected = event.target.checked;
  console.log(" cat.selected:"+ cat.selected);
  var items = cat.subModule.filter((s) => s.selected = cat.selected);
console.log("items.length>"+items.length);
  if(event.target.checked){
    sub.selected = items.length > 0;
  }else{
    this.status = true;
    sub.selected = false;
  }

  }
//Click event on parent checkbox
//(change)="parentCheck(module,$event)"
parentCheck(parentObj,event) {
  //console.log(1);
  console.log("parentObj:"+parentObj);
  //parentObj.isSelected = true;
  for (var i = 0; i < parentObj.subModule.length; i++) {
    parentObj.isSelected = event.target.checked;
    parentObj.subModule[i].isSelected = event.target.checked;//parentObj.isSelected;
    console.log("parentObj.isSelected:"+parentObj.isSelected);
    console.log("parentObj.subModule[i]:"+parentObj.subModule[i].subModuleName+"parentObj.subModule[i].isSelected:"+parentObj.subModule[i].isSelected);
  }
}

//Click event on child checkbox
//(change)="childCheck(module,module.subModule)"
childCheck(parentObj, childObj) {
  parentObj.isSelected = childObj.every(function (itemChild: any) {
    console.log("itemChild:"+itemChild.subModuleName);
    return itemChild.isSelected == true;
  })
}
  dngdp_admin_permission_details:any ;
  subArray = [];
  subArray1 = [];

  permission_details :any;
  selectionChange(cat,sub,event){

    console.log("ct:"+cat);
    console.log("event:"+event.target.checked);
    console.log("sub:"+sub);
    var module = cat.toLowerCase();

    if(!event.target.checked){

        this.subArray.forEach(element2 =>{
          console.log("subArray element:"+element2.name);
          if(element2.name == sub)
          {
              element2.permission = "NA";
          }

          //this.subArray.push(element2);
        });
    }
  }

  //Sourav Kumar Nayak
  onSetUserName(e){
    this.userPermissionFlag=true;
    this.assignGroupForm.controls.defaultPermission.patchValue(e.value.userTypeId);
    this.userTypeId=e.value.userTypeId;
    this.userType=e.value.userType;
    this.userAccessId=e.value.userAccessId;
    this.patchPermissionValue(e.value.userTypeId,e.value.userAccessId);
  }

  //for matching userAssignGroup with userTypePermission and patch to multi dropdown by Sourav Kumar Nayak
  patchPermissionValue(id: number,uid:number) {
    this.permissions="true";
    let pLinkArr:PLink[]=[];
    (this.assignGroupForm.get('tableData') as FormArray).reset();
    this.userTypeService.getUserTypeForUserWiseAssignDetails(uid).subscribe(data => {
      this.userTypeData = data;
      if (data === null) {
        this.userTypeService.getUserTypeId(id)
      .subscribe(
        data => {
          this.userTypeData = data;
          this.userTypeObject = this.userTypeData;
          //console.log(this.userTypeObject);
          for(let i=0;i<this.userTypeObject.userTypeAssignGroup.length;i++){
            let plink=new PLink();
            for(let j=0;j<this.userTypeObject.userAssignGroupPermissionModel.length;j++){
              if(this.userTypeObject.userTypeAssignGroup[i].primaryLinkId==this.userTypeObject.userAssignGroupPermissionModel[j].primarylink_id){
                plink.pLinkId=this.userTypeObject.userTypeAssignGroup[i].primaryLinkId;
                plink.pLinkName=this.userTypeObject.userTypeAssignGroup[i].primaryLinkName;
                plink.gLinkId=this.userTypeObject.userTypeAssignGroup[i].globalLinkId;
                plink.permissionIdArr.push(this.userTypeObject.userAssignGroupPermissionModel[j].permissionId+'');
              }
            }
            pLinkArr.push(plink);
          }
          for(let i=0;i<pLinkArr.length;i++){
            let plId=pLinkArr[i].pLinkId;
            for(let j=0;j<this.primaryLinkList.length;j++){
                if(plId==this.primaryLinkList[j].primaryLinkId){
                  this.setDataEdit(pLinkArr[i].pLinkId,pLinkArr[i].pLinkName,pLinkArr[i].gLinkId,pLinkArr[i].permissionIdArr);
                  ((this.assignGroupForm.get('tableData') as FormArray).at(j) as FormGroup).get('permissionArr').patchValue(pLinkArr[i].permissionIdArr);
                }
            }
          }
        },
        error => console.log(error));
      }
      else {
        this.userTypeObject = this.userTypeData;
          //console.log(this.userTypeObject);
          for(let i=0;i<this.userTypeObject.userTypeAssignGroup.length;i++){
            let plink=new PLink();
            for(let j=0;j<this.userTypeObject.userAssignGroupPermissionModel.length;j++){
              if(this.userTypeObject.userTypeAssignGroup[i].primaryLinkId==this.userTypeObject.userAssignGroupPermissionModel[j].primarylink_id){
                plink.pLinkId=this.userTypeObject.userTypeAssignGroup[i].primaryLinkId;
                plink.pLinkName=this.userTypeObject.userTypeAssignGroup[i].primaryLinkName;
                plink.gLinkId=this.userTypeObject.userTypeAssignGroup[i].globalLinkId;
                plink.permissionIdArr.push(this.userTypeObject.userAssignGroupPermissionModel[j].permissionId+'');
              }
            }
            pLinkArr.push(plink);
          }
          for(let i=0;i<pLinkArr.length;i++){
            let plId=pLinkArr[i].pLinkId;
            for(let j=0;j<this.primaryLinkList.length;j++){
                if(plId==this.primaryLinkList[j].primaryLinkId){
                  this.setDataEdit(pLinkArr[i].pLinkId,pLinkArr[i].pLinkName,pLinkArr[i].gLinkId,pLinkArr[i].permissionIdArr);
                  ((this.assignGroupForm.get('tableData') as FormArray).at(j) as FormGroup).get('permissionArr').patchValue(pLinkArr[i].permissionIdArr);
                }
            }
          }
      }
    });
  }

  //Select permission to primary link for selected role
  selectUser(){
   // this.subArray = [];
   this.permissions="true";
    let FormControlValue = this.assignGroupForm.controls['defaultPermission'].value;
    var i= 0;
    var primaryLink_name;
    var permission;
    if(FormControlValue==3){
      this.subArray = [];
      this.subArray1 = [];
      this.permissionsList.forEach(element => {
        this.userType =  this.assignGroupForm.controls['defaultPermission'].value;
        if(element.userType=="DNGDP Admin")
        {
          this.dngdp_admin_permission_details=element;
        }
      });
      this.dngdp_admin_permission_details.Envelope.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);
        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      console.log('user:'+JSON.parse(JSON.stringify(this.subArray1)));
      this.dngdp_admin_permission_details.Project.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Funding.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Disbursement.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;


        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Payment.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Organization.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Individual.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.UserAccount.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Monitoring.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });

     }

     //For DNGDP Team
    if(FormControlValue=="DNGDP Team"){
      this.subArray = [];
      this.permissionsList.forEach(element => {
        if(element.userType=="DNGDP Team")
        {
          this.dngdp_admin_permission_details=element;
        }
      });
      this.dngdp_admin_permission_details.enevlope.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Project.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Funding.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Disbursement.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Payment.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Organization.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Individual.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.UserAccount.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });
      this.dngdp_admin_permission_details.Monitoring.forEach(element => {
        primaryLink_name=element.name;
        permission=element.permission;

        console.log('primaryLink_name----->',primaryLink_name);
        console.log('permission----->',permission);

        this.permissionList.forEach(element1 => {
          if(element1.name==permission){
          element1.checked=true;
          this.subArray.push(element);
          }
           });
      });


    }

   //For DNPO
   if(FormControlValue=="DNPO"){
    this.subArray = [];
    this.permissionsList.forEach(element => {
      if(element.userType=="DNPO")
      {
        this.dngdp_admin_permission_details=element;
      }
    });
    this.dngdp_admin_permission_details.enevlope.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Project.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Funding.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Disbursement.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Payment.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Organization.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Individual.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.UserAccount.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Monitoring.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });


  }

  //For Cedcif

  if(FormControlValue=="Cedcif"){
    this.subArray = [];
    this.permissionsList.forEach(element => {
      if(element.userType=="Cedcif")
      {
        this.dngdp_admin_permission_details=element;
      }
    });
    this.dngdp_admin_permission_details.enevlope.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Project.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Funding.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Disbursement.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Payment.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Organization.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Individual.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.UserAccount.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });
    this.dngdp_admin_permission_details.Monitoring.forEach(element => {
      primaryLink_name=element.name;
      permission=element.permission;

      console.log('primaryLink_name----->',primaryLink_name);
      console.log('permission----->',permission);

      this.permissionList.forEach(element1 => {
        if(element1.name==permission){
        element1.checked=true;
        this.subArray.push(element);
        }
         });
    });


  }

  }

  //Sourav Kumar Nayak
  setData(i:number,select:MatSelect){
    if((select.value!=null) && (select.value!='') && (select.value!=undefined)){
      for(let j=0;j<this.assignGroupArr.length;j++){
        if(this.assignGroupArr[j].primaryLinkId==this.primaryLinkList[i].primaryLinkId){
          this.assignGroupArr.splice(j,1);
          break;
        }
      }
      let assignGroup:AssignGroup;
      assignGroup=new AssignGroup();
      assignGroup.primaryLinkId=this.primaryLinkList[i].primaryLinkId;
      assignGroup.primaryLinkName=this.primaryLinkList[i].primaryLinkName;
      assignGroup.primaryLinkPermissions=select.value;
      assignGroup.globalLinkId=this.primaryLinkList[i].globalLinkId;
      this.assignGroupArr.push(assignGroup);
    }
    else{
      for(let j=0;j<this.assignGroupArr.length;j++){
        if(this.assignGroupArr[j].primaryLinkId==this.primaryLinkList[i].primaryLinkId){
          this.assignGroupArr.splice(j,1);
        }
      }
    }
  }

  //Sourav Kumar Nayak
  setDataEdit(pLinkId:number,pLinkName:string,gLinkId:number,perArr:string[]){
    let assignGroup:AssignGroup;
    assignGroup=new AssignGroup();
    assignGroup.primaryLinkId=pLinkId;
    assignGroup.primaryLinkName=pLinkName;
    assignGroup.primaryLinkPermissions=perArr;
    assignGroup.globalLinkId=gLinkId;
    this.assignGroupArr.push(assignGroup);
  }

  //Sourav Kumar Nayak
  addToBean(){
    this.userTypeBean=new UserTypeClass();
    this.userTypeBean.userType=this.userType;
    this.userTypeBean.assignGroupArr=this.assignGroupArr;
    this.userTypeBean.userAccessId=this.userAccessId;
    this.userTypeBean.userTypeId=this.userTypeId;
  }





  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

  saveUserTypeUserAssign(userType:UserTypeClass){
    this.getValueByLang()
    this.userTypeService.saveUserTypeUserAssign(userType).subscribe(data=>{
      if(this.browserLang=='en'){
        Swal.fire('Submitted successfully', '', 'success');
      }else{
        Swal.fire('Submetido com sucesso', '', 'success');
      }
    });
  }

  clearUserForm(){
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/admin/user-account']));
  }
  getValueByLang(){
    this.browserLang = localStorage.getItem("browserLang");
  }

  openMandatoryAlert() {
    this.getValueByLang()
    if(this.browserLang=='en')
    Swal.fire('Please fill all mandatory fields.')
    else
    Swal.fire('Por favor preencha todos os campos obrigatórios.')
  }

  opensweetalert() {
    this.getValueByLang()
    this.addToBean();
    Swal.fire({
      title: (this.browserLang=='en')?'Do you want to Submit?':'Deseja Submeter?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: (this.browserLang=='en')?`Submit`:'Submeter',
      denyButtonText:  (this.browserLang=='en')?`Cancel`:'Cancelar',
    }).then((result) => {


      /* Read more about isConfirmed, isDenied below */
      if(result.isConfirmed) {
        this.saveUserTypeUserAssign(this.userTypeBean);
        this.moveToSelectedTab;
      } else if(result.isDenied) {
        if(this.browserLang=='en')
        Swal.fire('Cancelled', '', 'info');
        else{
          Swal.fire('Cancelado', '', 'info');
        }
      }
    })
  }
}

