import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ExcelService } from 'src/app/Service/excel.service';
import { NotificationService } from 'src/app/Service-Application/notification.service';
import { Notification } from 'src/app/Service-Class/notification';
import { Router } from '@angular/router';
@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationComponent implements OnInit {

  constructor(private excelService: ExcelService,@Inject(DOCUMENT) private _document: HTMLDocument,private notificationService:NotificationService,private router:Router) { }
  elements!: NodeListOf<Element>;

  messageAlert:any;
  notificationMsgList:Notification[];
  ngOnInit(): void {
    this.getNotificationDetails();
    this.messageAlert=[{'message':'Sourav Password is going to expire in 7 days. Please change your password.Follow the link to change your password.','link':'Click Here','date':'March 12, 2020'},
    {'message':'Project-001 is funded by organization-World Bank.','date':'March 10, 2020'},
    {'message':'World bank is added to funding organization.','date':'March 7, 2020'}];
  }

  generateExcel(){
    console.log("123456");
    let obj = new AlertNotificationComponent(this.excelService,this._document,this.notificationService,this.router);
    // obj.ExportTOExcel();
  }

  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }

  getLink(i:number){
    if(this.notificationMsgList[i].notificationMsg.indexOf("disbursement")!=-1){
      this.router.navigate(['/admin/view-disbursement']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("envelope")!=-1)){
      this.router.navigate(['/admin/view-envelope']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("financial")!=-1)){
      this.router.navigate(['/admin/view-funding']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("project")!=-1)){
      this.router.navigate(['/admin/view-project']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("payment")!=-1)){
      this.router.navigate(['/admin/view-payment']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("organization")!=-1)){
      this.router.navigate(['/admin/view-organization']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("individual")!=-1)){
      this.router.navigate(['/admin/view-individual']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("monitoring")!=-1)){
      this.router.navigate(['/admin/view-monitoring']);
    }
    else if((this.notificationMsgList[i].notificationMsg.indexOf("password")!=-1)){
      this.router.navigate(['/admin/changePassword']);
    }
  }

  getNotificationDetails(){
    this.notificationService.getNotificationDetails().subscribe(data=>{
        this.notificationMsgList=data;
        this.checkFinancialAgreementOngoing();
    });
  }

  checkFinancialAgreementOngoing(){
    this.notificationService.checkFinancialAgreementOngoing().subscribe(data =>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.checkFinancialAgreementEntersTheFinalYear();
    });
  }

  checkFinancialAgreementEntersTheFinalYear(){
    this.notificationService.checkFinancialAgreementEntersTheFinalYear().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.checkProjectOngoing();
    });
  }

  checkProjectOngoing(){
    this.notificationService.checkProjectOngoing().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.projectWithNoUpdates();
    });
  }

  projectWithNoUpdates(){
    this.notificationService.projectWithNoUpdates().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      this.financialAgreementWithNoUpdates();
    });
  }

  financialAgreementWithNoUpdates(){
    this.notificationService.financialAgreementWithNoUpdates().subscribe(data=>{
      data.forEach(ele=>{
        this.notificationMsgList.push(ele);
      });
      console.log(this.notificationMsgList);
    });
  }
}
