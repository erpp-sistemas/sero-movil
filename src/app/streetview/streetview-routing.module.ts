import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StreetviewPage } from './streetview.page';

const routes: Routes = [
  {
    path: '',
    component: StreetviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreetviewPageRoutingModule {}
