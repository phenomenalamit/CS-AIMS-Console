import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
exporting(Highcharts);

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component({
  selector: 'app-dashchart',
  templateUrl: './dashchart.component.html',
  styleUrls: ['./dashchart.component.css']
})
export class DashchartComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'column',
     // width:100%
     // height: 300
      events: {
        load: function(event) {
          event.target.reflow();
        },
         beforePrint: function (event) {
          event.target.oldhasUserSize = event.target.hasUserSize;
          event.target.resetParams = [event.target.chartWidth, event.target.chartHeight, false];
          event.target.setSize(760, 400,false);
                },
                afterPrint: function (event) {
                  event.target.setSize.apply(event.target, event.target.resetParams);
                  event.target.hasUserSize = event.target.oldhasUserSize;
                }
        
      }
    },
    title: {
      text: 'Development Donorwise Amount',
      style: {
        visibility: 'visible'
      
      }
    },
    colors: ['#4099ff', '#42dcbd', '#ffbc5d','#ff6b83'],
    credits: {
      enabled: false
    },
    // tooltip: {
    //   formatter: function() {return 'x: ' + series[].data}
    // },
    xAxis: {
     
      categories:
        // formatter: function() {
        //   // return Highcharts.dateFormat('%e %b %y', 10);
        //   return Highcharts.dateFormat('%e %b %y', 10);
        // }
        ['ADB','Australian Aid','China','DFID','World Bank','World Bank','WHO','India','UNICEF','EU','Russia','Portugal']
      
    },
    series: [
      {
        name: 'Commitment',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    
      }, {
        name: 'Actual Disbursement',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    
      }, {
        name: 'Expenditure',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    
      }
    ],

    
    
    exporting: {
      filename: 'Development Donorwise Amount'+'_'+new Date().toISOString(),
      
  }
  

  }

  public optionsPt: any = {
    chart: {
      type: 'column',
     // width:100%
     // height: 300
      events: {
        load: function(event) {
          event.target.reflow();
        },
         beforePrint: function (event) {
          event.target.oldhasUserSize = event.target.hasUserSize;
          event.target.resetParams = [event.target.chartWidth, event.target.chartHeight, false];
          event.target.setSize(760, 400,false);
                },
                afterPrint: function (event) {
                  event.target.setSize.apply(event.target, event.target.resetParams);
                  event.target.hasUserSize = event.target.oldhasUserSize;
                }
        
      }
    },
    title: {
      text: 'Development Donorwise Amount',
      style: {
        visibility: 'visible'
      
      }
    },
    colors: ['#4099ff', '#42dcbd', '#ffbc5d','#ff6b83'],
    credits: {
      enabled: false
    },
    // tooltip: {
    //   formatter: function() {return 'x: ' + series[].data}
    // },
    xAxis: {
     
      categories:
        // formatter: function() {
        //   // return Highcharts.dateFormat('%e %b %y', 10);
        //   return Highcharts.dateFormat('%e %b %y', 10);
        // }
        ['ADB','Australian Aid','China','DFID','World Bank','World Bank','WHO','India','UNICEF','EU','Russia','Portugal']
      
    },
    series: [
      {
        name: 'Compromisso',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    
      }, {
        name: 'Desembolso Real',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    
      }, {
        name: 'Despesa',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    
      }
    ],

    
    
    exporting: {
      filename: 'Development Donorwise Amount'+'_'+new Date().toISOString(),
      
  }
  

  }


  

  constructor() { }
browserLang:any;
  ngOnInit(): void {
    this.browserLang=localStorage.getItem("broswerLang");
    if(this.browserLang==="en")
    Highcharts.chart('Barchart', this.options);
    else
    Highcharts.chart('Barchart', this.optionsPt);
    // Highcharts.chart.reflow();

    $(document).ready(function(){
      $("#graphone").click(function(){
        $("#graph1").toggle();
        return false;
       // slideToggle("fast");
      });
    });
    
   }



   

   

}
