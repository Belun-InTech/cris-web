import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { FinancialInstitution } from 'src/app/core/models/data-master';
import { FileExportService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  users: any[] = [];
  financialInstitutionList: FinancialInstitution[];
  financialInstitutionFormControl: FormControl;
  searchFormControl: FormControl;
  cacheData: any[] = [];
  dataIsFetching = false;
  items: MenuItem[] | undefined;
  columns: string[] = ['Name', 'Username', 'Email', 'Financial Institution', 'Role', 'Status'];
  filename = 'Users';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private excelService: FileExportService,
  ) {
    this.financialInstitutionFormControl = new FormControl(null);
    this.searchFormControl = new FormControl('', { updateOn: 'change' });
    this.users = this.route.snapshot.data['pageUserResolve'].content;
    this.financialInstitutionList = this.mapToIdAndName(this.route.snapshot.data['financialInstitutionList']._embedded.financialInstitutions);
``
    this.items = [
      {
        icon: 'pi pi-file-pdf',
        label: 'PDF',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          if (this.users.length > 0) {
            this.exportToPDF();
          }
        }
      },
      {
        icon: 'pi pi-file-excel',
        label: 'Excel',
        command: () => {
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          if (this.users.length > 0) {
            this.exportToExcel();
          }
        }
      },
    ];
  }


  ngOnInit(): void {
    this.financialInstitutionFormControl.valueChanges.subscribe(value => {
      if (value) {
        this.dataIsFetching = true;
        this.userService.getByFinancialInstitutionId(value.id).subscribe({
          next: response => {
            this.users = response;
            this.dataIsFetching = false;
          }
        });
      } else {
        this.getUsers();
      }
    });

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => this.dataIsFetching = true),
        switchMap(value => {
          const trimmedValue = value.trim();
          if (trimmedValue === '') {
            // If query is empty, return the original unfiltered data
            return this.userService.getPagination().pipe(
              map(response => response.content)
            );
          } else {
            // Perform filtered search
            return this.userService.filterByQuery(trimmedValue);
          }
        })
      )
      .subscribe({
        next: response => {
          this.users = response;
          this.dataIsFetching = false;
        },
        error: err => {
          this.dataIsFetching = false;
        }
      });
  }

  private getUsers() {
    this.dataIsFetching = true;
    this.userService.getPagination().subscribe(data => {
      this.users = data.content;
      this.dataIsFetching = false;
    });
  }

  getSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'active':
        return 'success'; // Green tag
      case 'pending':
        return 'warning'; // Yellow tag
      case 'disabled':
        return 'danger'; // Red tag
      default:
        return 'info'; // Default color
    }
  }

  getStatusLabel(status: string): string {
    return status; // Simply returns 'Active', 'Pending', or 'Disabled'
  }

  /**
  * Maps an array of objects to an array of objects with only id and name properties.
  *
  * @param array The array of objects to be mapped.
  * @returns An array of objects with only id and name properties.
  */
  private mapToIdAndName(array: any[]): { id: number, name: string }[] {
    return array.map(item => {
      return {
        id: item.id,
        name: item.name
      };
    });
  }

  private exportToExcel(): void {
    this.excelService.exportToExcel(this.mapUserList(this.users), this.filename);
  }
  // ['fullName', 'gender', 'idNumber', 'city', 'brithDate', 'phoneNumber']

  private exportToPDF(): void {
    this.excelService.exportUsersToPDF(this.columns, this.mapUserList(this.users), this.filename);
  }

  private mapUserList(users: any[]): any[] {
    return users.map(user => {
      return {
        ['Name']: `${user.firstName} ${user.lastName}`,
        ['Username']: user.username,
        ['Email']: user.email,
        ['Financial Institution']: user.financialInstitution.name,
        ['Role']: user.role.name.replace('ROLE_', ''),
        ['Status']: user.status,
      };
    });
  }
}
