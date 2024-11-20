import { MenuItem } from "primeng/api";


export const managerNavs: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'bi bi-speedometer',
        routerLink: '/funsionariu/dashboard'
    },
    {
        label: 'Keixa',
        icon: 'bi bi-card-text',
        items: [
            {
                label: 'Lista',
                icon: 'bi bi-table',
                routerLink: '/funsionariu/keixa/lista'
            },
            {
                label: 'Foun',
                icon: 'bi bi-clipboard2-plus',
                routerLink: '/funsionariu/keixa/foun'
            },
        ]
    },
];
