import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CreditExcel } from 'src/app/core/models/data';
import { CreditClassification, Institution, MannerPayment, Sector, TypeCollateral } from 'src/app/core/models/data-master';
import { AuthenticationService } from 'src/app/core/services';
import { CreditService } from 'src/app/core/services/credit.service';
import { read, utils } from "xlsx";

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrl: './form-upload.component.scss',
  providers: [MessageService],
})
export class FormUploadComponent {
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  jsonData: CreditExcel[] = [];
  columnsExcel: string[];
  columns: string[];
  activeTab = 0;
  isAttributesValid = true;
  financialInsititutionList: Institution[] = [];
  sectorList: Sector[] = [];
  mannerList: MannerPayment[] = [];
  typeCollateralList: TypeCollateral[] = [];
  descriptionSecurity: string;
  creditClassificationList: CreditClassification[] = [];

  disabledTab = true;
  isJsonDataChecked = false;
  isScanning = false;
  isSubmitting = false;

  notFoundData: any[] = [];

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private service: CreditService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
    this.columnsExcel = ['NameCreditGrantor', 'ElectNo', 'DateAcctOpened', 'DueDate', 'OrgBal', 'MonthlyPaymt', 'DateLastPaymt', 'Balance', 'CreditbySector', 'MannerofPaymt', 'Security', 'DescofCollateral', 'AssetClass'];
    this.columns = ['Credit Grantor', 'ID Number / TIN', 'Due Cate', 'Monthly Payment', 'Last Payment (Date)', 'Balance'];
    this.financialInsititutionList = this.mapToIdAndName(this.route.snapshot.data['grantorListResolve']._embedded.financialInstitutions.filter(item => item.name.toLowerCase() !== 'internal'));
    this.sectorList = this.mapToIdAndName(this.route.snapshot.data['sectorListResolve']._embedded.sectors);
    this.mannerList = this.mapToIdAndName(this.route.snapshot.data['mannerListResolve']._embedded.manners);
    this.typeCollateralList = this.mapToIdAndName(this.route.snapshot.data['typeCollateralListResolve']._embedded.typeCollateral);
    this.creditClassificationList = this.mapToIdAndName(this.route.snapshot.data['creditClassificationListResolve']._embedded.creditClassifications);
  }

  ngOnInit(): void {

  }

  onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });

    this.totalSizePercent = this.totalSize / 10;

    if (this.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        this.activeTab = 1;
        this.mapExcelTemplate(utils.sheet_to_json(worksheet, { raw: false }));
      };
      fileReader.readAsArrayBuffer(this.files[0]);
    }
  }

  mapExcelTemplate(data: any): void {
    this.jsonData = data.map((row, index) => {
      let newRow: CreditExcel;

      if (row) {
        newRow = {
          id: undefined,
          grantor: {
            id: undefined,
            name: row['NameCreditGrantor']
          },
          idNumber: row['ElectNo'],
          accountCreationDate: row['DateAcctOpened'],
          dueDate: row['DueDate'],
          originalBalance: row['OrgBal'],
          monthlyPayment: row['MonthlyPaymt'],
          lastPaymentDate: row['DateLastPaymt'],
          balance: row['Balance'],
          sector: {
            id: row['CreditbySector'],
            name: undefined
          },
          mannerOfPayment: {
            id: undefined,
            name: row['MannerofPaymt']
          },
          security: {
            id: undefined,
            name: row['Security']
          },
          descriptionSecurity: row['DescofCollateral'],
          assetClass: {
            id: undefined,
            name: row['AssetClass']
          },
          valid: true
        }
      }

      this.validateCreditData(newRow, index);

      newRow.accountCreationDate = this.showDateValidationMessage(newRow.accountCreationDate, index);
      newRow.dueDate = this.showDateValidationMessage(newRow.dueDate, index);
      newRow.lastPaymentDate = this.showDateValidationMessage(newRow.lastPaymentDate, index);

      this.mappingDataFromDB(newRow, index);

      return newRow;
    });
    console.log(this.jsonData);
  }

  validateCreditData(row: CreditExcel, index: number): void {
    let errors: string[] = [];

    if (!row.grantor.name) {
      errors.push("NameCreditGrantor is required");
    }
    if (!row.idNumber || row.idNumber.toString().length < 1) {
      errors.push("ElecNo is required.");
    }
    if (!row.accountCreationDate) {
      errors.push("DateAccOpened is required");
    }
    if (!row.dueDate) {
      errors.push("DueDate is required");
    }
    if (!row.originalBalance) {
      errors.push("OrgBal is required");
    }
    if (!row.monthlyPayment) {
      errors.push("MonthlyPaymt is required");
    }
    if (!row.lastPaymentDate) {
      errors.push("DateLastPaymt is required");
    }
    if (!row.balance) {
      errors.push("Balance is required");
    }
    if (!row.sector.id) {
      errors.push("CreditbySector is required");
    }
    if (!row.mannerOfPayment.name) {
      errors.push("MannerofPaymt is required");
    }
    if (!row.security.name) {
      errors.push("Security is required");
    }
    // if (!row.descriptionSecurity) {
    //   errors.push("DescofCollateral is required");
    // }
    if (!row.assetClass.name) {
      errors.push("AssetClass is required");
    }

    if (errors.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Data`,
        detail: errors.join(", "),
      });
      row.valid = false;
      this.isAttributesValid = false;
    }
  }

  private mappingDataFromDB(obj: CreditExcel, index: number): void {
    let errors: string[] = [];
    const grantor = this.financialInsititutionList.find(item => item.name.toLowerCase() === obj.grantor.name.toLowerCase());
    const sector = this.sectorList.find(item => item.id === +obj.sector.id);
    const mannerOfPayment = this.mannerList.find(item => item.name.toLowerCase() === obj.mannerOfPayment.name.toLowerCase());
    const security = this.typeCollateralList.find(item => item.name.toLowerCase() === obj.security.name.toLowerCase());
    const assetClass = this.creditClassificationList.find(item => item.name.toLowerCase() === obj.assetClass.name.toLowerCase());


    if (grantor === undefined) {
      errors.push("Grantor is not found.");
    } else {
      obj.grantor.id = grantor.id;
    }

    if (sector === undefined) {
      errors.push("Sector is not found.");
    } else {
      obj.sector.name = sector.name;
    }

    if (mannerOfPayment === undefined) {
      errors.push("Manner of Payment is not found.");
    } else {
      obj.mannerOfPayment.id = mannerOfPayment.id;
    }

    if (security === undefined) {
      errors.push("Security is not found.");
    } else {
      obj.security.id = security.id;
    }

    if (assetClass === undefined) {
      errors.push("Asset Class is not found.");
    } else {
      obj.assetClass.id = assetClass.id;
    }

    if (errors.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Data`,
        detail: errors.join(" "),
      });
      obj.valid = false;
      this.isAttributesValid = false;
    }
  }

  saveCreditData(data: any[]): void {
    this.messageService.clear();
    this.isSubmitting = true;
    this.service.saveAll(data).subscribe({
      next: (response) => {
        this.showSubmitMessages(true, response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showSubmitMessages(false, error);
      },
      complete: () => {
        this.isSubmitting = false;
        setTimeout(() => {
          if (this.authService.currentRole === 'ROLE_ADMIN') {
            this.router.navigate(['/credit-informations']);
          }else {
            this.router.navigate(['/search']);
          }
        }, 3000);
      }
    });
  }

  checkJsonData(data: any[]): void {
    this.messageService.clear();
    this.isScanning = true;

    this.service.checkMissings(data).subscribe({
      next: response => {
        this.notFoundData = response;
        this.showMissingMessages();
      },
      error: err => {
        this.isScanning = false;
      },
      complete: () => {
        this.isJsonDataChecked = true;
        this.isScanning = false;
      }
    });
  }

  deleteJsonData(item: any): void {
    this.jsonData = this.jsonData.filter((val) => val !== item);
    this.messageService.add({ key: 'deleteJson', severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
  }

  allowSubmit(): boolean {
    return this.isJsonDataChecked && this.notFoundData.length === 0;
  }


  choose(event, callback) {
    callback();
  }

  private showSubmitMessages(isSuccess: boolean, error?: any) {
    isSuccess ? this.messageService.add({ severity: 'success', summary: 'Credits data Registered Successfully!', detail: `The data has been registered.` }) :
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }

  /**
   * Converts a given number of bytes into a human-readable format.
   *
   * @param {number} bytes - The number of bytes to be converted.
   * @returns {string} A string containing the formatted size (e.g. 1.23 KB).
   */
  private formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    this.messageService.clear();
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    this.jsonData = [];
    this.messageService.clear();
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.jsonData = [];
    this.messageService.clear();
  }

  showMissingMessages(): void {
    const hasMissingDatabase = this.notFoundData.length > 0;

    if (!hasMissingDatabase) {
      this.messageService.add({
        severity: 'success',
        summary: 'Data is found in database',
        detail: 'The database contains this record.'
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No records found!',
        detail: 'The provided data is not found in the database'
      });
    }
  }

  private showDateValidationMessage(dateStr: string, index: number): string | null {
    // Validate date format (DD-MM-YYYY)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(dateStr)) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Date Format`,
        detail: `The provided date "${dateStr}" is not in the correct format (YYYY-MM-DD).`
      });
      return null;
    }

    // Extract year, month, and day
    const [year, month, day] = dateStr.split("-").map(Number);

    // **Specific Error Handling for Month**
    if (month < 1 || month > 12) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Month`,
        detail: `The month "${month}" in the date "${dateStr}" is invalid. Month must be between 1 and 12.`
      });
      return null;
    }

    // **Specific Error Handling for Day Range**
    const maxDays = this.getDaysInMonth(month, year);
    if (day < 1 || day > maxDays) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Day`,
        detail: `The day "${day}" in the date "${dateStr}" is out of range for month "${month}". Maximum days in this month: ${maxDays}.`
      });
      return null;
    }

    // Convert to "YYYY-MM-DD" format
    const formattedDate = new Date(Date.UTC(year, month - 1, day)).toISOString().split("T")[0];

    return formattedDate;
  }

  private getDaysInMonth(month: number, year: number): number {
    const daysInMonth = [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }


  private mapToIdAndName(array: any[]): { id: number, name: string }[] {
    return array.map(item => {
      return {
        id: item.id,
        name: item.name
      };
    });
  }

}
