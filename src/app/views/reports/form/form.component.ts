import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tipuRelatoriuList, yearsList } from 'src/app/core/utils/global-types';

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

  constructor(
    private _fb: FormBuilder,
  ) {
    this.reportForm = this._fb.group({
      tipu: [null, [Validators.required]],
      tinan: [null, [Validators.required]],
    });

    this.defaultFormValue = this.reportForm.value;

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
    let year = form.value.tinan.code;
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 0);
  }


}
