import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncEncuestasPage } from './sync-encuestas.page';

const routes: Routes = [
  {
    path: '',
    component: SyncEncuestasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncEncuestasPageRoutingModule {}
