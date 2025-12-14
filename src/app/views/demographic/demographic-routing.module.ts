import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permission, Role } from 'src/app/core/models/enum';
import { getBeneficiaryListResolver, getCityResolver, getMaritalStatusResolver } from 'src/app/core/resolvers/data-master.resolver';
import { getDemographicByIdResolver, getPageDemographicResolver } from 'src/app/core/resolvers/demographic.resolver';
import { canActivateByRole, canActivateQueryParams } from 'src/app/core/security/route.guard';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { canActivateByPermission } from 'src/app/core/security/permission.guard';

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
      beneficiaryListResolve: getBeneficiaryListResolver
    },
    canActivate: [canActivateByPermission],
    data: { requiredPermission: Permission.MENU_DEMOGRAPHIC_NEW }
  },
  {
    path: 'upload',
    component: FormUploadComponent,
    resolve: {
      citiesListResolve: getCityResolver,
      maritalStatusListResolve: getMaritalStatusResolver,
      beneficiaryListResolve: getBeneficiaryListResolver
    },
    canActivate: [canActivateByPermission],
    data: { requiredPermission: Permission.MENU_DEMOGRAPHIC_NEW },
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      demoData: getDemographicByIdResolver,
      citiesListResolve: getCityResolver,
      maritalStatusListResolve: getMaritalStatusResolver,
      beneficiaryListResolve: getBeneficiaryListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicRoutingModule { }
