import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-financial-bar-chart',
  templateUrl: './financial-bar-chart.component.html',
  styleUrl: './financial-bar-chart.component.scss'
})
export class FinancialBarChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() selectedYear: any;
  chartOptions!: Highcharts.Options;
  @Input() data: any;
  @Input() title: string;


  ngOnInit(): void {
    this.getMonthlyDataByRangeYear();
  }

  ngOnChanges(): void {
    this.getMonthlyDataByRangeYear();
  }

  getMonthlyDataByRangeYear(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: '#D3C7AD',
      },
      title: {
        text: this.title,
        style: {
          color: '#212529', // sets the title color to red
        }
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
      xAxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        crosshair: true,
        accessibility: {
          description: 'Meses'
        },
        labels: {
          style: {
            color: '#212529', // sets the title color to red
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Original Balance based on Financial Institution'
        },
        labels: {
          style: {
            color: '#212529', // sets the title color to red
          }
        }
      },
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen', 'separator', 'downloadPNG',
              'downloadSVG', 'downloadPDF', 'separator', 'downloadXLS'
            ]
          }
        },
        showExportInProgress: true,
        enabled: true,
      },
      navigation: {
        buttonOptions: {
          align: 'right',
          verticalAlign: 'top',
          y: 0
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
          groupPadding: 0.1,
          borderWidth: 0
        }
      },
      series: this.data

    };
  }

}
