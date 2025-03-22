import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DemographicExcel, Guarantee } from 'src/app/core/models/data';
import { City, Institution, MaritalStatus } from 'src/app/core/models/data-master';
import { BeneficiaryType } from 'src/app/core/models/enum';
import { DemographicService } from 'src/app/core/services';
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
  jsonData: DemographicExcel[] = [];
  columnsExcel: string[];
  columns: string[];
  activeTab = 0;
  isAttributesValid = true;
  cityList: City[] = [];
  institutionList: Institution[] = [];
  maritalStatusList: MaritalStatus[] = [];

  disabledTab = true;
  isJsonDataChecked = false;
  jsonDataSize = 50;
  duplicatesData = [];
  duplicatesDataFile = [];
  isScanning = false;
  isSubmitting = false;


  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private demographicService: DemographicService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.columnsExcel = ['Name', 'Electoral Nº/Taxpayer ID (TIN)', 'Beneficiary', 'Date of Birth', 'Gender', 'City - Address', 'Employment History', 'Telephone Nº'];
    this.columns = ['Name', 'Electoral Nº/Taxpayer ID (TIN)', 'Beneficiary', 'Date of Birth', 'Gender', 'City - Address', 'Employment History', 'Telephone Nº', 'Actions'];

    this.cityList = this.mapToIdAndName(this.route.snapshot.data['citiesListResolve']._embedded.cities);
    this.institutionList = this.mapToIdAndName(this.route.snapshot.data['institutionsListResolve']._embedded.institutions);
    this.maritalStatusList = this.mapToIdAndName(this.route.snapshot.data['maritalStatusListResolve']._embedded.maritalStatus);
    console.log(this.institutionList);

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
        this.mapAndValidateExcelTemplate(utils.sheet_to_json(worksheet, { raw: false }));
      };
      fileReader.readAsArrayBuffer(this.files[0]);
      this.jsonData = [];
      this.isAttributesValid = true;
      this.messageService.clear();
    }
  }

  /**
   * Maps and validates the Excel template data into the application's
   * demographic data format. Converts each row of data into a `DemographicExcel`
   * object, checking for the existence of a Guarantee and mapping its details
   * if present. Validates demographic attributes and formats specific fields
   * such as birthDate and gender. Also attempts to map additional data from
   * the database for both the main demographic entry and its Guarantee, if
   * applicable.
   *
   * @param data The raw JSON data extracted from the Excel worksheet.
   */

  mapAndValidateExcelTemplate(data: any): void {
    this.jsonData = data.map((row, index) => {
      let newRow: DemographicExcel;
      if (row) {
        let guarantee = undefined;

        // Check if Guarantee exist
        if (row['Guarantee Name']) {
          guarantee = {
            fullName: row['Guarantee Name'],
            electoralNumber: row['ElectNo (Guarantee)'],
            birthDate: row['DOB (Guarantee)'],
            city: {
              id: undefined,
              name: row['City (Guarantee)'],
            },
            employmentHistory: {
              id: undefined,
              name: row['EmpHist (Guarantee)'],
            }
          }
        }

        newRow = {
          id: undefined,
          fullName: row['Name'],
          idNumber: row['ElectNo'],
          beneficiary: row['Beneficiary'],
          birthDate: row['DOB'],
          gender: row['Gender'],
          maritalStatus: {
            id: undefined,
            name: row['MStatus']
          },
          spouseName: row['SpouseName'],
          city: {
            id: undefined,
            name: row['City']
          },
          address: row['Address'],
          employmentHistory: {
            id: undefined,
            name: row['EmpHist']
          },
          phoneNumber: row['Telephone'],
          valid: true,
          guarantee: guarantee
        };
      }
      this.validateDemographicAttributes(newRow, index);

      if (newRow.birthDate) {
        newRow.birthDate = this.showDateValidationMessage(newRow.birthDate, index);
      }
      if (newRow.gender) {
        newRow.gender = newRow.gender.toLowerCase();
      }

      this.mappingDataFromDB(newRow, index);

      if (newRow.guarantee) {
        this.mappingGuaranteeDataFromDB(newRow, index);
      }
      return newRow;
    });
    console.log(this.jsonData);

  }


  /**
   * Validates the demographic attributes, given a row of data, and sets the "valid" property of the row accordingly.
   * If any of the required fields are empty, an error message is added to the message service.
   * @param row The row of demographic data to be validated.
   * @param index The index of the row being validated, used for error reporting.
   */
  validateDemographicAttributes(row: DemographicExcel, index: number): void {
    let errors: string[] = [];

    if (!row.idNumber || row.idNumber.toString().length < 1) {
      errors.push("ID Number is required.");
    }
    if (!row.fullName) {
      errors.push("Full Name is required.");
    }
    if (!row.beneficiary) {
      errors.push("Beneficiary is required.");
    }
    if (!row.gender) {
      errors.push("Gender is required.");
    }
    if (!row.address) {
      errors.push("Address is required.");
    }
    if (!row.birthDate) {
      errors.push("Birth Date is required.");
    }
    if (!row.city.name) {
      errors.push("City is required.");
    }
    if (!row.employmentHistory.name) {
      errors.push("Employment History is required.");
    }
    if (!row.phoneNumber) {
      errors.push("Phone Number is required.");
    }

    if (row.guarantee) {
      if (!row.guarantee.electoralNumber || row.guarantee.electoralNumber.toString().length < 1) {
        errors.push("Guarantee Electoral number is required.");
      }
      if (!row.guarantee.birthDate) {
        errors.push("Guarantee Birth Date is required.");
      }
      if (!row.guarantee.city.name) {
        errors.push("Guarantee City is required.");
      }
      if (!row.guarantee.employmentHistory.name) {
        errors.push("Guarantee Employment History is required.");
      }
    }

    if (errors.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: `Row ${index + 1}: Invalid Data`,
        detail: errors.join(" "),
      });
      row.valid = false;
      this.isAttributesValid = false;
    }
  }

  /**
   * Maps data from the database to the given DemographicExcel object based on city,
   * employment history, and marital status names. If the corresponding database entries
   * collected and displayed, marking the object as invalid.
   *
   * @param obj - The DemographicExcel object to map data for.
   * @param index - The index of the object in the array, used for error reporting.
   */


  mappingDataFromDB(obj: DemographicExcel, index: number) {
    let errors: string[] = [];

    const city = this.cityList.find((city) => city.name.toLowerCase() === obj.city.name.toLowerCase());
    const employmentHistory = this.institutionList.find((institution) => institution.name.toLowerCase() === obj.employmentHistory.name.toLowerCase());

    if (obj.maritalStatus) {
      const maritalStatus = this.maritalStatusList.find((maritalStatus) => maritalStatus.name.toLowerCase() === obj.maritalStatus.name.toLowerCase());
      if (maritalStatus === undefined) {
        errors.push("Marital Status is not found.");
      } else {
        obj.maritalStatus.id = maritalStatus.id;
      }
    }

    if (city === undefined) {
      errors.push("City is not found.");
    } else {
      obj.city.id = city.id;
    }

    if (employmentHistory === undefined) {
      errors.push("Employment History is not found.");
    } else {
      obj.employmentHistory.id = employmentHistory.id;
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
   * Maps the guarantee data from the database for the given DemographicExcel object
   * @param obj The DemographicExcel object to map the guarantee data for
   * @param index The index of the object in the array
   */
  mappingGuaranteeDataFromDB(obj: DemographicExcel, index: number) {
    let errors: string[] = [];

    const city = this.cityList.find((city) => city.name.toLowerCase() === obj.guarantee.city.name.toLowerCase());
    const employmentHistory = this.institutionList.find((institution) => institution.name.toLowerCase() === obj.guarantee.employmentHistory.name.toLowerCase());

    if (city === undefined) {
      errors.push("City is not found (Guarantee)");
    } else {
      obj.guarantee.city.id = city.id;
    }

    if (employmentHistory === undefined) {
      errors.push("Employment History is not found (Guarantee)");
    } else {
      obj.guarantee.employmentHistory.id = employmentHistory.id;
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
   * Converts a given number of bytes into a human-readable format.
   *
   * @param {number} bytes - The number of bytes to be converted.
   * @returns {string} A string containing the formatted size (e.g. 1.23 KB).
   */
  formatSize(bytes) {
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
   * Scans the JSON data for duplicates.
   *
   * Clears any existing messages and sets the scanning state to true.
   * Sends a request to check for duplicate demographics in the provided data.
   * On receiving a response, updates the duplicates data and displays messages.
   * If an error occurs, logs the error and resets the scanning state.
   * On completion, sets the JSON data checked state to true and resets the scanning state.
   *
   * @param data - An array of demographic objects to be checked for duplicates.
   */

  checkJsonData(data: any[]): void {
    this.messageService.clear();
    this.isScanning = true;

    this.duplicatesDataFile = this.getAllDuplicateEntries(data);

    this.demographicService.checkDuplicates(data).subscribe({
      next: response => {
        this.duplicatesData = response;
        this.showDuplicateMessages();
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

  /**
   * Gets all duplicate entries in the given array based on the 'idNumber' field.
   * @param arr The array of demographic objects to be checked for duplicates.
   * @returns An array of demographic objects that are duplicates.
   */
  private getAllDuplicateEntries(arr: any[]) {
    let idMap = new Map();
    let duplicates = [];

    for (let item of arr) {
      if (idMap.has(item.idNumber)) {
        // If it's a duplicate, store both the original and the current one
        if (idMap.get(item.idNumber) !== 'stored') {
          duplicates.push(idMap.get(item.idNumber)); // Add original duplicate
          idMap.set(item.idNumber, 'stored'); // Mark as already stored
        }
        duplicates.push(item); // Add current duplicate
      } else {
        idMap.set(item.idNumber, item); // Store unique entry
      }
    }

    return duplicates;
  }


  /**
   * Saves the given demographic data to the server.
   *
   * The given demographic data is sent to the server using the DemographicService.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, a success notification is displayed and the component is navigated to the demographic list page.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * If the form is invalid, an error notification is displayed with the message 'Form is invalid'.
   * @param data The demographic data to be sent to the server.
   */
  saveDemographicData(data: any[]): void {
    this.messageService.clear();
    this.isSubmitting = true;
    this.demographicService.saveAll(data).subscribe({
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
          this.router.navigate(['/demographics']);
        }, 3000)
      }
    });
  }

  /**
   * Determines whether the form can be submitted.
   * 
   * @returns {boolean} True if the JSON data has been checked for duplicates
   * and no duplicates were found, otherwise false.
   */

  allowSubmit(): boolean {
    return this.isJsonDataChecked && this.duplicatesData.length === 0 && this.duplicatesDataFile.length === 0;
  }

  /**
   * Deletes a demographic data item from the array of JSON data.
   * 
   * @param item The demographic data item to be deleted.
   */
  deleteJsonData(item: any): void {
    this.jsonData = this.jsonData.filter((val) => val !== item);
    this.messageService.add({ key: 'deleteJson', severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
  }

  /**
   * Shows messages based on whether duplicate records were detected in the database or in the file.
   * 
   * If no duplicate records were detected, a success message is displayed.
   * If duplicate records were detected in the database, a warning message is displayed.
   * If duplicate records were detected in the file, a warning message is displayed.
   * 
   * @returns {void}
   */
  showDuplicateMessages(): void {
    const hasDatabaseDuplicates = this.duplicatesData.length > 0;
    const hasFileDuplicates = this.duplicatesDataFile.length > 0;

    if (!hasDatabaseDuplicates && !hasFileDuplicates) {
      this.messageService.add({
        severity: 'success',
        summary: 'No duplicate records detected!',
        detail: 'The provided data is unique and not found in the database or the file.'
      });
    } else {
      if (hasDatabaseDuplicates) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Duplicate data detected in database',
          detail: 'The database already contains this record.'
        });
      }

      if (hasFileDuplicates) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Duplicate entries detected in file',
          detail: 'Identical entries detected in the Excel file. Please review the duplicates for consistency.'
        });
      }
    }
  }

  /**
   * Event handler for when the active index of the p-steps component changes.
   * 
   * Sets the activeTab property to the new index.
   * 
   * @param {number} index The new active index.
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
   * Displays a notification message based on the success or failure of the data submission.
   *
   * If the submission was successful, a success message is displayed.
   * If the submission failed, an error message is displayed with the error details.
   *
   * @param isSuccess - Indicates whether the data submission was successful.
   * @param error - The error message received, if any.
   */

  showSubmitMessages(isSuccess: boolean, error?: any) {
    isSuccess ? this.messageService.add({ severity: 'success', summary: 'Demographics data Registered Successfully!', detail: `The data has been registered.` }) :
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }


  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    this.jsonData = [];
    this.isAttributesValid = true;
    this.messageService.clear();
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.jsonData = [];
    this.isAttributesValid = true;
    this.messageService.clear();
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
