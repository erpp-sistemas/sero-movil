import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosPublicosPage } from './servicios-publicos.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPublicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPublicosPageRoutingModule {}
