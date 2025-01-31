import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    TableModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    MessagesModule,
    SelectButtonModule,
  ]
})
export class UsersModule { }
