import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarAguaPage } from './sincronizar-agua.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarAguaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarAguaPageRoutingModule {}
