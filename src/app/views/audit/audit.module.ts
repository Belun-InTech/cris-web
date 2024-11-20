import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ActivitiesComponent } from './activities/activities.component';
import { AuditRoutingModule } from './audit-routing.module';
import { AuthenticationComponent } from './authentication/authentication.component';


@NgModule({
  declarations: [
    ActivitiesComponent,
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    AuditRoutingModule,
    TableModule,
  ]
})
export class AuditModule { }
