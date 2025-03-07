import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { City, Institution, MaritalStatus } from 'src/app/core/models/data-master';
import { BeneficiaryType } from 'src/app/core/models/enum';
import { DemographicService } from 'src/app/core/services';
import { entityTypeOpts, genderOpts } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  entityType: FormControl = new FormControl();
  personForm: FormGroup;
  businessForm: FormGroup;
  loading = false;
  isNew = true;
  demoData: any;
  entityTypeList = entityTypeOpts;
  person = BeneficiaryType.individual.toLowerCase();
  business = BeneficiaryType.company.toLowerCase();
  genderOpts: any[] = genderOpts;
  selectedGender: any;
  cityList: City[] = [];
  institutionList: Institution[] = [];
  maritalStatusList: MaritalStatus[] = [];

  constructor(
    private messageService: MessageService,
    private demographicService: DemographicService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.personForm = this._fb.group({
      id: [''],
      type: [BeneficiaryType.individual.toUpperCase()],
      idNumber: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      city: [undefined, Validators.required],
      maritalStatus: [undefined],
      spouseName: [''],
      employmentHistory: [undefined],
      phoneNumber: ['', [Validators.required, , Validators.minLength(3)]],
      // guarantee: this._fb.group({
      //   id: [''],
      //   fullName: ['', [Validators.required, Validators.minLength(3)]],
      //   electoralNumber: ['', [Validators.required, Validators.minLength(1)]],
      //   birthDate: ['', Validators.required],
      //   city: [undefined, Validators.required],
      //   employmentHistory: [undefined, Validators.required],
      // })
    });

    this.businessForm = this._fb.group({
      id: [''],
      type: [BeneficiaryType.company.toUpperCase()],
      idNumber: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      city: [undefined, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.demoData = this.route.snapshot.data['demoData'];

    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);
    this.institutionList = this.mapToIdAndName(this.route.snapshot.data['institutionsListResolve']._embedded.institutions);
    this.maritalStatusList = this.mapToIdAndName(this.route.snapshot.data['maritalStatusListResolve']._embedded.maritalStatus);

    if (this.demoData) {
      this.isNew = false;
      // this.entityType.disable();

      this.demoData.city = {
        id: this.demoData.city.id,
        name: this.demoData.city.name,
      }

      if (this.demoData.type === BeneficiaryType.company.toUpperCase()) {
        this.entityType.setValue(BeneficiaryType.company.toLowerCase());
        this.businessForm.patchValue(this.demoData);
        this.businessForm.get('birthDate')?.setValue(new Date(this.demoData.birthDate));
      } else {
        this.entityType.setValue(BeneficiaryType.individual.toLowerCase());
        this.demoData.maritalStatus = {
          id: this.demoData.maritalStatus.id,
          name: this.demoData.maritalStatus.name,
        }
        this.demoData.employmentHistory = {
          id: this.demoData.employmentHistory.id,
          name: this.demoData.employmentHistory.name,
        }
        this.personForm.get('birthDate')?.setValue(new Date(this.demoData.birthDate));
        this.personForm.patchValue(this.demoData);
      }
    }
  }

  ngOnInit() {
    if (!this.isNew) {
      this.entityType.valueChanges.subscribe(value => {
        this.personForm.patchValue(this.demoData);
        this.businessForm.patchValue(this.demoData);
      });
    }
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

      // For Guarantee
      // if (formData.type === EntityType.person.toUpperCase()) {
      //   formData.guarantee.birthDate = new Date(formData.guarantee.birthDate).toISOString().split('T')[0];
      // }


      this.demographicService.save(formData).subscribe({
        next: (response) => {
          this.setNotification(true, response);
        },
        error: (error) => {
          this.loading = false;
          this.setNotification(false, null, error);
        },
        complete: () => {
          this.personForm.reset();
          this.businessForm.reset();
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
