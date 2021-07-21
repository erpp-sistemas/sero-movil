import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionLegalPage } from './gestion-legal.page';

const routes: Routes = [
  {
    path: '',
    component: GestionLegalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionLegalPageRoutingModule {}
