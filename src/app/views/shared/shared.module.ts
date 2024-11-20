import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LokalFormComponent } from './lokal-form/lokal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    LokalFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule
  ],
  exports: [
    LokalFormComponent
  ]
})
export class SharedModule { }
