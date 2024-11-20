import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableModule } from 'primeng/table';
import { DataMasterRoutingModule } from './data-master-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DataMasterRoutingModule,
    TableModule,
  ]
})
export class DataMasterModule { }
