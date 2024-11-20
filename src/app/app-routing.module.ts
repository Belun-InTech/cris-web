import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { FaqComponent } from './views/faq/faq.component';
import { LoginComponent } from './views/login/login.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: LoginComponent,
                // canActivate: [loginGuard],
            },
            {
                path: 'admin', component: AppLayoutComponent,
                // canActivate: [authenticationCanActivate],
                children: [
                    { path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'faq', component: FaqComponent },
                    { path: 'demographics', loadChildren: () => import('./views/demographic/demographic.module').then(m => m.DemographicModule) },
                    { path: 'credit-informations', loadChildren: () => import('./views/credit-info/credit-info.module').then(m => m.CreditInfoModule) },
                    { path: 'relatoriu', loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule) },
                    { path: 'users', loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule) },
                    { path: 'data', loadChildren: () => import('./views/data-master/data-master.module').then(m => m.DataMasterModule) },
                    { path: 'audit', loadChildren: () => import('./views/audit/audit.module').then(m => m.AuditModule) },
                    { path: '**', redirectTo: '/admin/dashboard' },
                ]
            },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
