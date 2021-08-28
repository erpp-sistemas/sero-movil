import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarServiciosPage } from './sincronizar-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarServiciosPageRoutingModule {}
