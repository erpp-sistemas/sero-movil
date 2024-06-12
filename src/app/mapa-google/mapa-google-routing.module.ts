import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaPruebaPage } from './mapa-google.page';

const routes: Routes = [
  {
    path: '',
    component: MapaPruebaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaPruebaPageRoutingModule {}
