import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/core/models';
import { FinancialInstitution, Role } from 'src/app/core/models/data-master';
import { Account, Status } from 'src/app/core/models/enum';
import { UserService } from 'src/app/core/services';
import { mustMatch } from 'src/app/core/validators/must-match.validator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  userExternalForm: FormGroup;
  userInternalForm: FormGroup;
  roleListInternal: Role[];
  roleListExternal: Role[];
  financialInstitutionList: FinancialInstitution[];
  selectedFinancialInstitutionInternal: any;
  loading = false;
  userData: User;
  isNew = false;
  accountTypOpts: any[] = [
    { name: Account.internal, value: Account.internal.toString() },
    { name: Account.external, value: Account.external.toString() },
  ];
  selectedAccountType = new FormControl();
  statusOptions: any[] = [
    { name: Status.active, value: Status.active },
    { name: Status.pending, value: Status.pending },
    { name: Status.disabled, value: Status.disabled }
  ];
  filteredLdapUsers: any[];
  bctlFinancialInstitution: FinancialInstitution;


  constructor(
    private _fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.userInternalForm = this._fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      status: [Status.active],
      role: ['', [Validators.required]],
      financialInstitution: ['', [Validators.required]],
      internal: [true]
    });

    this.userExternalForm = this._fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      status: [Status.pending],
      role: ['', [Validators.required]],
      financialInstitution: ['', [Validators.required]],
      internal: [false]
    },
      {
        validators: mustMatch('password', 'confirmPassword')
      }
    );

    this.roleListInternal = this.mapToIdAndName(this.route.snapshot.data['roleList']._embedded.roles).filter(values => values.name !== 'ROLE_CLIENT');

    this.roleListExternal = this.mapToIdAndName(this.route.snapshot.data['roleList']._embedded.roles).filter(values => values.name === 'ROLE_CLIENT');

    this.financialInstitutionList = this.mapToIdAndName(this.route.snapshot.data['financialInstitutionList']._embedded.financialInstitutions).filter(values => values.name.toLowerCase() !== 'bctl');

    this.bctlFinancialInstitution = this.route.snapshot.data['financialInstitutionList']._embedded.financialInstitutions.find(value => value.name.toLowerCase() === 'bctl');

    this.userData = this.route.snapshot.data['userData'];

    if (this.userData) {
      this.isNew = false
      this.userData.role = {
        id: this.userData.role.id,
        name: this.userData.role.name,
      }

      this.selectedAccountType.setValue(this.userData.internal ? 'internal' : 'external');
      this.selectedAccountType.disable();
      if (this.userData.internal) {
        this.userInternalForm.patchValue(this.userData);
      } else {
        this.userData.financialInstitution = {
          id: this.userData.financialInstitution.id,
          name: this.userData.financialInstitution.name,
        }
        this.userExternalForm.patchValue(this.userData);
      }
    } else {
      this.isNew = true;
      // this.userExternalForm.get('password').addValidators([Validators.required]);
      // this.userExternalForm.get('confirmPassword').addValidators([Validators.required]);
    }
  }

  ngOnInit(): void {
    this.selectedAccountType.valueChanges.subscribe({
      next: value => {
        if (value === Account.external) {
          this.userExternalForm.get('role').setValue(this.roleListExternal.find(value => value.name === 'ROLE_CLIENT'));
        }
      }
    });

    if (this.selectedAccountType.value === Account.internal) {
      this.userInternalForm.get('username')?.valueChanges.subscribe()
    }
  }

  onSelectLdapUsername(event: any): void {
    let user = {
      firstName: this.splitFullName(event.value.fullName).firstName,
      lastName: this.splitFullName(event.value.fullName).lastName,
      username: event.value.username,
      email: event.value.email,
      financialInstitution: this.bctlFinancialInstitution,
    }
    this.userInternalForm.patchValue(user);
  }

  onInputClear(event: any): void {

  }

  private splitFullName(fullName): { firstName: string, lastName: string } {
    const index = fullName.indexOf(" ");
    if (index === -1) { // No space found; return the whole name as first name
      return {
        firstName: fullName,
        lastName: ""
      };
    }
    const firstName = fullName.substring(0, index);
    const lastName = fullName.substring(index + 1); // Everything after the first space
    return { firstName, lastName };
  }

  filterLdapUsersByUsername(event: any): void {
    if (event.query.length > 2) {
      this.userService.getByLdapByUsername(event.query).subscribe({
        next: response => {
          this.filteredLdapUsers = response;
        },
        error: error => this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
      })
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
      complete: () => {
        this.userInternalForm.reset()
        this.userExternalForm.reset();
      }
    });
  }

  /**
   * Updates the user information on the server.
   *
   * The user object is sent to the server using the UserService with the username as the identifier.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * @param form The form containing the user data to be updated.
   */

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
