import { formatDate } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";
import { Gender } from "../models/gender.enum";

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
    { name: 'Large Credit Exposores', code: '' },
    { name: 'Credit Sectors by Values', code: '' },
    { name: 'Credit Sectors by Values (by Bank)', code: '' },
    { name: ' Credit by Sectors', code: '' },
    { name: 'Summary Report on Type of Collaterals', code: '' },
]

export const tipuEleitorTuanList = [
    { name: 'Kartaun Tohar', value: 'kartaunTohar'},
    { name: 'Muda hela fatin', value: 'mudaHelaFatin'},
    { name: 'Muda Tinan/Data Moris/Naran', value: 'mudaTinanDataNaran'},
    { name: 'Kartaun Tuan', value: 'kartaunTuan'},
    { name: 'Kartaun Lakon', value: 'kartaunLakon'},
    
]

//Print years in array from 2023 until current year
export const yearsList = Array.from(
    { length: new Date().getFullYear() - 2023 + 1 },
    (_, index) => ({
        name: `${2023 + index}`,
        code: 2023 + index
    })
).reverse();

