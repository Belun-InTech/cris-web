import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/core/services';
import { OtpSessionService } from 'src/app/core/services/otp-session.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  password!: string;
  loginForm: FormGroup;
  loading = false;

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
  }


  /**
   * Authenticates the user by sending a request to the server with the given form data.
   * If the authentication is successful, it redirects the user to the OTP route session.
   * If the authentication fails, it displays an error message.
   *
   * @param form The form data containing the username and password.
   */
  login(form: FormGroup): void {
    this.loading = true;
    this.authService.authServer(form.value).subscribe({
      next: response => {
        this.loginForm.reset();

        // Redirect to OTP route session
        this.otpSessionService.createSession(response.username);
        this.router.navigate(['/otp'], { queryParams: { u: response.username } }).then();
      },
      error: err => {
        this.loginForm.reset();
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: '', detail: err });
      },
      complete: () => this.loading = false
    });
  }
}
