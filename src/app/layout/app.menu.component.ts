import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Role } from '../core/models/enum';
import { AuthenticationService } from '../core/services';
import { adminNavs } from './navs/admin';
import { clientNavs } from './navs/client';
import { staffNavs } from './navs/staff';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];
    setting: MenuItem[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthenticationService) {
        this.setMenuByUserRole(
            this.authService.currentRole
        );
    }

    setMenuByUserRole(role: string): void {
        switch (role) {
            case Role.admin:
                this.model = adminNavs;
                break;
            case Role.staff:
                this.model = staffNavs;
                break;
            case Role.client:
                this.model = clientNavs;
                break;
        }
    }

    ngOnInit() {
        this.setting = [
            {
                label: 'Settings',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
                    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.authService.logout() }
                ]
            },
        ]
    }
}
