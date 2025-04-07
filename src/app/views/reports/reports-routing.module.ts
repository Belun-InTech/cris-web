import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { getCityResolver, getCreditClassificationListResolver, getFinancialInstitutionListResolver, getSectorListResolver } from 'src/app/core/resolvers/data-master.resolver';

const routes: Routes = [
  {
    path: 'form',
    component: FormComponent,
    resolve: {
      citiesListResolve: getCityResolver,
      financialInstitutionListResolve: getFinancialInstitutionListResolver,
      sectorListResolve: getSectorListResolver,
      creditClassificationListResolve: getCreditClassificationListResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
