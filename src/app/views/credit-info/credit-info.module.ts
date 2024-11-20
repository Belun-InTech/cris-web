import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CreditInfoRoutingModule } from './credit-info-routing.module';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    CreditInfoRoutingModule,
    TableModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    FileUploadModule,
    BadgeModule,
    ToastModule,
    ProgressBarModule,
    HttpClientModule,
    MenuModule,
  ]
})
export class CreditInfoModule { }
