import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getPageDemographicResolver } from 'src/app/core/resolvers/demographic.resolver';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    resolve: {
      demographicList: getPageDemographicResolver
    }
  },
  {
    path: 'new',
    component: FormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicRoutingModule { }
