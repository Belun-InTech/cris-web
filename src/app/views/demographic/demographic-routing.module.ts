import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getDemographicByIdResolver, getPageDemographicResolver } from 'src/app/core/resolvers/demographic.resolver';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { canActivateQueryParams } from 'src/app/core/security/route.guard';
import { FormUploadComponent } from './form-upload/form-upload.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [canActivateQueryParams],
    resolve: {
      demographicList: getPageDemographicResolver
    }
  },
  {
    path: 'new',
    component: FormComponent
  },
  {
    path: 'upload',
    component: FormUploadComponent
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      demoData: getDemographicByIdResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicRoutingModule { }
