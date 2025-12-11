import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/core/services';
import { mustMatch } from 'src/app/core/validators/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [MessageService]
})
export class ResetPasswordComponent {
  form!: FormGroup;
  loading = false;
  isSuccess = false;
  isTokenvalid = false;
  token!: string;
  doLogin = false;
  uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  messages: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private messageService: MessageService,
  ) { }


  ngOnInit(): void {
    this.messageService.clear();
    this.form = this._fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    },
      {
        validators: mustMatch('newPassword', 'confirmPassword')
      }
    );

    // this.token = this.route.snapshot.data['tokenResolve'];
    this.token = this.route.snapshot.queryParamMap.get('t') || '';

    if (!this.token || !this.uuidRegex.test(this.token)) {
      this.isTokenvalid = true;
      this.messages.push(
        { severity: 'error', summary: 'Error', detail: 'Token is invalid or expired!' },
      )
    }

  }

  submit(form: FormGroup): void {
    this.messageService.clear();
    this.loading = true;
    const data = form.value;
    data.token = this.token;

    this.authService.resetPassword(data).subscribe({
      next: response => {
        this.loading = false;
        this.messageService.add(
          { severity: 'success', summary:'Success', detail: 'Password reset successfully' },
        );
        this.isSuccess = true;
      },
      error: error => {
        this.loading = false;
        this.isSuccess = false;
        this.messageService.add(
          { severity: 'error', summary: 'Error', detail: error },
        )
        this.form.reset();
      }
    });
  }
}
