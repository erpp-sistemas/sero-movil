import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncFotosAccionesPage } from './sync-fotos-acciones.page';

const routes: Routes = [
  {
    path: '',
    component: SyncFotosAccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncFotosAccionesPageRoutingModule {}
