import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Role } from 'src/app/core/models/enum';
import { AuthenticationService } from 'src/app/core/services';
import { OtpSessionService } from 'src/app/core/services/otp-session.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  password!: string;
  loginForm: FormGroup;
  loading = false;
  username: string;
  otpInput = new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]);
  private intervalId: any = null;
  otpSessionActive = false;
  remainingTime = 0;
  timeLeft = signal(0);
  private timerId: any;

  // Computed signal that formats the remaining time as MM:SS.
  formattedTime = computed(() => {
    // Convert milliseconds to seconds.
    const remainingSeconds = Math.floor(this.timeLeft() / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const pad = (num: number) => num < 10 ? `0${num}` : num.toString();
    return `${pad(minutes)}:${pad(seconds)}`;
  });

  activateResendBtn = computed(() => {
    const totalSessionTime = 3 * 60 * 1000; // 180,000 ms
    const elapsedTime = totalSessionTime - this.timeLeft();
    return elapsedTime >= 30000;
  });

  constructor(
    public layoutService: LayoutService,
    private _fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private otpSessionService: OtpSessionService,
  ) {
    this.loginForm = this._fb.group({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    // Initialize timeLeft from the OTP session.
    this.updateTime();

    // Update timeLeft every second.
    this.timerId = setInterval(() => {
      this.updateTime();
      this.checkSession();
    }, 1000);
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => this.messageService.clear())
    this.checkSession();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /**
   * Checks whether the OTP session is active and has not expired.
   * Updates the "remainingTime" property with the time remaining in the session.
   * If the session is active, it optionally starts a timer to update the remaining time
   * every second. If the session is not active, it sets "otpSessionActive" to false.
   * @returns void
   */
  checkSession(): void {
    this.otpSessionActive = this.otpSessionService.isSessionActive();
    if (this.otpSessionActive) {
      this.remainingTime = this.otpSessionService.getRemainingTime();
      // Optionally, update the remaining time every second.
      this.intervalId = setInterval(() => {
        this.remainingTime = this.otpSessionService.getRemainingTime();
        if (this.remainingTime <= 0) {
          clearInterval(this.intervalId);
          this.otpSessionActive = false;
        }
      }, 1000);
    } else {
      this.otpSessionActive = false;
    }
  }


  /**
   * Login to the server using the form values.
   * Subscribes to the observable returned by the AuthenticationService and
   * shows the OTP input if the response is successful.
   * Resets the form and shows an error message if the response is an error.
   * @param form The form containing the login data.
   */
  login(form: FormGroup): void {
    this.loading = true;
    this.authService.authServer(form.value).subscribe({
      next: response => {
        this.loginForm.reset();
        this.username = response.username;
        this.otpSessionActive = true;
        this.otpSessionService.createSession(this.username);
      },
      error: err => {
        this.loginForm.reset();
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: '', detail: err });
      },
      complete: () => this.loading = false
    });
  }

  /**
   * Validate the OTP sent by the server. If the OTP is valid, navigate to the
   * admin dashboard and reset the login form. If the OTP is invalid, clear the
   * OTP input and show an error message.
   * @param otp The OTP to be validated.
   */
  validateOTP(otp: string): void {
    this.messageService.clear();
    this.authService.validateOTP(this.username, otp).subscribe({
      next: response => {
        switch (response.role) {
          case Role.admin:
          case Role.staff:
            this.router.navigate(['/dashboard']).then(() => this.loading = false)
            break;
          case Role.client:
            this.router.navigate(['/demographics']).then(() => this.loading = false)
            break;
        }
      },
      error: err => {
        this.otpInput.reset();
        this.messageService.add({ severity: 'error', summary: '', detail: err });
        this.loading = false;
      },
      complete: () => {
        setTimeout(() => {
          this.otpInput.reset();
          this.otpSessionActive = false;
          this.otpSessionService.clearSession();
        }, 2500);
      }
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
      this.loading = true;
      this.validateOTP(event.value);
    }
  }

  /**
   * Updates the "timeLeft" signal with the remaining time in the OTP session.
   * This method is called when the component is initialized and every second
   * thereafter to update the timer.
   */
  private updateTime(): void {
    // Get the remaining time from the OTP session service.
    this.timeLeft.set(this.otpSessionService.getRemainingTime());
  }

}
