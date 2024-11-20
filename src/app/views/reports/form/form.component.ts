import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { ReabdService } from 'src/app/core/services';
import { tipuEleitorTuanList, tipuRelatoriuList, yearsList } from 'src/app/core/utils/global-types';

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
  totalEleitoresFoun: number[] = [];
  totalEleitoresTuan: number[] = [];
  totalKartaunTohar: number[] = [];
  totalMudaHelaFatin: number[] = [];
  totalMudaTinanDataNaran: number[] = [];
  totalKartaunTuan: number[] = [];
  totalKartaunLakon: number[] = [];

  constructor(
    private _fb: FormBuilder,
    private reabdService: ReabdService,
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
      
      if (isEqual(item, this.defaultFormValue)) {
        this.hideClearButton = true;
      } else {
        this.hideClearButton = false;
      }
    });
  }


  generateReport(form: FormGroup) {
    let year = form.value.tinan.code;
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 0);
    this.reabdService.getReportsMonthlyByYear(firstDayOfYear, lastDayOfYear).subscribe({
      next: response => {
        this.dataReports = response;

        this.totalEleitoresFoun = this.dataReports.map(value => value.eleitoresFoun);
        this.totalEleitoresTuan = this.dataReports.map(value => value.kartaunTohar + value.mudaHelaFatin + value.mudaTinanDataNaran + value.kartaunTuan + value.kartaunLakon);

        this.totalKartaunTohar = this.dataReports.map(value => value.kartaunTohar);
        this.totalMudaHelaFatin = this.dataReports.map(value => value.mudaHelaFatin);
        this.totalMudaTinanDataNaran = this.dataReports.map(value => value.mudaTinanDataNaran);
        this.totalKartaunTuan = this.dataReports.map(value => value.kartaunTuan);
        this.totalKartaunLakon = this.dataReports.map(value => value.kartaunLakon);
      }
    });
  }


}
