import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { pieChartOptions } from 'src/app/core/utils/global-types';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
require('highcharts/modules/annotations')(Highcharts);

declare var require: any;
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = pieChartOptions;
  @Input() title: string;
  @Input() data = [];

  ngOnInit(): void {
    this.mapData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapData();
  }

  mapData(): void {
    this.chartOptions = {
      title: {
        text: this.title,
        style: {
          color: '#212529',
        }
      },
      chart: {
        backgroundColor: '#D3C7AD',
      },
      legend: {
        // Define default style for each legend item.
        itemStyle: {
          color: '#212529',  // Text color for the legend
          fontWeight: 'bold',
          fontSize: '14px'
        },
        // Define style when hovering over a legend item.
        itemHoverStyle: {
          color: '#968350'
        }
      },
      plotOptions: {
        pie: {
          innerSize: '10%',
          borderRadius: 8,
          borderWidth: 0.5,
          showInLegend: true,
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '<span style="font-size: 1.2em"><b>{point.name}</b>' +
                '</span><br>' +
                '<span style="opacity: 0.6">{point.y} ' +
                '</span>',
            }
          ],
          showInLegend: true,
        },
      },
      series: [
        {
          type: 'pie',
          name: this.title,
          innerSize: '75%',
          data: this.data
        },
      ]
    }
  }
}
