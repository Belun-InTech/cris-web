import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
      fromEmail: ['', [Validators.required, Validators.email]]
    });

    this.ldapForm = this._fb.group({
      url: ['', [Validators.required, Validators.minLength(3)]],
      baseDn: ['', [Validators.required, Validators.minLength(3)]],
      userDn: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      userSearchFilter: ['', [Validators.required, Validators.minLength(3)]],
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
    this.configService.saveLdap(form.value).subscribe({
      next: () => {
        this.setNotification(true);
      },
      error: err => {
        this.setNotification(false, err);
      }
    });
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Sets a notification in the message service.
   * 
   * If `isSuccess` is true, a success notification is set. If it is false, an error 
   * notification is set instead. The error message is the value of the `error` 
   * parameter.
   * 
   * @param isSuccess - A boolean indicating whether the notification should be a 
   * success or error notification.
   * @param error - An optional error message to be used if `isSuccess` is false.
   */
  /******  73dacab1-222c-49cd-afe0-6a22d9be5afd  *******/
  setNotification(isSuccess: boolean, error?: any) {
    isSuccess ? this.messageService.add({ severity: 'success', summary: 'Saved Successfully!', detail: `The configuraion has been registered.`, key: 'br', life: 3000 }) :
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error, key: 'br', life: 3000 });
  }

}
