import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Role, Status, User } from 'src/app/core/models';
import { UserService } from 'src/app/core/services';
import { mustMatch } from 'src/app/core/validators/must-match.validator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  userForm: FormGroup;
  roleList: Role[];
  loading = false;
  userData: User;
  isNew = false;
  statusOptions: any[] = [
    { name: Status.active, value: Status.active },
    { name: Status.pending, value: Status.pending },
    { name: Status.disabled, value: Status.disabled }
  ];


  constructor(
    private _fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.userForm = this._fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      status: [Status.pending],
      role: ['', [Validators.required]]
    },
      {
        validators: mustMatch('password', 'confirmPassword')
      }
    );

    this.roleList = this.mapToIdAndName(this.route.snapshot.data['roleList']._embedded.roles);

    this.userData = this.route.snapshot.data['userData'];

    if (this.userData) {
      this.isNew = false
      this.userData.role = {
        id: this.userData.role.id,
        name: this.userData.role.name,
      }
      this.userForm.patchValue(this.userData);
    } else {
      this.isNew = true;
      this.userForm.get('password').addValidators([Validators.required]);
      this.userForm.get('confirmPassword').addValidators([Validators.required]);
    }
  }

  /**
   * Saves a user to the server.
   *
   * The user object is sent to the server using the UserService.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed and the userForm is reset.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * @param form The user object to be sent to the server.
   */
  save(form: FormGroup): void {
    this.loading = true;
    this.userService.save(form.value).subscribe({
      next: response => {
        this.loading = false;
        this.setNotification(true, response);
      },
      error: error => {
        this.loading = false;
        this.setNotification(false, null, error);
      },
      complete: () => this.userForm.reset()
    });
  }

  update(form: FormGroup): void {
    this.messageService.clear();
    this.loading = true;

    this.userService.updateByUsername(this.userData.username, form.value).subscribe({
      next: response => {
        this.loading = false;
        this.setNotification(true, response);
      },
      error: error => {
        this.loading = false;
        this.setNotification(false, null, error);
      }
    });
  }



  /**
   * Shows a notification based on the success or failure of the save or update methods.
   * If the isNew flag is set to true, the notification is for a new user registration.
   * If the isNew flag is set to false, the notification is for an existing user update.
   * @param isSuccess A boolean indicating whether the operation was successful or not.
   * @param user The User object that was saved or updated, if any.
   * @param error The error message received from the server, if any.
   */
  setNotification(isSuccess: boolean, user?: User, error?: any) {
    if (this.isNew) {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'User Registered Successfully!', detail: `The user ${user.firstName} ${user.lastName} has been registered and an email verification link has been sent to ${user.email}.` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'User Updated Successfully!', detail: `The user ${user.firstName} ${user.lastName} informations has been updated` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }

  }


  /**
   * Maps an array of objects to an array of objects with only id and name properties.
   *
   * @param array The array of objects to be mapped.
   * @returns An array of objects with only id and name properties.
   */
  private mapToIdAndName(array: any[]): { id: number, name: string }[] {
    return array.map(item => {
      return {
        id: item.id,
        name: item.name
      };
    });
  }
}
