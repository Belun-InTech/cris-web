import { MenuItem } from "primeng/api";


export const clientNavs: MenuItem[] = [
    {
        label: 'Home',
        items: [
            {
                label: 'Search',
                icon: 'bi bi-fw bi-search',
                routerLink: ['/search']
            },
        ]
    },
    {
        label: 'Credit Informations & Demographic Data',
        items: [
            {
                label: 'Demographic Data',
                icon: 'bi bi-fw bi-person-vcard',
                items: [
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
