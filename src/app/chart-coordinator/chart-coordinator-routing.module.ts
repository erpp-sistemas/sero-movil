import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartCoordinatorPage } from './chart-coordinator.page';

const routes: Routes = [
  {
    path: '',
    component: ChartCoordinatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartCoordinatorPageRoutingModule {}
