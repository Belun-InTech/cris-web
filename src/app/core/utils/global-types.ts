import { formatDate } from "@angular/common";
import { BeneficiaryType, Gender } from "../models/enum";

interface OptionsType {
    value: string;
    viewValue: string;
    icon?: string;
}

interface BooleanOpts {
    value: boolean;
    viewValue: string;
    icon?: string;
}

export const genderOpts: OptionsType[] = [
    {
        value: Gender.male,
        viewValue: 'Male',
        icon: 'pi pi-mars'
    },
    {
        value: Gender.female,
        viewValue: 'Female',
        icon: 'pi pi-venus'
    }
]

export const formatDateToISO = (value: Date): string => {
    return formatDate(value, 'YYYY-MM-dd', 'en', 'Asia/Dili');
}


export const pieChartOptions: Highcharts.Options = {
    chart: {
        type: 'pie',
    },
    title: {
        text: '',
    },
    exporting: {
        buttons: {
            contextButton: {
                menuItems: [
                    'viewFullscreen', 'separator', 'downloadPNG',
                    'downloadSVG', 'downloadPDF', 'separator', 'downloadXLS'
                ]
            }
        },
        showExportInProgress: true,
        enabled: true,
    },
    navigation: {
        buttonOptions: {
            align: 'right',
            verticalAlign: 'top',
            y: 0
        },
    },
    series: []
};

export const tipuRelatoriuList = [
    { name: 'Asset Classification Reports', code: 'asset' },
    { name: 'Credit by Sector Reports', code: 'sector' },
    { name: 'Individual or Company Credit Reports', code: 'credit' },
    { name: ' Demographics Data Report', code: 'demo' },
]

export const tipuEleitorTuanList = [
    { name: 'Kartaun Tohar', value: 'kartaunTohar' },
    { name: 'Muda hela fatin', value: 'mudaHelaFatin' },
    { name: 'Muda Tinan/Data Moris/Naran', value: 'mudaTinanDataNaran' },
    { name: 'Kartaun Tuan', value: 'kartaunTuan' },
    { name: 'Kartaun Lakon', value: 'kartaunLakon' },

]

//Print years in array from 2023 until current year
export const yearsList = Array.from(
    { length: new Date().getFullYear() - 2023 + 1 },
    (_, index) => ({
        name: `${2023 + index}`,
        code: 2023 + index
    })
).reverse();

export const beneficiaryTypeOpts: any[] = [
    { name: BeneficiaryType.company, value: BeneficiaryType.company.toLowerCase() },
    { name: BeneficiaryType.individual, value: BeneficiaryType.individual.toLowerCase() },
];


export function normalizeId(id: string | null): string | null {
    if (id === null) {
        return null;
    }
    // Replace leading zeros unless the string is exactly "0"
    return id.replace(/^0+(?!$)/, "");
}