import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarGestionesPage } from './sincronizar-gestiones.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarGestionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarGestionesPageRoutingModule {}
