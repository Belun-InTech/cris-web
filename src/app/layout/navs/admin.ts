import { MenuItem } from "primeng/api";


export const adminNavs: MenuItem[] = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
            {
                label: 'Search',
                icon: 'bi bi-fw bi-search',
                routerLink: ['/search']
            },
            { label: `FAQ's`, icon: 'bi bi-fw bi-person-raised-hand', routerLink: ['/faq'] },
        ]
    },
    {
        label: 'Credit Informations & Demographic Data',
        items: [
            {
                label: 'Demographic',
                icon: 'bi bi-fw bi-person-vcard',
                items: [
                    {
                        label: 'Demographic Data',
                        icon: 'bi bi-fw bi-person-lines-fill',
                        routerLink: ['/demographics'],
                    },
                    {
                        label: 'New (Form)',
                        icon: 'bi bi-fw bi-person-add',
                        routerLink: ['/demographics/new']
                    },
                    {
                        label: 'New (Excel Template)',
                        icon: 'bi bi-fw bi-file-earmark-arrow-up',
                        routerLink: ['/demographics/upload']
                    }
                ]
            },
            {
                label: 'Credit Informations',
                icon: 'bi bi-fw bi-credit-card-2-front',
                items: [
                    {
                        label: 'Credit Data',
                        icon: 'bi bi-fw bi-card-checklist',
                        routerLink: ['/credit-informations']
                    },
                    {
                        label: 'New (Form)',
                        icon: 'bi bi-fw bi-plus-lg',
                        routerLink: ['/credit-informations/new']
                    },
                    {
                        label: 'New (Excel Template)',
                        icon: 'bi bi-fw bi-file-earmark-arrow-up',
                        routerLink: ['/credit-informations/upload']
                    }
                ]
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
            { label: 'User Management', icon: 'pi pi-fw pi-users', routerLink: ['/users'] },
            {
                label: 'Data Master',
                icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Financial Institutions', icon: 'bi bi-fw bi-bank', routerLink: ['/data/financial-institutions'] },
                    { label: 'Sectors', icon: 'bi bi-fw bi-building', routerLink: ['/data/sectors'] },
                    { label: 'Type of Collateral', icon: 'bi bi-fw bi-card-list', routerLink: ['/data/type-of-collaterals'] },
                    { label: 'Credit Classification', icon: 'bi bi-fw bi-card-list', routerLink: ['/data/credit-classifications'] },
                    { label: 'Cities', icon: 'bi bi-fw bi-map', routerLink: ['/data/cities'] },
                    { label: 'Martial Status', icon: 'bi bi-fw bi-list-task', routerLink: ['/data/marital-status'] },
                    { label: 'Manner of Payment', icon: 'bi bi-fw bi-credit-card', routerLink: ['/data/manners'] },
                    { label: 'Frequently Answers & Questions', icon: 'bi bi-fw bi-person-raised-hand', routerLink: ['/data/faqs'] },
                ],
            },
            { label: 'System', icon: 'bi bi-fw bi-gear-wide-connected', routerLink: ['/configurations'] },
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
