import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { getAllActivities, getLoginActivities } from 'src/app/core/resolvers/audit.resolver';

const routes: Routes = [
  {
    path: 'activities',
    component: ActivitiesComponent,
    resolve: {
      activitiesResolve: getAllActivities,
    }
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    resolve: {
      loginActivitiesResolve: getLoginActivities
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
