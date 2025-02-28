import { MenuItem } from "primeng/api";


export const staffNavs: MenuItem[] = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
            { label: `FAQ's`, icon: 'bi bi-fw bi-person-raised-hand', routerLink: ['/faq'] },
        ]
    },
    {
        label: 'Credit Informations & Demographic Data',
        items: [
            {
                label: 'Demographic Data',
                icon: 'bi bi-fw bi-person-vcard',
                routerLink: ['/demographics'],
            },
            {
                label: 'Credit Informations',
                icon: 'bi bi-fw bi-credit-card-2-front',
                routerLink: ['/credit-informations']
            },
            {
                label: 'Reports',
                icon: 'bi bi-fw bi-bar-chart-line',
                routerLink: ['/reports/form']
            },
        ]
    },
    {
        label: 'Settings',
        items: [
            {
                label: 'Data Master',
                icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Financial Institutions', icon: 'bi bi-fw bi-bank', routerLink: ['/data/financial-institutions'] },
                    { label: 'Sectors', icon: 'bi bi-fw bi-building', routerLink: ['/data/sectors'] },
                    { label: 'Type of Collateral', icon: 'bi bi-fw bi-card-list', routerLink: ['/data/type-of-collaterals'] },
                    { label: 'Credit Classification', icon: 'bi bi-fw bi-card-list', routerLink: ['/data/credit-classifications'] },
                    { label: 'Frequently Answers & Questions', icon: 'bi bi-fw bi-person-raised-hand', routerLink: ['/data/faqs'] },
                ],
            },
        ]
    },
    {
        label: 'Audit Logs',
        icon: 'pi pi-fw pi-file',
        items: [
            { label: 'Activities Log', icon: 'bi bi-fw bi-activity', routerLink: ['/audit/activities'] },
            { label: 'Authentication Log', icon: 'bi bi-fw bi-fingerprint', routerLink: ['/audit/authentication'] }
        ]
    }
];
