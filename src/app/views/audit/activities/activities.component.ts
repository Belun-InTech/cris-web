import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/core/models/enum';
import { AuditService, AuthenticationService } from 'src/app/core/services';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
  data: any[] = [];
  username: string;
  currentRole: Role;
  dateTimeForm: FormGroup;
  startDateTime: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  endDateTime: Date = new Date();
  rangeDateTime = [this.startDateTime, this.endDateTime];

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
    this.data = this.route.snapshot.data['activitiesResolve'];
  }

  ngOnInit(): void {
    this.dateTimeForm.valueChanges.subscribe({
      next: value => {
        if (value.rangeDateTime[1]) {
          this.getAuditData(value.rangeDateTime[0], value.rangeDateTime[1]);
        }
      }
    });
  }

  getAuditData(startDateTime: Date, endDateTime: Date) {
    endDateTime.setHours(23, 59, 59, 0);
    if (this.currentRole === Role.admin) {
      this.auditService.getAllActions(startDateTime, endDateTime).subscribe({
        next: res => this.data = res
      });
    } else {
      this.auditService.getActionsByUsername(this.username, startDateTime, endDateTime).subscribe({
        next: res => this.data = res
      });
    }
  }

  getEntity(input: string): string {
    const result = input.split('.');
    return result[result.length - 1]
  }
}
