import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  creditData: any[] = [];
  items: MenuItem[] | undefined;

  ngOnInit() {
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
}
