import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../core/services';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: 'Profile',
                icon: 'pi pi-cog'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.logOut()
            }
        ];
    }

    logOut(): void {
        this.authService.logout().subscribe();
        this.router.navigateByUrl('').then();
    }
}
