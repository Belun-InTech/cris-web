import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getDemographicByIdResolver, getPageDemographicResolver } from 'src/app/core/resolvers/demographic.resolver';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { canActivateQueryParams } from 'src/app/core/security/route.guard';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { getCityResolver, getInstitutionResolver, getMaritalStatusResolver } from 'src/app/core/resolvers/data-master.resolver';

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
    component: FormComponent,
    resolve: {
      citiesListResolve: getCityResolver,
      maritalStatusListResolve: getMaritalStatusResolver,
      institutionsListResolve: getInstitutionResolver,
    },
  },
  {
    path: 'upload',
    component: FormUploadComponent
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      demoData: getDemographicByIdResolver,
      citiesListResolve: getCityResolver,
      maritalStatusListResolve: getMaritalStatusResolver,
      institutionsListResolve: getInstitutionResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicRoutingModule { }
