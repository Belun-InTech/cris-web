import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CreditClassification, FinancialInstitution, MannerPayment, Sector, TypeCollateral } from 'src/app/core/models/data-master';
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

  constructor(
    private messageService: MessageService,
    private service: CreditService,
    protected _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    });

    this.financialInsititutionList = this.mapToIdAndName(this.route.snapshot.data['grantorListResolve']._embedded.financialInstitutions.filter(item => item.name.toLowerCase() !== 'internal'));
    this.sectorList = this.mapToIdAndName(this.route.snapshot.data['sectorListResolve']._embedded.sectors);
    this.mannerList = this.mapToIdAndName(this.route.snapshot.data['mannerListResolve']._embedded.manners);
    this.typeCollateralList = this.mapToIdAndName(this.route.snapshot.data['typeCollateralListResolve']._embedded.typeCollateral);
    this.creditClassificationList = this.mapToIdAndName(this.route.snapshot.data['creditClassificationListResolve']._embedded.creditClassifications);

    // this.creditForm.setValue({
    //   id: null,
    //   idNumber: '123456789',
    //   grantor: { id: 2, name: 'Banco Nacional do Comercio de Timor-Leste', description: '' },
    //   accountCreationDate: new Date('2025-01-01'),
    //   dueDate: new Date('2025-01-01'),
    //   originalBalance: 10000,
    //   monthlyPayment: 300,
    //   lastPaymentDate: new Date('2025-01-01'),
    //   balance: 5000,
    //   sector: {
    //     id: 3,
    //     name: "Manufacturing", description: 'Manufacturing'
    //   },
    //   mannerOfPayment: { id: 1, name: 'Monthly', description: '' },
    //   security: { id: 1, name: 'Salary', description: '' },
    //   descriptionSecurity: 'Car - Toyota Hilux',
    //   assetClass: { id: 2, name: 'Under Supervision', description: '' }
    // });

    this.creditData = this.route.snapshot.data['creditResolve']
    console.log(this.creditData);
    if (this.creditData) {
      this.mapCreditToForm(this.creditData);
    }

  }

  ngOnInit() {

  }

  mapCreditToForm(credit: any) {
    this.isNew = false;
    this.creditForm.setValue({
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
  }

  save(form: FormGroup) {
    console.log(form.value);

    this.loading = true;
    this.service.save(form.value).subscribe({
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
        setTimeout(() => this.messageService.clear(), 3000)
      }
    });
  }

  update(form: FormGroup) {
    this.loading = true;
    this.service.updateById(this.creditData.id, form.value).subscribe({
      next: (response) => {
        this.setNotification(true, response);
      },
      error: (error) => {
        this.loading = false;
        this.setNotification(false, null, error);
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => this.messageService.clear(), 3000)
      }
    });
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
}
