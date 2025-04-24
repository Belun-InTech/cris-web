import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Credit, Demographic } from 'src/app/core/models/data';
import { DemoCreditService } from 'src/app/core/services/demo-credit.service';
import { normalizeId } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [MessageService]
})
export class SearchComponent {
  searchFormControl = new FormControl('', { updateOn: 'change' });
  dataIsFetching = false;
  demoData: Demographic;
  demoList: Demographic[];
  latestCredit: Credit;
  unique: string;

  selectedDemo!: any;

  constructor(
    private messageService: MessageService,
    private service: DemoCreditService,
  ) {
    this.demoData = undefined;
    this.demoList = [];
    this.searchFormControl.setValidators([Validators.required, Validators.minLength(1)]);
    this.unique = new Date().getMilliseconds().toString();
  }


  searchData(formInput: FormControl): void {
    this.messageService.clear();
    this.dataIsFetching = true
    this.service.searchByIdNumber(normalizeId(formInput.value))
      .subscribe({
        next: response => {
          this.demoData = response;
          this.demoList.push(this.demoData);
          this.dataIsFetching = false;

          // Get Latest Credit
          if (this.demoData.credits.length > 0) {
            this.latestCredit = this.demoData.credits[this.demoData.credits.length - 1];
          }
        },
        error: err => {
          this.dataIsFetching = false;
          this.demoList = [];
          this.demoData = undefined;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
        }
      });
  }

  clearFormInput(): void {
    this.messageService.clear();
    this.searchFormControl.reset();
    this.demoList = [];
    this.demoData = undefined;
  }
}
