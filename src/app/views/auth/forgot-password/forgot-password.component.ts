import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/core/services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [MessageService]
})
export class ForgotPasswordComponent {
  loading = false;
  email: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  constructor(
    private _fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
  ) {

  }


  ngOnInit(): void {
  }

  submit(): void {
    this.messageService.clear();
    this.loading = true;
    if (this.email.valid) {
      this.authService.sendForgotPasswordEmail(this.email.value!).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add(
            { severity: 'success', summary: 'Success', detail: 'An Email has been sent to your email, please check your inbox and follow the instructions.' },
          );
          this.email.reset();
        },
        error: (err) => {
          console.log(err);

          this.messageService.add(
            { severity: 'error', summary: 'Error', detail: err },
          );
          this.loading = false;
          this.email.reset();
        }
      })
    } else {
      this.email.markAsTouched();
      this.loading = false;
    }
  }
}
