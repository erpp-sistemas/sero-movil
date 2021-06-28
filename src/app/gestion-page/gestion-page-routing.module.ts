import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPagePage } from './gestion-page.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPagePageRoutingModule {}
