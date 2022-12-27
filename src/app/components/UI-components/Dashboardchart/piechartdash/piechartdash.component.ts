import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-piechartdash',
  templateUrl: './piechartdash.component.html',
  styleUrls: ['./piechartdash.component.css']
})

export class PiechartdashComponent implements OnInit {

  public options: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',

      events: {
        load: function(event) {
          event.target.reflow();
        },
        beforePrint: function (event) {
            event.target.oldhasUserSize = event.target.hasUserSize;
            event.target.resetParams = [event.target.chartWidth, event.target.chartHeight, false];
            event.target.setSize(2480, 330, false);
            event.target.reflow();
        },
        afterPrint: function (event) {
          event.target.setSize.apply(this, event.target.resetParams);
          event.target.hasUserSize = event.target.oldhasUserSize;
          event.target.reflow();
        }
      }
    },
    title: {
      text: 'Aid Allocation By Sector'
    },
    colors: ['#4099ff', '#42dcbd', '#ffbc5d','#ff6b83'],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Funds',
      colorByPoint: true,
      data: [{
        name: 'Economy',
        y: 61.41,
        sliced: true,
        selected: true
      }, {
        name: '	Education & Human Development',
        y: 11.84
      }, {
        name: '	Health',
        y: 10.85
      }, {
        name: 'Youth & Sports',
        y: 4.67
      }, {
        name: 'Industry & Trade',
        y: 4.18
      }, {
        name: 'Transport & Communications',
        y: 1.64
      }, {
        name: 'Culture & Tourism',
        y: 1.98
      }, {
        name: 'Land, Environment & Rural Development',
        y: 1.25
      }, {
        name: 'Other',
        y: 2.61
      }]
    }],

    exporting: {
      filename: 'Aid Allocation By Sector'+'_'+new Date().toISOString()
    }
  }


  public optionsPt: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',

      events: {
        load: function(event) {
          event.target.reflow();
        },
        beforePrint: function (event) {
            event.target.oldhasUserSize = event.target.hasUserSize;
            event.target.resetParams = [event.target.chartWidth, event.target.chartHeight, false];
            event.target.setSize(2480, 330, false);
            event.target.reflow();
        },
        afterPrint: function (event) {
          event.target.setSize.apply(this, event.target.resetParams);
          event.target.hasUserSize = event.target.oldhasUserSize;
          event.target.reflow();
        }
      }
    },
    title: {
      text: 'Aid Allocation By Sector'
    },
    colors: ['#4099ff', '#42dcbd', '#ffbc5d','#ff6b83'],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Funds',
      colorByPoint: true,
      data: [{
        name: 'Economia & Finanças',
        y: 61.41,
        sliced: true,
        selected: true
      }, {
        name: 'Educação & Desenvolvimento Humano',
        y: 11.84
      }, {
        name: 'Saúde',
        y: 10.85
      }, {
        name: 'Juventude & Desporto',
        y: 4.67
      }, {
        name: 'Indústria & Comércio',
        y: 4.18
      }, {
        name: 'Transporte & Comunicação',
        y: 1.64
      }, {
        name: 'Cultura & Turismo',
        y: 1.98
      }, {
        name: 'Terra, Ambiente & Desenvolvimento Rural',
        y: 1.25
      }, {
        name: 'Outro',
        y: 2.61
      }]
    }],

    exporting: {
      filename: 'Aid Allocation By Sector'+'_'+new Date().toISOString()
    }
  }

  constructor() { }
browserLang:any;
  ngOnInit(): void {
    this.browserLang = localStorage.getItem("browserLang");
    if(this.browserLang==='en')
    Highcharts.chart('piechartdash', this.options);
    else
    {
      Highcharts.chart('piechartdash', this.optionsPt); 
    }
    $(document).ready(function(){
      $("#graphtwo").click(function(){
        $("#graph2").toggle();
        return false;
       // slideToggle("fast");
      });
    });

  }

}
