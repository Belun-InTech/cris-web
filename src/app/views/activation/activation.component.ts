import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Status } from 'src/app/core/models';
import { UserService } from 'src/app/core/services';
import { mustMatch } from 'src/app/core/validators/must-match.validator';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss',
  providers: [MessageService]
})
export class ActivationComponent {
  activationForm: FormGroup;
  loading = false;
  token: string;


  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.activationForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
      status: [Status.active],
    },
      {
        validators: mustMatch('password', 'confirmPassword')
      }
    );

    this.token = this.route.snapshot.data['tokenResolve'];
  }

  activateUser(form: FormGroup): void {
    this.loading = true;
    this.userService.activate(this.token, form.value).subscribe({
      next: response => {
        this.loading = false;
        this.setNotification(true, response);
      },
      error: error => {
        this.loading = false;
        this.setNotification(false, null, error);
      },
      complete: () => this.activationForm.reset()
    });
  }

  setNotification(isSuccess: boolean, obj?: any, error?: any) {
    isSuccess ? this.messageService.add({ severity: 'success', summary: 'Activation Success', detail: `${obj.message}` }) :
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

  }
}
