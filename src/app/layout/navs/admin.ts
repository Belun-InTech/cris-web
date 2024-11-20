import { MenuItem } from "primeng/api";


export const adminNavs: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'bi bi-speedometer',
    },
    {
        label: 'File',
        icon: 'pi pi-pw pi-file',
        items: [{
            label: 'New',
            icon: 'pi pi-fw pi-plus',
        },
        { label: 'Open', icon: 'pi pi-fw pi-external-link' },
        { separator: true },
        { label: 'Quit', icon: 'pi pi-fw pi-times' }
        ]
    },
];
