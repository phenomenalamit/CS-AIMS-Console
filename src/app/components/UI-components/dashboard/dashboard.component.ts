import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { TranslateService } from '@ngx-translate/core';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {

  constructor(private router :Router, public translate: TranslateService) { 

  }
  // tiles: Tile[] = [
  //   {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
  //   {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
  //   {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
  //   {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  // ];
  usergroup:any;
  browserLang:any;
  ngOnInit(): void {
    
    localStorage.setItem("EditEnvUrl","Reset-EditEnvUrl");
localStorage.setItem("EditDisbUrl","Reset-EditDisbUrl");
localStorage.setItem("EditFundUrl","Reset-EditFundUrl");
localStorage.setItem("EditIndUrl","Reset-EditIndUrl");
localStorage.setItem("EditMonitoringUrl","Reset-EditMonitoringUrl");
localStorage.setItem("EditOrgUrl","Reset-EditOrgUrl");
localStorage.setItem("EditPaymentUrl","Reset-EditPaymentUrl");
localStorage.setItem("EditProjectUrl","Reset-EditProjectUrl");
localStorage.setItem("EditUserAcctUrl","Reset-EditUserAcctUrl");
    this.browserLang=localStorage.getItem("browserLang");
    if(this.browserLang===undefined || this.browserLang===null)
    this.browserLang='en';
    this.translate.use(this.browserLang.match(/en|pt/) ? this.browserLang : 'en');
    this.usergroup=localStorage.getItem('usergroup');
      // if(this.usergroup===undefined || this.usergroup===null)
      // this.router.navigate(['/login']);
    
  }

  
  

}


