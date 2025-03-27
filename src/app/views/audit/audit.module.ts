import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ActivitiesComponent } from './activities/activities.component';
import { AuditRoutingModule } from './audit-routing.module';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    ActivitiesComponent,
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    AuditRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FloatLabelModule,
    TableModule,
    CalendarModule,
    TagModule,
    PaginatorModule,
  ]
})
export class AuditModule { }
