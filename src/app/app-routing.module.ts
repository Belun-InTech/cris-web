import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from './core/models/enum';
import { getEmailConfigResolver, getLdapConfigResolver } from './core/resolvers/config.resolver';
import { getFaqListResolver } from './core/resolvers/data-master.resolver';
import { getTokenActivationResolver } from './core/resolvers/utilizador.resolver';
import { authenticationCanActivate, canActivateByRole, loginGuard, validateGuard } from './core/security/route.guard';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ActivationComponent } from './views/activation/activation.component';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { SearchComponent } from './views/demographic/search/search.component';
import { FaqComponent } from './views/faq/faq.component';
import { LoginComponent } from './views/login/login.component';
import { OtpComponent } from './views/otp/otp.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: LoginComponent,
                canActivate: [loginGuard],
            },
            {
                path: 'otp',
                component: OtpComponent,
                canActivate: [validateGuard],
            },
            {
                path: 'activate',
                component: ActivationComponent,
                resolve: {
                    tokenResolve: getTokenActivationResolver
                }
            },
            {
                path: '',
                component: AppLayoutComponent,
                canActivateChild: [authenticationCanActivate],
                children: [
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
                        canActivate: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff]
                        }
                    },
                    {
                        path: 'faq',
                        component: FaqComponent,
                        resolve: {
                            faqListResolve: getFaqListResolver,
                        }
                    },
                    {
                        path: 'search',
                        component: SearchComponent,
                        canActivate: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff, Role.client]
                        }
                    },
                    {
                        path: 'demographics',
                        loadChildren: () => import('./views/demographic/demographic.module').then(m => m.DemographicModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff, Role.client]
                        }
                    },
                    {
                        path: 'credit-informations',
                        loadChildren: () => import('./views/credit-info/credit-info.module').then(m => m.CreditInfoModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff, Role.client]
                        }
                    },
                    {
                        path: 'reports',
                        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff]
                        }
                    },
                    {
                        path: 'users',
                        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin]
                        }
                    },
                    {
                        path: 'configurations',
                        component: ConfigurationComponent,
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin]
                        },
                        resolve: {
                            emailConfigResolve: getEmailConfigResolver,
                            ldapConfigResolve: getLdapConfigResolver,
                        }
                    },
                    {
                        path: 'data',
                        loadChildren: () => import('./views/data-master/data-master.module').then(m => m.DataMasterModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff]
                        }
                    },
                    {
                        path: 'audit',
                        loadChildren: () => import('./views/audit/audit.module').then(m => m.AuditModule),
                        canActivateChild: [canActivateByRole],
                        data: {
                            role: [Role.admin, Role.staff, Role.client]
                        }
                    },
                    { path: '**', redirectTo: '/dashboard' },
                ]
            },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
