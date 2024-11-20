import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { AuthenticationComponent } from './authentication/authentication.component';

const routes: Routes = [
  {
    path: 'activities',
    component: ActivitiesComponent
  },
  {
    path: 'authentication',
    component: AuthenticationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
