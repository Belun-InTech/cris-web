import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { CreditInfoRoutingModule } from './credit-info-routing.module';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    FormUploadComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    PaginatorModule,
    InputTextareaModule,
    StepperModule,
    AccordionModule,
    TabViewModule,
    RadioButtonModule,
  ]
})
export class CreditInfoModule { }
