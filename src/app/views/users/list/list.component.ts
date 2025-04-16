import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinancialInstitution } from 'src/app/core/models/data-master';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  users: any[] = [];
  financialInstitutionList: FinancialInstitution[];
  financialInstitutionFormControl: FormControl;
  cacheData: any[] = [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    this.financialInstitutionFormControl = new FormControl(null);
    this.users = this.route.snapshot.data['pageUserResolve'].content;
    this.financialInstitutionList = this.mapToIdAndName(this.route.snapshot.data['financialInstitutionList']._embedded.financialInstitutions);
  }


  ngOnInit(): void {
    this.financialInstitutionFormControl.valueChanges.subscribe(value => {
      if (value) {
        this.userService.getByFinancialInstitutionId(value.id).subscribe({
          next: response => {
            this.users = response;
          }
        });
      } else {
        this.getUsers();
      }
    });
  }

  private getUsers() {
    this.userService.getPagination().subscribe(data => {
      this.users = data.content;
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
}
