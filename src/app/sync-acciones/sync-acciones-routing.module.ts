import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncAccionesPage } from './sync-acciones.page';

const routes: Routes = [
  {
    path: '',
    component: SyncAccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncAccionesPageRoutingModule {}
