import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { DataMasterRoutingModule } from './data-master-routing.module';
import { DataMasterComponent } from './data-master/data-master.component';

@NgModule({
  declarations: [
    DataMasterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataMasterRoutingModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    MessagesModule,
    EditorModule,
  ]
})
export class DataMasterModule { }
