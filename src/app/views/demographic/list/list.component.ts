import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { DemographicService, FileExportService } from 'src/app/core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  demoData: any[] = [];
  items: MenuItem[] | undefined;
  page = 0;
  size = 50;
  totalData = 0;
  showDialog = false;
  columns = ['Name', 'Gender', 'ID Number / TIN', 'Address', 'City', 'Birth Date', 'Phone Nº'];
  filename = 'Demographic';
  dataIsFetching = false;
  inMemoryData: any[] = [];
  searchFormControl = new FormControl('', { updateOn: 'change' });

  constructor(
    private route: ActivatedRoute,
    private service: DemographicService,
    private excelService: FileExportService,
  ) {
    this.demoData = this.route.snapshot.data['demographicList'].content;
    this.totalData = this.route.snapshot.data['demographicList'].totalElements;
  }

  ngOnInit() {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : this.page;
      this.size = params['size'] ? +params['size'] : this.size;
    });

    this.items = [
      {
        icon: 'pi pi-file-pdf',
        label: 'PDF',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          if (this.demoData.length > 0) {
            this.exportToPDF();
          }
        }
      },
      {
        icon: 'pi pi-file-excel',
        label: 'Excel',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          if (this.demoData.length > 0) {
            this.exportToExcel();
          }
        }
      },
    ];

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => this.dataIsFetching = true),
        switchMap(value => {
          const trimmedValue = value.trim();
          if (trimmedValue === '') {
            // If query is empty, return the original unfiltered data
            return this.service.getPagination(this.page, this.size);
          } else {
            // Perform filtered search
            return this.service.filterByQuery(trimmedValue);
          }
        })
      )
      .subscribe({
        next: response => {
          this.demoData = response.content;
          this.totalData = response.totalElements;
          this.dataIsFetching = false;
        },
        error: err => {
          this.dataIsFetching = false;
        }
      });
  }

  /**
   * Gets data from the service and updates the component's data
   * @param page The page number to retrieve.
   * @param size The number of items per page.
   */
  getData(page: number, size: number): void {
    this.service.getPagination(page, size).subscribe({
      next: response => {
        this.demoData = response.content;
        this.totalData = response.totalElements;
        this.dataIsFetching = false;
      },
      error: err => {
        this.dataIsFetching = false;
      },
    });
  }

  openDialogNewData(): void {
    this.showDialog = true;
  }

  /**
   * Triggered when the paginator emits a page change event. Updates the component's
   * page and size properties, and then gets the new data from the service.
   * @param event The event emitted by the paginator.
   */
  onPageChange(event: any): void {
    this.dataIsFetching = true;
    this.page = event.page;
    this.size = event.rows;
    this.getData(this.page, this.size);
  }

  exportToExcel(): void {
    this.dataIsFetching = true;
    this.service.getAll().subscribe({
      next: response => {
        this.dataIsFetching = false;
        this.excelService.exportToExcel(response, this.filename);
      },
      error: err => {
        this.dataIsFetching = false;
      },
    });
  }
  // ['fullName', 'gender', 'idNumber', 'city', 'brithDate', 'phoneNumber']

  exportToPDF(): void {
    this.dataIsFetching = true;
    this.service.getAll().subscribe({
      next: response => {
        this.dataIsFetching = false;
        this.excelService.exportToPDF(this.columns, response, this.filename);
      },
      error: err => {
        this.dataIsFetching = false;
      },
    });
  }
}
