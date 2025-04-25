import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, startWith, Subscription } from 'rxjs';
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
    activeUsersData: any[] = [];
    elapsedTime: string = '';
    now: number = Date.now();
    private subscription!: Subscription;


    constructor(
        private route: ActivatedRoute,
    ) {
        this.data = this.route.snapshot.data['dashboardResolve'];
        this.activeUsersData = this.data.activeUsers;

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
                y: this.data.totalDemographicCompany,
                color: '#EDAE49'
            },
            {
                name: 'Individual',
                y: this.data.totalDemographicIndividual,
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

    ngOnInit(): void {
        this.subscription = interval(1000)
            .pipe(startWith(0))
            .subscribe(() => {
                this.now = Date.now();
            });

    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Maps the Dashboard's monthlyInstitutionBalanceList to series data for the chart.
     * @param data The Dashboard data.
     * @returns An array of objects in the form: {name: string, data: number[]}
     *          where name is the name of the bank and data is the array of 12 balance values, one for each month.
     */
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

    /**
     * Computes the elapsed time between the given ISO-formatted date string and the current time,
     * and formats it as HH:MM:SS.
     *
     * @param isoString The ISO-formatted date string.
     * @returns The elapsed time, formatted as HH:MM:SS.
     */
    getElapsedTimeFromISO(isoString: string): string {
        const start = new Date(isoString).getTime();
        const diffInSeconds = Math.floor((this.now - start) / 1000);

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        return [hours, minutes, seconds]
            .map(unit => unit.toString().padStart(2, '0'))
            .join(':');
    }
}

