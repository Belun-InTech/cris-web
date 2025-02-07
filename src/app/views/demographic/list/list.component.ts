import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DemographicService } from 'src/app/core/services';

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

  constructor(
    private route: ActivatedRoute,
    private service: DemographicService,
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
      },
      error: err => {

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
    this.page = event.page;
    this.size = event.rows;
    this.getData(this.page, this.size);
  }
}
