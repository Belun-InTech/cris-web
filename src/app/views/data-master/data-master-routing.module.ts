import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getCityResolver, getCreditClassificationListResolver, getFaqListResolver, getFinancialInstitutionListResolver, getMannerOfPaymentResolver, getMaritalStatusResolver, getSearchingFeesResolver, getSectorListResolver, getTypeCollateralListResolver } from 'src/app/core/resolvers/data-master.resolver';
import { DataMasterComponent } from './data-master/data-master.component';

const routes: Routes = [
  {
    path: 'financial-institutions',
    component: DataMasterComponent,
    resolve: {
      financialInstitutionListResolve: getFinancialInstitutionListResolver,
    },
    data: {
      type: 'financial-institutions'
    },
  },
  {
    path: 'sectors',
    component: DataMasterComponent,
    resolve: {
      sectorListResolve: getSectorListResolver,
    },
    data: {
      type: 'sectors'
    },
  },
  {
    path: 'type-of-collaterals',
    component: DataMasterComponent,
    resolve: {
      typeCollateralsListResolve: getTypeCollateralListResolver,
    },
    data: {
      type: 'type-collaterals'
    },
  },
  {
    path: 'credit-classifications',
    component: DataMasterComponent,
    resolve: {
      creditClassificationListResolve: getCreditClassificationListResolver,
    },
    data: {
      type: 'credit-classifications'
    },
  },
  {
    path: 'faqs',
    component: DataMasterComponent,
    resolve: {
      faqListResolve: getFaqListResolver,
    },
    data: {
      type: 'faqs'
    },
  },
  {
    path: 'cities',
    component: DataMasterComponent,
    resolve: {
      citiesListResolve: getCityResolver,
    },
    data: {
      type: 'cities'
    },
  },
  {
    path: 'manners',
    component: DataMasterComponent,
    resolve: {
      mannersListResolve: getMannerOfPaymentResolver,
    },
    data: {
      type: 'manners'
    },
  },
  {
    path: 'marital-status',
    component: DataMasterComponent,
    resolve: {
      maritalStatusListResolve: getMaritalStatusResolver,
    },
    data: {
      type: 'marital-status'
    },
  },
  {
    path: 'searching-fees',
    component: DataMasterComponent,
    resolve: {
      searchingFeesResolve: getSearchingFeesResolver,
    },
    data: {
      type: 'fees'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataMasterRoutingModule { }
