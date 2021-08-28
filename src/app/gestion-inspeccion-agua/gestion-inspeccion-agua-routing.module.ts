import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionInspeccionAguaPage } from './gestion-inspeccion-agua.page';

const routes: Routes = [
  {
    path: '',
    component: GestionInspeccionAguaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionInspeccionAguaPageRoutingModule {}
