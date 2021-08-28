import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoCuentasPage } from './listado-cuentas.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoCuentasPage,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoCuentasPageRoutingModule {}
