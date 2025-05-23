import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/core/models/enum';
import { getCreditByIdResolver, getPageCreditResolver } from 'src/app/core/resolvers/credit.resolver';
import { getCityResolver, getCreditClassificationListResolver, getFinancialInstitutionListResolver, getMannerOfPaymentResolver, getSectorListResolver, getTypeCollateralListResolver } from 'src/app/core/resolvers/data-master.resolver';
import { canActivateByRole, canActivateQueryParams } from 'src/app/core/security/route.guard';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [canActivateQueryParams, canActivateByRole],
    resolve: {
      creditList: getPageCreditResolver
    },
    data: {
      role: [Role.admin, Role.staff]
    }
  },
  {
    path: 'new',
    component: FormComponent,
    resolve: {
      grantorListResolve: getFinancialInstitutionListResolver,
      sectorListResolve: getSectorListResolver,
      mannerListResolve: getMannerOfPaymentResolver,
      typeCollateralListResolve: getTypeCollateralListResolver,
      creditClassificationListResolve: getCreditClassificationListResolver,
      citiesListResolve: getCityResolver,
    },
  },
  {
    path: 'upload',
    component: FormUploadComponent,
    resolve: {
      grantorListResolve: getFinancialInstitutionListResolver,
      sectorListResolve: getSectorListResolver,
      mannerListResolve: getMannerOfPaymentResolver,
      typeCollateralListResolve: getTypeCollateralListResolver,
      creditClassificationListResolve: getCreditClassificationListResolver,
      citiesListResolve: getCityResolver,
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      creditResolve: getCreditByIdResolver,
      grantorListResolve: getFinancialInstitutionListResolver,
      sectorListResolve: getSectorListResolver,
      mannerListResolve: getMannerOfPaymentResolver,
      typeCollateralListResolve: getTypeCollateralListResolver,
      creditClassificationListResolve: getCreditClassificationListResolver,
      citiesListResolve: getCityResolver,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditInfoRoutingModule { }
