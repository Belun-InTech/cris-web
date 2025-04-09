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
        backgroundColor: '#202d3b',
      },
      title: {
        text: this.title,
        style: {
          color: '#FFFFFF', // sets the title color to red
        }
      },
      legend: {
        // Define default style for each legend item.
        itemStyle: {
          color: '#FFFFFF',  // Text color for the legend
          fontWeight: 'bold',
          fontSize: '14px'
        },
        // Define style when hovering over a legend item.
        itemHoverStyle: {
          color: '#FFCC00'
        }
      },
      xAxis: {
        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Desembro'],
        crosshair: true,
        accessibility: {
          description: 'Meses'
        },
        labels: {
          style: {
            color: '#FFFFFF', // sets the title color to red
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
            color: '#FFFFFF', // sets the title color to red
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
