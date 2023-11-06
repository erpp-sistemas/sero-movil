import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecturaMedidorPage } from './lectura-medidor.page';

const routes: Routes = [
  {
    path: '',
    component: LecturaMedidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturaMedidorPageRoutingModule {}
