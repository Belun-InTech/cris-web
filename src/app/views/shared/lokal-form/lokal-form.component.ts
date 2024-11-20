import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Aldeia, Munisipiu, PostuAdministrativu, Suku } from 'src/app/core/models';
import { LocalService } from 'src/app/core/services';

@Component({
  selector: 'app-lokal-form',
  templateUrl: './lokal-form.component.html',
  styleUrl: './lokal-form.component.scss'
})
export class LokalFormComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<Aldeia>();
  @Input() isNew: boolean;
  @Input() selectedAldeia: Aldeia;

  lokalForm: FormGroup;
  @Input() munisipiuList: Munisipiu[];
  postuList: PostuAdministrativu[];
  sukuList: Suku[];
  aldeiaList: Aldeia[];

  constructor(
    private _fb: FormBuilder,
    private lokalService: LocalService,
  ) {

    this.lokalForm = this._fb.group({
      munisipiu: new FormControl(null, [Validators.required]),
      postuAdministrativu: new FormControl(null, [Validators.required]),
      suku: new FormControl(null, [Validators.required]),
      aldeia: new FormControl(null, [Validators.required]),
    });

  }

  ngOnInit(): void {
    if (!this.isNew && this.selectedAldeia) {
      this.getAllLokalList(this.selectedAldeia);
    }
  }

  getAllLokalList(aldeia: Aldeia): void {
    const munisipiuId = aldeia.suku.postuAdministrativu.munisipiu.id;
    const postuId = aldeia.suku.postuAdministrativu.id;
    const sukuId = aldeia.suku.id;
    forkJoin([this.lokalService.getPostuListByMunicipioId(munisipiuId),
    this.lokalService.getSukuListByPostuId(postuId),
    this.lokalService.getAldeiaListBySukuId(sukuId)]).subscribe({
      next: responseList => {
        this.postuList = responseList[0].data;
        this.sukuList = responseList[1].data;
        this.aldeiaList = responseList[2].data;

        const munisipiu = aldeia.suku.postuAdministrativu.munisipiu;
        delete aldeia.suku.postuAdministrativu.munisipiu;
        const postu = aldeia.suku.postuAdministrativu;
        delete aldeia.suku.postuAdministrativu;
        const suku = aldeia.suku;
        delete aldeia.suku;
        const aldeiaNew = aldeia;

        this.lokalForm.patchValue({
          munisipiu: munisipiu,
          postuAdministrativu: postu,
          suku: suku,
          aldeia: aldeiaNew
        });
        this.getLocationSelected();
      }
    });
  }

  onMunisipiuChange(event: any): void {
    if (event.value) {
      this.lokalService
        .getPostuListByMunicipioId(event.value.id)
        .subscribe(response => this.postuList = response.data);
    } else {
      this.lokalForm.get('postuAdministrativu').reset();
      this.lokalForm.get('suku').reset();
      this.lokalForm.get('aldeia').reset();
      this.postuList = [];
      this.sukuList = [];
      this.aldeiaList = [];
      this.locationSelected.emit(null);
    }
  }


  onPostuChange(event: any): void {
    if (event.value) {
      this.lokalService
        .getSukuListByPostuId(event.value.id)
        .subscribe(response => this.sukuList = response.data);
    } else {
      this.lokalForm.get('suku').reset();
      this.lokalForm.get('aldeia').reset();
      this.sukuList = [];
      this.aldeiaList = [];
      this.locationSelected.emit(null);
    }
  }

  onSukuChange(event: any): void {
    if (event.value) {
      this.lokalService
        .getAldeiaListBySukuId(event.value.id)
        .subscribe(response => this.aldeiaList = response.data);
    } else {
      this.lokalForm.get('aldeia').reset();
      this.aldeiaList = [];
      this.locationSelected.emit(null);
    }
  }

  onAldeiaChange(): void {
    this.getLocationSelected();
  }


  getLocationSelected(): void {
    if (this.lokalForm.valid) {
      const { aldeia } = this.lokalForm.value;
      const selectedValue: Aldeia = {
        id: aldeia.id,
        naran: aldeia.naran,
        suku: null
      };
      this.locationSelected.emit(selectedValue);
    } else {
      this.locationSelected.emit(null);
    }
  }

}
