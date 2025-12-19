import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { City, MaritalStatus } from 'src/app/core/models/data-master';
import { BeneficiaryType } from 'src/app/core/models/enum';
import { DemographicService } from 'src/app/core/services';
import { genderOpts } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  entityType: FormControl = new FormControl();
  demographicForm: FormGroup;
  loading = false;
  isNew = true;
  demoData: any;
  beneficiaryTypeList: any[] = [];
  genderOpts: any[] = genderOpts;
  selectedGender: any;
  cityList: City[] = [];
  maritalStatusList: MaritalStatus[] = [];

  constructor(
    private messageService: MessageService,
    private demographicService: DemographicService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.demographicForm = this._fb.group({
      id: [null],
      beneficiary: [null],
      idNumber: [null, [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      fullName: [null, [Validators.required, Validators.minLength(3)]],
      gender: [null],
      address: [null, [Validators.required, Validators.minLength(3)]],
      birthDate: [null, Validators.required],
      city: [null, Validators.required],
      maritalStatus: [null],
      spouseName: [null],
      employmentHistory: [null],
      phoneNumber: [null, [Validators.required, , Validators.minLength(3)]],
    });

    this.demoData = this.route.snapshot.data['demoData'];

    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);
    this.maritalStatusList = this.mapToIdAndName(this.route.snapshot.data['maritalStatusListResolve']._embedded.maritalStatus);
    this.beneficiaryTypeList = this.mapToIdAndName(this.route.snapshot.data['beneficiaryListResolve']._embedded.beneficiaries);

    if (this.demoData) {
      this.mapFormData(this.demoData);
    }
  }

  /**
   * Initializes the component by setting up form value change subscriptions.
   * If the form is not new, subscribes to changes in the entityType form control
   * to patch both the personForm and businessForm with demoData. Additionally,
   * sets up a subscription for the 'useGuarantee' form control to dynamically
   * add or remove the 'guarantee' form control based on its value.
   */

  ngOnInit() {
    if (!this.isNew) {
      this.entityType.valueChanges.subscribe(value => {
        this.demographicForm.patchValue(this.demoData);
      });
    }
  }

  /**
   * Handles changes to the beneficiary dropdown selection.
   * If the selected beneficiary type is 'individual', the gender field is set as required.
   * Otherwise, the gender field validators are cleared and the value is reset to null.
   * @param event The dropdown change event containing the selected beneficiary value.
   */
  beneficiaryChanges(event: any): void {
    const beneficiary = event?.value;
    if (!beneficiary?.name || typeof beneficiary.name !== 'string') return;

    const genderControl = this.demographicForm.get('gender');
    if (!genderControl) return;

    const isIndividual = beneficiary.name.toLowerCase() === BeneficiaryType.individual.toLowerCase();

    if (isIndividual) {
      genderControl.setValidators(Validators.required);
    } else {
      genderControl.clearValidators();
      genderControl.setValue(null);
    }

    genderControl.updateValueAndValidity();
  }

  /**
   * Maps the demographic object from the backend to the form controls.
   * @param form The demographic object to be mapped.
   */
  mapFormData(form: any) {
    this.isNew = false;

    form.city = {
      id: form.city.id,
      name: form.city.name,
    }

    if (form.beneficiary.name === BeneficiaryType.individual) {
      form.beneficiary = {
        id: form.beneficiary.id,
        name: form.beneficiary.name,
      }

      form.maritalStatus = {
        id: form.maritalStatus.id,
        name: form.maritalStatus.name,
      }
    }


    const birthDate = new Date(form.birthDate);

    this.demographicForm.patchValue(form);
    this.demographicForm.get('birthDate')?.setValue(birthDate);
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
      formData.birthDate = new Date(formData.birthDate).toISOString().split('T')[0]; // Extracts 'yyyy-MM-dd'

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
