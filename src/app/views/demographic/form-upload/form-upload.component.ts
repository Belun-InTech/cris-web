import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DemographicService } from 'src/app/core/services';
import * as XLSX from 'xlsx';

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
  jsonData: any[] = [];
  columns: string[];
  disabledTab = true;
  isJsonDataChecked = false;
  jsonDataSize = 50;
  duplicatesData = [];
  isScanning = false;
  isSubmitting = false;


  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private demographicService: DemographicService,
    private router: Router,
  ) {
    this.columns = ['Name', 'Gender', 'Electoral Nº/Taxpayer ID (TIN)', 'Address - City', 'Date of Birth', 'Telephone Nº', 'Actions']
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
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        this.jsonData = jsonData.map((row) => {
          const newRow = { ...row as any };
          if (newRow.birthDate) {
            newRow.birthDate = new Date(newRow.birthDate).toISOString().split('T')[0];
          }
          if (newRow.gender) {
            newRow.gender = newRow.gender.toLowerCase();
          }
          return newRow;
        });
      };
      fileReader.readAsArrayBuffer(this.files[0]);
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
          this.router.navigate(['/admin/demographics']);
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
    return this.isJsonDataChecked && this.duplicatesData.length === 0;
  }

  /**
   * Deletes a demographic data item from the array of JSON data.
   * 
   * @param item The demographic data item to be deleted.
   */
  deleteJsonData(item: any): void {
    this.jsonData = this.jsonData.filter((val) => val.idNumber !== item.idNumber);
    this.messageService.add({ key: 'deleteJson', severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
  }

  /**
   * Displays a notification message to the user based on whether the data uploaded contains any duplicates in the database.
   * If there are no duplicates, a success notification is shown.
   * If there are duplicates, a warning notification is shown with a message indicating that the data has been found in the database.
   */
  showDuplicateMessages(): void {
    this.duplicatesData.length === 0 ? this.messageService.add({ severity: 'success', summary: 'No duplicate records detected!', detail: `The provided data is unique and not found in the database.` }) :
      this.messageService.add({ severity: 'warn', summary: 'Duplicate data detected', detail: 'The database already contains this record.' });
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
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.jsonData = [];
  }
}
