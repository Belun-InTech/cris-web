import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreditFilter } from 'src/app/core/models/data';
import { City, CreditClassification, FinancialInstitution, Sector } from 'src/app/core/models/data-master';
import { FileExportService, ReportService } from 'src/app/core/services';
import { beneficiaryTypeOpts, genderOpts, tipuRelatoriuList, yearsList } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  reportForm: FormGroup;
  tipuRelatoriuOpts = tipuRelatoriuList;
  selectedTipuRelatoriu: any;
  yearsOpts = yearsList;
  yearForm = new FormControl();
  hideClearButton = true;
  defaultFormValue: any;
  dataReports: any[] = [];
  creditFilter: CreditFilter;
  assetClassificationForm: FormGroup;
  sectorForm: FormGroup;
  assetClassificationList: CreditClassification[] = [];
  cityList: City[] = [];
  financialInstitutionList: FinancialInstitution[] = [];
  sectorList: Sector[] = [];
  genderList: any[] = genderOpts;
  beneficiaryList: any[] = beneficiaryTypeOpts;
  columnsAsset = ['Credit Grantor', 'Asset Classification', 'ID Number / TIN', 'Name', 'Beneficiary', 'DOB', 'Gender', 'City', 'DateAcctOpened', 'Due Date', 'OrgBalance', 'Monthly Payment', 'Last Payment (Date)', 'Balance', 'CreditBySector', 'Manner of Payment', 'Security', 'DescOfCollaterlal'];

  constructor(
    private _fb: FormBuilder,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private excelService: FileExportService,
  ) {
    this.reportForm = this._fb.group({
      tipu: [null, [Validators.required]],
      assetClassId: [null],
      grantorId: [null],
      lastPaymentrangeDate: [null],
      demographicBeneficiary: [null],
      demographicCityId: [null],
      demographicGender: [null],
      sectorId: [null],
    });

    this.defaultFormValue = this.reportForm.value;

    this.financialInstitutionList = this.route.snapshot.data['financialInstitutionListResolve']._embedded.financialInstitutions;
    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);
    this.sectorList = this.route.snapshot.data['sectorListResolve']._embedded.sectors;
    this.assetClassificationList = this.route.snapshot.data[`creditClassificationListResolve`]._embedded['creditClassifications'];
  }

  ngOnInit(): void {
    this.reportForm.valueChanges.subscribe((item) => {
      this.selectedTipuRelatoriu = this.reportForm.get('tipu').value;

      const keys = Object.keys(this.defaultFormValue);
      const areEqual = keys.every(key => this.defaultFormValue[key] === item[key]);
      this.hideClearButton = areEqual;

    });
  }


  generateReport(form: FormGroup) {
    this.creditFilter = {
      grantorId: form.value.grantorId ? form.value.grantorId.id : null,
      assetClassId: form.value.assetClassId ? form.value.assetClassId.id : null,
      lastPaymentDateFrom: form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[0] : null,
      lastPaymentDateTo: form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[1] : null,
      demographicBeneficiary: form.value.demographicBeneficiary ? form.value.demographicBeneficiary.value : null,
      demographicCityId: form.value.demographicCityId ? form.value.demographicCityId.id : null,
      demographicGender: form.value.demographicGender ? form.value.demographicGender.value : null,
      sectorId: form.value.sectorId ? form.value.sectorId.id : null,
    }
    this.reportService.getCreditsReport(this.creditFilter).subscribe({
      next: (res) => {
        this.dataReports = res;
      }
    });
  }

  exportToExcel(): void {
    const mappedData = this.dataReports.map(item => ({
      "Credit Grantor": item.grantor.name,
      "Asset Classification": item.assetClass.name,
      "ID Number / TIN": item.idNumber,
      "Name": item.demographic.fullName,
      "Beneficiary": item.demographic.beneficiary,
      "DOB": item.demographic.birthDate,  // adjust according to your actual property names
      "Gender": item.demographic.gender,
      "City": item.demographic.city.name,
      "DateAcctOpened": item.accountCreationDate,
      "Due Date": item.dueDate,
      "OrgBalance": item.originalBalance,
      "Monthly Payment": item.monthlyPayment,
      "Last Payment (Date)": item.lastPaymentDate,
      "Balance": item.balance,
      "CreditBySector": item.sector.name,
      "Manner of Payment": item.mannerOfPayment.name,
      "Security": item.security.name,
      "DescOfCollaterlal": item.descriptionSecurity
    }));

    this.excelService.exportToExcel(mappedData, this.reportForm.get('tipu').value.name);
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
