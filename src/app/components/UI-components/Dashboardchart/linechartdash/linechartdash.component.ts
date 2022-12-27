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
  selector: 'app-linechartdash',
  templateUrl: './linechartdash.component.html',
  styleUrls: ['./linechartdash.component.css']
})
export class LinechartdashComponent implements OnInit {
  public options: any = {
  chart: {
    type: 'spline',
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
  },
  title: {
    text: 'Projects Funded by Province'
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
      text: 'No. Of Projects Funded'
    },
  //  labels: {
     // formatter: function () {
      //  return this.value + '°';
    //  }
  //  }
  },
  tooltip: {
    crosshairs: true,
    shared: true
  },
  colors: ['#4099ff', '#42dcbd', '#ffbc5d','#8A29CD', '#4caf50', '#3f51b5','#DFFF00','#EB1D9A','#CD9429'],
  plotOptions: {
    spline: {
      marker: {
        radius: 4,
        lineColor: '#666666',
        lineWidth: 1
      }
    }
  },
  series: [
    {
    name: 'Maputo',
    marker: {
      symbol: 'square'
    },
    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
      y: 26.5,
      marker: {

      }
    }, 23.3, 18.3, 13.9, 9.6]

  },
   {
    name: 'Beira',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
  },
  {
    name: 'Pemba',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 15.2, 18.7, 12.5, 20.9, 18.2, 22.0, 13.6, 5.2, 8.3, 14.6, 12.8]
  },

  {
    name: 'Gaza',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 12.2, 14.7, 22.5, 28.9, 15.2, 33.0, 13.6, 5.2, 8.3, 14.6, 4.8]
  },
  {
    name: 'Cabo Delgado',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 12.2, 18.7, 15.5, 20.9, 14.2, 22.0, 13.6, 5.2, 8.3, 14.6, 12.8]
  },
  {
    name: 'Manica',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 12.9, 17.7, 15.5, 28.9, 4.2, 14.0, 13.6, 5.2, 8.3, 14.6, 22.8]
  },
  {
    name: 'Inhambane',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 14.9, 11.7, 16.5, 22.9, 4.5, 14.0, 21.6, 25.2, 9.3, 17.6, 6.8]
  },
  {
    name: 'Matola',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 18.5, 12.7, 21.5, 27.9, 14.2, 4.0, 13.6, 15.2, 28.3, 14.7, 22.2]
  },
  {
    name: 'Dondo',
    marker: {
      symbol: 'diamond'
    },
    data: [{
      y: 3.9,
      marker: {

      }
    }, 2.9, 19.7, 25.5, 15.9, 14.2, 14.0, 19.6, 21.2, 18.3, 24.6, 2.6]
  },

],
exporting: {
  filename: 'Projects Funded by Province'+'_'+new Date().toISOString()
}


  }
  public optionsPt: any = {
    chart: {
      type: 'spline',
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
    },
    title: {
      text: 'Projects Funded by Province'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    yAxis: {
      title: {
        text: 'Num. de Projectos Financiados'
      },
    //  labels: {
       // formatter: function () {
        //  return this.value + '°';
      //  }
    //  }
    },
    tooltip: {
      crosshairs: true,
      shared: true
    },
    colors: ['#4099ff', '#42dcbd', '#ffbc5d','#8A29CD', '#4caf50', '#3f51b5','#DFFF00','#EB1D9A','#CD9429'],
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: '#666666',
          lineWidth: 1
        }
      }
    },
    series: [
      {
      name: 'Maputo',
      marker: {
        symbol: 'square'
      },
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
        y: 26.5,
        marker: {
  
        }
      }, 23.3, 18.3, 13.9, 9.6]
  
    },
     {
      name: 'Beira',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    },
    {
      name: 'Pemba',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 15.2, 18.7, 12.5, 20.9, 18.2, 22.0, 13.6, 5.2, 8.3, 14.6, 12.8]
    },
  
    {
      name: 'Gaza',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 12.2, 14.7, 22.5, 28.9, 15.2, 33.0, 13.6, 5.2, 8.3, 14.6, 4.8]
    },
    {
      name: 'Cabo Delgado',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 12.2, 18.7, 15.5, 20.9, 14.2, 22.0, 13.6, 5.2, 8.3, 14.6, 12.8]
    },
    {
      name: 'Manica',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 12.9, 17.7, 15.5, 28.9, 4.2, 14.0, 13.6, 5.2, 8.3, 14.6, 22.8]
    },
    {
      name: 'Inhambane',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 14.9, 11.7, 16.5, 22.9, 4.5, 14.0, 21.6, 25.2, 9.3, 17.6, 6.8]
    },
    {
      name: 'Matola',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 18.5, 12.7, 21.5, 27.9, 14.2, 4.0, 13.6, 15.2, 28.3, 14.7, 22.2]
    },
    {
      name: 'Dondo',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
  
        }
      }, 2.9, 19.7, 25.5, 15.9, 14.2, 14.0, 19.6, 21.2, 18.3, 24.6, 2.6]
    },
  
  ],
  exporting: {
    filename: 'Projects Funded by Province'+'_'+new Date().toISOString()
  }
  
  
    }
browswerLang:any;
  constructor() { }

  ngOnInit(): void {
    this.browswerLang=localStorage.getItem("browserLang");
    if(this.browswerLang==="en")
    Highcharts.chart('Linechart', this.options);
    else
    Highcharts.chart('Linechart', this.optionsPt);
    $(document).ready(function(){
      $("#graphthree").click(function(){
        $("#graph3").toggle();
        return false;
       // slideToggle("fast");
      });
    });

  }

}
