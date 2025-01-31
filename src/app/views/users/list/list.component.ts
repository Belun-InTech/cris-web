import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  users: any[] = [];

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getPagination().subscribe(data => {
      console.log(data);

      this.users = data.content;
    });
  }

  getSeverity(status: string): string {
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
}
