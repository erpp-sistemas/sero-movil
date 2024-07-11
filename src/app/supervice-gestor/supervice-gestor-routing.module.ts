import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperviceGestorPage } from './supervice-gestor.page';

const routes: Routes = [
  {
    path: '',
    component: SuperviceGestorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperviceGestorPageRoutingModule {}
