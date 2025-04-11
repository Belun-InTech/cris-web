import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreditFilter, DemographicFilter, Log, LogFilter } from 'src/app/core/models/data';
import { City, CreditClassification, FinancialInstitution, Sector } from 'src/app/core/models/data-master';
import { FileExportService, ReportService } from 'src/app/core/services';
import { beneficiaryTypeOpts, genderOpts, operatorOpts, tipuRelatoriuList, yearsList } from 'src/app/core/utils/global-types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService],
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
  demoFilter: DemographicFilter;
  logFilter: LogFilter;
  assetClassificationForm: FormGroup;
  sectorForm: FormGroup;
  assetClassificationList: CreditClassification[] = [];
  cityList: City[] = [];
  financialInstitutionList: FinancialInstitution[] = [];
  sectorList: Sector[] = [];
  genderList: any[] = genderOpts;
  beneficiaryList: any[] = beneficiaryTypeOpts;
  operatorList: any[] = operatorOpts;
  columnsAsset = ['NameCreditGrantor', 'AssetClass', 'ElectNo', 'Name', 'Beneficiary', 'DOB', 'Gender', 'City', 'DateAcctOpened', 'DueDate', 'OrgBalance', 'MonthlyPaymt', 'DateLastPaymt', 'Balance', 'CreditBySector', 'MannerOfPaymt', 'Security', 'DescOfCollaterlal'];
  columnsSector = ['NameCreditGrantor', 'CreditBySector', 'ElectNo', 'Name', 'Beneficiary', 'DOB', 'Gender', 'City', 'DateAcctOpened', 'DueDate', 'OrgBalance', 'MonthlyPaymt', 'DateLastPaymt', 'Balance', 'MannerOfPaymt', 'Security', 'DescOfCollaterlal', 'AssetClass'];
  columnsCredit = ['NameCreditGrantor', 'ElectNo', 'Name', 'Beneficiary', 'DOB', 'Gender', 'City', 'DateAcctOpened', 'DueDate', 'OrgBalance', 'MonthlyPaymt', 'DateLastPaymt', 'Balance', 'CreditBySector', 'MannerOfPaymt', 'Security', 'DescOfCollaterlal', 'AssetClass', 'Guarantee Name', 'ElectNo (Guarantee)', 'DOB (Guarantee)', 'City (Guarantee)', 'EmpHist (Guarantee)'];
  columnsDemographic = ['Name', 'Beneficiary', 'ElectNo', 'Gender', 'Address - City', 'DOB', 'PhoneNumber', 'MaritalStatus', 'SpouseName', 'EmploymentHistory'];
  columnsLogs = ['LoginName', 'FullName', 'FinancialInstitution', 'ActionTaken', 'SearchingFee', 'Date', 'Time'];

  constructor(
    private _fb: FormBuilder,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private excelService: FileExportService,
    private messageService: MessageService,
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
      originalBalance: [null],
      mathOperator: [null],
      getGuarantee: [false],
      financialInstitutionId: [null],
      fromDate: [null],
      toDate: [null]
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
      this.dataReports = [];
    });
  }



  /**
   * Generates a report based on the selected report type and form values.
   * Clears previous messages before generating the report. Depending on the
   * `selectedTipuRelatoriu.code`, different filters are applied to fetch the
   * appropriate report data using the report service.
   *
   * @param form The FormGroup containing the report filter criteria.
   *
   * The cases:
   * - 'demo': Fetches demographic report data using demographic filter criteria.
   * - 'asset', 'sector', 'credit': Fetches credit report data using credit filter criteria.
   * - 'logs': Fetches log activities report data using log filter criteria.
   *
   * Adds an informational message if no data is available for the selected report.
   */

  generateReport(form: FormGroup) {
    this.messageService.clear();

    switch (this.selectedTipuRelatoriu.code) {
      case 'demo':
        this.demoFilter = {
          beneficiary: form.value.demographicBeneficiary ? form.value.demographicBeneficiary.value : null,
          financialInstitutionId: form.value.grantorId ? form.value.grantorId.id : null,
          gender: form.value.demographicGender ? form.value.demographicGender.value : null,
          cityId: form.value.demographicCityId ? form.value.demographicCityId.id : null,
        }
        this.reportService.getDemographicReport(this.demoFilter).subscribe({
          next: (res) => {
            this.dataReports = res;
            this.messageService.add({ severity: 'info', summary: 'No Data!', detail: 'No data available for the selected report.' })
          }
        });
        break;
      case 'asset':
      case 'sector':
      case 'credit':
        this.creditFilter = {
          grantorId: form.value.grantorId ? form.value.grantorId.id : null,
          assetClassId: form.value.assetClassId ? form.value.assetClassId.id : null,
          lastPaymentDateFrom: form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[0] : null,
          lastPaymentDateTo: form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[1] : null,
          demographicBeneficiary: form.value.demographicBeneficiary ? form.value.demographicBeneficiary.value : null,
          demographicCityId: form.value.demographicCityId ? form.value.demographicCityId.id : null,
          demographicGender: form.value.demographicGender ? form.value.demographicGender.value : null,
          sectorId: form.value.sectorId ? form.value.sectorId.id : null,
          originalBalance: form.value.originalBalance ? form.value.originalBalance : null,
          mathOperator: form.value.mathOperator ? form.value.mathOperator.value : null,
          getGuarantee: form.value.getGuarantee
        }
        this.reportService.getCreditsReport(this.creditFilter).subscribe({
          next: (res) => {
            this.dataReports = res;
            this.messageService.add({ severity: 'info', summary: 'No Data!', detail: 'No data available for the selected report.' })
          }
        });
        break;
      case 'logs':
        this.logFilter = {
          financialInstitutionId: form.value.grantorId ? form.value.grantorId.id : null,
          fromDate: form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[0] : null,
          toDate: null,
        }
        const toDate: Date = form.value.lastPaymentrangeDate ? form.value.lastPaymentrangeDate[1] : null;
        if (toDate) {
          toDate.setHours(23, 59, 59, 0);
          this.logFilter.toDate = toDate;
        }
        this.reportService.getLogActivitiesReport(this.logFilter).subscribe({
          next: (res) => {
            this.dataReports = res;
            this.messageService.add({ severity: 'info', summary: 'No Data!', detail: 'No data available for the selected report.' })
          }
        });
        break;
    }
  }

  /**
   * Export the report data to an Excel file based on the selected
   * tipuRelatoriu.
   * @param selectedTipuRelatoriu The selected tipuRelatoriu.
   */
  exportToExcel(selectedTipuRelatoriu: any): void {

    switch (selectedTipuRelatoriu.code) {
      case 'asset':
        this.exportAssetReport();
        break;
      case 'sector':
        this.exportSectorReport();
        break;
      case 'credit':
        this.exportCreditReport();
        break;
      case 'demo':
        this.exportDemographicReport();
        break;
      case 'logs':
        this.exportLogsActivitiesReport();
        break;
    }
  }


  /**
   * Exports the asset classification report to an Excel file.
   *
   * Maps the dataReports to a custom set of columns and calculates totals
   * for OrgBalance and Balance. A totals row is created and added to the
   * end of the data. The report name is retrieved from the form and the data
   * is exported to an Excel file using the excelService.
   */
  private exportAssetReport(): void {
    // Map the data to custom columns.
    const mappedData = this.dataReports.map(item => ({
      "NameCreditGrantor": item.grantor.name,
      "AssetClass": item.assetClass.name,
      "ElectNo": item.idNumber,
      "Name": item.demographic.fullName,
      "Beneficiary": item.demographic.beneficiary,
      "DOB": item.demographic.birthDate,
      "Gender": item.demographic.gender,
      "City": item.demographic.city.name,
      "DateAcctOpened": item.accountCreationDate,
      "DueDate": item.dueDate,
      "OrgBalance": Number(item.originalBalance),  // Convert to number for summing
      "MonthlyPaymt": item.monthlyPayment,
      "DateLastPaymt": item.lastPaymentDate,
      "Balance": Number(item.balance),             // Convert to number for summing
      "CreditBySector": item.sector.name,
      "MannerOfPaymt": item.mannerOfPayment.name,
      "Security": item.security.name,
      "DescOfCollaterlal": item.descriptionSecurity
    }));

    // Calculate totals for OrgBalance and Balance.
    const totalOrgBalance = mappedData.reduce((sum, record) => sum + record["OrgBalance"], 0);
    const totalBalance = mappedData.reduce((sum, record) => sum + record["Balance"], 0);

    // Create a totals row.
    const totalsRow = {
      "NameCreditGrantor": "Total",
      "AssetClass": null,
      "ElectNo": null,
      "Name": null,
      "Beneficiary": null,
      "DOB": null,
      "Gender": null,
      "City": null,
      "DateAcctOpened": null,
      "DueDate": null,
      "OrgBalance": totalOrgBalance,
      "MonthlyPaymt": null,
      "DateLastPaymt": null,
      "Balance": totalBalance,
      "CreditBySector": null,
      "MannerOfPaymt": null,
      "Security": null,
      "DescOfCollaterlal": null
    };

    // Push the totals row at the end.
    mappedData.push(totalsRow);

    // Get the report name from the form and export the data.
    const reportName = this.reportForm.get('tipu').value.name;
    this.excelService.exportToExcel(mappedData, reportName);
  }

  /**
   * Exports the sector report data to an Excel file.
   * 
   * This method maps the `dataReports` to a custom structure that includes
   * various demographic and financial details. It calculates the totals for
   * `OrgBalance` and `Balance`, then appends a total row with these sums to 
   * the mapped data. Finally, it exports the data as an Excel file using
   * `excelService`.
   */
  private exportSectorReport(): void {
    // Map the data to custom columns.
    const mappedData = this.dataReports.map(item => ({
      "NameCreditGrantor": item.grantor.name,
      "CreditBySector": item.sector.name,
      "ElectNo": item.idNumber,
      "Name": item.demographic.fullName,
      "Beneficiary": item.demographic.beneficiary,
      "DOB": item.demographic.birthDate,
      "Gender": item.demographic.gender,
      "City": item.demographic.city.name,
      "DateAcctOpened": item.accountCreationDate,
      "DueDate": item.dueDate,
      "OrgBalance": Number(item.originalBalance),  // Convert to number for summing
      "MonthlyPaymt": item.monthlyPayment,
      "DateLastPaymt": item.lastPaymentDate,
      "Balance": Number(item.balance),             // Convert to number for summing
      "MannerOfPaymt": item.mannerOfPayment.name,
      "Security": item.security.name,
      "DescOfCollaterlal": item.descriptionSecurity,
      "AssetClass": item.assetClass.name,
    }));

    // Calculate totals for OrgBalance and Balance.
    const totalOrgBalance = mappedData.reduce((sum, record) => sum + record["OrgBalance"], 0);
    const totalBalance = mappedData.reduce((sum, record) => sum + record["Balance"], 0);

    // Create a totals row.
    const totalsRow = {
      "NameCreditGrantor": "Total",
      "CreditBySector": null,
      "ElectNo": null,
      "Name": null,
      "Beneficiary": null,
      "DOB": null,
      "Gender": null,
      "City": null,
      "DateAcctOpened": null,
      "DueDate": null,
      "OrgBalance": totalOrgBalance,
      "MonthlyPaymt": null,
      "DateLastPaymt": null,
      "Balance": totalBalance,
      "MannerOfPaymt": null,
      "Security": null,
      "DescOfCollaterlal": null,
      "AssetClass": null,
    };

    // Push the totals row at the end.
    mappedData.push(totalsRow);

    // Get the report name from the form and export the data.
    const reportName = this.reportForm.get('tipu').value.name;
    this.excelService.exportToExcel(mappedData, reportName);
  }

  /**
   * Exports the credit report to an Excel file.
   * Maps the dataReports to a custom set of columns and calculates totals
   * for OrgBalance and Balance. A totals row is created and added to the
   * end of the data. The report name is retrieved from the form and the data
   * is exported to an Excel file using the excelService.
   * @param useGuarantee If true, guarantee columns are added to the report.
   */
  private exportCreditReport(): void {
    let useGuarantee = this.reportForm.get('getGuarantee').value;

    let mappedData: any[], totalsRow: any;

    // Map the data to custom columns.
    mappedData = this.dataReports.map(item => ({
      "NameCreditGrantor": item.grantor.name,
      "ElectNo": item.idNumber,
      "Name": item.demographic.fullName,
      "Beneficiary": item.demographic.beneficiary,
      "DOB": item.demographic.birthDate,
      "Gender": item.demographic.gender,
      "City": item.demographic.city.name,
      "DateAcctOpened": item.accountCreationDate,
      "DueDate": item.dueDate,
      "OrgBalance": Number(item.originalBalance),
      "MonthlyPaymt": item.monthlyPayment,
      "DateLastPaymt": item.lastPaymentDate,
      "Balance": Number(item.balance),
      "CreditBySector": item.sector.name,
      "MannerOfPaymt": item.mannerOfPayment.name,
      "Security": item.security.name,
      "DescOfCollaterlal": item.descriptionSecurity,
      "AssetClass": item.assetClass.name,
      "Guarantee": item.guarantee,
    }));

    // Calculate totals for OrgBalance and Balance.
    const totalOrgBalance = mappedData.reduce((sum: any, record: { [x: string]: any; }) => sum + record["OrgBalance"], 0);
    const totalBalance = mappedData.reduce((sum: any, record: { [x: string]: any; }) => sum + record["Balance"], 0);

    // Create a totals row.
    totalsRow = {
      "NameCreditGrantor": "Total",
      "ElectNo": null,
      "Name": null,
      "Beneficiary": null,
      "DOB": null,
      "Gender": null,
      "City": null,
      "DateAcctOpened": null,
      "DueDate": null,
      "OrgBalance": totalOrgBalance,
      "MonthlyPaymt": null,
      "DateLastPaymt": null,
      "Balance": totalBalance,
      "CreditBySector": null,
      "MannerOfPaymt": null,
      "Security": null,
      "DescOfCollaterlal": null,
      "AssetClass": null,
    };
    // If guarantee data is selected, add extra guarantee columns.
    if (useGuarantee) {
      mappedData.forEach((value) => {
        // Check for the guarantee object using the key "Guarantee"
        if (value.Guarantee) {
          value['Guarantee Name'] = value.Guarantee.fullName || '';
          value['ElectNo (Guarantee)'] = value.Guarantee.electoralNumber || '';
          value['DOB (Guarantee)'] = value.Guarantee.birthDate || '';
          // Use optional chaining for nested properties
          value['City (Guarantee)'] = value.Guarantee.city?.name || '';
          value['EmpHist (Guarantee)'] = value.Guarantee.employmentHistory || '';
        } else {
          // Ensure all rows have these keys so that the columns appear
          value['Guarantee Name'] = '';
          value['ElectNo (Guarantee)'] = '';
          value['DOB (Guarantee)'] = '';
          value['City (Guarantee)'] = '';
          value['EmpHist (Guarantee)'] = '';
        }
        delete value.Guarantee;
      });
    } else {
      // Ensure guarantee columns are removed if not in use
      mappedData.forEach((value) => {
        delete value.Guarantee;
        delete value['Guarantee Name'];
        delete value['ElectNo (Guarantee)'];
        delete value['DOB (Guarantee)'];
        delete value['City (Guarantee)'];
        delete value['EmpHist (Guarantee)'];
      });
    }

    // Push the totals row at the end.
    mappedData.push(totalsRow);

    // Get the report name from the form and export the data.
    const reportName = this.reportForm.get('tipu').value.name;
    this.excelService.exportToExcel(mappedData, reportName);
  }


  /**
   * Exports the demographic report to an Excel file.
   *
   * Maps the dataReports to a custom set of columns representing
   * demographic information such as name, beneficiary, electoral number,
   * date of birth, gender, address, city, phone number, marital status,
   * spouse name, and employment history. The report name is retrieved
   * from the form and the data is exported to an Excel file using the
   * excelService.
   */
  private exportDemographicReport(): void {

    let mappedData: any[], totalsRow: any;

    // Map the data to custom columns.
    mappedData = this.dataReports.map(item => ({
      "Name": item.fullName,
      "Beneficiary": item.beneficiary,
      "ElectNo": item.idNumber,
      "DOB": item.birthDate,
      "Gender": item.gender,
      "Address": item.address,
      "City": item.city.name,
      "PhoneNumber": item.phoneNumber,
      "MaritalStatus": item.maritalStatus.name,
      "SpouseName": item.spouseName,
      "EmploymentHistory": item.employmentHistory,
    }));

    // Get the report name from the form and export the data.
    const reportName = this.reportForm.get('tipu').value.name;
    this.excelService.exportToExcel(mappedData, reportName);
  }

  /**
   * Exports the logs activities report to an Excel file.
   *
   * Maps the dataReports to a custom set of columns representing the
   * login name, full name, financial institution name, action taken,
   * searching fee, date, and time for each log activity. The report
   * name is retrieved from the form and the data is exported to an
   * Excel file using the excelService. A totals row is calculated and
   * added to the end of the data with the total searching fee.
   */
  private exportLogsActivitiesReport(): void {

    let mappedData: any[], totalsRow: any;

    // Map the data to custom columns.
    mappedData = this.dataReports.map((item: Log) => ({
      "LoginName": item.user.username,
      "FullName": `${item.user.firstName} ${item.user.lastName}`,
      "FinancialInstitution": item.financialInstitution.name,
      "ActionTaken": item.operation,
      "SearchingFee": 0.5,
      "Date": formatDate(new Date(item.timestamp), 'yyyy-MM-dd', 'en-US'),
      "Time": formatDate(new Date(item.timestamp), 'HH:mm:ss', 'en-US'),
    }));

    const totalFee = mappedData.reduce((sum, record) => sum + record["SearchingFee"], 0);

    totalsRow = {
      "LoginName": 'Total',
      "FullName": null,
      "FinancialInstitution": null,
      "ActionTaken": null,
      "SearchingFee": totalFee,
      "Date": null,
      "Time": null,
    }

    mappedData.push(totalsRow);

    // Get the report name from the form and export the data.
    const reportName = this.reportForm.get('tipu').value.name;
    this.excelService.exportToExcel(mappedData, reportName);
  }
  // columnsLogs = ['LoginName', 'FullName', 'FinancialInstitution', 'ActionTaken', 'SearchingFee', 'Date', 'Time'];

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

  /**
   * Clears the form and resets the data table.
   *
   * This method is called when the user clicks the "Clear" button.
   * It resets the form values and clears the data table.
   */
  clearFilter(): void {
    this.reportForm.reset();
    this.reportForm.patchValue({
      tipu: null,
      assetClassId: null,
      grantorId: null,
      lastPaymentrangeDate: null,
      demographicBeneficiary: null,
      demographicCityId: null,
      demographicGender: null,
      sectorId: null,
      originalBalance: null,
      mathOperator: null,
      getGuarantee: false
    });
    this.dataReports = [];
  }


}
