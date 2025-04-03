import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { City, CreditClassification, FinancialInstitution, Institution, MannerPayment, Sector, TypeCollateral } from 'src/app/core/models/data-master';
import { AuthenticationService } from 'src/app/core/services';
import { CreditService } from 'src/app/core/services/credit.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  creditForm: FormGroup;
  loading = false;
  isNew = true;
  creditData: any;
  financialInsititutionList: FinancialInstitution[] = [];
  sectorList: Sector[] = [];
  mannerList: MannerPayment[] = [];
  typeCollateralList: TypeCollateral[] = [];
  creditClassificationList: CreditClassification[] = [];
  cityList: City[] = [];

  constructor(
    private messageService: MessageService,
    private service: CreditService,
    protected _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
    this.creditForm = this._fb.group({
      id: [undefined],
      idNumber: [undefined, Validators.required],
      grantor: [undefined, Validators.required],
      accountCreationDate: [undefined, Validators.required],
      dueDate: [undefined, Validators.required],
      originalBalance: [undefined, [Validators.required]],
      monthlyPayment: [undefined, Validators.required],
      lastPaymentDate: [undefined, Validators.required],
      balance: [undefined, Validators.required],
      sector: [undefined, Validators.required],
      mannerOfPayment: [undefined, Validators.required],
      security: [undefined, Validators.required],
      descriptionSecurity: [''],
      assetClass: [undefined, Validators.required],
      useGuarantee: [undefined, Validators.required],
    });

    this.financialInsititutionList = this.mapToIdAndName(this.route.snapshot.data['grantorListResolve']._embedded.financialInstitutions.filter(item => item.name.toLowerCase() !== 'internal'));
    this.sectorList = this.mapToIdAndName(this.route.snapshot.data['sectorListResolve']._embedded.sectors);
    this.mannerList = this.mapToIdAndName(this.route.snapshot.data['mannerListResolve']._embedded.manners);
    this.typeCollateralList = this.mapToIdAndName(this.route.snapshot.data['typeCollateralListResolve']._embedded.typeCollateral);
    this.creditClassificationList = this.mapToIdAndName(this.route.snapshot.data['creditClassificationListResolve']._embedded.creditClassifications);
    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);

    this.creditData = this.route.snapshot.data['creditResolve']
    if (this.creditData) {
      this.mapCreditToForm(this.creditData);
    }

  }

  ngOnInit() {
    this.creditForm.get('useGuarantee').valueChanges.subscribe(value => {
      if (value) {
        this.creditForm.addControl('guarantee', this.createGuaranteeForm());
      } else {
        this.creditForm.removeControl('guarantee');
      }
    });
  }

  mapCreditToForm(credit: any) {
    this.isNew = false;
    this.creditForm.patchValue({
      id: credit.id,
      idNumber: credit.idNumber,
      grantor: { id: credit.grantor.id, name: credit.grantor.name },
      accountCreationDate: new Date(credit.accountCreationDate),
      dueDate: new Date(credit.dueDate),
      originalBalance: credit.originalBalance,
      monthlyPayment: credit.monthlyPayment,
      lastPaymentDate: new Date(credit.lastPaymentDate),
      balance: credit.balance,
      sector: { id: credit.sector.id, name: credit.sector.name },
      mannerOfPayment: { id: credit.mannerOfPayment.id, name: credit.mannerOfPayment.name },
      security: { id: credit.security.id, name: credit.security.name },
      descriptionSecurity: credit.descriptionSecurity,
      assetClass: { id: credit.assetClass.id, name: credit.assetClass.name }
    });

    if (credit.guarantee) {
      this.mapGuarantee(credit.guarantee);
    } else {
      this.creditForm.get('useGuarantee').setValue(false);
    }
  }

  mapGuarantee(guarantee: any) {
    guarantee.city = {
      id: this.creditData.guarantee.city.id,
      name: this.creditData.guarantee.city.name,
    }

    guarantee.birthDate = new Date(guarantee.birthDate);

    this.creditForm.get('useGuarantee').setValue(true);
    this.creditForm.addControl('guarantee', this.createGuaranteeForm());
    this.creditForm.get('guarantee').patchValue(guarantee);

  }

  save(form: FormGroup) {
    this.loading = true;
    let formData = form.value;

    formData.accountCreationDate = this.formatDate(formData.accountCreationDate);
    formData.dueDate = this.formatDate(formData.dueDate);
    formData.lastPaymentDate = this.formatDate(formData.lastPaymentDate);

    this.service.save(formData).subscribe({
      next: (response) => {
        this.creditForm.reset();
        this.setNotification(true, response);
      },
      error: (error) => {
        this.loading = false;
        this.setNotification(false, null, error);
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => {
          this.messageService.clear();
          this.redirectBack();
        }, 3000)
      }
    });
  }

  update(form: FormGroup) {
    this.loading = true;

    let formData = form.value;

    if (!formData.useGuarantee) {
      formData.guarantee = null;
    }

    formData.accountCreationDate = this.formatDate(formData.accountCreationDate);
    formData.dueDate = this.formatDate(formData.dueDate);
    formData.lastPaymentDate = this.formatDate(formData.lastPaymentDate);

    this.service.updateById(this.creditData.id, formData).subscribe({
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
          this.messageService.clear();
          this.redirectBack();
        }, 3000)
      }
    });
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

  redirectBack(): void {
    if (this.authService.currentRole === 'ROLE_ADMIN') {
      this.router.navigate(['/credit-informations']);
    } else {
      this.router.navigate(['/search']);
    }
  }



  private setNotification(isSuccess: boolean, credit?: any, error?: any) {
    if (this.isNew) {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'Credit Registered Successfully!', detail: `The Credit data ${credit.demographic.idNumber} has been registered.` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'Credit Updated Successfully!', detail: `The Credit data ${credit.demographic.idNumber} informations has been updated` }) :
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

  private formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
}
