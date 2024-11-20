import { formatDate } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";

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

export const kampanaEleitoralFormDummyData = {
    // Define dummy data directly in FormControls
    id: new FormControl(null),
    eventu: new FormControl(null, [Validators.required]),
    fatinKampana: new FormControl('Sample Location', [Validators.required]),
    aldeia: new FormControl(null, [Validators.required]), // Sample Aldeia object
    naranPartiduKoligasaun: new FormControl(null, [Validators.required]),
    // partidu: new FormControl(null),
    // koligasaun: new FormControl(null),
    orariuKampana: new FormControl(new Date(), [Validators.required]),
    naranOfisialMonitorizasaun: new FormControl('Sample Official Monitor', [Validators.required]),
    numeruPartisipante: new FormControl(100, [Validators.required]),
    persentajenFeto: new FormControl(30, [Validators.required]),
    persentajenJoven: new FormControl(70, [Validators.required]),
    numeruIntervensaunFeto: new FormControl(20, [Validators.required]),
    tuirOrariuKalendariu: new FormControl(true, [Validators.required]),
    esplikasaunTuirOrariuKalendariu: new FormControl('Sample Explanation'),
    formaPasifika: new FormControl(false, [Validators.required]),
    esplikasaunFormaPasifika: new FormControl('Sample Explanation'),
    impedimentuHusiEma: new FormControl(true, [Validators.required]),
    esplikasaunImpedimentuHusiEma: new FormControl('Sample Explanation'),
    impedimentuHusiGrupuPartidu: new FormControl(false, [Validators.required]),
    esplikasaunImpedimentuHusiGrupuPartidu: new FormControl('Sample Explanation'),
    eventuLaTuirOras: new FormControl(true, [Validators.required]),
    esplikasaunEventuLaTuirOras: new FormControl('Sample Explanation'),
    halaoFatinBandu: new FormControl(false, [Validators.required]),
    esplikasaunHalaoFatinBandu: new FormControl('Sample Explanation'),
    uzaPatrimonioEstadu: new FormControl(true, [Validators.required]),
    esplikasaunUzaPatrimonioEstadu: new FormControl('Sample Explanation'),
    asaunDiskriminasaun: new FormControl(false, [Validators.required]),
    esplikasaunAsaunDiskriminasaun: new FormControl('Sample Explanation'),
    detensaunPrizaun: new FormControl(true, [Validators.required]),
    esplikasaunDetensaunPrizaun: new FormControl('Sample Explanation'),
    hetanApoiuForsaMembruGovernu: new FormControl(false, [Validators.required]),
    esplikasaunHetanApoiuForsaMembruGovernu: new FormControl('Sample Explanation'),
    formaDesrespeitu: new FormControl(true, [Validators.required]),
    esplikasaunFormaDesrespeitu: new FormControl('Sample Explanation'),
    impedeDistribuisaunSasan: new FormControl(false, [Validators.required]),
    esplikasaunImpedeDistribuisaunSasan: new FormControl('Sample Explanation'),
    estragaSasan: new FormControl(true, [Validators.required]),
    esplikasaunEstragaSasan: new FormControl('Sample Explanation'),
    faheSasanProvokaViolensia: new FormControl(false, [Validators.required]),
    esplikasaunFaheSasanProvokaViolensia: new FormControl('Sample Explanation'),
    tipuLinguajenProvokaViolensia: new FormControl(true, [Validators.required]),
    esplikasaunTipuLinguajenProvokaViolensia: new FormControl('Sample Explanation'),
    tipuLinguajenDifamatoria: new FormControl(false, [Validators.required]),
    esplikasaunTipuLinguajenDifamatoria: new FormControl('Sample Explanation'),
    tipuLinguajenIntimidaVotante: new FormControl(true, [Validators.required]),
    esplikasaunTipuLinguajenIntimidaVotante: new FormControl('Sample Explanation'),
    ameasauGrupuEma: new FormControl(false, [Validators.required]),
    esplikasaunAmeasauGrupuEma: new FormControl('Sample Explanation'),
    insultaEstadu: new FormControl(true, [Validators.required]),
    esplikasaunInsultaEstadu: new FormControl('Sample Explanation'),
    partiduBanduUzaViolensia: new FormControl(false, [Validators.required]),
    esplikasaunPartiduBanduUzaViolensia: new FormControl('Sample Explanation'),
    distribuiRumaMotivaViolensia: new FormControl(true, [Validators.required]),
    esplikasaunDistribuiRumaMotivaViolensia: new FormControl('Sample Explanation'),
    insidenteGrave: new FormControl(false, [Validators.required]),
    esplikasaunInsidenteGrave: new FormControl('Sample Explanation'),
    apresiasaunJeral: new FormControl('diak', [Validators.required]),
    pontosFocaisMonitoriza: new FormControl(true, [Validators.required]),
    mensajenPrinsipal: new FormControl('Sample Main Message', [Validators.required]),
    ofisialMonitorizasaunHaloMonitorizasaun: new FormControl(false, [Validators.required]),
    komentariu: new FormControl('Sample Comment'),
    tipuKampana: new FormControl(null, [Validators.required]),
    esplikasaunTipuKampana: new FormControl(),
}

export const kampanaEleitoralForm = {
    id: new FormControl(null),
    eventu: new FormControl(null, [Validators.required]),
    aldeia: new FormControl(null),
    fatinKampana: new FormControl(null, [Validators.required]),
    // partidu: new FormControl(null),
    // koligasaun: new FormControl(null),
    naranPartiduKoligasaun: new FormControl(null, [Validators.required]),
    orariuKampana: new FormControl(null, [Validators.required]),
    naranOfisialMonitorizasaun: new FormControl(null, [Validators.required]),
    numeruPartisipante: new FormControl(null, [Validators.required]),
    persentajenJoven: new FormControl(null, [Validators.required]),
    persentajenFeto: new FormControl(null, [Validators.required]),
    numeruIntervensaunFeto: new FormControl(null, [Validators.required]),
    tipuKampana: new FormControl(null, [Validators.required]),
    esplikasaunTipuKampana: new FormControl(),
    tuirOrariuKalendariu: new FormControl(null, [Validators.required]),
    esplikasaunTuirOrariuKalendariu: new FormControl(),
    formaPasifika: new FormControl(null, [Validators.required]),
    esplikasaunFormaPasifika: new FormControl(),
    impedimentuHusiEma: new FormControl(null, [Validators.required]),
    esplikasaunImpedimentuHusiEma: new FormControl(),
    impedimentuHusiGrupuPartidu: new FormControl(null, [Validators.required]),
    esplikasaunImpedimentuHusiGrupuPartidu: new FormControl(),
    eventuLaTuirOras: new FormControl(null, [Validators.required]),
    esplikasaunEventuLaTuirOras: new FormControl(),
    halaoFatinBandu: new FormControl(null, [Validators.required]),
    esplikasaunHalaoFatinBandu: new FormControl(),
    uzaPatrimonioEstadu: new FormControl(null, [Validators.required]),
    esplikasaunUzaPatrimonioEstadu: new FormControl(),
    asaunDiskriminasaun: new FormControl(null, [Validators.required]),
    esplikasaunAsaunDiskriminasaun: new FormControl(),
    detensaunPrizaun: new FormControl(null, [Validators.required]),
    esplikasaunDetensaunPrizaun: new FormControl(),
    hetanApoiuForsaMembruGovernu: new FormControl(null, [Validators.required]),
    esplikasaunHetanApoiuForsaMembruGovernu: new FormControl(),
    formaDesrespeitu: new FormControl(null, [Validators.required]),
    esplikasaunFormaDesrespeitu: new FormControl(),
    impedeDistribuisaunSasan: new FormControl(null, [Validators.required]),
    esplikasaunImpedeDistribuisaunSasan: new FormControl(),
    estragaSasan: new FormControl(null, [Validators.required]),
    esplikasaunEstragaSasan: new FormControl(),
    faheSasanProvokaViolensia: new FormControl(null, [Validators.required]),
    esplikasaunFaheSasanProvokaViolensia: new FormControl(),
    tipuLinguajenProvokaViolensia: new FormControl(null, [Validators.required]),
    esplikasaunTipuLinguajenProvokaViolensia: new FormControl(),
    tipuLinguajenDifamatoria: new FormControl(null, [Validators.required]),
    esplikasaunTipuLinguajenDifamatoria: new FormControl(),
    tipuLinguajenIntimidaVotante: new FormControl(null, [Validators.required]),
    esplikasaunTipuLinguajenIntimidaVotante: new FormControl(),
    ameasauGrupuEma: new FormControl(null, [Validators.required]),
    esplikasaunAmeasauGrupuEma: new FormControl(),
    insultaEstadu: new FormControl(null, [Validators.required]),
    esplikasaunInsultaEstadu: new FormControl(),
    partiduBanduUzaViolensia: new FormControl(null, [Validators.required]),
    esplikasaunPartiduBanduUzaViolensia: new FormControl(),
    distribuiRumaMotivaViolensia: new FormControl(null, [Validators.required]),
    esplikasaunDistribuiRumaMotivaViolensia: new FormControl(),
    insidenteGrave: new FormControl(null, [Validators.required]),
    esplikasaunInsidenteGrave: new FormControl(),
    apresiasaunJeral: new FormControl(null, [Validators.required]),
    pontosFocaisMonitoriza: new FormControl(null, [Validators.required]),
    mensajenPrinsipal: new FormControl(null, [Validators.required]),
    ofisialMonitorizasaunHaloMonitorizasaun: new FormControl(null, [Validators.required]),
    komentariu: new FormControl()
}

export const formatDateToISO = (value: Date): string => {
    return formatDate(value, 'YYYY-MM-dd', 'en', 'Asia/Dili');
}

export const reabdFormDummyData = {
    id: new FormControl(null),
    postuAdministrativu: new FormControl(null, [Validators.required]),
    orasHahu: [null, Validators.required],
    orasRemata: [null, Validators.required],
    operadorStaeAtendimentuDiak: [false, Validators.required],
    atividadeTuirOrariu: [false, Validators.required],
    prosedimentuLegal: [false, Validators.required],
    ihaEmaEstrajeiru: [false, Validators.required],
    ihaEmaIdadeKiik16: [false, Validators.required],
    kartaunDupla: [false, Validators.required],
    deleteSimuEleitorMate: [false, Validators.required],
    kondisaunLaptop: [false, Validators.required],
    printerKondisaun: [false, Validators.required],
    cardSufisiente: [false, Validators.required],
    internetFunsiona: [false, Validators.required],
    problemaLojistika: [false, Validators.required],
    esplikasaunOperadorStaeAtendimentuDiak: ['Sample Explanation'],
    esplikasaunAtividadeTuirOrariu: ['Sample Explanation'],
    esplikasaunProsedimentuLegal: ['Sample Explanation'],
    esplikasaunIhaEmaEstrajeiru: ['Sample Explanation'],
    esplikasaunIhaEmaIdadeKiik16: ['Sample Explanation'],
    esplikasaunKartaunDupla: ['Sample Explanation'],
    esplikasaunDeleteSimuEleitorMate: ['Sample Explanation'],
    esplikasaunKondisaunLaptop: ['Sample Explanation'],
    esplikasaunPrinterKondisaun: ['Sample Explanation'],
    esplikasaunCardSufisiente: ['Sample Explanation'],
    esplikasaunInternetFunsiona: ['Sample Explanation'],
    esplikasaunProblemaLojistika: ['Sample Explanation'],
    supervizor: [null],
    eleitorFounMane: [10],
    eleitorFounFeto: [12],
    kartaunToharMane: [22],
    kartaunToharFeto: [14],
    mudaHelaFatinMane: [93],
    mudaHelaFatinFeto: [40],
    mudaTinanMane: [73],
    mudaTinanFeto: [92],
    kartaunTuanMane: [33],
    kartaunTuanFeto: [51],
    kartaunLakonMane: [21],
    kartaunLakonFeto: [81],
    komentariu: ['Sample'],
    munisipiu: [null]
}

export const reabdForm = {
    id: new FormControl(null),
    postuAdministrativu: new FormControl(null, [Validators.required]),
    orasHahu: [null, Validators.required],
    orasRemata: [null, Validators.required],
    operadorStaeAtendimentuDiak: [null, Validators.required],
    atividadeTuirOrariu: [null, Validators.required],
    prosedimentuLegal: [null, Validators.required],
    ihaEmaEstrajeiru: [null, Validators.required],
    ihaEmaIdadeKiik16: [null, Validators.required],
    kartaunDupla: [null, Validators.required],
    deleteSimuEleitorMate: [null, Validators.required],
    kondisaunLaptop: [null, Validators.required],
    printerKondisaun: [null, Validators.required],
    cardSufisiente: [null, Validators.required],
    internetFunsiona: [null, Validators.required],
    problemaLojistika: [null, Validators.required],
    esplikasaunOperadorStaeAtendimentuDiak: [''],
    esplikasaunAtividadeTuirOrariu: [''],
    esplikasaunProsedimentuLegal: [''],
    esplikasaunIhaEmaEstrajeiru: [''],
    esplikasaunIhaEmaIdadeKiik16: [''],
    esplikasaunKartaunDupla: [''],
    esplikasaunDeleteSimuEleitorMate: [''],
    esplikasaunKondisaunLaptop: [''],
    esplikasaunPrinterKondisaun: [''],
    esplikasaunCardSufisiente: [''],
    esplikasaunInternetFunsiona: [''],
    esplikasaunProblemaLojistika: [''],
    supervizor: ['', [Validators.required]],
    eleitorFounMane: [null],
    eleitorFounFeto: [null],
    kartaunToharMane: [null],
    kartaunToharFeto: [null],
    mudaHelaFatinMane: [null],
    mudaHelaFatinFeto: [null],
    mudaTinanMane: [null],
    mudaTinanFeto: [null],
    kartaunTuanMane: [null],
    kartaunTuanFeto: [null],
    kartaunLakonMane: [null],
    kartaunLakonFeto: [null],
    komentariu: [''],
    munisipiu: [null]
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

