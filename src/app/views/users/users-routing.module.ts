import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getFinancialInstitutionListResolver } from 'src/app/core/resolvers/data-master.resolver';
import { getRoleListResolver } from 'src/app/core/resolvers/role.resolver';
import { getPageUserResolver, getUserByUsernameResolver } from 'src/app/core/resolvers/utilizador.resolver';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    resolve: {
      pageUserResolve: getPageUserResolver,
      financialInstitutionList: getFinancialInstitutionListResolver,
    }
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
