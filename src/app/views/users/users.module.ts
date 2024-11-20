import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';


@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TableModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ]
})
export class UsersModule { }
