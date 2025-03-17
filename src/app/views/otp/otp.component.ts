import { Component, computed, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Role } from 'src/app/core/models/enum';
import { AuthenticationService } from 'src/app/core/services';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  providers: [MessageService]
})
export class OtpComponent {
  valCheck: string[] = ['remember'];
  password!: string;
  loading = false;
  otpLoading = false;
  username: string;
  otpInput = new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]);
  otpSessionActive = true;
  timeLeft = signal(0);
  activateResendBtn = computed(() => {
    const totalSessionTime = 3 * 60 * 1000; // 180,000 ms
    const elapsedTime = totalSessionTime - this.timeLeft();
    return elapsedTime >= 30000;
  });


  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(params => this.username = params.get('u') ?? '');
  }

  /**
   * Validate the OTP sent by the server. If the OTP is valid, navigate to the
   * admin dashboard and reset the login form. If the OTP is invalid, clear the
   * OTP input and show an error message.
   * @param otp The OTP to be validated.
   */
  validateOTP(otp: string): void {
    this.messageService.clear();
    this.otpLoading = true;

    this.authService.validateOTP(this.username, otp).subscribe({
      next: response => {
        switch (response.role) {
          case Role.admin:
          case Role.staff:
            this.otpSessionActive = true;
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
            break;
          case Role.client:
            this.router.navigate(['/search']).then(() => {
              this.otpLoading = false;
            });
            break;
        }
      },
      error: err => {
        this.otpInput.reset();
        this.messageService.add({ severity: 'error', summary: '', detail: err });
        this.otpLoading = false;
      },
    });
  }

  /**
   * Resends the OTP to the user's email.
   * 
   * Initiates the process to regenerate and resend the OTP for the current user.
   * Displays a success message if the OTP is successfully resent, or shows an error
   * message if there is a failure during the process.
   */
  resendCode() {
    this.loading = true;
    this.authService.regenerateOTP(this.username).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'OTP Resent Successfully', detail: 'Your code has been resent. Please check your email.' });
        this.loading = false;
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: '', detail: err });
        this.loading = false;
      }
    })
  }

  /**
   * Handles changes to the OTP input field.
   *
   * This method is triggered when the OTP input changes. If the input value
   * has a length of 6, it triggers OTP validation.
   *
   * @param {any} event - The event object containing the new input value.
   */
  otpInputOnChange(event: any): void {
    this.messageService.clear();
    if (event.value && event.value.length === 6) {
      this.validateOTP(event.value);
    }
  }
}
