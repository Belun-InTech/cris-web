import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { getRoleListResolver } from 'src/app/core/resolvers/role.resolver';
import { getUserByUsernameResolver } from 'src/app/core/resolvers/utilizador.resolver';
import { getFinancialInstitutionListResolver } from 'src/app/core/resolvers/data-master.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'form',
    component: FormComponent,
    resolve: {
      roleList: getRoleListResolver,
      financialInstitutionList: getFinancialInstitutionListResolver,
    }
  },
  {
    path: ':username',
    component: FormComponent,
    resolve: {
      roleList: getRoleListResolver,
      userData: getUserByUsernameResolver,
      financialInstitutionList: getFinancialInstitutionListResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
