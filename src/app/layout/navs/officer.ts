import { MenuItem } from "primeng/api";


export const officerNavs: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'bi bi-speedometer',
    },
    {
        label: 'Keixa',
        icon: 'bi bi-card-text',
        items: [{
            label: 'New',
            icon: 'pi pi-fw pi-plus',
        },
        ]
    },
];
