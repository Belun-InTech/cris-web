import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DemographicService } from 'src/app/core/services';
import { genderOpts } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  demographicForm: FormGroup;
  loading = false;
  isNew = true;
  demoData: any;
  genderOpts: any[] = genderOpts;
  selectedGender: any;

  constructor(
    private messageService: MessageService,
    private demographicService: DemographicService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.demographicForm = this._fb.group({
      id: [''],
      idNumber: ['', [Validators.required, Validators.minLength(1)]],
      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      city: ['', Validators.required],
      maritalStatus: [''],
      spouseName: [''],
      employmentHistory: [''],
      phoneNumber: ['', [Validators.required]],
    });

    this.demoData = this.route.snapshot.data['demoData'];

    if (this.demoData) {
      this.isNew = false;
      this.demographicForm.patchValue(this.demoData);
      this.demographicForm.get('birthDate')?.setValue(new Date(this.demoData.birthDate));
    }
  }

  ngOnInit() {

  }

  /**
   * Saves a demographic to the server.
   *
   * The user object is sent to the server using the DemographicService.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed and the demographicForm is reset.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * If the form is invalid, an error notification is displayed with the message 'Form is invalid'.
   * @param form The demographic object to be sent to the server.
   */
  save(form: FormGroup) {
    this.messageService.clear();
    this.loading = true;
    if (form.valid) {
      let formData = form.value;

      // Convert birthDate to 'yyyy-MM-dd' format
      if (formData.birthDate) {
        let dateObj = new Date(formData.birthDate);
        formData.birthDate = dateObj.toISOString().split('T')[0]; // Extracts 'yyyy-MM-dd'
      }

      this.demographicService.save(formData).subscribe({
        next: (response) => {
          this.setNotification(true, response);
        },
        error: (error) => {
          this.loading = false;
          this.setNotification(false, null, error);
        },
        complete: () => {
          this.demographicForm.reset();
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/demographics']);
          }, 3000)
        }
      });
    } else {
      this.setNotification(false, null, 'Form is invalid');
    }
  }

  /**
   * Updates a demographic on the server.
   *
   * The demographic object is sent to the server using the DemographicService.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * If the form is invalid, an error notification is displayed with the message 'Form is invalid'.
   * Upon successful update, the user is redirected to the demographics list after a delay.
   * @param form The demographic object to be sent to the server.
   */

  update(form: FormGroup) {
    this.messageService.clear();
    this.loading = true;
    if (form.valid) {
      let formData = form.value;
      this.demographicService.updateById(this.demoData.id, formData).subscribe({
        next: (response) => {
          this.setNotification(true, response);
        },
        error: (error) => {
          this.loading = false;
          this.setNotification(false, null, error);
        },
        complete: () => {
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/demographics']);
          }, 3000)
        }
      });
    } else {
      this.setNotification(false, null, 'Form is invalid');
    }
  }

  /**
   * Displays a notification message based on the success or failure of an operation.
   *
   * If the operation is for a new demographic registration, the notification is for a new demographic registration.
   * If the operation is for an existing demographic update, the notification is for an existing demographic update.
   * If the operation is successful, the notification is a success message.
   * If the operation is an error, the notification is an error message with the error message received from the server.
   * @param isSuccess - Indicates whether the operation was successful.
   * @param demographic - The demographic object that was registered or updated, if any.
   * @param error - The error message received, if any.
   */
  setNotification(isSuccess: boolean, demographic?: any, error?: any) {
    if (this.isNew) {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'Demographic Registered Successfully!', detail: `The Demographic data ${demographic.fullName} has been registered.` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'Demographic Updated Successfully!', detail: `The Demographic data ${demographic.fullName} informations has been updated` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }

}
