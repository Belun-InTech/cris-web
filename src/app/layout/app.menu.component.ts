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

    }

    ngOnInit() {
        this.setMenuByUserRole(
            this.authService.currentRole
        );

        this.model = this.applyPermissionVisibility(this.model);

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

    private setMenuByUserRole(role: string): void {
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

    /**
     * Recursively sets item.visible based on requiredPermission metadata.
     * Keeps group containers but hides leaf actions if not permitted.
     */
    private applyPermissionVisibility(items: MenuItem[]): MenuItem[] {
        const markVisible = (item: any): any => {
            const required = item.requiredPermission as string | string[] | undefined;
            const allowed =
                !required
                    ? true
                    : Array.isArray(required)
                        ? this.authService.hasAnyPermission(required)
                        : this.authService.hasPermission(required);

            // For leaf nodes
            if (!item.items || item.items.length === 0) {
                return { ...item, visible: allowed };
            }

            // For groups with children: evaluate children, keep parent visible if any child visible
            const children = (item.items as MenuItem[]).map(markVisible);
            const anyChildVisible = children.some((c: any) => c.visible !== false);
            return { ...item, items: children, visible: anyChildVisible };
        };

        return items.map(markVisible);
    }

}
