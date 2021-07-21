import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarAntenasPage } from './sincronizar-antenas.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarAntenasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarAntenasPageRoutingModule {}
