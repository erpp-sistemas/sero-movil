import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BotonPanicoPage } from './boton-panico.page';

const routes: Routes = [
  {
    path: '',
    component: BotonPanicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BotonPanicoPageRoutingModule {}
