import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataMasterService } from 'src/app/core/services';

@Component({
  selector: 'app-data-master',
  templateUrl: './data-master.component.html',
  styleUrl: './data-master.component.scss',
  providers: [MessageService]
})
export class DataMasterComponent {
  dataForm: FormGroup;
  dataList = [];
  cols = [];
  showDialog = false;
  type = '';
  buttonLoading = false;
  isNew = false;
  selectedData: any;
  searchingFeesData: any;

  constructor(
    private route: ActivatedRoute,
    private service: DataMasterService,
    private _fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.setDataMaster(this.route.snapshot.data['type']);
  }

  /**
   * Set the data list and column definitions based on the given type.
   *
   * @param type The type of the data master, which can be 'financialInstitutions', 'sector', 'collateral', or 'credit'.
   */
  setDataMaster(type: string) {
    this.type = type;
    switch (type) {
      case 'financial-institutions':
        this.dataList = this.route.snapshot.data['financialInstitutionListResolve']._embedded.financialInstitutions;
        this.cols = [
          { field: 'name', header: 'Name' },
          { field: 'code', header: 'Code' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
          code: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'sectors':
        this.dataList = this.route.snapshot.data['sectorListResolve']._embedded.sectors;
        this.cols = [
          { field: 'name', header: 'Name' },
          { field: 'description', header: 'Description' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
          description: ['', [Validators.required, Validators.minLength(2)]],
        });
        break;
      case 'type-collaterals':
        this.dataList = this.route.snapshot.data[`typeCollateralsListResolve`]._embedded['typeCollateral'];
        this.cols = [
          { field: 'name', header: 'Name' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'credit-classifications':
        this.dataList = this.route.snapshot.data[`creditClassificationListResolve`]._embedded['creditClassifications'];
        this.cols = [
          { field: 'name', header: 'Name' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'marital-status':
        this.dataList = this.route.snapshot.data[`maritalStatusListResolve`]._embedded['maritalStatus'];
        this.cols = [
          { field: 'name', header: 'Name' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'cities':
      case 'manners':
        this.dataList = this.route.snapshot.data[`${type}ListResolve`]._embedded[type];
        this.cols = [
          { field: 'name', header: 'Name' },
        ];
        this.dataForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'faqs':
        this.dataList = this.route.snapshot.data['faqListResolve']._embedded.frequentlyAnswerQuestions;
        this.cols = [
          { field: 'question', header: 'Question' },
          { field: 'answer', header: 'Answer' },
        ];
        this.dataForm = this._fb.group({
          question: ['', [Validators.required, Validators.minLength(1)]],
          answer: ['', [Validators.required, Validators.minLength(1)]],
        });
        break;
      case 'fees':
        this.searchingFeesData = this.route.snapshot.data['searchingFeesResolve'];
        this.selectedData = this.searchingFeesData;
        this.dataForm = this._fb.group({
          id: [this.selectedData.id],
          fee: [this.searchingFeesData.fee],
        });
        break;

    }
  }

  /**
   * Opens a dialog for adding new data master item.
   *
   * @param type The type of the data master, which can be 'bank', 'sector', 'collateral', or 'credit'.
   */
  openDialogNewData(type: string): void {
    this.messageService.clear();
    this.isNew = true;
    this.showDialog = true;
  }

  openDialogEditData(data: any, index?: any,): void {
    this.messageService.clear();
    this.showDialog = true;
    this.isNew = false;
    this.dataForm.patchValue(data);
    this.selectedData = data;
    this.selectedData.index = index;
  }

  /**
   * Closes the dialog and resets the form.
   *
   * Sets the `showDialog` flag to false, effectively closing the dialog.
   * Resets the `dataForm`, clearing any unsaved changes.
   */
  closeDialog(): void {
    this.showDialog = false;
    this.dataForm.reset();
  }

  /**
   * Saves a data master item to the server.
   * @param form The FormGroup containing the data to be sent to the server.
   * The loading indicator is set to true until the response is received from the server.
   * If the response is successful, the item is added to the list of data master items and a success notification is displayed.
   * If the response is an error, an error notification is displayed with the error message received from the server.
   * The loading indicator is set to false and the dialog is closed upon completion of the observable.
   */
  saveData(form: FormGroup): void {
    this.messageService.clear();
    this.buttonLoading = true;

    this.service.save(this.type, form.value).subscribe({
      next: response => {
        this.dataList.push(response);
        this.setNotification(true, true);
      },
      error: error => {
        this.setNotification(false, true, error);
      },
      complete: () => {
        this.buttonLoading = false;
        this.closeDialog();
      }
    });
  }

  updateData(form: FormGroup): void {
    this.messageService.clear();
    this.buttonLoading = true;

    this.service.update(this.selectedData.id, this.type, form.value).subscribe({
      next: response => {
        if (this.type === 'fees') {
          this.searchingFeesData = response;
        } else {
          this.dataList[this.selectedData.index] = response
        }
        this.setNotification(true, false);
      },
      error: error => {
        this.setNotification(false, false, error);
      },
      complete: () => {
        this.buttonLoading = false;
        if (this.type !== 'fees') {
          this.closeDialog();
        }
      }
    })
  }

  /**
   * Displays a notification message based on the success or failure of an operation.
   * 
   * @param isSuccess - Indicates whether the operation was successful.
   * @param isNew - Specifies if the operation was for a new item registration.
   * @param error - The error message received, if any.
   */
  setNotification(isSuccess: boolean, isNew: boolean, error?: any) {
    const summary = isSuccess ? (isNew ? 'Data Registered Successfully!' : 'Data Updated Successfully!') : 'Error';
    const detail = isSuccess ? (isNew ? `The data has been registered` : `The data has been updated`) : error;

    this.messageService.add({ severity: isSuccess ? 'success' : 'error', summary, detail, life: 3000 });
  }

}
