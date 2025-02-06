import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DemographicService } from 'src/app/core/services';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService]
})
export class FormComponent {
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  demographicForm: FormGroup;
  loading = false;
  isNew = true;

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private demographicService: DemographicService,
    private _fb: FormBuilder,
    private router: Router
  ) {

    this.demographicForm = this._fb.group({
      idNumber: ['12345678', [Validators.required, Validators.minLength(1)]],
      fullName: ['John Doe', Validators.required],
      address: ['123 Main St, Cityville', Validators.required],
      birthDate: [new Date('1992-10-16'), Validators.required],
      city: ['Cityville', Validators.required],
      maritalStatus: ['Single'],
      spouseName: [''],
      employmentHistory: ['Software Engineer at XYZ Corp'],
      phoneNumber: ['78143627', [Validators.required, Validators.pattern('^[0-9]{7,20}$')]],
      // idNumber: ['', [Validators.required, Validators.minLength(1)]],
      // address: ['', Validators.required],
      // birthDate: ['', Validators.required],
      // city: ['', Validators.required],
      // maritalStatus: [''],
      // spouseName: [''],
      // employmentHistory: [''],
      // phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{7,20}$')]],
    });
  }

  ngOnInit() {
    console.log(this.files);

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
      if (formData.birthDate) {
        let dateObj = new Date(formData.birthDate);
        formData.birthDate = dateObj.toISOString().split('T')[0]; // Extracts 'yyyy-MM-dd'
      }

      this.demographicService.save(formData).subscribe({
        next: (response) => {
          this.setNotification(true, response);
        },
        error: (error) => {
          this.loading = false;
          this.setNotification(false, null, error);
        },
        complete: () => {
          this.demographicForm.reset();
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/demographics']);
          }, 3000)
        }
      });
    } else {
      this.setNotification(false, null, 'Form is invalid');
    }
  }

  setNotification(isSuccess: boolean, demographic?: any, error?: any) {
    if (this.isNew) {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'Demographic Registered Successfully!', detail: `The Demographic data ${demographic.fullName} has been registered.` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      isSuccess ? this.messageService.add({ severity: 'success', summary: 'User Updated Successfully!', detail: `The Demographic data ${demographic.fullName} informations has been updated` }) :
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }


  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    console.log(removeFileCallback);
    console.log(file);


    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    console.log(this.files);

    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback) {
    callback();
  }

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
}
