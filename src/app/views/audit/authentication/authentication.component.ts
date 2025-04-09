import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/core/models/enum';
import { AuditService, AuthenticationService } from 'src/app/core/services';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  data: any[] = [];
  username: string;
  currentRole: Role;
  dateTimeForm: FormGroup;
  startDateTime: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  endDateTime: Date = new Date();
  rangeDateTime = [this.startDateTime, this.endDateTime];
  page = 0;
  size = 50;
  totalData = 0;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private authService: AuthenticationService,
    private _fb: FormBuilder,
  ) {
    this.dateTimeForm = this._fb.group({
      rangeDateTime: [[this.startDateTime, this.endDateTime], Validators.required]
    });

    this.username = this.authService.currentUserValue.username;
    this.currentRole = this.authService.currentRole;
    this.data = this.route.snapshot.data['loginActivitiesResolve'].content;
    this.totalData = this.route.snapshot.data['loginActivitiesResolve'].totalElements;

  }

  ngOnInit(): void {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.startDateTime = params['sdt'] ? params['sdt'] : this.startDateTime;
      this.endDateTime = params['edt'] ? params['edt'] : this.endDateTime;
      this.page = params['page'] ? +params['page'] : this.page;
      this.size = params['size'] ? +params['size'] : this.size;
    });


    this.dateTimeForm.valueChanges.subscribe({
      next: value => {
        if (value.rangeDateTime[1]) {
          this.getLoginData(value.rangeDateTime[0], value.rangeDateTime[1], this.page, this.size);
        }
      }
    })
  }

  getLoginData(startDateTime: Date, endDateTime: Date, page: number, size: number) {
    endDateTime.setHours(23, 59, 59, 0);
    if (this.currentRole === Role.admin) {
      this.auditService.getLoginActivities(startDateTime, endDateTime, page, size).subscribe({
        next: res => this.data = res.content
      });
    } else {
      this.auditService.getLoginActivitiesByUsername(this.username, startDateTime, endDateTime, page, size).subscribe({
        next: res => this.data = res.content
      });
    }
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.getLoginData(this.startDateTime, this.endDateTime, this.page, this.size); }

  getSeverity(outcome: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    return outcome === 'SUCCESS' ? "success" : "danger";
  }
}
