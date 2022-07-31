import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaLeafletPage } from './mapa-leaflet.page';

const routes: Routes = [
  {
    path: '',
    component: MapaLeafletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaLeafletPageRoutingModule {}
