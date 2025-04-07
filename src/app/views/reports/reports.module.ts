import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormComponent } from './form/form.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    FormComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ChartModule,
    HighchartsChartModule,
    FloatLabelModule,
    TableModule,
  ]
})
export class ReportsModule { }
