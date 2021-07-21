import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionCartaPage } from './gestion-carta.page';

const routes: Routes = [
  {
    path: '',
    component: GestionCartaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionCartaPageRoutingModule {}
