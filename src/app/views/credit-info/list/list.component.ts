import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CreditPage } from 'src/app/core/models/data';
import { FileExportService } from 'src/app/core/services';
import { CreditService } from 'src/app/core/services/credit.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  creditData: CreditPage[] = [];
  items: MenuItem[] | undefined;
  page = 0;
  size = 50;
  totalData = 0;
  columns = ['Credit Grantor', 'ID Number / TIN', 'Due Cate', 'Monthly Payment', 'Last Payment (Date)', 'Balance'];
  filename = 'Demographic';
  dataIsFetching = false;
  inMemoryData: any[] = [];
  searchFormControl = new FormControl('', { updateOn: 'change' });

  constructor(
    private route: ActivatedRoute,
    private service: CreditService,
    private excelService: FileExportService,
    private router: Router,
  ) {
    this.creditData = this.route.snapshot.data['creditList'].content;
    this.totalData = this.route.snapshot.data['creditList'].totalElements;
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
        }
      },
      {
        icon: 'pi pi-file-excel',
        label: 'Excel',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
      },
    ];
  }

  getData(page: number, size: number): void {
    this.service.getPagination(page, size).subscribe({
      next: response => {
        this.creditData = response.content;
        this.totalData = response.totalElements;
        this.dataIsFetching = false;
      },
      error: err => {
        this.dataIsFetching = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.dataIsFetching = true;
    this.page = event.page;
    this.size = event.rows;
    this.getData(this.page, this.size);
  }

  routeToDetailPage(id: number, idNumber: string): void {
    this.router.navigate(['/credit-informations', id], {
      queryParams: { idNumber: idNumber, extraData: 'value' }
    });
  }
}
