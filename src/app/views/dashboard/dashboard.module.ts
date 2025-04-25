import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FinancialBarChartComponent } from './financial-bar-chart/financial-bar-chart.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        CalendarModule,
        DropdownModule,
        HighchartsChartModule,
        TableModule,
    ],
    declarations: [
        DashboardComponent,
        PieChartComponent,
        BarChartComponent,
        FinancialBarChartComponent,
    ]
})
export class DashboardModule { }
