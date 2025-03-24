import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CreditExcel } from 'src/app/core/models/data';
import { CreditClassification, Institution, MannerPayment, Sector, TypeCollateral } from 'src/app/core/models/data-master';
import { AuthenticationService } from 'src/app/core/services';
import { CreditService } from 'src/app/core/services/credit.service';
import { read, utils, writeFile } from "xlsx";

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

  /**
   * Event handler for when a file is selected. Gets the selected files,
   * calculates the total size of the files in bytes, and then reads the file
   * to get the JSON data from the Excel file.
   *
   * The JSON data is then modified to convert the birthDate column to a date
   * string.
   *
   * @param event The event object containing the selected files.
   */
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
      this.jsonData = [];
      this.isAttributesValid = true;
      this.messageService.clear();
    }
  }

  /**
   * Map Excel template to CreditExcel object
   * @param data excel data from file upload
   */
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
  }

  /**
   * Validates the credit data attributes of a given row and sets the "valid" property of the row accordingly.
   * If any required fields are missing or invalid, an error message is added to the message service.
   * 
   * @param row The row of credit data to be validated.
   * @param index The index of the row being validated, used for error reporting.
   */

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

  /**
   * Maps the data from the database to the given CreditExcel object and validates it.
   * Searches for matching records in the financial institution, sector, manner of payment,
   * type of collateral, and credit classification lists based on the provided object's properties.
   * If a match is found, updates the object's ID or name fields accordingly.
   * If a match is not found, appends an error message to the errors list.
   * Displays error messages using the message service if there are any errors,
   * marks the object as invalid, and sets the isAttributesValid flag to false.
   * 
   * @param obj The CreditExcel object to map and validate.
   * @param index The index of the object in the dataset, used for error reporting.
   */

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

  /**
   * Saves the given credit data to the server.
   * The given credit data is sent to the server using the CreditService.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed and the component is navigated to the credit information list page after 3 seconds.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * If the form is invalid, an error notification is displayed with the message 'Form is invalid'.
   * @param data The credit data to be sent to the server.
   */
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
          } else {
            this.router.navigate(['/search']);
          }
        }, 3000);
      }
    });
  }

  /**
   * This function will check the given data if it has any missing value.
   * The missing value will be stored in notFoundData variable.
   * It will also display a message to the user.
   * @param data The data to be check.
   */
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

  generateCreditInfoTemplate() {
    // Define the header row
    const header = [
      "NameCreditGrantor", "ElectNo", "DateAcctOpened", "DueDate",
      "OrgBal", "MonthlyPaymt", "DateLastPaymt", "Balance",
      "CreditbySector", "MannerofPaymt", "Security", "DescofCollateral",
      "AssetClass"
    ];

    // Define one row of mock data
    const mockRow = [
      "John Doe", "123456", "2025-01-01", "2025-12-31",
      "1000", "100", "2025-03-01", "900",
      "1", "Overdraft", "Salary", "Description A",
      "Standard"
    ];

    // Combine header and data rows into a 2D array
    const data = [header, mockRow];

    // Create a worksheet from the data array
    const worksheet = utils.aoa_to_sheet(data);

    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Credit Info Template");

    // Write the workbook to a file
    writeFile(workbook, "CreditInfo_Template.xlsx");
  }


  /**
   * Removes a specified item from the jsonData array and displays a success message.
   * 
   * This function filters out the given item from the jsonData array, effectively deleting it.
   * After deletion, a success message is displayed to notify the user.
   * 
   * @param item The item to be removed from the jsonData array.
   */

  deleteJsonData(item: any): void {
    this.jsonData = this.jsonData.filter((val) => val !== item);
    this.messageService.add({ key: 'deleteJson', severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
  }

  /**
   * Determines whether submission is allowed.
   *
   * Submission is only permitted if JSON data has been checked and no missing data is found.
   *
   * @returns {boolean} True if submission is allowed, otherwise false.
   */

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

  /**
   * Handles the removal of a templating file and updates the relevant state.
   *
   * This method is triggered when a user decides to remove a file from the upload list.
   * It performs the following operations:
   * - Clears any existing messages.
   * - Calls the provided callback to remove the file.
   * - Updates the total size and percentage of the uploaded files.
   * - Resets the JSON data and clears messages again.
   *
   * @param {Event} event - The event object associated with the file removal.
   * @param {File} file - The file object to be removed.
   * @param {Function} removeFileCallback - The callback function to execute for removing the file.
   * @param {number} index - The index of the file in the list.
   * @returns {void}
   */

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    this.messageService.clear();
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    this.jsonData = [];
    this.isAttributesValid = true;
    this.messageService.clear();
  }
  /**
   * Clears the uploaded file and resets the total size, total size percent, and
   * JSON data.
   *
   * @param {() => void} clear - A callback function to clear the uploaded file.
   * @returns {void}
   */

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.jsonData = [];
    this.isAttributesValid = true;
    this.messageService.clear();
  }

  /**
   * Displays messages based on whether records are missing in the database.
   * 
   * If no records are missing, a success message is displayed indicating that the data is found in the database.
   * If records are missing, a warning message is displayed indicating that the provided data is not found in the database.
   * 
   * @returns {void}
   */

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


  /**
   * Changes the active tab when a tab index is changed.
   * 
   * @param {number} index - The index of the tab to change to.
   * @returns {void}
   */
  activeIndexChange(index: number) {
    this.activeTab = index
  }


  /**
   * Validates a date string in the format "YYYY-MM-DD".
   * 
   * If the date string is invalid, an error message is displayed and the function returns null.
   * 
   * If the date string is valid, the function returns the date string in the format "YYYY-MM-DD".
   * 
   * @param {string} dateStr - The date string to validate.
   * @param {number} index - The row index of the date string in the Excel file.
   * @returns {string | null} The validated date string or null if invalid.
   */
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

  /**
   * Get the number of days in a given month.
   * @param month - The month (1-12).
   * @param year - The year.
   * @returns The number of days in the given month.
   */
  private getDaysInMonth(month: number, year: number): number {
    const daysInMonth = [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  }


  /**
   * Determines if the given year is a leap year.
   * @param year - The year.
   * @returns True if the given year is a leap year, false otherwise.
   * 
   * A leap year is a year that is divisible by 4, except for end-of-century years which must be divisible by 400.
   * This means that the year 2000 was a leap year, although the years 1700, 1800, and 1900 were not.
   */
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
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
