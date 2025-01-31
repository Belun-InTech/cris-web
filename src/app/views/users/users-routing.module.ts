import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { getRoleListResolver } from 'src/app/core/resolvers/role.resolver';
import { getUserByUsernameResolver } from 'src/app/core/resolvers/utilizador.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'form',
    component: FormComponent,
    resolve: {
      roleList: getRoleListResolver
    }
  },
  {
    path: ':username',
    component: FormComponent,
    resolve: {
      roleList: getRoleListResolver,
      userData: getUserByUsernameResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
