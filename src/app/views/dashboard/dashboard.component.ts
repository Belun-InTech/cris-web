import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dashboard } from 'src/app/core/models/data';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    data: Dashboard;
    genderData: any;
    beneficiaryData: any;
    monthlyCreditData: any;
    monthlyInstitutionBalanceData: any;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.data = this.route.snapshot.data['dashboardResolve'];

        this.genderData = [
            {
                name: 'Female',
                y: this.data.totalDemographicFemale,
                color: '#EF959D'
            },
            {
                name: 'Male',
                y: this.data.totalDemographicMale,
                color: '#034078'
            }
        ];

        this.beneficiaryData = [
            {
                name: 'Company',
                y: this.data.totalDemographicFemale,
                color: '#EDAE49'
            },
            {
                name: 'Individual',
                y: this.data.totalDemographicMale,
                color: '#00798C'
            }
        ];

        this.monthlyCreditData = [
            {
                name: 'Credit',
                type: 'column',
                data: this.data.monthlyCreditCountList.map((item: any) => item.count),
            },
        ];

        if (this.data) {
            this.monthlyInstitutionBalanceData = this.mapMonthlyFinancialInstitutionBalance(this.data);
        }
    }

    mapMonthlyFinancialInstitutionBalance(data: Dashboard): any {

        // 1. Ensure all 12 months are represented.
        const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // 2. Get a list of distinct banks.
        const banksSet = new Set<string>();
        data.monthlyInstitutionBalanceList.forEach(item => banksSet.add(item.financialInstitution));
        const banks = Array.from(banksSet);

        // 3. Create the series data.
        return banks.map(bank => {
            // Use a different variable name (e.g., bankData) to avoid shadowing the 'data' parameter.
            const bankData = allMonths.map(month => {
                // Find the record in the Dashboard's monthlyInstitutionBalanceList matching the current bank and month.
                const record = data.monthlyInstitutionBalanceList.find(r => r.month === month && r.financialInstitution === bank);
                return record ? record.totalOriginalBalance : 0;
            });
            return { name: bank, data: bankData };
        });
    }
}

