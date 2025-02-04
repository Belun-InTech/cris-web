import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataMasterComponent } from './data-master/data-master.component';
import { getBankListResolver, getCreditClassificationListResolver, getFaqListResolver, getSectorListResolver, getTypeCollateralListResolver } from 'src/app/core/resolvers/data-master.resolver';

const routes: Routes = [
  {
    path: 'banks',
    component: DataMasterComponent,
    resolve: {
      bankListResolve: getBankListResolver,
    },
    data: {
      type: 'banks'
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataMasterRoutingModule { }
