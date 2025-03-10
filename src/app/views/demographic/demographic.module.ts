import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { DemographicRoutingModule } from './demographic-routing.module';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    FormUploadComponent
  ],
  imports: [
    CommonModule,
    DemographicRoutingModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    CalendarModule,
    FileUploadModule,
    BadgeModule,
    ToastModule,
    ProgressBarModule,
    HttpClientModule,
    MenuModule,
    PaginatorModule,
    DialogModule,
    SelectButtonModule,
    StepperModule,
    TabViewModule,
    FieldsetModule,
    AccordionModule,
    RadioButtonModule,
  ]
})
export class DemographicModule { }
