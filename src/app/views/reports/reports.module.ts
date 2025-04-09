import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { FormComponent } from './form/form.component';
import { ReportsRoutingModule } from './reports-routing.module';

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
    MessagesModule,
    InputNumberModule,
  ]
})
export class ReportsModule { }
