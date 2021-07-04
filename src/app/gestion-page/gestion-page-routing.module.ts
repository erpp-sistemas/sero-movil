import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';

import { GestionPagePage } from './gestion-page.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPagePage
  },
  {
    path: '',
    component: GestionInspeccionAguaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPagePageRoutingModule {}
