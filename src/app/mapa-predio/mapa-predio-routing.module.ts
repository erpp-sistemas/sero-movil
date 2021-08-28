import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaPredioPage } from './mapa-predio.page';

const routes: Routes = [
  {
    path: '',
    component: MapaPredioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaPredioPageRoutingModule {}
