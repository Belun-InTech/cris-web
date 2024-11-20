import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private swUpdate: SwUpdate) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.checkForNewVersion();
    }

    private checkForNewVersion = async () => {
        try {
            // Check if Service Worker is supported by the Browser
            if (this.swUpdate.isEnabled) {

                // Check if new version is available
                const isNewVersion = await this.swUpdate.checkForUpdate();
                if (isNewVersion) {
                    // Check if new version is activated
                    const isNewVersionActivated = await this.swUpdate.activateUpdate();

                    // Reload the application with new version if new version is activated
                    if (isNewVersionActivated) window.location.reload();
                }
            }
        } catch (error) {
            window.location.reload();
        }
    };
}
