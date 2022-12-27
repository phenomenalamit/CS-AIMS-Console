import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationDialogComponent implements OnInit {

  constructor(public translate: TranslateService, private dialogRef: MatDialogRef<AlertNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { }
  browserLang:any;
  message:string;
  date:any;
  link:any;
  link_flag = false;
  ngOnInit(): void {
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    console.log("this.browserLang",this.browserLang);
    this.message=this.data.notificationMsg;
    console.log("this.message:"+this.message);
    this.date=this.data.date;
    this.link=localStorage.getItem("notificationLink");
    console.log("this.message:"+this.link);
    
  }

}
