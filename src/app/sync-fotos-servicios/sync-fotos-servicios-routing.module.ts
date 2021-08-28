import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncFotosServiciosPage } from './sync-fotos-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: SyncFotosServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncFotosServiciosPageRoutingModule {}
