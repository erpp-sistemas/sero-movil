import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarPredioPage } from './sincronizar-predio.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarPredioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarPredioPageRoutingModule {}
