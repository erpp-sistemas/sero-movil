import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionInspeccionPredioPage } from './gestion-inspeccion-predio.page';

const routes: Routes = [
  {
    path: '',
    component: GestionInspeccionPredioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionInspeccionPredioPageRoutingModule {}
