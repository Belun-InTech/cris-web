import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'highcharts';
import { MessageService } from 'primeng/api';
import { EmailConfig, LdapConfig } from 'src/app/core/models/data';
import { ConfigsService } from 'src/app/core/services';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  providers: [MessageService]
})
export class ConfigurationComponent {
  emailForm: FormGroup;
  ldapForm: FormGroup;
  emailConfig: EmailConfig;
  ldapConfig: LdapConfig;
  loading = false;
  loadingTest = false;

  constructor(
    private _fb: FormBuilder,
    private configService: ConfigsService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.emailConfig = this.route.snapshot.data['emailConfigResolve'];
    this.ldapConfig = this.route.snapshot.data['ldapConfigResolve'];

    this.emailForm = this._fb.group({
      id: undefined,
      smtpHost: ['', [Validators.required, Validators.minLength(3)]],
      smtpPort: [undefined, [Validators.required, Validators.min(1)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      fromEmail: ['', [Validators.required, Validators.email]],
      toEmail: ['', [Validators.email]],
    });

    this.ldapForm = this._fb.group({
      id: [undefined],
      url: ['', [Validators.required, Validators.minLength(3)]],
      baseDn: ['', [Validators.required, Validators.minLength(3)]],
      userDn: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      userSearchFilter: ['', [Validators.required, Validators.minLength(3)]],
      active: [true],
    });

    if (this.emailConfig) {
      this.emailForm.patchValue(this.emailConfig);
    }
    if (this.ldapConfig) {
      this.ldapForm.patchValue(this.ldapConfig);
    }
  }

  /**
   * Submits the email configuration form data to be saved.
   * 
   * This method takes a form group as input, extracts its value, and sends it to the 
   * configuration service to save the email settings. If the operation is successful, 
   * a success notification is displayed. If there is an error, an error notification 
   * is shown instead.
   * 
   * @param form - The form group containing the email configuration data.
   */

  submitEmail(form: FormGroup): void {
    this.messageService.clear();
    this.configService.saveEmail(form.value).subscribe({
      next: response => {
        this.setNotification(true, response);
      },
      error: err => {
        this.setNotification(false, err);
      }
    });
  }

  /**
   * Tests the email configuration.
   * 
   * This method takes the email address in the toEmail form control and sends it to the 
   * configuration service to test the email settings. If the test is successful, a success 
   * notification is displayed. If there is an error, an error notification is shown instead.
   */
  testEmailConfig(): void {
    const toEmail = this.emailForm.get('toEmail').value;
    this.messageService.clear();
    this.loadingTest = true;
    this.configService.testEmailConfig(toEmail)
      .subscribe({
        next: response => {
          this.loadingTest = false;
          this.messageService.add({ key: 'tm', severity: 'success', summary: 'Email Configured Successfully!', detail: response.message, life: 3000 });
        },
        error: err => {
          this.loadingTest = false;
          this.messageService.add({ key: 'tm', severity: 'error', summary: 'Error', detail: err });
        },
        complete: () => this.loadingTest = false
      })
  }

  /**
   * Tests the LDAP/AD configuration.
   * 
   * This method takes the LDAP/AD configuration from the form and sends it to the 
   * configuration service to test the LDAP/AD settings. If the test is successful, a success 
   * notification is displayed. If there is an error, an error notification is shown instead.
   */
  testLdapConfig(): void {
    this.messageService.clear();
    this.loadingTest = true;
    this.configService.testLdapConfig()
      .subscribe({
        next: response => {
          this.loadingTest = false;
          this.messageService.add({ key: 'tl', severity: 'success', summary: 'Ldap/AD Configured Successfully!', detail: response.message, life: 3000 });
        },
        error: err => {
          this.loadingTest = false;
          this.messageService.add({ key: 'tl', severity: 'error', summary: 'Error', detail: err });
        },
        complete: () => this.loadingTest = false
      })
  }

  /**
   * Submits the LDAP configuration form data to be saved.
   * 
   * This method takes a form group as input, extracts its value, and sends it to the 
   * configuration service to save the LDAP settings. If the operation is successful, 
   * a success notification is displayed. If there is an error, an error notification 
   * is shown instead.
   * 
   * @param form - The form group containing the LDAP configuration data.
   */
  submitLdap(form: FormGroup): void {
    this.messageService.clear();
    this.configService.saveLdap(form.value).subscribe({
      next: () => {
        this.setNotification(true);
      },
      error: err => {
        this.setNotification(false, err);
      }
    });
  }

  /**
   * Displays a notification message based on the success or failure of an operation.
   *
   * If the operation is successful, a success message is displayed.
   * If the operation fails, an error message is displayed with the provided error detail.
   * 
   * @param isSuccess - Indicates whether the operation was successful.
   * @param error - The error message received, if any.
   */

  setNotification(isSuccess: boolean, error?: any) {
    isSuccess ? this.messageService.add({ severity: 'success', summary: 'Saved Successfully!', detail: `The configuraion has been registered.`, key: 'br', life: 3000 }) :
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error, key: 'br', life: 3000 });
  }

}
