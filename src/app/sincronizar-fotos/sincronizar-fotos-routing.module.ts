import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarFotosPage } from './sincronizar-fotos.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarFotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarFotosPageRoutingModule {}
