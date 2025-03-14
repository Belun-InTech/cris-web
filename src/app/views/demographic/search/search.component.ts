import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { Demographic } from 'src/app/core/models/data';
import { DemographicService } from 'src/app/core/services';
import { DemoCreditService } from 'src/app/core/services/demo-credit.service';

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

  selectedDemo!: any;

  constructor(
    private messageService: MessageService,
    private service: DemoCreditService,
  ) {
    this.demoData = undefined;
    this.demoList = [];
    this.searchFormControl.setValidators([Validators.required, Validators.minLength(1)]);
  }


  searchData(formInput: FormControl): void {
    this.messageService.clear();
    this.dataIsFetching = true
    this.service.searchByIdNumber(formInput.value)
      .subscribe({
        next: response => {
          this.demoData = response;
          this.demoList.push(this.demoData);
          this.dataIsFetching = false;
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
