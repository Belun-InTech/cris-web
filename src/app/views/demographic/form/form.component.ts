import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { City, Institution, MaritalStatus } from 'src/app/core/models/data-master';
import { BeneficiaryType } from 'src/app/core/models/enum';
import { DemographicService } from 'src/app/core/services';
import { beneficiaryTypeOpts, genderOpts } from 'src/app/core/utils/global-types';

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
  beneficiaryTypeList = beneficiaryTypeOpts;
  individual = BeneficiaryType.individual.toLowerCase();
  company = BeneficiaryType.company.toLowerCase();
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
      beneficiary: [BeneficiaryType.individual.toUpperCase()],
      idNumber: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      city: [undefined, Validators.required],
      maritalStatus: [undefined, Validators.required],
      spouseName: [''],
      employmentHistory: [undefined],
      phoneNumber: ['', [Validators.required, , Validators.minLength(3)]],
      useGuarantee: [undefined, Validators.required],
    });

    this.businessForm = this._fb.group({
      id: [''],
      beneficiary: [BeneficiaryType.company.toUpperCase()],
      idNumber: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      city: [undefined, Validators.required],
      maritalStatus: [undefined, Validators.required],
      employmentHistory: [undefined],
      phoneNumber: ['', [Validators.required, Validators.minLength(3)]],
      useGuarantee: [undefined, Validators.required],
    });

    this.demoData = this.route.snapshot.data['demoData'];

    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);
    this.institutionList = this.mapToIdAndName(this.route.snapshot.data['institutionsListResolve']._embedded.institutions);
    this.maritalStatusList = this.mapToIdAndName(this.route.snapshot.data['maritalStatusListResolve']._embedded.maritalStatus);

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
        this.personForm.patchValue(this.demoData);
        this.businessForm.patchValue(this.demoData);
      });
    }

    this.personForm.get('useGuarantee').valueChanges.subscribe(value => {
      if (value) {
        this.personForm.addControl('guarantee', this.createGuaranteeForm());
      } else {
        this.personForm.removeControl('guarantee');
      }
    });

    this.businessForm.get('useGuarantee').valueChanges.subscribe(value => {
      if (value) {
        this.businessForm.addControl('guarantee', this.createGuaranteeForm());
      } else {
        this.businessForm.removeControl('guarantee');
      }
    });
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
    
    form.employmentHistory = {
      id: form.employmentHistory.id,
      name: form.employmentHistory.name,
    }

    form.maritalStatus = {
      id: form.maritalStatus.id,
      name: form.maritalStatus.name,
    }

    const birthDate = new Date(form.birthDate);

    if (form.beneficiary.toLowerCase() === BeneficiaryType.company.toLowerCase()) {
      this.entityType.setValue(BeneficiaryType.company.toLowerCase());
      this.businessForm.patchValue(form);
      this.businessForm.get('birthDate')?.setValue(birthDate);
    } else {
      this.entityType.setValue(BeneficiaryType.individual.toLowerCase());
      this.personForm.patchValue(form);
      this.personForm.get('birthDate')?.setValue(birthDate);
    }

    if (this.demoData.guarantee) {
      this.mapGuarantee(form.guarantee, form.beneficiary.toLowerCase())
    } else {
      this.personForm.get('useGuarantee').setValue(false);
      this.businessForm.get('useGuarantee').setValue(false);
    }
  }


  /**
   * Maps the guarantee object from the backend to the form controls,
   * and adds the guarantee form control to the person form if it is not already present.
   * @param guarantee The guarantee object to be mapped.
   */
  mapGuarantee(guarantee: any, beneficiaryType: string) {
    guarantee.city = {
      id: this.demoData.guarantee.city.id,
      name: this.demoData.guarantee.city.name,
    }
    guarantee.employmentHistory = {
      id: this.demoData.guarantee.employmentHistory.id,
      name: this.demoData.guarantee.employmentHistory.name,
    }

    guarantee.birthDate = new Date(guarantee.birthDate);

    if (beneficiaryType.toLowerCase() === BeneficiaryType.company.toLowerCase()) {
      this.businessForm.get('useGuarantee').setValue(true);
      this.businessForm.addControl('guarantee', this.createGuaranteeForm());
      this.businessForm.get('guarantee').patchValue(guarantee);
    } else {
      this.personForm.get('useGuarantee').setValue(true);
      this.personForm.addControl('guarantee', this.createGuaranteeForm());
      this.personForm.get('guarantee').patchValue(guarantee);
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

      formData.beneficiary = this.entityType.value;

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
      
      if (!formData.useGuarantee) {
        formData.guarantee = null;
        
      }

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

  createGuaranteeForm() {
    return this._fb.group({
      id: [''],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      electoralNumber: ['', [Validators.required, Validators.minLength(1)]],
      birthDate: ['', Validators.required],
      city: [undefined, Validators.required],
      employmentHistory: [undefined, Validators.required],
    });
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
