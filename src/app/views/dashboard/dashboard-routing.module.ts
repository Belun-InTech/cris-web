import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getDashboardDataResolver } from 'src/app/core/resolvers/dashboard.resolver';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: DashboardComponent,
            resolve: {
                dashboardResolve: getDashboardDataResolver
            }
        }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
