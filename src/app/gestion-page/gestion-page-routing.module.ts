import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionCartaPage } from '../gestion-carta/gestion-carta.page';
import { GestionInspeccionAguaPage } from '../gestion-inspeccion-agua/gestion-inspeccion-agua.page';
import { GestionLegalPage } from '../gestion-legal/gestion-legal.page';

import { GestionPagePage } from './gestion-page.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPagePage
  },
  {
    path: '',
    component: GestionInspeccionAguaPage
  },
  {
    path: '',
    component: GestionCartaPage
  },
  {
    path: '',
    component: GestionLegalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPagePageRoutingModule {}
