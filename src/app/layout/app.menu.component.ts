import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../core/services';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];
    setting: MenuItem[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthenticationService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
                    { label: `FAQ's`, icon: 'bi bi-fw bi-person-raised-hand', routerLink: ['/admin/faq'] },
                ]
            },
            {
                label: 'Credit Informations & Demographic Data',
                items: [
                    {
                        label: 'Demographic Data',
                        icon: 'bi bi-fw bi-person-vcard',
                        routerLink: ['/admin/demographics'],
                    },
                    {
                        label: 'Credit Informations',
                        icon: 'bi bi-fw bi-credit-card-2-front',
                        routerLink: ['/admin/credit-informations']
                    },
                    {
                        label: 'Reports',
                        icon: 'bi bi-fw bi-bar-chart-line',
                        routerLink: ['/admin/relatoriu/form']
                    },

                ]
            },
            {
                label: 'Settings',
                items: [
                    { label: 'User Management', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] },
                    {
                        label: 'Data Master',
                        icon: 'pi pi-fw pi-database',
                        items: [
                            { label: 'Banks', icon: 'bi bi-fw bi-bank', routerLink: ['/admin/data/bank'] },
                            { label: 'Sectors', icon: 'bi bi-fw bi-building', routerLink: ['/admin/data/sectors'] },
                            { label: 'Type of Collateral', icon: 'bi bi-fw bi-card-list', routerLink: ['/admin/data/type-of-collateral'] },
                            { label: 'Credit Classification', icon: 'bi bi-fw bi-card-list', routerLink: ['/admin/data/credit-classification'] },
                            { label: 'Gender', icon: 'bi bi-fw bi-gender-ambiguous', routerLink: ['/admin/data/gender'] },
                        ],
                    },
                    { label: 'System', icon: 'bi bi-fw bi-gear-wide-connected', routerLink: ['/admin/data/sistema'] },
                ]
            },
            {
                label: 'Audit Logs',
                icon: 'pi pi-fw pi-file',
                items: [
                    { label: 'Activities Log', icon: 'bi bi-fw bi-activity', routerLink: ['/admin/audit/activities'] },
                    { label: 'Authentication Log', icon: 'bi bi-fw bi-fingerprint', routerLink: ['/admin/audit/authentication'] }
                ]
            }
        ];

        this.setting = [
            {
                label: 'Settings',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/admin/profile'] },
                    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.authService.logout() }
                ]
            },
        ]
    }
}
