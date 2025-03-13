import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getDemographicByIdResolver, getPageDemographicResolver } from 'src/app/core/resolvers/demographic.resolver';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { canActivateByRole, canActivateQueryParams } from 'src/app/core/security/route.guard';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { getCityResolver, getInstitutionResolver, getMaritalStatusResolver } from 'src/app/core/resolvers/data-master.resolver';
import { Role } from 'src/app/core/models/enum';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [canActivateQueryParams, canActivateByRole],
    resolve: {
      demographicList: getPageDemographicResolver
    },
    data: {
      role: [Role.admin, Role.staff]
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
    component: FormUploadComponent,
    resolve: {
      citiesListResolve: getCityResolver,
      maritalStatusListResolve: getMaritalStatusResolver,
      institutionsListResolve: getInstitutionResolver,
    },
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
