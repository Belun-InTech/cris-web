import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Credit, Demographic } from 'src/app/core/models/data';
import { DemoCreditService } from 'src/app/core/services/demo-credit.service';
import { normalizeId } from 'src/app/core/utils/global-types';
import { utils, writeFile } from "xlsx";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [MessageService]
})
export class SearchComponent {
  searchFormControl = new FormControl('', { updateOn: 'change' });
  dataIsFetching = false;
  demoData!: Demographic;
  demoList: Demographic[];
  latestCredit: Credit;
  unique: string;

  selectedDemo!: any;

  constructor(
    private messageService: MessageService,
    private service: DemoCreditService,
  ) { }

  ngOnInit(): void {
    this.demoData = undefined;
    this.demoList = [];
    this.searchFormControl.setValidators([Validators.required, Validators.minLength(1)]);
    this.unique = new Date().getMilliseconds().toString();
  }


  searchData(formInput: FormControl): void {
    this.messageService.clear();
    this.dataIsFetching = true
    this.service.searchByIdNumber(normalizeId(formInput.value))
      .subscribe({
        next: response => {
          this.demoData = response;
          this.demoList.push(this.demoData);
          this.dataIsFetching = false;

          // Get Latest Credit
          if (this.demoData.credits.length > 0) {
            this.latestCredit = this.demoData.credits[0];
          }
        },
        error: err => {
          this.dataIsFetching = false;
          this.demoList = [];
          this.demoData = undefined;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
        }
      });
  }

  clearFormInput(): void {
    this.messageService.clear();
    this.searchFormControl.reset();
    this.demoList = [];
    this.demoData = undefined;
  }

  exportDemographicAndCredit(demo: any) {

    // ================= Demographic Sheet =================
    const demographicHeader = [
      "Name", "ElectNo", "Beneficiary", "DOB", "Gender", "MStatus",
      "SpouseName", "City", "Address", "EmpHist", "Telephone"
    ];

    const demographicRow = [
      demo.fullName ?? "",
      demo.idNumber ?? "",
      demo.beneficiary?.name ?? "",
      demo.birthDate ?? "",
      demo.gender ?? "",
      demo.maritalStatus ?? "",
      demo.spouseName ?? "",
      demo.city?.name ?? "",
      demo.address ?? "",
      demo.employmentHistory ?? "",
      demo.phoneNumber ?? ""
    ];

    const demographicSheet = utils.aoa_to_sheet([
      demographicHeader,
      demographicRow
    ]);

    // ================= Credit Sheet =================
    const creditHeader = [
      "NameCreditGrantor", "ElectNo", "DateAcctOpened", "DueDate",
      "OrgBal", "MonthlyPaymt", "DateLastPaymt", "Balance",
      "CreditbySector", "MannerofPaymt", "Security", "DescofCollateral",
      "AssetClass", "GuaranteeName", "GuaranteeElectNo",
      "GuaranteeDOB", "GuaranteeCity", "GuaranteeEmpHist"
    ];

    const creditRows = (demo.credits ?? []).map((c: any) => ([
      c.grantor?.name ?? "",
      demo.idNumber ?? "",
      c.accountCreationDate ?? "",
      c.dueDate ?? "",
      c.originalBalance ?? "",
      c.monthlyPayment ?? "",
      c.lastPaymentDate ?? "",
      c.balance ?? "",
      c.sector?.name ?? "",
      c.mannerOfPayment?.name ?? "",
      c.security?.name ?? "",
      c.descriptionSecurity ?? "",
      c.assetClass?.name ?? "",
      c.guarantee?.fullName ?? "",
      c.guarantee?.idNumber ?? "",
      c.guarantee?.birthDate ?? "",
      c.guarantee?.city?.name ?? "",
      c.guarantee?.employmentHistory ?? ""
    ]));

    const creditSheet = utils.aoa_to_sheet([
      creditHeader,
      ...creditRows
    ]);

    // ================= Workbook =================
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, demographicSheet, "Demographic");
    utils.book_append_sheet(workbook, creditSheet, "Credit");

    const fileName = `Demographic_With_Credit_${this.searchFormControl.value}.xlsx`;
    writeFile(workbook, fileName);
  }
}
